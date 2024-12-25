import React, { Suspense } from 'react'
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams
} from 'react-router-dom'

import routes from './routes'
import { DotLoading, Mask } from 'antd-mobile'

const Element = (props) => {
  let { component: Component, meta } = props

  //修改页面TITLE
  let { title = '知乎日报-aaa' } = meta || {}
  document.title = title

  //获取路由信息，基于属性传递给组件
  const navigate = useNavigate(),
    location = useLocation(),
    params = useParams(),
    [usp] = useSearchParams()

  return <Component navigate={ navigate }
                    location={ location } params={ params } usp={ usp } />
}

export default function RouterView() {

  return <Suspense fallback={ <Mask visible={ true }>
    <DotLoading color="white"></DotLoading>
  </Mask> }>
    <Routes>
      { routes.map(item => {
        let { path, name } = item
        return <Route path={ path } element={ <Element{ ...item } /> } key={ name } />
      }) }
    </Routes>
  </Suspense>
}