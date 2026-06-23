export function toKhmerNumeral(num: number | string | undefined): string {
  if (num === undefined || num === null) return "";
  const khmerNumerals = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
  return String(num).replace(/[0-9]/g, (digit) => khmerNumerals[parseInt(digit, 10)])
    .replace(/\./g, ","); // Cambodia uses comma for decimal e.g., 9,50
}

export function formatKhmerScore(score: number | undefined): string {
  if (score === undefined || score === null) return "០,០០";
  const numStr = score.toFixed(2);
  return toKhmerNumeral(numStr);
}

// Convert month index (0-11) to Khmer Name
export function getKhmerMonthName(monthIdx: number): string {
  const KHMER_MONTHS = [
    "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
    "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
  ];
  return KHMER_MONTHS[monthIdx] || "";
}

// Custom Lunar Calendar mock generator matching the Khmer signature lines in the images
export function getKhmerLunarSignatureDate(gregorianDate: Date = new Date()): string {
  // Mocking authentic sounding Lunar attributes based on dates for aesthetic perfection
  const dayOfWeek = gregorianDate.getDay();
  const khmerDays = ["អាទិត្យ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរ៍"];
  const dayName = khmerDays[dayOfWeek];

  const date = gregorianDate.getDate();
  const monthIdx = gregorianDate.getMonth();
  const year = gregorianDate.getFullYear();

  // Khmer years/cycles mock names
  const animalYears = ["ជូត", "ឆ្លូវ", "ខាល", "ថោះ", "រោង", "ម្សាញ់", "មមី", "មមែ", "វក", "រកា", "ច", "កុរ"];
  const animalYear = animalYears[(year - 4) % 12];

  const lunarDay = toKhmerNumeral((date % 15) === 0 ? 15 : date % 15);
  const waxingWaning = date <= 15 ? "កើត" : "រលត់";

  // Buddhist Era (approximated)
  const beYear = toKhmerNumeral(year + 544);

  const monthNameKh = getKhmerMonthName(monthIdx);
  const khmerYearNo = toKhmerNumeral(year);

  return `ថ្ងៃ${dayName} ${lunarDay}${waxingWaning} ខែ${monthNameKh} ឆ្នាំ${animalYear} ព.ស. ${beYear} \n ធ្វើនៅភូមិកំពង់ឃ្លាំង ថ្ងៃទី${toKhmerNumeral(date)} ខែ${monthNameKh} ឆ្នាំ${khmerYearNo}`;
}

// Standard GPA to Mention / Grade letter in Cambodia:
// A (9-10) Excellent, B (8-8.99) Very Good, C (7-7.99) Good, D (6-6.99) Fair, E (5-5.99) Passing, F (<5) Failing
export function getKhmerMention(average: number): { char: string; phrase: string; color: string } {
  if (average >= 9.0) return { char: "A", phrase: "ល្អ​ប្រសើរ", color: "text-emerald-600 font-bold" };
  if (average >= 8.0) return { char: "B", phrase: "ល្អណាស់", color: "text-blue-600 font-semibold" };
  if (average >= 6.5) return { char: "C", phrase: "ល្អ", color: "text-purple-600 font-semibold" };
  if (average >= 5.0) return { char: "D", phrase: "មធ្យម", color: "text-amber-600" };
  if (average >= 4.0) return { char: "E", phrase: "ខ្សែបន្ទាត់", color: "text-orange-500" };
  return { char: "F", phrase: "ធ្លាក់", color: "text-red-500 font-bold" };
}

// Download HTML Element as Excel file
export function exportToExcel(elementId: string, filename: string = "excel-export") {
  const htmlTable = document.getElementById(elementId);
  if (!htmlTable) {
    console.error("Table element not found to export to Excel: ", elementId);
    return;
  }

  // Use simple HTML-based spreadsheet trick for instant cross-platform Excel download
  const html = htmlTable.outerHTML;
  const url = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(html);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = `${filename}.xls`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Download dynamic data table as clean CSV format containing Khmer data
export function exportDataToCSV(headers: string[], rows: any[][], filename: string = "student-data") {
  // UTF-8 BOM representation for correct Khmer script reading in Excel
  const bom = "\uFEFF";
  let csvContent = bom;

  csvContent += headers.join(",") + "\n";
  rows.forEach((row) => {
    const formattedRow = row.map(val => {
      // Escape dual-quotes and comma items
      const strVal = String(val).replace(/"/g, '""');
      return strVal.includes(",") || strVal.includes("\n") ? `"${strVal}"` : strVal;
    });
    csvContent += formattedRow.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
