import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ status: 'error', message: 'Method Not Allowed' });
    }

    try {
        const data = request.body;
        
        // Authenticate
        // IMPORTANT: Ensure GOOGLE_CREDENTIALS in Vercel contains the full JSON string
        const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
        
        // Auth for v4
        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo();

        const sheet = doc.sheetsByTitle['contact'];
        if (!sheet) throw new Error("Sheet 'contact' not found. Check tab name.");

        await sheet.addRow({
            id: `contact_${Date.now()}`,
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
            subject: data.subject,
            message: data.message,
            inquiry_type: data.inquiryType,
            submitted_at: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        });

        return response.status(201).json({ status: 'success', message: 'Message sent!' });

    } catch (error) {
        console.error('Contact API Error:', error);
        return response.status(500).json({ status: 'error', message: error.message });
    }
}