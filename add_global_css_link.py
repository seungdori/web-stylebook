import os
import re

def process_file(filepath):
    # Determine the relative path to assets/global-themes.css
    is_root = os.path.dirname(filepath) == '.' or os.path.dirname(filepath) == '' or os.path.dirname(filepath).endswith('showcase')
    css_path = "./assets/global-themes.css" if is_root else "../assets/global-themes.css"
    
    link_tag = f'<link rel="stylesheet" href="{css_path}" />'

    try:
        with open(filepath, 'r') as f:
            content = f.read()
            
        # Check if already linked
        # We need to be careful not to match 'global-themes.css' inside some other comment, 
        # but since we only care if it's there as a link, looking for the filename is usually enough.
        if 'global-themes.css' in content:
            return

        original_content = content

        # We will try to add it just before </head>
        head_end_idx = content.find('</head>')
        if head_end_idx != -1:
            content = content[:head_end_idx] + f"    {link_tag}\n" + content[head_end_idx:]
        else:
            # If no </head>, just put it at the top of the file before <style> or anything
            content = f"{link_tag}\n{content}"

        if content != original_content:
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Added link to {filepath}")
    except PermissionError:
        print(f"Permission denied for {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            if 'test_copy' in file:
                continue
            process_file(os.path.join(root, file))
