// import db from "../configs/db.js";

// export const createBooking =
// async (req, res) => {

//   const connection =
//   await db.getConnection();

//   try {

//     /* =========================
//        START TRANSACTION
//     ========================= */

//     await connection.beginTransaction();

//     const userId =
//     req.body.userId;

//     const {

//       scheduleId,
//       coachType,
//       tickets,

//       passengerName,
//       gender,
//       age

//     } = req.body;

//     /* =========================
//        VALIDATION
//     ========================= */

//     if (

//       !scheduleId ||

//       !coachType ||

//       !tickets ||

//       !passengerName ||

//       !gender ||

//       !age

//     ) {

//       await connection.rollback();

//       return res.json({

//         success: false,

//         message:
//         "Missing Details"
//       });
//     }

//     /* =========================
//        GET AVAILABLE SEATS
//        + ROW LOCK
//     ========================= */

//     const [availableSeats] =
//     await connection.query(

//       `
//       SELECT

//         sa.availability_id,

//         se.seat_number,

//         c.coach_name,

//         c.base_price

//       FROM seat_availability sa

//       JOIN seats se
//       ON sa.seat_id =
//       se.seat_id

//       JOIN coaches c
//       ON se.coach_id =
//       c.coach_id

//       WHERE

//       sa.schedule_id = ?

//       AND sa.status =
//       'AVAILABLE'

//       AND c.coach_type = ?

//       LIMIT ${Number(tickets)}

//       FOR UPDATE
//       `,

//       [

//         scheduleId,

//         coachType
//       ]
//     );

//     /* =========================
//        SEAT CHECK
//     ========================= */

//     if (

//       availableSeats.length <
//       Number(tickets)

//     ) {

//       await connection.rollback();

//       return res.json({

//         success: false,

//         message:
//         "Seats not available"
//       });
//     }

//     /* =========================
//        TOTAL AMOUNT
//     ========================= */

//     const totalAmount =
//     availableSeats.reduce(

//       (sum, seat) =>

//         sum +
//         Number(seat.base_price),

//       0
//     );

//     /* =========================
//        PAYMENT EXPIRY
//     ========================= */

//     const expiry =
//     new Date(
//       Date.now() +
//       5 * 60 * 1000
//     );

//     /* =========================
//        CREATE BOOKING
//     ========================= */

//     const bookingCode =
//     `BK${Date.now()}`;

//     const [bookingResult] =
//     await connection.execute(

//       `
//       INSERT INTO bookings (

//         booking_code,

//         user_id,

//         schedule_id,

//         coach_type,

//         total_tickets,

//         passenger_name,

//         gender,

//         age,

//         total_amount,

//         payment_expiry,

//         status

//       )

//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `,

//       [

//         bookingCode,

//         userId,

//         scheduleId,

//         coachType,

//         tickets,

//         passengerName,

//         gender,

//         age,

//         totalAmount,

//         expiry,

//         'PENDING'
//       ]
//     );

//     const bookingId =
//     bookingResult.insertId;

//     /* =========================
//        LOCK SEATS
//     ========================= */

//     for (const seat of availableSeats) {

//       await connection.execute(

//         `
//         UPDATE seat_availability

//         SET

//         status = 'LOCKED',

//         locked_at = NOW()

//         WHERE availability_id = ?
//         `,

//         [seat.availability_id]
//       );
//     }

//     /* =========================
//        PAYMENT SIMULATION
//     ========================= */

//     const transactionId =
//     `TXN${Date.now()}`;

//     const paymentSuccess =
//     Math.random() < 0.8;

//     const paymentStatus =
//     paymentSuccess
//     ? 'SUCCESS'
//     : 'FAILED';

//     /* =========================
//        CREATE PAYMENT
//     ========================= */

//     await connection.execute(

//       `
//       INSERT INTO payments (

//         booking_id,

//         amount,

//         refund_amount,

//         transaction_id,

//         payment_method,

//         status,

//         failure_reason

//       )

//       VALUES (?, ?, ?, ?, ?, ?, ?)
//       `,

