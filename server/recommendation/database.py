"""
database.py
-----------
Handles MySQL database connection for the Railway Recommendation System.

Responsibilities:
    - Read database credentials from .env
    - Create MySQL connection
    - Close connection safely
"""

import os
import logging
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)


class DatabaseConnectionError(Exception):
    """Custom exception for database connection errors."""
    pass


def get_connection():
    """
    Creates and returns a MySQL database connection.

    Returns:
        mysql.connector.connection.MySQLConnection

    Raises:
        DatabaseConnectionError
    """

    try:
        logging.info("Connecting to MySQL database...")

        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )

        if connection.is_connected():
            logging.info("Database connection established successfully.")
            return connection

        raise DatabaseConnectionError("Unable to establish database connection.")

    except Error as e:
        logging.error(f"MySQL Connection Error: {e}")
        raise DatabaseConnectionError(str(e))


def close_connection(connection):
    """
    Safely closes the database connection.

    Args:
        connection: MySQL connection object
    """

    try:
        if connection and connection.is_connected():
            connection.close()
            logging.info("Database connection closed.")

    except Error as e:
        logging.error(f"Error while closing connection: {e}")