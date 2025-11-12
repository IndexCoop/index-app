export async function getProtection(headers: Headers, address?: string) {
  const path = address
    ? `/v2/protections?${new URLSearchParams({ address }).toString()}`
    : '/v2/protections'
  const url = `https://api.indexcoop.com${path}`

  const ipAddress =
    headers.get('cf-connecting-ip') ?? headers.get('x-forwarded-for')
  const ipCountry =
    headers.get('cf-ipcountry') ?? headers.get('x-vercel-ip-country')

  const res = await fetch(url, {
    headers: {
      ...Object.fromEntries(headers.entries()),
      ...(ipAddress && { 'ic-ip-address': ipAddress }),
      ...(ipCountry && { 'ic-ip-country': ipCountry }),
    },
  })
  const { isForbiddenAddress, isNewUser, isRestrictedCountry, isUsingVpn } =
    await res.json()

  console.log({
    isForbiddenAddress,
    isNewUser,
    isRestrictedCountry,
    isUsingVpn,
  })

  return {
    isForbiddenAddress,
    isNewUser,
    isRestrictedCountry,
    isUsingVpn,
  }
}