//       [

//         bookingId,

//         totalAmount,

//         0,

//         transactionId,

//         'UPI',

//         paymentStatus,

//         paymentSuccess
//         ? null
//         : 'Bank Server Error'
//       ]
//     );

//     const seatIds =
//     availableSeats.map(

//       seat =>
//       seat.availability_id
//     );

//     /* =========================
//        PAYMENT SUCCESS
//     ========================= */

//     if (paymentSuccess) {

//       /* CONFIRM BOOKING */

//       await connection.execute(

//         `
//         UPDATE bookings

//         SET status =
//         'CONFIRMED'

//         WHERE booking_id = ?
//         `,

//         [bookingId]
//       );

//       /* BOOK SEATS */

//       await connection.query(

//         `
//         UPDATE seat_availability

//         SET

//         status = 'BOOKED',

//         booked_at = NOW(),

//         locked_at = NULL

//         WHERE availability_id IN (?)
//         `,

//         [seatIds]
//       );

//       /* STORE BOOKED SEATS */

//       for (const seat of availableSeats) {

//         await connection.execute(

//           `
//           INSERT INTO booking_seats (

//             booking_id,

//             availability_id,

//             seat_number

//           )

//           VALUES (?, ?, ?)
//           `,

//           [

//             bookingId,

//             seat.availability_id,

//             seat.seat_number
//           ]
//         );
//       }

//     }

//     /* =========================
//        PAYMENT FAILED
//     ========================= */

//     else {

//       /* RELEASE SEATS */

//       await connection.query(

//         `
//         UPDATE seat_availability

//         SET

//         status = 'AVAILABLE',

//         locked_at = NULL

//         WHERE availability_id IN (?)
//         `,

//         [seatIds]
//       );

//       /* CANCEL BOOKING */

//       await connection.execute(

//         `
//         UPDATE bookings

//         SET status =
//         'CANCELLED'

//         WHERE booking_id = ?
//         `,

//         [bookingId]
//       );
//     }

//     /* =========================
//        COMMIT
//     ========================= */

//     await connection.commit();

//     return res.json({

//       success:
//       paymentSuccess,

//       message:
//       paymentSuccess
//       ? "Booking Confirmed"
//       : "Payment Failed",

//       bookingCode,

//       paymentStatus,

//       totalAmount,

//       seats:
//       availableSeats.map(

//         seat =>

//           `${seat.coach_name}-${seat.seat_number}`
//       )
//     });

//   } catch (error) {

//     /* =========================
//        ROLLBACK
//     ========================= */

//     await connection.rollback();

//     console.log(error);

//     return res.json({

//       success: false,

//       message:
//       error.message
//     });

//   } finally {

//     connection.release();
//   }
// };


//Reserve Seats
import db from "../configs/db.js";
import { confirmWaitingList } from "../utils/confirmWaitingList.js";

