CREATE DATABASE IF NOT EXISTS ticketapp;
USE ticketapp;

-- 1. Users
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    reward_credits DECIMAL(10,2) DEFAULT 0,
    pending_rewards DECIMAL(10,2) DEFAULT 0,
    feedback_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Stations
CREATE TABLE stations (
    station_id INT AUTO_INCREMENT PRIMARY KEY,
    station_name VARCHAR(100) NOT NULL,
    station_code VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Trains
CREATE TABLE trains (
    train_id INT AUTO_INCREMENT PRIMARY KEY,
    train_name VARCHAR(100) NOT NULL,
    train_no VARCHAR(20) UNIQUE NOT NULL,
    source_station_id INT,
    destination_station_id INT,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    running_days JSON,
    rating DECIMAL(2,1) DEFAULT 4.0,
    total_reviews INT DEFAULT 0,
    status ENUM('AVAILABLE', 'CANCELLED') DEFAULT 'AVAILABLE',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_station_id) REFERENCES stations(station_id),
    FOREIGN KEY (destination_station_id) REFERENCES stations(station_id)
);

-- 4. Coaches
CREATE TABLE coaches (
    coach_id INT AUTO_INCREMENT PRIMARY KEY,
    train_id INT,
    coach_name VARCHAR(20) NOT NULL,
    coach_type ENUM('AC_SLEEPER', 'SLEEPER', 'CHAIR_CAR', 'GENERAL') NOT NULL,
    total_seats INT NOT NULL,
    base_price DECIMAL(10,2) DEFAULT 0,
    status ENUM('AVAILABLE', 'CANCELLED') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(train_id),
    UNIQUE (train_id, coach_name)
);

-- 5. Seats
CREATE TABLE seats (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    coach_id INT,
    seat_number VARCHAR(10) NOT NULL,
    status ENUM('AVAILABLE', 'CANCELLED') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coach_id) REFERENCES coaches(coach_id),
    UNIQUE (coach_id, seat_number)
);

-- 6. Train Schedule
CREATE TABLE train_schedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    train_id INT,
    travel_date DATE NOT NULL,
    status ENUM('AVAILABLE', 'CANCELLED') DEFAULT 'AVAILABLE',
    is_auto_generated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(train_id),
    UNIQUE (train_id, travel_date)
);

-- 7. Seat Availability
CREATE TABLE seat_availability (
    availability_id INT AUTO_INCREMENT PRIMARY KEY,
    seat_id INT,
    schedule_id INT,
    status ENUM('AVAILABLE', 'LOCKED', 'BOOKED') DEFAULT 'AVAILABLE',
    locked_at DATETIME NULL,
    booked_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id),
    FOREIGN KEY (schedule_id) REFERENCES train_schedule(schedule_id),
    UNIQUE (seat_id, schedule_id),
    INDEX idx_schedule_status (schedule_id, status)
);

-- 8. Bookings
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(50) UNIQUE NOT NULL,
    user_id INT,
    schedule_id INT,
    coach_type ENUM('SLEEPER', 'AC_SLEEPER', 'CHAIR_CAR', 'GENERAL'),
    total_tickets INT NOT NULL,
    total_amount DECIMAL(10,2),
    payment_expiry DATETIME,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (schedule_id) REFERENCES train_schedule(schedule_id)
);

-- 9. Booking Seats
CREATE TABLE booking_seats (
    booking_seat_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    availability_id INT,
    seat_number VARCHAR(20),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (availability_id) REFERENCES seat_availability(availability_id)
);

-- 10. Booking Passengers
CREATE TABLE booking_passengers (
    passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    passenger_name VARCHAR(100),
    age INT,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- 11. Payments
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    amount DECIMAL(10,2),
    refund_amount DECIMAL(10,2) DEFAULT 0,
    transaction_id VARCHAR(100),
    payment_method VARCHAR(50),
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    failure_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- 12. Reward Transactions
CREATE TABLE reward_transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    booking_id INT NULL,
    transaction_type ENUM('EARNED', 'CLAIMED', 'REDEEMED') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE SET NULL
);

-- 13. Cancellation Logs
CREATE TABLE cancellation_logs (
    cancellation_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    reason VARCHAR(255),
    comment TEXT,
    refund_amount DECIMAL(10,2),
    cancelled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- 14. Waiting List
CREATE TABLE waiting_list (
    waiting_id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_id INT,
    user_id INT,
    booking_id INT,
    waiting_number INT,
    coach_type VARCHAR(50),
    status ENUM('WAITING', 'CONFIRMED', 'CANCELLED') DEFAULT 'WAITING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES train_schedule(schedule_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- 15. Notifications
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 16. Train Feedback
CREATE TABLE train_feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    user_id INT,
    train_id INT,
    overall_rating INT,
    cleanliness_rating VARCHAR(50),
    comfort_rating VARCHAR(50),
    timing_rating VARCHAR(50),
    staff_rating VARCHAR(50),
    travel_type VARCHAR(50),
    suggestions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_feedback UNIQUE (booking_id, user_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (train_id) REFERENCES trains(train_id)
);