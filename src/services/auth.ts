import { decodeJwt } from 'jose'
import { z } from 'zod'
import { parse } from 'cookie'

export const TokenUser = z.object({
  email: z.string(),
  sub: z.string(),
})

export type TokenUser = z.infer<typeof TokenUser>

export const getUser = ({ headers }: Request): TokenUser => {
  const cookieHeader = headers.get('Cookie')
  if (!cookieHeader) {
    throw new Error('Missing Cookie header')
  }
  const cookie = parse(cookieHeader)
  const cfAuthToken = cookie['CF_Authorization']
  const payload = decodeJwt(cfAuthToken)
  return TokenUser.parse(payload)
}
