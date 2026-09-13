"""One-time image optimization for SaffCoz (run with .tools-venv python).

Resizes oversized assets to sane web dimensions and re-encodes as quality-85
JPEG/PNG. Only writes when the new file is meaningfully smaller.
"""
import os
from PIL import Image

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# path (relative), max dimension
TARGETS = {
    "asset/homepage/laspozaz.jpeg": 1600,
    "asset/homepage/saff-co-1850-9815093-3.jpeg": 900,
    "asset/homepage/saffcozsaff.jpeg": 900,
    "asset/homepage/troupe.jpeg": 900,
    "asset/homepage/minouet.jpeg": 900,
    "asset/homepage/maleali.jpg": 900,
    "asset/productpage/saff-co-1850-9815093-3.jpeg": 900,
    "asset/aboutus/images_7sw91t3M_Y36XP4.jpg": 1600,
    "asset/aboutus/4de85956860e3c066893dea8ed6435d1.jpg": 1600,
    "asset/aboutus/57bd47d826539fc69df152d5f0259d3f.jpg": 1200,
    "asset/aboutus/808d7f8af18f2b61bcc6e7267a8c55d7.jpg": 1200,
    "asset/aboutus/9ff8c785aa6aa8a23212a48471fed976.jpg": 1200,
    "asset/aboutus/d3eec660181d490e050a9523ec8ddfac.jpg": 1200,
    "asset/aboutus/e8e271c7f5a2c589a8c690361f119b5d.jpg": 1200,
    "asset/location/BINUS Bandung.png": 1200,
    "asset/location/BINUS Kemanggisan.png": 1200,
    "asset/location/BINUS Malang.png": 1200,
}

for rel, maxdim in TARGETS.items():
    path = os.path.join(BASE, rel)
    before = os.path.getsize(path)
    im = Image.open(path)
    im.load()
    if im.mode in ("RGBA", "P"):
        im = im.convert("RGB")
    if max(im.size) > maxdim:
        im.thumbnail((maxdim, maxdim), Image.LANCZOS)
    tmp = path + ".opt"
    if path.lower().endswith(".png"):
        im.save(tmp, "PNG", optimize=True)
    else:
        im.save(tmp, "JPEG", quality=85, optimize=True, progressive=True)
    after = os.path.getsize(tmp)
    if after < before * 0.85:
        os.replace(tmp, path)
        print(f"OK  {rel}: {before//1024}KB -> {after//1024}KB  {im.size}")
    else:
        os.remove(tmp)
        print(f"KEEP {rel}: {before//1024}KB (not worth it)  {im.size}")
