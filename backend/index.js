const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const Port = 5000;

// سر توقيع بسيط لـ JWT
const secretKey = 'my_simple_secret';

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// الاتصال بقاعدة البيانات SQLite
const db = new sqlite3.Database('./mtbookig-bank.db', (err) => {
    if (err) console.error("Database connection error:", err.message);
    else console.log("Connected to the database successfully.");
});

// تسجيل مستخدم جديد
app.post('/register', (req, res) => {
    const { username, password, email, name, lastname } = req.body;

    if (!username || !password) {
        return res.status(400).send("Username and password are required");
    }

    const hashedPassword = bcrypt.hashSync(password, 5); // تقليل عدد جولات التشفير
    db.run(
        "INSERT INTO users (username, password, email, name, lastname) VALUES (?, ?, ?, ?, ?)",
        [username, hashedPassword, email, name, lastname],
        function (err) {
            if (err) {
                console.error("Error inserting user:", err.message);
                res.status(500).send("Internal server error");
            } else {
                res.json({ id: this.lastID, username });
            }
        }
    );
});

// تسجيل الدخول
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Username and password are required");
    }

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            console.error("Database error:", err.message);
            res.status(500).send("Internal server error");
        } else if (!user) {
            res.status(400).send("Invalid username or password");
        } else {
            const isValid = bcrypt.compareSync(password, user.password);
            if (isValid) {
                const token = jwt.sign({ id: user.id, username: user.username }, secretKey);
                res.json({ message: "you are successfully logged in" });
            } else {
                res.status(400).send("Invalid username or password");
            }
        }
    });
});

// API endpoint to add a new apartment
app.post('/api/apartments', (req, res) => {
    const {
      Adresse,
      Zimmeranzahl,
      'Fläche (m²)': Flaeche,
      'Monatliche Miete': Miete,
      Status,
      img1,
      img2,
      img3,
      img4,
      Beschreibung,
      Wohnungstyp,
    } = req.body;
  
    const query = `
      INSERT INTO Wohnungen (Adresse, Zimmeranzahl, "Fläche (m²)", "Monatliche Miete", Status, img1, img2, img3, img4, Beschreibung, Wohnungstyp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.run(query, [Adresse, Zimmeranzahl, Flaeche, Miete, Status, img1, img2, img3, img4, Beschreibung, Wohnungstyp], function(err) {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.status(200).json({ message: 'Apartment added successfully', id: this.lastID });
      }
    });
  });

// بدء تشغيل الخادم
app.listen(Port, () => {
    console.log(`Server running at http://localhost:${Port}/`);
});
