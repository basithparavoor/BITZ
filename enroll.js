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

        const sheet = doc.sheetsByTitle['enrollment'];
        if (!sheet) throw new Error("Sheet 'enrollment' not found. Check tab name.");

        await sheet.addRow({
            id: `enroll_${Date.now()}`,
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

        return response.status(201).json({ status: 'success', message: 'Application received!' });

    } catch (error) {
        console.error('Enroll API Error:', error);
        return response.status(500).json({ status: 'error', message: error.message });
    }
}