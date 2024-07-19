const dbPool = require('../config/db.js');
const kdProvJSON = [
    {   "1100": "Aceh",
        "1200": "Sumatera Utara",
        "1300": "Sumatera Barat",
        "1400": "Riau",
        "1500": "Jambi",
        "1600": "Sumatera Selatan",
        "1700": "Bengkulu",
        "1800": "Lampung",
        "1900": "Kepulauan Bangka Belitung",
        "2100": "Kep. Riau",
        "3100": "DKI Jakarta",
        "3200": "Jawa Barat",
        "3300": "Jawa Tengah",
        "3400": "Daerah Istimewa Yogyakarta",
        "3500": "Jawa Timur",
        "3600": "Banten",
        "5100": "Bali",
        "5200": "Nusa Tenggara Barat",
        "5300": "Nusa Tenggara Timur",
        "6100": "Kalimantan Barat",
        "6200": "Kalimantan Tengah",
        "6300": "Kalimantan Selatan",
        "6400": "Kalimantan Timur",
        "6500": "Kalimantan Utara",
        "7100": "Sulawesi Utara",
        "7200": "Sulawesi Tengah",
        "7300": "Sulawesi Selatan",
        "7400": "Sulawesi Tenggara",
        "7500": "Gorontalo",
        "7600": "Sulawesi Barat",
        "8100": "Maluku",
        "8200": "Maluku Utara",
        "9100": "Papua Barat",
        "9200": "Papua Barat Daya",
        "9400": "Papua",
        "9500": "Papua Selatan",
        "9600": "Papua Tengah",
        "9700": "Papua Pegunungan",
        "9999":"Indonesia"
        
    }
];

const getAllData = () => {
    // const SQLQuery = `SELECT tahun,bulan,kode_prov_baru,jenis_akomodasi, kelas_akomodasi,SUM(MTA) AS MTA_,SUM(TA) AS TA_ ,SUM(MTNUS) AS MTNUS_, SUM(TNUS) AS TNUS_,SUM(MKTJ)/SUM(MKTS)*100 AS TPK_,
    // SUM(MTA)/SUM(TA) AS RLMTA_, SUM(MTNUS)/SUM(TNUS) AS RLMTNUS_, SUM(MTNUS)+SUM(MTA) AS MTGAB_, SUM(TA)+SUM(TNUS) AS TGAB_,  
    // (SUM(MTNUS)+SUM(MTA))/(SUM(TA)+SUM(TNUS)) AS RLMTGAB_ 
    // FROM tablename 
    // WHERE MKTS >=0 AND MKTJ >=0 AND MTA >=0 AND TA >=0 AND MTNUS>=0 AND TNUS >=0 
    // GROUP BY kode_prov_baru,tahun,bulan,jenis_akomodasi,kelas_akomodasi
    // ORDER BY kode_prov_baru,tahun,bulan,jenis_akomodasi,kelas_akomodasi;`;
    // return dbPool.execute(SQLQuery);
}
const getTPKBulanan = (body) => {
    console.log(body.kode);
    var SQLQuery = "";
    if (body.kode == "9999") {
        SQLQuery = `SELECT tahun,bulan, CONCAT(CASE bulan
            WHEN 1 THEN 'Jan'
            WHEN 2 THEN 'Feb'
            WHEN 3 THEN 'Mar'
            WHEN 4 THEN 'Apr'
            WHEN 5 THEN 'May'
            WHEN 6 THEN 'Jun'
            WHEN 7 THEN 'Jul'
            WHEN 8 THEN 'Aug'
            WHEN 9 THEN 'Sep'
            WHEN 10 THEN 'Oct'
            WHEN 11 THEN 'Nov'
            WHEN 12 THEN 'Dec'
            ELSE 'Unknown'
        END,'-',tahun) AS label_waktu,SUM(CASE WHEN jenis_akomodasi=1 THEN room_in_w + room_yesterday_w -room_out_w ELSE 0 END) / SUM(CASE WHEN jenis_akomodasi=1 THEN room_w ELSE 0 END)*100 AS tpk_bintang,
        SUM(CASE WHEN jenis_akomodasi=2 THEN room_in_w + room_yesterday_w -room_out_w ELSE 0 END) / SUM(CASE WHEN jenis_akomodasi=2 THEN room_w ELSE 0 END)*100 AS tpk_nonbintang,
        SUM(wni_in_w+wni_yesterday_w-wni_out_w )/SUM(wni_in_w) AS rlmtnus,
        SUM(wna_in_w+wna_yesterday_w-wna_out_w )/SUM(wna_in_w) AS rlmta,
        SUM(wni_in_w+wni_yesterday_w-wni_out_w+wna_in_w+wna_yesterday_w-wna_out_w)/SUM(wni_in_w+wna_in_w) AS rlmtgab   
        FROM tpkAkomodasi GROUP BY tahun,bulan,label_waktu ORDER BY tahun,bulan`;
    }
    else {
        SQLQuery = `SELECT tahun,bulan, CONCAT(CASE bulan
            WHEN 1 THEN 'Jan'
            WHEN 2 THEN 'Feb'
            WHEN 3 THEN 'Mar'
            WHEN 4 THEN 'Apr'
            WHEN 5 THEN 'May'
            WHEN 6 THEN 'Jun'
            WHEN 7 THEN 'Jul'
            WHEN 8 THEN 'Aug'
            WHEN 9 THEN 'Sep'
            WHEN 10 THEN 'Oct'
            WHEN 11 THEN 'Nov'
            WHEN 12 THEN 'Dec'
            ELSE 'Unknown'
        END,'-',tahun) AS label_waktu,SUM(CASE WHEN jenis_akomodasi=1 THEN room_in_w + room_yesterday_w -room_out_w ELSE 0 END) / SUM(CASE WHEN jenis_akomodasi=1 THEN room_w ELSE 0 END)*100 AS tpk_bintang,
        SUM(CASE WHEN jenis_akomodasi=2 THEN room_in_w + room_yesterday_w -room_out_w ELSE 0 END) / SUM(CASE WHEN jenis_akomodasi=2 THEN room_w ELSE 0 END)*100 AS tpk_nonbintang ,
        SUM(wni_in_w+wni_yesterday_w-wni_out_w )/SUM(wni_in_w) AS rlmtnus,
        SUM(wna_in_w+wna_yesterday_w-wna_out_w )/SUM(wna_in_w) AS rlmta,
        SUM(wni_in_w+wni_yesterday_w-wni_out_w+wna_in_w+wna_yesterday_w-wna_out_w)/SUM(wni_in_w+wna_in_w) AS rlmtgab  
        FROM tpkAkomodasi WHERE kode_prov_baru=`+ body.kode.substring(0, 2) + ` GROUP BY tahun,bulan,label_waktu ORDER BY tahun,bulan`;
    }
    // console.log(SQLQuery);
    return dbPool.execute(SQLQuery);
}

