const { request } = require('express');
var express = require('express');
var router = express.Router();
const {Request, TYPES} = require("tedious");
const {sleep}= require('../bin/socket-procedures/enviroment') 
// const conection = require("../conection");


router.get("./", function(req, resp, next){
    resp.render('index', {title: 'Express'});
});

router.post('/',async (req, res) => {
    let conection = await require('../conection')
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Request-Method');
    res.setHeader('Access-Control-Allow-Methods', 'POST');

    try{
        
    
            //Nombre del procedimiento "RegistrarUsuario"
    const query = new Request ("GetCampanias", async (error)=>{
        if(error){
            console.log("Se registro un error al consultar las campanias: " +error)
            conection = await require('../conection');
            await sleep(500)
            conection.callProcedure(query);
        }else{
            // console.log("Se ha registrado")
        }
     })

    let comp = []
        query.on("row", (row)=>{
            const com ={
                campania_intId: row[0].value,
                campania_strNombre: row[1].value,
            };
            comp.push(com)
        })

        query.on("doneProc", ()=>{
            res.send(comp)
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


