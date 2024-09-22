import librosa
import numpy as np
from scipy.spatial.distance import cosine
from pathlib import Path
import sys
import json
import moviepy.editor as mp
import os

def preprocess_audio(file_path):
    try:
        # Load the audio file with librosa
        y, sr = librosa.load(file_path, sr=16000, mono=True)
        return y
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return None

def extract_features(audio_array):
    # Extract MFCC features from the audio array
    mfccs = librosa.feature.mfcc(y=audio_array, sr=16000, n_mfcc=13)
    mfccs_mean = np.mean(mfccs, axis=1)
    return mfccs_mean

def convert_video_to_audio(video_path):
    try:
        # Convert Path object to string before passing to moviepy
        video = mp.VideoFileClip(str(video_path))
        # Extract the audio and save it as an mp3 file
        audio_path = video_path.with_suffix('.mp3')
        # Suppress moviepy output by setting verbose=False
        video.audio.write_audiofile(str(audio_path), codec='mp3', verbose=False, logger=None)
        return audio_path
    except Exception as e:
        print(f"Error converting video to audio: {e}")
        return None

def match_audio(input_audio_path, dataset_dir):
    # Allow only wav and mp3 file formats
    audio_files = list(Path(dataset_dir).rglob("*.wav")) + list(Path(dataset_dir).rglob("*.mp3"))

    embeddings = []
    file_names = []

    for audio_file in audio_files:
        audio_array = preprocess_audio(str(audio_file))
        if audio_array is not None:
            features = extract_features(audio_array)
            embeddings.append(features)
            file_names.append(audio_file.name)

    embeddings = np.array(embeddings)

    # Check if the input file is a video, and convert to mp3 if necessary
    input_path = Path(input_audio_path)
    if input_path.suffix in ['.mp4', '.avi', '.mov']:
        input_audio_path = convert_video_to_audio(input_path)
    
    input_audio_array = preprocess_audio(str(input_audio_path))
    if input_audio_array is None:
        return []

    input_features = extract_features(input_audio_array)

    similarities = [1 - cosine(input_features, embed) for embed in embeddings]

    top_5_indices = np.argsort(similarities)[-5:][::-1]

    top_5_matches = [{"file": file_names[idx], "similarity": float(similarities[idx])} for idx in top_5_indices]
    return top_5_matches

if __name__ == "__main__":
    input_audio_path = sys.argv[1]
    dataset_dir = sys.argv[2]

    matches = match_audio(input_audio_path, dataset_dir)
    print(json.dumps(matches, indent=2))
