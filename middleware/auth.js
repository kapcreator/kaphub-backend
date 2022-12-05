import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    
    const userData = token && jwt.verify(token, 'test')

    if(userData) req.userId = userData?.id

    next();
  } catch (error) {
    console.log(error)
  }
}

export default auth