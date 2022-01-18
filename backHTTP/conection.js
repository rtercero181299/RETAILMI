require("dotenv").config();
const {Connection} = require("tedious");
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

const self = module.exports;
let connection = undefined;
let isConnected = false;
let errorConnection=true;
let errorCont=0;

exports.initialize = async ()=>{
    errorConnection = true;
    isConnected = false;
    connection = undefined;
    while(errorConnection){
        await sleep(1000*(errorCont==0?0:errorCont<10?1:errorCont<20?2:3));
        if(!isConnected){
            const dbServer = process.env.DATABASE_SERVER;
            const dbUsername = process.env.DATABASE_USERNAME;
            const dbPassword = process.env.DATABASE_PASSWORD;
            const dbName = process.env.DATABASE_NAME;
            const config = {
                server: dbServer,
                authentication: {
                    type: 'default',
                    options: {
                        userName: dbUsername, //update me
                        password: dbPassword  //update me
                    }
                },
                options: {
                    // port: 51699,
                    database: dbName,
                    useUTC: false,
                    rowCollectionOnDone:true,
                    instancename: 'SQLEXPRESS',
                }
            }
            connection = new Connection(config);
            connection.on('connect', async function(err) {
                if(err) {
                    errorCont++;
                    console.log("error #",errorCont," al iniciar la conexión: "+ err.message);
                    console.log(err);
                    errorConnection = true;
                }else {
                    errorConnection = false;
                    isConnected = true;
                    console.log("Connected");  
                }
            });
            connection.on("error", async (error)=>{
                if(error){
                    console.log("error en la conexión: ", error);
                    await sleep(1000*2);
                    self.initialize();
                    errorConnection = true;
                    errorCont++;
                }else{
                    errorConnection = false;
                }
            })
            connection.connect();
            if(!errorConnection){
                errorConnection = false;
                return connection;
            }
            await sleep(1000);
        }else{
            errorConnection = false;
            return connection;
        }
    }
    errorConnection = false;
    return connection;
}
exports.getConection = async ()=>await exports.initialize();

module.exports = self.initialize();