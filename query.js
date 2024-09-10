// query.js
const sql = require('mssql');
const { config } = require('./config');

// Fungsi untuk mengambil data user Telegram
async function getUserTele() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
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
                B.telegramid IS NOT NULL
                AND A.DeptAbbr IN ('HRD', 'MPD', 'PCW', 'RMD', 'SEC', 'ITD')
                AND A.telenotiftim = '1'
            GROUP BY
                A.PersonalId, A.NamaUser, A.NamaDept, A.DeptAbbr, B.telegramid
        `);
        return result.recordset.map(row => ({
            telegramId: row.telegramid,
            namaUser: row.NamaUser,
            DeptAbbr: row.DeptAbbr,
            data: {}
        }));
    } catch (error) {
        console.error('Error saat menjalankan query getUserTele:', error);
        return [];
    } finally {
        sql.close();
    }
}

// Fungsi untuk mengambil data tenaga kerja berdasarkan department
async function getTenakerScreeningByTim(dept) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT DISTINCT
                a.HeaderID,
                a.Nama
            FROM
                tblTrnCalonTenagaKerja a
                LEFT JOIN vwListBerkas d ON a.HeaderID = d.HeaderID
            WHERE
                a.Verified = '1'
                AND a.UdahDiAmbil = '0'
                AND a.GeneralStatus = '0'
                AND a.RegisteredDate >= '2022-01-01'
                AND a.HeaderID NOT IN (
                    SELECT HeaderID FROM tblTrnScreening WHERE Dept = '${dept}'
                )
                AND ScreeningComplete IS NULL
            ORDER BY
                a.HeaderID ASC
        `);
        return result.recordset.map(row => ({
            nama: row.Nama,
            headerid: row.HeaderID
        }));
    } catch (error) {
        console.error('Error saat menjalankan query getTenakerScreeningByTim:', error);
        return [];
    } finally {
        sql.close();
    }
}


async function getTenakerScreeningByHrd() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
           SELECT DISTINCT
                a.*,
                b.KTP,
                b.CV,
                b.Lamaran,
                b.Ijazah,
                b.SKCK,
                b.Transkrip,
                b.Vaksin1,
                b.Vaksin2,
                b.Vaksin3 
            FROM
                vwTenakerForScreenPSN_karantina AS a
                INNER JOIN vwListBerkas AS b ON b.HdrID= a.HeaderID 
            WHERE
                ( AppDivStatus = 1 AND ScreeningComplete = 1 AND a.DeptTujuan = 'HED' ) 
                OR ( AppDivStatus = 1 AND ScreeningComplete = 1 AND a.DeptTujuan != 'HED' ) 
                OR ( AppP2K3Status = 1 AND ScreeningComplete = 1 AND a.DeptTujuan != 'HED' ) 
                OR (
                    ScreeningComplete = 1 
                    AND a.DeptTujuan <> 'HED' 
                    AND a.DeptTujuan <> 'TBN' 
                    AND a.DeptTujuan <> 'BLR' 
                    AND a.DeptTujuan <> 'BMD' 
                    AND a.DeptTujuan <> 'CAC' 
                    AND a.DeptTujuan <> 'DWP' 
                    AND a.DeptTujuan <> 'ELC' 
                    AND a.DeptTujuan <> 'IPAL' 
                    AND a.DeptTujuan <> 'PRU' 
                    AND a.DeptTujuan <> 'PWH' 
                    AND a.DeptTujuan <> 'WTD' 
                ) 
            ORDER BY
                HeaderID ASC
        `);
        return result.recordset.map(row => ({
            nama: row.Nama,
            headerid: row.HeaderID
        }));
    } catch (error) {
        console.error('Error saat menjalankan query getTenakerScreeningByHrd:', error);
        return [];
    } finally {
        sql.close();
    }
}

async function getUserTeleHrd() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
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
                B.telegramid IS NOT NULL
                AND A.DeptAbbr IN ('HRD', 'ITD')
                AND A.telenotif = '1'
            GROUP BY
                A.PersonalId, A.NamaUser, A.NamaDept, A.DeptAbbr, B.telegramid
        `);
        return result.recordset.map(row => ({
            telegramId: row.telegramid,
            namaUser: row.NamaUser,
            DeptAbbr: row.DeptAbbr,
            data: {}
        }));
    } catch (error) {
        console.error('Error saat menjalankan query getUserTeleHrd:', error);
        return [];
    } finally {
        sql.close();
    }
}

module.exports = { getUserTele, getTenakerScreeningByTim, getTenakerScreeningByHrd, getUserTeleHrd };
