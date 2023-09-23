import json
import os

def split_file(filename, max_summaries_per_file=15000):
    # Load the data
    with open(filename, 'r', encoding='utf-8') as file:
        data_list = json.load(file)

    # Determine the number of files needed
    total_summaries = len(data_list)
    num_files = -(-total_summaries // max_summaries_per_file)  # Ceiling division

    # Create output directory if it doesn't exist
    output_dir = 'split_files'
    os.makedirs(output_dir, exist_ok=True)

    # Split and save the data
    for i in range(num_files):
        start_index = i * max_summaries_per_file
        end_index = start_index + max_summaries_per_file
        chunk = data_list[start_index:end_index]
        
        output_filename = os.path.join(output_dir, f'summary_data_{i + 1}.json')
        with open(output_filename, 'w', encoding='utf-8') as outfile:
            json.dump(chunk, outfile, ensure_ascii=False, indent=4)
        print(f"Saved {len(chunk)} summaries to {output_filename}")

if __name__ == "__main__":
    input_filename = 'id_and_summary_data.json'
    split_file(input_filename)
