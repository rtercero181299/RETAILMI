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
        const user = body.usuario
        const Usuario_strNombreCompleto = body.usuario_strNombreCompleto
        const Usuario_strPassword = body.password
        const Usuario_intVccId = body.usuario_intVccId
        const Usuario_intCampañaId = body.usuario_intCampañaId
        const supervisores = body.usuario_intSupervisoresId?.join("|")+"|"
        const agentes = body.agentes?.join("|")+"|"
        const tipoUsuario = body.tipoUsuario;
        //const Usuario_imgFoto = body.usuario_imgFoto
      // console.log("se comienza el registro")
      const query = new Request("ConsultarExisteUsuario", async(error)=>{
        if(error){
          if (error.code === 'EINVALIDSTATE'|| error.code =="ESOCKET"){
            console.log("error de conexión al hacer la existencia del usuario: ", user);
            await sleep(1000);
            try {
              conection = await require('../../conection');
              await sleep(500)
              conection.callProcedure(query);
            } catch (errorConection) {
              console.log("error de conexión al intentar reiniciar");
            }
          }else{
            console.log("error en la consulta de usuario : "+ user+" error:", error.code);
          }
          await sleep(1000);
        }
      })
      query.addParameter("nombreUsuario", TYPES.NVarChar, user);
      let userResp;
      query.on("row", (row)=>{
        userResp = row[0].value
      })
      query.on("requestCompleted", ()=>{
        if(userResp){
            res.send({result:"user-exist"})
        }else{
          const query2 = new Request("RegistrarUsuario", async(error)=>{
            if(error){
              try {
                if(error.message.includes("SentClientRequest")){
                  res.send({result: "error-several-clicks"})
                }else{
                  res.send({result: "error"});
                }
              } catch (error) {
                
              }
              console.log("error en la insercion de datos: ", error);
              
            }else{
              try {
                res.send({result: "correcto"})
              } catch (error) {
              
              }
              console.log("se creo el registro");


            }
          })
          query2.addParameter('Usuario_strNombreUsuario',TYPES.NVarChar,user);
          query2.addParameter('Usuario_strNombreCompleto',TYPES.NVarChar,Usuario_strNombreCompleto);
          query2.addParameter('Usuario_strPassword',TYPES.NVarChar,Usuario_strPassword);
          query2.addParameter('Usuario_intVccId',TYPES.Int,Usuario_intVccId)
          query2.addParameter('Usuario_intCampañaId',TYPES.Int,Usuario_intCampañaId)
          query2.addParameter('Supervisores',TYPES.NVarChar,supervisores);
          query2.addParameter('Agentes',TYPES.NVarChar,agentes);
          query2.addParameter('TipoUsuario', TYPES.Int, tipoUsuario);
          // console.log("supervisores: ", supervisores);
          // query2.on("requestCompleted", ()=>{
          //   console.log("correcto");
          // })
          //query.addParameter('Usuario_imgFoto',TYPES.Image,Usuario_imgFoto) 
          try {
            conection.callProcedure(query2);
        } catch (error) {
            console.log("error en la conexión");
        }
        }
        })
      try {
          conection.callProcedure(query);
      } catch (error) {
          console.log("error en la conexión: ", error.message);
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