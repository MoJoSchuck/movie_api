const express = require('express'),
    morgan = require('morgan'),
    uuid = require('uuid'),
    bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());



let users = [
    {
        id: 1,
        name: 'Aaron von Isengard',
        favoriteMovies: ['Inception']
    },
    {
        id: 2,
        name: 'Megan Fox',
        favoriteMovies: []
    },
]

let movies = [
    {
        title: 'Inception',
        year: 2010,
        description: 'A thief who enters the dreams of others to steal their secrets.',
        genre: {
            name: 'Science Fiction',
            description: 'Fictional science that explores the possibilities of the future.'
        },
        director: {
            name: 'Christopher Nolan',
            bio: 'Christopher Nolan is a British-American film director, screenwriter, and producer. He is known for his distinctive filmmaking style and intricate, non-linear storytelling.',
            birth_year: 1970
        },
        imgURL: 'https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SY679_.jpg',
        featured: true
    },
    {
        title: 'The Dark Knight',
        year: 2008,
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        genre: {
            name: 'Action',
            description: 'Films that emphasize exciting action sequences.'
        },
        director: {
            name: 'Christopher Nolan',
            bio: 'Christopher Nolan is a British-American film director, screenwriter, and producer. He is known for his distinctive filmmaking style and intricate, non-linear storytelling.',
            birth_year: 1970
        },
        imgURL: 'https://m.media-amazon.com/images/I/81NlF4TmHdL._AC_SY679_.jpg',
        featured: true
    },
    {
        title: 'Interstellar',
        year: 2014,
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        genre: {
            name: 'Science Fiction',
            description: 'Fictional science that explores the possibilities of the future.'
        },
        director: {
            name: 'Christopher Nolan',
            bio: 'Christopher Nolan is a British-American film director, screenwriter, and producer. He is known for his distinctive filmmaking style and intricate, non-linear storytelling.',
            birth_year: 1970
        },
        imgURL: 'https://m.media-amazon.com/images/I/61Isuiqm6BL._AC_SY679_.jpg',
        featured: true
    },
    {
        title: 'The Shawshank Redemption',
        year: 1994,
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        genre: {
            name: 'Drama',
            description: 'Films that focus on character development and the emotional journey of the characters.'
        },
        director: {
            name: 'Frank Darabont',
            bio: 'Frank Darabont is a Hungarian-American film director, screenwriter, and producer. He is best known for his work in the horror genre, particularly for his adaptations of Stephen King stories.',
            birth_year: 1959
        },
        imgURL: 'https://m.media-amazon.com/images/I/81Z9jnpJY1L._AC_SY679_.jpg',
        featured: true
    },
    {
        title: 'Fight Club',
        year: 1999,
        description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
        genre: {
            name: 'Drama',
            description: 'Films that focus on character development and the emotional journey of the characters.'
        },
        director: {
            name: 'David Fincher',
            bio: 'David Fincher is an American film director and producer known for his dark and stylish thrillers. He has been nominated for two Academy Awards for Best Director and is known for films such as Seven, Fight Club, and The Social Network.',
            birth_year: 1962
        },
        imgURL: 'https://m.media-amazon.com/images/I/81oBxnIgpWL._AC_SY679_.jpg',
        featured: true
    },
    {
        title: 'Pulp Fiction',
        year: 1994,
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        genre: {
            name: 'Crime',
            description: 'Films that focus on the criminal underworld, criminal organizations, or the consequences of criminal actions.'
        },
        director: {
            name: 'Quentin Tarantino',
            bio: 'Quentin Tarantino is an American film director, screenwriter, producer, and actor. His films are characterized by nonlinear storylines, dark humor, stylized violence, extended dialogue, ensemble casts, references to popular culture, and the use of soundtracks from various music genres.',
            birth_year: 1963
        },
        imgURL: 'https://m.media-amazon.com/images/I/81EPrCr5G6L._AC_SY679_.jpg',
        featured: true
    },
    {
        title: 'The Godfather',
        year: 1972,
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        genre: {
            name: 'Crime',
            description: 'Films that focus on the criminal underworld, criminal organizations, or the consequences of criminal actions.'
        },
        director: {
            name: 'Francis Ford Coppola',
            bio: 'Francis Ford Coppola is an American film director, producer, and screenwriter. He is widely regarded as one of the greatest filmmakers of all time.',
            birth_year: 1939
        },
        imgURL: 'https://m.media-amazon.com/images/I/71gWi1cBEcL._AC_SY679_.jpg',
        featured: true
    },
    {
        title: 'The Matrix',
        year: 1999,
        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        genre: {
            name: 'Science Fiction',
            description: 'Fictional science that explores the possibilities of the future.'
        },
        director: {
            name: 'The Wachowskis',
            bio: 'Lana Wachowski and Lilly Wachowski, known together professionally as the Wachowskis, are American film and television directors, writers, and producers. They are known for creating The Matrix series and have received multiple awards for their work.',
            birth_year: [1965, 1967]
        },
        imgURL: 'https://m.media-amazon.com/images/I/81d9QPE-B5L._AC_SY679_.jpg',
        featured: true
    },
    {
        title: 'Forrest Gump',
        year: 1994,
        description: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.',
        genre: {
            name: 'Drama',
            description: 'Films that focus on character development and the emotional journey of the characters.'
        },
        director: {
            name: 'Robert Zemeckis',
            bio: 'Robert Zemeckis is an American film director, producer, and screenwriter. He is known for directing the Back to the Future trilogy, Who Framed Roger Rabbit, Forrest Gump, and The Polar Express.',
            birth_year: 1952
        },
        imgURL: 'https://m.media-amazon.com/images/I/81NCPD5NNgL._AC_SY679_.jpg',
        featured: true
    },
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        year: 2001,
        description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
        genre: {
            name: 'Fantasy',
            description: 'Films that involve magic, supernatural events, mythology, folklore, or exotic fantasy worlds.'
        },
        director: {
            name: 'Peter Jackson',
            bio: 'Sir Peter Robert Jackson is a New Zealand film director, screenwriter, and film producer. He is best known as the director, writer, and producer of The Lord of the Rings trilogy (2001–2003) and The Hobbit trilogy (2012–2014), both of which are adapted from the novels of the same name by J. R. R. Tolkien.',
            birth_year: 1961
        },
        imgURL: 'https://m.media-amazon.com/images/I/81CtWqfAAzL._AC_SY679_.jpg',
        featured: true
    },
    {
        title: 'The Lord of the Rings: The Two Towers',
        year: 2002,
        description: 'While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron\'s new ally, Saruman, and his hordes of Isengard.',
        genre: {
            name: 'Fantasy',
            description: 'Films that involve magic, supernatural events, mythology, folklore, or exotic fantasy worlds.'
        },
        director: {
            name: 'Peter Jackson',
            bio: 'Sir Peter Robert Jackson is a New Zealand film director, screenwriter, and film producer. He is best known as the director, writer, and producer of The Lord of the Rings trilogy (2001–2003) and The Hobbit trilogy (2012–2014), both of which are adapted from the novels of the same name by J. R. R. Tolkien.',
            birth_year: 1961
        },
        imgURL: 'https://m.media-amazon.com/images/I/81UOWPvE+RL._AC_SY679_.jpg',
        featured: true
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        year: 2003,
        description: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.',
        genre: {
            name: 'Fantasy',
            description: 'Films that involve magic, supernatural events, mythology, folklore, or exotic fantasy worlds.'
        },
        director: {
            name: 'Peter Jackson',
            bio: 'Sir Peter Robert Jackson is a New Zealand film director, screenwriter, and film producer. He is best known as the director, writer, and producer of The Lord of the Rings trilogy (2001–2003) and The Hobbit trilogy (2012–2014), both of which are adapted from the novels of the same name by J. R. R. Tolkien.',
            birth_year: 1961
        },
        imgURL: 'https://m.media-amazon.com/images/I/81SZDlxN5KL._AC_SY679_.jpg',
        featured: true
    }
];


