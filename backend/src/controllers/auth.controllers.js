import { upsertStremUser } from "../lib/stream.js";
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


        try {
            await upsertStremUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
                
            })
            console.log(`Stream user created fro ${newUser.fullName}`)    
        } catch (error) {
            console.log("Error creating stream user", error)
        }

        const token = jwt.sign({ userId :  newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn : '7d'})
        //put the token into the reponse cookies
        res.cookie('jwt', token, {
            //these are the option to create a little bit more secure
            maxAge: 7 * 24 * 60 * 60 * 1000, //it should be in millisecond 
            httpOnly: true, //prevent XSS attacks
            sameSite: 'strict', //prevent CSRF attacks
            secure : process.env.NODE_ENV === 'production' //secure when we are in production
        })

        res.status(201).json({
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

export async function onboard (req, res) {
    try {
        const userId = req.user._id;
        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(401).json({
                success: false,
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean),
            })
        }
        
        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body, //get everything that we have in req.body i.e. fullName, bio, nativeLanguage and all
            isOnboarded: true

        }, { new: true }); //give the user after updated is applied

        if (!updatedUser) return res.status(404).json({ message: "User not found." });

        try {
            await upsertStremUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image : updatedUser.profilePic || ""
            })
            console.log(`Stram user updated after onboarding for ${updatedUser.fullName}`);
        } catch (streamError) {
            console.log("Error updating stream user during onboarding", streamError.message);
        }

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.log("Onboarding error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}