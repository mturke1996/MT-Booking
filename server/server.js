require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const port = process.env.PORT || 4000;
const dbURI = process.env.MONGODB_URI;
const secretKey = process.env.SECRET_KEY;

app.use(cors());
app.use(express.json());

// Example error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
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

// Connect to MongoDB
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => console.error("Database connection error:", err));

// Define Mongoose Schemas and Models
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  name: String,
  lastname: String,
});

const userDetailsSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  phone: String,
  birthdate: Date,
  profession: String,
  address: String,
  profile_picture: String,
  bio: String,
});

const apartmentSchema = new mongoose.Schema({
  Adresse: String,
  Zimmeranzahl: Number,
  Flaeche: Number,
  Miete: Number,
  Status: String,
  img1: String,
  img2: String,
  img3: String,
  img4: String,
  Beschreibung: String,
  Wohnungstyp: String,
});

const bookingSchema = new mongoose.Schema({
  apartmentId: mongoose.Schema.Types.ObjectId,
  startDate: Date,
  endDate: Date,
  adult: Number,
  children: Number,
  room: String,
  username: String,
});

const reviewSchema = new mongoose.Schema({
  apartmentId: mongoose.Schema.Types.ObjectId,
  benutzerId: mongoose.Schema.Types.ObjectId,
  bewertung: Number,
  kommentar: String,
});

const User = mongoose.model("User", userSchema);
const UserDetails = mongoose.model("UserDetails", userDetailsSchema);
const Apartment = mongoose.model("Apartment", apartmentSchema);
const Booking = mongoose.model("Booking", bookingSchema);
const Review = mongoose.model("Review", reviewSchema);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Register a new user
app.post("/register", (req, res) => {
  const { username, password, email, name, lastname } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword,
    email,
    name,
    lastname,
  });

  newUser
    .save()
    .then((user) => res.json({ id: user._id, username: user.username }))
    .catch((err) => {
      console.error("Error inserting user:", err.message);
      res.status(500).send("Internal server error");
    });
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(400).send("Invalid username or password");
      }

      const isValid = bcrypt.compareSync(password, user.password);
      if (isValid) {
        const token = jwt.sign(
          { id: user._id, username: user.username },
          secretKey,
          { expiresIn: "1h" }
        );
        res.json({ message: "You are successfully logged in", token });
      } else {
        res.status(400).send("Invalid username or password");
      }
    })
    .catch((err) => {
      console.error("Database error:", err.message);
      res.status(500).send("Internal server error");
    });
});

// Get user data based on token
app.get("/user", authenticateToken, (req, res) => {
  const userId = req.user.id;

  User.findById(userId, "id username email name lastname")
    .then((user) => {
      if (!user) {
        res.status(404).send("User not found");
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      console.error("Error fetching user data:", err.message);
      res.status(500).send("Internal server error");
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

  const newUserDetails = new UserDetails({
    user_id,
    phone,
    birthdate,
    profession,
    address,
    profile_picture,
    bio,
  });

  newUserDetails
    .save()
    .then((details) =>
      res
        .status(201)
        .json({ message: "User details added successfully", id: details._id })
    )
    .catch((err) => {
      console.error("Error adding user details:", err.message);
      res.status(500).json({ message: "Internal server error" });
    });
});

// Get user details based on user_id
app.get("/user/details/:user_id", (req, res) => {
  const userId = req.params.user_id;

  UserDetails.findOne({ user_id: userId })
    .then((details) => {
      if (!details) {
        res.status(404).json({ message: "User details not found" });
      } else {
        res.json(details);
      }
    })
    .catch((err) => {
      console.error("Error fetching user details:", err.message);
      res.status(500).json({ message: "Internal server error" });
    });
});

// Update user details based on user_id in URL
app.put("/user/details/:user_id", (req, res) => {
  const userId = req.params.user_id;
  const updates = req.body;

  UserDetails.findOneAndUpdate({ user_id: userId }, updates, { new: true })
    .then((details) =>
      res.json({ message: "User details updated successfully", details })
    )
    .catch((err) => {
      console.error("Error updating user details:", err.message);
      res.status(500).json({ message: "Internal server error" });
    });
});

// Delete user details
app.delete("/user/details/:id", (req, res) => {
  const id = req.params.id;

  UserDetails.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        res.status(404).json({ error: "User details not found" });
      } else {
        res.status(200).json({ message: "User details deleted successfully" });
      }
    })
    .catch((err) => {
      console.error("Error deleting user details:", err.message);
      res.status(500).json({ error: "Database error" });
    });
});

