var express = require('express');
var router = express.Router();
// const {Request, TYPES} = require("tedious");
const fs = require('fs');
const xlsxFile = require('read-excel-file/node');
const { sleep } = require('../bin/socket-procedures/enviroment');
let rows;
(async ()=>{
    rows = await xlsxFile('./postal-codes.xlsx');
    // console.log(rows);
})()
        
        // router.get("./", function(req, resp, next){
            //     resp.render('index', {title: 'Express'});
            // });
            
router.post('/', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Request-Method');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    const cp = req.body.cp;
    // console.log("rows: ", rows);
    // console.log("post cd validar: ", cp)
    res.send({correct: rows?.some(row=> row[2]== cp && row[3]=="SI")})
});

router.options("/", (req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  
    next();
});
module.exports = router;
