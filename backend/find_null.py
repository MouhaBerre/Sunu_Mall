import os

def find_null_bytes(directory):
    bad_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.py'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'rb') as f:
                        content = f.read()
                        if b'\x00' in content:
                            bad_files.append(filepath)
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")
    return bad_files

print("Files with null bytes:")
for f in find_null_bytes('backend'):
    print(f)
