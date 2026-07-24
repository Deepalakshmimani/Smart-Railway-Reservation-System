import db from "../configs/db.js";
import { sendTicketEmail, sendWaitingListConfirmationEmail } from "../services/emailService.js";
import {
  getTicketData,
  getUserEmailById,
  updateBookingStatus,
  getMyBookings as getMyBookingsService,
} from "../services/bookingService.js";

import { confirmWaitingList } from "../utils/confirmWaitingList.js";



export const createBooking = async (req, res) => {

  const connection = await db.getConnection();

  try {

    await connection.beginTransaction();

    const {
      scheduleId,
      coachType,
      passengers,
      selectedSeats,
      totalAmount,
    } = req.body;

    const userId = req.user.id;

    const bookingCode = "BK" + Date.now();

    // Payment expires in 5 minutes
    const paymentExpiry = new Date(
      Date.now() + 5 * 60 * 1000
    );

    /* =========================
       CREATE BOOKING
    ========================= */

    const [result] = await connection.execute(
      `
      INSERT INTO bookings
      (
        booking_code,
        user_id,
        schedule_id,
        coach_type,
        total_tickets,
        total_amount,
        status,
        payment_expiry
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        bookingCode,
        userId,
        scheduleId,
        coachType,
        passengers.length,
        totalAmount,
        "PENDING",
        paymentExpiry,
      ]
    );

    const bookingId = result.insertId;

    /* =========================
       SAVE PASSENGERS
    ========================= */

    for (const passenger of passengers) {

      await connection.execute(
        `
        INSERT INTO booking_passengers
        (
          booking_id,
          passenger_name,
          age,
          gender
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          bookingId,
          passenger.name,
          passenger.age,
          passenger.gender,
        ]
      );
    }

    /* =========================
       LOCK SEATS
    ========================= */

    for (const availabilityId of selectedSeats) {

      await connection.execute(
        `
        INSERT INTO booking_seats
        (
          booking_id,
          availability_id
        )
        VALUES (?, ?)
        `,
        [
          bookingId,
          availabilityId,
        ]
      );

      const [updateResult] =
      await connection.execute(
        `
        UPDATE seat_availability
        SET
          status = 'LOCKED',
          locked_at = NOW(),
          booked_at = NULL
        WHERE
          availability_id = ?
          AND status = 'AVAILABLE'
        `,
        [availabilityId]
      );

      if (updateResult.affectedRows === 0) {

          await connection.rollback();

          return res.status(409).json({

              success: false,

              errorCode: "SEAT_ALREADY_LOCKED",

              refreshSeats: true,

              message:
                  "One or more selected seats have just been booked by another passenger."

          });

      }}

    /* =========================
       CREATE PAYMENT RECORD
    ========================= */

    await connection.execute(
      `
      INSERT INTO payments
      (
        booking_id,
        amount,
        status
      )
      VALUES (?, ?, 'PENDING')
      `,
      [
        bookingId,
        totalAmount,
      ]
    );

    await connection.commit();

    return res.json({
      success: true,
      bookingId,
      bookingCode,
      paymentExpiry,
    });

  } catch (error) {

    await connection.rollback();

    console.error(error);

    return res.status(500).json({

        success: false,

        message: error.message,

    });

  } finally {

    connection.release();

  }
};




