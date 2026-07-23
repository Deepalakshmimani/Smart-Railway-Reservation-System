import db from "../configs/db.js";

export const getTicketData = async (bookingId) => {
  const [rows] = await db.execute(
    `
    SELECT
      b.booking_id,
      b.user_id,
      b.booking_code,
      b.coach_type,
      b.total_amount,
      b.total_tickets,
      b.status,
      t.train_name,
      t.train_no,
      ts.travel_date,
      t.departure_time,
      t.arrival_time,
      s1.station_name AS source,
      s2.station_name AS destination
    FROM bookings b
    JOIN train_schedule ts
      ON b.schedule_id = ts.schedule_id
    JOIN trains t
      ON ts.train_id = t.train_id
    JOIN stations s1
      ON t.source_station_id = s1.station_id
    JOIN stations s2
      ON t.destination_station_id = s2.station_id
    WHERE b.booking_id = ?
    `,
    [bookingId]
  );

  if (rows.length === 0) {
    return null;
  }

  const [seats] = await db.execute(
    `
    SELECT
      c.coach_name,
      s.seat_number
    FROM booking_seats bs
    JOIN seat_availability sa
      ON bs.availability_id = sa.availability_id
    JOIN seats s
      ON sa.seat_id = s.seat_id
    JOIN coaches c
      ON s.coach_id = c.coach_id
    WHERE bs.booking_id = ?
    ORDER BY CAST(s.seat_number AS UNSIGNED)
    `,
    [bookingId]
  );

  const [passengers] = await db.execute(
    `
    SELECT
      passenger_name,
      age,
      gender
    FROM booking_passengers
    WHERE booking_id = ?
    ORDER BY passenger_id
    `,
    [bookingId]
  );

  rows[0].seats = seats;
  rows[0].passengers = passengers;

  return rows[0];
};

export const getUserEmailById = async (userId) => {
  const [rows] = await db.query(
    "SELECT email FROM users WHERE user_id = ?",
    [userId]
  );

  return rows.length ? rows[0].email : null;
};

export const updateBookingStatus = async (bookingId, status) => {
  // Update booking status
  await db.execute(
    `
    UPDATE bookings
    SET status = ?
    WHERE booking_id = ?
    `,
    [status, bookingId]
  );

  // If booking is confirmed, update seat availability
  if (status === "CONFIRMED") {
    await db.execute(
      `
      UPDATE seat_availability
      SET
        status = 'BOOKED',
        booked_at = NOW(),
        locked_at = NULL
      WHERE availability_id IN (
        SELECT availability_id
        FROM booking_seats
        WHERE booking_id = ?
      )
      `,
      [bookingId]
    );
  }
};

/**
 * Optimized query for My Bookings Summary cards
 * Reuses the same schema joins as getTicketData with subqueries for passenger details
 */
export const getMyBookings = async (userId) => {
  const query = `
    SELECT 
      b.booking_id AS bookingId,
      b.booking_code AS bookingCode,
      t.train_name AS trainName,
      t.train_no AS trainNo,
      s1.station_name AS source,
      s2.station_name AS destination,
      ts.travel_date AS travelDate,
      t.departure_time AS departureTime,
      t.arrival_time AS arrivalTime,
      b.coach_type AS coachType,
      b.status,
      b.total_tickets AS totalTickets,
      b.total_amount AS totalAmount,
      (
        SELECT passenger_name 
        FROM booking_passengers bp 
        WHERE bp.booking_id = b.booking_id 
        ORDER BY bp.passenger_id ASC 
        LIMIT 1
      ) AS passengerName,
      (
        SELECT COUNT(*) 
        FROM booking_passengers bp 
        WHERE bp.booking_id = b.booking_id
      ) AS passengerCount
    FROM bookings b
    JOIN train_schedule ts
      ON b.schedule_id = ts.schedule_id
    JOIN trains t
      ON ts.train_id = t.train_id
    JOIN stations s1
      ON t.source_station_id = s1.station_id
    JOIN stations s2
      ON t.destination_station_id = s2.station_id
    WHERE b.user_id = ?
    ORDER BY b.booking_id DESC;
  `;

  const [rows] = await db.execute(query, [userId]);
  return rows;
};