export const createBooking =
async (req, res) => {

  const connection =
  await db.getConnection();

  try {

    await connection.beginTransaction();

    const userId =
    req.body.userId;

    const { scheduleId } =
    req.params;

    const {

      coachType,
      tickets,

      passengerName,
      gender,
      age

    } = req.body;

    /* =========================
       VALIDATION
    ========================= */

    if (

      !scheduleId ||

      !coachType ||

      tickets <= 0 ||

      !passengerName ||

      !gender ||

      !age

    ) {

      await connection.rollback();

      return res.json({

        success: false,

        message:
        "Missing Details"
      });
    }

    /* =========================
       DUPLICATE BOOKING CHECK
    ========================= */

    const [existingBooking] =
    await connection.execute(

      `
      SELECT booking_id

      FROM bookings

      WHERE

      user_id = ?

      AND schedule_id = ?

      AND coach_type = ?

      AND status = 'PENDING'

      AND payment_expiry > NOW()

      LIMIT 1
      `,

      [

        userId,

        scheduleId,

        coachType
      ]
    );

    /* =========================
       ALREADY BOOKING
    ========================= */

    if (existingBooking.length > 0) {

      await connection.rollback();

      return res.json({

        success: false,

        message:
        "Booking already in progress"
      });
    }

    /* =========================
       GET AVAILABLE SEATS
    ========================= */

    const [availableSeats] =
    await connection.query(

      `
      SELECT

        sa.availability_id,

        se.seat_number,

        c.coach_name,

        c.base_price

      FROM seat_availability sa

      JOIN seats se
      ON sa.seat_id =
      se.seat_id

      JOIN coaches c
      ON se.coach_id =
      c.coach_id

      WHERE

      sa.schedule_id = ?

      AND sa.status =
      'AVAILABLE'

      AND c.coach_type = ?

      ORDER BY se.seat_number

      LIMIT ${Number(tickets)}

      FOR UPDATE
      `,

      [

        scheduleId,

        coachType
      ]
    );

    /* =========================
       WAITING LIST
    ========================= */

    if (

      availableSeats.length <
      Number(tickets)

    ) {

      /* =========================
         GET WAITING NUMBER
      ========================= */

      const [waitingRows] =
      await connection.execute(

        `
        SELECT

          MAX(waiting_number)
          AS last_waiting

        FROM waiting_list

        WHERE schedule_id = ?
        `,

        [scheduleId]
      );

      const waitingNumber =

      (
        waitingRows[0]
        .last_waiting || 0
      ) + 1;

      /* =========================
         CREATE WAITING BOOKING
      ========================= */

      const bookingCode =
      `WL${Date.now()}`;

      const [bookingResult] =
      await connection.execute(

        `
        INSERT INTO bookings (

          booking_code,

          user_id,

          schedule_id,

          coach_type,

          total_tickets,

          passenger_name,

          gender,

          age,

          total_amount,

          status

        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,

        [

          bookingCode,

          userId,

          scheduleId,

          coachType,

          tickets,

          passengerName,

          gender,

          age,

          0,

          'WAITING'
        ]
      );

      const bookingId =
      bookingResult.insertId;

      /* =========================
         INSERT WAITING LIST
      ========================= */

      await connection.execute(

        `
        INSERT INTO waiting_list (

          schedule_id,

          user_id,

          booking_id,

          waiting_number,

          coach_type,

          status

        )

        VALUES (?, ?, ?, ?, ?, ?)
        `,

        [

          scheduleId,

          userId,

          bookingId,

          waitingNumber,

          coachType,

          'WAITING'
        ]
      );

      await connection.commit();

      return res.json({

        success: true,

        waiting: true,

        waitingNumber,

        bookingId,

        message:
        `Added to Waiting List WL-${waitingNumber}`
      });
    }

    /* =========================
       TOTAL AMOUNT
    ========================= */

    const totalAmount =
    availableSeats.reduce(

      (sum, seat) =>

        sum +
        Number(seat.base_price),

      0
    );

    /* =========================
       PAYMENT EXPIRY
    ========================= */

    const expiry =
    new Date(

      Date.now() +
      5 * 60 * 1000
    );

    /* =========================
       CREATE BOOKING
    ========================= */

    const bookingCode =
    `BK${Date.now()}`;

    const [bookingResult] =
    await connection.execute(

      `
      INSERT INTO bookings (

        booking_code,

        user_id,

        schedule_id,

        coach_type,

        total_tickets,

        passenger_name,

        gender,

        age,

        total_amount,

        payment_expiry,

        status

      )

      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,

      [

        bookingCode,

        userId,

        scheduleId,

        coachType,

        tickets,

        passengerName,

        gender,

        age,

        totalAmount,

        expiry,

        'PENDING'
      ]
    );

    const bookingId =
    bookingResult.insertId;

    /* =========================
       LOCK SEATS
    ========================= */

    for (const seat of availableSeats) {

      await connection.execute(

        `
        UPDATE seat_availability

        SET

        status = 'LOCKED',

        locked_at = NOW()

        WHERE availability_id = ?
        `,

        [seat.availability_id]
      );
    }

    /* =========================
       INSERT BOOKING SEATS
    ========================= */

    for (const seat of availableSeats) {

      await connection.execute(

        `
        INSERT INTO booking_seats (

          booking_id,

          availability_id,

          seat_number

        )

        VALUES (?, ?, ?)
        `,

        [

          bookingId,

          seat.availability_id,

          seat.seat_number
        ]
      );
    }

    /* =========================
       CREATE PAYMENT
    ========================= */

    await connection.execute(

      `
      INSERT INTO payments (

        booking_id,

        amount,

        status

      )

      VALUES (?, ?, ?)
      `,

      [

        bookingId,

        totalAmount,

        'PENDING'
      ]
    );

    /* =========================
       COMMIT
    ========================= */

    await connection.commit();

    return res.json({

      success: true,

      waiting: false,

      bookingId,

      bookingCode,

      totalAmount,

      paymentExpiry: expiry,

      seats:
      availableSeats.map(

        seat =>

          `${seat.coach_name}-${seat.seat_number}`
      )
    });

  } catch (error) {

    await connection.rollback();

    console.log(error);

    return res.json({

      success: false,

      message:
      error.message
    });

  } finally {

    connection.release();
  }
};



export const getMyBookings =
async (req, res) => {

  try {

    const userId =
    req.user.id;

    const [bookings] =
    await db.execute(

      `
      SELECT

        b.booking_id,

        b.booking_code,

        b.total_tickets,

        b.total_amount,

        b.coach_type,

        b.passenger_name,

        b.status
        AS booking_status,

        tr.train_name,

        tr.train_no,

        tr.departure_time,

        tr.arrival_time,

        ts.travel_date,

        s1.station_name
        AS source_station,

        s2.station_name
        AS destination_station

      FROM bookings b

      JOIN train_schedule ts
      ON ts.schedule_id =
      b.schedule_id

      JOIN trains tr
      ON tr.train_id =
      ts.train_id

      JOIN stations s1
      ON tr.source_station_id =
      s1.station_id

      JOIN stations s2
      ON tr.destination_station_id =
      s2.station_id

      WHERE b.user_id = ?

      ORDER BY
      b.created_at DESC
      `,

      [userId]
    );

    return res.json({

      success: true,

      bookings
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


export const getBookingDetails =
async (req, res) => {

  try {

    const userId =
    req.user.id;

    const { bookingId } =
    req.params;

    const [rows] =
    await db.execute(

      `
      SELECT

        b.booking_id,

        b.booking_code,

        b.total_tickets,

        b.total_amount,

        b.coach_type,

        b.passenger_name,

        b.gender,

        b.age,

        b.status
        AS booking_status,

        b.created_at,

        tr.train_name,

        tr.train_no,

        tr.departure_time,

        tr.arrival_time,

        ts.travel_date,

        s1.station_name
        AS source_station,

        s2.station_name
        AS destination_station,

        MAX(p.status)
        AS payment_status,

        GROUP_CONCAT(

          CONCAT(

            c.coach_name,

            '-',

            bs.seat_number
          )

          ORDER BY bs.seat_number
        )
        AS seats

      FROM bookings b

      JOIN train_schedule ts
      ON ts.schedule_id =
      b.schedule_id

      JOIN trains tr
      ON tr.train_id =
      ts.train_id

      JOIN stations s1
      ON tr.source_station_id =
      s1.station_id

      JOIN stations s2
      ON tr.destination_station_id =
      s2.station_id

      LEFT JOIN booking_seats bs
      ON bs.booking_id =
      b.booking_id

      LEFT JOIN seat_availability sa
      ON sa.availability_id =
      bs.availability_id

      LEFT JOIN seats se
      ON se.seat_id =
      sa.seat_id

      LEFT JOIN coaches c
      ON c.coach_id =
      se.coach_id

      LEFT JOIN payments p
      ON p.booking_id =
      b.booking_id

      WHERE

      b.booking_id = ?

      AND b.user_id = ?

      GROUP BY
      b.booking_id
      `,

      [

        bookingId,

        userId
      ]
    );

    if (rows.length === 0) {

      return res.json({

        success: false,

        message:
        "Booking not found"
      });
    }

    return res.json({

      success: true,

      booking:
      rows[0]
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




export const cancelBooking =
async (req, res) => {

  const connection =
  await db.getConnection();

  try {

    /* =========================
       START TRANSACTION
    ========================= */

    await connection.beginTransaction();

    const userId =
    req.user.id;

    const { bookingId } =
    req.params;

    const {

      reason,
      comment

    } = req.body;

    /* =========================
       GET BOOKING
       + ROW LOCK
    ========================= */

    const [bookingRows] =
    await connection.execute(

      `
      SELECT

        b.*,

        ts.travel_date

      FROM bookings b

      JOIN train_schedule ts
      ON ts.schedule_id =
      b.schedule_id

      WHERE

      b.booking_id = ?

      AND b.user_id = ?

      FOR UPDATE
      `,

      [

        bookingId,

        userId
      ]
    );

    /* =========================
       BOOKING NOT FOUND
    ========================= */

    if (
      bookingRows.length === 0
    ) {

      throw new Error(
        "Booking not found"
      );
    }

    const booking =
    bookingRows[0];

    /* =========================
       ALREADY CANCELLED
    ========================= */

    if (
      booking.status ===
      'CANCELLED'
    ) {

      throw new Error(
        "Booking already cancelled"
      );
    }

    /* =========================
       CHECK PAYMENT STATUS
    ========================= */

    const [paymentRows] =
    await connection.execute(

      `
      SELECT status

      FROM payments

      WHERE booking_id = ?
      `,

      [bookingId]
    );

    if (

      paymentRows.length === 0 ||

      paymentRows[0].status !==
      'SUCCESS'

    ) {

      throw new Error(
        "Valid payment not found"
      );
    }

    /* =========================
       REFUND POLICY
    ========================= */

    const journeyDate =
    new Date(
      booking.travel_date
    );

    const today =
    new Date();

    journeyDate.setHours(
      0,0,0,0
    );

    today.setHours(
      0,0,0,0
    );

    /* =========================
       DAYS LEFT
    ========================= */

    const diffTime =
    journeyDate - today;

    const daysLeft =
    Math.ceil(

      diffTime /
      (1000 * 60 * 60 * 24)
    );

    /* =========================
       SAME DAY / EXPIRED
    ========================= */

    if (daysLeft <= 0) {

      throw new Error(
        "Cannot cancel on or after journey date"
      );
    }

    /* =========================
       REFUND CALCULATION
    ========================= */

    let refundAmount = 0;

    /* FULL REFUND */

    if (daysLeft >= 2) {

      refundAmount =

      Number(
        booking.total_amount
      ) - 50;
    }

    /* HALF REFUND */

    else if (daysLeft === 1) {

      refundAmount =

      (
        Number(
          booking.total_amount
        ) * 0.5
      ) - 50;
    }

    /* AVOID NEGATIVE */

    if (refundAmount < 0) {

      refundAmount = 0;
    }

    /* =========================
       GET BOOKED SEATS
    ========================= */

    const [seatRows] =
    await connection.execute(

      `
      SELECT

        availability_id

      FROM booking_seats

      WHERE booking_id = ?
      `,

      [bookingId]
    );

    const seatIds =
    seatRows.map(

      seat =>
      seat.availability_id
    );

    /* =========================
       RELEASE SEATS
    ========================= */

    if (seatIds.length > 0) {

      await connection.query(

        `
        UPDATE seat_availability

        SET

        status = 'AVAILABLE',

        locked_at = NULL,

        booked_at = NULL

        WHERE availability_id IN (?)
        `,

        [seatIds]
      );
    }

    /* =========================
       CANCEL BOOKING
    ========================= */

    await connection.execute(

      `
      UPDATE bookings

      SET status =
      'CANCELLED'

      WHERE booking_id = ?
      `,

      [bookingId]
    );

    /* =========================
       UPDATE PAYMENT
    ========================= */

    await connection.execute(

      `
      UPDATE payments

      SET

      status = 'REFUNDED',

      refund_amount = ?

      WHERE booking_id = ?
      `,

      [

        refundAmount,

        bookingId
      ]
    );

    /* =========================
       STORE CANCELLATION LOG
    ========================= */

    await connection.execute(

      `
      INSERT INTO cancellation_logs (

        booking_id,

        reason,

        comment,

        refund_amount

      )

      VALUES (?, ?, ?, ?)
      `,

      [

        bookingId,

        reason,

        comment?.trim() || null,

        refundAmount
      ]
    );

    /* =========================
       AUTO CONFIRM WAITING LIST
    ========================= */

    await confirmWaitingList(

      connection,

      booking.schedule_id,

      booking.coach_type
    );

    /* =========================
       COMMIT
    ========================= */

    await connection.commit();

    /* =========================
       CREATE NOTIFICATION
    ========================= */

    await createNotification(

      userId,

      "Booking Cancelled",

      `Refund ₹${refundAmount} initiated`
    );

    return res.json({

      success: true,

      message:
      "Booking Cancelled Successfully",

      refundAmount
    });

  } catch (error) {

    await connection.rollback();

    console.log(error);

    return res.json({

      success: false,

      message:
      error.message
    });

  } finally {

    connection.release();
  }
};






export const getCancellationPreview =
async (req, res) => {

  try {

    const userId =
    req.user.id;

    const { bookingId } =
    req.params;

    /* =========================
       GET BOOKING
    ========================= */

    const [bookingRows] =
    await db.execute(

      `
      SELECT

        b.total_amount,

        b.status,

        ts.travel_date

      FROM bookings b

      JOIN train_schedule ts
      ON ts.schedule_id =
      b.schedule_id

      WHERE

      b.booking_id = ?

      AND b.user_id = ?
      `,

      [

        bookingId,

        userId
      ]
    );

    /* =========================
       BOOKING NOT FOUND
    ========================= */

    if (
      bookingRows.length === 0
    ) {

      return res.json({

        success: false,

        message:
        "Booking not found"
      });
    }

    const booking =
    bookingRows[0];

    /* =========================
       ALREADY CANCELLED
    ========================= */

    if (
      booking.status ===
      'CANCELLED'
    ) {

      return res.json({

        success: false,

        message:
        "Booking already cancelled"
      });
    }

    /* =========================
       DATE CALCULATION
    ========================= */

    const journeyDate =
    new Date(
      booking.travel_date
    );

    const today =
    new Date();

    journeyDate.setHours(
      0,0,0,0
    );

    today.setHours(
      0,0,0,0
    );

    const diffTime =
    journeyDate - today;

    const daysLeft =
    Math.ceil(

      diffTime /
      (1000 * 60 * 60 * 24)
    );

    /* =========================
       SAME DAY / EXPIRED
    ========================= */

    if (daysLeft <= 0) {

      return res.json({

        success: true,

        canCancel: false,

        refundAmount: 0,

        cancellationCharge: 0,

        daysLeft,

        policy:
        "Cannot cancel on or after journey date"
      });
    }

    /* =========================
       REFUND LOGIC
    ========================= */

    let refundAmount = 0;

    let cancellationCharge = 50;

    let policy = "";

    /* FULL REFUND */

    if (daysLeft >= 2) {

      refundAmount =

      Number(
        booking.total_amount
      ) - 50;

      policy =
      "Full refund before 2 days";
    }

    /* HALF REFUND */

    else if (daysLeft === 1) {

      refundAmount =

      (
        Number(
          booking.total_amount
        ) * 0.5
      ) - 50;

      policy =
      "50% refund before 1 day";
    }

    if (refundAmount < 0) {

      refundAmount = 0;
    }

    return res.json({

      success: true,

      canCancel: true,

      refundAmount,

      cancellationCharge,

      daysLeft,

      policy
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