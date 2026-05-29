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

        ac_sleeper_price,
        sleeper_price,
        chair_car_price,
        general_price

      } = req.body;

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

export const getTrains =
async (req, res) => {

  try {

    const [trains] =
    await db.execute(

      `
      SELECT

        t.train_id,

        t.train_name,

        t.train_no,

        t.departure_time,

        t.arrival_time,

        t.rating,

        s1.station_name
        AS source_station,

        s2.station_name
        AS destination_station,

        MIN(c.base_price)
        AS starting_price,

        GROUP_CONCAT(
          DISTINCT c.coach_type
        )
        AS coach_types

      FROM trains t

      JOIN stations s1
      ON t.source_station_id =
      s1.station_id

      JOIN stations s2
      ON t.destination_station_id =
      s2.station_id

      JOIN coaches c
      ON c.train_id =
      t.train_id

      WHERE t.is_active = true

      GROUP BY t.train_id
      `
    );

    /* Duration */

    const formatted =
    trains.map((train) => {

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

      return {

        ...train,

        duration:
        `${hours}h ${minutes}m`
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

    return res.json({

      success: true,

      trains

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

    const { scheduleId } =
    req.params;

    /* =========================
       TRAIN DETAILS
    ========================= */

    const [trainRows] =
    await db.execute(

      `
      SELECT

        ts.schedule_id,

        ts.travel_date,

        t.train_id,

        t.train_name,

        t.train_no,

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

        c.base_price,

        COUNT(
          CASE
          WHEN sa.status =
          'AVAILABLE'
          THEN 1
          END
        )
        AS available_seats

      FROM coaches c

      JOIN seats se
      ON se.coach_id =
      c.coach_id

      JOIN seat_availability sa
      ON sa.seat_id =
      se.seat_id

      WHERE

      sa.schedule_id = ?

      AND c.train_id = ?

      GROUP BY

      c.coach_type,
      c.base_price
      `,

      [
        scheduleId,
        train.train_id
      ]
    );

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