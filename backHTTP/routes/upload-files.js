var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: './public/files' })
const fs = require("fs");
const path = require("path");
const {Request, TYPES} = require("tedious");
const {sleep}= require('../bin/socket-procedures/enviroment') 
router.post('/',upload.single("fileUploaded"),  async (req, res)=>{
    let conection = await require("../conection");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Request-Method');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    const encoded = path.join(__dirname,"..","public", "files", req.file.filename);
    const original = path.join(__dirname,".." ,"public", "files", req.file.originalname);
    try{
        fs.renameSync(encoded, original);
        try {
            const body = req.body;
            // console.log("recived file data: ", body)
            const chatId = body.chatId;
            const userFrom = body.userFromId;
            const userTo = body.userToId;
            const fileName = body.fileName;
            const routeFileName =  req.file.originalname;
            const query = new Request("RegisterNewMessage", async(error)=>{
              if(error){
                console.log("error en la consulta: ", error);
                // res.status(500);
                // res.sendStatus(500);
                let conection = await require("../conection");
                await sleep(1000);
                conection.callProcedure(query);
              }else{
                console.log("se envió el mensaje");
              }
            })
            query.addParameter("ChatId", TYPES.Int, chatId);
            query.addParameter("UserFrom", TYPES.Int, userFrom);
            query.addParameter("UserTo", TYPES.Int, userTo);
            query.addParameter("Content", TYPES.NVarChar, fileName);
            query.addParameter("File", TYPES.NVarChar, routeFileName);
            let messageId;
            query.on("row", (row)=>{
                messageId = row[0].value;
            })
            query.on("doneProc", async (row)=>{
                const {io} = require("../bin/www");
                const {userOnline, isNull, sleep} = require("../bin/socket-procedures/enviroment");
                const socket = userOnline.find(usr=>usr.userId == userTo);
                const socketFrom = userOnline.find(user=>user.userId == userFrom);
                
                let message ={
                    chatId: chatId,
                    content: fileName,
                    file: routeFileName, 
                    from: userFrom,
                    to: userTo,
                    fecha: new Date()
                }
                const data={
                    date: new Date(),
                    chatId: chatId,
                    fileName: fileName,
                    message: message
                }
                if(socketFrom){
                    io.to(socketFrom.socket).emit("sended-message",data)
                    io.to(socketFrom.socket).emit("update-last-message",data)
                    console.log("se envió el mensaje y confirmación de envío a ",socketFrom, "con data: ", data);
                }
                if(!isNull(socket)){
                    console.log("se manda aviso de cambio a : ", socket)
                    io.to(socket.socket).emit("recive-message", message);
                }
                res.status(200);
                res.sendStatus(200);
            })  
            try {
                conection.callProcedure(query);
            } catch (error) {
                console.log("error en la conexión");
            }
          } catch (error) {
              console.log("error en la query");
            }
    }catch(error){
        console.log("error al mover el archivo: ", error);
    }
})
router.options("/",(req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  
    next();
  });
module.exports = router;
