import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ status: 'error', message: 'Method Not Allowed' });
    }

    try {
        const data = request.body;

        // Validation
        if (!data.fullName || !data.email || !data.subject || !data.message) {
            return response.status(400).json({ status: 'error', message: 'Missing fields.' });
        }

        // Auth (V5)
        const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const serviceAccountAuth = new JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
        await doc.loadInfo();
        
        const sheet = doc.sheetsByTitle['contact'];
        if (!sheet) throw new Error("Sheet 'contact' not found");

        await sheet.addRow({
            id: `contact_${new Date().getTime()}`,
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
            subject: data.subject,
            message: data.message,
            inquiry_type: data.inquiryType,
            submitted_at: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        });

        return response.status(201).json({ status: 'success', message: 'Message sent.' });

    } catch (error) {
        console.error('API Error:', error);
        return response.status(500).json({ status: 'error', message: error.message });
    }
}