from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Image settings
IMG_SIZE = (128, 128)
BATCH_SIZE = 32

# Training image preprocessing
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    zoom_range=0.2,
    horizontal_flip=True
)

# Testing image preprocessing
test_datagen = ImageDataGenerator(
    rescale=1./255
)

# Load training images
train_generator = train_datagen.flow_from_directory(
    'data/train',
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='binary'
)

# Load testing images
test_generator = test_datagen.flow_from_directory(
    'data/test',
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='binary'
)

print("Preprocessing completed successfully!")