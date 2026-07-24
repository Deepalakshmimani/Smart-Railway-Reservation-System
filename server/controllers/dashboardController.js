import db from "../configs/db.js";

export const getDashboard = async (req, res) => {

    try {

        const userId = req.user.id;

        /* ====================================
           USER PROFILE
        ==================================== */

        const [profileRows] = await db.execute(
            `
            SELECT
                user_id,
                name,
                email,
                reward_credits,
                pending_rewards,
                feedback_count,
                created_at
            FROM users
            WHERE user_id = ?
            `,
            [userId]
        );

        if (profileRows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        const profile = profileRows[0];

        /* ====================================
           DASHBOARD STATISTICS
        ==================================== */

        const [[bookingStats]] = await db.execute(
            `
            SELECT

                COUNT(*) AS totalBookings,

                SUM(
                    CASE
                        WHEN status='CONFIRMED'
                        THEN 1
                        ELSE 0
                    END
                ) AS confirmedBookings,

                SUM(
                    CASE
                        WHEN status='CANCELLED'
                        THEN 1
                        ELSE 0
                    END
                ) AS cancelledBookings,

                SUM(total_amount) AS totalSpent

            FROM bookings

            WHERE user_id = ?
            `,
            [userId]
        );

        const [[refundStats]] = await db.execute(
            `
            SELECT

                IFNULL(
                    SUM(refund_amount),
                    0
                ) AS refundAmount

            FROM payments p

            JOIN bookings b

                ON p.booking_id=b.booking_id

            WHERE b.user_id=?
            `,
            [userId]
        );

        const [[upcomingTrips]] = await db.execute(
            `
            SELECT COUNT(*) AS upcomingTrips

            FROM bookings b

            JOIN train_schedule ts

                ON b.schedule_id=ts.schedule_id

            WHERE

                b.user_id=?

                AND b.status='CONFIRMED'

                AND ts.travel_date>=CURDATE()
            `,
            [userId]
        );

        const stats = {

            totalBookings:

                bookingStats.totalBookings || 0,

            totalSpent:

                Number(
                    bookingStats.totalSpent || 0
                ),

            rewardWallet:

                Number(
                    profile.reward_credits
                ),

            pendingRewards:

                Number(
                    profile.pending_rewards
                ),

            refundAmount:

                Number(
                    refundStats.refundAmount
                ),

            feedbackCount:

                profile.feedback_count,

            upcomingTrips:

                upcomingTrips.upcomingTrips

        };

        /* ====================================
           REWARD CARD
        ==================================== */

        const reward = {

            rewardWallet:

                Number(
                    profile.reward_credits
                ),

            pendingRewards:

                Number(
                    profile.pending_rewards
                ),

            feedbackCount:

                profile.feedback_count,

            requiredFeedback: 10,

            progress:

                profile.feedback_count % 10,

            claimAvailable:

                profile.feedback_count >= 10

        };

        /* ====================================
           UPCOMING JOURNEY
        ==================================== */

        const [journeyRows] = await db.execute(
            `
            SELECT

                b.booking_id,

                b.booking_code,

                ts.travel_date,

                t.train_name,

                t.train_no,

                src.station_name
                    AS source,

                dest.station_name
                    AS destination,

                MIN(bs.seat_number)
                    AS seatNumber,

                b.coach_type

            FROM bookings b

            JOIN train_schedule ts

                ON b.schedule_id=ts.schedule_id

            JOIN trains t

                ON ts.train_id=t.train_id

            JOIN stations src

                ON t.source_station_id=src.station_id

            JOIN stations dest

                ON t.destination_station_id=
                   dest.station_id

            LEFT JOIN booking_seats bs

                ON b.booking_id=bs.booking_id

            WHERE

                b.user_id=?

                AND b.status='CONFIRMED'

                AND ts.travel_date>=CURDATE()

            GROUP BY

                b.booking_id

            ORDER BY

                ts.travel_date

            LIMIT 1
            `,
            [userId]
        );

        let upcomingJourney = null;

        if (journeyRows.length > 0) {

            const trip = journeyRows[0];

            const today = new Date();

            const travelDate =
                new Date(trip.travel_date);

            const diffDays = Math.ceil(

                (travelDate - today) /

                (1000 * 60 * 60 * 24)

            );

            upcomingJourney = {

                bookingId:

                    trip.booking_id,

                bookingCode:

                    trip.booking_code,

                trainName:

                    trip.train_name,

                trainNo:

                    trip.train_no,

                source:

                    trip.source,

                destination:

                    trip.destination,

                seatNumber:

                    trip.seatNumber,

                coach:

                    trip.coach_type,

                travelDate:

                    trip.travel_date,

                daysRemaining:

                    diffDays

            };

        }


        /* ====================================
           MONTHLY BOOKING CHART
        ==================================== */

        const [bookingChart] = await db.execute(
            `
              SELECT

                MONTH(b.created_at) AS monthNo,

                DATE_FORMAT(
                    MIN(b.created_at),
                    '%b'
                ) AS month,

                COUNT(*) AS bookings

            FROM bookings b

            WHERE

                b.user_id = ?

                AND YEAR(b.created_at) = YEAR(CURDATE())

            GROUP BY

                MONTH(b.created_at)

            ORDER BY

                monthNo
            `,
            [userId]
        );

        /* ====================================
           MONTHLY SPENDING
        ==================================== */

        const [spendingChart] = await db.execute(
            `
              SELECT

                  MONTH(b.created_at) AS monthNo,

                  DATE_FORMAT(
                      MIN(b.created_at),
                      '%b'
                  ) AS month,

                  SUM(b.total_amount) AS amount

              FROM bookings b

              WHERE

                  b.user_id = ?

                  AND b.status = 'CONFIRMED'

                  AND YEAR(b.created_at) = YEAR(CURDATE())

              GROUP BY

                  MONTH(b.created_at)

              ORDER BY

                  monthNo
            `,
            [userId]
        );

        /* ====================================
           BOOKING STATUS
        ==================================== */

        const [[statusRows]] = await db.execute(
            `
            SELECT

                SUM(
                    CASE
                        WHEN status='CONFIRMED'
                        THEN 1
                        ELSE 0
                    END
                ) confirmed,

                SUM(
                    CASE
                        WHEN status='CANCELLED'
                        THEN 1
                        ELSE 0
                    END
                ) cancelled,

                SUM(
                    CASE
                        WHEN status='PENDING'
                        THEN 1
                        ELSE 0
                    END
                ) pending

            FROM bookings

            WHERE user_id=?
            `,
            [userId]
        );

        const bookingStatus = [

            {

                name: "Confirmed",

                value: Number(
                    statusRows.confirmed || 0
                )

            },

            {

                name: "Cancelled",

                value: Number(
                    statusRows.cancelled || 0
                )

            },

            {

                name: "Pending",

                value: Number(
                    statusRows.pending || 0
                )

            }

        ];

        /* ====================================
           FAVOURITE ROUTE
        ==================================== */

        const [routeRows] = await db.execute(
            `
            SELECT

                src.station_name AS source,

                dest.station_name AS destination,

                COUNT(*) AS trips

            FROM bookings b

            JOIN train_schedule ts

                ON b.schedule_id=ts.schedule_id

            JOIN trains t

                ON ts.train_id=t.train_id

            JOIN stations src

                ON src.station_id=t.source_station_id

            JOIN stations dest

                ON dest.station_id=t.destination_station_id

            WHERE

                b.user_id=?

                AND b.status='CONFIRMED'

            GROUP BY

                source,

                destination

            ORDER BY

                trips DESC

            LIMIT 1
            `,
            [userId]
        );

        const favouriteRoute =

            routeRows.length > 0

            ? routeRows[0]

            : null;

        /* ====================================
           RECENT ACTIVITY
        ==================================== */

        const [activities] = await db.execute(
            `
              (
              SELECT

                  b.created_at,

                  'BOOKING' AS type,

                  CONCAT(
                      'Booking ',
                      b.booking_code,
                      ' confirmed'
                  ) AS description

              FROM bookings b

              WHERE

                  b.user_id = ?

                  AND b.status = 'CONFIRMED'

              )

              UNION ALL

              (

              SELECT

                  p.created_at,

                  'PAYMENT' AS type,

                  CONCAT(
                      'Payment ₹',
                      p.amount,
                      ' successful'
                  ) AS description

              FROM payments p

              JOIN bookings b

                  ON p.booking_id = b.booking_id

              WHERE

                  b.user_id = ?

                  AND p.status = 'SUCCESS'

              )

              UNION ALL

              (

              SELECT

                  tf.created_at,

                  'FEEDBACK' AS type,

                  'Feedback submitted' AS description

              FROM train_feedback tf

              WHERE

                  tf.user_id = ?

              )

              UNION ALL

              (

              SELECT

                  rt.created_at,

                  'REWARD' AS type,

                  rt.description

              FROM reward_transactions rt

              WHERE

                  rt.user_id = ?

              )

              ORDER BY created_at DESC

              LIMIT 8
            `,
            [

                userId,

                userId,

                userId,

                userId

            ]
        );

        /* ====================================
           RESPONSE
        ==================================== */

        return res.status(200).json({

            success: true,

            dashboard: {

                profile,

                stats,

                reward,

                upcomingJourney,

                monthlyBookings:

                    bookingChart,

                monthlySpending:

                    spendingChart,

                bookingStatus,

                favouriteRoute,

                recentActivities:

                    activities

            }

        });

    }

    

      catch (error) {

    console.error("Dashboard Error:");
    console.error(error);
    console.error("SQL:", error.sql);

    return res.status(500).json({
        success: false,
        message: error.message,
        sql: error.sql
    });

}

};