// Middleware for logging HTTP requests with the combined format
// app.use(morgan('combined'));

// CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
})

// UPDATE
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }
})

// UPDATE
app.patch('/users/:id/favorites/:movieId', (req, res) => {
    const { id, movieId } = req.params;

    const user = users.find(user => user.id == id);
    const movie = movies.find(movie => movieId == movie.title);

    if (!user) {
        return res.status(400).send('No such user');
    }

    if (!movie) {
        return res.status(400).send('No such movie');
    }

    const isFavorite = user.favoriteMovies.includes(movie.title);

    if (isFavorite) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movie.title);
        res.status(200).json(user);
    } else {
        user.favoriteMovies.push(movie.title);
        res.status(200).json(user);
    }
})


// DELETE
app.delete('/users/:id/favorites/:movieId', (req, res) => {
    const { id, movieId } = req.params;

    const user = users.find(user => user.id == id);
    const movie = movies.find(movie => movieId == movie.title);

    if (!user) {
        return res.status(400).send('No such user');
    }

    if (!movie) {
        return res.status(400).send('No such movie');
    }

    const isFavorite = user.favoriteMovies.includes(movie.title);

    if (isFavorite) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movie.title);
        res.status(200).send(`${movie.title} has been removed from user ${id}'s favorites`);
    } else {
        res.status(400).send(`${movie.title} is not in user ${id}'s favorites`);
    }
})


// DELETE
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter( user => user.id != id );
        res.status(200).send(`user ${id} has been deleted`);;
    } else {
        res.status(400).send('no such user')
    }
})

// READ
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

// READ
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

// READ
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
});

// READ
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.genre.name === genreName).genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
    }
});

// READ
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.director.name === directorName).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }
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