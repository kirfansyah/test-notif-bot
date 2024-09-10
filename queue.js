// queue.js
const Queue = require('bull');
const { sendNotificationScreeningTim, sendNotificationScreeningHrd } = require('./notification');
const { telegramToken } = require('./config');


// Membuat queue untuk notifikasi screening TIM
const timQueue = new Queue('timQueue', {
    redis: { port: 6379, host: '127.0.0.1' } // Ganti sesuai konfigurasi Redis Anda
});

// Membuat queue untuk notifikasi screening HRD
const hrdQueue = new Queue('hrdQueue', {
    redis: { port: 6379, host: '127.0.0.1' } // Ganti sesuai konfigurasi Redis Anda
});

// Memproses notifikasi screening TIM
timQueue.process(async (job) => {
    console.log('Memproses job untuk TIM:', job.data);
    if (job.data.task === 'sendNotificationScreeningTim') {
        // Buat instance bot di sini
        const bot = new (require('node-telegram-bot-api'))(telegramToken, { polling: true });
        await sendNotificationScreeningTim(bot);
    }
});

// Memproses notifikasi screening HRD
hrdQueue.process(async (job) => {
    console.log('Memproses job untuk HRD:', job.data);
    if (job.data.task === 'sendNotificationScreeningHrd') {
        // Buat instance bot di sini
        const bot = new (require('node-telegram-bot-api'))(telegramToken, { polling: true });
        await sendNotificationScreeningHrd(bot);
    }
});

module.exports = { timQueue, hrdQueue };
