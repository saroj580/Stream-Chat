import FriendRequest from "../models/friendReq.model.js";
import User from "../models/user.model.js";

export async function getRecomendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, //exclude the current user including myself i.e. id != currentUserId
                { $id: { $nin: currentUser.friends } }, //exclude current user's friends
                {isOnboarded : true}
            ]
        })

        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.log("Error in getRecomendedUsers controllers", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id).select("friends")
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage",); //populate method to grad the data of current user
        res.status(200).json(user.friends);
    } catch (error) {
        console.log("Error in getMyFriends controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params; //get the id of other user using the destructured method
        
        //prevent sending request to yourself
        if (myId === recipientId) {
            return res.status(400).json({ message: "You cannot send friend request to yourself" });
        }

        const recipient = await User.find(recipientId);
        if (!recipient) {
            return res.status(400).json({ message: "Recipient not found" });
        }

        //check is user is already friend
        if (recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You're already friend with this user" });
        }

        //check if a req already exists
        const existingReq = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId }, //if any of this case is correc that means the req existed already
                {sender : recipientId, recipient : myId}
            ]
        })

        if (existingReq) {
            return res.status(400).json({message : "friend request between you and this user is already existed"})
        }

        const friendReq = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        });
        res.status(201).json(friendReq);
    } catch (error) {
        console.log("Error in sendFriendRequest", error.message);
        res.status(500).json({ message: "Internal server error" });    }
}