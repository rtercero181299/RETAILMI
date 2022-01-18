var express = require('express');
var router = express.Router();
const { Request, TYPES } = require("tedious");
const { sleep } = require('../bin/socket-procedures/enviroment');
require('dotenv').config()

router.post('/', async (req, res) => {
    let conection = await require("../conection");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Request-Method');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    try {
        //Nombre del procedimiento "RegistrarUsuario"
        const query = new Request("GetAllExperiencias", async (error) => {
            if (error) {
                console.log("Se registro un error al consultar todos los agentes: " + error)
                conection = await require('../conection');
                await sleep(500)
                conection.callProcedure(query);
            } else {
                console.log("Se han consultado todos los agentes")
            }
        })

        let experiencias = []
        const {ACTUAL_URL,FILES_PATH} = process.env;
        query.on("row", (row) => {
            const experiencia = {
                id: row[0].value
                , nombre: row[1].value
                , imgPresentacion: ACTUAL_URL+FILES_PATH+row[2].value
                , imgBotonScanner: ACTUAL_URL+FILES_PATH+row[3].value
                , colorFondo: row[4].value
                , imgQrChat: ACTUAL_URL+FILES_PATH+row[5].value
                , imgQrPromo: ACTUAL_URL+FILES_PATH+row[6].value
                , imgBotonOpen: ACTUAL_URL+FILES_PATH+row[7].value
                , imgBotonClose: ACTUAL_URL+FILES_PATH+row[8].value
                , imgBotonRecetas: ACTUAL_URL+FILES_PATH+row[9].value
                , imgBotonChatBot: ACTUAL_URL+FILES_PATH+row[10].value
                , imgBotonPromocion: ACTUAL_URL+FILES_PATH+row[11].value
            };
            experiencias.push(experiencia)
        })

        query.on("doneProc", () => {
            res.send(experiencias)
        })


        //Pruebas de error
        try {
            conection.callProcedure(query);
        } catch (error) {
            console.log("error en la conexión:" + error)
        }
    } catch (error) {
        console.log("Se registro un error:" + error)
    }
});

router.options("/", (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});
module.exports = router;
