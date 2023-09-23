import os
import json

def process_file_for_id_and_summary(filename, summary_data):
    with open(filename, 'r', encoding='utf-8') as file:
        data_list = json.load(file)

    for entry in data_list:
        summary_data.append({
            'id': entry['id'],
            'summary': entry['summary']
        })

if __name__ == "__main__":
    # Use the main_data.json generated previously
    main_filename = 'main_data.json'
    summary_data = []

    process_file_for_id_and_summary(main_filename, summary_data)

    # Save ID and summary data to a new JSON file
    output_filename = 'id_and_summary_data.json'
    with open(output_filename, 'w', encoding='utf-8') as outfile:
        json.dump(summary_data, outfile, ensure_ascii=False, indent=4)
    print(f"ID and summary data saved to {output_filename}")
