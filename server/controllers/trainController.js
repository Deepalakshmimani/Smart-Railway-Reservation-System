import db from "../configs/db.js";

import {generateCoaches} from "../services/coachService.js";

import {generateSchedules} from "../services/scheduleService.js";

import {generateSeatAvailability} from "../services/seatService.js";

//Add Train

export const addTrain =
  async (req, res) => {

    const connection =
      await db.getConnection();

    try {

      await connection.beginTransaction();

      const {

        train_name,
        train_no,

        source_station_id,
        destination_station_id,

        departure_time,
        arrival_time,

        running_days,

        ac_sleeper_coaches,
        sleeper_coaches,
        chair_car_coaches,
        general_coaches,

        base_price

      } = req.body;


      const PRICE_MULTIPLIER = {

          GENERAL:1,

          CHAIR_CAR:1.25,

          SLEEPER:1.5,

          AC_SLEEPER:2.2

      };


      const general_price =
      Number(base_price)
      *
      PRICE_MULTIPLIER.GENERAL;

      const chair_car_price =
      Number(base_price)
      *
      PRICE_MULTIPLIER.CHAIR_CAR;

      const sleeper_price =
      Number(base_price)
      *
      PRICE_MULTIPLIER.SLEEPER;

      const ac_sleeper_price =
      Number(base_price)
      *
      PRICE_MULTIPLIER.AC_SLEEPER;

      /* Validation */

      if (
        !train_name ||
        !train_no ||
        !source_station_id ||
        !destination_station_id ||
        !departure_time ||
        !arrival_time
      ) {

        return res.json({

          success: false,
          message:
            "Missing Details"

        });
      }

      /* Check Existing Train */

      const [existingTrain] =
        await connection.execute(

          `SELECT *
           FROM trains
           WHERE train_no = ?`,

          [train_no]
        );

      if (
        existingTrain.length > 0
      ) {

        return res.json({

          success: false,

          message:
            "Train already exists"

        });
      }

      
      /* Insert Train */
      
      const [trainResult] =
        await connection.execute(

          `INSERT INTO trains
          (
            train_name,
            train_no,

            source_station_id,
            destination_station_id,

            departure_time,
            arrival_time,

            running_days
          )

          VALUES (?, ?, ?, ?, ?, ?, ?)`,

          [

            train_name,
            train_no,

            source_station_id,
            destination_station_id,

            departure_time,
            arrival_time,

            JSON.stringify(
              running_days
            )

          ]
        );

      const trainId =
        trainResult.insertId;
      

        /* Generate Coaches*/

      const coachIds =
        await generateCoaches(

          connection,

          trainId,

          {

            ac_sleeper_coaches,
            sleeper_coaches,
            chair_car_coaches,
            general_coaches,

            ac_sleeper_price,
            sleeper_price,
            chair_car_price,
            general_price

          }
        );



      /* GENERATE SCHEDULES */

      const scheduleIds =
        await generateSchedules(

          connection,

          trainId,

          running_days
        );

      /* GENERATE AVAILABILITY */

      await generateSeatAvailability(

        connection,

        coachIds,

        scheduleIds
      );

      await connection.commit();

      return res.json({

        success: true,

        message:
          "Train Added Successfully"

      });

    } catch (error) {

      await connection.rollback();

      console.log(error);

      return res.json({

        success: false,
        message: error.message

      });

    } finally {

      connection.release();
    }
  };



/* GET TRAINS */

export const getTrains = async (req, res) => {
  try {

    const isActive =
  req.query.is_active === undefined
    ? true
    : req.query.is_active === "true";

    console.log("isActive:", isActive);
    const [trains] = await db.execute(
      `
      SELECT
        t.train_id,
        
        t.train_name,
        t.train_no,
        t.departure_time,
        t.arrival_time,
        t.running_days,
        t.is_active,
        t.rating,
        s1.station_name AS source_station,
        s2.station_name AS destination_station,
        MIN(c.base_price) AS starting_price,
        GROUP_CONCAT(DISTINCT c.coach_type) AS coach_types,
        COUNT(DISTINCT c.coach_id) AS coaches,
        SUM(c.total_seats) AS total_seats
      FROM trains t
      
      JOIN stations s1 ON t.source_station_id = s1.station_id
      JOIN stations s2 ON t.destination_station_id = s2.station_id
      JOIN coaches c ON c.train_id = t.train_id
  
      WHERE t.is_active = ?
      GROUP BY t.train_id
      `,[isActive]
    );

    /* Duration & Formatting */
    const formatted = trains.map((train) => {
      const departure = new Date(`1970-01-01T${train.departure_time}`);
      const arrival = new Date(`1970-01-01T${train.arrival_time}`);

      let diff = (arrival - departure) / (1000 * 60);

      /* Overnight Train */
      if (diff < 0) {
        diff += 24 * 60;
      }

      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      
      return {

          ...train,

          duration: `${hours}h ${minutes}m`,

          runningDays: train.running_days || [],

          status: train.is_active ? "Available" : "Cancelled",

          coaches: train.coaches,

          totalSeats: train.total_seats

      };
    });

    return res.json({
      success: true,
      trains: formatted
    });

  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message
    });
  }
};