const getRLMTBulan = (body) => {
    var SQLQuery = "";
    if (body.kode == "9999") {
        SQLQuery = `SELECT tahun,bulan, CONCAT(CASE bulan
            WHEN 1 THEN 'Jan'
            WHEN 2 THEN 'Feb'
            WHEN 3 THEN 'Mar'
            WHEN 4 THEN 'Apr'
            WHEN 5 THEN 'May'
            WHEN 6 THEN 'Jun'
            WHEN 7 THEN 'Jul'
            WHEN 8 THEN 'Aug'
            WHEN 9 THEN 'Sep'
            WHEN 10 THEN 'Oct'
            WHEN 11 THEN 'Nov'
            WHEN 12 THEN 'Dec'
            ELSE 'Unknown'
        END,'-',tahun) AS label_waktu,
        SUM(wni_in_w+wni_yesterday_w-wni_out_w )/SUM(wni_in_w) AS rlmtnus,
        SUM(wna_in_w+wna_yesterday_w-wna_out_w )/SUM(wna_in_w) AS rlmta,
        SUM(wni_in_w+wni_yesterday_w-wni_out_w+wna_in_w+wna_yesterday_w-wna_out_w)/SUM(wni_in_w+wna_in_w) AS rlmtgab
       FROM tpkAkomodasi GROUP BY tahun,bulan,label_waktu ORDER BY tahun,bulan`;
    }
    else {
        SQLQuery = `SELECT tahun,bulan, CONCAT(CASE bulan
            WHEN 1 THEN 'Jan'
            WHEN 2 THEN 'Feb'
            WHEN 3 THEN 'Mar'
            WHEN 4 THEN 'Apr'
            WHEN 5 THEN 'May'
            WHEN 6 THEN 'Jun'
            WHEN 7 THEN 'Jul'
            WHEN 8 THEN 'Aug'
            WHEN 9 THEN 'Sep'
            WHEN 10 THEN 'Oct'
            WHEN 11 THEN 'Nov'
            WHEN 12 THEN 'Dec'
            ELSE 'Unknown'
        END,'-',tahun) AS label_waktu,
        SUM(wni_in_w+wni_yesterday_w-wni_out_w )/SUM(wni_in_w) AS rlmtnus,
        SUM(wna_in_w+wna_yesterday_w-wna_out_w )/SUM(wna_in_w) AS rlmta,
        SUM(wni_in_w+wni_yesterday_w-wni_out_w+wna_in_w+wna_yesterday_w-wna_out_w)/SUM(wni_in_w+wna_in_w) AS rlmtgab
       FROM tpkAkomodasi WHERE kode_prov_baru=`+ body.kode.substring(0, 2) + ` GROUP BY tahun,bulan,label_waktu ORDER BY tahun,bulan`;
    }
    // console.log(SQLQuery);
    return dbPool.execute(SQLQuery);

}

