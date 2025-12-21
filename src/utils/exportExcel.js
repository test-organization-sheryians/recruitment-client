import * as XLSX from 'xlsx';

// Test-only utility to convert JSON to XLSX using xlsx
// Creates multiple sheets for nested data (Contact, Skills, Experience, Education)
const exportExcel = (data, fileName = 'profile.xlsx') => {
    if (typeof window === 'undefined' || !data) return;

    const profile = Array.isArray(data) ? data[0] : data;
    if (!profile) return;

    const workbook = XLSX.utils.book_new();

    // Profile (top-level primitives only)
    const { contact = {}, skills = [], experience = [], education = [], ...rest } = profile || {};
    const profileRow = Object.fromEntries(
        Object.entries(rest || {}).filter(([, v]) => typeof v !== 'object')
    );
    if (Object.keys(profileRow).length) {
        const wsProfile = XLSX.utils.json_to_sheet([profileRow]);
        XLSX.utils.book_append_sheet(workbook, wsProfile, 'Profile');
    }

    // Contact (key/value rows)
    if (contact && typeof contact === 'object' && Object.keys(contact).length) {
        const contactRows = Object.keys(contact).map((key) => ({ field: key, value: contact[key] }));
        const wsContact = XLSX.utils.json_to_sheet(contactRows);
        XLSX.utils.book_append_sheet(workbook, wsContact, 'Contact');
    }

    // Skills (one per row)
    if (Array.isArray(skills) && skills.length) {
        const skillRows = skills.map((s) => ({ skill: s }));
        const wsSkills = XLSX.utils.json_to_sheet(skillRows);
        XLSX.utils.book_append_sheet(workbook, wsSkills, 'Skills');
    }

    // Experience (flatten arrays; achievements joined by newline)
    if (Array.isArray(experience) && experience.length) {
        const expRows = experience.map((e) => ({
            company: e.company || '',
            role: e.role || '',
            duration: e.duration || '',
            location: e.location || '',
            achievements: Array.isArray(e.achievements) ? e.achievements.join('\n') : '',
        }));
        const wsExp = XLSX.utils.json_to_sheet(expRows);
        XLSX.utils.book_append_sheet(workbook, wsExp, 'Experience');
    }

    // Education
    if (Array.isArray(education) && education.length) {
        const eduRows = education.map((ed) => ({
            school: ed.school || '',
            degree: ed.degree || '',
            graduationYear: ed.graduationYear ?? '',
        }));
        const wsEdu = XLSX.utils.json_to_sheet(eduRows);
        XLSX.utils.book_append_sheet(workbook, wsEdu, 'Education');
    }

    // If no sheets were added (edge case), add a minimal placeholder
    if (!workbook.SheetNames.length) {
        const wsEmpty = XLSX.utils.aoa_to_sheet([["No data"]]);
        XLSX.utils.book_append_sheet(workbook, wsEmpty, 'Profile');
    }

    XLSX.writeFile(workbook, fileName);
};

export default exportExcel;
