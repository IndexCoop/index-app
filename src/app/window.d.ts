export declare global {
  interface Window {
    safary?: {
      track: (args: {
        eventType: string
        eventName: string
        parameters?: { [key: string]: string | number | boolean }
      }) => void
    }
  }
}
