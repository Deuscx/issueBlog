const {getIssues,test,getNextIssues} = require('./issue.js');
const client = require('../request')

const search = (params) => client.query({
    query: getIssues,
    variables: params})

const searchNext = (params)=>client.query({query: getNextIssues, variables: params})
const testReq = ()=>client.query({query: test})

module.exports = { search,searchNext,testReq}
 