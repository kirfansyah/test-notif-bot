// server.js
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const { timQueue, hrdQueue } = require('./queue');
const { telegramToken } = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

// Inisialisasi bot Telegram
const bot = new TelegramBot(telegramToken, { polling: true });

// Fungsi untuk menambahkan job ke antrian
function enqueueScreeningTim() {
    timQueue.add({ task: 'sendNotificationScreeningTim' }); // Menambahkan job dengan tipe tugas
}

function enqueueScreeningHrd() {
    hrdQueue.add({ task: 'sendNotificationScreeningHrd' }); // Menambahkan job dengan tipe tugas
}

// Bot menangani perintah /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    console.log('start');
    enqueueScreeningTim(); // Masukkan ke antrian saat /start diterima
});

// Rute utama server
app.get('/', (req, res) => {
    enqueueScreeningTim(); // Masukkan ke antrian saat ada request ke '/'
    res.send('Server dan Bot Telegram Berjalan!');
});

// Menjalankan job notifikasi HRD setiap 3 detik
setInterval(enqueueScreeningHrd, 3000);

// Mulai server
app.listen(PORT, () => {
    console.log(`Server berjalan pada http://localhost:${PORT}`);
});
