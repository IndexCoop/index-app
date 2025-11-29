import { getApiV2Protections } from '@/gen'

export async function getProtection(headers: Headers, address?: string) {
  const ipAddress =
    headers.get('cf-connecting-ip') ?? headers.get('x-forwarded-for')
  const ipCountry =
    headers.get('cf-ipcountry') ?? headers.get('x-vercel-ip-country')

  const res = await getApiV2Protections(
    { address },
    {
      headers: {
        ...(ipAddress && { 'ic-ip-address': ipAddress }),
        ...(ipCountry && { 'ic-ip-country': ipCountry }),
      },
    },
  )

  const { isForbiddenAddress, isNewUser, isRestrictedCountry, isUsingVpn } =
    res.data

  return {
    isForbiddenAddress,
    isNewUser,
    isRestrictedCountry,
    isUsingVpn,
  }
}
