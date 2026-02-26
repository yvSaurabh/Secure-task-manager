import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (id)=> {
    return jwt.sign({ id }, process.env.JWT_SECRET,{
        expiresIn: "1d"
    });
 };
  // register controller

 export const registerUser = async (req, res)=> {
    try{ 
        const { name, email, password } = req.body;

        // check if user exists
         const userExists = await User.findOne({ email});
         if(userExists){
            return res.status(400).json({ message: "User already exists"});
         }
         // hash password
          const hashPassword  = await bcrypt.hash(password, 12);

          // create user
          const user = await User.create({
            name, 
            email,
            password: hashPassword
          });
          // generate token
          const token = generateToken(user._id);

          // send token in cookies
          res.cookie("token", token,{
            httpOnly: true,
            secure: false,
            sameSite: "strict",
          });

          res.status(201).json({
            message: "User registered successfully",

          });
        }catch(error) {
            res.status(500).json({ message: error.message});
          }
    };

    export const loginUser = async (req, res)=> {
      try{ 
        const { email, password} = req.body;
      
        // check user exists
        const user  = await User.findOne({ email });
        if(!user){
          return res.status(400).json({ message: "Invalid credentials"});
        }
        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
          return res.status(400).json({ message: "Invalid credentials"});
        }
        // generate token
        const token = generateToken(user._id);

        res.cookie("token", token,{
          httpOnly: true,
          secure: false,
          sameSite: "strict",
        });
      
        res.status(200).json({ message: "Login successful", token });
      } 
      catch(error){
      res.status(500). json({ message: error.message});
    }

  };
  export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
