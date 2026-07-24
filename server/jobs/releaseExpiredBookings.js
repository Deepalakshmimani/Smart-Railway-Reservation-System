import cron from "node-cron";
import db from "../configs/db.js";
import { confirmWaitingList } from "../utils/confirmWaitingList.js";
import { createNotification } from "../utils/createNotifications.js";

import { getTicketData, getUserEmailById } from "../services/bookingService.js";
import { sendTicketEmail } from "../services/emailService.js";

const releaseExpiredBookings = () => {

  /* =========================
     EVERY 1 MINUTE
  ========================= */

  cron.schedule("* * * * *", async () => {

    const connection = await db.getConnection();

    try {

      console.log("Checking expired bookings...");

      /* =========================
         GET EXPIRED BOOKINGS
      ========================= */

      const [expiredBookings] = await connection.execute(
        `
        SELECT
            booking_id,
            booking_code,
            user_id,
            schedule_id,
            coach_type
        FROM bookings
        WHERE
            status = 'PENDING'
            AND payment_expiry < NOW()
        `
      );

      /* =========================
         PROCESS EACH BOOKING
      ========================= */

      for (const booking of expiredBookings) {

        try {

          await connection.beginTransaction();

          /* =========================
             LOCK BOOKING
          ========================= */

          const [rows] = await connection.execute(
            `
            SELECT *
            FROM bookings
            WHERE booking_id = ?
            FOR UPDATE
            `,
            [booking.booking_id]
          );

          if (
            rows.length === 0 ||
            rows[0].status !== "PENDING"
          ) {

            await connection.rollback();
            continue;

          }

          /* =========================
             RELEASE LOCKED SEATS
          ========================= */

          await connection.execute(
            `
            UPDATE seat_availability sa

            JOIN booking_seats bs
            ON bs.availability_id = sa.availability_id

            SET

                sa.status = 'AVAILABLE',
                sa.locked_at = NULL

            WHERE

                bs.booking_id = ?

                AND sa.status = 'LOCKED'
            `,
            [booking.booking_id]
          );

          /* =========================
             BOOKING EXPIRED
          ========================= */

          await connection.execute(
            `
            UPDATE bookings
            SET status='EXPIRED'
            WHERE booking_id=?
            `,
            [booking.booking_id]
          );

          /* =========================
             PAYMENT FAILED
          ========================= */

          await connection.execute(
            `
            UPDATE payments
            SET

                status='FAILED',

                failure_reason='Payment Timeout'

            WHERE

                booking_id=?

                AND status<>'SUCCESS'
            `,
            [booking.booking_id]
          );

          /* =========================
             WAITING LIST
          ========================= */

          /* =========================
            CONFIRM WAITING LIST
          ========================= */

          const confirmedBookingId =
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
            SEND EMAIL AFTER COMMIT
          ========================= */

          if (confirmedBookingId) {

              try {

                  const ticket =
                  await getTicketData(
                      confirmedBookingId
                  );

                  if (ticket) {

                      const email =
                      await getUserEmailById(
                          ticket.user_id
                      );

                      if (email) {

                          await sendTicketEmail(
                              ticket,
                              email
                          );

                          console.log(
                              `Waiting list email sent for booking ${confirmedBookingId}`
                          );

                      }

                  }

              } catch (error) {

                  console.log(
                      "Waiting list email failed:",
                      error.message
                  );

              }

          }

          /* =========================
             NOTIFICATION
          ========================= */

          await createNotification(

            booking.user_id,

            "Booking Expired",

            `Your booking ${booking.booking_code} expired because payment was not completed within the allowed time.`

          );

          

        }
        catch (error) {

          await connection.rollback();

          console.log(
            `Booking ${booking.booking_id}:`,
            error.message
          );

        }

      }

    }
    catch (error) {

      console.log(error);

    }
    finally {

      connection.release();

    }

  });

};

export default releaseExpiredBookings;