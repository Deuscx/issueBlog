const BaseMd = require("./baseModule");

module.exports =  class VuePressMd extends BaseMd{
    constructor({name='vuePress',packageName='vuepress'}){
        super({name,packageName});

    }


}