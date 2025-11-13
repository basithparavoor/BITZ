import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(request, response) {
    // 1. Check Request Method
    if (request.method !== 'POST') {
        return response.status(405).json({ status: 'error', message: 'Method Not Allowed' });
    }

    try {
        const data = request.body;

        // 2. Validate Data
        if (!data.fullName || !data.email || !data.phone || !data.courseSlug) {
            return response.status(400).json({ status: 'error', message: 'Missing required fields.' });
        }

        // 3. Initialize Auth (The V5 Way)
        const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);

        const serviceAccountAuth = new JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);

        // 4. Load Sheet
        await doc.loadInfo();
        const sheet = doc.sheetsByTitle['enrollment']; // Must match your tab name exactly

        if (!sheet) {
            throw new Error("Sheet 'enrollment' not found. Check your tab name.");
        }

        // 5. Add Row
        await sheet.addRow({
            id: `enroll_${new Date().getTime()}`,
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
            dob: data.dob || '',
            course_slug: data.courseSlug,
            mode: data.mode,
            payment_option: data.paymentOption,
            highest_qualification: data.highestQualification || '',
            additional_info: data.additionalInfo || '',
            consent: data.consent,
            submitted_at: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        });

        return response.status(201).json({ status: 'success', message: 'Application received.' });

    } catch (error) {
        console.error('API Error:', error);
        return response.status(500).json({ status: 'error', message: error.message });
    }
}