"""
feature_engineering.py
----------------------
Creates train features and user profiles for the
Railway Recommendation Engine.

Responsibilities
----------------
1. Calculate journey duration
2. Calculate departure period
3. Calculate service quality
4. Calculate popularity score
5. Build train feature matrix
6. Build user profile matrix
7. Calculate confidence score
"""

import logging
import numpy as np
import pandas as pd



class FeatureEngineeringError(Exception):
    """Custom exception for feature engineering."""
    pass
  
def _calculate_duration(df):

    logging.info("Calculating journey duration...")

    departure = df["departure_time"]

    arrival = df["arrival_time"]

    duration = (arrival - departure).dt.total_seconds() / 60

    # Overnight trains
    duration = np.where(duration < 0, duration + 1440, duration)

    df["duration_minutes"] = duration

    return df
  
  

def _get_departure_period(hour):

    if 5 <= hour < 12:
        return "Morning"

    elif 12 <= hour < 17:
        return "Afternoon"

    elif 17 <= hour < 21:
        return "Evening"

    return "Night"
  
  
def _calculate_departure_period(df):

    logging.info("Creating departure period feature...")

    hours = df["departure_time"].dt.components.hours

    df["departure_period"] = hours.apply(_get_departure_period)

    return df
  
  
def _calculate_service_quality(df):

    logging.info("Calculating service quality...")

    rating_columns = [
        "comfort_rating",
        "cleanliness_rating",
        "timing_rating",
        "staff_rating"
    ]

    # Fill missing ratings with a neutral value
    df[rating_columns] = df[rating_columns].fillna(3)

    df["service_quality"] = df[rating_columns].mean(axis=1)

    return df
  
def _calculate_popularity(df):

    logging.info("Calculating popularity score...")

    booking_counts = (

        df.groupby("train_id")

        .size()

        .reset_index(name="booking_count")

    )

    max_bookings = booking_counts["booking_count"].max()

    booking_counts["popularity_score"] = (

        booking_counts["booking_count"]

        / max_bookings

    )

    df = df.merge(

        booking_counts[

            ["train_id", "popularity_score"]

        ],

        on="train_id",

        how="left"

    )

    return df
  
  
def _build_train_features(df):

    logging.info("Building train feature matrix...")

    train_features = (

        df.groupby("train_id")

        .agg({

            "train_name":"first",

            "train_rating":"mean",

            "service_quality":"mean",

            "duration_minutes":"mean",

            "popularity_score":"first",

            "departure_period":lambda x:x.mode()[0]

        })

        .reset_index()

    )

    return train_features
  
  
def _calculate_consistency(series):

    if len(series) == 0:
        return 0

    return (

        series.value_counts().iloc[0]

        / len(series)

    )
    
    
def _calculate_confidence(group):

    booking_score = min(

        len(group) / 5,

        1

    )

    feedback_score = (

        group["overall_rating"]

        .notna()

        .sum()

        / max(len(group),1)

    )

    coach_consistency = _calculate_consistency(

        group["coach_type"]

    )

    period_consistency = _calculate_consistency(

        group["departure_period"]

    )

    travel_consistency = _calculate_consistency(

        group["travel_type"]

    )

    preference_consistency = (

        coach_consistency

        + period_consistency

        + travel_consistency

    ) / 3

    confidence = (

        0.5 * booking_score

        + 0.3 * feedback_score

        + 0.2 * preference_consistency

    )

    return round(confidence,2)
  
  
def _build_user_profiles(df):

    logging.info("Building user profiles...")

    profiles = []

    for user_id, group in df.groupby("user_id"):

        profile = {

            "user_id": user_id,

            "preferred_coach": group["coach_type"].mode()[0],

            "preferred_period": group["departure_period"].mode()[0],

            "preferred_travel_type": group["travel_type"].mode()[0],

            "average_rating": group["overall_rating"].fillna(3).mean(),

            "average_service_quality": group["service_quality"].fillna(3).mean(),

            "preferred_duration": group["duration_minutes"].mean(),

            "confidence_score": _calculate_confidence(group)

        }

        profiles.append(profile)

    return pd.DataFrame(profiles)
  
  
def create_feature_matrices(df):

    """
    Creates Train Feature Matrix
    and User Profile Matrix.
    """

    try:

        logging.info("Starting Feature Engineering...")

        df = _calculate_duration(df)

        df = _calculate_departure_period(df)

        df = _calculate_service_quality(df)

        df = _calculate_popularity(df)

        train_matrix = _build_train_features(df)

        user_profiles = _build_user_profiles(df)

        logging.info("Feature Engineering Completed.")

        return train_matrix, user_profiles

    except Exception as e:

        raise FeatureEngineeringError(str(e))