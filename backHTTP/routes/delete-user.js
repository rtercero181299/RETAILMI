var express = require('express');
var router = express.Router();
const {Request, TYPES} = require("tedious");
const {sleep} = require('../bin/socket-procedures/enviroment')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/',async (req,res)=>{
    let conection = await require("../conection");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    try{
        const body = req.body;
        const idUsuario = body.idUsuario
        const idSupervisor = body.idSupervisor
        //const Usuario_imgFoto = body.usuario_imgFoto
    //   console.log("se comienza la actualización con datos:","user", user,"nombreCompleto",nombreCompleto,"password",password,"vccId",vccId,"campañaId",campañaId,"supervisores",supervisores,"agentes",agentes,"tipoUsuario",tipoUsuario,"idUsuario",idUsuario,"idSupervisor",idSupervisor)
      const query2 = new Request("EliminarUsuario", async(error)=>{
            if(error){
              try {
                if(error.message.includes("SentClientRequest")){
                  res.send({result: "error-several-clicks"})
                }else{
                  res.send({result: "error"});
                }
              } catch (error) {
                
              }
              console.log("error al eliminar el usuario: ", error);
              
            }else{
              try {
                res.send({result: "correcto"})
              } catch (error) {
              
              }
              console.log("se eliminó al usuario: ", idUsuario);
            }
          })
        query2.addParameter('IdSupervisor',TYPES.Int,idSupervisor)
        query2.addParameter('IdUsuario',TYPES.Int,idUsuario)
        try {
        conection.callProcedure(query2);
    } catch (error) {
        console.log("error en la conexión");
    }
    

    }catch(error){
        console.log("Se produjo un error:"+error)
    }
    
});

router.options("/",(req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  
    next();
  });
  module.exports = router;