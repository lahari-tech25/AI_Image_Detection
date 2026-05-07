from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np

# Load trained model
model = load_model('saved_models/model.keras')

# Image path
img_path = 'sample.jpg'   # Replace with your image name

# Load image
img = image.load_img(
    img_path,
    target_size=(128, 128)
)

# Convert image to array
img_array = image.img_to_array(img)

# Normalize image
img_array = img_array / 255.0

# Add batch dimension
img_array = np.expand_dims(img_array, axis=0)

# Predict
prediction = model.predict(img_array)

# Output result
if prediction[0][0] > 0.5:
    print("Fake Image Detected")
else:
    print("Real Image Detected")