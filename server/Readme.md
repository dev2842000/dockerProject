# Project Setup and Management

## 📋 Overview

This guide provides instructions for setting up the project, running database migrations, and managing seeders.

## 🚀 Setup Instructions

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v14 or later)
- **npm** (or yarn)
- **MySQL Server**

### Update .env

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=user_db


### 1. Steps To Run Project

- npm install

### 1. Start Project
**Local**
- npm run dev
**Docker**
- docker-compose down
- docker-compose up --build

### Run Migrations are used to set up your database schema. To apply all pending migrations, execute:
- npx sequelize init
- npm run migrate

### Seed the Database
**Local**
    - npm run seed
**Docker**
    - docker-compose exec backend npx sequelize-cli db:seed:all

### Undo Seeders
**Local**
    - npm run seed:undo
**Docker**
    - docker-compose exec backend npx sequelize-cli db:undo:all


## POSTMAN Collection URL:

- https://documenter.getpostman.com/view/21508865/2sA3kXFg4U