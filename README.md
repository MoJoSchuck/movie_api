# MyFlix Server-Side Project

This is the server-side project for MyFlix, a web application for viewing information about movies, directors, and genres, as well as managing user profiles and favorite lists.

## Objective

The objective of this project is to build the server-side component of a "movies" web application. The application provides users with access to information about different movies, directors, and genres. Users can sign up, update their personal information, and create a list of their favorite movies.

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose

## Core Features

- Return a list of all movies
- Return data about a single movie by title
- Return data about a genre by name
- Return data about a director by name
- Allow new users to register
- Allow users to update their user info (username, password, email, date of birth)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
- Allow existing users to deregister

## Installation and Usage

1. Clone the repository: `git clone https://github.com/MoJoSchuck/movie_api.git`
2. Navigate to the project directory: `cd movie_api`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and fill in values.
5. Start the server: `npm start`
   The server runs by default on port 8080 (or `process.env.PORT`).

### Environment variables

See `.env.example` for all variables:

- `CONNECTION_URI` MongoDB connection string
- `JWT_SECRET` secret for signing/verifying JWTs
- `ALLOWED_ORIGINS` optional comma-separated list for CORS
- `PORT` optional server port

### Deploying on Render (or similar)

- Set Environment: `Node`
- Set Build Command: `npm install`
- Set Start Command: `npm start`
- Add Env Vars: `CONNECTION_URI`, `JWT_SECRET`, optional `ALLOWED_ORIGINS`, `NODE_ENV=production`
- Health check path: `/health` (returns 200)

## API Documentation

You can find the API documentation in the file `documentation.html`.

## Contributing

Please read the contribution guidelines before contributing.

## License

This project is licensed under the MIT License.
