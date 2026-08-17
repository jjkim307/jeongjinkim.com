"""Generate the 1200x630 social preview card for jeongjinkim.com."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

SCALE = 2
W, H = 1200 * SCALE, 630 * SCALE

BG = "#f8f6f3"
TEXT = "#2b2723"
STATEMENT = "#4a443c"
MUTED = "#8d857a"
BORDER = "#e5e0d8"
CRIMSON = "#841617"

SERIF_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
SANS = "/System/Library/Fonts/Supplemental/Arial.ttf"
SANS_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

ROOT = Path.home() / "projects" / "jeongjinkim.com"
HEADSHOT = ROOT / "public" / "headshot.jpg"
OUT = ROOT / "public" / "og-card.png"


def font(path, size):
    return ImageFont.truetype(path, size * SCALE)


def tracked(draw, xy, text, fnt, fill, tracking):
    """Draw text with extra letter spacing (Pillow has no tracking option)."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking * SCALE


img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

# Crimson rule along the bottom edge.
draw.rectangle([0, H - 10 * SCALE, W, H], fill=CRIMSON)

# Circular headshot on the right.
d = 300 * SCALE
cx, cy = W - 100 * SCALE - d, 195 * SCALE
photo = Image.open(HEADSHOT).convert("RGB")
# Crop a square around the face rather than the geometric center of the frame:
# the subject sits right of and below frame center in headshot.jpg (450x600).
side, left, top = 400, 50, 95
photo = photo.crop((left, top, left + side, top + side)).resize((d, d), Image.LANCZOS)
mask = Image.new("L", (d * 4, d * 4), 0)
ImageDraw.Draw(mask).ellipse([0, 0, d * 4, d * 4], fill=255)
mask = mask.resize((d, d), Image.LANCZOS)
img.paste(photo, (cx, cy), mask)
draw.ellipse([cx, cy, cx + d, cy + d], outline=BORDER, width=3 * SCALE)

# Text block.
x = 100 * SCALE
y = 170 * SCALE

f_name = font(SERIF_BOLD, 58)
draw.text((x, y), "JeongJin Kim, Ph.D.", font=f_name, fill=TEXT)
y += 100 * SCALE

draw.rectangle([x, y, x + 84 * SCALE, y + 4 * SCALE], fill=CRIMSON)
y += 42 * SCALE

f_role = font(SANS, 30)
for line, color in [
    ("Industrial-Organizational Psychologist", STATEMENT),
    ("Assistant Professor of Psychology", STATEMENT),
    ("The University of Oklahoma", MUTED),
]:
    draw.text((x, y), line, font=f_role, fill=color)
    y += 46 * SCALE

f_url = font(SANS_BOLD, 20)
tracked(draw, (x, H - 118 * SCALE), "JEONGJINKIM.COM", f_url, MUTED, 3)

img.resize((1200, 630), Image.LANCZOS).save(OUT, "PNG", optimize=True)
print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB)")
