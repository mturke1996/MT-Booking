const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const Port = 4000;

// Simple JWT secret key
const secretKey = "my_simple_secret";

// Create a MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mturke@1996",
  database: "mtbookingbank",
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
  } else {
    console.log("Connected to the MySQL database.");
  }
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Example error handler in Express.js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});

bcrypt.hash("myPassword", 10, function (err, hash) {
  if (err) throw err;
  console.log(hash);
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401); // No token

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user; // Store user data
    next();
  });
}
app.get("/", (req, res) => {
  res.send("Halllllllllllllllllo");
});
// Register a new user
app.post("/register", (req, res) => {
  const { username, password, email, name, lastname } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const query = `INSERT INTO users (username, password, email, name, lastname) VALUES (?, ?, ?, ?, ?)`;

  db.query(
    query,
    [username, hashedPassword, email, name, lastname],
    (err, results) => {
      if (err) {
        console.error("Error inserting user:", err.message);
        res.status(500).send("Internal server error");
      } else {
        res.json({ id: results.insertId, username });
      }
    }
  );
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  const query = `SELECT * FROM users WHERE username = ?`;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Database error:", err.message);
      res.status(500).send("Internal server error");
    } else if (results.length === 0) {
      res.status(400).send("Invalid username or password");
    } else {
      const user = results[0];
      const isValid = bcrypt.compareSync(password, user.password);
      if (isValid) {
        const token = jwt.sign(
          { id: user.id, username: user.username },
          secretKey,
          { expiresIn: "1h" }
        );
        res.json({ message: "You are successfully logged in", token });
      } else {
        res.status(400).send("Invalid username or password");
      }
    }
  });
});

// Get user data based on token
app.get("/user", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const query = `SELECT id, username, email, name, lastname FROM users WHERE id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err.message);
      res.status(500).send("Internal server error");
    } else if (results.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.json(results[0]);
    }
  });
});

// Get user data based on user_id
app.get("/user/:user_id", (req, res) => {
  const userId = parseInt(req.params.user_id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const query = `SELECT id, username, email, name, lastname FROM users WHERE id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err.message);
      res.status(500).send("Internal server error");
    } else if (results.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.json(results[0]);
    }
  });
});

// Add new user details based on user_id
app.post("/user/details", (req, res) => {
  const {
    user_id,
    phone,
    birthdate,
    profession,
    address,
    profile_picture,
    bio,
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const query = `
    INSERT INTO user_details (user_id, phone, birthdate, profession, address, profile_picture, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [user_id, phone, birthdate, profession, address, profile_picture, bio],
    (err, results) => {
      if (err) {
        console.error("Error adding user details:", err.message);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(201).json({
          message: "User details added successfully",
          id: results.insertId,
        });
      }
    }
  );
});

// Get user details based on user_id
app.get("/user/details/:user_id", (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  const query = `SELECT * FROM user_details WHERE user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user details:", err.message);
      res.status(500).json({ message: "Internal server error" });
    } else if (results.length === 0) {
      res.status(404).json({ message: "User details not found" });
    } else {
      res.json(results[0]);
    }
  });
});

// Update user details based on user_id in URL
app.put("/user/details/:user_id", (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  const { phone, birthdate, profession, address, profile_picture, bio } =
    req.body;

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  let query = "UPDATE user_details SET ";
  const updates = [];
  const params = [];

  if (phone) {
    updates.push("phone = ?");
    params.push(phone);
  }
  if (birthdate) {
    updates.push("birthdate = ?");
    params.push(birthdate);
  }
  if (profession) {
    updates.push("profession = ?");
    params.push(profession);
  }
  if (address) {
    updates.push("address = ?");
    params.push(address);
  }
  if (profile_picture) {
    updates.push("profile_picture = ?");
    params.push(profile_picture);
  }
  if (bio) {
    updates.push("bio = ?");
    params.push(bio);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  query += updates.join(", ") + " WHERE user_id = ?";
  params.push(userId);

  db.query(query, params, (err) => {
    if (err) {
      console.error("Error updating user details:", err.message);
      res.status(500).json({ message: "Internal server error" });
    } else {
      res.json({ message: "User details updated successfully" });
    }
  });
});

// Delete user details
app.delete("/user/details/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM user_details WHERE id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting user details:", err.message);
      res.status(500).json({ error: "Database error" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "User details not found" });
    } else {
      res.status(200).json({ message: "User details deleted successfully" });
    }
  });
});

