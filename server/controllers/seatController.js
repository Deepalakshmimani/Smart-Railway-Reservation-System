import db from "../configs/db.js";

export const getSeats = async (req, res) => {
   
   

    try {

        const { scheduleId, coachType } = req.params;

        const [rows] = await db.execute(

            `
            SELECT

                c.coach_id,

                c.coach_name,

                c.coach_type,

                s.seat_id,

                s.seat_number,

                sa.status

            FROM seats s

            JOIN coaches c
            ON c.coach_id = s.coach_id

            JOIN seat_availability sa
            ON sa.seat_id = s.seat_id

            WHERE

                sa.schedule_id = ?
                AND c.coach_type = ?

            ORDER BY c.coach_name,
                  CAST(s.seat_number AS UNSIGNED)
            `,

            [

                scheduleId,
                coachType

            ]

        );

        return res.json({

            success:true,

            seats:rows

        });

    }

    catch(error){

        console.log(error);

        return res.json({

            success:false,

            message:error.message

        });

    }

};