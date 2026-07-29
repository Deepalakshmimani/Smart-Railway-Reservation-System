export const generateSeatAvailability = async (
  connection,
  coachIds,
  scheduleIds
) => {

  for (const coach of coachIds) {

    /* =========================
       BULK INSERT SEATS
    ========================= */

    const seatValues = [];

    for (let i = 1; i <= coach.total_seats; i++) {
      seatValues.push([
        coach.coach_id,
        i
      ]);
    }

    await connection.query(
      `
      INSERT INTO seats
      (
        coach_id,
        seat_number
      )
      VALUES ?
      `,
      [seatValues]
    );

    /* =========================
       GET GENERATED SEAT IDS
    ========================= */

    const [seatRows] = await connection.execute(
      `
      SELECT seat_id
      FROM seats
      WHERE coach_id = ?
      ORDER BY seat_number
      `,
      [coach.coach_id]
    );

    /* =========================
       BULK INSERT
       SEAT AVAILABILITY
    ========================= */

    const availabilityValues = [];

    for (const scheduleId of scheduleIds) {

      for (const seat of seatRows) {

        availabilityValues.push([
          seat.seat_id,
          scheduleId
        ]);

      }

    }

    await connection.query(
      `
      INSERT INTO seat_availability
      (
        seat_id,
        schedule_id
      )
      VALUES ?
      `,
      [availabilityValues]
    );

  }

};