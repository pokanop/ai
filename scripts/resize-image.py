#!/usr/bin/env python3

import os
import sys
import argparse
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Error: The 'Pillow' library is required to run this script.")
    print("You can install it by running: pip install Pillow")
    sys.exit(1)

def process_file(in_file, out_target):
    in_path = Path(in_file)
    if not in_path.is_file():
        return

    # Basic extension check to avoid processing non-images
    valid_exts = {'.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif', '.tiff', '.heic'}
    if in_path.suffix.lower() not in valid_exts:
        # Silently skip if iterating through a folder, otherwise could print a message
        return

    # Determine out_file
    out_file = None
    if not out_target:
        out_file = Path.cwd() / f"{in_path.stem}-resized{in_path.suffix}"
    else:
        out_target_path = Path(out_target)
        if out_target_path.is_dir() or out_target.endswith('/') or out_target.endswith('\\'):
            out_target_path.mkdir(parents=True, exist_ok=True)
            out_file = out_target_path / in_path.name
        else:
            out_file = out_target_path

    out_file.parent.mkdir(parents=True, exist_ok=True)

    try:
        with Image.open(in_path) as img:
            width, height = img.size
            if height >= width:
                # Portrait or square
                target_height = 500
            else:
                # Landscape
                target_height = 400

            if target_height == height:
                print(f"Skipping '{in_path}' (Already at target height {height}px)")
                return

            print(f"Resizing '{in_path}' ({width}x{height}) to height: {target_height} -> '{out_file}'")
            
            target_width = int(width * (target_height / height))
            
            # Convert to RGB if saving a file with an alpha channel to JPEG
            if img.mode in ('RGBA', 'P') and out_file.suffix.lower() in ('.jpg', '.jpeg'):
                img = img.convert('RGB')
                
            resized_img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
            resized_img.save(out_file)

    except Exception as e:
        print(f"Failed to process '{in_path}': {e}")


def main():
    parser = argparse.ArgumentParser(description="Resize image(s) automatically based on dimensions.")
    parser.add_argument("-i", "--input", required=True, help="Input file or folder")
    parser.add_argument("-o", "--output", default="", help="Output file or folder (optional)")
    
    if len(sys.argv) == 1:
        parser.print_help(sys.stderr)
        sys.exit(1)
        
    args = parser.parse_args()

    in_path = Path(args.input)
    if not in_path.exists():
        print(f"Error: Input '{args.input}' does not exist.")
        sys.exit(1)

    if in_path.is_file():
        process_file(args.input, args.output)
    elif in_path.is_dir():
        for item in in_path.iterdir():
            if item.is_file():
                if args.output:
                    out_target = Path(args.output)
                    out_target.mkdir(parents=True, exist_ok=True)
                    process_file(item, str(out_target / item.name))
                else:
                    process_file(item, "")

if __name__ == "__main__":
    main()
