const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// فتح اتصال بقاعدة بيانات SQLite
const db = new sqlite3.Database('./mtbookig-bank.db'); // استبدل بمسار قاعدة بيانات SQLite الخاصة بك

// استعلام لجلب البيانات
const query = 'SELECT * FROM Wohnungen'; 

db.all(query, [], (err, rows) => {
  if (err) {
    throw err;
  }

  // تحويل البيانات إلى JSON وحفظها في ملف
  fs.writeFileSync('data.json', JSON.stringify(rows, null, 2));
  console.log('Data exported to data.json');
});

db.close();
