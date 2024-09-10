const sql = require('mssql');

// Konfigurasi koneksi
const config = {
  user: 'appkoneksi',
  password: 'app@1psg',
  server: '192.168.2.3', // Bisa berupa alamat IP atau nama host
  database: 'PSGRekrutmen', // Nama database salah satu dari yang digunakan
  options: {
    encrypt: false, // Gunakan true jika menggunakan enkripsi TLS/SSL
    trustServerCertificate: false // Atur sesuai kebutuhan sertifikat
  }
};

async function queryDatabase() {
  try {
    // Buat koneksi ke SQL Server
    let pool = await sql.connect(config);

    // Query JOIN antara dua database
    let result = await pool.request()
      .query(`
       SELECT
        A.NamaUser,
        A.NamaDept,
        A.DeptAbbr,
        A.PersonalId,
        B.telegramid 
      FROM
        vwUtlUserLogin A
        LEFT JOIN PSGKlinik.dbo.vw_sambupedia_all_pekerja_aktif B ON A.PersonalId = B.personalid 
      WHERE
        b.telegramid IS NOT NULL 
        AND A.DeptAbbr IN ('HRD','MPD','PCW','RMD', 'SEC', 'ITD')
        
        
        GROUP BY A.PersonalId,
        A.NamaUser,
        A.NamaDept,
        A.DeptAbbr,
        A.PersonalId,
        B.telegramid  `);

    // Tampilkan hasil query
    console.log(result.recordset);
  } catch (err) {
    console.error('Error saat menjalankan query:', err);
  } finally {
    // Tutup koneksi
    sql.close();
  }
}

// Jalankan fungsi query
queryDatabase();
