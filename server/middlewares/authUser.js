import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {

    const { token } = req.cookies;

    console.log(req.cookies);

    if (!token) {

        return res.json({
            success: false,
            message: "Not Authorized"
        });
    }

    try {

        const tokenDecode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (tokenDecode.id) {

            req.user = {id:tokenDecode.id};

        } else {

            return res.json({
                success: false,
                message: "Not Authorized"
            });
        }

        next();

    } catch (error) {

        console.log(error.message);

        return res.json({
            success: false,
            message: error.message
        });
    }
};