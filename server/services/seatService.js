export const generateSeatAvailability =
  async (

    connection,

    coachIds,

    scheduleIds

  ) => {

    for (const coach of coachIds) {

      const seatIds = [];

      /* Generate Seats */

      for (
        let i = 1;
        i <= coach.total_seats;
        i++
      ) {

        const [seatResult] =
          await connection.execute(

            `INSERT INTO seats
            (
              coach_id,
              seat_number
            )

            VALUES (?, ?)`,

            [
              coach.coach_id,
              i
            ]
          );

        seatIds.push(
          seatResult.insertId
        );
      }

      /* Generate Availability */

      for (
        const scheduleId
        of scheduleIds
      ) {

        for (
          const seatId
          of seatIds
        ) {

          await connection.execute(

            `INSERT INTO
            seat_availability
            (
              seat_id,
              schedule_id
            )

            VALUES (?, ?)`,

            [
              seatId,
              scheduleId
            ]
          );
        }
      }
    }
  };