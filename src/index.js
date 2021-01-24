
const { testReq,search,searchNext } = require("./api/index");
const { getTimeFile,normalizeUrlToId,writeTimeFile } = require('./util/fileUtils');
const userOptions = require('./config/index');
const mds = require('./md/index');
(async function() {
    //获取配置
    const appOptions = Object.assign(userOptions);

    let totalIssues = []
    let res =  await search({
        owner: appOptions.owner,
        name: appOptions.repository
    });

    let {pageInfo, nodes} = res.data.repository.issues

    totalIssues = totalIssues.concat(nodes);

    while(pageInfo.hasNextPage){
        let res = await searchNext({
            owner: appOptions.owner,
            name: appOptions.repository,
            cursor:  pageInfo.endCursor
        });
        pageInfo = res.data.repository.issues.pageInfo;
        nodes = res.data.repository.issues.nodes;
        totalIssues = totalIssues.concat(nodes);
    } 

    //1.判断需要写入的文件
    let timeJson = getTimeFile();
    let needUpdateMds = []
    //如果之前有记录
    if(timeJson?.issues){
        //比对判断是否有需要更新的issues,只更新需要更新的issues
        needUpdateMds = totalIssues.filter(({updatedAt,url})=>{
            return new Date(updatedAt) > new Date(timeJson.issues[normalizeUrlToId(url)])
        })
    }else{
        needUpdateMds = totalIssues;
    }

     if(!needUpdateMds.length) {
         console.log('无需更新');
         return;
     }
    //2.写入需要生成的文件
    //选择指定doc的生成器
    const mdClass =  mds[appOptions.docType];
    const mdModule = new mdClass()
    await mdModule.run({issues: needUpdateMds});

    //3.记录写入的文件
    timeJson.issues = totalIssues.map(({updatedAt,url})=>({ [normalizeUrlToId(url)]: updatedAt}))
    writeTimeFile(timeJson);
})() 