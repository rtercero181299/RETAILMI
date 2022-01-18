/**
 * @author @AmelieCruz
 * url principal del server de API REST y WebSocket
 */
//export const urlAPI = "http://192.168.100.7:85";
export const urlAPI = "http://localhost:85";

/**
 * @author @AmelieCruz
 * Endpoints de la API REST
 */
export const API={
    UPLOAD_FILE: urlAPI +"/upload-file",
    GET_FILE: urlAPI+"/files",
    REGISTER_USER: urlAPI+"/register-user",
    MODIFY_USER: urlAPI+"/modify-user",
    DELETE_USER: urlAPI + "/delete-user",
    SEARCH_USERS: urlAPI + "/search-users",
    REGISTER_COMPANY : urlAPI + "/register-company",
    MODIFY_COMPANY: urlAPI + "/modify-company",
    DELETE_COMPANY: urlAPI + "/delete-company",
    SEARCH_COMPANY: urlAPI + "/search-company",
    LIST_VCC_VALUES: urlAPI+"/respuesta",
    LIST_CAMPANIA_VALUES: urlAPI+"/campania",
    LIST_SUPERVISOR_VALUES: urlAPI+"/supervisor",
    LIST_TIPOS_USUARIO_VALUES: urlAPI+"/tipos-usuario",
    LIST_ESTADOS_VALUES: urlAPI+"/estados",
    LIST_AGENTES: urlAPI + "/list-agentes",
    LIST_ALL_USERS: urlAPI + "/list-all-users",
    LIST_ALL_EXPERIENCES: urlAPI + "/list-all-experiences",
    LIST_SUPERVISORES: urlAPI + "/list-supervisores",
    GET_HISTORIC:  urlAPI + "/get-historical-times",
    VALIDAR_CP: urlAPI + "/validar-cp",
    REGISTER_EXPERIENCIA:  urlAPI + "/register-experience",
    MODIFY_EXPERIENCIA:  urlAPI + "/modify-experience",
    REGISTER_PRODUCT:  urlAPI + "/register-product",
    MODIFY_PRODUCT:  urlAPI + "/modify-product",
    
}