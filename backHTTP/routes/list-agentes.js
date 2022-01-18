var express = require('express');
var router = express.Router();
const {Request, TYPES} = require("tedious");
const { sleep } = require('../bin/socket-procedures/enviroment');


// router.get("./", function(req, resp, next){
//     resp.render('index', {title: 'Express'});
// });

router.post('/', async (req, res) => {
    let conection = await require("../conection");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Request-Method');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    const idSupervisor = req.body.idSupervisor;
    try{
            //Nombre del procedimiento "RegistrarUsuario"
    const query = new Request ("GetAgentesPorSupervisor", async (error)=>{
        if(error){
            console.log("Se registro un error al consultar los agentes: " +error)
            conection = await require('../conection');
            await sleep(500)
            conection.callProcedure(query);
        }else{
            console.log("Se han consultado los agentes")
        }
     })

    let agentes = []
        query.on("row", (row)=>{
            const agente ={
                    id: row[0]?.value,
                    nombre: row[1]?.value,
                    foto: row[2]?.value
            };
            agentes.push(agente)
        })

        query.on("doneProc", ()=>{
            res.send(agentes)
        })

        query.addParameter("IdSupervisor", TYPES.Int, idSupervisor);


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
