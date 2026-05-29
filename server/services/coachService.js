export const generateCoaches =async (connection,trainId,coachCounts) => {

    const coachIds = [];
    const configs = [
      {
        type: "AC_SLEEPER",
        prefix: "A",
        count:coachCounts.ac_sleeper_coaches,
        seats: 48,
        price:coachCounts.ac_sleeper_price
      },

      {
        type: "SLEEPER",
        prefix: "S",
        count:coachCounts.sleeper_coaches,
        seats: 72,
        price:coachCounts.sleeper_price
      },

      {
        type: "CHAIR_CAR",
        prefix: "C",
        count:coachCounts.chair_car_coaches,
        seats: 60,
        price:coachCounts.chair_car_price
      },

      {
        type: "GENERAL",
        prefix: "G",
        count:
          coachCounts
            .general_coaches,
        seats: 90,
        price:
          coachCounts
            .general_price
      }

    ];

    for (const config of configs) {

      for (let i = 1;i <= config.count;i++) {

        const coachName =
          `${config.prefix}${i}`;

        const [coachResult] =
          await connection.execute(

            `INSERT INTO coaches
            (
              train_id,
              coach_name,
              coach_type,
              total_seats,
              base_price
            )

            VALUES (?, ?, ?, ?, ?)`,

            [
              trainId,
              coachName,
              config.type,
              config.seats,
              config.price
            ]
          );

        coachIds.push({
          coach_id:
            coachResult.insertId,
          total_seats:
            config.seats
        });
      }
    }

    return coachIds;
  };