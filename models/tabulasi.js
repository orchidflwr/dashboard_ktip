const dbPool = require('../config/db.js');

const getTahun = () => {
    const SQLQuery = `SELECT DISTINCT tahun FROM tpkakomodasi ORDER BY tahun`;
    return dbPool.execute(SQLQuery);
}
const getGroupData = (body) => {
    var SQL = 'SELECT ';
    let col = body.columns.split(',');
    for (let i = 0; i < col.length; i++) {
        SQL = SQL + 'COUNT(DISTINCT ' + col[i] + ") AS " + col[i];
    }
    SQL = SQL + `FROM tpkakomodasi`
    return dbPool.execute(SQL);
}

const getGroup = (body) => {
    // let result = {};
    let col = body.columns.split(',');
    var SQLQuery = '';
    // for(let i=0;i<col.length;i++){
    //     SQLQuery=SQLQuery+`SELECT COUNT(DISTINCT `+col[i]+`) from tpkAkomodasi;`;    
    // }
    SQLQuery = SQLQuery + `SELECT ` + body.columns;
    if (col.includes('jenis_akomodasi')) {
        SQLQuery = SQLQuery + `,CASE WHEN jenis_akomodasi=1 THEN 'Hotel Bintang' ELSE 'Hotel Nonbintang' END AS nama_jenis_akomodasi`;
        SQLQuery = SQLQuery + `,COUNT(*) OVER (PARTITION BY jenis_akomodasi) AS span_jenis_akomodasi`;
    }
    if (col.includes('kelas_akomodasi')) {
        SQLQuery = SQLQuery + ` ,CASE WHEN jenis_akomodasi=1 THEN CONCAT('Bintang ',kelas_akomodasi) ELSE CONCAT('Kelas ',kelas_akomodasi) END AS nama_kelas_akomodasi`;
        SQLQuery = SQLQuery + `,COUNT(*) OVER (PARTITION BY jenis_akomodasi,kelas_akomodasi) AS span_kelas_akomodasi`

    }

    SQLQuery = SQLQuery + ` FROM tpkakomodasi GROUP BY ` + body.columns;
    // console.log(SQLQuery);


    return dbPool.execute(SQLQuery);

}

