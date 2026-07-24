"""
data_loader.py
--------------
Loads data from MySQL and returns a single DataFrame
for the Recommendation Engine.

Responsibilities:
    - Execute SQL
    - Return Pandas DataFrame
    - No preprocessing
    - No feature engineering
"""

import logging
import pandas as pd

from database import get_connection, close_connection


class DataLoaderError(Exception):
    """Custom exception for Data Loader"""
    pass


def load_complete_dataset():
    """
    Loads the complete dataset required for
    the recommendation system.

    Returns
    -------
    pandas.DataFrame
    """

    connection = None

    try:

        logging.info("Loading recommendation dataset...")

        connection = get_connection()

        query = """
        SELECT

            b.booking_id,
            b.user_id,
            b.schedule_id,
            b.coach_type,
            b.total_amount,
            b.status AS booking_status,

            s.travel_date,
            s.status AS schedule_status,

            t.train_id,
            t.train_name,
            t.train_no,
            t.departure_time,
            t.arrival_time,
            t.rating AS train_rating,
            t.total_reviews,

            f.feedback_id,
            f.overall_rating,
            f.cleanliness_rating,
            f.comfort_rating,
            f.timing_rating,
            f.staff_rating,
            f.travel_type

        FROM bookings b

        INNER JOIN train_schedule s
            ON b.schedule_id = s.schedule_id

        INNER JOIN trains t
            ON s.train_id = t.train_id

        LEFT JOIN train_feedback f
            ON b.booking_id = f.booking_id

        WHERE

            b.status = 'CONFIRMED'

            AND s.status = 'AVAILABLE'

            AND t.status = 'AVAILABLE'

            AND t.is_active = 1
        """

        df = pd.read_sql(query, connection)

        logging.info(f"Dataset Loaded Successfully : {len(df)} rows")

        return df

    except Exception as e:

        logging.error(f"Data Loader Error : {e}")

        raise DataLoaderError(str(e))

    finally:

        close_connection(connection)