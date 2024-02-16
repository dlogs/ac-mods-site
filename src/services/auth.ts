import { decodeJwt } from 'jose'
import { z } from 'zod'

export const TokenUser = z.object({
  email: z.string(),
  sub: z.string(),
})

export type TokenUser = z.infer<typeof TokenUser>

export const getUser = ({ headers }: Request): TokenUser => {
  const token = headers.get('Authorization')
  if (token) {
    const payload = decodeJwt(token)
    return TokenUser.parse(payload)
  } else {
    throw new Error('Missing Authorization header')
  }
}
