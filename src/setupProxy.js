const {createProxyMiddleware}=require('http-proxy-middleware')

module.exports=function (app) {
  app.use(
    createProxyMiddleware("/api",{
      target:'http://127.0.0.1:7070',
      // target:'http://10.0.55.227:4100',
      changeOrigin:true,
      ws:true,
      pathRewrite:{'^/api':""}
    })
  )
}