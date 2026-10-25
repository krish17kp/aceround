from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile, os, numpy as np, librosa
from langdetect import detect
from faster_whisper import WhisperModel
from transformers import pipeline

# --- init models once ---
asr = WhisperModel("medium", compute_type="int8")  # "small" for CPU-only; "medium"/"large-v3" if you have GPU
sentiment = pipeline("sentiment-analysis",
                     model="cardiffnlp/twitter-xlm-roberta-base-sentiment")   # multilingual (-1..+1 later)
emotion = pipeline("text-classification",
                   model="j-hartmann/emotion-english-distilroberta-base",  # good general model
                   return_all_scores=True, truncation=True)

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_headers=["*"], allow_methods=["*"])

class AnalysisResponse(BaseModel):
    language: str
    transcript: str
    sentiment_label: str
    sentiment_score: float
    emotions: dict
    prosody: dict

def _normalize_sentiment_label(lbl: str) -> str:
    # xlm-roberta labels are typically "positive"/"neutral"/"negative"
    return lbl.capitalize()

def speech_prosody(y, sr):
    # Basic tone features: pitch (F0), energy, speaking rate
    # Energy
    rms = float(np.mean(librosa.feature.rms(y=y)))
    # Pitch (very rough): use piptrack median
    S = np.abs(librosa.stft(y))
    pitches, mags = librosa.piptrack(S=S, sr=sr)
    pitch_vals = pitches[mags > np.median(mags)]
    f0 = float(np.median(pitch_vals)) if pitch_vals.size else 0.0
    # Speaking rate (very rough proxy): syllable-like peaks
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    peaks = librosa.util.peak_pick(onset_env, 5,5,5,5,0.5,5)
    dur_sec = len(y)/sr
    spk_rate = float(len(peaks)/dur_sec) if dur_sec>0 else 0.0
    return {"pitch_hz": f0, "energy_rms": rms, "speaking_rate_events_per_s": spk_rate, "duration_s": dur_sec}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(file: UploadFile = File(...)):
    # Save temp
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[-1]) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # ASR
    segments, info = asr.transcribe(tmp_path, beam_size=5)
    transcript = "".join([seg.text for seg in segments]).strip()
    if not transcript:
        transcript = ""

    # Language (from whisper or fallback)
    language = info.language if info and info.language else (detect(transcript) if transcript else "unknown")

    # Sentiment (map to [-1, 1])
    if transcript:
        s_out = sentiment(transcript)[0]
        label = _normalize_sentiment_label(s_out["label"])
        raw_score = float(s_out["score"])
        # heuristic: Positive -> +score, Negative -> -score, Neutral -> 0
        score = raw_score if label=="Positive" else (-raw_score if label=="Negative" else 0.0)
    else:
        label, score = "Neutral", 0.0

    # Emotion distribution
    emo_scores = {}
    if transcript:
        e_out = emotion(transcript)[0]  # list of {label, score}
        emo_scores = {x["label"]: float(x["score"]) for x in e_out}

    # Prosody from audio
    y, sr = librosa.load(tmp_path, sr=16000, mono=True)
    pros = speech_prosody(y, sr)

    os.remove(tmp_path)
    return AnalysisResponse(
        language=language,
        transcript=transcript,
        sentiment_label=label,
        sentiment_score=score,
        emotions=emo_scores,
        prosody=pros,
    )
