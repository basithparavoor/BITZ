import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ status: 'error', message: 'Method Not Allowed' });
    }

    try {
        const data = request.body;
        
        const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
        
        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo();

        const sheet = doc.sheetsByTitle['corporate'];
        if (!sheet) throw new Error("Sheet 'corporate' not found. Check tab name.");

        await sheet.addRow({
            id: `corp_${Date.now()}`,
            full_name: data.fullName,
            company_name: data.companyName,
            email: data.email,
            phone: data.phone,
            team_size: data.teamSize || '',
            training_interest: data.trainingInterest || '',
            message: data.message || '',
            submitted_at: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        });

        return response.status(201).json({ status: 'success', message: 'Proposal request received.' });

    } catch (error) {
        console.error('Corporate API Error:', error);
        return response.status(500).json({ status: 'error', message: error.message });
    }
}