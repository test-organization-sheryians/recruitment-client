import * as XLSX from "xlsx";

export interface Student {
  Name: string;
  Email?: string;
  JobTitle?: string;
  StartDate?: string;
  EndDate?: string;
}

export const readExcelFile = async (file: File): Promise<Student[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const data = new Uint8Array(
          event.target?.result as ArrayBuffer
        );

        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const students = XLSX.utils.sheet_to_json<Student>(sheet);

        resolve(students);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
};
