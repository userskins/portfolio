"""Optimize only compiled studio derivatives; never alter source artwork."""
from pathlib import Path
from PIL import Image
folder = Path('dist/studio/assets')
before = after = 0
for source in folder.glob('*.webp'):
    before += source.stat().st_size
    with Image.open(source) as original:
        image = original.copy()
        if max(image.size) > 1600:
            image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            image.save(source, 'WEBP', quality=88, method=4)
    after += source.stat().st_size
print(f'Compiled gallery: {before / 1e6:.1f} MB -> {after / 1e6:.1f} MB; originals unchanged.')
