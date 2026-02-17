// import * as XLSX from "xlsx";

// export interface Student {
//   Name: string;
//   Email?: string;
//   JobTitle?: string;
//   StartDate?: string;
//   EndDate?: string;
// }

// export const readExcelFile = async (file: File): Promise<Student[]> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();

//     reader.onload = (event: ProgressEvent<FileReader>) => {
//       try {
//         const data = new Uint8Array(
//           event.target?.result as ArrayBuffer
//         );

//         const workbook = XLSX.read(data, { type: "array" });
//         const sheet = workbook.Sheets[workbook.SheetNames[0]];

//         const students = XLSX.utils.sheet_to_json<Student>(sheet);

//         resolve(students);
//       } catch (error) {
//         reject(error);
//       }
//     };

//     reader.onerror = reject;

//     reader.readAsArrayBuffer(file);
//   });
// };



import * as XLSX from "xlsx";

export interface Student {
  Name: string;
  Email?: string;
  JobTitle?: string;
  StartDate?: string;
  EndDate?: string;
}

export const readExcelFile = async (file: File): Promise<Student[]> => {
  // ✅ 1. File Type Validation
  if (!file.name.endsWith(".xlsx")) {
    throw new Error("Only .xlsx files are allowed.");
  }

  // ✅ 2. File Size Validation (Max 2MB)
  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must be less than 2MB.");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        if (!event.target?.result) {
          throw new Error("Failed to read file.");
        }

        const data = new Uint8Array(
          event.target.result as ArrayBuffer
        );

        const workbook = XLSX.read(data, { type: "array" });

        // ✅ 3. Sheet Validation
        if (!workbook.SheetNames.length) {
          throw new Error("No sheets found in Excel file.");
        }

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const students = XLSX.utils.sheet_to_json<Student>(sheet);

        // ✅ 4. Empty File Validation
        if (!students.length) {
          throw new Error("Excel file is empty.");
        }

        // ✅ 5. Row-Level Validation
        students.forEach((student, index) => {
          const rowNumber = index + 2; // because row 1 is header

          if (!student.Name || student.Name.trim() === "") {
            throw new Error(`Row ${rowNumber}: Name is required.`);
          }

          if (
            student.Email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.Email)
          ) {
            throw new Error(
              `Row ${rowNumber}: Invalid email format.`
            );
          }
        });

        resolve(students);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file."));
    };

    reader.readAsArrayBuffer(file);
  });
};

