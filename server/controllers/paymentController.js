import db from "../configs/db.js";

import {
  createNotification
} from "../utils/createNotifications.js";


// Finalize Booking

export const completePayment =
async (req, res) => {

  const connection =
  await db.getConnection();

  try {

    /* =========================
       START TRANSACTION
    ========================= */

    await connection.beginTransaction();

    const { bookingId } =
    req.params;

    /* =========================
       GET BOOKING + LOCK
    ========================= */

    const [bookingRows] =
    await connection.execute(

      `
      SELECT *

      FROM bookings

      WHERE booking_id = ?

      FOR UPDATE
      `,

      [bookingId]
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
       STATUS VALIDATION
    ========================= */

    if (
      booking.status !== 'PENDING'
    ) {

      throw new Error(
        "Booking already processed"
      );
    }

    /* =========================
       PAYMENT EXPIRY CHECK
    ========================= */

    if (

      new Date() >

      new Date(
        booking.payment_expiry
      )

    ) {

      throw new Error(
        "Payment session expired"
      );
    }

    /* =========================
       GET LOCKED SEATS
    ========================= */

    const [seatRows] =
    await connection.execute(

      `
      SELECT

        sa.availability_id,

        bs.seat_number

      FROM seat_availability sa

      JOIN booking_seats bs
      ON bs.availability_id =
      sa.availability_id

      WHERE bs.booking_id = ?
      `,

      [bookingId]
    );

    const seatIds =
    seatRows.map(

      seat =>
      seat.availability_id
    );

    /* =========================
       PAYMENT SIMULATION
    ========================= */

    const paymentSuccess =
    Math.random() < 0.8;

    const paymentStatus =
    paymentSuccess
    ? 'SUCCESS'
    : 'FAILED';

    /* =========================
       UPDATE PAYMENT
    ========================= */

    await connection.execute(

      `
      UPDATE payments

      SET

      status = ?,

      transaction_id = ?,

      payment_method = ?,

      failure_reason = ?

      WHERE booking_id = ?
      `,

      [

        paymentStatus,

        `TXN${Date.now()}`,

        'UPI',

        paymentSuccess
        ? null
        : 'Bank Server Error',

        bookingId
      ]
    );

    /* =========================
       PAYMENT SUCCESS
    ========================= */

    if (paymentSuccess) {

      /* CONFIRM BOOKING */

      await connection.execute(

        `
        UPDATE bookings

        SET status =
        'CONFIRMED'

        WHERE booking_id = ?
        `,

        [bookingId]
      );

      /* BOOK SEATS */

      await connection.query(

        `
        UPDATE seat_availability

        SET

        status = 'BOOKED',

        booked_at = NOW(),

        locked_at = NULL

        WHERE availability_id IN (?)
        `,

        [seatIds]
      );
    }

    /* =========================
       PAYMENT FAILED
    ========================= */

    else {

      console.log(

        `Payment failed for booking ${bookingId}`
      );
    }

    /* =========================
       COMMIT
    ========================= */

    await connection.commit();

    /* =========================
       NOTIFICATIONS
    ========================= */

    if (paymentSuccess) {

      await createNotification(

        booking.user_id,

        "Booking Confirmed",

        `Your booking ${booking.booking_code} has been confirmed`
      );

    } else {

      await createNotification(

        booking.user_id,

        "Payment Failed",

        `Payment failed for booking ${booking.booking_code}. You can retry payment before expiry.`
      );
    }

    return res.json({

      success:
      paymentSuccess,

      paymentStatus,

      paymentExpiry:
      booking.payment_expiry
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