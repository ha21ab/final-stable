from pathlib import Path
import math

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT.parents[0] / "Pics"
PUBLIC_DIR = ROOT / "public"
MARK_SIZE = 1024


def mark_alpha(r: int, g: int, b: int) -> int:
    red_score = r - max(g, b)
    if r < 75 or red_score < 18 or r < g * 1.08:
        return 0
    if r < 110:
        return int(max(0, min(255, (r - 75) * 4)))
    return min(255, 175 + max(0, red_score))


def find_mark_source() -> Path:
    candidates = [
        SOURCE_DIR / "1793647897804.jpg",
        SOURCE_DIR / "1793647966009.jpg",
    ]
    return next(path for path in candidates if path.exists())


def build_mark(source_path: Path) -> Image.Image:
    source = Image.open(source_path).convert("RGB")
    alpha = Image.new("L", source.size, 255)
    pixels = alpha.load()

    for y in range(source.height):
        for x in range(source.width):
            r, g, b = source.getpixel((x, y))
            pixels[x, y] = mark_alpha(r, g, b)

    rgba = Image.new("RGBA", source.size)
    rgba.putdata([
        (*source.getpixel((x, y)), pixels[x, y])
        for y in range(source.height)
        for x in range(source.width)
    ])

    bbox = alpha.getbbox()
    if bbox is None:
        raise RuntimeError("Could not detect the supplied Mela Care mark")
    mark = rgba.crop(bbox)
    mark.thumbnail((MARK_SIZE, MARK_SIZE), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (MARK_SIZE, MARK_SIZE), (0, 0, 0, 0))
    canvas.alpha_composite(mark, (
        (MARK_SIZE - mark.width) // 2,
        (MARK_SIZE - mark.height) // 2,
    ))
    return canvas


def rounded_square(size: int, fill: tuple[int, int, int, int], radius_ratio: float = 0.22) -> Image.Image:
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    radius = int(size * radius_ratio)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=fill)
    return image


def center_mark(mark: Image.Image, size: int, padding_ratio: float) -> Image.Image:
    padding = int(size * padding_ratio)
    mark_copy = mark.copy()
    mark_copy.thumbnail((size - padding * 2, size - padding * 2), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(mark_copy, (
        (size - mark_copy.width) // 2,
        (size - mark_copy.height) // 2,
    ))
    return canvas


def recolor_mark(mark: Image.Image, color: tuple[int, int, int, int]) -> Image.Image:
    recolored = Image.new("RGBA", mark.size, (0, 0, 0, 0))
    recolored_pixels = recolored.load()
    for y in range(mark.height):
        for x in range(mark.width):
            _, _, _, alpha = mark.getpixel((x, y))
            recolored_pixels[x, y] = (*color[:3], alpha)
    return recolored


def build_app_icon(mark: Image.Image, size: int = 1024, maskable: bool = False) -> Image.Image:
    background = (136, 19, 55, 255) if maskable else (255, 248, 250, 255)
    image = rounded_square(size, background)
    padding_ratio = 0.20 if maskable else 0.16
    inner = center_mark(mark if not maskable else recolor_mark(mark, (255, 248, 250, 255)), size, padding_ratio)
    image.alpha_composite(inner)
    return image


def build_lockup(mark: Image.Image) -> Image.Image:
    width, height = 1600, 600
    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    mark_copy = mark.copy()
    mark_copy.thumbnail((430, 430), Image.Resampling.LANCZOS)
    canvas.alpha_composite(mark_copy, (35, (height - mark_copy.height) // 2))

    draw = ImageDraw.Draw(canvas)
    divider_x = 510
    burgundy = (136, 19, 55, 255)
    draw.line((divider_x, 140, divider_x, 460), fill=burgundy, width=10)

    font_paths = [
        Path("C:/Windows/Fonts/arialbd.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
    ]
    font_path = next(path for path in font_paths if path.exists())
    mela_font = ImageFont.truetype(str(font_path), 210)
    care_font = ImageFont.truetype(str(font_path), 210)

    draw.text((590, 70), "Mela", font=mela_font, fill=burgundy, stroke_width=0)
    draw.text((590, 270), "Care", font=care_font, fill=burgundy, stroke_width=0)
    return canvas


def save_png(image: Image.Image, name: str) -> None:
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    image.save(PUBLIC_DIR / name, format="PNG", optimize=True)


def main() -> None:
    mark = build_mark(find_mark_source())
    save_png(mark, "mela-mark.png")
    save_png(build_lockup(mark), "mela-lockup.png")

    icon_512 = build_app_icon(mark, 512, maskable=False)
    icon_maskable = build_app_icon(mark, 512, maskable=True)
    save_png(icon_512.resize((192, 192), Image.Resampling.LANCZOS), "pwa-192x192.png")
    save_png(icon_512, "pwa-512x512.png")
    save_png(icon_512, "apple-touch-icon.png")
    save_png(icon_maskable, "pwa-maskable-512x512.png")

    icon_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#FFF8FA"/>
  <image href="/mela-mark.png" x="82" y="82" width="348" height="348"/>
</svg>
"""
    (PUBLIC_DIR / "icon.svg").write_text(icon_svg, encoding="utf-8")


if __name__ == "__main__":
    main()
