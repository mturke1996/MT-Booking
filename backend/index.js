const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const Port = 5000;

// سر توقيع بسيط لـ JWT
const secretKey = "my_simple_secret";

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Middleware للتحقق من صحة التوكن
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401); // لا يوجد توكن، الرجوع بحالة 401

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403); // التوكن غير صالح أو منتهي، الرجوع بحالة 403
    req.user = user; // تخزين بيانات المستخدم في الطلب
    next(); // الانتقال إلى الخطوة التالية
  });
}

// الاتصال بقاعدة البيانات SQLite
const db = new sqlite3.Database("./mtbookig-bank.db", (err) => {
  if (err) console.error("Database connection error:", err.message);
  else console.log("Connected to the database successfully.");
});

// تسجيل مستخدم جديد
app.post("/register", (req, res) => {
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
app.post("/login", (req, res) => {
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
        const token = jwt.sign(
          { id: user.id, username: user.username },
          secretKey,
          { expiresIn: "1h" } // التوكن صالح لمدة ساعة
        );
        res.json({ message: "you are successfully logged in", token });
      } else {
        res.status(400).send("Invalid username or password");
      }
    }
  });
});

// استرجاع بيانات المستخدم بناءً على التوكن
app.get("/user", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.get("SELECT id, username, email, name, lastname FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) {
      console.error("Error fetching user data:", err.message);
      return res.status(500).send("Internal server error");
    }
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  });
});
// API endpoint to get user details
app.get("/user/:id", (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT u.id, u.username, u.email, u.name, u.lastname, 
           d.address, d.phone, d.birthdate, d.gender, d.occupation, d.profile_picture
    FROM users u
    LEFT JOIN user_details d ON u.id = d.user_id
    WHERE u.id = ?
  `;

  db.get(query, [userId], (err, user) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).send("Internal server error");
    }
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  });
});

// API endpoint to add a new apartment
app.post("/api/apartments", (req, res) => {
  const {
    Adresse,
    Zimmeranzahl,
    "Fläche (m²)": Flaeche,
    "Monatliche Miete": Miete,
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

  db.run(
    query,
    [
      Adresse,
      Zimmeranzahl,
      Flaeche,
      Miete,
      Status,
      img1,
      img2,
      img3,
      img4,
      Beschreibung,
      Wohnungstyp,
    ],
    function (err) {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ error: "Database error" });
      } else {
        res
          .status(200)
          .json({ message: "Apartment added successfully", id: this.lastID });
      }
    }
  );
});

// API endpoint to get apartments
app.get("/api/apartments", (req, res) => {
  const query = "SELECT * FROM Wohnungen";

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.status(200).json(rows);
    }
  });
});

// API endpoint to get apartment details by ID
app.get('/api/apartments/:id', (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM Wohnungen WHERE \"Wohnungs-ID\" = ?";

    db.get(query, [id], (err, row) => {
        if (err) {
            console.error("Error fetching apartment details:", err);
            res.status(500).json({ error: "Database error" });
        } else if (!row) {
            res.status(404).json({ error: "Apartment not found" });
        } else {
            res.status(200).json(row);
        }
    });
});
// Add a new booking
app.post('/api/bookings', (req, res) => {
  const { apartmentId, startDate, endDate, adult, children, room } = req.body;

  // التحقق من جميع الحقول المطلوبة
  if (!apartmentId || !startDate || !endDate || !adult || !children || !room) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // التحقق من تنسيق التواريخ
  if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // إدراج الحجز في قاعدة البيانات
  const query = `
    INSERT INTO bookings (apartmentId, startDate, endDate, adult, children, room)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [apartmentId, startDate, endDate, adult, children, room], function(err) {
    if (err) {
      console.error('Error inserting booking:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Booking added successfully', id: this.lastID });
  });
});


// Get all bookings
app.get("/api/bookings", (req, res) => {
  const query = "SELECT * FROM bookings";

  db.all(query, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});
// Get reviews for an apartment
app.get('/apartment/:id/reviews', (req, res) => {
  const { id } = req.params;
  db.all('SELECT * FROM bewertung WHERE wohnungsId = ?', [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve reviews' });
    }
    res.json(rows);
  });
});

// Post a new review
app.post('/apartment/:id/reviews', (req, res) => {
  const { id } = req.params;
  const { benutzerId, bewertung, kommentar } = req.body;

  // Basic validation
  if (!benutzerId || !bewertung || !kommentar) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run('INSERT INTO bewertung (benutzerId, wohnungsId, bewertung, kommentar) VALUES (?, ?, ?, ?)', [benutzerId, id, bewertung, kommentar], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to post review' });
    }
    res.json({ bewertungId: this.lastID, benutzerId, wohnungsId: id, bewertung, kommentar });
  });
});

// بدء تشغيل الخادم
app.listen(Port, () => {
  console.log(`Server running at http://localhost:${Port}/`);
});
