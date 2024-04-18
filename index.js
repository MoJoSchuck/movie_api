const express = require('express');
const morgan = require('morgan');
const app = express();

let topTenMovies = [
    { title: 'Inception', director: 'Christopher Nolan' },
    { title: 'The Dark Knight', director: 'Christopher Nolan' },
    { title: 'Interstellar', director: 'Christopher Nolan' },
    { title: 'The Shawshank Redemption', director: 'Frank Darabont' },
    { title: 'Fight Club', director: 'David Fincher' },
    { title: 'Pulp Fiction', director: 'Quentin Tarantino' },
    { title: 'The Godfather', director: 'Francis Ford Coppola' },
    { title: 'The Matrix', director: 'The Wachowskis' },
    { title: 'Forrest Gump', director: 'Robert Zemeckis' },
    { title: 'The Lord of the Rings: The Fellowship of the Ring', director: 'Peter Jackson' }
];

// Middleware for logging HTTP requests with the combined format
app.use(morgan('combined'));

// GET route for the root URL ("/"), returning a simple welcome message
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

// GET route for the "/movies" URL, returning a JSON response with the top 10 movies
app.get('/movies', (req, res) => {
    res.json(topTenMovies);
  });

// Middleware for serving static files from the public directory
app.use(express.static('public'));

// Error-handling middleware called when an error occurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  

// Start the server and listen for requests on port 8080
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});