const getAllData = (body) => {
    let SQL = `SELECT ` + body.level + ` ,kodeprov.Nama AS provinsi`;
    let str_sum = [];
    let periodeVal = 12 / body.periode;
    if (body.group.length > 0) {

        for (let i = 0; i < body.listgroup.length; i++) {
            let str_group = [];
            let name = '';
            for (let j = 0; j < Object.keys(body.listgroup[i]).length / 3; j++) {
                str_group.push(Object.keys(body.listgroup[i])[j] + " = " + body.listgroup[i][Object.keys(body.listgroup[i])[j]]);
                name = name + body.listgroup[i][Object.keys(body.listgroup[i])[j]].toString();
            }

            for (let k = 0; k < periodeVal ; k++) {
                let lowVal = parseInt(body.periode) * k + 1;
                let upVal =  parseInt(body.periode) *(k+1);
                let periodeStr = ` AND bulan BETWEEN ` + lowVal + ` AND ` + upVal;
                str_sum.push(`SUM(CASE WHEN ` + str_group.join(' AND ') + periodeStr + ` THEN room_w ELSE 0 END) AS t1_mkts_` + name + k);
                str_sum.push(`SUM(CASE WHEN ` + str_group.join(' AND ') + periodeStr + ` THEN room_in_w + room_yesterday_w -room_out_w ELSE 0 END) AS t2_mktj_` + name + k);
                str_sum.push(`ROUND(SUM(CASE WHEN ` + str_group.join(' AND ') + periodeStr + ` THEN room_in_w + room_yesterday_w -room_out_w ELSE 0 END)/` + `SUM(CASE WHEN ` + str_group.join(' AND ') + periodeStr + ` THEN room_w ELSE 0 END)*100,2) AS t3_tpk_` + name + k);
                str_sum.push(`SUM(CASE WHEN ` + str_group.join(' AND ') + periodeStr + ` THEN wni_in_w+wni_yesterday_w-wni_out_w ELSE 0 END) AS t4_mtnus_` + name + k);
                str_sum.push(`SUM(CASE WHEN ` + str_group.join(' AND ') + periodeStr + ` THEN wni_in_w ELSE 0 END) AS t5_tnus_` + name + k);
                str_sum.push(`ROUND(SUM(CASE WHEN ` + str_group.join(' AND ') + periodeStr + ` THEN wni_in_w+wni_yesterday_w-wni_out_w ELSE 0 END)/` + `SUM(CASE WHEN ` + str_group.join(' AND ') + periodeStr + ` THEN wni_in_w ELSE 0 END),2) AS t6_rlmtnus_` + name + k);
                str_sum.push(`SUM(CASE WHEN ` + str_group.join(' AND ') + periodeStr + ` THEN wna_in_w+wna_yesterday_w-wna_out_w ELSE 0 END) AS t7_mta_` + name + k);
                str_sum.push(`SUM(CASE WHEN ` + str_group.join(' AND ') + periodeStr + ` THEN wna_in_w ELSE 0 END) AS t8_ta_` + name + k);
                str_sum.push(`ROUND(SUM(CASE WHEN ` + str_group.join(' AND ') + periodeStr + ` THEN wna_in_w+wna_yesterday_w-wna_out_w ELSE 0 END)/` + `SUM(CASE WHEN ` + str_group.join(' AND ') + periodeStr + ` THEN wna_in_w ELSE 0 END),2) AS t9_rlmta_` + name + k);
                str_sum.push(`ROUND(SUM(CASE WHEN ` + str_group.join(' AND ') + periodeStr + ` THEN wni_in_w+wni_yesterday_w-wni_out_w+wna_in_w+wna_yesterday_w-wna_out_w ELSE 0 END)/` + `SUM(CASE WHEN ` + str_group.join(' AND ') + periodeStr + ` THEN wna_in_w+wni_in_w ELSE 0 END),2) AS tA_rlmtgab_` + name + k);

            }



        }
        SQL = SQL + ',' + str_sum.join(',');
    }
    else {

        for (let k = 0; k < periodeVal; k++) {
            let lowVal = parseInt(body.periode) * k + 1;
            let upVal = parseInt(lowVal) + parseInt(body.periode) - 1;
            let periodeStr = ` CASE WHEN bulan BETWEEN ` + lowVal + ` AND ` + upVal;

            str_sum.push(`SUM(` + periodeStr + ` THEN room_w ELSE 0 END) AS t1_mkts_` + k);
            str_sum.push(`SUM(` + periodeStr + ` THEN room_in_w + room_yesterday_w -room_out_w ELSE 0 END) AS t2_mktj_` + k);
            str_sum.push(`ROUND(SUM(` + periodeStr + ` THEN  room_in_w + room_yesterday_w -room_out_w ELSE 0 END)/` + `SUM(` + periodeStr + ` THEN  room_w ELSE 0 END)*100,2) AS t3_tpk_` + k);
            str_sum.push(`SUM(` + periodeStr + ` THEN wni_in_w+wni_yesterday_w-wni_out_w ELSE 0 END) AS t4_mtnus_` + k);
            str_sum.push(`SUM(` + periodeStr + ` THEN  wni_in_w ELSE 0 END) AS t5_tnus_` + k);
            str_sum.push(`ROUND(SUM(` + periodeStr + ` THEN wni_in_w+wni_yesterday_w-wni_out_w ELSE 0 END)/` + `SUM(` + periodeStr + ` THEN  wni_in_w ELSE 0 END),2) AS t6_rlmtnus_` + k);
            str_sum.push(`SUM(` + periodeStr + ` THEN wna_in_w+wna_yesterday_w-wna_out_w ELSE 0 END) AS t7_mta_` + k);
            str_sum.push(`SUM(` + periodeStr + ` THEN wna_in_w ELSE 0 END) AS t8_ta_` + k);
            str_sum.push(`ROUND(SUM(` + periodeStr + ` THEN wna_in_w+wna_yesterday_w-wna_out_w ELSE 0 END)/` + `SUM(` + periodeStr + ` THEN wna_in_w ELSE 0 END),2) AS t9_rlmta_` + k);
            str_sum.push(`ROUND(SUM(` + periodeStr + ` THEN wni_in_w+wni_yesterday_w-wni_out_w+wna_in_w+wna_yesterday_w-wna_out_w ELSE 0 END)/` + `SUM(` + periodeStr + ` THEN wna_in_w+wni_in_w ELSE 0 END),2) AS tA_rlmtgab_` + k);

        }

        SQL = SQL + ',' + str_sum.join(',');
    }
    if (body.tahun) {
        SQL = SQL + ` FROM tpkAkomodasi LEFT JOIN kodeprov ON tpkAkomodasi.kode_prov_baru=kodeprov.idProv WHERE tahun in (` + body.tahun + `)  GROUP BY provinsi,` + body.level;
    }


    console.log(SQL);
    return dbPool.execute(SQL);
}

