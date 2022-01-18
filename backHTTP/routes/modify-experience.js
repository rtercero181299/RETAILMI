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
        const{
            nombre,
            id,
            colorFondo,
            idUsuario
        } = req.body
        console.log("body", req.body);
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
        if (files['imgPresentacion'] && files['imgPresentacion'][0]?.originalname) {
            const { originalname, filename } = files['imgPresentacion'][0];
            console.log("imgPresentacion from file: ", originalname);
            imgPresentacion = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        } else if (req.body.imgPresentacion) {
            imgPresentacion = req.body.imgPresentacion.split('/');
            console.log("imgPresentacion from string: ",imgPresentacion);
            imgPresentacion = imgPresentacion[imgPresentacion.length-1]
        }
        if (files['imgBotonScanner'] && files['imgBotonScanner'][0]?.originalname) {
            const { originalname, filename } = files['imgBotonScanner'][0];
            console.log("imgBotonScanner from file: ", originalname);
            imgBotonScanner = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        } else if (req.body.imgBotonScanner) {
            imgBotonScanner = req.body.imgBotonScanner.split('/');
            console.log("imgBotonScanner from string: ",imgBotonScanner);
            imgBotonScanner = imgBotonScanner[imgBotonScanner.length-1]
        }
        if (files['imgQrChat'] && files['imgQrChat'][0]?.originalname) {
            const { originalname, filename } = files['imgQrChat'][0];
            console.log("imgQrChat from file: ", originalname);
            imgQrChat = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        } else if (req.body.imgQrChat) {
            imgQrChat = req.body.imgQrChat.split('/');
            console.log("imgQrChat from string: ",imgQrChat);
            imgQrChat = imgQrChat[imgQrChat.length-1]
        }
        if (files['imgQrPromo'] && files['imgQrPromo'][0]?.originalname) {
            const { originalname, filename } = files['imgQrPromo'][0];
            console.log("imgQrPromo from file: ", originalname);
            imgQrPromo = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        } else if (req.body.imgQrPromo) {
            imgQrPromo = req.body.imgQrPromo.split('/');
            console.log("imgQrPromo from string: ",imgQrPromo);
            imgQrPromo = imgQrPromo[imgQrPromo.length-1]
        }
        if (files['imgBtnOpen'] && files['imgBtnOpen'][0]?.originalname) {
            const { originalname, filename } = files['imgBtnOpen'][0];
            console.log("imgBtnOpen from file: ", originalname);
            imgBtnOpen = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        } else if (req.body.imgBtnOpen) {
            imgBtnOpen = req.body.imgBtnOpen.split('/');
            console.log("imgBtnOpen from string: ",imgBtnOpen);
            imgBtnOpen = imgBtnOpen[imgBtnOpen.length-1]
        }
        if (files['imgBtnClose'] && files['imgBtnClose'][0]?.originalname) {
            const { originalname, filename } = files['imgBtnClose'][0];
            console.log("imgBtnClose from file: ", originalname);
            imgBtnClose = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        } else if (req.body.imgBtnClose) {
            imgBtnClose = req.body.imgBtnClose.split('/');
            console.log("imgBtnClose from string: ",imgBtnClose);
            imgBtnClose = imgBtnClose[imgBtnClose.length-1]
        }
        if (files['imgBtnRecetas'] && files['imgBtnRecetas'][0]?.originalname) {
            const { originalname, filename } = files['imgBtnRecetas'][0];
            console.log("imgBtnRecetas from file: ", originalname);
            imgBtnRecetas = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        } else if (req.body.imgBtnRecetas) {
            imgBtnRecetas = req.body.imgBtnRecetas.split('/');
            console.log("imgBtnRecetas from string: ",imgBtnRecetas);
            imgBtnRecetas = imgBtnRecetas[imgBtnRecetas.length-1]
        }
        if (files['imgBtnChatBot'] && files['imgBtnChatBot'][0]?.originalname) {
            const { originalname, filename } = files['imgBtnChatBot'][0];
            console.log("imgBtnChatBot from file: ", originalname);
            imgBtnChatBot = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        } else if (req.body.imgBtnChatBot) {
            imgBtnChatBot = req.body.imgBtnChatBot.split('/');
            console.log("imgBtnChatBot from string: ",imgBtnChatBot);
            imgBtnChatBot = imgBtnChatBot[imgBtnChatBot.length-1]
        }
        if (files['imgBtnPromocion'] && files['imgBtnPromocion'][0]?.originalname) {
            const { originalname, filename } = files['imgBtnPromocion'][0];
            console.log("imgBtnPromocion from file: ", originalname);
            imgBtnPromocion = originalname
            try {
                const fileBefore = path.join(rootFile, filename)
                const fileAfter = path.join(rootFile, originalname)
                fs.renameSync(fileBefore, fileAfter);
            } catch (errorFile) {

            }
        } else if (req.body.imgBtnPromocion) {
            imgBtnPromocion = req.body.imgBtnPromocion.split('/');
            console.log("imgBtnPromocion from string: ",imgBtnPromocion);
            imgBtnPromocion = imgBtnPromocion[imgBtnPromocion.length-1]
        }
        console.log("files names: ", imgPresentacion,
            imgBotonScanner,
            imgQrChat,
            imgQrPromo,
            imgBtnOpen,
            imgBtnClose,
            imgBtnRecetas,
            imgBtnChatBot,
            imgBtnPromocion);
        const query2 = new Request("ModificarExperiencia", async (error) => {
            if (error) {
                try {
                    if (error.message.includes("SentClientRequest")) {
                        res.send({ result: "error-several-clicks" })
                    } else {
                        res.send({ result: "error" });
                    }
                } catch (error) {

                }
                console.log("error al modificar los datos: ", error);

            } else {
                console.log("se modificó la experiencia");
                res.send({ result: "correcto" })
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
        query2.addParameter('ExperienciaId', TYPES.Int, parseInt(id));
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