// Add a new apartment
app.post("/api/apartments", (req, res) => {
  const {
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
  } = req.body;

  const query = `
    INSERT INTO wohnungen (Adresse, Zimmeranzahl, Flaeche, Miete, Status, img1, img2, img3, img4, Beschreibung, Wohnungstyp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
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
    (err, results) => {
      if (err) {
        console.error("Error inserting data:", err.message);
        res.status(500).json({ error: "Database error" });
      } else {
        res.status(200).json({
          message: "Apartment added successfully",
          id: results.insertId,
        });
      }
    }
  );
});
app.post("/api/apartmentss", (req, res) => {
  // استلام مصفوفة من الكائنات من الطلب
  const apartments = req.body;

  // تحقق من أن البيانات المستلمة هي مصفوفة
  if (!Array.isArray(apartments) || apartments.length === 0) {
    return res
      .status(400)
      .json({
        error: "Invalid input format. Expected an array of apartments.",
      });
  }

  // بناء استعلام إدخال متعدد
  const query = `
      INSERT INTO wohnungen (Adresse, Zimmeranzahl, Flaeche, Miete, Status, img1, img2, img3, img4, Beschreibung, Wohnungstyp)
      VALUES ?
    `;

  // تحويل مصفوفة البيانات إلى مصفوفة من القيم المزدوجة
  const values = apartments.map((apartment) => [
    apartment.Adresse,
    apartment.Zimmeranzahl,
    apartment.Flaeche,
    apartment.Miete,
    apartment.Status,
    apartment.img1,
    apartment.img2,
    apartment.img3,
    apartment.img4,
    apartment.Beschreibung,
    apartment.Wohnungstyp,
  ]);

  db.query(query, [values], (err, results) => {
    if (err) {
      console.error("Error inserting data:", err.message);
      res.status(500).json({ error: "Database error" });
    } else {
      res.status(200).json({
        message: "Apartments added successfully",
        affectedRows: results.affectedRows,
      });
    }
  });
});

// Get all apartments
app.get("/api/apartments", (req, res) => {
  const query = `SELECT * FROM wohnungen`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err.message);
      res.status(500).json({ error: "Database error" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Get apartment details by ID
app.get("/api/apartments/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM Wohnungen WHERE id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching apartment details:", err.message);
      res.status(500).json({ error: "Database error" });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Apartment not found" });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

// Add a booking
app.post("/api/bookings", (req, res) => {
  const { apartmentId, startDate, endDate, adult, children, room, username } =
    req.body;

  if (
    !apartmentId ||
    !startDate ||
    !endDate ||
    !adult ||
    !children ||
    !room ||
    !username
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  const query = `
    INSERT INTO bookings (apartmentId, startDate, endDate, adult, children, room, username)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [apartmentId, startDate, endDate, adult, children, room, username],
    (err, results) => {
      if (err) {
        console.error("Error inserting booking:", err.message);
        res.status(500).json({ error: "Database error" });
      } else {
        res.status(200).json({
          message: "Booking added successfully",
          id: results.insertId,
        });
      }
    }
  );
});

// Get all bookings
app.get("/api/bookings", (req, res) => {
  const { username } = req.query;

  let query = "SELECT * FROM bookings";
  let params = [];

  if (username) {
    query += " WHERE username = ?";
    params.push(username);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching bookings:", err.message);
      res.status(500).json({ error: "Database error" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Delete booking
app.delete("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM bookings WHERE id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting booking:", err.message);
      res.status(500).json({ error: "Database error" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Booking not found" });
    } else {
      res.status(200).json({ message: "Booking deleted successfully" });
    }
  });
});

// Get reviews for an apartment
app.get("/api/apartments/:id/reviews", (req, res) => {
  const apartmentId = req.params.id;
  const query = `SELECT * FROM Reviews WHERE apartmentId = ?`;

  db.query(query, [apartmentId], (err, results) => {
    if (err) {
      console.error("Error fetching reviews:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

// Add a review for an apartment
app.post("/api/apartments/:id/reviews", (req, res) => {
  const { kommentar, bewertung, benutzerId } = req.body;
  const apartmentId = req.params.id;

  if (!kommentar || !bewertung || !benutzerId) {
    return res
      .status(400)
      .json({ error: "kommentar, bewertung, and benutzerId are required" });
  }

  const query = `INSERT INTO Reviews (apartmentId, benutzerId, bewertung, kommentar) VALUES (?, ?, ?, ?)`;

  db.query(
    query,
    [apartmentId, benutzerId, bewertung, kommentar],
    (err, results) => {
      if (err) {
        console.error("Error adding review:", err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({
          bewertungId: results.insertId,
          apartmentId,
          benutzerId,
          bewertung,
          kommentar,
        });
      }
    }
  );
});

// Start server
app.listen(Port, () => {
  console.log(`Server running at http://localhost:${Port}/`);
});
