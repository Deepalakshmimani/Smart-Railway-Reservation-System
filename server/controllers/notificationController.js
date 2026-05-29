import db from "../configs/db.js";


export const getNotifications =
async (req, res) => {

  try {

    const userId =
    req.user.id;

    const [notifications] =
    await db.execute(

      `
      SELECT *

      FROM notifications

      WHERE user_id = ?

      ORDER BY created_at DESC
      `,

      [userId]
    );

    return res.json({

      success: true,

      notifications
    });

  } catch (error) {

    console.log(error);

    return res.json({

      success: false,

      message:
      error.message
    });
  }
};