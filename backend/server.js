// // server.js
// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// // const mysql = require('mysql');
// const mysql = require('mysql2');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');


// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;
// const SECRET_KEY = process.env.SECRET_KEY;

// // Middleware
// app.use(cors({
//     origin: true, 
//     credentials: true
// }));
// app.use(express.json());
// app.use(cookieParser());

// // MySQL Connection
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// db.connect((err) => {
//     if (err) {
//         console.error('Database connection failed:', err);
//         return;
//     }
//     console.log('Connected to MySQL database.');
// });

// // Helper function to generate JWT
// const generateToken = (username) => {
//     return jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
// };

// // Login Route
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;

//     const getQuery = 'SELECT * FROM user WHERE username = ?';
//     db.query(getQuery, [username], (err, results) => {
//         if (err) {
//             console.error('Error during login:', err);
//             return res.status(500).json({ message: 'Internal server error' });
//         }

//         if (results.length > 0 && results[0].password === password) {
//             // Create JWT
//             const token = jwt.sign({ id: results[0].id }, SECRET_KEY, { expiresIn: '3h' });

//             // Set JWT as a cookie
//             res.cookie('token', token, { httpOnly: true });
//             res.status(200).json({ accountType: results[0].accountType });
//         } else {
//             res.status(401).json({ message: 'Invalid username or password' });
//         }
//     });
// });

// // Middleware to protect routes
// const authenticateToken = (req, res, next) => {
//     const token = req.cookies.token;
//     if (!token) return res.status(401).json({ message: 'Unauthorized' });

//     jwt.verify(token, SECRET_KEY, (err, user) => {
//         if (err) return res.status(403).json({ message: 'Invalid token' });
//         req.user = user;
//         next();
//     });
// };

// // Protected route example
// app.get('/protected', authenticateToken, (req, res) => {
//     res.status(200).json({ message: 'Protected content', user: req.user });
// });

// // Logout Route
// app.post('/logout', (req, res) => {
//     res.clearCookie('token');
//     res.status(200).json({ message: 'Logged out successfully' });
// });


// // Endpoint to handle patient and history insertion
// app.post('/patients', (req, res) => {
//     const { patientName, age, phone, address, illness, medicines, note, fee } = req.body;

//     // Check if patient with the same phone already exists
//     const checkPatientQuery = 'SELECT * FROM patient WHERE phone = ?';
//     db.query(checkPatientQuery, [phone], (err, results) => {
//         if (err) {
//             console.error('Error checking patient:', err);
//             return res.status(500).json({ message: 'Internal server error' });
//         }

//         const localDate = new Date();
//         const localDateTime = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
//             .toISOString()
//             .slice(0, 19)
//             .replace('T', ' ');

//         if (results.length === 0) {
//             // Insert into patient table if not exists
//             const insertPatientQuery = 'INSERT INTO patient (name, age, phone, address) VALUES (?, ?, ?, ?)';
//             db.query(insertPatientQuery, [patientName, age, phone, address], (err, result) => {
//                 if (err) {
//                     console.error('Error adding patient:', err);
//                     return res.status(500).json({ message: 'Failed to add patient' });
//                 }
//             });
//         }

//         // Insert into history table
//         const insertHistoryQuery = 'INSERT INTO history (dateTime, name, age, phone, address, illness, medicine, note, fee) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
//         db.query(insertHistoryQuery, [localDateTime, patientName, age, phone, address, illness, medicines, note, fee], (err, result) => {
//             if (err) {
//                 console.error('Error adding to history:', err);
//                 return res.status(500).json({ message: 'Failed to add history' });
//             }
//             res.status(200).json({ message: 'Data saved successfully' });
//         });
//     });
// });


// app.get('/history', (req, res) => {
//     const query = 'SELECT * FROM history';
//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error fetching history:', err);
//             return res.status(500).json({ message: 'Error fetching data' });
//         }
//         res.status(200).json(results);
//     });
// });


// app.get('/today/history', (req, res) => {
//     // Get today's date in Sri Lanka time (UTC+5:30)
//     const sriLankaOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
//     const sriLankaDate = new Date(Date.now() + sriLankaOffset);
//     const todayStart = new Date(sriLankaDate.setHours(0,0,0,0));
//     const todayEnd = new Date(sriLankaDate.setHours(23,59,59,999));

//     const query = `
//         SELECT name, fee, dateTime 
//         FROM history 
//         WHERE DATE(dateTime) = CURDATE()
//         ORDER BY dateTime DESC
//     `;
    
//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error fetching history:', err);
//             return res.status(500).json({ message: 'Error fetching data' });
//         }
//         res.status(200).json(results);
//     });
// });

// // Endpoint to get monthly income for a specific year
// app.get('/income/:year', (req, res) => {
//     const year = req.params.year;

//     // SQL query to get total fee for each month of the specified year
//     const query = `
//         SELECT MONTH(dateTime) AS month, SUM(fee) AS totalIncome
//         FROM history
//         WHERE YEAR(dateTime) = ?
//         GROUP BY MONTH(dateTime)
//         ORDER BY MONTH(dateTime)
//     `;

//     db.query(query, [year], (err, results) => {
//         if (err) {
//             console.error('Error fetching income data:', err);
//             return res.status(500).json({ message: 'Error fetching income data' });
//         }

