import json
import sys
import logging

from recommender import RecommendationEngine

logging.disable(logging.CRITICAL)


def main():

    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "message": "User ID is required"
        }))
        return

    user_id = int(sys.argv[1])

    engine = RecommendationEngine()

    recommendations = engine.recommend(
        user_id=user_id,
        top_n=3
    )

    print(json.dumps({
        "success": True,
        "recommendations": recommendations
    }))


if __name__ == "__main__":
    main()