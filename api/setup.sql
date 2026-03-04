-- ============================================================
-- De Deur Lelydorp — MariaDB setup
-- Plak dit in: Cloudways → Database Manager → SQL tab
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','user') DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prayer_submissions (
    id BIGINT PRIMARY KEY,
    type VARCHAR(50),
    name VARCHAR(255),
    phone VARCHAR(50),
    note TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversion_submissions (
    id BIGINT PRIMARY KEY,
    date DATE,
    worker_name VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    address TEXT,
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    neighborhood VARCHAR(255),
    pickup TINYINT(1) DEFAULT 0,
    contact TINYINT(1) DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(50),
    preferred_date DATE,
    reason TEXT,
    status ENUM('new','contacted','completed') DEFAULT 'new',
    date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visitor_logs (
    id BIGINT PRIMARY KEY,
    date DATE,
    service_type VARCHAR(50),
    men INT DEFAULT 0,
    women INT DEFAULT 0,
    children INT DEFAULT 0,
    new_visitors INT DEFAULT 0,
    total INT DEFAULT 0,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS app_settings (
    id INT PRIMARY KEY DEFAULT 1,
    settings_json LONGTEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read TINYINT(1) DEFAULT 0
);

-- Standaard admin gebruikers invoegen
INSERT IGNORE INTO users (id, name, email, password, role) VALUES
('0', 'Super User',          'admin@admin.com',            'admin123', 'admin'),
('1', 'Beheerder Lelydorp',  'admin@dedeurlelydorp.com',   'admin123', 'admin'),
('2', 'Gemeentelid',         'lid@dedeurlelydorp.com',     'lid123',   'user');
