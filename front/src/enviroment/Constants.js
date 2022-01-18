import { getHMSMSfromMls } from "./Methods";

/**
 * cantidad de horas laborables
 */
export const workHours = 9;
/**
 * hora de entrada
 * */
const deadLine = new Date();
deadLine.setHours(9,0,0,0);
/**hora 0 */
const timeZero = new Date();
timeZero.setHours(0,0,0,0)
const now = new Date();
/**Hora de salida del día actual */
export const outTime = new Date();
outTime.setHours(18,0,0,0);
/**
 * @author @AmelieCruz
 * Constantes de tiempo en mls
 */
export const segundo = 1000, minuto = segundo*60, hora = minuto *60;
/**
 * @author @AmelieCruz
 * Constante que define que hora se tomará de referencia para comenzar a contar el tiempo
 */
export const morning = now.getHours() < deadLine.getHours() ? timeZero: deadLine; 
/**
 * @author @AmelieCruz
 * constante que define las horas laborables
 */
export const worktime = new Date();
worktime.setHours(...getHMSMSfromMls(outTime.getTime()-morning.getTime()))