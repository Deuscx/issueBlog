const path = require('path');
const fs = require('fs-extra');

const rootPath = path.join(__dirname,'../../');
const timeFilePath = path.resolve(rootPath,"cacheTime.json")
exports.rootPath = rootPath;
/**
 * 获取 文档的时间文件
 */
exports.getTimeFile = ()=>{
    fs.ensureFileSync(timeFilePath);
    try {
        return fs.readJsonSync(timeFilePath) 
    } catch (error) {
        fs.writeJsonSync(timeFilePath,{})
        return {};
    }
 
}

/**
 * 写入issue文档的时间文件
 * @param {Object} content 
 */
exports.writeTimeFile = (content)=>{
    try {
        fs.writeJsonSync(timeFilePath,content)
    } catch (error) {
        throw new Error("写入json文件出错")
    }
}

/**
 * 将issues的url转换为id
 * @param {String} url 
 */
exports.normalizeUrlToId = (url)=>{
    const regex = new RegExp(`\\d+$`);
    return url.match(regex)[0];
}


