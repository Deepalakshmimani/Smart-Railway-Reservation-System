export const generateSchedules =
  async (
    connection,
    trainId,
    runningDays
  ) => {

    const scheduleIds = [];

    const today =
      new Date();

    for (
      let i = 0;
      i < 30;
      i++
    ) {

      const current =
        new Date();

      current.setDate(
        today.getDate() + i
      );
      
      const day =
        current.toLocaleDateString(

          "en-US",

          {
            weekday: "short"
          }
        );

      if (
        runningDays.includes(day)
      ) {

        const date =
          current
            .toISOString()
            .split("T")[0];

        const [result] =
          await connection.execute(

            `INSERT INTO train_schedule
            (
              train_id,
              travel_date
            )

            VALUES (?, ?)`,

            [
              trainId,
              date
            ]
          );

        scheduleIds.push(
          result.insertId
        );
      }
    }

    return scheduleIds;
  };