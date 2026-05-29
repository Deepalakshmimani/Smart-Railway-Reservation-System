import jwt from "jsonwebtoken";

export const authAdmin = async (req, res, next) => {

    const { adminToken } = req.cookies;

    console.log(req.cookies);

    if (!adminToken) {

        return res.json({
            success: false,
            message: "Not Authorized"
        });
    }

    try {

        const tokenDecode = jwt.verify(
            adminToken,
            process.env.JWT_SECRET
        );

        if (tokenDecode.email===process.env.ADMIN_EMAIL) {

           next();

        } else {

            return res.json({
                success: false,
                message: "Not Authorized"
            });
        }

        

    } catch (error) {

        console.log(error.message);

        return res.json({
            success: false,
            message: error.message
        });
    }
};