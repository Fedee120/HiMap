import os
import re
import json
from multiprocessing import Pool, cpu_count

def extract_data_from_file(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        content = file.read()
        
        # Regex pattern to extract title, categories, and summary
        pattern = r'\[\[(.*?)\]\]\n\nCATEGORIES: (.*?)\n\n(.*?)(?=\[\[|\Z)'
        matches = re.findall(pattern, content, re.DOTALL)
        
        # Convert matches to a list of dictionaries
        data_list = [{'title': match[0], 'categories': match[1], 'summary': match[2]} for match in matches]
    
    # Create an output filename based on the input filename
    base_name = os.path.basename(filename)
    output_filename = os.path.join('data', 'processed', base_name + '.json')
    os.makedirs(os.path.dirname(output_filename), exist_ok=True)
    
    with open(output_filename, 'w', encoding='utf-8') as outfile:
        json.dump(data_list, outfile, ensure_ascii=False, indent=4)
    return output_filename

if __name__ == "__main__":
    directory = 'E:\\Wikidump\\summary'
    files = [os.path.join(directory, f'enwiki-20211020-pages-articles-multistream.xml-{i}.txt') for i in range(1, 83)]

    # Use all available CPUs minus one (to leave one for system tasks)
    num_processes = max(1, cpu_count() - 1)

    with Pool(processes=num_processes) as pool:
        for output_filename in pool.imap_unordered(extract_data_from_file, files):
            print(f"Saved processed data to {output_filename}")
