export async function onRequest(context) {
    // Get the API key from the secure environment variables
    const apiKey = context.env.GEMINI_API_KEY;

    // Get the request body from the incoming POST request
    const { userInquiry } = await context.request.json();

    // Construct the payload for the Gemini API call
    const payload = {
        contents: [{
            role: "user",
            parts: [{
                text: `Draft a professional and friendly email for a potential client to send to Anold Stephen Minja. Anold is a web developer and forex expert. The client is interested in the following: "${userInquiry}".
                The email should be respectful, get straight to the point, and have a clear call to action. Do not include a subject line. Do not include placeholders like "[Your Name]".`
            }]
        }],
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    // Make the secure API call on the server
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    // Check for errors and return the response to the client
    if (!response.ok) {
        return new Response('API call failed', { status: response.status });
    }

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    return new Response(JSON.stringify({ text }), {
        headers: { 'Content-Type': 'application/json' },
    });
}