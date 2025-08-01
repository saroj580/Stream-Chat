import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';

export async function signup(req, res) {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atLeast 6 characters" });
        }

        //check if the user sent the correct email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }     

        // check is the user is already existed
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already existed, please use a different one." });
        }

        // generating the random avatar between 1-100 from the url endpoint
        const idx = Math.floor(Math.random() * 100) + 1; //generate the number between 1-100
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        //create a new user 
        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar
        });

        const token = jwt.sign({ userId :  newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn : '7d'})
        //put the token into the reponse cookies
        res.cookie('jwt', token, {
            //these are the option to create a little bit more secure
            maxAge: 7 * 24 * 60 * 60 * 1000, //it should be in millisecond 
            httpOnly: true, //prevent XSS attacks
            sameSite: 'strict', //prevent CSRF attacks
            secure : process.env.NODE_ENV === 'production' //secure when we are in production
        })

        res.status(202).json({
            success: true,
            user : newUser
        })
    } catch (error) {
        console.log('error in signup controller', error);
        res.status(500).json({message : 'Internal Server Error'});
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required." })
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isPasswordCorrect = await user.matchPassword(password);

        if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign({ userId :  user._id}, process.env.JWT_SECRET_KEY, {expiresIn : '7d'})
        //put the token into the reponse cookies
        res.cookie('jwt', token, {
            //these are the option to create a little bit more secure
            maxAge: 7 * 24 * 60 * 60 * 1000, //it should be in millisecond 
            httpOnly: true, //prevent XSS attacks
            sameSite: 'strict', //prevent CSRF attacks
            secure : process.env.NODE_ENV === 'production' //secure when we are in production
        })

        res.status(200).json({success : true, user})
    } catch (error) {
        console.log('error in login controller', error);
        res.status(500).json({message : 'Internal Server Error'});
    }
}

export function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "logout successfull" });
}