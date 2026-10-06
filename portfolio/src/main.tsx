import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const App = lazy(() => import('./App.tsx'))
const DemoApp = lazy(() => import('./demos/DemoApp.tsx').then((module) => ({ default: module.DemoApp })))

const isDemo = window.location.pathname.startsWith('/demos/')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div className="site-loading" role="status">LEONARD/SOLUTIONS</div>}>
      {isDemo ? <DemoApp /> : <App />}
    </Suspense>
  </StrictMode>,
)
