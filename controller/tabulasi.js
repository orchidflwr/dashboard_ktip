const tabModel = require('../models/tabulasi.js');
const CsvInsert = require("mysql-insert-csv");
// const coordList = require('../assets/regencies.json');

const indexPage = async (req, res) => {
    try {
        var role;
        const tahun = await tabModel.getTahun();
        try{
            if(req.session.passport.user[0]){
                role=req.session.passport.user[0].role

            }
        }
        catch(err){
            role=2;

        }
        

        // console.log(tahun[0]);
        res.render("tabulasi", { data: tahun[0], role : role })
    }
    catch (error) {
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error,
        })

    }
}
const getCrossTab = async (req, res) => {
    const { body } = req;
    // console.log(body);

    // console.log(arr[0]);

    try {
        let arr;
        let span;
        let temp;
        if (body.group.length > 0) {
            arr = await tabModel.getGroup({ columns: body.group });
            // span =await tabModel.getGroupData({columns:body.group});
            // for(let j=0;j<span[0].length;j++){
            //     temp.push(Object.values(span[0][j].spliced(0,span[0].length/2-1)));
            // }
            // // console.log(arr);
            body["listgroup"] = arr[0];
            temp = arr[0];
        }
        else {
            temp = [];
        }
        let data = await tabModel.getAllData(body);
        let columns = [];
        const list = Object.keys(data[0][0]).sort();
        console.log(list);
        console.log(data[0]);

        for (let i = 0; i < list.length; i++) {
            columns.push({ data: list[i] });
        }
        console.log(list);
        res.send({
            data: data[0],
            columns: columns,
            matrix: temp,

        })


    }
    catch (error) {
        res.send({error:'Perhatikan konfigurasi tabulasi'});
        // res.status(500).send('Tolong Perhatikan Konfigurasi Tabulasi');

    }
}

const XLSX = require('xlsx');
const fs = require('fs');
const csvToJson = require('convert-csv-to-json');

function convertExcelToCsv(inputFile, outputFile) {
    // Read the Excel file
    const workbook = XLSX.readFile(inputFile);

    // Assuming you want to convert the first sheet only
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the sheet to CSV
    const csvData = XLSX.utils.sheet_to_csv(worksheet);

    // Write the CSV data to a file
    fs.writeFileSync(outputFile, csvData, 'utf8');

    console.log(`Converted ${inputFile} to ${outputFile}`);
}


const uploadCSV = async (req, res) => {
    try {
        // console.log(req);
        const { body } = req
        let data = await tabModel.insertData(body);
        console.log(data);
        res.status(200).send({ message: data });

    }
    catch (err) {
        // console.log(err);
        res.status(500).send('File uploaded failed')

    }
}

const getNotValid = async(req,res)=>{
    try{
        const {body}=req;

        const check= await tabModel.checkValid(body);
        if(check==[]){
            res.json({
                data:[],
            })
        }
        else{
            const [baris,kolom] = await tabModel.checkValid(body);
            const resultInvalid = baris.map(baris=>Object.values(baris));
            let columns = [];
            const list = Object.keys(check[0][0]);
            
        

        for (let i = 0; i < list.length; i++) {
            columns.push({ title: list[i] });
        }
        console.log(columns);
            res.json({
                data:resultInvalid,
                judul : columns
            })

            
        }
        
        


    }
    catch(error){

    }
}



// const getAllData = async (req, res) => {
//     try {
//         const brs= await BrsModel.getAllData();
//         // let temp = brs[0].filter(a => a.id == 24);
//         // res.status(200).json({
//         //     data:temp
//         // })
//         res.render("brs",{
//             message: 'GET all data success',
//             data :brs[0]
//         })
//     } catch (error) {
//         res.status(500).json({
//             message: 'Server Error',
//             serverMessage: error,
//         })
//     }
// }
// const updateData = async(req,res)=>{
//     const {body} = req;
//     try{
//         const brs = await BrsModel.updateData(body);
//         res.redirect("/");
//     }
//     catch(error){
//         res.status(500).json({
//             message: 'Server Error',
//             serverMessage: error,
//         })
//         // alert(error);
//     }
// }
// const insertData = async(req,res)=>{
//     const {body} = req;
//     try{
//         const brs = await BrsModel.insertData(body);
//         res.redirect("/");

//     }
//     catch(error){
//         res.status(500).json({
//             message: 'Server Error',
//             serverMessage: error,
//         })
//         // alert(error);
//     }
// }

module.exports = {
    indexPage,
    getCrossTab,
    uploadCSV,
    getNotValid

}