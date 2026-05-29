import db from "../configs/db.js";

export const createNotification =
async (

  userId,
  title,
  message

) => {

  try {

    await db.execute(

      `
      INSERT INTO notifications (

        user_id,

        title,

        message

      )

      VALUES (?, ?, ?)
      `,

      [

        userId,

        title,

        message
      ]
    );

  } catch (error) {

    console.log(error);
  }
};