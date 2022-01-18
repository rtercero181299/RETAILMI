var express = require('express');
var router = express.Router();
const { Request, TYPES } = require("tedious");
const { sleep } = require('../bin/socket-procedures/enviroment')
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
router.post('/', async (req, res) => {
    let conection = await require("../conection");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    try {
        const {
            nombre,
            acronimo,
            kams,
            rfc,
            direccion,
            telefonos,
            emails,
            idAdmin,
            polizasAgentes,
            polizasSupervisores,
            polizasAdministradores
        } = req.body;
        const query = new Request("ConsultarExisteVCC", async (error) => {
            if (error) {
                if (error.code === 'EINVALIDSTATE' || error.code == "ESOCKET") {
                    console.log("error de conexión al hacer la existencia del VCC: ", user);
                    await sleep(1000);
                    try {
                        conection = await require('../../conection');
                        await sleep(500)
                        conection.callProcedure(query);
                    } catch (errorConection) {  
                        console.log("error de conexión al intentar reiniciar");
                    }
                } else {
                    console.log("error en la consulta del VCCx : " + user + " error:", error.code);
                }
                await sleep(1000);
            }
        })
        query.addParameter("Nombre", TYPES.NVarChar, nombre);
        let userResp;
        query.on("row", (row) => {
            userResp = row[0].value
        })
        query.on("requestCompleted", () => {
            if (userResp) {
                res.send({ result: "user-exist" })
            } else {
                const query2 = new Request("RegistrarVcc", async (error) => {
                    if (error) {
                        try {
                            if (error.message.includes("SentClientRequest")) {
                                res.send({ result: "error-several-clicks" })
                            } else {
                                res.send({ result: "error" });
                            }
                        } catch (error) {

                        }
                        console.log("error en la insercion de datos: ", error);

                    } else {
                        try {
                            res.send({ result: "correcto" })
                        } catch (error) {

                        }
                        console.log("se creo el registro");


                    }
                })
                query2.addParameter('Nombre', TYPES.NVarChar, nombre);
                query2.addParameter('Acronimo', TYPES.NVarChar, acronimo);
                query2.addParameter('RFC', TYPES.NVarChar, rfc);
                query2.addParameter('Direccion', TYPES.NVarChar, direccion)
                query2.addParameter('Telefonos', TYPES.NVarChar, telefonos.join('|'))
                query2.addParameter('Emails', TYPES.NVarChar, emails.join('|'));
                query2.addParameter('Kams', TYPES.NVarChar, kams.join('|'));
                query2.addParameter('PolizasAgentes', TYPES.Int, polizasAgentes);
                query2.addParameter('PolizasSupervisores', TYPES.Int, polizasSupervisores);
                query2.addParameter('PolizasAdministradores', TYPES.Int, polizasAdministradores);
                query2.addParameter('IdUsuario', TYPES.Int, idAdmin);
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


    } catch (error) {
        console.log("Se produjo un error:" + error)
    }

});

router.options("/", (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});
module.exports = router;