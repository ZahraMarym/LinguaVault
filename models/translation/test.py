import sys
import re
import os
import codecs
from transformers import MBartForConditionalGeneration, MBart50TokenizerFast

# Set the default encoding to UTF-8
sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

# Load the model and tokenizer
model_path = "Z:/LinguaVault/Inotech/models/translation/TranslationModels"
model = MBartForConditionalGeneration.from_pretrained(model_path)
tokenizer = MBart50TokenizerFast.from_pretrained(model_path)

target_lang = "ur_PK"
tokenizer.src_lang = "en_XX"

def translate_text(text_to_translate):
    sentences = re.split(r'(?<=[.!?])\s+', text_to_translate.strip())
    translated_sentences = []

    for sentence in sentences:
        encoded_input = tokenizer(sentence, return_tensors="pt", truncation=True, padding=True)
        generated_tokens = model.generate(**encoded_input, forced_bos_token_id=tokenizer.lang_code_to_id[target_lang])
        translated_sentence = tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]
        translated_sentences.append(translated_sentence)

    full_translation = ' '.join(translated_sentences)
    return full_translation

if __name__ == '__main__':
    text_to_translate = sys.argv[1]
    print(translate_text(text_to_translate))
