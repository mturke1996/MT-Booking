const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const Port = 5000;

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
const dbPath = process.env.DATABASE_PATH || "./mtbookig-bank.db";
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
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
  const stmt = db.prepare(
    "INSERT INTO users (username, password, email, name, lastname) VALUES (?, ?, ?, ?, ?)"
  );

  try {
    const result = stmt.run(username, hashedPassword, email, name, lastname);
    res.json({ id: result.lastInsertRowid, username });
  } catch (err) {
    console.error("Error inserting user:", err.message);
    res.status(500).send("Internal server error");
  }
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  const stmt = db.prepare("SELECT * FROM users WHERE username = ?");

  try {
    const user = stmt.get(username);
    if (!user) {
      return res.status(400).send("Invalid username or password");
    }

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
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).send("Internal server error");
  }
});

// Get user data based on token
app.get("/user", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const stmt = db.prepare(
    "SELECT id, username, email, name, lastname FROM users WHERE id = ?"
  );

  try {
    const user = stmt.get(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user data:", err.message);
    res.status(500).send("Internal server error");
  }
});

// Get user data based on user_id
app.get("/user/:user_id", (req, res) => {
  const userId = parseInt(req.params.user_id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const stmt = db.prepare(
    "SELECT id, username, email, name, lastname FROM users WHERE id = ?"
  );

  try {
    const user = stmt.get(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user data:", err.message);
    res.status(500).send("Internal server error");
  }
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

  const stmt = db.prepare(`
    INSERT INTO user_details (user_id, phone, birthdate, profession, address, profile_picture, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = stmt.run(
      user_id,
      phone,
      birthdate,
      profession,
      address,
      profile_picture,
      bio
    );
    res.status(201).json({
      message: "User details added successfully",
      id: result.lastInsertRowid,
    });
  } catch (err) {
    console.error("Error adding user details:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user details based on user_id
app.get("/user/details/:user_id", (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  const stmt = db.prepare("SELECT * FROM user_details WHERE user_id = ?");

  try {
    const row = stmt.get(userId);
    if (!row) {
      return res.status(404).json({ message: "User details not found" });
    }
    res.json(row);
  } catch (err) {
    console.error("Error fetching user details:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
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

  const stmt = db.prepare(query);

  try {
    stmt.run(params);
    res.json({ message: "User details updated successfully" });
  } catch (err) {
    console.error("Error updating user details:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/user/details/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM user_details WHERE id = ?");

  try {
    const result = stmt.run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: "User details not found" });
    }
    res.status(200).json({ message: "User details deleted successfully" });
  } catch (err) {
    console.error("Error deleting user details:", err.message);
    res.status(500).json({ error: "Database error" });
  }
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

  const stmt = db.prepare(`
    INSERT INTO Wohnungen (Adresse, Zimmeranzahl, "Fläche (m²)", "Monatliche Miete", Status, img1, img2, img3, img4, Beschreibung, Wohnungstyp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = stmt.run(
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
    );
    res.status(200).json({
      message: "Apartment added successfully",
      id: result.lastInsertRowid,
    });
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all apartments
app.get("/api/apartments", (req, res) => {
  const stmt = db.prepare("SELECT * FROM Wohnungen");

  try {
    const rows = stmt.all();
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get apartment details by ID
app.get("/api/apartments/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('SELECT * FROM Wohnungen WHERE "Wohnungs-ID" = ?');

  try {
    const row = stmt.get(id);
    if (!row) {
      return res.status(404).json({ error: "Apartment not found" });
    }
    res.status(200).json(row);
  } catch (err) {
    console.error("Error fetching apartment details:", err);
    res.status(500).json({ error: "Database error" });
  }
});

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

  const stmt = db.prepare(`
    INSERT INTO bookings (apartmentId, startDate, endDate, adult, children, room, username)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = stmt.run(
      apartmentId,
      startDate,
      endDate,
      adult,
      children,
      room,
      username
    );
    res.status(200).json({
      message: "Booking added successfully",
      id: result.lastInsertRowid,
    });
  } catch (err) {
    console.error("Error inserting booking:", err.message);
    res.status(500).json({ error: "Database error" });
  }
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

  const stmt = db.prepare(query);

  try {
    const rows = stmt.all(params);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete booking
app.delete("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM bookings WHERE id = ?");

  try {
    const result = stmt.run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Error deleting booking:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Get reviews for an apartment
app.get("/api/apartments/:id/reviews", (req, res) => {
  const apartmentId = req.params.id;
  const stmt = db.prepare("SELECT * FROM Reviews WHERE apartmentId = ?");

  try {
    const rows = stmt.all(apartmentId);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching reviews:", err.message);
    res.status(500).json({ error: err.message });
  }
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

  const stmt = db.prepare(
    "INSERT INTO Reviews (apartmentId, benutzerId, bewertung, kommentar) VALUES (?, ?, ?, ?)"
  );

  try {
    const result = stmt.run(apartmentId, benutzerId, bewertung, kommentar);
    res.status(201).json({
      bewertungId: result.lastInsertRowid,
      apartmentId,
      benutzerId,
      bewertung,
      kommentar,
    });
  } catch (err) {
    console.error("Error adding review:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(Port, () => {
  console.log(`Server running at http://localhost:${Port}/`);
});
