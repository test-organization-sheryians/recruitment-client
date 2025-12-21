// Test-only utility to export rendered HTML to PDF using html2pdf.js.
// Uses dynamic import to avoid SSR "self is not defined" errors under Turbopack.
// HTML-to-PDF fallback using pdf-lib (avoids Tailwind color parsing issues)
const exportPDF = async (htmlContent, fileName = 'profile.pdf', data) => {
    try {
        if (typeof window === 'undefined') return;

        const { PDFDocument, StandardFonts } = await import('pdf-lib');

        // If structured data provided, use it; else, derive text from HTML
        let textBlocks = [];
        if (data) {
            const { name = 'Unnamed Candidate', title = '', contact = {}, summary = '', skills = [], experience = [], education = [] } = Array.isArray(data) ? data[0] : data;
            textBlocks.push(`${name}`);
            if (title) textBlocks.push(title);
            textBlocks.push('');
            textBlocks.push('Contact');
            if (contact.email) textBlocks.push(`Email: ${contact.email}`);
            if (contact.phone) textBlocks.push(`Phone: ${contact.phone}`);
            if (contact.location) textBlocks.push(`Location: ${contact.location}`);
            if (contact.website) textBlocks.push(`Website: ${contact.website}`);
            textBlocks.push('');
            if (summary) { textBlocks.push('Summary'); textBlocks.push(summary); textBlocks.push(''); }
            if (skills && skills.length) { textBlocks.push('Skills'); textBlocks.push(skills.join(', ')); textBlocks.push(''); }
            if (experience && experience.length) {
                textBlocks.push('Experience');
                experience.forEach((e) => {
                    textBlocks.push(`${e.role || ''} @ ${e.company || ''} (${e.duration || ''}) ${e.location ? ' • ' + e.location : ''}`);
                    (Array.isArray(e.achievements) ? e.achievements : []).forEach((a) => textBlocks.push(`• ${a}`));
                });
                textBlocks.push('');
            }
            if (education && education.length) {
                textBlocks.push('Education');
                education.forEach((ed) => textBlocks.push(`${ed.degree || ''} — ${ed.school || ''} ${ed.graduationYear ? '(' + ed.graduationYear + ')' : ''}`));
            }
        } else if (htmlContent) {
            const tmp = document.createElement('div');
            tmp.innerHTML = htmlContent;
            const text = tmp.textContent || tmp.innerText || '';
            textBlocks = text.split(/\n+/).map((s) => s.trim()).filter(Boolean);
        } else {
            textBlocks = ['No content'];
        }

        const doc = await PDFDocument.create();
        const page = doc.addPage([612, 792]); // Letter size in points
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const fontSize = 12;
        const margin = 50;
        let y = 792 - margin;
        const maxWidth = 612 - margin * 2;

        const wrapText = (text, size, maxWidth) => {
            const words = text.split(' ');
            const lines = [];
            let line = '';
            words.forEach((w) => {
                const candidate = line ? line + ' ' + w : w;
                const width = font.widthOfTextAtSize(candidate, size);
                if (width > maxWidth) { lines.push(line); line = w; } else { line = candidate; }
            });
            if (line) lines.push(line);
            return lines;
        };

        textBlocks.forEach((block) => {
            const lines = wrapText(block, fontSize, maxWidth);
            lines.forEach((ln) => {
                if (y < margin + fontSize) {
                    // New page if space runs out
                    y = 792 - margin;
                    const p = doc.addPage([612, 792]);
                    page.setSize(p.getSize());
                }
                page.drawText(ln, { x: margin, y, size: fontSize, font });
                y -= fontSize + 4;
            });
            y -= 2;
        });

        const pdfBytes = await doc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('PDF export failed', err);
        if (typeof window !== 'undefined') alert('PDF export failed. See console for details.');
    }
};

export default exportPDF;
