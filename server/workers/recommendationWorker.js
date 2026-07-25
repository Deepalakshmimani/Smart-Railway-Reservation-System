import {
    trainRecommendationModel
} from "../services/recommendationService.js";

export default function startRecommendationWorker() {

    console.log("🚀 Recommendation Worker Started");

    setInterval(async () => {
        try {
            await trainRecommendationModel();
        } catch (err) {
            console.error("Recommendation Worker Error:", err);
        }
    }, 30000);

}