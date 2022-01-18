export class Receta {
    constructor(
        id = 0,
        imgPresentacion = "",
        nombre = ""
    ){
        this.id = id;
        this.imgPresentacion = imgPresentacion;
        this.nombre = nombre;
    }
    equals(receta= new Receta()){
        if(receta.constructor.name!=="Receta") return false;
        return(receta.imgPresentacion === this.imgPresentacion&&
                receta.nombre=== this.nombre&&
                receta.id === this.id)
    }
}
export class Producto{
    constructor(
        id = 0,
        imgPresentacion = "",
        videoPromo = "",
        codigoBarras = "",
        nombre = ""
    ){
        this.id = id;
        this.imgPresentacion = imgPresentacion;
        this.videoPromo = videoPromo;
        this.codigoBarras = codigoBarras;
        this.nombre = nombre;
    }
    equals(producto= new Producto()){
        if(producto.constructor.name!=="Producto") return false;
        return(producto.imgPresentacion == this.imgPresentacion&&
            producto.nombre== this.nombre&&
            producto.id == this.id&&
            producto.videoPromo == this.videoPromo)
    }
}
export class Campania {
    constructor(
        id=0,
        nombre = "",
        imgPresentacion ="",
        imgBotonScanner = "",
        colorFondo="",
        imgQrChat = "",
        imgQrPromo = "",
        imgBtnOpen = "",
        imgBtnClose = "",
        imgBtnRecetas = "",
        imgBtnChatBot = "",
        imgBtnPromocion = ""
    ){

        this.id = id;
        this.nombre = nombre;
        this.imgPresentacion = imgPresentacion;
        this.imgBotonScanner = imgBotonScanner;
        this.colorFondo = colorFondo;
        this.imgQrChat = imgQrChat;
        this.imgQrPromo = imgQrPromo;
        this.imgBtnOpen = imgBtnOpen;
        this.imgBtnClose = imgBtnClose;
        this.imgBtnRecetas = imgBtnRecetas;
        this.imgBtnChatBot = imgBtnChatBot;
        this.imgBtnPromocion = imgBtnPromocion;
        this.productos = [];
        this.recetas = [];

    }
    equals(campania= new Campania()){
        if(campania.constructor.name!=="Campania") return false;
        return(campania.imgPresentacion === this.imgPresentacion&&
            campania.nombre=== this.nombre&&
            campania.id === this.id)
    }
}
const prueba = new Campania()
prueba.id = 1;
prueba.imgPresentacion ="https://www.emprender-facil.com/wp-content/uploads/2015/03/Cosas-curiosas-C%C3%B3mo-hacer-una-campa%C3%B1a-de-intriga-texto2.jpg";
prueba.imgBotonScanner="https://cdn.pixabay.com/photo/2013/07/12/18/40/button-153684_960_720.png";
prueba.imgQrPromo = "https://cdn.onlinewebfonts.com/svg/img_462691.png";
prueba.imgQrChat="https://cdn.onlinewebfonts.com/svg/img_462691.png";
prueba.imgBtnChatBot="http://images.wikia.com/rhcp/es/images/6/61/Bot%C3%B3n_azul.svg.png"
prueba.imgBtnPromocion="http://images.wikia.com/rhcp/es/images/6/61/Bot%C3%B3n_azul.svg.png"
prueba.imgBtnRecetas="http://images.wikia.com/rhcp/es/images/6/61/Bot%C3%B3n_azul.svg.png"
prueba.nombre = "Boing"
const producto = new Producto();
producto.id = 1;
producto.nombre="Guayaba";
producto.imgPresentacion="http://comercialsabu.com.mx/wp-content/uploads/2020/01/NRbotellavidrio237ml.png";
const receta = new Receta();
receta.imgPresentacion="https://okdiario.com/img/2020/01/23/estofado-de-ternera-con-anchoas.jpg";
receta.id = 1;
receta.nombre = "Jarrito";
prueba.productos=[
    producto
]
prueba.recetas=[receta]
export const campania = prueba;
