export const IndexApiBaseUrl = 'https://api.indexcoop.com'

export function getApiKey(): string {
  return process.env.REACT_APP_INDEX_COOP_API ?? ''
}
