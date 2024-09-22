import sys
import librosa
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import torch

# Set the path to your local model directory
model_directory = 'Z:/LinguaVault/Inotech/models/transcription/Transcriptionmodel'  # Replace with your actual model directory

# Load the processor and the model from the local directory
processor = WhisperProcessor.from_pretrained(model_directory)
model = WhisperForConditionalGeneration.from_pretrained(model_directory).to("cuda" if torch.cuda.is_available() else "cpu")

# Define the function for transcribing audio
def transcribe_audio(audio_path):
    # Load the audio file using librosa
    waveform, sample_rate = librosa.load(audio_path, sr=16000)

    # If needed, split the waveform into chunks
    max_length_in_seconds = 30  # Adjust this based on your needs
    chunk_length = max_length_in_seconds * 16000  # 16000 is the sampling rate

    chunks = [waveform[i:i + chunk_length] for i in range(0, len(waveform), chunk_length)]

    full_transcription = []

    for chunk in chunks:
        input_features = processor(chunk, return_tensors="pt", sampling_rate=16000).input_features.to("cuda" if torch.cuda.is_available() else "cpu")

        with torch.no_grad():
            predicted_ids = model.generate(input_features)

        transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
        full_transcription.append(transcription)

    final_transcription = " ".join(full_transcription)
    return final_transcription

# Get the audio file path from command-line arguments
if len(sys.argv) != 2:
    print("Usage: python transcription.py <audio_path>")
    sys.exit(1)

audio_path = sys.argv[1]


# Transcribe the audio
final_transcription = transcribe_audio(audio_path)

# Print the final transcription
print(final_transcription)
