# Backend Documentation

## Overview
This is the backend part of the full-stack application built with Node.js, Express, and MongoDB. It serves as the API for the frontend application.

## Setup Instructions

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd my-fullstack-app/backend
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Configure the database**
   Update the database connection settings in `src/config/db.js` to match your MongoDB setup.

4. **Run the application**
   ```
   npm start
   ```

## API Endpoints

- **GET /api/items**: Retrieve a list of items.
- **POST /api/items**: Create a new item.

## Folder Structure

- `src/app.js`: Entry point of the application.
- `src/controllers`: Contains request handling logic.
- `src/models`: Defines Mongoose models.
- `src/routes`: Sets up API routes.
- `src/config`: Contains database configuration.