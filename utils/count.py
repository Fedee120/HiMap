import os
import json
from collections import defaultdict

def process_file_for_counts(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        data_list = json.load(file)
    
    # Counter for summaries
    summary_count = len(data_list)

    # Counter for categories
    category_counts = defaultdict(int)
    for entry in data_list:
        # Assuming each entry can have multiple categories separated by commas
        categories = entry['categories'].split(',')
        for category in categories:
            category_counts[category.strip()] += 1

    return summary_count, category_counts

if __name__ == "__main__":
    directory = 'data/processed'
    files = [os.path.join(directory, file) for file in os.listdir(directory) if file.endswith('.json')]

    total_summaries = 0
    total_category_counts = defaultdict(int)

    for filename in files:
        summary_count, category_counts = process_file_for_counts(filename)
        total_summaries += summary_count
        for category, count in category_counts.items():
            total_category_counts[category] += count

    print(f"Total Summaries: {total_summaries}")

    # Save category counts to a JSON file
    output_filename = 'category_counts.json'
    with open(output_filename, 'w', encoding='utf-8') as outfile:
        json.dump(total_category_counts, outfile, ensure_ascii=False, indent=4)

    print(f"Category counts saved to {output_filename}")
