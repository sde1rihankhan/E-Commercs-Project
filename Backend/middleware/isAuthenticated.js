import { User } from "../models/userModels.js";
import jwt from 'jsonwebtoken'

export const isAuthenticated = async (req, resp, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log(req.headers.authorization);


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return resp.status(401).json({
        message: "Authorization token is missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded
     
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);

    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return resp.status(400).json({
          message: "The ragistration token has expired",
        });
      }

      return resp.status(400).json({
        message: "Access token is missing or invalid",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return resp.status(400).json({
        message: "User not found",
      });
    }
    req.user = user
    req.id = user._id
    //next ka matlab hai ki isAuthenticated complite ho jata hai to logout start ho jay
    next()
} catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
};

// admin check
export const isAdmin = (req, resp, next) => {

    if(req.user && req.user.role === "admin"){
      next()
    } else {
      return resp.status(403).json({
        message:"Access denied: admins only"
      })
    }
}