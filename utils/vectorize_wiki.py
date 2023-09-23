import os
import json
from sentence_transformers import SentenceTransformer
from multiprocessing import Pool, cpu_count

# Global variable to store the model for each process
global_model = None

def init_worker():
    """Initialize the model for each process."""
    global global_model
    global_model = SentenceTransformer('multi-qa-MiniLM-L6-cos-v1')

def vectorize_from_file(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        data_list = json.load(file)
    
    for entry in data_list:
        entry['vector'] = global_model.encode(entry['summary']).tolist()
    
    # Create an output filename for the vectorized data
    base_name = os.path.basename(filename)
    output_filename = os.path.join('data', 'vectorized', base_name)
    os.makedirs(os.path.dirname(output_filename), exist_ok=True)
    
    with open(output_filename, 'w', encoding='utf-8') as outfile:
        json.dump(data_list, outfile, ensure_ascii=False, indent=4)
    
    return output_filename

if __name__ == "__main__":
    directory = 'data/processed'
    files = [os.path.join(directory, file) for file in os.listdir(directory) if file.endswith('.json')]

    # Use all available CPUs minus one (to leave one for system tasks)
    num_processes = max(1, cpu_count() - 1)

    # Initialize each process with the init_worker function to load the model
    with Pool(processes=num_processes, initializer=init_worker) as pool:
        for output_filename in pool.imap_unordered(vectorize_from_file, files):
            print(f"Saved vectorized data to {output_filename}")
