const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path =  require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const Port = 5000;

const dbPath = path.resolve(__dirname, "mtbookig-bank.db");
// console.log(__dirname)
// Simple JWT secret key
const secretKey = "my_simple_secret";

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

// Connect to SQLite database
const db = new sqlite3.Database(dbPath,sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Register a new user
app.post("/register", (req, res) => {
  const { username, password, email, name, lastname } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  const hashedPassword = bcrypt.hashSync(password, 10); // Use more secure hash rounds
  const query = `INSERT INTO users (username, password, email, name, lastname) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [username, hashedPassword, email, name, lastname], function(err) {
    if (err) {
      console.error("Error inserting user:", err.message);
      res.status(500).send("Internal server error");
    } else {
      res.json({ id: this.lastID, username });
    }
  });
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  const query = `SELECT * FROM users WHERE username = ?`;

  db.get(query, [username], (err, user) => {
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

  db.get(query, [userId], (err, user) => {
    if (err) {
      console.error("Error fetching user data:", err.message);
      res.status(500).send("Internal server error");
    } else if (!user) {
      res.status(404).send("User not found");
    } else {
      res.json(user);
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

  db.get(query, [userId], (err, user) => {
    if (err) {
      console.error("Error fetching user data:", err.message);
      res.status(500).send("Internal server error");
    } else if (!user) {
      res.status(404).send("User not found");
    } else {
      res.json(user);
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

  db.run(query, [
    user_id,
    phone,
    birthdate,
    profession,
    address,
    profile_picture,
    bio
  ], function(err) {
    if (err) {
      console.error("Error adding user details:", err.message);
      res.status(500).json({ message: "Internal server error" });
    } else {
      res.status(201).json({
        message: "User details added successfully",
        id: this.lastID,
      });
    }
  });
});

// Get user details based on user_id
app.get("/user/details/:user_id", (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  const query = `SELECT * FROM user_details WHERE user_id = ?`;

  db.get(query, [userId], (err, row) => {
    if (err) {
      console.error("Error fetching user details:", err.message);
      res.status(500).json({ message: "Internal server error" });
    } else if (!row) {
      res.status(404).json({ message: "User details not found" });
    } else {
      res.json(row);
    }
  });
});

// Update user details based on user_id in URL
app.put("/user/details/:user_id", (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  const { phone, birthdate, profession, address, profile_picture, bio } = req.body;

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

  db.run(query, params, (err) => {
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

  db.run(query, [id], function(err) {
    if (err) {
      console.error("Error deleting user details:", err.message);
      res.status(500).json({ error: "Database error" });
    } else if (this.changes === 0) {
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

  db.run(query, [
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
    Wohnungstyp
  ], function(err) {
    if (err) {
      console.error("Error inserting data:", err.message);
      res.status(500).json({ error: "Database error" });
    } else {
      res.status(200).json({
        message: "Apartment added successfully",
        id: this.lastID,
      });
    }
  });
});

// Get all apartments
app.get("/api/apartments", (req, res) => {
  const query = `SELECT * FROM Wohnungen`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching data:", err.message);
      res.status(500).json({ error: "Database error" });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Get apartment details by ID
app.get("/api/apartments/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM Wohnungen WHERE "Wohnungs-ID" = ?`;

  db.get(query, [id], (err, row) => {
    if (err) {
      console.error("Error fetching apartment details:", err.message);
      res.status(500).json({ error: "Database error" });
    } else if (!row) {
      res.status(404).json({ error: "Apartment not found" });
    } else {
      res.status(200).json(row);
    }
  });
});

// Add a booking
app.post("/api/bookings", (req, res) => {
  const { apartmentId, startDate, endDate, adult, children, room, username } = req.body;

  if (!apartmentId || !startDate || !endDate || !adult || !children || !room || !username) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  const query = `
    INSERT INTO bookings (apartmentId, startDate, endDate, adult, children, room, username)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [
    apartmentId,
    startDate,
    endDate,
    adult,
    children,
    room,
    username
  ], function(err) {
    if (err) {
      console.error("Error inserting booking:", err.message);
      res.status(500).json({ error: "Database error" });
    } else {
      res.status(200).json({
        message: "Booking added successfully",
        id: this.lastID,
      });
    }
  });
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

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error fetching bookings:", err.message);
      res.status(500).json({ error: "Database error" });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Delete booking
app.delete("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM bookings WHERE id = ?`;

  db.run(query, [id], function(err) {
    if (err) {
      console.error("Error deleting booking:", err.message);
      res.status(500).json({ error: "Database error" });
    } else if (this.changes === 0) {
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

  db.all(query, [apartmentId], (err, rows) => {
    if (err) {
      console.error("Error fetching reviews:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(rows);
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

  db.run(query, [
    apartmentId,
    benutzerId,
    bewertung,
    kommentar
  ], function(err) {
    if (err) {
      console.error("Error adding review:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({
        bewertungId: this.lastID,
        apartmentId,
        benutzerId,
        bewertung,
        kommentar,
      });
    }
  });
});

// Start server
app.listen(Port, () => {
  console.log(`Server running at http://localhost:${Port}/`);
});

