import os
import json

def process_file_for_database(filename, main_data):
    with open(filename, 'r', encoding='utf-8') as file:
        data_list = json.load(file)

    for entry in data_list:
        unique_id = len(main_data) + 1  # Unique ID based on index
        main_data.append({
            'id': unique_id,
            'summary': entry['summary'],
            'categories': entry['categories']
        })

if __name__ == "__main__":
    directory = 'data/processed'
    files = [os.path.join(directory, file) for file in os.listdir(directory) if file.endswith('.json')]

    main_data = []

    for filename in files:
        process_file_for_database(filename, main_data)
        print(f"Processed {filename}")

    # Save main data to a JSON file
    main_filename = 'main_data.json'
    with open(main_filename, 'w', encoding='utf-8') as outfile:
        json.dump(main_data, outfile, ensure_ascii=False, indent=4)
    print(f"Main data saved to {main_filename}")
