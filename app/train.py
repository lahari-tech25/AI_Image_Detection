from preprocess import train_generator, test_generator
from model import create_model
import matplotlib.pyplot as plt
import os

# Create CNN model
model = create_model()

# Train the model
history = model.fit(
    train_generator,
    validation_data=test_generator,
    epochs=5
)

# Create folder if not exists
os.makedirs("saved_models", exist_ok=True)

# Save trained model
model.save("saved_models/model.keras")

print("Model saved successfully!")

# Create output folder
os.makedirs("output", exist_ok=True)

# Accuracy Graph
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')

plt.title("Accuracy Graph")
plt.xlabel("Epochs")
plt.ylabel("Accuracy")
plt.legend()

plt.savefig("output/accuracy_graph.png")
plt.show()

# Loss Graph
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')

plt.title("Loss Graph")
plt.xlabel("Epochs")
plt.ylabel("Loss")
plt.legend()

plt.savefig("output/loss_graph.png")
plt.show()

print("Training completed successfully!")