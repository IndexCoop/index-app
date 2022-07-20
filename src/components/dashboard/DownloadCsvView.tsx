import React from 'react'

import { colors } from 'styles/colors'

import { Text } from '@chakra-ui/react'

interface DownloadCsvViewProps {
  onClickDownload: () => void
  downloadUrl: string
}

const DownloadCsvView = React.forwardRef<
  HTMLAnchorElement,
  DownloadCsvViewProps
>((props, ref) => (
  <>
    <Text
      cursor='pointer'
      style={{ color: colors.icBlue2 }}
      onClick={props.onClickDownload}
    >
      Download CSV
    </Text>
    <a hidden={true} download='index.csv' href={props.downloadUrl} ref={ref}>
      download
    </a>
  </>
))

// Needs to be set to avoid error
DownloadCsvView.displayName = 'DownloadCsvView'

export default DownloadCsvView
