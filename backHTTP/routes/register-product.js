var express = require('express');
var router = express.Router();
const { Request, TYPES } = require("tedious");
const { sleep } = require('../bin/socket-procedures/enviroment')
var multer = require('multer')
var upload = multer({ dest: './public/files' })
const fs = require('fs')
const path = require('path')
router.post('/', upload.fields(
    [
        { name: "imgPresentacion", maxCount: 1 },
        { name: "imgBotonScanner", maxCount: 1 },
        { name: "imgQrChat", maxCount: 1 },
        { name: "imgQrPromo", maxCount: 1 },
        { name: "imgBtnOpen", maxCount: 1 },
        { name: "imgBtnClose", maxCount: 1 },
        { name: "imgBtnRecetas", maxCount: 1 },
        { name: "imgBtnChatBot", maxCount: 1 },
        { name: "imgBtnPromocion", maxCount: 1 },
    ]
), async (req, res) => {
    let conection = await require("../conection");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    try {
        const {
            nombre,
            codigoBarras = "",
            idUsuario
        } = req.body;
        const { files } = req;
        let imgPresentacion = "",
            imgBotonScanner = "",
            imgQrChat = "",
            imgQrPromo = "",
            imgBtnOpen = "",
            imgBtnClose = "",
            imgBtnRecetas = "",
            imgBtnChatBot = "",
            imgBtnPromocion = "";
        const rootFile = path.join(__dirname, "..", "public", "files")
        if (files['imgPresentacion']) {
            const { originalname, filename } = files['imgPresentacion'][0];
            imgPresentacion = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        }
        if (files['imgBotonScanner']) {
            const { originalname, filename } = files['imgBotonScanner'][0];
            imgBotonScanner = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        }
        if (files['imgQrChat']) {
            const { originalname, filename } = files['imgQrChat'][0];
            imgQrChat = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        }
        if (files['imgQrPromo']) {
            const { originalname, filename } = files['imgQrPromo'][0];
            imgQrPromo = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        }
        if (files['imgBtnOpen']) {
            const { originalname, filename } = files['imgBtnOpen'][0];
            imgBtnOpen = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        }
        if (files['imgBtnClose']) {
            const { originalname, filename } = files['imgBtnClose'][0];
            imgBtnClose = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        }
        if (files['imgBtnRecetas']) {
            const { originalname, filename } = files['imgBtnRecetas'][0];
            imgBtnRecetas = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        }
        if (files['imgBtnChatBot']) {
            const { originalname, filename } = files['imgBtnChatBot'][0];
            imgBtnChatBot = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        }
        if (files['imgBtnPromocion']) {
            const { originalname, filename } = files['imgBtnPromocion'][0];
            imgBtnPromocion = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        }
        const query2 = new Request("RegistrarExperiencia", async (error) => {
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
                console.log("se creo el registro");
            }
        })
        query2.on('row', (row) => {
            if (row.length > 0) {
                res.send({ result: "correcto", idExperiencia: row[0].value })
            }
        })
        query2.addParameter('Nombre', TYPES.NVarChar, nombre);
        query2.addParameter('ImgPresentacion', TYPES.NVarChar, imgPresentacion);
        query2.addParameter('ImgBotonScanner', TYPES.NVarChar, imgBotonScanner);
        query2.addParameter('ColorFondo', TYPES.NVarChar, colorFondo);
        query2.addParameter('ImgQrChat', TYPES.NVarChar, imgQrChat);
        query2.addParameter('ImgQrPromo', TYPES.NVarChar, imgQrPromo);
        query2.addParameter('ImgBtnOpen', TYPES.NVarChar, imgBtnOpen);
        query2.addParameter('ImgBtnClose', TYPES.NVarChar, imgBtnClose);
        query2.addParameter('ImgBtnRecetas', TYPES.NVarChar, imgBtnRecetas);
        query2.addParameter('ImgBtnChatBot', TYPES.NVarChar, imgBtnChatBot);
        query2.addParameter('ImgBtnPromocion', TYPES.NVarChar, imgBtnPromocion);
        query2.addParameter('IdUsuario', TYPES.Int, parseInt(idUsuario));
        try {
            conection.callProcedure(query2);
        } catch (error) {
            console.log("error en la conexión");
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