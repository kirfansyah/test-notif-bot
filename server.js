// server.js
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const { sendNotificationScreeningTim, sendNotificationScreeningHrd } = require('./notification');
const { telegramToken } = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

// Inisialisasi bot Telegram
const bot = new TelegramBot(telegramToken, { polling: true });
const imageUrl = path.resolve(__dirname, 'header-ro.png');
const caption = `🚀 Selamat Datang di Bot Notifikasi Rekrutmen Online Kami! 🚀

Hai, Tim Rekrutmen dan HRD! Bot ini hadir untuk memudahkan proses rekrutmen Anda dengan notifikasi otomatis.

Fitur:
- 📢 Notifikasi Real-Time
- 👥 Kolaborasi Lebih Mudah
- 📅 Reminder Tepat Waktu

Terima kasih telah menggunakan bot ini!`;

// Fungsi untuk mengirim gambar dengan caption
async function sendPhotoWithCaption(chatId) {
    try {
        await bot.sendPhoto(chatId, imageUrl, { caption });
        console.log('Gambar dan caption berhasil dikirim');
        // await sendNotificationScreeningTim(bot);
        // await sendNotificationScreeningHrd(bot);
    } catch (error) {
        console.error('Error saat mengirim gambar:', error);
    }
}

// Bot menangani perintah /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    await sendPhotoWithCaption(chatId);
    await sendNotificationScreeningTim(bot);
    await sendNotificationScreeningHrd(bot);
});

// Rute utama server
app.get('/', (req, res) => {
    sendNotificationScreeningTim(bot);
    res.send('Server dan Bot Telegram Berjalan!');
});

// Mulai server
app.listen(PORT, () => {
    // console.log(`Server berjalan pada port ${PORT}`);
    console.log(`Server berjalan pada http://localhost:${PORT}`);

});

setInterval(() => console.log(`Server berjalan pada http://localhost:${PORT}`), 3000)