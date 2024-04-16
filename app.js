const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration
app.use(session({
  secret: 'your secret key', // Change the secret key for production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
}));

// Database connection
const db = new sqlite3.Database(path.join(__dirname, 'db', 'myplanner.db'), sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the myplanner SQLite database.');
});

// Registration route
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;

    db.run(query, [username, password], function(err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                res.status(409).send("Username already taken, please choose another one.");
            } else {
                res.status(500).send("Failed to register user: " + err.message);
            }
        } else {
            req.session.user_id = this.lastID;
            res.redirect('/dashboard.html'); // Redirect to the dashboard
        }
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT id FROM users WHERE username = ? AND password = ?`;

    db.get(query, [username, password], (err, row) => {
        if (err) {
            res.status(500).send("Login failed: " + err.message);
        } else if (row) {
            req.session.user_id = row.id;
            res.redirect('/dashboard.html'); // Redirect to the dashboard
        } else {
            res.status(401).send("Invalid username or password");
        }
    });
});

// Log out route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send({ error: "Error logging out" });
        }
        res.redirect('/'); // Redirect to the home page
    });
});

// Add Task route
app.post('/add-task', (req, res) => {
    if (!req.session.user_id) {
        return res.status(403).send({ error: "Not authorized" });
    }

    const { description, category, priority, due_date } = req.body;

    const query = `INSERT INTO tasks (user_id, description, category, priority, due_date) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [req.session.user_id, description, category, priority, due_date], function(err) {
        if (err) {
            res.status(500).send({ error: "Failed to add task: " + err.message });
        } else {
            res.send({ status: 'OK', taskId: this.lastID });
        }
    });
});

// Get Tasks route
app.get('/get-tasks', (req, res) => {
    if (!req.session.user_id) {
        return res.status(403).send({ error: "Not authorized" });
    }

    const query = `SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date, priority DESC`;
    db.all(query, [req.session.user_id], (err, rows) => {
        if (err) {
            res.status(500).send({ error: "Failed to retrieve tasks: " + err.message });
        } else {
            res.send(rows);
        }
    });
});

// Endpoint to mark a task as done
app.post('/done-task/:id', (req, res) => {
    const { id } = req.params;
    if (!req.session.user_id) {
        return res.status(403).send("Not authorized");
    }

    db.serialize(() => {
        db.run(`INSERT INTO completed_tasks (user_id, description, category, completed_date)
                SELECT user_id, description, category, DATE('now')
                FROM tasks WHERE id = ? AND user_id = ?`, [id, req.session.user_id]);

        db.run(`DELETE FROM tasks WHERE id = ? AND user_id = ?`, [id, req.session.user_id], (err) => {
            if (err) {
                return res.status(500).send("Failed to mark task as done: " + err.message);
            }
            res.send({ status: 'OK' });
        });
    });
});

// Endpoint to serve the Completed Tasks HTML page
app.get('/completed', (req, res) => {
    if (!req.session.user_id) {
        return res.status(403).send("Not authorized");
    }
    res.sendFile(path.join(__dirname, 'public', 'completed_tasks.html'));
});

// Endpoint to get completed tasks
app.get('/api/completed-tasks', (req, res) => {
    if (!req.session.user_id) {
        return res.status(403).send("Not authorized");
    }

    db.all(`SELECT * FROM completed_tasks WHERE user_id = ? ORDER BY completed_date DESC`, [req.session.user_id], (err, rows) => {
        if (err) {
            return res.status(500).send("Failed to retrieve completed tasks: " + err.message);
        }
        res.json(rows);
    });
});

// Endpoint to clear completed tasks
app.delete('/clear-completed-tasks', (req, res) => {
    if (!req.session.user_id) {
        return res.status(403).send("Not authorized");
    }

    const deleteQuery = `DELETE FROM completed_tasks WHERE user_id = ?`;
    db.run(deleteQuery, [req.session.user_id], (err) => {
        if (err) {
            console.error("Error clearing completed tasks: " + err.message);
            res.status(500).send("Failed to clear completed tasks.");
        } else {
            res.json({ status: 'OK' });
        }
    });
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
