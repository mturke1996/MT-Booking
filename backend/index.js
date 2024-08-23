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

// مثال على معالج خطأ في Express.js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});

// Middleware للتحقق من صحة التوكن
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // لا يوجد توكن

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403); // التوكن غير صالح
    req.user = user; // تخزين بيانات المستخدم
    next();
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

  const hashedPassword = bcrypt.hashSync(password, 10); // استخدام جولات تشفير أكثر أمانًا
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
        res.json({ message: "You are successfully logged in", token });
      } else {
        res.status(400).send("Invalid username or password");
      }
    }
  });
});


// استرجاع بيانات المستخدم بناءً على التوكن
app.get("/user", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.get(
    "SELECT id, username, email, name, lastname FROM users WHERE id = ?",
    [userId],
    (err, user) => {
      if (err) {
        console.error("Error fetching user data:", err.message);
        return res.status(500).send("Internal server error");
      }
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.json(user);
    }
  );
});

// استرجاع بيانات المستخدم بناءً على الـ user_id
app.get('/user/:user_id', (req, res) => {
  const userId = parseInt(req.params.user_id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  db.get(
    'SELECT id, username, email, name, lastname FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        console.error("Error fetching user data:", err.message);
        return res.status(500).send("Internal server error");
      }
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.json(user);
    }
  );
});
// إضافة تفاصيل المستخدم الجديدة بناءً على الـ user_id
app.post('/user/details', (req, res) => {
  const { user_id, phone, birthdate, profession, address, profile_picture, bio } = req.body;

  // التحقق من وجود userId
  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // بناء الاستعلام لإدراج التفاصيل
  const query = `
    INSERT INTO user_details (user_id, phone, birthdate, profession, address, profile_picture, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // تنفيذ الاستعلام
  db.run(query, [user_id, phone, birthdate, profession, address, profile_picture, bio], function (err) {
    if (err) {
      console.error("Error adding user details:", err.message); // تسجيل الخطأ
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(201).json({ message: 'User details added successfully', id: this.lastID });
  });
});


// استرجاع تفاصيل المستخدم بناءً على الـ user_id
app.get('/user/details/:user_id', (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  db.get('SELECT * FROM user_details WHERE user_id = ?', [userId], (err, row) => {
    if (err) {
      console.error("Error fetching user details:", err);
      res.status(500).json({ message: 'Internal server error' });
    } else if (!row) {
      res.status(404).json({ message: 'User details not found' });
    } else {
      res.json(row);
    }
  });
});


// تحديث تفاصيل المستخدم// تحديث تفاصيل المستخدم بناءً على الـ user_id في الـ URL
app.put('/user/details/:user_id', (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  const { phone, birthdate, profession, address, profile_picture, bio } = req.body;

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid User ID' });
  }

  // إعداد الاستعلام الأساسي
  let query = 'UPDATE user_details SET ';
  const updates = [];
  const params = [];

  // تحقق من الحقول المقدمة وأضفها إلى الاستعلام
  if (phone) {
    updates.push('phone = ?');
    params.push(phone);
  }
  if (birthdate) {
    updates.push('birthdate = ?');
    params.push(birthdate);
  }
  if (profession) {
    updates.push('profession = ?');
    params.push(profession);
  }
  if (address) {
    updates.push('address = ?');
    params.push(address);
  }
  if (profile_picture) {
    updates.push('profile_picture = ?');
    params.push(profile_picture);
  }
  if (bio) {
    updates.push('bio = ?');
    params.push(bio);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  // أضف شرط التحديث للمستخدم
  query += updates.join(', ') + ' WHERE user_id = ?';
  params.push(userId);

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error updating user details:", err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json({ message: 'User details updated successfully' });
  });
});




app.delete("/user/details/:id", (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM user_details WHERE id = ?';

  db.run(query, [id], function(err) {
    if (err) {
      console.error("Error deleting booking:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  });
});

// إضافة شقة جديدة
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

// الحصول على جميع الشقق
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

// الحصول على تفاصيل شقة حسب ID
app.get("/api/apartments/:id", (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM Wohnungen WHERE "Wohnungs-ID" = ?';

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

app.post("/api/bookings", (req, res) => {
  const { apartmentId, startDate, endDate, adult, children, room, username } = req.body;

  // تسجيل البيانات المستلمة للتأكد من صحتها
  console.log('Received booking data:', req.body);

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

  db.run(
    query,
    [apartmentId, startDate, endDate, adult, children, room, username],
    function (err) {
      if (err) {
        console.error("Error inserting booking:", err.message);
        return res.status(500).json({ error: "Database error" });
      }
      res
        .status(200)
        .json({ message: "Booking added successfully", id: this.lastID });
    }
  );
});



// الحصول على جميع الحجوزات
app.get("/api/bookings", (req, res) => {
  const query = "SELECT * FROM bookings";

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching bookings:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.status(200).json(rows);
    }
  });
});
// حذف حجز
app.delete("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM bookings WHERE id = ?';

  db.run(query, [id], function(err) {
    if (err) {
      console.error("Error deleting booking:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  });
});


// الحصول على مراجعات الشقة
app.get('/api/apartments/:id/reviews', (req, res) => {
  const apartmentId = req.params.id;
  db.all('SELECT * FROM Reviews WHERE apartmentId = ?', [apartmentId], (err, rows) => {
    if (err) {
      console.error("Error fetching reviews:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
});

// إضافة تقييم لشقة
app.post('/api/apartments/:id/reviews', authenticateToken, (req, res) => {
  const { kommentar, bewertung } = req.body;
  const apartmentId = req.params.id;
  const benutzerId = req.user.username; // استخدام اسم المستخدم من التوكن

  if (!kommentar || !bewertung) {
    return res.status(400).json({ error: "Kommentar and bewertung are required" });
  }

  db.run(
    'INSERT INTO Reviews (apartmentId, benutzerId, bewertung, kommentar) VALUES (?, ?, ?, ?)',
    [apartmentId, benutzerId, bewertung, kommentar],
    function(err) {
      if (err) {
        console.error("Error adding review:", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ bewertungId: this.lastID, apartmentId, benutzerId, bewertung, kommentar });
    }
  );
});

// بدء تشغيل الخادم
app.listen(Port, () => {
  console.log(`Server running at http://localhost:${Port}/`);
});
