export async function getProtection(headers: Headers, address?: string) {
  const path = address
    ? `/v2/protections?${new URLSearchParams({ address }).toString()}`
    : '/v2/protections'
  const url = `https://api.indexcoop.com${path}`
  const res = await fetch(url, {
    headers: {
      ...headers,
      'ic-ip-address':
        headers.get('cf-connecting-ip') ??
        headers.get('x-forwarded-for') ??
        undefined,
      'ic-ip-country':
        headers.get('cf-ipcountry') ??
        headers.get('x-vercel-ip-country') ??
        undefined,
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
