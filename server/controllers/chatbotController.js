import axios from "axios";

export const chatWithAI = async (req, res) => {
    try {

        const {
            message,
            conversation_id = ""
        } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required."
            });
        }

        const response = await axios.post(
            "https://api.dify.ai/v1/chat-messages",
            {
                inputs: {},
                query: message,
                response_mode: "blocking",
                conversation_id,
                user: "railgo-user"
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.json({
            success: true,
            answer: response.data.answer,
            conversation_id: response.data.conversation_id
        });

    } catch (err) {

        console.error(
            "Dify Error:",
            err.response?.data || err.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to communicate with RailGo AI Assistant."
        });
    }
};