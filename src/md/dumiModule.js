const path =require('path');
const fs = require('fs-extra');
const ejs =require('ejs');
const BaseMd = require("./baseModule");
const {executeCommand} = require('../util/packageUtil');
const { rootPath} = require('../util/fileUtils');
const userConfig = require("../config/index")
const isPlainObject = (obj)=> obj !== null && typeof obj === 'object' && !Object.keys(obj).length
module.exports =  class DumiMd extends BaseMd{
    constructor({name}={name: 'dumi'}){
        super({name});
        this.docsRootDir = path.resolve(rootPath,'./docs')
        this.docsDir = path.resolve(this.docsRootDir,'./docs')
    }

    async beforeGenerate(){
       fs.ensureDirSync(this.docsRootDir);
       await executeCommand('yarn',["create","@umijs/dumi-app"], this.docsRootDir );
       fs.emptyDirSync( this.docsDir);
    }

    async afterGenerate(){
        //修改config配置
        const defaultConfig = {
            title: userConfig.repository,
            mode: 'site',
        }
        const userDocConfig = userConfig.docConfig ? userConfig.docConfig : {}
        const config = Object.assign(defaultConfig,{
            base: `/${userConfig.repository}`,
            publicPath: `/${userConfig.repository}/`,
        },userDocConfig)
        const content = fs.readFileSync(path.resolve(__dirname,"./dumiConfig/.umirc.ejs"),{encoding: "utf-8"});
        let renderData = ejs.render(content, {moreConfig: JSON.stringify(config,null,2)})
        //写入配置文件
        fs.writeFileSync(path.resolve(this.docsRootDir,".umirc.ts"),renderData);
        //生成md文件之后   
        await executeCommand('yarn',[], this.docsRootDir );
        await executeCommand("yarn",["run","docs:build"],this.docsRootDir);
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