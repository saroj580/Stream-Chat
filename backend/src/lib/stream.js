import { StreamChat } from 'stream-chat';
import 'dotenv/config';

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error("Stram Api key or Secret is missing");
}

const stremClient = StreamChat.getInstance(apiKey, apiSecret);


export const upsertStremUser = async (userData) => {
    try {
        await stremClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.log("Error upserting user data.", error);

    }
}

// export const generatStremToken = (userId) => {

// }

