const { Asset } = require("./asset");

module.exports.Product = class Product {
    constructor(
        presentationImage = new Asset(),
        promotionalVideo = new Asset(),
        name = "",
        code = ""
    ) {
        this.presentationImage = presentationImage;
        this.promotionalVideo = promotionalVideo;
        this.name = name;
        this.code = code;
    }
}