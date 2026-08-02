import jwt from 'jsonwebtoken';

/**
 * Signs a JWT for the given user id and attaches it to the response
 * as an httpOnly cookie. Also returns the user payload (without password)
 * in the JSON body so the frontend can hydrate state immediately.
 */
export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

  const cookieExpireDays = Number(process.env.JWT_COOKIE_EXPIRE) || 7;

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    path: '/',
  });

  return token;
};

export const clearTokenCookie = (res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
};