export const confirmPayment = async (req, res) => {

    const {
        bookingId,
        useRewards,
        redeemAmount
    } = req.body;

    const userId = req.user.id;

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        /* ==========================
           CONFIRM BOOKING
        ========================== */

        await updateBookingStatus(
            bookingId,
            "CONFIRMED",
            connection
        );

        /* ==========================
           REDEEM REWARD
        ========================== */

        if (useRewards && Number(redeemAmount) > 0) {

            const [[wallet]] =
            await connection.execute(
                `
                SELECT reward_credits
                FROM users
                WHERE user_id = ?
                FOR UPDATE
                `,
                [userId]
            );

            if (!wallet) {

                throw new Error("User not found");

            }

            if (
                Number(wallet.reward_credits) <
                Number(redeemAmount)
            ) {

                throw new Error(
                    "Insufficient reward credits."
                );

            }

            await connection.execute(
                `
                UPDATE users
                SET reward_credits =
                    reward_credits - ?
                WHERE user_id = ?
                `,
                [
                    redeemAmount,
                    userId
                ]
            );

            await connection.execute(
                `
                INSERT INTO reward_transactions
                (
                    user_id,
                    booking_id,
                    transaction_type,
                    amount,
                    description
                )
                VALUES
                (
                    ?, ?, 'REDEEMED', ?, ?
                )
                `,
                [
                    userId,
                    bookingId,
                    redeemAmount,
                    "Reward redeemed during ticket payment."
                ]
            );

        }

        /* ==========================
           GET TICKET
        ========================== */

        const ticket =
        await getTicketData(bookingId);

        const userEmail =
        await getUserEmailById(ticket.user_id);

        await connection.commit();

        /* ==========================
           SEND EMAIL
        ========================== */

        if (userEmail) {

            sendTicketEmail(
                ticket,
                userEmail
            ).catch(err =>
                console.log(err)
            );

        }

        return res.status(200).json({

            success: true,

            message:
                useRewards && redeemAmount > 0
                    ? `Payment successful. ₹${redeemAmount} reward credits redeemed.`
                    : "Payment successful.",

            bookingCode:
                ticket.booking_code

        });

    }

    catch (error) {

        await connection.rollback();

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

    finally {

        connection.release();

    }

};

export const getTicket = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const ticket = await getTicketData(bookingId);

    if (!ticket) {
      return res.json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    console.log("Logged in User ID:", req.user.id);
    const userId = req.user?.user_id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User ID not found in token.",
      });
    }

    const bookings = await getMyBookingsService(userId);

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings.",
    });
  }
};


const calculateRefund = (totalAmount, travelDate) => {

    const today = new Date();
    const journey = new Date(travelDate);

    today.setHours(0, 0, 0, 0);
    journey.setHours(0, 0, 0, 0);

    const diffTime = journey - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let refundPercentage = 0;
    let policy = "";

    if (daysLeft > 3) {

        refundPercentage = 98;
        policy = "98% refund (More than 3 days before journey)";

    } else if (daysLeft === 3) {

        refundPercentage = 90;
        policy = "90% refund (3 days before journey)";

    } else if (daysLeft === 2) {

        refundPercentage = 75;
        policy = "75% refund (2 days before journey)";

    } else if (daysLeft === 1) {

        refundPercentage = 50;
        policy = "50% refund (1 day before journey)";

    } else {

        refundPercentage = 0;
        policy = "Journey day - No refund";

    }

    const refundAmount =
        Number(
            ((totalAmount * refundPercentage) / 100).toFixed(2)
        );

    const cancellationCharge =
        Number(
            (totalAmount - refundAmount).toFixed(2)
        );

    return {

        canCancel: daysLeft > 0,

        daysLeft,

        refundPercentage,

        refundAmount,

        cancellationCharge,

        policy

    };

};



export const getCancellationPreview = async (req, res) => {

    try {

        const userId = req.user.id;
        const { bookingId } = req.params;

        const [bookings] = await db.execute(
            `
            SELECT
                b.booking_id,
                b.booking_code,
                b.total_amount,
                b.status,
                ts.travel_date
            FROM bookings b
            JOIN train_schedule ts
                ON b.schedule_id = ts.schedule_id
            WHERE b.booking_id = ?
            AND b.user_id = ?
            `,
            [bookingId, userId]
        );

        if (bookings.length === 0) {
            return res.json({
                success: false,
                message: "Booking not found"
            });
        }

        const booking = bookings[0];

        if (booking.status === "CANCELLED") {
            return res.json({
                success: false,
                message: "Booking is already cancelled"
            });
        }

        const refund = calculateRefund(
            Number(booking.total_amount),
            booking.travel_date
        );

        if (!refund.canCancel) {
            return res.json({
                success: false,
                message: refund.policy
            });
        }

        return res.json({
            success: true,
            preview: {
                bookingId: booking.booking_id,
                bookingCode: booking.booking_code,
                totalAmount: booking.total_amount,
                daysLeft: refund.daysLeft,
                cancellationCharge: refund.cancellationCharge,
                refundAmount: refund.refundAmount,
                policy: refund.policy,
                canCancel: true
            }
        });

    } catch (error) {

        console.log(error);

        return res.json({
            success: false,
            message: error.message
        });

    }

};



