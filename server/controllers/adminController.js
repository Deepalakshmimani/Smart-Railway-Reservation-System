import pool from "../configs/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";





//User login: api/admin/login
export const adminLogin = async (req, res) => {

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

       if(email===process.env.ADMIN_EMAIL&&password===process.env.ADMIN_PASSWORD)
       {
         /* Create JWT */

        const token = jwt.sign(

            { email},

            process.env.JWT_SECRET,

            { expiresIn: "7d" }

        );
       

        /* Store Cookie */

        res.cookie("adminToken", token, {

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

            success: true, message:"Logged in"

        });
      
      }else
      {
         return res.json({

            success: false, message:"Invalid credentials"

        });
      }

    }

    catch (error) {

        console.log(error);

        return res.json({

            success: false,

            message: error.message

        });

    }

};

//Check adminAuth:api/admin/isAuth

export const isAdminAuth = async (req, res) => {

    try {

        return res.json({
            success: true
            
        });

    } catch (error) {

        console.log(error.message);

        return res.json({
            success: false,
            message: error.message
        });
    }
};

//User adminLogout: api/admin/logout

export const adminLogout = async (req, res) => {

    try {

        res.clearCookie("adminToken", {

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