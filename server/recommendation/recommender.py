"""
recommender.py
--------------

Generates personalized train recommendations.
"""

import os
import pickle
import logging

import numpy as np
import pandas as pd

from sklearn.metrics.pairwise import cosine_similarity

from explain import generate_explanation

class RecommendationError(Exception):
    """Custom Recommendation Exception"""
    pass
  
MODEL_DIR = "models"


def _load(filename):

    path = os.path.join(MODEL_DIR, filename)

    with open(path, "rb") as file:
        return pickle.load(file)
      
class RecommendationEngine:

    def __init__(self):

        logging.info("Loading recommendation artifacts...")

        self.preprocessor = _load("encoder.pkl")

        self.train_vectors = _load("train_vectors.pkl")

        self.train_matrix = _load("train_matrix.pkl")

        self.user_profiles = _load("user_profiles.pkl")
        
    def _get_user(self, user_id):

        user = self.user_profiles[

            self.user_profiles["user_id"] == user_id

        ]

        if user.empty:

            return None

        return user.iloc[0]
      
      
    def _global_recommendation(self, top_n=5):

        trains = self.train_matrix.copy()

        trains["score"] = (

            0.6 * trains["train_rating"]

            +

            0.4 * trains["popularity_score"]

        )

        return trains.sort_values(

            "score",

            ascending=False

        ).head(top_n)
        
        
    def _create_user_vector(self, user):

        temp = pd.DataFrame({

            "departure_period":[

                user["preferred_period"]

            ],

            "train_rating":[

                user["average_rating"]

            ],

            "service_quality":[

                user["average_service_quality"]

            ],

            "duration_minutes":[

                user["preferred_duration"]

            ],

            "popularity_score":[1]

        })

        return self.preprocessor.transform(temp)
      
      
    def _personalized(self,

                      user,

                      top_n=5):

        vector = self._create_user_vector(user)

        similarity = cosine_similarity(

            vector,

            self.train_vectors

        )[0]

        result = self.train_matrix.copy()

        result["similarity"] = similarity

        return result.sort_values(

            "similarity",

            ascending=False

        ).head(top_n)
        
    def _hybrid(self,

                user,

                personalized):

        confidence = user["confidence_score"]

        global_score = (

            0.6 *

            personalized["train_rating"]

            +

            0.4 *

            personalized["popularity_score"]

        )

        personalized["final_score"] = (

            confidence *

            personalized["similarity"]

            +

            (1-confidence)

            *

            global_score

        )

        return personalized.sort_values(

            "final_score",

            ascending=False

        )
        
        
    def recommend(self,

                  user_id,

                  top_n=5):

        user = self._get_user(user_id)

        if user is None:

            recommendations = (

                self._global_recommendation(top_n)

            )

        else:

            personalized = (

                self._personalized(

                    user,

                    top_n=20

                )

            )

            recommendations = (

                self._hybrid(

                    user,

                    personalized

                ).head(top_n)

            )

        response = []

        for _, train in recommendations.iterrows():

            response.append({

                "train_id":

                    int(train["train_id"]),

                "train_name":

                    train["train_name"],

                "score":

                    round(

                        float(

                            train.get(

                                "final_score",

                                train.get(

                                    "score",

                                    0

                                )

                            )

                        ),

                        3

                    ),

                "reason":

                    generate_explanation(

                        user,

                        train

                    )

                    if user is not None

                    else

                    [

                        "Popular train",

                        "Highly rated"

                    ]

            })

        return response