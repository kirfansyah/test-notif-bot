// config.js
module.exports = {
    // Konfigurasi koneksi SQL Server (pastikan konfigurasi ini sudah diisi dengan benar di file utama Anda)
    config: {
        user: 'appkoneksi',
        password: 'app@1psg',
        server: '192.168.2.3', // Bisa berupa alamat IP atau nama host
        database: 'PSGRekrutmen', // Nama database salah satu dari yang digunakan
        options: {
            encrypt: false, // Gunakan true jika menggunakan enkripsi TLS/SSL
            trustServerCertificate: false // Atur sesuai kebutuhan sertifikat
        },
        pool: {
            max: 10, // Maksimal koneksi yang diijinkan
            min: 0,
            idleTimeoutMillis: 30000, // Batas waktu idle koneksi
        },
    },
    // telegramToken: '7522674615:AAGroHvoAkxEKFmLqJ4xZx_PevaBWcKk-PI' // Ganti dengan token bot Telegram Anda
    telegramToken: '7500521333:AAHU-3P8DOrM8vxloMTSI8m_P_4q_H5Geyo' // Ganti dengan token bot Telegram Anda
};
