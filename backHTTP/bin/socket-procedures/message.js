const { Socket } = require('socket.io');
const {Request,TYPES}=require('tedious');
const enviroment = require('./enviroment');
const {io} = require("../../www");
const {sleep, isNull, userOnline} = enviroment;
module.exports.sendMessage= async (message, socket= Socket)=>{
    let conection = await require('../../conection');
    try {
      // console.log("trying to send: ", message);
        let query = new Request("RegisterNewMessage",async error=>{
            if(error){
                if (error.code === 'EINVALIDSTATE'|| error.code =="ESOCKET"){
                  console.log("error de conexión al enviar el mensaje: ");
                  try {
                    conection = await require("../../conection")
                    await sleep(5000);
                    conection.callProcedure(query);
                  } catch (errorConection) {
                    console.log("error de conexión al intentar reiniciar");
                  }
                }else{
                  console.log("error al enviar el mensaje: ", error.code);
                }
              }
        })
        let sendMessageId;
        query.on("row", row=>{
            // console.log("messageId: ", row);
            sendMessageId = row[0].value;
        })
        // query.on('', row=>{
        //   console.log("messageId: ", row);
        //     sendMessageId = row[0].value;
        // })
        // query.on("doneProc",()=>{
        //   // console.log("complete registration");
        //     // if(sendMessageId){
        //     //     socket.emit("sended-message", new Date());
        //     //     console.log("se envia el mensaje con codigo: ", sendMessageId);
        //     // }
        // })
        query.on("requestCompleted",()=>{
          if(sendMessageId){
            let data ={
              date: new Date(), 
              chatId: message.chatId, 
              message: message
            }
              socket.emit("sended-message", data);
              socket.emit("update-last-message", data)
              // console.log("se envia el mensaje con codigo: ", sendMessageId);
              let user = userOnline.find(usr=>usr.userId== message.to);
              if(user){
                // console.log("finded user: ", user);
                io.to(user.socket).emit("recive-message", message);
                io.to(user.socket).emit("update-last-reviced-message", message);
                // console.log("se envia el mensaje a ", user, "mensaje: ", message);
              }
          } 
        })
        query.addParameter("ChatId", TYPES.Int, message.chatId);
        query.addParameter("UserFrom",TYPES.Int, message.from );
        query.addParameter("UserTo", TYPES.Int, message.to);
        query.addParameter("Content", TYPES.NVarChar, message.content);
        conection.callProcedure(query);
    } catch (error) {
        console.log("error al enviar el mensaje: ", error);
    }
}