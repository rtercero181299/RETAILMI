const { Asset } = require("./asset");

module.exports.Recipe = class Recipe {
    constructor(
        presentationImage = new Asset(),
        name = ""
    ) {
        this.presentationImage = presentationImage;
        this.name = name;
    }
}