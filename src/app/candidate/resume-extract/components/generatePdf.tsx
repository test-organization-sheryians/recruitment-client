"use client";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface Education {
  degree: string;
  institution: string;
  start_date: string;
  end_date: string;
}
interface Experience {
  job_title: string;
  company: string;
  start_date: string;
  end_date: string;
  responsibilities?: string[];
}
interface Skills {
  technical_skills?: string[];
  programming_languages?: string[];
  tools?: string[];
}
interface Certification {
  name: string;
  issuer: string;
  date_issued: string;
}
interface Project {
  name: string;
  description: string;
  technologies?: string[];
}
interface ResumeData {
  education?: Education[];
  experience?: Experience[];
  skills?: Skills;
  certifications?: Certification[];
  projects?: Project[];
}
interface Result {
  data?: ResumeData;
}

export const generatePDF = async (result: Result | null) => {
  if (!result?.data) return;

  const d: ResumeData = result.data;
  const pdf = await PDFDocument.create();
  let page = pdf.addPage([600, 800]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  let y = 760;

  const write = (text: string, size = 12) => {
    const maxWidth = 520;
    let line = "";

    text.split(" ").forEach((word) => {
      const testLine = line + word + " ";
      if (font.widthOfTextAtSize(testLine, size) > maxWidth) {
        page.drawText(line, { x: 40, y, size, font, color: rgb(0, 0, 0) });
        y -= size + 4;
        line = word + " ";
      } else line = testLine;
    });

    if (line.trim()) {
      page.drawText(line, { x: 40, y, size, font, color: rgb(0, 0, 0) });
      y -= size + 6;
    }

    if (y < 40) {
      page = pdf.addPage([600, 800]);
      y = 760;
    }
  };

  write("Extracted Resume Data", 20);
  y -= 12;

  d.education?.forEach((e) => {
    write("EDUCATION", 16);
    write(`• ${e.degree} (${e.start_date} - ${e.end_date})`);
    write(e.institution);
    y -= 10;
  });

  d.experience?.forEach((e) => {
    write("EXPERIENCE", 16);
    write(`• ${e.job_title} — ${e.company}`);
    write(`${e.start_date} to ${e.end_date}`);
    e.responsibilities?.forEach((r) => write(`- ${r}`));
    y -= 10;
  });

  if (d.skills) {
    write("SKILLS", 16);
    d.skills.technical_skills &&
      write(`Technical: ${d.skills.technical_skills.join(", ")}`);
    d.skills.programming_languages &&
      write(`Programming: ${d.skills.programming_languages.join(", ")}`);
    d.skills.tools && write(`Tools: ${d.skills.tools.join(", ")}`);
    y -= 10;
  }

  d.certifications?.forEach((c) => {
    write("CERTIFICATIONS", 16);
    write(`• ${c.name} — ${c.issuer} (${c.date_issued})`);
    y -= 6;
  });

  d.projects?.forEach((p) => {
    write("PROJECTS", 16);
    write(`• ${p.name}`);
    write(p.description);
    p.technologies && write(`Tech: ${p.technologies.join(", ")}`);
    y -= 4;
  });

  const pdfBytes = await pdf.save();
  const uint8Array = new Uint8Array(pdfBytes);
  const blob = new Blob([uint8Array], { type: "application/pdf" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "extracted_resume.pdf";
  a.click();
  URL.revokeObjectURL(url);
};
