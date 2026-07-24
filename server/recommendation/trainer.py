"""
trainer.py
----------

Creates vectors required for train recommendation.

Responsibilities
----------------
1. Encode categorical features
2. Scale numerical features
3. Build train vectors
4. Build user vectors
5. Compute similarity matrix
6. Save trained artifacts
"""

import os
import pickle
import logging

import pandas as pd

from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import MinMaxScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics.pairwise import cosine_similarity


class TrainingError(Exception):
    """Custom training exception."""
    pass
  
MODEL_DIR = "models"

os.makedirs(MODEL_DIR, exist_ok=True)


def _save_object(obj, filename):

    path = os.path.join(MODEL_DIR, filename)

    with open(path, "wb") as file:

        pickle.dump(obj, file)

    logging.info(f"Saved {filename}")
    
    
def _prepare_train_vectors(train_matrix):

    logging.info("Preparing train vectors...")

    categorical = [

        "departure_period"

    ]

    numerical = [

        "train_rating",

        "service_quality",

        "duration_minutes",

        "popularity_score"

    ]

    preprocessor = ColumnTransformer(

        transformers=[

            (

                "cat",

                OneHotEncoder(handle_unknown="ignore"),

                categorical

            ),

            (

                "num",

                MinMaxScaler(),

                numerical

            )

        ]

    )

    train_vectors = preprocessor.fit_transform(

        train_matrix[categorical + numerical]

    )

    return train_vectors, preprocessor
  

def _prepare_user_vectors(user_profiles, preprocessor):

    logging.info("Preparing user vectors...")

    temp = pd.DataFrame({

        "departure_period":

            user_profiles["preferred_period"],

        "train_rating":

            user_profiles["average_rating"],

        "service_quality":

            user_profiles["average_service_quality"],

        "duration_minutes":

            user_profiles["preferred_duration"],

        "popularity_score":

            1.0

    })

    user_vectors = preprocessor.transform(temp)

    return user_vectors
  
def _compute_similarity(

        user_vectors,

        train_vectors

):

    logging.info("Computing cosine similarity...")

    similarity = cosine_similarity(

        user_vectors,

        train_vectors

    )

    return similarity
  
  
def train_model(

        train_matrix,

        user_profiles

):

    try:

        logging.info("Training Recommendation Model...")

        train_vectors, preprocessor = (

            _prepare_train_vectors(train_matrix)

        )

        user_vectors = (

            _prepare_user_vectors(

                user_profiles,

                preprocessor

            )

        )

        similarity = (

            _compute_similarity(

                user_vectors,

                train_vectors

            )

        )

        _save_object(

            preprocessor,

            "encoder.pkl"

        )

        _save_object(

            train_vectors,

            "train_vectors.pkl"

        )

        _save_object(

            user_vectors,

            "user_vectors.pkl"

        )

        _save_object(

            similarity,

            "similarity.pkl"

        )

        _save_object(

            train_matrix,

            "train_matrix.pkl"

        )

        _save_object(

            user_profiles,

            "user_profiles.pkl"

        )

        logging.info("Training Completed Successfully.")

    except Exception as e:

        raise TrainingError(str(e))