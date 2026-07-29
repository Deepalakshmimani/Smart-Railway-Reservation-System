import {
  createNotification
} from "./createNotifications.js";

export const confirmWaitingList = async (
  connection,
  scheduleId,
  coachType
) => {
  try {

    /* =========================
       GET FIRST WAITING USER
    ========================= */

    const [waitingRows] = await connection.execute(
      `
      SELECT
          wl.waiting_id,
          wl.booking_id,
          b.total_tickets,
          b.user_id
      FROM waiting_list wl
      JOIN bookings b
          ON b.booking_id = wl.booking_id
      WHERE
          wl.schedule_id = ?
          AND wl.coach_type = ?
          AND wl.status = 'WAITING'
      ORDER BY wl.waiting_number
      LIMIT 1
      FOR UPDATE
      `,
      [scheduleId, coachType]
    );

    if (waitingRows.length === 0) {
      return null;
    }

    const waiting = waitingRows[0];

    /* =========================
       CHECK EXISTING SEATS
    ========================= */

    const [existingSeats] = await connection.execute(
      `
      SELECT COUNT(*) AS total
      FROM booking_seats
      WHERE booking_id = ?
      `,
      [waiting.booking_id]
    );

    if (existingSeats[0].total > 0) {
      throw new Error(
        "Waiting list booking already has assigned seats."
      );
    }

    /* =========================
       GET AVAILABLE SEATS
    ========================= */

    const [availableSeats] = await connection.execute(
      `
      SELECT
          sa.availability_id,
          se.seat_number,
          c.base_price
      FROM seat_availability sa
      JOIN seats se
          ON sa.seat_id = se.seat_id
      JOIN coaches c
          ON se.coach_id = c.coach_id
      WHERE
          sa.schedule_id = ?
          AND sa.status = 'AVAILABLE'
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
        Number(waiting.total_tickets),
      ]
    );

    if (
      availableSeats.length <
      Number(waiting.total_tickets)
    ) {
      return null;
    }

    /* =========================
       CALCULATE TOTAL AMOUNT
    ========================= */

    const totalAmount =
      availableSeats.reduce(
        (sum, seat) =>
          sum + Number(seat.base_price),
        0
      );

    /* =========================
       ASSIGN SEATS
    ========================= */

    for (const seat of availableSeats) {

      const [seatUpdate] =
        await connection.execute(
          `
          UPDATE seat_availability
          SET
              status = 'BOOKED',
              booked_at = NOW(),
              locked_at = NULL
          WHERE
              availability_id = ?
              AND status = 'AVAILABLE'
          `,
          [seat.availability_id]
        );

      if (seatUpdate.affectedRows === 0) {
        throw new Error(
          `Seat ${seat.seat_number} is no longer available.`
        );
      }

      await connection.execute(
        `
        INSERT INTO booking_seats
        (
            booking_id,
            availability_id,
            seat_number
        )
        VALUES (?, ?, ?)
        `,
        [
          waiting.booking_id,
          seat.availability_id,
          seat.seat_number,
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
        waiting.booking_id,
      ]
    );

    /* =========================
       UPDATE WAITING LIST
    ========================= */

    await connection.execute(
      `
      UPDATE waiting_list
      SET status = 'CONFIRMED'
      WHERE waiting_id = ?
      `,
      [waiting.waiting_id]
    );

    /* =========================
       UPDATE PAYMENT
    ========================= */

    const [payment] = await connection.execute(
    `
    SELECT payment_id
    FROM payments
    WHERE booking_id=?
    `,
    [
    waiting.booking_id
    ]
    );

    if(payment.length===0){

      await createNotification(
      connection,
      waiting.user_id,
      "Waiting List Confirmed",
      "Your waiting list booking has been confirmed and seats have been allocated."
      );

    }else{

    await connection.execute(
    `
    UPDATE payments
    SET
    amount=?,
    status='SUCCESS',
    transaction_id=?,
    payment_method='SYSTEM',
    failure_reason=NULL
    WHERE booking_id=?
    `,
    [
    totalAmount,
    `WL${Date.now()}`,
    waiting.booking_id
    ]
    );

    }


    /* =========================
       CREATE NOTIFICATION
    ========================= */

    await connection.execute(
      `
      INSERT INTO notifications
      (
          user_id,
          title,
          message
      )
      VALUES (?, ?, ?)
      `,
      [
        waiting.user_id,
        "Waiting List Confirmed",
        "Your waiting list booking has been confirmed and seats have been allocated. You can now download your ticket."
      ]
    );

    console.log(
      `Waiting booking ${waiting.booking_id} confirmed with seats: ${availableSeats
        .map(seat => seat.seat_number)
        .join(", ")}`
    );

    /* =========================
       RETURN BOOKING ID
    ========================= */

    return waiting.booking_id;

  } catch (error) {

    console.log(error);

    throw error;

  }
};