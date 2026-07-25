import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// __dirname replacement for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let trainingRequired = false;
let isTraining = false;

export function markRecommendationDirty() {
    trainingRequired = true;
}

export async function trainRecommendationModel() {

    if (!trainingRequired) return;

    if (isTraining) return;

    isTraining = true;
    trainingRequired = false;

    console.log("🚀 Recommendation model training started...");

    const python = spawn(
        "python",
        [path.join(__dirname, "../recommendation/train.py")]
    );

    python.stdout.on("data", (data) => {
        console.log(data.toString());
    });

    python.stderr.on("data", (data) => {
        console.error(data.toString());
    });

    python.on("close", (code) => {


        isTraining = false;

        console.log(
            `✅ Recommendation training finished. Exit Code: ${code}`
        );


        if (trainingRequired) {
            trainRecommendationModel();
        }

    });
}