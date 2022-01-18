
const {Request} = require('tedious');
module.exports.sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
module.exports.isNull = (variable)=>{
    return variable === [] || variable === null || variable ==={} || variable  === undefined;
}
module.exports.userOnline = [];
module.exports.userOffline = [];
module.exports.chargueUsers = async ()=>{
    let conection = await require("../../conection");
      const query = new Request("ConsultarUsuarios", async(error)=>{
        if(error){
          if (error.code === 'EINVALIDSTATE'|| error.code =="ESOCKET"){
              console.log("error de conexión al hacer la consulta de todos los usuarios: ", error.message);
              await module.exports.sleep(5000);
              conection = await require('../../conection');
              conection.callProcedure(query);
            }else{
              console.log("error en la consulta de usuarios generales, error:", error);
            }
            await module.exports.sleep(1000);
          }else{
            console.log("se consultan correctamente los usuarios");
          }
        })
        query.on("row", (row)=>{
            const user = {
              userId: row[0].value,
              userName: row[1].value, 
              userFullName : row[2].value,
              vccId: row[3].value,
              campaniaId: row[4].value,
              supervisorId: row[5].value, 
              userPhoto: row[6].value, 
              tipoUsuario: row[7].value,
              socket: undefined
            };
            if(!module.exports.userOnline?.some(usr=>usr.userId == user.userId)){
              module.exports.userOffline.push(user);
            }
        })
        try {
            conection.callProcedure(query);
        } catch (error) {
            console.log("error en la conexión: ", error.message);
        }
  }
  
  (()=>module.exports.chargueUsers())();