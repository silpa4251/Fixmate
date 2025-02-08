const jwt = require("jsonwebtoken");

// Generating JWY token 
const generateToken = ( id, role) => {
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Verification of token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

const generateRefreshToken = ( id, role) => {
  const refreshToken = jwt.sign({ id, role }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_EXPIRES_IN, 
  });
  return refreshToken;
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

const sentRefreshToken = (res, token) => {
  res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

const clearToken = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
}

module.exports = { generateToken, verifyToken, generateRefreshToken, verifyRefreshToken, sentRefreshToken, clearToken };