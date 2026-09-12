from rembg import remove
from PIL import Image
import os

pets = ["dog.png", "cat.png", "penguin.png", "unicorn.png"]
assets_dir = "public/assets"

for pet in pets:
    path = os.path.join(assets_dir, pet)
    if os.path.exists(path):
        print(f"Removing background from {pet}...")
        img = Image.open(path)
        output = remove(img)
        output.save(path)
        print(f"Saved transparent {pet} successfully!")

print("All pet backgrounds removed successfully!")
