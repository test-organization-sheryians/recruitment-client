import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';

// Test-only utility to convert JSON to a .docx document using docx
const exportDocx = async (data, fileName = 'profile.docx') => {
    if (typeof window === 'undefined' || !data) return;

    const profile = Array.isArray(data) ? data[0] : data;
    const { name = 'Unnamed Candidate', title = '', contact = {}, summary = '', skills = [], experience = [], education = [] } = profile || {};

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({ text: name, heading: HeadingLevel.TITLE }),
                    new Paragraph({ text: title }),
                    new Paragraph({ text: '' }),

                    new Paragraph({ text: 'Contact', heading: HeadingLevel.HEADING_2 }),
                    new Paragraph({ text: `Email: ${contact.email || ''}` }),
                    new Paragraph({ text: `Phone: ${contact.phone || ''}` }),
                    new Paragraph({ text: `Location: ${contact.location || ''}` }),
                    new Paragraph({ text: `Website: ${contact.website || ''}` }),
                    new Paragraph({ text: '' }),

                    new Paragraph({ text: 'Summary', heading: HeadingLevel.HEADING_2 }),
                    new Paragraph({ text: summary }),
                    new Paragraph({ text: '' }),

                    new Paragraph({ text: 'Skills', heading: HeadingLevel.HEADING_2 }),
                    new Paragraph({ children: [new TextRun({ text: (skills || []).join(', ') })] }),
                    new Paragraph({ text: '' }),

                    new Paragraph({ text: 'Experience', heading: HeadingLevel.HEADING_2 }),
                    ...experience.map((e) => new Paragraph({ text: `${e.role || ''} @ ${e.company || ''} (${e.duration || ''}) ${e.location ? ' • ' + e.location : ''}` })),
                    ...experience.flatMap((e) => (Array.isArray(e.achievements) ? e.achievements.map((a) => new Paragraph({ text: `• ${a}` })) : [])),
                    new Paragraph({ text: '' }),

                    new Paragraph({ text: 'Education', heading: HeadingLevel.HEADING_2 }),
                    ...education.map((ed) => new Paragraph({ text: `${ed.degree || ''} — ${ed.school || ''} ${ed.graduationYear ? '(' + ed.graduationYear + ')' : ''}` })),
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
};

export default exportDocx;
