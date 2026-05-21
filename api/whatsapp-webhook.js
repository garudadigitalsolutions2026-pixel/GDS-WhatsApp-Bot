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
            
            // Print everything to the log
            console.log("🔥 RAW PAYLOAD RECEIVED:");
            console.log(JSON.stringify(incomingData, null, 2));
            
            if (incomingData.object && incomingData.entry && incomingData.entry[0].changes[0].value.messages) {
                const customerPhone = incomingData.entry[0].changes[0].value.messages[0].from;
                
                if (incomingData.entry[0].changes[0].value.messages[0].type === 'text') {
                    const customerMessage = incomingData.entry[0].changes[0].value.messages[0].text.body.toLowerCase();
                    console.log(`✅ TEXT MESSAGE CAUGHT FROM ${customerPhone}: ${customerMessage}`);
                }
            }
            return res.status(200).send('EVENT_RECEIVED');
        } catch (error) {
            console.error("❌ ERROR CAUGHT:", error);
            return res.status(500).send('SERVER_ERROR');
        }
    }
}
