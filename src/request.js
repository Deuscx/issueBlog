//https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/#using-apollo-client-without-react 如何原生js使用
//https://github.com/lquixada/cross-fetch/issues/80#issuecomment-755760262 
const fetch = require('cross-fetch');
const { ApolloClient, InMemoryCache,HttpLink,from ,ApolloLink } =require('@apollo/client/core') ;
const { onError } =require("@apollo/client/link/error");

const isDev = process.env.NODE_ENV === 'development';

/* 
const nameToGreet = core.getInput('token');
*/
let token ;
if(isDev){
  require('dotenv').config()
  token = process.env.TOKEN;
}else{
  token = process.env.TOKEN;
}

const Middleware = new ApolloLink((operation, forward) => {
    // request时对请求进行处理
    console.log(`starting request for ${operation.operationName}`);
    return forward(operation);
  })
  const Afterware = new ApolloLink((operation, forward) => {
    return forward(operation).map(response => {
      // 服务器返回数据
      console.log('Afterware--response', response)
      return response
    })
  })
  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
    return forward(operation);
  });
   
  const httpLink = new HttpLink({
    uri: 'https://api.github.com/graphql', // 配置请求url 
    headers: {                             // 配置header
      Authorization: `Bearer ${token}`
    },
    fetch
  })

  const cache = new InMemoryCache()       // 缓存
  module.exports = new ApolloClient({
    //通过一组link，用于定义行为 
    //https://www.apollographql.com/docs/react/api/link/introduction/#composing-a-link-chain
    link: from([Middleware,httpLink]),
    cache
  })
  