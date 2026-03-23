# 🌐 MY-WEB-FORUM – Full Stack Web Application

## 📖 Project Overview

MY-WEB-FORUM is a full-stack web application that allows users to create, browse, and interact with posts in a dynamic forum environment.
The system supports authentication, post creation, commenting, and user interaction features.

The application follows a structured MVC (Model-View-Controller) architecture and integrates a relational database for data management.

---

## 🏗️ Architecture

The project is structured using MVC principles:

* **Models** → Handle database logic (`models/`)
* **Views** → EJS templates for UI (`views/`)
* **Controllers** → Business logic (`controllers/`)
* **Routes** → API and page routing (`routes/`)

---

## 📂 Project Structure

```text
MY-WEB-FORUM/
│
├── config/                # Database configuration
│   └── db.js
│
├── controllers/           # Application logic
│   ├── authController.js
│   ├── mainController.js
│   └── postController.js
│
├── database/              # SQL initialization
│   └── init.sql
│
├── middleware/            # Authentication middleware
│   └── authMiddleware.js
│
├── models/                # Data models
│   ├── userModel.js
│   ├── postModel.js
│   └── commentModel.js
│
├── public/                # Static files
│   ├── css/
│   ├── html/
│   └── js/
│       └── main.js
│
├── routes/                # Application routes
│   ├── authRoutes.js
│   ├── mainRoutes.js
│   └── postRoutes.js
│
├── views/                 # EJS templates
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── post.ejs
│   ├── profile.ejs
│   └── partials/
│
├── utils/                 # Helper functions
├── package.json
└── .gitignore
```

---

## ⚙️ Features

### 🔐 Authentication System

* User registration & login
* Session-based authentication
* Middleware protection for routes

---

### 📝 Post Management

* Create new posts
* View all posts
* Individual post pages

---

### 💬 Comments System

* Add comments to posts
* Display comments dynamically

---

### 🔍 Search & Filtering

* Search functionality for posts
* Category-based filtering

---

### ❤️ User Interactions

* Like system
* Share functionality
* Notifications

---

### 🎨 Frontend

* Dynamic UI using JavaScript
* EJS templating engine
* Responsive design

---

## 🗄️ Database

* Relational database (SQL)
* Initialization via:

```sql
database/init.sql
```

### Main Tables:

* Users
* Posts
* Comments

---

## 🛠️ Technologies Used

* Node.js
* Express.js
* EJS (templating engine)
* SQL Database
* JavaScript (Frontend)
* CSS

---

## 🚀 Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/Abdelrahmanbaraka/my-web-forum.git
```

2. Install dependencies:

```bash
npm install
```

3. Setup database:

* Run `database/init.sql`

4. Start the server:

```bash
npm start
```

5. Open in browser:

```text
http://localhost:3000
```

---

## 🔌 API & Routing

Routes are organized into modules:

* `/auth` → Authentication routes
* `/posts` → Post-related routes
* `/` → Main pages

---

## 💡 Key Highlights

* Clean MVC architecture
* Modular and scalable code structure
* Separation of concerns (routes, controllers, models)
* Full-stack implementation

---

## 👨‍💻 Author

**Abdelrahman Baraka**

---

## 📌 Notes

This project demonstrates full-stack development skills including backend architecture, database integration, and frontend interactivity.
