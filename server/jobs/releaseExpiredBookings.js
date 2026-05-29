import cron from "node-cron";

import db from "../configs/db.js";

import {
  confirmWaitingList
} from "../utils/confirmWaitingList.js";

const releaseExpiredBookings = () => {

  /* =========================
     EVERY 1 MINUTE
  ========================= */

  cron.schedule(

    "* * * * *",

    async () => {

      const connection =
      await db.getConnection();

      try {

        console.log(
          "Checking expired bookings..."
        );

        /* =========================
           GET EXPIRED BOOKINGS
        ========================= */

        const [expiredBookings] =
        await connection.execute(

          `
          SELECT

            booking_id,

            schedule_id,

            coach_type

          FROM bookings

          WHERE

          status = 'PENDING'

          AND payment_expiry < NOW()

          FOR UPDATE
          `
        );

        /* =========================
           LOOP BOOKINGS
        ========================= */

        for (const booking of expiredBookings) {

          try {

            await connection.beginTransaction();

            const bookingId =
            booking.booking_id;

            /* =========================
               RELEASE SEATS
            ========================= */

            await connection.execute(

              `
              UPDATE seat_availability sa

              JOIN booking_seats bs
              ON bs.availability_id =
              sa.availability_id

              SET

              sa.status = 'AVAILABLE',

              sa.locked_at = NULL

              WHERE

              bs.booking_id = ?

              AND sa.status = 'LOCKED'
              `,

              [bookingId]
            );

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

              status = 'FAILED',

              failure_reason =
              'Payment Timeout'

              WHERE

              booking_id = ?

              AND status = 'PENDING'
              `,

              [bookingId]
            );

            /* =========================
               CONFIRM WAITING LIST
            ========================= */

            await confirmWaitingList(

              connection,

              booking.schedule_id,

              booking.coach_type
            );

            await connection.commit();

            console.log(

              `Booking ${bookingId} expired`
            );

          } catch (error) {

            await connection.rollback();

            console.log(error);
          }
        }

      } catch (error) {

        console.log(error);

      } finally {

        connection.release();
      }
    }
  );
};

export default releaseExpiredBookings;