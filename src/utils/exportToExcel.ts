import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface SheetData {
  sheetName: string;
  data: any[];
}

const sanitizeSheetName = (name: string): string => {
  // Remove invalid characters: : \ / ? * [ ]
  const invalidCharsRegex = /[:\\\/\?\*\[\]]/g;
  let cleanedName = name.replace(invalidCharsRegex, '_');

  // Trim to 31 characters max
  if (cleanedName.length > 31) {
    cleanedName = cleanedName.slice(0, 31);
  }

  return cleanedName;
};

export const exportMultipleSheetsToExcel = (sheets: SheetData[], fileName: string = 'export.xlsx') => {
  const workbook = XLSX.utils.book_new();

  sheets.forEach((sheet) => {
    const worksheet = XLSX.utils.json_to_sheet(sheet.data);
    const safeSheetName = sanitizeSheetName(sheet.sheetName);
    XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName);
  });

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, fileName);
};