import Script from 'next/script'

export const MavaScript = () => {
  if (process.env.NODE_ENV === 'development') {
    return null
  }

  return (
    <Script
      id='MavaWebChat'
      src='https://widget.mava.app'
      widget-version='v2'
      enable-sdk='false'
      data-token='3b991dd71883754f5d277d35cee1c9acf97229923e76ff349478ac8419142ccb'
    />
  )
}