const getDataWisnas = () => {
    const SQLQuery = `WITH total_scores AS (
    SELECT 
        tahun,
        bulan,
        SUM(jumlah_wisnas) AS total_score
    FROM 
        wisnas
    GROUP BY 
        tahun, bulan
),
ranked_scores AS (
    SELECT 
        t.iso_country, 
        c.country_name,
        t.tahun, 
        t.bulan,
        t.jumlah_wisnas, 
        (t.jumlah_wisnas / ts.total_score) * 100 AS score_percentage,
        ROW_NUMBER() OVER (PARTITION BY t.tahun, t.bulan ORDER BY (t.jumlah_wisnas / ts.total_score) * 100 DESC) AS urutan
    FROM 
        wisnas AS t
    JOIN 
        total_scores AS ts 
        ON t.tahun = ts.tahun AND t.bulan = ts.bulan
    JOIN 
        iso_alpha3 AS c 
        ON t.iso_country = c.iso_country
),
top_5 AS (
    SELECT 
        CONCAT(iso_country,'_',country_name) AS label, 
        tahun,
    	"1" AS type, 
    	bulan,
        CONCAT(CASE bulan
            WHEN 1 THEN 'Jan'
            WHEN 2 THEN 'Feb'
            WHEN 3 THEN 'Mar'
            WHEN 4 THEN 'Apr'
            WHEN 5 THEN 'May'
            WHEN 6 THEN 'Jun'
            WHEN 7 THEN 'Jul'
            WHEN 8 THEN 'Aug'
            WHEN 9 THEN 'Sep'
            WHEN 10 THEN 'Oct'
            WHEN 11 THEN 'Nov'
            WHEN 12 THEN 'Dec'
            ELSE 'Unknown'
        END,'-',tahun)AS label_waktu,
        jumlah_wisnas,
        score_percentage
    FROM ranked_scores
    WHERE urutan <= 5
),
others AS (
    SELECT 
        'Other' AS label, 
        tahun, 
    "2" as type,
    bulan,
        CONCAT(CASE bulan
            WHEN 1 THEN 'Jan'
            WHEN 2 THEN 'Feb'
            WHEN 3 THEN 'Mar'
            WHEN 4 THEN 'Apr'
            WHEN 5 THEN 'May'
            WHEN 6 THEN 'Jun'
            WHEN 7 THEN 'Jul'
            WHEN 8 THEN 'Aug'
            WHEN 9 THEN 'Sep'
            WHEN 10 THEN 'Oct'
            WHEN 11 THEN 'Nov'
            WHEN 12 THEN 'Dec'
            ELSE 'Unknown'
        END,'-',tahun) AS label_waktu,
        SUM(jumlah_wisnas) AS jumlah_wisnas,
        SUM(score_percentage) AS score_percentage
    FROM ranked_scores
    WHERE urutan > 5
    GROUP BY tahun, bulan
)
SELECT * FROM top_5
UNION ALL
SELECT * FROM others
ORDER BY tahun, bulan,type, score_percentage DESC;`
    return dbPool.execute(SQLQuery);
}

const getWaktuWisnas = () => {
    const SQLQuery = `SELECT DISTINCT CONCAT(CASE bulan  
        WHEN 1 THEN 'Jan'
        WHEN 2 THEN 'Feb'
        WHEN 3 THEN 'Mar'
        WHEN 4 THEN 'Apr'
        WHEN 5 THEN 'May'
        WHEN 6 THEN 'Jun'
        WHEN 7 THEN 'Jul'
        WHEN 8 THEN 'Aug'
        WHEN 9 THEN 'Sep'
        WHEN 10 THEN 'Oct'
        WHEN 11 THEN 'Nov'
        WHEN 12 THEN 'Dec'
        ELSE 'Unknown' END,'-',tahun) AS label_waktu
 FROM wisnas;`
    return dbPool.execute(SQLQuery);
}

const getProvinceName = ()=>{
    let SQLQuery = "SELECT Nama FROM kodeprov WHERE idProv NOT IN ('00')";
    return dbPool.execute(SQLQuery);
}

