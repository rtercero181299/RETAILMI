/**
 * @author @AmelieCruz
 * Función que transforma una cantidad de milisgundos 
 * a una cadena con formato h:mm:ss
 * @param {Number} mls 
 * @returns {String} Cadena con formato 
 */
export const formatDateFromMls = (mls = 0) => {

    const horas = (mls / 3600000);
    const minutos = (mls % 3600000) / 60000;
    const segundos = ((mls % 3600000) % 60000) / 1000;
    if (isNaN(mls) || isNaN(parseInt(horas)) || isNaN(parseInt(minutos)) || isNaN(parseInt(segundos))) {
        console.log("mls: ", mls)
    }
    return (`${parseInt(horas)}:${parseInt(minutos)}:${parseInt(segundos)}`);

}
/**
 * @author @AmelieCruz
 * Convierte una cantidad de milisegundos a un array 
 * donde en [0] se encuentran las horas, [1] los minutos y 
 * [2] los segundos
 * @param {Number} mls 
 * @returns {Number[]} array de la conversión
 */
export const getHMSMSfromMls = (mls = 0) => {

    const horas = (mls / 3600000);
    const minutos = (mls % 3600000) / 60000;
    const segundos = ((mls % 3600000) % 60000) / 1000;
    // const milisegundos = mls - ((mls%3600000)%60000);
    if (isNaN(mls) || isNaN(parseInt(horas)) || isNaN(parseInt(minutos)) || isNaN(parseInt(segundos))) {
        console.log("mls: ", mls)
    }
    return [parseInt(horas), parseInt(minutos), parseInt(segundos)];

}

export const getDateDifference = (firstDay = new Date(), seconDay = new Date()) => {
    const diffTime = Math.abs(firstDay.getTime() - seconDay.getTime()); 
    console.log("mls of difference: ", diffTime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;

}