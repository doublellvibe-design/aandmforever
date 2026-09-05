import cv2

cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# src -> (dst, target_aspect_w/h)
targets = {
    'assets/photo1.jpg': ('assets/photo1_bg.jpg', 16/9),   # hero (wide)
    'assets/photo3.jpg': ('assets/photo3_bg.jpg', 2.4),    # feature band (very wide)
    'assets/photo7.jpg': ('assets/photo7_bg.jpg', 2.4),    # feature band (very wide)
    'assets/photo5.jpg': ('assets/photo5_bg.jpg', 3/2),    # venue map tile
}

MARGIN = 0.55  # grow the face box by 55% each side

for src, (dst, aspect) in targets.items():
    img = cv2.imread(src)
    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = cascade.detectMultiScale(gray, 1.1, 4, minSize=(40, 40))

    if len(faces) == 0:
        print(f"{src}: NO FACES -> using full image")
        cv2.imwrite(dst, img)
        continue

    x0 = min(f[0] for f in faces); y0 = min(f[1] for f in faces)
    x1 = max(f[0]+f[2] for f in faces); y1 = max(f[1]+f[3] for f in faces)
    cx, cy = (x0+x1)/2, (y0+y1)/2
    bw, bh = x1-x0, y1-y0
    nw, nh = bw*(1+MARGIN), bh*(1+MARGIN)

    # enforce target aspect ratio
    if nw/nh < aspect:
        nw = nh*aspect
    else:
        nh = nw/aspect

    # center then clamp inside the image
    nx0, ny0 = cx-nw/2, cy-nh/2
    nx0 = max(0, min(nx0, w-nw))
    ny0 = max(0, min(ny0, h-nh))
    nx0, ny0 = int(round(nx0)), int(round(ny0))
    nw, nh = int(round(nw)), int(round(nh))

    crop = img[ny0:ny0+nh, nx0:nx0+nw]
    cv2.imwrite(dst, crop)
    print(f"{src}: {len(faces)} face(s) -> crop {crop.shape[1]}x{crop.shape[0]} -> {dst}")
