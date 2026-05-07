from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D
from tensorflow.keras.layers import Flatten, Dense

def create_model():

    model = Sequential()

    # First Convolution Layer
    model.add(Conv2D(
        32,
        (3, 3),
        activation='relu',
        input_shape=(128, 128, 3)
    ))

    # First Pooling Layer
    model.add(MaxPooling2D(pool_size=(2, 2)))

    # Second Convolution Layer
    model.add(Conv2D(
        64,
        (3, 3),
        activation='relu'
    ))

    # Second Pooling Layer
    model.add(MaxPooling2D(pool_size=(2, 2)))

    # Convert 2D to 1D
    model.add(Flatten())

    # Fully Connected Layer
    model.add(Dense(
        128,
        activation='relu'
    ))

    # Output Layer
    model.add(Dense(
        1,
        activation='sigmoid'
    ))

    # Compile Model
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )

    return model