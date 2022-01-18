const { Socket } = require('socket.io');
const {Request,TYPES}=require('tedious');
const enviroment = require('./enviroment');
const {io} = require("../../www");
const sleep = enviroment.sleep;
const isNull = enviroment.isNull;
module.exports.listChats = async (userId, socket = Socket)=>{
  let conection = await require('../../conection');
  let errorSolved = false;
  try {
        let chats = []
        const query = new Request("GetChatsPorUsuario", async(error)=>{
          if(error){
            if (error.code === 'EINVALIDSTATE'|| error.code =="ESOCKET"){
              console.log("error de conexión al consultar los chats del usuario: ", userId, "error:", error);
              await sleep(500);
              try {
                if(!errorSolved){
                  conection = await require("../../conection")
                  conection.callProcedure(query);
                }
              } catch (errorConection) {
                console.log("error de conexión al intentar reiniciar");
              }
            }else{
              console.log("error en la consultar los chats, error:", error.code);
              errorSolved = false;
            }
          }else{
            
          }
        })
        query.addParameter("UserId", TYPES.Int, userId);
        query.on("row", (row)=>{
          const chat = {
            id: row[0].value,
            lastMessage:{
              content: row[1].value,
              file: row[2].value,
              fecha: row[3].value,
              to: row[4].value,
              from: row[5].value,
              id: row[6].value
            },
            isOpened: row[7].value ===1,
            otherUser: row[8].value == userId? row[9].value: row[8].value
          }
          chats.push(chat);
          // console.log("envio chat a: ", userId, "chat: ", chat);
        })
        query.on("requestCompleted", (rowCount, more, rows)=>{
          const user = enviroment.userOnline.find(usr=>usr.socket == socket.id)
            console.log("se consultan correctamente los chats de ", userId, "chats: ", chats);
            socket.emit("list-chats", chats);
            errorSolved = true;
          
        })
        try {
          conection.callProcedure(query);
        } catch (error) {
            console.log("error en la conexión", error.message);
        }
      } catch (error) {
          console.log("error en la query");
        }
}
module.exports.openChat =async  (users, socket = Socket)=>{
    let conection = await require('../../conection');
    const to = users.to;
    const from = users.from;
    const socketTo = enviroment.userOnline?.find(user=>user.userId === to);
    // console.log("info open chat: ", users);
    if(isNull(from)){
        console.log("no se encuentra el usuario "+socket.id+" que envió el mensaje, ocurrió un error al crear el chat");
        console.log("users inscritos: ", enviroment.userOnline)
        socket.emit("error-on-create-chat")
        return 0;
    }
    try {
      const query = new Request("OpenChat", async(error)=>{
        if(error){
          if (error.code === 'EINVALIDSTATE'|| error.code =="ESOCKET"){
            console.log("error de conexión al abrir el chat de los usuarios: ", to, ", ", from);
            await sleep(1000);
            try {
              conection = await require("../../conection")
              conection.callProcedure(query);
            } catch (errorConection) {
              console.log("error de conexión al intentar reiniciar");
            }
          }else{
            console.log("error en la consulta al abrir el chat de los usuarios: ", to, ", ", from," error:", error.code);
          }
          await sleep(600);
          socket.emit("error-open-chat");
        }else{
          console.log("se abre correctamente el chat");
        }
      })
      query.addParameter("User1", TYPES.Int, from);
      query.addParameter("User2", TYPES.Int, to);
      query.on("row", async (row)=>{
        // console.log("chat abierto: ", row[0].value);
        socket.emit("chat-opened", {id: row[0].value, from: from, to:to});
        socket.emit("update-chats-list");
        if(!isNull(socketTo)){
            io.to(socketTo.socket).emit("update-chats-list");
        }
    })
      try {
          conection.callProcedure(query);
      } catch (error) {
          console.log("error en la conexión", error.message);
      }
    } catch (error) {
        console.log("error en la query");
      }
}
module.exports.getChatMessages=  async(chatId, socket = Socket)=>{
  let conection = await require("../../conection") 
  try {
    let query = new Request("GetChat", async error=>{
      if(error){
        if (error.code === 'EINVALIDSTATE'|| error.code =="ESOCKET"){
          console.log("error de conexión al obtener los mensajes del chat", chatId);
          await sleep(1000);
          try {
            conection = await require("../../conection")
            conection.callProcedure(query);
          } catch (errorConection) {
            console.log("error de conexión al intentar reiniciar");
          }
        }else{
        await sleep(500);
      }
    }else{
      console.log("se enviaron los mensajes del chat: ", chatId)
    }
    })
      let messages = []
      query.on("row", row=>{
        const message = {
          id: row[0].value,
          content: row[1].value,
          file: row[2].value,
          fecha: row[3].value,
          to: row[4].value,
          from: row[5].value,
          chatId: row[6].value,
          isOpened: row[7].value == 1
        }
        messages.push(message);
      })
      query.on("doneProc", ()=>{
        const chatMessages ={
          chatId : chatId,
          messages: messages
        }
        // console.log("se envían los mensages del chat: ", chatId, "mensajes: ", chatMessages);
        socket.emit("update-chat-messages-list", chatMessages);
      })
      query.addParameter("ChatId", TYPES.Int, chatId);
      try {
        conection.callProcedure(query);
    } catch (error) {
        console.log("error en la conexión: ", error.message);
    }
  } catch (error) {
    
  }
}