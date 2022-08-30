import { Outlet } from 'react-router-dom'

import Footer from 'components/page/Footer'
import Header from 'components/page/header/Header'

const App = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default App
