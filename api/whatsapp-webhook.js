export default async function handler(req, res) {
    // META VERIFICATION STEP
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

    // MESSAGE RECEIVING STEP
    if (req.method === 'POST') {
        try {
            const incomingData = req.body;
            if (incomingData.object && incomingData.entry && incomingData.entry[0].changes[0].value.messages) {
                const customerPhone = incomingData.entry[0].changes[0].value.messages[0].from;
                const customerMessage = incomingData.entry[0].changes[0].value.messages[0].text.body.toLowerCase();
                console.log(`NEW MESSAGE FROM ${customerPhone}: ${customerMessage}`);
            }
            return res.status(200).send('EVENT_RECEIVED');
        } catch (error) {
            console.error(error);
            return res.status(500).send('SERVER_ERROR');
        }
    }
}