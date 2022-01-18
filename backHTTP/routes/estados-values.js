const { request } = require('express');
var express = require('express');
var router = express.Router();
const {Request, TYPES} = require("tedious");
const { sleep } = require('../bin/socket-procedures/enviroment');


router.get("./", function(req, resp, next){
    resp.render('index', {title: 'Express'});
});

router.post('/',async  (req, res) => {
    const conection = await require("../conection");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Request-Method');
    res.setHeader('Access-Control-Allow-Methods', 'POST');

    try{
        
    
            //Nombre del procedimiento "RegistrarUsuario"
    const query = new Request ("GetEstados", async (error)=>{
        if(error){
            console.log("Se registro un error:" +error)
            await sleep(1000);
            conection.callProcedure(query);
        }else{
            console.log("Se completó el procedure para obtener los estados")
        }
     })

    let estd = []
        query.on("row", (row)=>{
            if(row){
                const est ={
                    estadosIdCat_Id: row[0].value,
                    estadosIdCat_Name: row[1].value,
                };
                estd.push(est)
            }
        })

        query.on("doneProc", ()=>{
            res.send(estd)
        })
        //Pruebas de error
        try{
            conection.callProcedure(query);     
        } catch(error){
            console.log("error en la conexión:"+error)
        } 
    } catch(error){
        console.log("Se registro un error:" +error)
    }
}); 

router.options("/", (req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  
    next();
});
module.exports = router;