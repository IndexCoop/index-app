export const IndexApiBaseUrl =
  process.env.NODE_ENV === 'development' ? '' : 'https://api.indexcoop.com'

export function getApiKey(): string {
  return process.env.REACT_APP_INDEX_COOP_API ?? ''
}
