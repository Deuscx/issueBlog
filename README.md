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
2. 添加ACCESS_TOKEN 到github action中

https://github.com/settings/tokens =》 click **Personal access tokens** =》**Generate new token**

3. 根据issue的label设置为`dir:路径名`格式,实现自动生成



4. 在每次对issue进行编辑添加时，将会自动生成blog文章

最终生成：

![](https://gitee.com/deuscx/tuci/raw/master/img/20210125203732.png)

