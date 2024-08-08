if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express'),
    morgan = require('morgan'),
    uuid = require('uuid'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    cors = require('cors'),
    { check, validationResult } = require('express-validator');

const app = express();

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://myflix777.netlify.app', 'http://localhost:4200', 'https://mojoschuck.github.io'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/cfDB');
mongoose.connect(process.env.CONNECTION_URI);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import auth.js
let auth = require('./auth')(app);

// Import passport and passport.js
const passport = require('passport');
require('./passport');

// Middleware for logging HTTP requests with the combined format
app.use(morgan('combined'));

/**
 * @function
 * @name signupUser
 * @description Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} If there is an error while creating the user
 * @returns {Object} JSON response containing the new user
 */
app.post('/users', [
    check('Username', 'Username is required with at least 5 characters').isLength({ min: 5 }),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users.create({
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                })
                    .then((user) => { res.status(201).json(user) })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

/**
 * @function
 * @name updateUser
 * @description Update a user's info by username
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} If there is an error while updating the user
 * @returns {Object} JSON response containing the updated user
 */
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }
    let updatedUserData = {
        Username: req.body.Username,
        Email: req.body.Email,
        Birthday: req.body.Birthday
    };
    if (req.body.Password) {
        updatedUserData.Password = Users.hashPassword(req.body.Password);
    }
    await Users.findOneAndUpdate(
        { Username: req.params.Username },
        { $set: updatedUserData },
        { new: true } // Return the updated document
    )
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * @function
 * @name addFavoriteMovie
 * @description Add a movie to a user's list of favorites
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} If there is an error while adding the movie
 * @returns {Object} JSON response containing the updated user
 */
app.patch('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }) // This line makes sure that the updated document is returned
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * @function
 * @name removeFavoriteMovie
 * @description Delete a movie from a user's list of favorites
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} If there is an error while deleting the movie
 * @returns {Object} JSON response containing the updated user
 */
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }) // This line makes sure that the updated document is returned
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * @function
 * @name deleteUser
 * @description Delete a user by username
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} If there is an error while deleting the user
 * @returns {String} Success message
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndDelete({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(404).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * @function
 * @name welcomeMessage
 * @description Send a welcome message
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {String} Welcome message
 */
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

/**
 * @function
 * @name getAllMovies
 * @description Get all movies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} If there is an error while retrieving the movies
 * @returns {Object[]} List of movies
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

/**
 * @function
 * @name getMovieByTitle
 * @description Get a movie by title
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} If there is an error while retrieving the movie
 * @returns {Object} Movie details
 */
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const title = req.params.title;
    const movie = await Movies.findOne({ Title: title });

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).send('Movie not found');
    }
});

/**
 * @function
 * @name getGenreByName
 * @description Get a genre by name
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} If there is an error while retrieving the genre
 * @returns {Object} Genre details
 */
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const genreName = req.params.genreName;
        const movie = await Movies.findOne({ 'Genre.Name': genreName });

        if (movie) {
            res.status(200).json(movie.Genre);
        } else {
            res.status(404).send('No such genre found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

/**
 * @function
 * @name getDirectorByName
 * @description Get a director by name
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} If there is an error while retrieving the director
 * @returns {Object} Director details
 */
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const directorName = req.params.directorName;
        const movie = await Movies.findOne({ 'Director.Name': directorName });

        if (movie) {
            res.status(200).json(movie.Director);
        } else {
            res.status(404).send('No such director');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }
});

/**
 * @function
 * @name getAllUsers
 * @description Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} If there is an error while retrieving the users
 * @returns {Object[]} List of users
 */
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * @function
 * @name getUserByUsername
 * @description Get a user by username
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {String} req.params.Username - The username of the user to retrieve
 * @throws {Error} If there is an error while retrieving the user
 * @returns {Object} User details
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Middleware for serving static files from the public directory
app.use(express.static('public'));

// Error-handling middleware called when an error occurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server and listen for requests on port 8080
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});
