import pool from "../configs/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User
// POST : /api/user/register

export const register = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "Missing Details"
            });
        }

        const [existingUser] = await pool.query(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );

        if (existingUser.length > 0) {
            return res.json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES (?, ?, ?)`,
            [name, email, hashedPassword]
        );

        const token = jwt.sign(
            { id: result.insertId },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            user: {
                id: result.insertId,
                name,
                email
            }
        });

    } catch (error) {

        console.log(error.message);

        return res.json({
            success: false,
            message: error.message
        });
    }
};



//User login: api/user/login
export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        /* Validation */

        if (!email || !password) {

            return res.json({
                success: false,
                message:
                  "Email and password are required"
            });

        }

        /* Find User */

        const [rows] = await pool.query(

            `SELECT *
             FROM users
             WHERE email = ?`,

            [email]

        );

        /* User Not Found */

        if (rows.length === 0) {

            return res.json({
                success: false,
                message:
                  "Invalid email or password"
            });

        }

        const user = rows[0];

        /* Compare Password */

        const isMatch =
          await bcrypt.compare(
            password,
            user.password
          );

        if (!isMatch) {

            return res.json({
                success: false,
                message:
                  "Invalid email or password"
            });

        }

        /* Create JWT */

        const token = jwt.sign(

            { id: user.user_id },

            process.env.JWT_SECRET,

            { expiresIn: "7d" }

        );

        /* Store Cookie */

        res.cookie("token", token, {

            httpOnly: true,

            secure:
              process.env.NODE_ENV
              === "production",

            sameSite:
              process.env.NODE_ENV
              === "production"
              ? "none"
              : "strict",

            maxAge:
              7 * 24 * 60 * 60 * 1000

        });

        /* Success Response */

        return res.json({

            success: true,

            user: {

                id: user.user_id,

                name: user.name,

                email: user.email,

                role: user.role

            }

        });

    }

    catch (error) {

        console.log(error);

        return res.json({

            success: false,

            message: error.message

        });

    }

};

//Check auth:api/user/isAuth

export const isAuth = async (req, res) => {

    try {

        const { userId } = req.body;

        const [user] = await pool.query(
            `SELECT user_id, name, email
             FROM users
             WHERE user_id = ?`,
            [userId]
        );

        if (user.length === 0) {

            return res.json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            user: user[0]
        });

    } catch (error) {

        console.log(error.message);

        return res.json({
            success: false,
            message: error.message
        });
    }
};

//User logout: api/user/logout

export const logout = async (req, res) => {

    try {

        res.clearCookie("token", {

            httpOnly: true,

            secure:
                process.env.NODE_ENV === "production",

            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "strict"
        });

        return res.json({
            success: true,
            message: "Logged Out"
        });

    } catch (error) {

        console.log(error.message);

        return res.json({
            success: false,
            message: error.message
        });
    }
};