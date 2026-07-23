import db from "../configs/db.js";
import { sendTicketEmail } from "../services/emailService.js";
import {
  getTicketData,
  getUserEmailById,
  updateBookingStatus,
  getMyBookings as getMyBookingsService,
} from "../services/bookingService.js";

export const createBooking = async (req, res) => {
  try {
    const {
      scheduleId,
      coachType,
      passengers,
      selectedSeats,
      totalAmount,
    } = req.body;

    const userId = req.user.id;

    // Generate Booking Code
    const bookingCode = "BK" + Date.now();

    // Create Booking
    const [result] = await db.execute(
      `
      INSERT INTO bookings(
        booking_code,
        user_id,
        schedule_id,
        coach_type,
        total_tickets,
        total_amount,
        status
      )
      VALUES(?, ?, ?, ?, ?, ?, ?)
      `,
      [
        bookingCode,
        userId,
        scheduleId,
        coachType,
        passengers.length,
        totalAmount,
        "PENDING",
      ]
    );

    const bookingId = result.insertId;

    // Save all passengers
    for (const passenger of passengers) {
      await db.execute(
        `INSERT INTO booking_passengers
        (
          booking_id,
          passenger_name,
          age,
          gender
        )
        VALUES (?, ?, ?, ?)`,
        [bookingId, passenger.name, passenger.age, passenger.gender]
      );
    }

    console.log("Availability IDs:", selectedSeats);

    for (const availabilityId of selectedSeats) {
      // Save Booking Seat
      await db.execute(
        `
        INSERT INTO booking_seats(
          booking_id,
          availability_id
        )
        VALUES(?, ?)
        `,
        [bookingId, availabilityId]
      );

      // Mark Seat as LOCKED
      await db.execute(
        `
        UPDATE seat_availability
        SET
          status = 'LOCKED',
          locked_at = NOW(),
          booked_at = NULL
        WHERE
          availability_id = ?
        `,
        [availabilityId]
      );
    }

    return res.json({
      success: true,
      bookingId,
      bookingCode,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const confirmPayment = async (req, res) => {
  const { bookingId, userId } = req.body;

  try {
    // 1. Update DB Booking Status
    await updateBookingStatus(bookingId, "CONFIRMED");

    // 2. Fetch full Ticket Object & User Email
    const ticket = await getTicketData(bookingId);

    console.log("========== PAYMENT SUCCESS ==========");
    console.log("Booking ID:", bookingId);

    const userEmail = await getUserEmailById(userId || ticket.user_id);

    console.log("Ticket:", ticket);

    // 3. Dispatch Email asynchronously (non-blocking call)
    if (userEmail) {
      sendTicketEmail(ticket, userEmail).catch((err) =>
        console.error("Background email process error:", err)
      );
    } else {
      console.warn("⚠️ User email not found. Skipping email dispatch.");
    }

    // 4. Always return success to client regardless of background email status
    return res.status(200).json({
      success: true,
      message: "Payment confirmed and ticket generated.",
      bookingCode: ticket.booking_code,
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return res.status(500).json({ message: "Payment confirmation failed." });
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

// ==========================================
// NEW: Cancel Booking Controller Function
// ==========================================
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // 1. Fetch booking details to get total amount
    const [bookings] = await db.execute(
      `SELECT * FROM bookings WHERE booking_id = ?`,
      [bookingId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = bookings[0];

    if (booking.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    // 2. Mark booking status as CANCELLED
    await db.execute(
      `UPDATE bookings SET status = 'CANCELLED' WHERE booking_id = ?`,
      [bookingId]
    );

    // 3. Release booked seats back to AVAILABLE
    await db.execute(
      `UPDATE seat_availability 
       SET status = 'AVAILABLE', booked_at = NULL, locked_at = NULL 
       WHERE availability_id IN (
         SELECT availability_id FROM booking_seats WHERE booking_id = ?
       )`,
      [bookingId]
    );

    // 4. Calculate refund (e.g. Total amount minus ₹50 cancellation fee)
    const cancellationCharge = 50;
    const refundAmount = Math.max(0, Number(booking.total_amount) - cancellationCharge);

    return res.status(200).json({
      success: true,
      message: "Ticket cancelled successfully",
      refundAmount: refundAmount.toFixed(2),
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel booking",
    });
  }
};