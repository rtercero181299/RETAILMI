
const {Socket} = require('socket.io');
const {Request, TYPES}=require('tedious');
const enviroment =require ('./enviroment')
const {io} = require('../../www');
let usersOnline = enviroment.userOnline;
let usersOffline = enviroment.userOffline;
const sleep = enviroment.sleep;
module.exports.cambioEstados=async (nuevoEstado, socket = Socket)=>{// async function cambiarEstados(nuevoEstado, socket = Socket)
  let conection = await require('../../conection');
  console.log("Recibi estado", nuevoEstado);
  try {
    const query = new Request("GetSupervisoresPorAgente", async(error)=>{
      if(error){
        if (error.code === 'EINVALIDSTATE'|| error.code =="ESOCKET"){
          console.log("error de conexión al consultar los supervisores por agente: ", nuevoEstado.idUsuario);
          await sleep(1000);
          try {
            conection = await require('../../conection');
            conection.callProcedure(query);
          } catch (errorConection) {
            console.log("error de conexión al intentar reiniciar");
          }
        }else{
          console.log("error en la supervisor por agente : "+ nuevoEstado.idUsuario+" error:", error.code);
        }
        // await sleep(1000);
        socket.emit("error");
      }else{
          // console.log("-----------------------ok ")
      }
    })

    //Parametro para SP GetSupervisoresPorAgente
    query.addParameter("UserId", TYPES.Int, nuevoEstado.idUsuario);

//arreglo que accede al id fila por fila 
    let supervisores =[]
    query.on("row", row=>{
      //ingresar cada supervisor en el arreglo
            supervisores.push(row[0].value);
            console.log("supervisor encontrado: ", row[0].value)
    })
    query.on("doneProc",()=>{
      console.log("termino desde el doneProc")
      supervisores.forEach((elem,index)=>{
        //buscar si esta en los usuarios en linea (función find en usersOnline)
        let userLine = usersOnline.find(userOnline => elem == userOnline.userId);
        /**
         * if isOnline
         *    io.to(elem.socket).emit("user-change-state", nuevoEstado)
         * 
         * 
         */
        if(userLine){
          console.log("Se envia mensaje a supervisor ", userLine, "nuevo: ", nuevoEstado)
          io.to(userLine.socket).emit("user-change-state", nuevoEstado)
        }
      })
      query.on("requestCompleted", ()=>{
        // console.log("termino")
        const camEst = new Request("CambiarEstado", async(error)=>{
          if(error){
            if (error.code === 'EINVALIDSTATE'|| error.code =="ESOCKET"){
              console.log("error de conexión al registrar los nuevos estados por usuario: ", usuario.userName);
              await sleep(1000);
              try {
                conection = await require('../../conection');
              } catch (errorConection) {
                console.log("error de conexión al intentar reiniciar");
              }
            }else{
              console.log("error al registrar estados: ", error);
            }
            await sleep(1000);
            socket.emit("error-registro");
          }
        })
//Parametros para registrar el nuevo estado en el procedimiento CambiarEstados
         camEst.addParameter("IdUsuario", TYPES.Int, nuevoEstado.idUsuario);
         camEst.addParameter("IdEstado", TYPES.Int, nuevoEstado.idEstado);
         camEst.addParameter("FechaInicio", TYPES.DateTime, nuevoEstado.fechaInicio);
          //Se devuelve un error si lo hay
          camEst.on("row", (row)=>{
            console.log(row)
          })
//Ejecución del procedimiento camEst
          conection.callProcedure(camEst)
      })
      
    })
    //Ejecución del procedimiento query
          conection.callProcedure(query)
  } catch (error) {
    console.log("Error ", error);
  }
}

module.exports.obtenerEstados = async (idUsuario, socket = Socket)=>{
  let conection = await require('../../conection');

  try {
    const query = new Request("GetTimes", async(error)=>{
      if(error){
        if (error.code === 'EINVALIDSTATE'|| error.code =="ESOCKET"){
          console.log("error de conexión al consultar los supervisores por agente: ", idUsuario);
          await sleep(1000);
          try {
            conection = await require('../../conection');
            conection.callProcedure(query);
          } catch (errorConection) {
            console.log("error de conexión al intentar reiniciar la conexión");
          }
        }else{
          console.log("error al consultar los tiempos : "+ idUsuario+" error:", error.code);
        }
        // await sleep(1000);
        // socket.emit("error");
      }else{
          console.log("se envian estados")
      }

    })

    let tiempos =[]
    query.on("row", row=>{
      const tiempo={
          idEstado : row[0].value,
          fechaInicio : row[1].value,
          nombre: row[2].value
      }
      tiempos.push(tiempo)
    })

    query.on("doneProc",()=>{
      // console.log("termino de enviar fechas", {tiempos: tiempos, idAgente: idUsuario})
      socket.emit("fechas-enviadas", {tiempos: tiempos, idAgente: idUsuario})
    })

    conection.callProcedure(query);



    
    //Parametro para SP GetSupervisoresPorAgente
    query.addParameter("IdUsuario", TYPES.Int, idUsuario);
  } catch (error) {
    console.log(error)
  }
}
    
  