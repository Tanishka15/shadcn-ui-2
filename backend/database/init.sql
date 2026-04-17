-- Create SafeSpace Database
CREATE DATABASE IF NOT EXISTS safespace;
USE safespace;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(50),
    campus VARCHAR(100),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    trusted_contacts JSON,
    profile_picture VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Mood Logs Table
CREATE TABLE IF NOT EXISTS mood_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mood_level INT CHECK (mood_level BETWEEN 1 AND 5),
    mood_emoji VARCHAR(10),
    mood_label VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Breathing Exercises Table
CREATE TABLE IF NOT EXISTS breathing_exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exercise_type VARCHAR(100),
    duration INT,
    cycles INT,
    completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Counseling Appointments Table
CREATE TABLE IF NOT EXISTS counseling_appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    counselor_name VARCHAR(100),
    appointment_date DATETIME,
    duration_minutes INT DEFAULT 60,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Wellness Resources Table
CREATE TABLE IF NOT EXISTS wellness_resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    content TEXT,
    resource_type VARCHAR(50),
    url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Sessions Table (for authentication)
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Doctor Availability Dashboard
CREATE TABLE IF NOT EXISTS doctor_schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day_name ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    doctor_name VARCHAR(100) DEFAULT 'Dr. John',
    specialization VARCHAR(100) DEFAULT 'General',
    status ENUM('Available', 'Busy', 'Offline') DEFAULT 'Available',
    max_slots INT DEFAULT 10,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Doctor Waiting List System
CREATE TABLE IF NOT EXISTS waiting_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    doctor_id INT NOT NULL,
    position INT NOT NULL,
    appointment_purpose TEXT,
    status ENUM('waiting', 'notified', 'confirmed', 'cancelled') DEFAULT 'waiting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctor_schedule(id) ON DELETE CASCADE
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    doctor_id INT NOT NULL,
    token_number INT DEFAULT NULL,
    student_name VARCHAR(255) NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    appointment_day VARCHAR(50) NOT NULL,
    purpose ENUM('General illness', 'Injury', 'Follow-up', 'Medical certificate') NOT NULL,
    notes TEXT,
    status ENUM('Confirmed', 'Pending', 'Cancelled', 'Completed') DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctor_schedule(id) ON DELETE CASCADE
);

-- Seed initial doctor schedule
INSERT INTO doctor_schedule (day_name, doctor_name, specialization, status) VALUES
('Monday', 'Dr. John', 'General', 'Available'),
('Tuesday', 'Dr. John', 'Gynecologist', 'Available'),
('Wednesday', 'Dr. John', 'General', 'Available'),
('Thursday', 'Dr. John', 'Orthopedic', 'Available'),
('Friday', 'Dr. John', 'General', 'Available'),
('Saturday', 'Dr. John', 'General', 'Available'),
('Sunday', 'No Doctor Available', 'N/A', 'Offline');

-- Create Indexes for better query performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_mood_user ON mood_logs(user_id);
CREATE INDEX idx_appointment_user ON counseling_appointments(user_id);
CREATE INDEX idx_session_token ON sessions(token);