// Add a new apartment
app.post("/api/apartmentss", async (req, res) => {
  const apartments = req.body;

  // التحقق من أن البيانات تحتوي على عناصر
  if (!Array.isArray(apartments) || apartments.length === 0) {
    return res.status(400).json({ error: "No apartments data provided" });
  }

  try {
    // إدخال البيانات
    const result = await Apartment.insertMany(apartments);
    res
      .status(200)
      .json({ message: "Apartments added successfully", count: result.length });
  } catch (err) {
    console.error("Error inserting data:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all apartments
app.get("/api/apartments", (req, res) => {
  Apartment.find()
    .then((apartments) => res.json(apartments))
    .catch((err) => {
      console.error("Error fetching data:", err.message);
      res.status(500).json({ error: "Database error" });
    });
});

// Get apartment by ID
app.get("/api/apartments/:id", (req, res) => {
  const id = req.params.id;

  Apartment.findById(id)
    .then((apartment) => {
      if (!apartment) {
        res.status(404).json({ error: "Apartment not found" });
      } else {
        res.json(apartment);
      }
    })
    .catch((err) => {
      console.error("Error fetching data:", err.message);
      res.status(500).json({ error: "Database error" });
    });
});

// Update apartment by ID
app.put("/api/apartments/:id", (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  Apartment.findByIdAndUpdate(id, updates, { new: true })
    .then((updatedApartment) => res.json(updatedApartment))
    .catch((err) => {
      console.error("Error updating data:", err.message);
      res.status(500).json({ error: "Database error" });
    });
});

// Delete apartment by ID
app.delete("/api/apartments/:id", (req, res) => {
  const id = req.params.id;

  Apartment.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        res.status(404).json({ error: "Apartment not found" });
      } else {
        res.status(200).json({ message: "Apartment deleted successfully" });
      }
    })
    .catch((err) => {
      console.error("Error deleting data:", err.message);
      res.status(500).json({ error: "Database error" });
    });
});

// Add a new booking
app.post("/api/apartments", async (req, res) => {
  try {
    const apartments = req.body; // تأكد من أن الطلب يحتوي على مصفوفة من العناصر
    if (!Array.isArray(apartments)) {
      return res.status(400).send("Invalid data format");
    }

    const result = await Apartment.insertMany(apartments); // استخدام insertMany لإدخال مجموعة من العناصر
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all bookings
app.get("/api/bookings", (req, res) => {
  Booking.find()
    .then((bookings) => res.json(bookings))
    .catch((err) => {
      console.error("Error fetching data:", err.message);
      res.status(500).json({ error: "Database error" });
    });
});

// Get booking by ID
app.get("/api/bookings/:id", (req, res) => {
  const id = req.params.id;

  Booking.findById(id)
    .then((booking) => {
      if (!booking) {
        res.status(404).json({ error: "Booking not found" });
      } else {
        res.json(booking);
      }
    })
    .catch((err) => {
      console.error("Error fetching data:", err.message);
      res.status(500).json({ error: "Database error" });
    });
});

// Update booking by ID
app.put("/api/bookings/:id", (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  Booking.findByIdAndUpdate(id, updates, { new: true })
    .then((updatedBooking) => res.json(updatedBooking))
    .catch((err) => {
      console.error("Error updating data:", err.message);
      res.status(500).json({ error: "Database error" });
    });
});

// Delete booking by ID
app.delete("/api/bookings/:id", (req, res) => {
  const id = req.params.id;

  Booking.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        res.status(404).json({ error: "Booking not found" });
      } else {
        res.status(200).json({ message: "Booking deleted successfully" });
      }
    })
    .catch((err) => {
      console.error("Error deleting data:", err.message);
      res.status(500).json({ error: "Database error" });
    });
});

// Add a new review
app.post("/api/reviews", (req, res) => {
  const { apartmentId, benutzerId, bewertung, kommentar } = req.body;

  const newReview = new Review({
    apartmentId,
    benutzerId,
    bewertung,
    kommentar,
  });

  newReview
    .save()
    .then((review) =>
      res
        .status(200)
        .json({ message: "Review added successfully", id: review._id })
    )
    .catch((err) => {
      console.error("Error inserting data:", err.message);
      res.status(500).json({ error: "Database error" });
    });
});

// Get all reviews
app.get("/api/reviews", (req, res) => {
  Review.find()
    .then((reviews) => res.json(reviews))
    .catch((err) => {
      console.error("Error fetching data:", err.message);
      res.status(500).json({ error: "Database error" });
    });
});

// Get review by ID
app.get("/api/reviews/:id", (req, res) => {
  const id = req.params.id;

  Review.findById(id)
    .then((review) => {
      if (!review) {
        res.status(404).json({ error: "Review not found" });
      } else {
        res.json(review);
      }
    })
    .catch((err) => {
      console.error("Error fetching data:", err.message);
      res.status(500).json({ error: "Database error" });
    });
});

// Update review by ID
app.put("/api/reviews/:id", (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  Review.findByIdAndUpdate(id, updates, { new: true })
    .then((updatedReview) => res.json(updatedReview))
    .catch((err) => {
      console.error("Error updating data:", err.message);
      res.status(500).json({ error: "Database error" });
    });
});

// Delete review by ID
app.delete("/api/reviews/:id", (req, res) => {
  const id = req.params.id;

  Review.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        res.status(404).json({ error: "Review not found" });
      } else {
        res.status(200).json({ message: "Review deleted successfully" });
      }
    })
    .catch((err) => {
      console.error("Error deleting data:", err.message);
      res.status(500).json({ error: "Database error" });
    });
});