export const cancelBooking = async (req, res) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const { bookingId } = req.params;

        const [bookings] = await connection.execute(
            `
            SELECT
                b.*,
                ts.travel_date
            FROM bookings b
            JOIN train_schedule ts
                ON b.schedule_id = ts.schedule_id
            WHERE b.booking_id = ?
            FOR UPDATE
            `,
            [bookingId]
        );

        if (bookings.length === 0) {

            await connection.rollback();
            connection.release();

            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });

        }

        const booking = bookings[0];

        if (booking.status === "CANCELLED") {

            await connection.rollback();
            connection.release();

            return res.status(400).json({
                success: false,
                message: "Booking already cancelled"
            });

        }

        const refund = calculateRefund(
            Number(booking.total_amount),
            booking.travel_date
        );

        if (!refund.canCancel) {

            await connection.rollback();
            connection.release();

            return res.status(400).json({
                success: false,
                message: refund.policy
            });

        }

        /* -----------------------------
           Cancel Booking
        ------------------------------ */

        await connection.execute(
            `
            UPDATE bookings
            SET status='CANCELLED'
            WHERE booking_id=?
            `,
            [bookingId]
        );

        /* -----------------------------
           Release Seats
        ------------------------------ */

        await connection.execute(
            `
            UPDATE seat_availability
            SET

                status='AVAILABLE',

                booked_at=NULL,

                locked_at=NULL

            WHERE availability_id IN
            (
                SELECT availability_id
                FROM booking_seats
                WHERE booking_id=?
            )
            `,
            [bookingId]
        );

        /* -----------------------------
           Refund Payment
        ------------------------------ */

        await connection.execute(
            `
            UPDATE payments
            SET

                refund_amount=?,

                status='REFUNDED'

            WHERE booking_id=?
            `,
            [
                refund.refundAmount,
                bookingId
            ]
        );

        /* -----------------------------
           Cancellation Log
        ------------------------------ */

        await connection.execute(
            `
            INSERT INTO cancellation_logs
            (
                booking_id,
                reason,
                refund_amount
            )
            VALUES
            (
                ?, ?, ?
            )
            `,
            [
                bookingId,
                refund.policy,
                refund.refundAmount
            ]
        );

        /* -----------------------------
           Notification
        ------------------------------ */

        await connection.execute(
            `
            INSERT INTO notifications
            (
                user_id,
                title,
                message
            )
            VALUES
            (
                ?, ?, ?
            )
            `,
            [
                booking.user_id,
                "Ticket Cancelled",
                `Your booking ${booking.booking_code} has been cancelled successfully. Refund Amount: ₹${refund.refundAmount}`
            ]
        );


                /* -----------------------------
           Auto Confirm Waiting List
        ------------------------------ */

        const confirmedBookingId =
        await confirmWaitingList(
            connection,
            booking.schedule_id,
            booking.coach_type
        );

        /* -----------------------------
           Commit Transaction
        ------------------------------ */

        await connection.commit();

        const cancelledTicket =
        await getTicketData(bookingId);

        const cancelledEmail =
        await getUserEmailById(
            cancelledTicket.user_id
        );

        await sendCancellationEmail(

            cancelledTicket,

            cancelledEmail,

            refund

        );

        connection.release();


        /* =========================
          SEND WAITING LIST EMAIL
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

                        await sendWaitingListConfirmationEmail(
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

        return res.status(200).json({
            success: true,
            message: "Ticket cancelled successfully",
            refund: {
                refundAmount: refund.refundAmount,
                cancellationCharge: refund.cancellationCharge,
                daysLeft: refund.daysLeft,
                policy: refund.policy
            }
        });

    } catch (error) {

        await connection.rollback();

        connection.release();

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
