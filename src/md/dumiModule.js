const BaseMd = require("./baseModule");
const {executeCommand} = require('../util/packageUtil');
const { rootPath} = require('../util/fileUtils');
const path =require('path');
const fs = require('fs-extra');

const isPlainObject = (obj)=> obj !== null && typeof obj === 'object' && !Object.keys(obj).length
module.exports =  class DumiMd extends BaseMd{
    constructor({name}={name: 'dumi'}){
        super({name});
        this.docsRootDir = path.resolve(rootPath,'./docs')
        this.docsDir = path.resolve(this.docsRootDir,'./docs')
    }

    async beforeGenerate(){
       fs.ensureDirSync(this.docsRootDir);
       await executeCommand('yarn',["create","@umijs/dumi-lib"], this.docsRootDir );
       fs.emptyDirSync( this.docsDir);
    }

    async afterGenerate(){
        //生成md文件之后
        await executeCommand('yarn',[], this.docsRootDir );
        await executeCommand("yarn",["run","build"],this.docsRootDir);
    }

    async run({issues}){
        if(!fs.existsSync(this.docsRootDir)){
            //第一次创建
            await this.beforeGenerate();
        }
      
        await this.writeFiles({issues},this.docsDir);
        await this.afterGenerate();
    }

    setFrontMatter({labels,data,dir,title}){
       
        
        let obj =  Object.assign(data,{
            nav:{
                title: dir ? dir: "issues"
            }
        })
        
        if(title.length>9) {
            obj.title = title.slice(0,9)
        }

        return obj
    }
}