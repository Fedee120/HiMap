import re
import json
import os
from sentence_transformers import SentenceTransformer
from multiprocessing import Pool, cpu_count
from tqdm import tqdm

global_model = None

def init_worker():
    global global_model
    global_model = SentenceTransformer('multi-qa-MiniLM-L6-cos-v1')

def vectorize_summary(summary):
    global global_model
    return global_model.encode(summary).tolist()


def extract_data_from_file(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        content = file.read()
        pattern = r'\[\[(.*?)\]\]\n\nCATEGORIES: (.*?)\n\n(.*?)(?=\[\[|\Z)'
        matches = re.findall(pattern, content, re.DOTALL)
        return [{'title': m[0], 'categories': m[1], 'summary': m[2]} for m in matches]

def process_file(filename):
    existing_data = load_temp_results(filename)
    if existing_data:
        return existing_data
    processed_data = [process_data(entry) for entry in extract_data_from_file(filename)]
    save_temp_results(filename, processed_data)
    return processed_data

def process_data(entry):
    entry['vector'] = vectorize_summary(entry['summary'])
    return entry

def save_temp_results(filename, data):
    base_name = os.path.basename(filename)
    temp_file = os.path.join('data', 'processed', base_name + '.json')
    os.makedirs(os.path.dirname(temp_file), exist_ok=True)
    with open(temp_file, 'w') as outfile:
        json.dump(data, outfile)

def load_temp_results(filename):
    base_name = os.path.basename(filename)
    temp_file = os.path.join('data', 'processed', base_name + '.json')
    if os.path.exists(temp_file):
        try:
            with open(temp_file, 'r') as infile:
                return json.load(infile)
        except (json.JSONDecodeError, IOError):
            return None
    return None

if __name__ == "__main__":
    directory = 'E:\Wikidump\summary'
    files = [os.path.join(directory, f'enwiki-20211020-pages-articles-multistream.xml-{i}.txt') for i in range(1, 83)]

    # Use multiprocessing
    with Pool(processes=6, initializer=init_worker) as pool:
        all_processed_data = []
        for result in tqdm(pool.imap_unordered(process_file, files), total=len(files), desc="Processing files"):
            all_processed_data.extend(result)

    # Save final results to JSON
    with open('vectors.json', 'w') as outfile:
        json.dump(all_processed_data, outfile)
