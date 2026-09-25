from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parent
assets_dir = root / 'assets'
assets_dir.mkdir(exist_ok=True)

# Create original SVG artwork
icon_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#071018"/>
      <stop offset="52%" stop-color="#0d1724"/>
      <stop offset="100%" stop-color="#090d14"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" x2="1">
      <stop offset="0%" stop-color="#9BE7FF"/>
      <stop offset="55%" stop-color="#DDE8FF"/>
      <stop offset="100%" stop-color="#7DD3FC"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <rect x="28" y="28" width="456" height="456" rx="92" fill="none" stroke="#7dd3fc" stroke-opacity="0.25" stroke-width="2"/>
  <circle cx="256" cy="192" r="160" fill="#7dd3fc" fill-opacity="0.08"/>
  <g fill="url(#accent)">
    <path d="M326 110c-25-27-62-42-102-42-72 0-132 45-148 109l42 18c11-38 47-66 88-66 39 0 75 24 86 60l-55 20c-18 6-33 18-41 34l-31 56c-9 16-14 35-14 54 0 28 9 55 27 75 15 16 36 28 59 32l-18 41h94l12-72c34-9 60-39 60-75 0-22-9-42-24-57 18-18 29-43 29-70 0-58-49-106-108-106zm-87 228c-32 0-58-26-58-58s26-58 58-58 58 26 58 58-26 58-58 58z"/>
  </g>
  <path d="M176 142h122v36H176zm0 94h122v36H176zm0 94h86v36h-86z" fill="#F8FBFF" fill-opacity="0.86"/>
  <circle cx="142" cy="164" r="10" fill="#A5F3FC"/>
  <circle cx="360" cy="350" r="10" fill="#67E8F9"/>
</svg>
'''
(root / 'icon.svg').write_text(icon_svg, encoding='utf-8')
(root / 'assets' / 'icon.svg').write_text(icon_svg, encoding='utf-8')
(root / 'zeroscript-extension' / 'icon.png').unlink(missing_ok=True)

banner_svg = '''<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#070c12"/>
      <stop offset="48%" stop-color="#0d1724"/>
      <stop offset="100%" stop-color="#050a12"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" x2="1">
      <stop offset="0%" stop-color="#BFEAFE"/>
      <stop offset="48%" stop-color="#DDE8FF"/>
      <stop offset="100%" stop-color="#7DD3FC"/>
    </linearGradient>
    <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M44 0H0V44" fill="none" stroke="#DDE8FF" stroke-opacity="0.08"/>
    </pattern>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <rect width="1600" height="900" fill="url(#grid)"/>
  <circle cx="360" cy="220" r="300" fill="#7dd3fc" fill-opacity="0.10"/>
  <g transform="translate(120 150)">
    <rect width="250" height="250" rx="56" fill="#0c141d" stroke="#7dd3fc" stroke-opacity="0.28" stroke-width="2"/>
    <path d="M156 68c-41-41-95-58-156-52l18 52c30-8 62-2 87 18 22 18 35 46 35 75 0 40-24 76-62 89l-48 17c-30 11-51 37-51 66 0 43 34 75 80 75 40 0 73-19 94-54l42 37c-28 36-72 58-122 58-92 0-157-66-157-160 0-57 29-106 76-133l54-32c18-11 30-28 30-46 0-15-8-28-21-36 5 2 10 3 15 3 17 0 31-10 35-24z" fill="url(#accent)"/>
    <path d="M108 112h116v34H108zm0 92h116v34H108zm0 94h82v34h-82z" fill="#F8FBFF" fill-opacity="0.86"/>
    <circle cx="86" cy="120" r="9" fill="#A5F3FC"/>
    <circle cx="208" cy="279" r="9" fill="#67E8F9"/>
  </g>
  <g font-family="Segoe UI, Arial, sans-serif" fill="#ecf4ff">
    <text x="470" y="360" font-size="102" font-weight="800" letter-spacing="6">STUDIO</text>
    <text x="470" y="470" font-size="128" font-weight="900" letter-spacing="8">CODE</text>
    <rect x="475" y="514" width="480" height="3" fill="url(#accent)"/>
    <text x="470" y="590" font-size="36" font-weight="600" letter-spacing="4" fill="#AABFD1">AI + ROBLOX STUDIO</text>
    <text x="470" y="654" font-size="24" letter-spacing="3" fill="#8EA7BF">MCP • BROWSER EXTENSION • LOCAL BRIDGE</text>
  </g>
</svg>
'''
(root / 'banner.svg').write_text(banner_svg, encoding='utf-8')
(root / 'assets' / 'banner.svg').write_text(banner_svg, encoding='utf-8')

# Basic PNG conversion with Pillow
img = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
mask = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
draw = ImageDraw.Draw(mask)
draw.rounded_rectangle((20, 20, 492, 492), radius=110, fill=(8, 14, 20, 255))
draw.rounded_rectangle((30, 30, 482, 482), radius=95, outline=(125, 211, 252, 64), width=2)
draw.ellipse((48, 52, 462, 462), fill=(125, 211, 252, 45))
# monogram S
try:
    font = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 240)
except Exception:
    font = ImageFont.load_default()
draw.text((165, 120), 'S', font=font, fill=(232, 242, 255, 255))
# simplified accent bars
for x, y, w in [(110, 160, 120), (110, 250, 140), (110, 340, 90)]:
    draw.rectangle((x, y, x + w, y + 22), fill=(125, 211, 252, 200))
img = Image.alpha_composite(Image.new('RGBA', (512, 512), (0, 0, 0, 0)), mask)
img.save(root / 'icon.png')
img.save(root / 'assets' / 'icon.png')
img.save(root / 'zeroscript-extension' / 'icon.png')

# Banner png at 1600x900
banner = Image.new('RGBA', (1600, 900), (7, 12, 18, 255))
draw_banner = ImageDraw.Draw(banner)
for x in range(0, 1600, 44):
    draw_banner.line((x, 0, x, 900), fill=(221, 232, 255, 30), width=1)
for y in range(0, 900, 44):
    draw_banner.line((0, y, 1600, y), fill=(221, 232, 255, 30), width=1)
draw_banner.ellipse((60, 60, 660, 640), fill=(125, 211, 252, 28))
draw_banner.rounded_rectangle((120, 150, 370, 400), radius=56, fill=(12, 20, 29, 255), outline=(125, 211, 252, 75), width=2)
try:
    font_big = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 160)
    font_title = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 104)
    font_sub = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 30)
    font_caps = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 22)
except Exception:
    font_big = ImageFont.load_default()
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_caps = ImageFont.load_default()

draw_banner.text((170, 195), 'S', font=font_big, fill=(232, 242, 255, 255))
draw_banner.text((470, 255), 'STUDIO', font=font_title, fill=(234, 242, 255, 255))
draw_banner.text((470, 360), 'CODE', font=font_title, fill=(234, 242, 255, 255))
draw_banner.rectangle((475, 500, 955, 505), fill=(125, 211, 252, 220))
draw_banner.text((470, 545), 'AI + ROBLOX STUDIO', font=font_sub, fill=(170, 191, 209, 255))
draw_banner.text((470, 610), 'MCP • BROWSER EXTENSION • LOCAL BRIDGE', font=font_caps, fill=(142, 167, 191, 255))
banner.save(root / 'banner.png')
banner.save(root / 'assets' / 'banner.png')

print('Generated custom assets:')
for p in [root / 'icon.png', root / 'icon.svg', root / 'banner.png', root / 'banner.svg', root / 'assets' / 'icon.png', root / 'assets' / 'banner.png']:
    print(p.name)
