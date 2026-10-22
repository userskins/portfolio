"""Create light previews from owned artwork. Never edit the originals."""
from pathlib import Path
from PIL import Image
root = Path(__file__).resolve().parents[1]
output = root / 'client/studio/public/art'
output.mkdir(parents=True, exist_ok=True)
for source in sorted((root / 'attached_assets/gallery').glob('*.webp')):
    with Image.open(source) as original:
        image = original.convert('RGB')
        image.thumbnail((680, 820), Image.Resampling.LANCZOS)
        image.save(output / source.name, 'WEBP', quality=82, method=4)
print(f'Prepared {len(list(output.glob("*.webp")))} artwork previews.')
