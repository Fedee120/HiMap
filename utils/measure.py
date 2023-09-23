import json

def analyze_summaries(filename):
    # Load the data
    with open(filename, 'r', encoding='utf-8') as file:
        data_list = json.load(file)

    # Count the total number of summaries
    total_summaries = len(data_list)

    # Calculate the lengths of all summaries
    lengths = [len(entry['summary']) for entry in data_list]

    # Determine the maximum length
    max_length = max(lengths)

    # Calculate the average length
    average_length = sum(lengths) / total_summaries

    return total_summaries, max_length, average_length

if __name__ == "__main__":
    filename = 'id_and_summary_data.json'
    total_summaries, max_length, average_length = analyze_summaries(filename)
    print(f"Total Summaries: {total_summaries}")
    print(f"Maximum Summary Length: {max_length}")
    print(f"Average Summary Length: {average_length:.2f}")

