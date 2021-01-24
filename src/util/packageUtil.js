const execa = require('execa');

/**
 * 
 * @param {String} command 
 * @param {String[]} args 
 * @param {String} cwd  子进程的当前工作目录
 */
exports.executeCommand = (command,args,cwd)=>{

    return new Promise((resolve, reject) => {
        const child = execa(command,args,{
            cwd,
            stdio: ['inherit','inherit','inherit']
        });

        child.on('close',code=>{
            if(code !== 0){
                reject(new Error(`command failed: ${command} ${args.join('')}`))
            }
            resolve()
        })
    });
}