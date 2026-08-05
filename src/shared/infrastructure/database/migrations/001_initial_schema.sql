-- Enable Spatial PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schema creation
CREATE SCHEMA IF NOT EXISTS waypoint;

-- Core domain tables baseline

-- 1. Users & Profiles
CREATE TABLE IF NOT EXISTS waypoint.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    trust_score NUMERIC(3, 2) DEFAULT 5.00 CHECK (trust_score >= 0.0 AND trust_score <= 5.0),
    is_verified_driver BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Communities / Organizations
CREATE TABLE IF NOT EXISTS waypoint.communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Community Mapping
CREATE TABLE IF NOT EXISTS waypoint.user_communities (
    user_id UUID REFERENCES waypoint.users(id) ON DELETE CASCADE,
    community_id UUID REFERENCES waypoint.communities(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, community_id)
);

-- 4. Vehicles
CREATE TABLE IF NOT EXISTS waypoint.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES waypoint.users(id) ON DELETE CASCADE,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    license_plate VARCHAR(50) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial Indices and extensions ready for Phase 2