const mysql = require('mysql2/promise')
const insertData = async (body) => {

    const connection = await mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '',
        database: 'skripsi_dashboard'
    })

    // Start transaction
    let info = [];
    await connection.beginTransaction();
    let json = body["content[]"];
    let header = body["header"];
    for (let i = 0; i < json.length; i++) {

        let SQL;
        if(body["table"]==1){
            SQL = 'INSERT INTO tpkakomodasi ' + header + ' VALUES '+json[i]+' ON DUPLICATE KEY UPDATE room_w = VALUES(room_w),bed_w=VALUES(bed_w), room_yesterday_w=VALUES(room_yesterday_w), room_in_w=VALUES(room_in_w), room_out_w=VALUES(room_out_w), wna_yesterday_w=VALUES(wna_yesterday_w), wni_yesterday_w=VALUES(wni_yesterday_w), wna_in_w=VALUES(wna_in_w), wni_in_w=VALUES(wni_in_w), wna_out_w=VALUES(wna_out_w), wni_out_w=VALUES(wni_out_w)';
        }
        else if(body["table"]==2){
            SQL = 'INSERT INTO odm '+header+' VALUES '+json[i]+' ON DUPLICATE KEY UPDATE jumlah_wisnus = VALUES(jumlah_wisnus)'
        }
        else if(body["table"]==3){
             SQL = 'INSERT INTO wisnas '+header+' VALUES '+json[i]+' ON DUPLICATE KEY UPDATE jumlah_wisnas = VALUES(jumlah_wisnas)'
        }
        console.log(SQL);
        try {
            await connection.query(SQL);
        }
        catch (err) {
            info.push('Transaction Failed at row ' + (i + 1) + " " + err.toString());
            // console.log('Transaction Failed at row '+(i+1), err.toString());
        }

    }

    // // Execute your queries
    // // Commit the transaction
    if (info.length == 0) {
        await connection.commit();
        info.push('Transaction Completed Successfully.');
        return info;
    } else {
        await connection.rollback();
        info.push('Transaction Failed. Rolled Back.');
        return info;

    }

}

const checkValid = async(body)=>{
    var SQL
    if(body["tabel"]==1){
        SQL = `SELECT *, 
    CONCAT(
        CASE WHEN bulan < 1 THEN 'bulan<1, ' ELSE '' END,
        CASE WHEN bulan > 12 THEN 'bulan>12, ' ELSE '' END,
        CASE WHEN ((room_in_w + room_yesterday_w - room_out_w) / room_w * 100) > 100 THEN 'TPK>100%, ' ELSE '' END,
        CASE WHEN ((room_in_w + room_yesterday_w - room_out_w) / room_w * 100) < 5 THEN 'TPK<5%, ' ELSE '' END,
        CASE WHEN (wna_in_w = 0 AND (wna_in_w + wna_yesterday_w - wna_out_w) > 0) THEN 'TA kosong namun MTA terisi, ' ELSE '' END,
        CASE WHEN (wna_in_w + wna_yesterday_w - wna_out_w) < wna_in_w THEN 'MTA<TA, ' ELSE '' END,
        CASE WHEN (wni_in_w = 0 AND (wni_in_w + wni_yesterday_w - wni_out_w) > 0) THEN 'TNUS kosong namun MTNUS terisi, ' ELSE '' END,
        CASE WHEN (wni_in_w + wni_yesterday_w - wni_out_w) < wni_in_w THEN 'MTNUS<TNUS, ' ELSE '' END,
        CASE WHEN ((wna_in_w + wna_yesterday_w - wna_out_w) / wna_in_w) < 1 THEN 'RLMTA<1, ' ELSE '' END,
        CASE WHEN ((wna_in_w + wna_yesterday_w - wna_out_w) / wna_in_w) > 7 THEN 'RLMTA>7, ' ELSE '' END,
        CASE WHEN ((wni_in_w + wni_yesterday_w - wni_out_w) / wni_in_w) < 1 THEN 'RLMTNUS<1, ' ELSE '' END,
        CASE WHEN ((wni_in_w + wni_yesterday_w - wni_out_w) / wni_in_w) > 7 THEN 'RLMTA>7, ' ELSE '' END
    ) AS Keterangan
FROM tpkakomodasi
HAVING Keterangan != '';`
console.log('1');
    return dbPool.execute(SQL);
    }
    else if(body["tabel"]==2){
        return [];
    }
    else if(body["tabel"]==3){
        return [];

    }
}


module.exports = {
    getAllData,
    getTahun,
    getGroup,
    getGroupData,
    insertData,
    checkValid
}