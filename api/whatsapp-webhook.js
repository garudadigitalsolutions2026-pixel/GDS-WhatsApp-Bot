export default async function handler(req, res) {
    if (req.method === 'GET') {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        if (mode === 'subscribe' && token === 'GARUDA_SECRET') {
            return res.status(200).send(challenge);
        } else {
            return res.status(403).send('Forbidden');
        }
    }

    if (req.method === 'POST') {
        try {
            const incomingData = req.body;
            
            if (incomingData.object && incomingData.entry && incomingData.entry[0].changes[0].value.messages) {
                const messageInfo = incomingData.entry[0].changes[0].value.messages[0];
                
                if (messageInfo.type === 'text') {
                    const customerPhone = messageInfo.from;
                    
                    // YOUR META CREDENTIALS GO HERE
                    const token = 'PASTE_YOUR_LONG_ACCESS_TOKEN_HERE';
                    const phoneId = 'PASTE_YOUR_PHONE_NUMBER_ID_HERE';
                    
                    // THE BOT'S REPLY MESSAGE
                    const replyData = {
                        messaging_product: "whatsapp",
                        to: customerPhone,
                        type: "text",
                        text: { body: "Welcome to Garuda Digital Solutions! Your bot is officially online." }
                    };

                    // SEND THE MESSAGE BACK TO WHATSAPP
                    await fetch(`https://graph.facebook.com/v25.0/${phoneId}/messages`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(replyData)
                    });
                }
            }
            return res.status(200).send('EVENT_RECEIVED');
        } catch (error) {
            return res.status(500).send('SERVER_ERROR');
        }
    }
}
