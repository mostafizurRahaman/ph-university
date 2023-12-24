import jwt from 'jsonwebtoken';


// create token creation utils:
export const createToken = (
  jwtPayload: { userId: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  const token = jwt.sign(jwtPayload, secret, { expiresIn });
  return token;
};
