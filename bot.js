
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const { getUserTele, getTenaker } = require('./query');
const listDept = ['HRD', 'MPD', 'PCW', 'RMD', 'SEC', 'ITD'];
const token = '7522674615:AAGroHvoAkxEKFmLqJ4xZx_PevaBWcKk-PI';
const bot = new TelegramBot(token, { polling: true });
const imageUrl = path.resolve(__dirname, 'header-ro.png'); // Path absolut ke gambar

// Caption deskripsi yang akan ditampilkan bersama gambar
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
        // Setelah gambar berhasil dikirim, panggil fungsi notifikasi
        sendNotificationScreeningTim();
    } catch (error) {
        console.error('Error saat mengirim gambar:', error);
    }
}

// Fungsi untuk mengirim notifikasi
function sendNotification(chatId, message) {
    bot.sendMessage(chatId, message)
        .then(() => console.log('Notifikasi terkirim ke '))
        .catch(error => console.error('Error saat mengirim notifikasi: User belum terdaftar di Bot'));
}

// Fungsi untuk mengambil data dari database dan mengirim notifikasi
async function sendNotificationScreeningTim() {
    // const users = await getUserTele();
    const users = await getListUserTeleForSendTele();
    let message

    users.forEach(user => {

        message = `👋 Hai ${user.namaUser}!\n\n🛡️ Jangan lupa untuk melakukan screening ya! Berikut nama-nama yang perlu kamu cek hari ini:\n\n`;

        user.data.forEach(val => {
            message += `👤 ${val.nama} - ID: ${val.headerid}\n`;
        });

        message += `\n🚀 Semangat terus dan jangan lupa untuk menjaga kesehatan! Jika ada pertanyaan, jangan ragu untuk menghubungi kami. 💬\n\n🔔 Terima kasih atas kerjasamanya! 🙏`;

        sendNotification(user.telegramId, message, { parse_mode: "MarkdownV2" });
    });

}


async function getListUserTeleForSendTele() {

    const tenaker = await Promise.all(
        listDept.map(async (data) => {
            const tenakerData = await getTenaker(data); // Memanggil getTenaker berdasarkan DeptAbbr
            return {
                DeptAbbr: data,
                data: tenakerData // Langsung menggunakan tenakerData yang sudah sesuai format
            };
        })
    );

    const userTele = await getUserTele()

    userTele.forEach(teleUser => {
        // Cari dataB yang DeptAbbr-nya sesuai dengan itemA
        const matchingData = tenaker.find(itemTenaker => itemTenaker.DeptAbbr === teleUser.DeptAbbr);

        if (matchingData) {
            teleUser.data = matchingData.data; // Atau sesuai dengan data yang ingin dimasukkan
        }
    });

    return userTele

}

// Fungsi untuk menangani perintah /start
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    await sendPhotoWithCaption(chatId);
});

setInterval(() => {
    sendNotificationScreeningTim()
}, 3000)


sendNotificationScreeningTim()
