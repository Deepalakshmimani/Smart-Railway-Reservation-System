import { createNotification }
from "./createNotifications.js";

export const confirmWaitingList =
async (

  connection,

  scheduleId,

  coachType

) => {

  try {

    /* =========================
       GET FIRST WAITING USER
    ========================= */

    const [waitingRows] =
    await connection.execute(

      `
      SELECT

        wl.waiting_id,

        wl.booking_id,

        b.total_tickets,

        b.user_id

      FROM waiting_list wl

      JOIN bookings b
      ON b.booking_id =
      wl.booking_id

      WHERE

      wl.schedule_id = ?

      AND wl.coach_type = ?

      AND wl.status = 'WAITING'

      ORDER BY wl.waiting_number

      LIMIT 1
      `,

      [

        scheduleId,

        coachType
      ]
    );

    /* =========================
       NO WAITING USER
    ========================= */

    if (
      waitingRows.length === 0
    ) {

      return;
    }

    const waiting =
    waitingRows[0];

    /* =========================
       GET AVAILABLE SEATS
       + ROW LOCK
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

      ORDER BY

      c.coach_name,

      se.seat_number

      LIMIT ?

      FOR UPDATE
      `,

      [

        scheduleId,

        coachType,

        Number(
          waiting.total_tickets
        )
      ]
    );

    /* =========================
       NOT ENOUGH SEATS
    ========================= */

    if (

      availableSeats.length <
      Number(
        waiting.total_tickets
      )

    ) {

      return;
    }

    /* =========================
       TOTAL AMOUNT
    ========================= */

    const totalAmount =
    availableSeats.reduce(

      (sum, seat) =>

        sum +
        Number(
          seat.base_price
        ),

      0
    );

    /* =========================
       BOOK SEATS
    ========================= */

    for (const seat of availableSeats) {

      /* UPDATE AVAILABILITY */

      await connection.execute(

        `
        UPDATE seat_availability

        SET

        status = 'BOOKED',

        booked_at = NOW(),

        locked_at = NULL

        WHERE availability_id = ?
        `,

        [seat.availability_id]
      );

      /* STORE BOOKED SEATS */

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

          waiting.booking_id,

          seat.availability_id,

          seat.seat_number
        ]
      );
    }

    /* =========================
       CONFIRM BOOKING
    ========================= */

    await connection.execute(

      `
      UPDATE bookings

      SET

      status = 'CONFIRMED',

      total_amount = ?

      WHERE booking_id = ?
      `,

      [

        totalAmount,

        waiting.booking_id
      ]
    );

    /* =========================
       UPDATE WAITING STATUS
    ========================= */

    await connection.execute(

      `
      UPDATE waiting_list

      SET status =
      'CONFIRMED'

      WHERE waiting_id = ?
      `,

      [waiting.waiting_id]
    );

    /* =========================
       UPDATE PAYMENT
    ========================= */

    await connection.execute(

      `
      UPDATE payments

      SET

      amount = ?,

      status = 'SUCCESS'

      WHERE booking_id = ?
      `,

      [

        totalAmount,

        waiting.booking_id
      ]
    );

    /* =========================
       CREATE NOTIFICATION
    ========================= */

    await createNotification(

      waiting.user_id,

      "Waiting List Confirmed",

      "Your waiting list booking has been confirmed"
    );

    console.log(

      `WL booking ${waiting.booking_id} confirmed`
    );

  } catch (error) {

    console.log(error);

    throw error;
  }
};