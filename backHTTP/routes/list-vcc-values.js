const { request } = require('express');
var express = require('express');
var router = express.Router();
const {Request, TYPES} = require("tedious");
// const conection = require("../conection");
const {sleep}= require('../bin/socket-procedures/enviroment') 

router.get("./", function(req, resp, next){
    resp.render('index', {title: 'Express'});
});

router.post('/', async(req, res) => {
    let conection = await require('../conection')
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Request-Method');
    res.setHeader('Access-Control-Allow-Methods', 'POST');

    try{
        
    
    const query = new Request ("GetVCC", async (error)=>{
        if(error){
            console.log("Se registro un error al consultar los agentes: " +error)
            conection = await require('../conection');
            await sleep(500)
            conection.callProcedure(query);
        }else{
            // console.log("Se ha registrado")
        }
     })
      
       
     let vccs = [] 
          query.on("row", (row)=>{
              console.log("values: ", row);
            const vcc = {
              vccId: row[0].value,
              vccAcronimo: row[1].value, 
              vccNombre: row[2].value,
              rfc: row[3].value,
              telefonos: row[4].value?.split('|'),
              kams: row[5].value?.split('|'),
              direccion: row[6].value,
              emails: row[7].value?.split('|'),
              polizasAgentes: row[8].value,
              polizasSupervisores: row[9].value,
              polizasAdministradores: row[10].value,
            };
            vccs.push(vcc)
        })

        query.on("doneProc", ()=>{
            res.send(vccs)
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


