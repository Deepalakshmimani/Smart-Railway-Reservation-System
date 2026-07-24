"""
preprocess.py
-------------
Performs data cleaning and preprocessing
for the Recommendation Engine.
"""

import logging

import pandas as pd
import numpy as np

from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import MinMaxScaler


class PreprocessingError(Exception):
    """Custom exception for preprocessing."""
    pass
  
  
def _remove_duplicates(df):

    logging.info("Removing duplicate records...")

    before = len(df)

    df = df.drop_duplicates()

    after = len(df)

    logging.info(f"Removed {before-after} duplicate rows.")

    return df
  
  
  
def _standardize_text(df):

    logging.info("Standardizing text columns...")

    text_columns = [

        "cleanliness_rating",

        "comfort_rating",

        "timing_rating",

        "staff_rating",

        "travel_type"

    ]

    for col in text_columns:

        if col in df.columns:

            df[col] = (

                df[col]

                .astype(str)

                .str.strip()

                .str.title()

            )

    return df
  
  
  
def _handle_missing_values(df):

    logging.info("Handling missing values...")

    numerical_columns = [

        "overall_rating"

    ]

    for col in numerical_columns:

        if col in df.columns:

            df[col] = df[col].fillna(df[col].mean())

    categorical_columns = [

        "travel_type"

    ]

    for col in categorical_columns:

        if col in df.columns:

            mode = df[col].mode()

            if len(mode):

                df[col] = df[col].fillna(mode[0])

    return df
  
  
  
RATING_MAP = {

    "Poor":1,

    "Average":2,

    "Good":3,

    "Very Good":4,

    "Excellent":5

}



def _convert_feedback_ratings(df):

    logging.info("Converting feedback ratings...")

    rating_columns = [

        "cleanliness_rating",

        "comfort_rating",

        "timing_rating",

        "staff_rating"

    ]

    for col in rating_columns:

        if col in df.columns:

            df[col] = df[col].map(RATING_MAP)

    return df
  

def _encode_features(df):

    logging.info("Encoding categorical variables...")

    encoder = LabelEncoder()

    categorical_columns = [

        "travel_type"

    ]

    encoders = {}

    for col in categorical_columns:

        if col in df.columns:

            df[col] = encoder.fit_transform(df[col])

            encoders[col] = encoder

    return df, encoders
  
  
def _scale_features(df):

    logging.info("Scaling numerical features...")

    scaler = MinMaxScaler()

    numerical_columns = [

        "overall_rating"

    ]

    df[numerical_columns] = scaler.fit_transform(

        df[numerical_columns]

    )

    return df, scaler
  
  
def preprocess_data(df):

    logging.info("Starting preprocessing...")

    df = _remove_duplicates(df)

    df = _standardize_text(df)

    df = _handle_missing_values(df)

    df = _convert_feedback_ratings(df)

    df, encoders = _encode_features(df)

    df, scaler = _scale_features(df)

    logging.info("Preprocessing completed successfully.")

    return df, scaler, encoders