const getODM = (body) => {
    //     const SQLQuery = `SELECT np_asal.iso_prov AS nmAsal,
    //     np_tujuan.iso_prov AS nmTujuan,jumlah_wisnus, np_asal.Nama AS asal, np_tujuan.Nama AS tujuan 
    // FROM
    //     odm

    // JOIN
    //     kodeprov np_asal ON prov_asal = np_asal.idProv
    // JOIN
    //     kodeprov np_tujuan ON prov_tujuan = np_tujuan.idProv
    // WHERE tahun=`+body.tahun+` AND bulan=`+body.bulan;
    var SQLQuery = "SELECT "
    var arr=[];
    let prov = kdProvJSON[0];
    let keys = Object.keys(prov);
    for (let i = 0; i < keys.length - 1; i++) {
        arr.push("SUM(CASE WHEN odm.prov_tujuan =" + keys[i].substring(0, 2) + " AND odm.prov_asal =idProv AND tahun="+body.tahun+" AND bulan="+body.bulan+" THEN odm.jumlah_wisnus ELSE 0 END) AS col"+keys[i].substring(0, 2));
    }
    SQLQuery+=arr.join(',');
    SQLQuery+=" FROM kodeprov LEFT JOIN odm ON idProv = odm.prov_asal WHERE idProv NOT IN(00) GROUP BY idProv";
    return dbPool.execute(SQLQuery);
}

const getWaktuODM = () => {
    const SQLQuery = `SELECT DISTINCT bulan, tahun,CONCAT(CASE bulan  
        WHEN 1 THEN 'Jan'
        WHEN 2 THEN 'Feb'
        WHEN 3 THEN 'Mar'
        WHEN 4 THEN 'Apr'
        WHEN 5 THEN 'May'
        WHEN 6 THEN 'Jun'
        WHEN 7 THEN 'Jul'
        WHEN 8 THEN 'Aug'
        WHEN 9 THEN 'Sep'
        WHEN 10 THEN 'Oct'
        WHEN 11 THEN 'Nov'
        WHEN 12 THEN 'Dec'
        ELSE 'Unknown' END,'-',tahun) AS label_waktu
 FROM odm;`
    return dbPool.execute(SQLQuery);
}

const getWaktuTPK = () => {
    const SQLQuery = `SELECT DISTINCT bulan, tahun,CONCAT(CASE bulan  
        WHEN 1 THEN 'Jan'
        WHEN 2 THEN 'Feb'
        WHEN 3 THEN 'Mar'
        WHEN 4 THEN 'Apr'
        WHEN 5 THEN 'May'
        WHEN 6 THEN 'Jun'
        WHEN 7 THEN 'Jul'
        WHEN 8 THEN 'Aug'
        WHEN 9 THEN 'Sep'
        WHEN 10 THEN 'Oct'
        WHEN 11 THEN 'Nov'
        WHEN 12 THEN 'Dec'
        ELSE 'Unknown' END,'-',tahun) AS label_waktu
 FROM tpkakomodasi;`
    return dbPool.execute(SQLQuery);
}

const getTPKGabung = (body) => {
    const SQLQuery = `SELECT tahun,bulan,CONCAT(CASE bulan  
        WHEN 1 THEN 'Jan'
        WHEN 2 THEN 'Feb'
        WHEN 3 THEN 'Mar'
        WHEN 4 THEN 'Apr'
        WHEN 5 THEN 'May'
        WHEN 6 THEN 'Jun'
        WHEN 7 THEN 'Jul'
        WHEN 8 THEN 'Aug'
        WHEN 9 THEN 'Sep'
        WHEN 10 THEN 'Oct'
        WHEN 11 THEN 'Nov'
        WHEN 12 THEN 'Dec'
        ELSE 'Unknown' END,'-',tahun) AS label_waktu, kode_prov_baru,
        t.Nama as namaprov,
        SUM(wni_in_w+wni_yesterday_w-wni_out_w)/ SUM(wni_in_w) AS rlmtnus, 
        SUM(wna_in_w+wna_yesterday_w-wna_out_w)/ SUM(wna_in_w) AS rlmta,
        SUM(wni_in_w+wni_yesterday_w-wni_out_w+wna_in_w+wna_yesterday_w-wna_out_w)/ SUM(wni_in_w+wna_in_w) AS rlmtgab,
        SUM(room_in_w + room_yesterday_w -room_out_w)/SUM(room_w)*100 AS tpk
        FROM tpkakomodasi JOIN kodeprov t ON kode_prov_baru = t.idProv WHERE tahun=`+ body.tahun + ` AND bulan=` + body.bulan + ` GROUP BY tahun,bulan,label_waktu,kode_prov_baru,namaprov ORDER BY tahun,bulan,label_waktu,kode_prov_baru,namaprov;`
    console.log(SQLQuery);
    return dbPool.execute(SQLQuery);
}

module.exports = {
    getAllData,
    getDataWisnas,
    getWaktuWisnas,
    getODM,
    getProvinceName,
    getWaktuODM,
    getTPKBulanan,
    getWaktuTPK,
    getTPKGabung
}