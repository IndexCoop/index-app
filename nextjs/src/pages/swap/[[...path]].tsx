import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()
  console.log(router.query.path, 'path')
  return <h1>hello</h1>
}
