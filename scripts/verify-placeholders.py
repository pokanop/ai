#!/usr/bin/env python3

import os
import re
import sys
from pathlib import Path

# Regex for Markdown image syntax: ![alt](path)
MD_IMAGE_RE = re.compile(r'!\[.*?\]\((.*?)\)')
# Regex for HTML image tags: <img src="path" />
HTML_IMAGE_RE = re.compile(r'<img.*?src=["\'](.*?)["\'].*?>')

def verify_placeholders(repo_root):
    missing_images = {} # Missing Image path -> List of Markdown files referencing it
    total_images_checked = 0
    total_missing = 0
    sample_prompts = {}

    # Walk through all markdown files
    for root, _, files in os.walk(repo_root):
        if '.git' in root or 'node_modules' in root or '.venv' in root:
            continue
            
        for file in files:
            if file.endswith('.md'):
                md_path = Path(root) / file
                
                try:
                    with open(md_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                except Exception as e:
                    print(f"Warning: Could not read {md_path}: {e}")
                    continue
                
                try:
                    relative_md_str = str(md_path.relative_to(repo_root))
                except ValueError:
                    relative_md_str = str(md_path)

                # Extract Sample Prompt
                prompt_match = re.search(r'> \*\*Sample prompt.*?\n> ```text\n(.*?)\n> ```', content, re.DOTALL)
                if prompt_match:
                    prompt_text = re.sub(r'^> ?', '', prompt_match.group(1), flags=re.MULTILINE)
                    sample_prompts[relative_md_str] = prompt_text.strip()

                # Find all images
                images = MD_IMAGE_RE.findall(content) + HTML_IMAGE_RE.findall(content)
                
                for img_path in images:
                    if img_path.startswith(('http://', 'https://', 'data:')):
                         continue # Skip external URLs and data URIs
                    
                    # Clean the path from anchors or queries
                    img_path_clean = img_path.split('#')[0].split('?')[0]
                    
                    # Resolve path relative to the markdown file
                    resolved_img_path = (md_path.parent / img_path_clean).resolve()
                    
                    # We consider it a "placeholder" check, but checking any local image is good practice.
                    total_images_checked += 1
                    
                    if not resolved_img_path.exists():
                        # Try to get path relative to repo root for cleaner output
                        try:
                            relative_img = resolved_img_path.relative_to(repo_root)
                        except ValueError:
                            relative_img = resolved_img_path
                            
                        img_key = str(relative_img)
                        if img_key not in missing_images:
                            missing_images[img_key] = []
                        if relative_md_str not in missing_images[img_key]:
                            missing_images[img_key].append(relative_md_str)
                            total_missing += 1

    class Colors:
        HEADER = '\033[95m'
        OKBLUE = '\033[94m'
        OKCYAN = '\033[96m'
        OKGREEN = '\033[92m'
        WARNING = '\033[93m'
        FAIL = '\033[91m'
        ENDC = '\033[0m'
        BOLD = '\033[1m'

    # Print Clean Summary
    print(f"{Colors.OKCYAN}{'=' * 110}{Colors.ENDC}")
    centered_title = "✨ PLACEHOLDER IMAGE VERIFICATION SUMMARY ✨".center(110)
    print(f"{Colors.HEADER}{Colors.BOLD}{centered_title}{Colors.ENDC}")
    print(f"{Colors.OKCYAN}{'=' * 110}{Colors.ENDC}")
    print(f"Total Local Images Checked: {Colors.OKBLUE}{Colors.BOLD}{total_images_checked}{Colors.ENDC}")
    print(f"Total Missing Images:       {Colors.FAIL}{Colors.BOLD}{total_missing}{Colors.ENDC}")
    print(f"{Colors.OKCYAN}{'-' * 110}{Colors.ENDC}")
    
    missing_md_files = {md for mds in missing_images.values() for md in mds}
    prompts_to_print = {Path(md).stem: prompt for md, prompt in sample_prompts.items() if md in missing_md_files}
    
    if prompts_to_print:
        print(f"\n📝 {Colors.HEADER}{Colors.BOLD}EXTRACTED SAMPLE PROMPTS FOR MISSING IMAGES:{Colors.ENDC}\n")
        for md_name, prompt in sorted(prompts_to_print.items()):
            print(f"{Colors.BOLD}{md_name}{Colors.ENDC}:")
            print(f"{Colors.OKGREEN}{prompt}{Colors.ENDC}\n")
        print(f"{Colors.OKCYAN}{'=' * 110}{Colors.ENDC}")

    if not missing_images:
        print(f"\n✅ {Colors.OKGREEN}Success! All placeholder images referenced in documents are present.{Colors.ENDC}\n")
        print(f"{Colors.OKCYAN}{'=' * 110}{Colors.ENDC}")
        return 0

    print(f"\n❌ {Colors.FAIL}{Colors.BOLD}MISSING IMAGES DETECTED:{Colors.ENDC}\n")
    
    # Table Header
    print(f"{Colors.BOLD}{'Missing Image Path':<45} | {'Referenced In'}{Colors.ENDC}")
    print(f"{Colors.OKCYAN}{'-' * 110}{Colors.ENDC}")
    
    for img, mds in sorted(missing_images.items()):
        for i, md in enumerate(sorted(mds)):
            if i == 0:
                print(f"{Colors.FAIL}{img:<45}{Colors.ENDC} | {Colors.WARNING}{md}{Colors.ENDC}")
            else:
                print(f"{'':<45} | {Colors.WARNING}{md}{Colors.ENDC}")
        
    print(f"{Colors.OKCYAN}{'=' * 110}{Colors.ENDC}")
    return 1

if __name__ == '__main__':
    # Get the repo root (assuming script is in a folder like `scripts/`)
    script_path = Path(__file__).resolve()
    repo_root = script_path.parent.parent
    
    sys.exit(verify_placeholders(repo_root))
