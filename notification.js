// notification.js
const { getUserTele, getTenakerScreeningByTim, getUserTeleHrd, getTenakerScreeningByHrd } = require('./query');
const listDept = ['HRD', 'MPD', 'PCW', 'RMD', 'SEC', 'ITD'];


// notification.js
async function sendNotificationScreeningTim(bot) {
    try {
        const users = await getListUserTeleForSendTele();
        console.log('lg :', users.length);
        users.forEach(user => {
            console.log(`Mengirim notifikasi ke Telegram ID: ${user.telegramId}, Nama User: ${user.namaUser}`);
            let message = `👋 Hai ${user.namaUser}!\n\n🛡️ Jangan lupa untuk melakukan screening ya! Berikut nama-nama yang perlu kamu cek hari ini:\n\n`;

            user.data.forEach(val => {
                message += `👤 ${val.nama} - ID: ${val.headerid}\n`;
            });

            message += `\n🚀 Semangat terus dan jangan lupa untuk menjaga kesehatan! Jika ada pertanyaan, jangan ragu untuk menghubungi kami. 💬\n\n🔔 Terima kasih atas kerjasamanya! 🙏`;

            // Kirim pesan tanpa opsi parse_mode
            bot.sendMessage(user.telegramId, message)
                .then(() => console.log(`🚀 Notifikasi terkirim ke ${user.namaUser}`))
                .catch(error => {
                    console.error('Error saat mengirim notifikasi:', error.response ? 'User belum terdaftar di bot' : error.message);
                });
        });
    } catch (error) {
        console.error('Error saat menjalankan sendNotificationScreeningTim:', 'error boss');
    }
}


async function getListUserTeleForSendTele() {
    const tenaker = await Promise.all(
        listDept.map(async (dept) => {
            const tenakerData = await getTenakerScreeningByTim(dept);
            return {
                DeptAbbr: dept,
                data: tenakerData
            };
        })
    );
    // Check if any of the tenaker data arrays are empty
    const hasData = tenaker.some((item) => item.data.length > 0);
    if (!hasData) {
        console.log('Notifikasi tidak tersedia');
        return;
    }

    const userTele = await getUserTele();

    userTele.forEach(teleUser => {
        const matchingData = tenaker.find(item => item.DeptAbbr === teleUser.DeptAbbr);
        if (matchingData) {
            teleUser.data = matchingData.data;
        }
    });

    return userTele;
}

// notification to HRD
async function sendNotificationScreeningHrd(bot) {
    try {
        const usersHrd = await getListUserHrdTeleForSendTele();
        usersHrd.forEach(user => {
            console.log(`Mengirim notifikasi ke Telegram ID: ${user.telegramId}, Nama User: ${user.namaUser}`);
            let message = `👋 Hai ${user.namaUser}!\n\n🛡️ Jangan lupa untuk melakukan screening ya! Berikut nama-nama yang perlu kamu cek hari ini:\n\n`;

            user.data.forEach(val => {
                message += `👤 ${val.nama} - ID: ${val.headerid}\n`;
            });

            message += `\n🚀 Semangat terus dan jangan lupa untuk menjaga kesehatan! Jika ada pertanyaan, jangan ragu untuk menghubungi kami. 💬\n\n🔔 Terima kasih atas kerjasamanya! 🙏`;

            // Kirim pesan tanpa opsi parse_mode
            bot.sendMessage(user.telegramId, message)
                .then(() => console.log(`🚀 Notifikasi terkirim ke ${user.namaUser}`))
                .catch(error => {
                    console.error('Error saat mengirim notifikasi:', error.response ? 'User belum terdaftar di bot' : error.message);
                });
        });
    } catch (error) {
        console.error('Error saat menjalankan sendNotificationScreeningHrd:', 'error boss');
    }
}

async function getListUserHrdTeleForSendTele() {
    const tenaker = await Promise.all(
        listDept.map(async (dept) => {
            const tenakerDatas = await getTenakerScreeningByHrd();
            return {
                DeptAbbr: dept,
                data: tenakerDatas
            };
        })
    );

    // Check if any of the tenaker data arrays are empty
    const hasData = tenaker.some((item) => item.data.length > 0);
    if (!hasData) {
        console.log('Notifikasi tidak tersedia');
        return;
    }
    // console.log('hrd :', test.length);

    const userTeleHrd = await getUserTeleHrd();

    userTeleHrd.forEach(teleUser => {
        const matchingData = tenaker.find(item => item.DeptAbbr === teleUser.DeptAbbr);
        if (matchingData) {
            teleUser.data = matchingData.data;
        }
    });

    return userTeleHrd;
}


module.exports = { sendNotificationScreeningTim, sendNotificationScreeningHrd };

