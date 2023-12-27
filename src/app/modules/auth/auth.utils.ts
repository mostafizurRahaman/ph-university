import jwt, { JwtPayload } from 'jsonwebtoken';

// create token creation utils:
export const createToken = (
  jwtPayload: { userId: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  const token = jwt.sign(jwtPayload, secret, { expiresIn });
  return token;
};

// verify jwt token :
export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
