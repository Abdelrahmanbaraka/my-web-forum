# My Web Forum

A server-rendered forum application built to practise full-stack development with Node.js, Express, EJS and PostgreSQL.

## Implemented areas

- User registration and login
- Password hashing with bcrypt
- Session-based authentication
- Creation and display of forum posts
- Comments associated with posts
- Search and category-oriented navigation
- German and English interface state
- Structured error and 404 pages

## Architecture

The project separates request handling, data access and presentation:

```text
my-web-forum/
├── config/        Database configuration
├── controllers/   Request and application logic
├── database/      SQL initialization
├── middleware/    Authentication checks
├── models/        PostgreSQL queries
├── public/        Static CSS and client assets
├── routes/        Express route modules
├── views/         EJS templates
└── server.js      Application entry point
```

## Technology stack

- Node.js and Express 4
- EJS templates
- PostgreSQL
- express-session
- bcrypt
- JavaScript and CSS

## Local setup

```bash
git clone https://github.com/Abdelrahmanbaraka/my-web-forum.git
cd my-web-forum
npm install
```

Create a `.env` file with the PostgreSQL connection settings expected by `config/db.js` and a private session secret. Initialize the database using the SQL files in `database/`, then start the application:

```bash
npm start
```

The default local address is `http://localhost:3000`.

## Current limitations

- This is a learning project and has not been prepared for production hosting.
- Sessions use the default in-memory store.
- Automated tests are not included.
- Production deployments should add secure cookies, CSRF protection, rate limiting and a persistent session store.
- Features such as notifications or social sharing are not presented here unless they are fully supported by the code.
