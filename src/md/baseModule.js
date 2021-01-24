
const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const {executeCommand} = require('../util/packageUtil');
const { rootPath} = require('../util/fileUtils')
const PACKAGE_MANAGER_CONFIG = {
    npm: {
        install: ['install', '--loglevel', 'error'],
        add: ['install', '--loglevel', 'error'],
        upgrade: ['update', '--loglevel', 'error'],
        remove: ['uninstall', '--loglevel', 'error']
      },
     yarn: {
        install: [],
        add: ['add'],
        upgrade: ['upgrade'],
        remove: ['remove']
      }
}
class BaseMd{
     constructor({name,packageName,version}={}){
        this.name = name || '';
        this.packageName = packageName || '';
        this.version = version || 'latest';
    }

    /**
     * 
     * @param {Array} issues 
     * @param {String} ctx  docs存储md的路径
     */
    async writeFiles({issues},ctx){
        if(!issues || !Array.isArray(issues)){
             throw new Error('issues 不存在')
        }
        this.packageName && await this.installPackage();

        const H1Regex = new RegExp(/#\s+/);
        for (let i = 0; i < issues.length; i++) {
            let {title,url,body,updatedAt,labels} = issues[i]
            let {data ,content} = matter(body);
            
            let fileName = this.setFilename({title,updatedAt}) || title;
            let dir = this.getDir({labels})
            let frontMatterObj = this.setFrontMatter({labels,data,dir,title}) || {};
         
            let dirPath = path.resolve(ctx , dir? dir: "issues");
            fs.ensureDirSync(dirPath)
            if(!H1Regex.test(content)){
                //如果不存在 h1,则添加
                content = `# ${title}\n${content}`
            }

            content = matter.stringify(content,frontMatterObj);

            fs.writeFileSync(path.resolve(dirPath,fileName)+".md",content);
        }
        
    }

    /**
     * 默认是以 title中的英文字符和时间戳构成
     * 设置每个md的文件名
     * @param {String} title 
     */
    setFilename({title,updatedAt}={}){
        const engTitle = title.replace(/[^\w]/g,"");
        const uniTime = new Date(updatedAt).getTime();
        return `${engTitle}-${uniTime}`
    }

    /**
     *  "dir:路径名" 多级路径通过 / 分割.
     * !注意路径名为英文
     * 默认根据 labels来生成dir
     * @param {*} param0 
     */
    getDir({labels}={}){
        let nodes = labels.nodes || []
        if(nodes.length){
          let dirLabel = nodes.find(({name})=>name.startsWith("dir:"));
          return dirLabel ? dirLabel.name.replace("dir:","") : ""
        }
        return "";
    }
    /**
     * 一般根据labels来设置或者原生的front-matter中的配置来生成
     * 设置每个md的 front-matter
     */
    setFrontMatter(){
        return false;
    }
    //生成原生blog配置
    generateBlogConfig(){

    }

    async installPackage(packages,bin='yarn'){
        await executeCommand(bin,[
            ...PACKAGE_MANAGER_CONFIG[bin].install,
            ...(packages || [])
        ],rootPath);
    }


    
}

module.exports = BaseMd;