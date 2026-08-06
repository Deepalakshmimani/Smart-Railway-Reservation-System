import jwt from "jsonwebtoken";

export const authAdmin = async (req, res, next) => {
    console.log("Cookies:", req.cookies);

    const { adminToken } = req.cookies;

    if (!adminToken) {
        return res.json({
            success: false,
            message: "No adminToken"
        });
    }

    try {
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);

        console.log("Decoded:", decoded);
        console.log("Env Email:", process.env.ADMIN_EMAIL);

        if (decoded.email === process.env.ADMIN_EMAIL) {
            console.log("✅ Auth Success");
            return next();
        }

        console.log("❌ Email Mismatch");

        return res.json({
            success: false,
            message: "Email Mismatch"
        });

    } catch (err) {
        console.log("JWT ERROR:", err);

        return res.json({
            success: false,
            message: err.message
        });
    }
};