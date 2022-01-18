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
    const fechaInicio = req.body.fechaInicio
    const fechaFin = req.body.fechaFin
    console.log("info de busqueda: ", req.body)
    try{
            //Nombre del procedimiento "RegistrarUsuario"
    const query = new Request ("GetAllTimes", async (error)=>{
        if(error){
            console.log("Se registro un error al consultar el historico del supervisor: ", idSupervisor,"error: ", error)
            conection = await require('../conection');
            await sleep(500)
            conection.callProcedure(query);
        }else{
            console.log("Se han consultado los historicos")
        }
     })

    let tiempos = []
        query.on("row", (row)=>{
            const time ={
                userId: row[0].value,
                userName: row[1].value,
                userFullName: row[2].value,
                estadoId: row[3].value,
                estado: row[4].value,
                fechaInicio: row[5].value
            };
            tiempos.push(time)
        })

        query.on("doneProc", ()=>{
            res.send(tiempos)
        })

        query.addParameter("SupervisorId", TYPES.Int, idSupervisor);
        query.addParameter("FechaInicio", TYPES.DateTime, fechaInicio)
        query.addParameter("FechaFin", TYPES.DateTime, fechaFin)


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