//         // Prepare the data for the chart
//         const monthlyIncome = new Array(12).fill(0); // Initialize an array with 12 months
//         results.forEach(row => {
//             monthlyIncome[row.month - 1] = row.totalIncome; // row.month is 1-12
//         });

//         res.status(200).json(monthlyIncome);
//     });
// });


// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port: ${PORT}`);
// });

// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware
app.use(cors({
    origin: true, //['http://localhost:3000', 'https://doctor-gohagoda.surge.sh']
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// SQLite Connection

db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to SQLite database.');
});

// Initialize Tables if not exists (for the first run)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT,
            accountType TEXT
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS patient (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            age INTEGER,
            phone TEXT UNIQUE,
            address TEXT
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dateTime TEXT,
            name TEXT,
            age INTEGER,
            phone TEXT,
            address TEXT,
            illness TEXT,
            medicine TEXT,
            note TEXT,
            fee REAL
        );
    `);
});


app.post('/add-user', (req, res) => {
    const username = 'abc';
    const password = '123';
    const accountType = 'standard'; 

    // Insert the new user into the database
    const insertUserQuery = 'INSERT INTO user (username, password, accountType) VALUES (?, ?, ?)';
    db.run(insertUserQuery, [username, password, accountType], (err) => {
        if (err) {
            console.error('Error adding user:', err);
            return res.status(500).json({ message: 'Failed to add user' });
        }
        res.status(200).json({ message: 'User added successfully' });
    });
});


// Helper function to generate JWT
const generateToken = (username) => {
    return jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
};

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const getQuery = 'SELECT * FROM user WHERE username = ?';
    db.get(getQuery, [username], (err, result) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result && result.password === password) {
            const token = jwt.sign({ id: result.id }, SECRET_KEY, { expiresIn: '3h' });
            
            // Set cookie with proper settings
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 3 * 60 * 60 * 1000 // 3 hours
            });
            
            // Send token in response body as well
            res.status(200).json({ 
                token: token,
                accountType: result.accountType 
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    // Check both cookie and Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Protected content', user: req.user });
});

// Logout Route
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

// Endpoint to handle patient and history insertion
app.post('/patients', (req, res) => {
    const { patientName, age, phone, address, illness, medicines, note, fee } = req.body;

    const checkPatientQuery = 'SELECT * FROM patient WHERE phone = ?';
    db.get(checkPatientQuery, [phone], (err, result) => {
        if (err) {
            console.error('Error checking patient:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Create date in Sri Lanka timezone
        const now = new Date();
        // Add 5 hours and 30 minutes to UTC time
        const sriLankaTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
        const localDateTime = sriLankaTime.toISOString().slice(0, 19).replace('T', ' ');

        const handleInsertHistory = () => {
            const insertHistoryQuery = 'INSERT INTO history (dateTime, name, age, phone, address, illness, medicine, note, fee) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.run(insertHistoryQuery, [localDateTime, patientName, age, phone, address, illness, medicines, note, fee], (err) => {
                if (err) {
                    console.error('Error adding to history:', err);
                    return res.status(500).json({ message: 'Failed to add history' });
                }
                res.status(200).json({ message: 'Data saved successfully' });
            });
        };

        if (!result) {
            const insertPatientQuery = 'INSERT INTO patient (name, age, phone, address) VALUES (?, ?, ?, ?)';
            db.run(insertPatientQuery, [patientName, age, phone, address], function(err) {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        return res.status(400).json({ message: 'Phone number already exists' });
                    }
                    console.error('Error adding patient:', err);
                    return res.status(500).json({ message: 'Failed to add patient' });
                }
                console.log(`New patient added: ${patientName}`); // Log patient name on addition
                handleInsertHistory(); // Proceed to insert history after adding patient
            });
        } else {
            handleInsertHistory(); // Patient already exists, directly insert history
        }
    });
});




app.get('/history', (req, res) => {
    const query = 'SELECT * FROM history';
    db.all(query, (err, results) => {
        if (err) {
            console.error('Error fetching history:', err);
            return res.status(500).json({ message: 'Error fetching data' });
        }
        res.status(200).json(results);
    });
});

app.get('/today/history', (req, res) => {
    // Create date in Sri Lanka timezone
    const now = new Date();
    const sriLankaTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const todayDate = sriLankaTime.toISOString().slice(0, 10);

    const query = `
        SELECT name, fee, dateTime 
        FROM history 
        WHERE date(dateTime, '+5.5 hours') = ?
        ORDER BY dateTime DESC
    `;

    db.all(query, [todayDate], (err, results) => {
        if (err) {
            console.error('Error fetching history:', err);
            return res.status(500).json({ message: 'Error fetching data' });
        }
        res.status(200).json(results);
    });
});

app.get('/income/:year', (req, res) => {
    const year = req.params.year;

    const query = `
        SELECT strftime('%m', dateTime, '+5.5 hours') AS month, 
               SUM(fee) AS totalIncome
        FROM history
        WHERE strftime('%Y', dateTime, '+5.5 hours') = ?
        GROUP BY month
        ORDER BY month
    `;

    db.all(query, [year], (err, results) => {
        if (err) {
            console.error('Error fetching income data:', err);
            return res.status(500).json({ message: 'Error fetching income data' });
        }

        const monthlyIncome = new Array(12).fill(0);
        results.forEach(row => {
            monthlyIncome[parseInt(row.month) - 1] = row.totalIncome;
        });

        res.status(200).json(monthlyIncome);
    });
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