export const searchTrains =
async (req, res) => {

  try {

    const {

      from,
      to,
      date

    } = req.query;

    /* Validation */

    if (
      !from ||
      !to ||
      !date
    ) {

      return res.json({

        success: false,

        message:
        "Missing Details"

      });
    }

    /* Search Query */

    const [trains] =
    await db.execute(

      `
      SELECT

        ts.schedule_id,

        t.train_id,

        t.train_name,

        t.train_no,

        t.departure_time,

        t.arrival_time,

        s1.station_name
        AS source_station,

        s2.station_name
        AS destination_station

      FROM trains t

      JOIN stations s1
      ON s1.station_id =
      t.source_station_id

      JOIN stations s2
      ON s2.station_id =
      t.destination_station_id

      JOIN train_schedule ts
      ON ts.train_id =
      t.train_id

      WHERE

      s1.station_name = ?

      AND s2.station_name = ?

      AND ts.travel_date = ?

      AND t.is_active = true

      GROUP BY ts.schedule_id
      `,

      [from, to, date]
    );
    


    const formatted = trains.map((train) => ({

      ...train,

      train: train.train_name,

      source: train.source_station,

      destination: train.destination_station,

      departure: train.departure_time,

      arrival: train.arrival_time

    }));


    console.log(formatted);
    return res.json({

      success: true,

      trains: formatted

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


//Get specific train details

export const getTrainDetails =
async (req, res) => {

  try {

    const { scheduleId  } =
    req.params;


    
    

    

    

    const [trainRows] =
    await db.execute(

      `
      SELECT

        ts.schedule_id,

        ts.travel_date,

        t.train_id,

        t.train_name,

        t.train_no,

        t.rating,

        t.departure_time,

        t.arrival_time,

        s1.station_name
        AS source_station,

        s2.station_name
        AS destination_station,

        MIN(c.base_price)
        AS starting_price,

        GROUP_CONCAT(
          DISTINCT c.coach_type
        )
        AS coach_types,

        COUNT(
          CASE
          WHEN sa.status =
          'AVAILABLE'
          THEN 1
          END
        )
        AS available_seats

      FROM train_schedule ts

      JOIN trains t
      ON ts.train_id =
      t.train_id

      JOIN stations s1
      ON s1.station_id =
      t.source_station_id

      JOIN stations s2
      ON s2.station_id =
      t.destination_station_id

      JOIN coaches c
      ON c.train_id =
      t.train_id

      JOIN seats se
      ON se.coach_id =
      c.coach_id

      JOIN seat_availability sa
      ON sa.seat_id =
      se.seat_id

      AND sa.schedule_id =
      ts.schedule_id

      WHERE

      ts.schedule_id = ?

      AND t.is_active = true

      GROUP BY ts.schedule_id
      `,

      [scheduleId]
    );

    /* Train Not Found */

    if (
      trainRows.length === 0
    ) {

      return res.json({

        success: false,

        message:
        "Train not found"

      });
    }

    /* =========================
       DURATION
    ========================= */

    const train =
    trainRows[0];
    train.schedule_id = scheduleId;

    const departure =
    new Date(
      `1970-01-01T${train.departure_time}`
    );

    const arrival =
    new Date(
      `1970-01-01T${train.arrival_time}`
    );

    let diff =
    (arrival - departure)
    / (1000 * 60);

    /* Overnight Train */

    if (diff < 0) {

      diff += 24 * 60;
    }

    const hours =
    Math.floor(diff / 60);

    const minutes =
    diff % 60;

    train.duration =
    `${hours}h ${minutes}m`;

    /* =========================
       COACH DETAILS
    ========================= */


    const [coachRows] =
    await db.execute(

      `
      SELECT

        c.coach_type,

        MIN(c.base_price) AS base_price,

        COUNT(DISTINCT c.coach_id) AS coaches,

        SUM(
            CASE
                WHEN sa.status = 'AVAILABLE'
                THEN 1
                ELSE 0
            END
        ) AS available_seats

    FROM coaches c

    JOIN seats se
    ON se.coach_id = c.coach_id

    JOIN seat_availability sa
    ON sa.seat_id = se.seat_id

    WHERE
        sa.schedule_id = ?
        AND c.train_id = ?

    GROUP BY
        c.coach_type

    ORDER BY
        MIN(c.base_price);
      `,

      [
        scheduleId,
        train.train_id
      ]
    );


    train.coaches = coachRows.length;

    train.totalSeats = coachRows.reduce(

        (sum, coach) =>

            sum + Number(coach.available_seats),

        0

    );

    train.status = "Available";

    /* =========================
       RESPONSE
    ========================= */

    return res.json({

      success: true,

      train,

      coaches:
      coachRows

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



export const getRecommendedTrains = async (req, res) => {

    try {

        const [trains] = await db.execute(

            `
            SELECT

                t.train_id,
                t.train_name,
                t.train_no,
                t.departure_time,
                t.arrival_time,
                t.rating,

                s1.station_name AS source_station,
                s2.station_name AS destination_station,

                MIN(c.base_price) AS starting_price,

                GROUP_CONCAT(DISTINCT c.coach_type) AS coach_types,

                COUNT(DISTINCT c.coach_id) AS coaches,

                SUM(c.total_seats) AS totalSeats

            FROM trains t

            JOIN stations s1
                ON t.source_station_id = s1.station_id

            JOIN stations s2
                ON t.destination_station_id = s2.station_id

            JOIN coaches c
                ON c.train_id = t.train_id

            WHERE t.is_active = true

            GROUP BY t.train_id

            ORDER BY RAND()

            LIMIT 3
            `
        );

        const formatted = trains.map((train) => {

            const departure =
                new Date(`1970-01-01T${train.departure_time}`);

            const arrival =
                new Date(`1970-01-01T${train.arrival_time}`);

            let diff =
                (arrival - departure) / (1000 * 60);

            if (diff < 0) {

                diff += 24 * 60;

            }

            const hours = Math.floor(diff / 60);
            const minutes = diff % 60;

            return {

                ...train,

                duration: `${hours}h ${minutes}m`

            };

        });

        return res.json({

            success: true,

            trains: formatted

        });

    } catch (error) {

        console.log(error);

        return res.json({

            success: false,

            message: error.message

        });

    }

};
// Update Train

export const updateTrain = async (req, res) => {

  try {

    const { id } = req.params;

    const {

      train_name,
      train_no,

      source_station_id,
      destination_station_id,

      departure_time,
      arrival_time,

      running_days

    } = req.body;

    await db.execute(

      `UPDATE trains
       SET

       train_name = ?,
       train_no = ?,

       source_station_id = ?,
       destination_station_id = ?,

       departure_time = ?,
       arrival_time = ?,

       running_days = ?

       WHERE train_id = ?`,

      [

        train_name,
        train_no,

        source_station_id,
        destination_station_id,

        departure_time,
        arrival_time,

        JSON.stringify(running_days),

        id

      ]

    );

    return res.json({

      success: true,

      message: "Train Updated Successfully"

    });

  }

  catch (error) {

    console.error(error);

    return res.json({

      success: false,

      message: error.message

    });

  }

};


// Get Train By ID (Admin)

export const getTrainById = async (req, res) => {

  try {

    const { id } = req.params;

    const [rows] = await db.execute(

      `SELECT *
       FROM trains
       WHERE train_id = ?`,

      [id]

    );

    if (rows.length === 0) {

      return res.json({

        success: false,

        message: "Train not found"

      });

    }

    const train = rows[0];

    return res.json({

      success: true,

      train: {

        ...train,

        running_days:
          train.running_days || []

      }

    });

  }

  catch (error) {

    console.error(error);

    return res.json({

      success: false,

      message: error.message

    });

  }

};


// Delete Train (Soft Delete)

export const deleteTrain = async (req, res) => {

  try {

    const { id } = req.params;

    await db.execute(

      `UPDATE trains
       SET is_active = false
       WHERE train_id = ?`,

      [id]

    );

    return res.json({

      success: true,

      message: "Train Deleted Successfully"

    });

  }

  catch (error) {

    console.error(error);

    return res.json({

      success: false,

      message: error.message

    });

  }

};


export const restoreTrain = async (req, res) => {

  try {

    const { id } = req.params;
    console.log("Route Param:", id);

    const [result]=await db.execute(

      `UPDATE trains
       SET is_active = true
       WHERE train_id = ?`,

      [id]

    );
    console.log(result);

    return res.json({

      success: true,

      message: "Train Restored Successfully"

    });

  }

  catch (error) {

    console.error(error);

    return res.json({

      success: false,

      message: error.message

    });

  }

};


export const getTrainSchedules = async (req, res) => {

    try {

        const { trainId } = req.params;

        const [rows] = await db.execute(

            `
            SELECT

                schedule_id,

                travel_date

            FROM train_schedule

            WHERE

                train_id = ?

                AND status = 'AVAILABLE'

            ORDER BY travel_date
            `,

            [trainId]

        );

        return res.json({

            success: true,

            schedules: rows

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