const { Asset } = require('./asset');
module.exports.Experience = class Experience {
    constructor(
        colorFondo = "",
        presentationImage = new Asset(),
        scannerButtonImage = new Asset(),
        openMenuButtonImage = new Asset(),
        closeMenuButtonImage = new Asset(),
        qrChatImage = new Asset(),
        qrPromotionImage = new Asset(),
        recipeButtonImage = new Asset(),
        promotionButtonImage = new Asset(),
        chatBotButtonImage = new Asset(),
        productos = [],
        recetas = [],
    ) {
        this.colorFondo = colorFondo;
        this.presentationImage = presentationImage;
        this.scannerButtonImage = scannerButtonImage;
        this.openMenuButtonImage = openMenuButtonImage;
        this.closeMenuButtonImage = closeMenuButtonImage;
        this.qrChatImage = qrChatImage;
        this.qrPromotionImage = qrPromotionImage;
        this.recipeButtonImage = recipeButtonImage;
        this.promotionButtonImage = promotionButtonImage;
        this.chatBotButtonImage = chatBotButtonImage;
        this.productos = productos;
        this.recetas = recetas;
    };
}