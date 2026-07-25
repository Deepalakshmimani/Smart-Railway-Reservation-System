const { spawn } = require("child_process");
const path = require("path");
const db = require("../config/db");

exports.getRecommendations = async (req, res) => {

    try {

        const userId = req.user.id;

        const python = spawn(
            "python",
            [
                path.join(
                    __dirname,
                    "../recommendation/predict_api.py"
                ),
                userId
            ]
        );

        let output = "";
        let errorOutput = "";

        python.stdout.on("data", (data) => {
            output += data.toString();
        });

        python.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        python.on("close", async (code) => {

            if (code !== 0) {

                return res.status(500).json({
                    success: false,
                    message: "Recommendation Engine Failed",
                    error: errorOutput
                });

            }

            const result = JSON.parse(output);

            const recommendations = result.recommendations;

            // Continue here...
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};