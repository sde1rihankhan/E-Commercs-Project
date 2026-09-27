import { User } from "../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../emailVerify/sendOTPMail.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, resp) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      resp.status(400).json({
        message: "All fields are required ",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return resp.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    verifyEmail(token, email); // send Email here
    newUser.token = token;
    await newUser.save();
    return resp.status(201).json({
      message: "user Ragistered successfully",
      user: newUser,
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
};

export const verify = async (req, resp) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      resp.status(400).json({
        message: "Authorization tokin is missing or invalid",
      });
    }
    const token = authHeader.split(" ")[1]; // [0index => Bearer 1index => token => fwufhqerfbys]

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return resp.status(400).json({
          message: "The ragistration token has expired",
        });
      }
      return resp.status(400).json({
        message: "Token verification failed",
      });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return resp.status(400).json({
        message: "Token not found",
      });
    }
    user.token = null;
    user.isVeryfide = true;
    await user.save();
    return resp.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
};

export const reverify = async (req, resp) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return resp.status(400).json({
        message: "User not found",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    verifyEmail(token, email); // send Email here

    user.token = token;
    await user.save();
    return resp.status(200).json({
      message: "Verfication email sent again successfully",
      token: user.token,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, resp) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return resp.status(400).json({
        message: "All fields are required",
      });
    }

    const exisitingUser = await User.findOne({ email });
    if (!exisitingUser) {
      return resp.status(400).json({
        message: "User not exists",
      });
    }
//await
    const isPasswordValid = bcrypt.compare(
      password,
      exisitingUser.password
    );
    if (!isPasswordValid) {
      return resp.status(400).json({
        message: "Invalid Credentials",
      });
    }

    if (exisitingUser.isVeryfide === false) {
      return resp.status(400).json({
        message: "Verify your account than login",
      });
    }

    //Generate token
    const accessToken = jwt.sign(
      { id: exisitingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "10d" }
    );
    const refresToken = jwt.sign(
      { id: exisitingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );

    exisitingUser.isLoggedIn = true;
    await exisitingUser.save();

    //check ke yaha par purana session hai ya nahi or us ko delete karna
    const exisitingSession = await Session.findOne({
      userId: exisitingUser._id,
    });
    if (exisitingSession) {
      await Session.deleteOne({ userId: exisitingUser._id });
    }

    //new session banane se phele purana session delete karna hai
    //create new session
    await Session.create({ userId: exisitingUser._id });
    return resp.status(200).json({
      message: `Welcome Back ${exisitingUser.firstName}`,
      user: exisitingUser,
      accessToken,
      refresToken,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
};

export const logout = async (req, resp) => {
  try {
    const userId = req.id;
    await Session.deleteMany({ userId: userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
    return resp.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, resp) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return resp.status(400).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); //10 mints
    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();
    await sendOTPMail(otp, email);

    return resp.status(200).json({
      message:"Otp sent to email successfuiiy"
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, resp) => {
  try {
    const {otp} = req.body
    const email = req.params.email

    if(!otp){
      return resp.status(400).json({
        message:"Otp is required"
      })
    }

    const user = await User.findOne({email})
    if(!user){
      return resp.status(400).json({
        message:"User not found"
      })
    }

    if(!user.otp || !user.otpExpiry){
      return resp.status(400).json({
        message: "Otp is not generated or already verified"
      })
    }

    if(user.otpExpiry < new Date){
      return resp.status(400).json({
        message:"Otp has expired please request new one"
      })
    }

    if(otp !== user.otp){
      return resp.status(400).json({
        message:"Otp is invalid"
      })
    }

    user.otp = null
    user.otpExpiry = null
    await user.save()
    return resp.status(200).json({
      message:"Otp verified successfilly"
    })
    
  } catch (error) {
    return resp.status(500).json({
      message:error.message
    })
  }
};

export const changePassword = async (req, resp) => {
    try {
      const {newPassword, confirmPassword} = req.body
      const {email} = req.params
      const user = await User.findOne({email})
      if(!user){
        return resp.status(400).json({
          message:"User not found"
        })
      }

      if(!newPassword || !confirmPassword){
        return resp.status(400).json({
          message:"All fields are required"
        })
      }

      // if(newPassword !== confirmPassword){
      //   return resp.status(400).json({
      //     message:"Password do not match"
      //   })
      // }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword
      await user.save()
      return resp.status(200).json({
        message:"Password change successfully"
      })
    } catch (error) {
      return resp.status(500).json({
        message:error.message
      })
    }
};

export const allUser = async (req, resp) => {
  try {
    const users = await User.find()
    return resp.status(200).json({
      users
    })
  } catch (error) {
    return resp.status(500).json({
      message:error.message
    })
  }
};

export const getUserById = async (req, resp) => {
    try {
      const {userId} = req.params; //extract userid fron request params
      const user = await User.findById(userId).select("-password -otp -otpExpiry -token")
      if(!user){
        return resp.status(404).json({
          message:"User not found"
        })
      }
       resp.status(200).json({
        user
      })
    } catch (error) {
      return resp.status(500).json({
        message:error.message
      })
    }
};

export const updateUser = async (req,resp) => {
    try {
      const userIdToUpdate = req.params.id //the Id of the user we want to update
      const loggedInUser = req.user // req.user from isAuthenticated middleware
      const {firstName, lastName, address, city, zipCode, phoneNo, role} = req.body

      if(loggedInUser._id.toString() !== userIdToUpdate && loggedInUser.role !== "admin"){
        return resp.status(403).json({
          message:"You are not allowed to update this profile"
        })
      }
      let user = await User.findById(userIdToUpdate)
      if(!user){
        return resp.status(404).json({
          message:"User not found"
        })
      }
      let profilePicUrl = user.profilePic
      let profilePicPublicId = user.profilePicPublicId

      //If a new file is uploaded
      if(req.file){
        if(profilePicPublicId){
          await cloudinary.uploader.destroy(profilePicPublicId)
        }
        const uploadResult = await new Promise((resolve, reject)=>{
          const stream = cloudinary.uploader.upload_stream(
            {folder:"profiles"},
            (error, result)=>{
              if(error) (reject)
                else resolve (result)
            }
          )
          stream.end(req.file.buffer)
        })
        profilePicUrl = uploadResult.secure_url
        profilePicPublicId = uploadResult.public_id
      }

      //update fields
      user.firstName = firstName || user.firstName
      user.lastName = lastName || user.lastName
      user.address = address || user.address
      user.city = city || user.city
      user.zipCode = zipCode || user.zipCode
      user.phoneNo = phoneNo || user.phoneNo
      user.role = role
      user.profilePic = profilePicUrl
      user.profilePicPublicId = profilePicPublicId

      const updateUser = await user.save()

      return resp.status(200).json({
        message:"Profile Updated Successfully",
        user:updateUser
      })
    } catch (error) {
      return resp.status(500).json({
        message:error.message
      })
    }
}