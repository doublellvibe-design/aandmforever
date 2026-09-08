import qrcode
from PIL import Image, ImageDraw, ImageFont

URL = "https://doublellvibe-design.github.io/aandmforever/"

qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=10, border=4)
qr.add_data(URL)
qr_img = qr.make_image(fill_color="#1c1814", back_color="#ffffff").convert("RGB")

W, H = 1080, 1440
canvas = Image.new("RGB", (W, H), (244, 237, 227))  # ivory
d = ImageDraw.Draw(canvas)

def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

serif = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
sans  = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
sansb = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

d.text((W/2, 120), "A&Mforever", font=font(serif, 92), fill=(28, 24, 20), anchor="mm")
d.text((W/2, 222), "Ulwamkelo Luka Makoti", font=font(sans, 34), fill=(90, 79, 69), anchor="mm")

qsize = 640
qr_r = qr_img.resize((qsize, qsize))
pad = 36
card = Image.new("RGB", (qsize + pad*2, qsize + pad*2), (255, 255, 255))
card.paste(qr_r, (pad, pad))
cy = 330
canvas.paste(card, ((W - card.width)//2, cy))

d.text((W/2, cy + qsize + pad + 70), "Scan to open our wedding site", font=font(sansb, 36), fill=(28, 24, 20), anchor="mm")
d.text((W/2, cy + qsize + pad + 130), "aandmforever.github.io", font=font(sans, 32), fill=(156, 123, 94), anchor="mm")
d.text((W/2, cy + qsize + pad + 192), "12 September 2026 · Harding, KZN", font=font(sans, 30), fill=(90, 79, 69), anchor="mm")

canvas.save("assets/scan-me.png")
print("saved", canvas.size)
