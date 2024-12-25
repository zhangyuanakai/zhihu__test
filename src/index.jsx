import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

//REM改变rem换算比例
import 'lib-flexible'

// 引入样式
import './index.less'

// antd-mobile
import { ConfigProvider } from 'antd-mobile'
import zhCN from 'antd-mobile/es/locales/zh-CN'

// 处理宽度
(function () {
  const handleMax = function handleMax() {
    let html = document.documentElement,
      root = document.getElementById('root'),
      size = parseFloat(html.style.fontSize)
    root.style.maxWidth = '750px'
    if (size >= 750) {
      html.style.fontSize = '75px'
    }
  }
  handleMax()
})()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <ConfigProvider locale={ zhCN }>
    <App />
  </ConfigProvider>
)
