/** Whether the request carries `Authorization: Bearer <secret>`. Never true without a secret. */
export function hasBearerToken(request: Request, secret: string | undefined) {
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
  return Boolean(secret) && token === secret;
}
