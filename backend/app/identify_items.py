from transformers import SegformerImageProcessor, AutoModelForSemanticSegmentation
from PIL import Image
import matplotlib.pyplot as plt
import torch.nn as nn

# do the weights need to be loaded every time??

# works well for images with a high contrast background
processor = SegformerImageProcessor.from_pretrained("mattmdjaga/segformer_b2_clothes")
model = AutoModelForSemanticSegmentation.from_pretrained("mattmdjaga/segformer_b2_clothes")

# change this later to whatever the user has uploaded


image_path = "C:/dev/personal-learning/wardrobe_manager/backend/app/standing_on_bed.jpg"

image = Image.open(image_path)
inputs = processor(images=image, return_tensors="pt")

outputs = model(**inputs)
logits = outputs.logits.cpu()

upsampled_logits = nn.functional.interpolate(
    logits,
    size=image.size[::-1],
    mode="bilinear",
    align_corners=False,
)

pred_seg = upsampled_logits.argmax(dim=1)[0]

ATR_LABELS = [
    "background", "hat", "hair", "sunglasses", "upper-clothes", "skirt",
    "pants", "dress", "belt", "left-shoe", "right-shoe", "face",
    "left-leg", "right-leg", "left-arm", "right-arm", "bag", "scarf"
]

pred_seg_np = pred_seg.numpy()
present_ids = sorted(set(pred_seg_np.flatten().tolist()))

plt.imshow(pred_seg_np)
cbar = plt.colorbar()
cbar.set_ticks(present_ids)
cbar.set_ticklabels([f"{i}: {ATR_LABELS[i]}" for i in present_ids])
plt.title("Segmentation map")
plt.show()