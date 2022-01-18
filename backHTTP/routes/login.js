var express = require('express');
var router = express.Router();
const {Request, TYPES} = require("tedious");
const conection = require("../conection");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Request-Method');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    try{
        const body = req.body
        const NombreUsuario = body.userName
        const Password = body.password

        const query = new Request("ConsultarUsuario",async (error)=>{
            if(error){
                console.log("Se registro un error:"+error)
            }else{
                console.log("Se inicio Session")
            }
        })
        query.addParameter("nombreUsuario",TYPES.NVarChar,NombreUsuario)
        query.addParameter("password",TYPES.NVarChar,Password)
        try {
            conection.then(response=>{
                response.callProcedure(query);
            }, (err)=>{
                if(err){
                     console.log("error al ejecutar el procedure de login");
                    }
            })
        } catch (error) {
            console.log("error en la conexión");
        }

    }catch(error){
    console.log("Se registro un error:"+error)
    }

});

router.options("/",(req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  
    next();
  });
  module.exports = router;