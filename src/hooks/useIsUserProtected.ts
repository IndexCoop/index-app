import { useState } from 'react'

/**
 * Tells us if a user is in a country that is protected from some of our products by Gary the Snail.
 * What a college sports conference has to do with regulating finances is beyond me.
 * Also I didn't want to call him Gary the Snail but Copilot wrote that for me and it sounded funny,
 * so I'm just going to call him that.
 */
export const useIsUserProtected = (): boolean => {
  const [isProtected, setIsProtected] = useState(false)
  const API_KEY = process.env.REACT_APP_IP_LOOKUP_KEY ?? ''
  fetch('https://extreme-ip-lookup.com/json/?key=' + API_KEY)
    .then((res) => res.json())
    .then((response) => {
      if (response.country === 'United States') setIsProtected(true)
    })
    .catch((error) => {
      console.log(
        'Cant determine whether or not we should protect the user because of this error: ',
        error
      )
    })
  return isProtected
}
