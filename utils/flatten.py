import os
import shutil

def flatten_directory(src_dir, target_dir):
    # Ensure the target directory exists
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
    
    # Counter for renaming files
    counter = 1
    
    # Walk through source directory
    for dirpath, dirnames, filenames in os.walk(src_dir):
        for file in filenames:
            if file.endswith('.txt'):
                # Construct full file path
                full_file_path = os.path.join(dirpath, file)
                
                # Construct new name for the file in target directory
                new_file_name = f"{counter}.txt"
                new_file_path = os.path.join(target_dir, new_file_name)
                
                # Move and rename
                shutil.move(full_file_path, new_file_path)
                
                # Increment the counter
                counter += 1

# Usage example
flatten_directory("C:\\Users\\loque\\OneDrive - Facultad de Ingeniería\\Escritorio\\Proyectos\\HiMap\\python-doc", 
                  "C:\\Users\\loque\\OneDrive - Facultad de Ingeniería\\Escritorio\\Proyectos\\HiMap\\data")
