"use client";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Result } from "../types/resume";

export const generatePDF = async (result: Result): Promise<void> => {
  if (!result?.data) return;

  

  const d = result.data;

  const pdf = await PDFDocument.create();
  let page = pdf.addPage([600, 800]);

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  let y = 760;

  const LEFT = 40;
  const BODY = 12;

  const colors = {
    heading: rgb(0.2, 0.4, 0.8),
    text: rgb(0, 0, 0),
  };

  const write = (text: string, size: number = BODY, color = colors.text) => {
    const maxWidth = 520; // Approximate max width for text (600 - 40 - 40 for margins)
    const words = text.split(' ');
    let line = '';

    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const width = font.widthOfTextAtSize(testLine, size);
      if (width > maxWidth && line) {
        page.drawText(line, { x: LEFT, y, size, font, color });
        y -= size + 6;
        if (y < 40) {
          page = pdf.addPage([600, 800]);
          y = 760;
        }
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) {
      page.drawText(line, { x: LEFT, y, size, font, color });
      y -= size + 6;
      if (y < 40) {
        page = pdf.addPage([600, 800]);
        y = 760;
      }
    }
  };

  const heading = (title: string) => {
    write(title, 20, colors.heading);
    y -= 4;
  };

  const list = (items?: string[]) => {
    if (!items) return;
    items.forEach((i) => write(`• ${i}`));
    y -= 4;
  };

  const section = (title: string, cb: () => void) => {
    heading(title);
    cb();
    y -= 10;
  };

  section("EDUCATION", () => {
    d.education?.forEach((e) => {
      write(`${e.degree} (${e.start_date} - ${e.end_date})`);
      write(e.institution);
      y -= 6;
    });
  });

  section("EXPERIENCE", () => {
    d.experience?.forEach((e) => {
      write(`${e.job_title} — ${e.company}`);
      write(`${e.start_date} to ${e.end_date}`);
      list(e.responsibilities);
      y -= 6;
    });
  });

  section("SKILLS", () => {
    const s = d.skills;
    if (!s) return;

    s.technical_skills && write(`Technical: ${s.technical_skills.join(", ")}`);
    s.programming_languages &&
      write(`Programming: ${s.programming_languages.join(", ")}`);
    s.tools && write(`Tools: ${s.tools.join(", ")}`);
  });

  section("CERTIFICATIONS", () => {
    d.certifications?.forEach((c) =>
      write(`${c.name} — ${c.issuer} (${c.date_issued})`)
    );
  });

  section("PROJECTS", () => {
    d.projects?.forEach((p) => {
      write(p.name, 14);
      write(p.description);
      p.technologies && write(`Tech: ${p.technologies.join(", ")}`);
      y -= 6;
    });
  });

  const pdfBytes = await pdf.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.pdf";
  // a.click();
  URL.revokeObjectURL(url);

  return pdfBytes;
};

