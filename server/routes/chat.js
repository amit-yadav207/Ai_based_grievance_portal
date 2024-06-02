const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();
// const bot = require('../chat/bot');
const dotenv = require('dotenv');
const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const User = require('../models/User')

// Initialize chat with history
let chat;
dotenv.config();
async function initializeChat() {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    chat = model.startChat({
        history: [
            { role: 'user', parts: [{ text: 'Hello, I would like to report a power outage in my area.' }] },
            { role: 'model', parts: [{ text: 'Thank you for reaching out. Could you please provide your location and the time the outage started?' }] },

            { role: 'user', parts: [{ text: 'I live at 123 Maple Street, and the power went out around 3 PM today.' }] },
            { role: 'model', parts: [{ text: 'We have registered your complaint with the electrical department. Your reference number is E123456. We will update you once the issue is resolved.' }] },

            { role: 'user', parts: [{ text: 'It’s been three hours and there’s still no update on the power outage.' }] },
            { role: 'model', parts: [{ text: 'We apologize for the inconvenience. The electrical department is currently working on it. Expected resolution time is within the next two hours.' }] },

            { role: 'user', parts: [{ text: 'Hello, I want to complain about the uncleaned streets in our neighborhood.' }] },
            { role: 'model', parts: [{ text: 'Thank you for your message. Can you please specify the location and how long this issue has been persisting?' }] },

            { role: 'user', parts: [{ text: 'The streets on Pine Avenue have been dirty for the past week.' }] },
            { role: 'model', parts: [{ text: 'We have noted your complaint. Your reference number is C987654. The cleaning department will address this issue within the next 48 hours.' }] },

            { role: 'user', parts: [{ text: 'Hi, I’m having issues with my son’s school. There’s been a lack of teachers for the past month.' }] },
            { role: 'model', parts: [{ text: 'We understand your concern. Can you provide the name of the school and any specific details?' }] },

            { role: 'user', parts: [{ text: 'It’s Greenfield Elementary, and there have been no math or science teachers available for weeks.' }] },
            { role: 'model', parts: [{ text: 'Your complaint has been forwarded to the education department. Your reference number is ED567890. We will update you on the progress shortly.' }] },

            { role: 'user', parts: [{ text: 'It’s been a week since I reported the issue with the school. Any updates?' }] },
            { role: 'model', parts: [{ text: 'We apologize for the delay. The education department is in the process of hiring new teachers. The expected time for resolution is within the next two weeks.' }] },
            { role: 'user', parts: [{ text: 'I need to report a malfunctioning streetlight on Oak Street.' }] },
            { role: 'model', parts: [{ text: 'Thank you for reporting this. Can you specify the exact location on Oak Street and when you noticed the malfunction?' }] },

            { role: 'user', parts: [{ text: 'The streetlight near 45 Oak Street has been out for three days.' }] },
            { role: 'model', parts: [{ text: 'We have forwarded your complaint to the electrical department. Your reference number is E234567. They will address the issue within 24 hours.' }] },

            { role: 'user', parts: [{ text: 'The streetlight is still not fixed. It’s been over a day.' }] },
            { role: 'model', parts: [{ text: 'We apologize for the inconvenience. The repair team has been dispatched and the issue should be resolved by the end of today.' }] },

            { role: 'user', parts: [{ text: 'I’d like to report a broken swing in the park near Elm Street.' }] },
            { role: 'model', parts: [{ text: 'Thank you for notifying us. Can you provide more details about the exact location and the condition of the swing?' }] },

            { role: 'user', parts: [{ text: 'The swing in the north corner of Elm Park is broken. It’s been like this for a week.' }] },
            { role: 'model', parts: [{ text: 'Your complaint has been registered with the maintenance department. Your reference number is M345678. The issue will be resolved within 72 hours.' }] },

            { role: 'user', parts: [{ text: 'I reported a broken swing a week ago, and it’s still not fixed.' }] },
            { role: 'model', parts: [{ text: 'We apologize for the delay. The maintenance team will prioritize this repair and it should be completed within the next 24 hours.' }] },

            { role: 'user', parts: [{ text: 'There’s a severe pothole on the road near my house on Birch Avenue.' }] },
            { role: 'model', parts: [{ text: 'Thank you for reporting. Can you provide the exact location on Birch Avenue and any details on how long it has been there?' }] },

            { role: 'user', parts: [{ text: 'It’s near 12 Birch Avenue, and it’s been there for about two weeks.' }] },
            { role: 'model', parts: [{ text: 'Your complaint has been noted. Your reference number is R456789. The road maintenance department will address the issue within five days.' }] },

            { role: 'user', parts: [{ text: 'The pothole on Birch Avenue is still there after a week. Any updates?' }] },
            { role: 'model', parts: [{ text: 'We apologize for the inconvenience. The road maintenance team has been delayed due to weather conditions but will fix the pothole within the next two days.' }] },

            { role: 'user', parts: [{ text: 'I’d like to complain about the lack of garbage collection on my street.' }] },
            { role: 'model', parts: [{ text: 'We’re sorry to hear that. Can you provide your street name and how long this issue has been occurring?' }] },

            { role: 'user', parts: [{ text: 'I live on Cedar Lane, and garbage hasn’t been collected for over a week.' }] },
            { role: 'model', parts: [{ text: 'Your complaint has been registered. Your reference number is G567890. The waste management team will address this within 48 hours.' }] },

            { role: 'user', parts: [{ text: 'Garbage is still piling up on Cedar Lane. It’s been two days since I reported.' }] },
            { role: 'model', parts: [{ text: 'We apologize for the delay. The waste management team is on their way and will collect the garbage by the end of today.' }] },

            { role: 'user', parts: [{ text: 'The water pressure in my home has been very low.' }] },
            { role: 'model', parts: [{ text: 'Thank you for bringing this to our attention. Could you please provide your address and how long you’ve been experiencing this issue?' }] },

            { role: 'user', parts: [{ text: 'I live at 78 Willow Drive, and it’s been like this for the past three days.' }] },
            { role: 'model', parts: [{ text: 'We have registered your complaint with the water department. Your reference number is W678901. They will investigate and resolve the issue within the next 48 hours.' }] },

            { role: 'user', parts: [{ text: 'The water pressure is still low. Any updates on my complaint?' }] },
            { role: 'model', parts: [{ text: 'We apologize for the ongoing issue. The water department has identified the problem and will fix it by tomorrow.' }] }
        ],




        generationConfig: { maxOutputTokens: 100 },
    });
}

initializeChat();

// Route to handle chat messages
router.post('/message', async (req, res) => {
    console.log("chat router",req)
    // const { user: { userId } } = req
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = await response.text();

        res.json({ reply: text });
        //store user and bot response in chathistoryschema and update that user
        // storeChatAndUserResponse(userId, message, text);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});



module.exports = router;
