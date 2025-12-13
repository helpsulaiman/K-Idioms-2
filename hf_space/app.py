import gradio as gr
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import torch
import librosa
import numpy as np

# Load Model
MODEL_ID = "helpsulaiman/kashmiri-wav2vec2"
print(f"Loading model: {MODEL_ID}")
processor = Wav2Vec2Processor.from_pretrained(MODEL_ID)
model = Wav2Vec2ForCTC.from_pretrained(MODEL_ID)

print("Model loaded!")

def transcribe(audio_path):
    if audio_path is None:
        return "No audio provided"
    
    try:
        # Load audio (resample to 16kHz)
        speech_array, sr = librosa.load(audio_path, sr=16000)
        
        # Preprocess
        inputs = processor(
            speech_array, 
            sampling_rate=16000, 
            return_tensors="pt", 
            padding=True
        )
        
        # Inference
        with torch.no_grad():
            logits = model(inputs.input_values).logits
            
        # Decode
        predicted_ids = torch.argmax(logits, dim=-1)
        transcription = processor.batch_decode(predicted_ids)[0]
        
        print(f"Transcription: {transcription}")
        return transcription
        
    except Exception as e:
        print(f"Error: {e}")
        return f"Error: {str(e)}"

# Create Interface
iface = gr.Interface(
    fn=transcribe,
    inputs=gr.Audio(type="filepath"),
    outputs="text",
    title="Kashmiri ASR",
    description="Automatic Speech Recognition for Kashmiri Language"
)

# Launch
iface.launch()
