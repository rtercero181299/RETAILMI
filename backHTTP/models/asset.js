module.exports.Asset = class Asset {
    constructor(
        id = 0,
        name = "",
        asset = "",
        lastUpdateDateString = "",
        location = "",
        url = "",
        type = ""
    ) {
        this.id = id;
        this.name = name;
        this.asset = asset;
        this.lastUpdateDateString = lastUpdateDateString;
        this.location = location;
        this.url = url;
        this.type = type;
    }
}