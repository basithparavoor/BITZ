/**
 * Vercel Serverless Function
 * Endpoint: POST /api/forms/corporate
 * Receives corporate training requests and SAVES it to Google Sheets.
 */
import { GoogleSpreadsheet } from 'google-spreadsheet';

// Helper function to initialize the Google Sheet
async function getDoc() {
    // Authenticate with Google
    const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo(); // loads document properties and worksheets
    return doc;
}

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ status: 'error', message: 'Method Not Allowed' });
    }

    try {
        const data = request.body;

        // --- 1. Validation ---
        if (!data.fullName || !data.companyName || !data.email || !data.phone) {
            return response.status(400).json({
                status: 'error',
                message: 'Validation failed: Missing required fields.'
            });
        }
        
        // --- 2. Save data to Google Sheets ---
        const doc = await getDoc();
        const sheet = doc.sheetsByTitle['corporate']; // Get the 'corporate' tab
        
        // Append a new row
        await sheet.addRow({
            id: `corp_${new Date().getTime()}`,
            full_name: data.fullName,
            company_name: data.companyName,
            email: data.email,
            phone: data.phone,
            team_size: data.teamSize || '',
            training_interest: data.trainingInterest || '',
            message: data.message || '',
            submitted_at: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        });

        // --- 3. Send Success Response ---
        return response.status(201).json({
            status: 'success',
            message: 'Proposal request received. Our team will contact you within 24 hours.'
        });

    } catch (error) {
        console.error('Google Sheets error:', error);
        return response.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}