import React from 'react'
import { Outlet } from 'react-router-dom'
import { useConnect } from 'wagmi'

import Footer from 'components/page/Footer'
import Header from 'components/page/header/Header'
import { ledgerConnector } from 'utils/wagmi'

const App = () => {
    const { connectAsync } = useConnect()

    React.useEffect(() => {
        console.log('connecting to ledger')
        connectAsync({ connector: ledgerConnector as any }).then((result) => {
            alert('connected to ledger: ' + result.toString())
        }).catch((error) => {
            alert('error connecting to ledger: ' + error.toString())
        })
    }, [])

    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}

export default App
