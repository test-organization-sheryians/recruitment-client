import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import JSZip from "jszip";

interface Student {
  Name?: string;
  JobTitle?: string;
  StartDate?: string;
  EndDate?: string;
}

export const generateBulkCertificates = async (
  students: Student[]
) => {
  const zip = new JSZip();

  for (let student of students) {

    // Create temporary div
    const tempDiv = document.createElement("div");

    tempDiv.style.width = "1000px";
    tempDiv.style.padding = "40px";
    tempDiv.style.textAlign = "center";
    tempDiv.style.background = "white";

    tempDiv.innerHTML = `
      <h1 style="color: #1e3a8a;">Internship Certificate</h1>
      <p>This is to certify that</p>
      <h2>${student.Name || "Student Name"}</h2>
      <p>has successfully completed the internship as</p>
      <h3>${student.JobTitle || "Intern"}</h3>
      <p>from ${student.StartDate || "-"} to ${student.EndDate || "-"}</p>
    `;

    document.body.appendChild(tempDiv);

    const canvas = await html2canvas(tempDiv);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape");
    pdf.addImage(imgData, "PNG", 10, 10, 270, 180);

    const blob = pdf.output("blob");

    zip.file(`${student.Name || "Certificate"}.pdf`, blob);

    document.body.removeChild(tempDiv);
  }

  return zip.generateAsync({ type: "blob" });
};
