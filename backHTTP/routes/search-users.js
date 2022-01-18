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
    const searchString = req.body.searchString;
    try{
            //Nombre del procedimiento "RegistrarUsuario"
    const query = new Request ("SearchUser", async (error)=>{
        if(error){
            console.log("Se registro un error al buscar usuarios: " +error)
            conection = await require('../conection');
            await sleep(500)
            conection.callProcedure(query);
        }else{
            console.log("Se han buscado los usuarios")
        }
     })

    let users = []
        query.on("row", (row)=>{
            const user ={
                    id: row[0]?.value,
                    nombreUsuario: row[1]?.value,
                    nombreCompleto: row[2]?.value,
                    foto: row[3]?.value,
                    tipoUsuario: row[4]?.value,
                    idCampania:  row[5]?.value,
                    nombreCampania:  row[6]?.value,
                    idVcc:  row[7]?.value,
                    nombreVcc:  row[8]?.value,
                    nombreTipoUsuario: row[9]?.value,
                    password:row[10]?.value
            };
            users.push(user)
        })

        query.on("doneProc", ()=>{
            res.send(users)
        })

        query.addParameter("IdSupervisor", TYPES.Int, idSupervisor);
        query.addParameter("SearchParam", TYPES.NVarChar, searchString);


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
