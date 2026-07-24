"""
explain.py
----------

Generates human-readable explanations for
recommended trains.
"""

import logging


class ExplanationError(Exception):
    """Custom exception for explanation generation."""
    pass
  
def _coach_reason(user, train):

    if "coach_type" not in train.index:
        return None

    if train["coach_type"] == user["preferred_coach"]:
        return "Matches your preferred coach type"

    return None
  
def _departure_reason(user, train):

    if train["departure_period"] == user["preferred_period"]:

        return (
            f"Matches your preferred "
            f"{train['departure_period'].lower()} travel"
        )

    return None
  
def _duration_reason(user, train):

    difference = abs(

        user["preferred_duration"]

        -

        train["duration_minutes"]

    )

    if difference <= 30:

        return "Journey duration is similar to your previous trips"

    return None
  
def _rating_reason(train):

    if train["train_rating"] >= 4.5:

        return "Highly rated by passengers"

    elif train["train_rating"] >= 4:

        return "Good passenger ratings"

    return None
  
def _service_reason(train):

    if train["service_quality"] >= 4.5:

        return "Excellent comfort and cleanliness"

    elif train["service_quality"] >= 4:

        return "Good onboard service quality"

    return None
  
def _popularity_reason(train):

    if train["popularity_score"] >= 0.80:

        return "Popular among travelers"

    return None
  
def _confidence_reason(user):

    confidence = user["confidence_score"]

    if confidence >= 0.80:

        return (
            "Recommendation is based on "
            "strong travel history"
        )

    elif confidence >= 0.50:

        return (
            "Recommendation combines your "
            "preferences and popular trains"
        )

    return (
        "Recommendation is mainly based "
        "on popular trains"
    )
    
def generate_explanation(

        user,

        train

):

    """
    Returns explanation list.
    """

    try:

        reasons = []

        checks = [

            _coach_reason(user, train),

            _departure_reason(user, train),

            _duration_reason(user, train),

            _rating_reason(train),

            _service_reason(train),

            _popularity_reason(train),

            _confidence_reason(user)

        ]

        for item in checks:

            if item:

                reasons.append(item)

        if not reasons:

            reasons.append(

                "Recommended based on overall similarity"

            )

        return reasons

    except Exception as e:

        raise ExplanationError(str(e))