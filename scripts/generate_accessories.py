import os
import math
from PIL import Image, ImageDraw

out_dir = "public/assets/items"
os.makedirs(out_dir, exist_ok=True)

# 1. Hat: Cute Dapper Top Hat with ribbon band
img = Image.new("RGBA", (300, 200), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
# Brim
d.ellipse([30, 140, 270, 185], fill=(35, 35, 45, 255), outline=(20, 20, 25, 255), width=3)
# Crown
d.rounded_rectangle([75, 40, 225, 155], radius=15, fill=(45, 45, 60, 255), outline=(25, 25, 35, 255), width=3)
# Highlight on crown
d.rounded_rectangle([90, 48, 120, 145], radius=8, fill=(70, 70, 95, 200))
# Ribbon band
d.rectangle([75, 125, 225, 150], fill=(235, 75, 90, 255))
# Gold buckle
d.rounded_rectangle([135, 122, 165, 153], radius=4, fill=(255, 215, 0, 255), outline=(200, 160, 0, 255), width=2)
d.rectangle([143, 129, 157, 146], fill=(235, 75, 90, 255))
img.save(os.path.join(out_dir, "hat.png"))

# 2. Bowtie: Classic cute red bowtie with knot
img = Image.new("RGBA", (260, 140), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
# Left wing
d.polygon([(130, 70), (30, 25), (30, 115)], fill=(230, 50, 68, 255), outline=(180, 25, 40, 255))
d.polygon([(130, 70), (45, 38), (45, 102)], fill=(250, 80, 95, 255))
# Right wing
d.polygon([(130, 70), (230, 25), (230, 115)], fill=(230, 50, 68, 255), outline=(180, 25, 40, 255))
d.polygon([(130, 70), (215, 38), (215, 102)], fill=(250, 80, 95, 255))
# Center knot
d.rounded_rectangle([108, 48, 152, 92], radius=10, fill=(255, 215, 0, 255), outline=(200, 160, 0, 255), width=2)
d.ellipse([118, 56, 134, 76], fill=(255, 240, 150, 220))
img.save(os.path.join(out_dir, "bowtie.png"))

# 3. Glasses: Cool retro shades
img = Image.new("RGBA", (320, 130), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
# Bridge
d.rounded_rectangle([140, 48, 180, 60], radius=4, fill=(40, 40, 40, 255))
# Left frame & lens
d.rounded_rectangle([25, 30, 145, 105], radius=28, fill=(30, 30, 35, 255), outline=(245, 190, 40, 255), width=6)
# Left lens reflection
d.polygon([(45, 90), (65, 42), (80, 42), (55, 90)], fill=(255, 255, 255, 140))
d.polygon([(75, 90), (95, 42), (105, 42), (85, 90)], fill=(255, 255, 255, 90))
# Right frame & lens
d.rounded_rectangle([175, 30, 295, 105], radius=28, fill=(30, 30, 35, 255), outline=(245, 190, 40, 255), width=6)
# Right lens reflection
d.polygon([(195, 90), (215, 42), (230, 42), (205, 90)], fill=(255, 255, 255, 140))
d.polygon([(225, 90), (245, 42), (255, 42), (235, 90)], fill=(255, 255, 255, 90))
img.save(os.path.join(out_dir, "glasses.png"))

# 4. Collar: Curved Pet Collar with shiny medal
img = Image.new("RGBA", (300, 140), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
# Collar band
d.rounded_rectangle([30, 25, 270, 65], radius=16, fill=(50, 120, 230, 255), outline=(30, 80, 180, 255), width=4)
# Studs
for x in [60, 100, 200, 240]:
    d.ellipse([x, 37, x + 16, 53], fill=(240, 240, 240, 255), outline=(160, 160, 160, 255), width=2)
# Bell ring
d.ellipse([140, 58, 160, 78], outline=(255, 200, 0, 255), width=3)
# Gold Bell / Pendant
d.ellipse([132, 70, 168, 106], fill=(255, 215, 0, 255), outline=(200, 150, 0, 255), width=3)
d.ellipse([145, 82, 155, 92], fill=(180, 130, 0, 255))
d.ellipse([138, 74, 146, 82], fill=(255, 250, 180, 255))
img.save(os.path.join(out_dir, "collar.png"))

# 5. Bandana: Triangle scarf with pattern
img = Image.new("RGBA", (300, 200), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
# Band
d.rounded_rectangle([20, 20, 280, 55], radius=12, fill=(240, 90, 50, 255), outline=(190, 60, 30, 255), width=3)
# Triangle body
d.polygon([(40, 50), (260, 50), (150, 180)], fill=(240, 90, 50, 255), outline=(190, 60, 30, 255))
# Pattern dots
dots = [(150, 80), (120, 100), (180, 100), (150, 130), (100, 65), (200, 65), (150, 65)]
for x, y in dots:
    d.ellipse([x - 7, y - 7, x + 7, y + 7], fill=(255, 255, 255, 230))
img.save(os.path.join(out_dir, "bandana.png"))

# 6. Bow: Cute pink pastel hair bow
img = Image.new("RGBA", (240, 150), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
# Left loop
d.polygon([(120, 75), (35, 30), (35, 120)], fill=(255, 130, 180, 255), outline=(220, 80, 140, 255), width=3)
d.ellipse([45, 45, 85, 105], fill=(255, 170, 210, 255))
# Right loop
d.polygon([(120, 75), (205, 30), (205, 120)], fill=(255, 130, 180, 255), outline=(220, 80, 140, 255), width=3)
d.ellipse([155, 45, 195, 105], fill=(255, 170, 210, 255))
# Center knot
d.ellipse([100, 55, 140, 95], fill=(255, 90, 150, 255), outline=(200, 60, 120, 255), width=3)
d.ellipse([108, 62, 122, 76], fill=(255, 200, 230, 255))
img.save(os.path.join(out_dir, "bow.png"))

# 7. Rainbow Glow (Unicorn / Magic extra)
img = Image.new("RGBA", (300, 300), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
for r, color in [(140, (255, 100, 100, 60)), (120, (255, 190, 80, 70)), (100, (255, 255, 100, 80)),
                 (80, (100, 230, 130, 90)), (60, (90, 180, 255, 100)), (40, (190, 120, 255, 120))]:
    d.ellipse([150 - r, 150 - r, 150 + r, 150 + r], outline=color, width=12)
# Magic sparkles
sparkles = [(150, 50), (250, 150), (150, 250), (50, 150), (80, 80), (220, 80), (220, 220), (80, 220)]
for sx, sy in sparkles:
    d.polygon([(sx, sy - 14), (sx + 4, sy), (sx + 14, sy), (sx + 4, sy + 4), (sx, sy + 14), (sx - 4, sy + 4), (sx - 14, sy), (sx - 4, sy)], fill=(255, 255, 255, 230))
img.save(os.path.join(out_dir, "rainbow_glow.png"))

print("All accessory assets generated successfully!")
