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
    const idVcc = req.body.idVcc;
    try{
            //Nombre del procedimiento "RegistrarUsuario"
    const query = new Request ("GetAllUsuarios", async (error)=>{
        if(error){
            console.log("Se registro un error al consultar todos los agentes: " +error)
            conection = await require('../conection');
            await sleep(500)
            conection.callProcedure(query);
        }else{
            console.log("Se han consultado todos los agentes")
        }
     })

    let usuarios = []
        query.on("row", (row)=>{
            const usuario ={
                    id: row[0]?.value,
                    nombreUsuario: row[1]?.value,
                    nombreCompleto: row[2]?.value,
                    tipoUsuario: row[3]?.value
            };
            usuarios.push(usuario)
        })

        query.on("doneProc", ()=>{
            res.send(usuarios)
        })

        query.addParameter("IdVcc", TYPES.Int, idVcc);


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
