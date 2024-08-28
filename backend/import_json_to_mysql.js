const fs = require('fs');
const axios = require('axios');
const mysql = require('mysql2');

// قراءة بيانات JSON من الملف
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// إعداد اتصال بقاعدة بيانات MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mturke@1996",
    database: "mtbookingbank",
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL.');
});

// إرسال البيانات إلى API
data.forEach(async (item) => {
  try {
    await axios.post('http://localhost:5000/api/apartments', item); // استبدل URL و endpoint وفقًا لواجهة برمجة التطبيقات الخاصة بك
    console.log('Data sent to MySQL:', item);
  } catch (error) {
    console.error('Error sending data:', error.message);
  }
});

db.end();
