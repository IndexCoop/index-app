import { ExportToCsv } from 'export-to-csv'

export const exportCsv = (
  data: any,
  filename: string,
  headers: string[] = []
) => {
  const options = {
    fieldSeparator: ',',
    filename,
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: headers.length === 0,
    headers,
  }

  const csvExporter = new ExportToCsv(options)
  const csv = csvExporter.generateCsv(data, true)
  return csv
}
