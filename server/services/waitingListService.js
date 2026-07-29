export const getNextWaitingNumber = async (
  connection,
  scheduleId,
  coachType
) => {

  const [rows] = await connection.execute(
    `
    SELECT COALESCE(MAX(waiting_number),0)+1 AS nextNumber
    FROM waiting_list
    WHERE
      schedule_id = ?
      AND coach_type = ?
      AND status = 'WAITING'
    `,
    [
      scheduleId,
      coachType
    ]
  );

  return rows[0].nextNumber;
};

export const addToWaitingList = async (
  connection,
  {
    userId,
    scheduleId,
    coachType,
    passengers,
    totalAmount
  }
) => {

  const bookingCode = "BK" + Date.now();

  const waitingNumber =
    await getNextWaitingNumber(
      connection,
      scheduleId,
      coachType
    );

  const [bookingResult] =
    await connection.execute(
      `
      INSERT INTO bookings
      (
        booking_code,
        user_id,
        schedule_id,
        coach_type,
        total_tickets,
        total_amount,
        status
      )
      VALUES
      (?,?,?,?,?,?,?)
      `,
      [
        bookingCode,
        userId,
        scheduleId,
        coachType,
        passengers.length,
        totalAmount,
        "WAITING"
      ]
    );

  const bookingId =
    bookingResult.insertId;

  // Save Passengers

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
      VALUES (?,?,?,?)
      `,
      [
        bookingId,
        passenger.name,
        passenger.age,
        passenger.gender
      ]
    );
  }

  // Create Payment Record

  await connection.execute(
    `
    INSERT INTO payments
    (
      booking_id,
      amount,
      status
    )
    VALUES
    (?, ?, 'PENDING')
    `,
    [
      bookingId,
      totalAmount
    ]
  );

  // Insert Waiting List

  await connection.execute(
    `
    INSERT INTO waiting_list
    (
      schedule_id,
      user_id,
      booking_id,
      waiting_number,
      coach_type,
      status
    )
    VALUES
    (?, ?, ?, ?, ?, 'WAITING')
    `,
    [
      scheduleId,
      userId,
      bookingId,
      waitingNumber,
      coachType
    ]
  );

  return {

    bookingId,

    bookingCode,

    waitingNumber

  };

};