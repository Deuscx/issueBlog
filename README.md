# Issue Blog

## 快速开始
1. 更改配置 `src/config`
```js
module.exports =  {
    //用户名
    owner:'Deuscx',
    //仓库名
    repository: 'issueBlog',
    //指定markdown生成器
    docType: "dumi",    
}
```
2. 添加ACCESS_TOKEN 到github action中中

3. 根据issue的label设置为`dir:路径名`格式,实现自动生成
