from data_loader import load_complete_dataset
from preprocess import preprocess_data
from feature_engineering import create_feature_matrices
from trainer import train_model


print("Loading data...")
df = load_complete_dataset()

print("Preprocessing...")
df, scaler, encoders = preprocess_data(df)


print("Creating features...")
train_matrix, user_profiles = create_feature_matrices(df)


print("Training...")
train_model(train_matrix, user_profiles)

print("Training completed successfully!")