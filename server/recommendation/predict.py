from recommender import RecommendationEngine

engine = RecommendationEngine()
recommendations = engine.recommend(user_id=2, top_n=5)

for train in recommendations:
    print(train)