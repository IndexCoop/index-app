import React from 'react'
import { Outlet } from 'react-router-dom'
import { useConnect } from 'wagmi'

import Footer from 'components/page/Footer'
import Header from 'components/page/header/Header'
import { ledgerConnector } from 'utils/wagmi'
import { useLedgerStatus } from 'hooks/useLedgerStatus'

const App = () => {
    const { connectAsync, isIdle} = useConnect()
    const { isRunningInLedgerLive } = useLedgerStatus()

    React.useEffect(() => {
        if(!isIdle || !isRunningInLedgerLive) return
        console.log('connecting to ledger')
        connectAsync({ connector: ledgerConnector as any }).catch((error) => {
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
