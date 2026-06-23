import { Student, ClassStructure, CleaningDuty, MonthlyAttendance, MonthlyScores, AppSettings } from "./types";

export const KHMER_MONTHS = [
  "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
  "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
];

export const SCHOOL_YEARS = [
  "២០២៥-២០២៦",
  "២០២៦-២០២៧",
  "២០២៧-២០២៨"
];

export const DEFAULT_CLASS_STRUCTURE: ClassStructure = {
  presidentId: "579", // ផន សៀវម៉ី
  vicePresident1Id: "577", // កែវ លីណា
  vicePresident2Id: "578", // ម៉ែន ស្រីលក្ខ័
  teacherName: "សេង សុភាន់",
  principalName: "អ៊ុយ ចាយ",
  districtName: "ស្រុកសូទ្រនិគម",
  schoolCluster: "ដំដែក",
  schoolName: "សាលាបឋមសិក្សាកំពង់ស្ដៅ",
  gradeName: "៤ (ក)",
  academicYear: "២០២៥-២០២៦"
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "577",
    khmerName: "កែវ លីណា",
    gender: "ស្រី",
    birthDate: "០២ មីនា ២០១៧",
    birthPlace: "ស្វាយជ្រុំ កំពង់ឃ្លាំង សូត្រនិគម សៀមរាប",
    fromGrade: "៣(ក)",
    fatherName: "ស៊ីន នាង",
    fatherJob: "កសិករ",
    motherName: "ភួង កញ្ញា",
    motherJob: "កសិករ",
    guardianPhone: "096 53 84 908",
    address: "ស្វាយជ្រុំ កំពង់ឃ្លាំង សូត្រនិគម សៀមរាប",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "579",
    khmerName: "ផន សៀវម៉ី",
    gender: "ស្រី",
    birthDate: "១៥ ខែឧសភា ២០១៧",
    birthPlace: "កំពង់ឃ្លាំង សៀមរាប",
    fromGrade: "៣(ខ)",
    fatherName: "ផន សុខ",
    fatherJob: "នេសាទ",
    motherName: "ម៉ៅ ចន្ថា",
    motherJob: "លក់ដូរ",
    guardianPhone: "097 55 66 771",
    address: "កំពង់ឃ្លាំង សៀមរាប",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "578",
    khmerName: "ម៉ែន ស្រីលក្ខ័",
    gender: "ស្រី",
    birthDate: "០៨ វិច្ឆិកា ២០១៦",
    birthPlace: "ពួក សៀមរាប",
    fromGrade: "៣(ក)",
    fatherName: "ម៉ែន សារ៉ុម",
    fatherJob: "សំណង់",
    motherName: "គីម លី",
    motherJob: "មេផ្ទះ",
    guardianPhone: "012 34 56 78",
    address: "ពួក សៀមរាប",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "580",
    khmerName: "ខេន ម៉ីងស៊ី",
    gender: "ប្រុស",
    birthDate: "២០ កញ្ញា ២០១៧",
    birthPlace: "ជីក្រែង សៀមរាប",
    fromGrade: "៣(ក)",
    fatherName: "ខេន ស៊ា",
    fatherJob: "លក់ដូរ",
    motherName: "សាន សុខា",
    motherJob: "លក់ដូរ",
    guardianPhone: "088 23 45 611",
    address: "ជីក្រែង សៀមរាប",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "581",
    khmerName: "ចាន់ថន សុធារី",
    gender: "ស្រី",
    birthDate: "១២ ធ្នូ ២០១៧",
    birthPlace: "សូត្រនិគម សៀមរាប",
    fromGrade: "៣(ក)",
    fatherName: "ចាន់ថន បូរី",
    fatherJob: "រដ្ឋបាល",
    motherName: "សោម វត្តី",
    motherJob: "គ្រូបង្រៀន",
    guardianPhone: "015 67 89 01",
    address: "សូត្រនិគម សៀមរាប",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "582",
    khmerName: "សេង សុភាស់",
    gender: "ប្រុស",
    birthDate: "០៤ មេសា ២០១៧",
    birthPlace: "ស្វាយលើ សៀមរាប",
    fromGrade: "៣(ខ)",
    fatherName: "សេង សារ៉ាត់",
    fatherJob: "គ្រូពេទ្យ",
    motherName: "លី សុខា",
    motherJob: "លក់ដូរ",
    guardianPhone: "077 44 55 66",
    address: "ស្វាយលើ សៀមរាប",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "583",
    khmerName: "រិន រតនា",
    gender: "ប្រុស",
    birthDate: "៣០ កក្កដា ២០១៦",
    birthPlace: "សៀមរាប",
    fromGrade: "៣(ក)",
    fatherName: "រិន ថុល",
    fatherJob: "នេសាទ",
    motherName: "ហ៊ាង ស្រីមុំ",
    motherJob: "មេផ្ទះ",
    guardianPhone: "092 33 44 55",
    address: "កំពង់ឃ្លាំង សូត្រនិគម សៀមរាប",
    photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "584",
    khmerName: "វ៉ាន់ សុភ័ក្ត្រ",
    gender: "ស្រី",
    birthDate: "១៨ មករា ២០១៧",
    birthPlace: "ភ្នំពេញ",
    fromGrade: "៣(ក)",
    fatherName: "វ៉ាន់ សារុន",
    fatherJob: "សំណង់",
    motherName: "គា ម៉ារី",
    motherJob: "លក់អីវ៉ាន់",
    guardianPhone: "081 22 99 88",
    address: "កំពង់ឃ្លាំង សៀមរាប",
    photoUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "585",
    khmerName: "នួន ពិសិដ្ឋ",
    gender: "ប្រុស",
    birthDate: "១១ តុលា ២០១៦",
    birthPlace: "សូត្រនិគម សៀមរាប",
    fromGrade: "៣(ក)",
    fatherName: "នួន សុផាត",
    fatherJob: "កសិករ",
    motherName: "ជា រុំ",
    motherJob: "កសិករ",
    guardianPhone: "096 90 90 890",
    address: "កំពង់ឃ្លាំង សៀមរាប",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "586",
    khmerName: "អ៊ុង ម៉ានូ",
    gender: "ប្រុស",
    birthDate: "២៤ កុម្ភៈ ២០១៧",
    birthPlace: "បាត់ដំបង",
    fromGrade: "៣(ខ)",
    fatherName: "អ៊ុង សម្បត្តិ",
    fatherJob: "មន្ត្រីរាជការ",
    motherName: "ម៉ែន សុផា",
    motherJob: "គណនេយ្យករ",
    guardianPhone: "089 11 22 33",
    address: "ពួក សៀមរាប",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "587",
    khmerName: "សៅ ស្រីនាថ",
    gender: "ស្រី",
    birthDate: "០៩ មិថុនា ២០១៧",
    birthPlace: "អង្គរធំ សៀមរាប",
    fromGrade: "៣(ក)",
    fatherName: "សៅ សារ៉ុន",
    fatherJob: "រដ្ឋបាល",
    motherName: "មាស ដានី",
    motherJob: "មេផ្ទះ",
    guardianPhone: "010 88 77 66",
    address: "កំពង់ឃ្លាំង សៀមរាប",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "588",
    khmerName: "ហេង វិសាល",
    gender: "ប្រុស",
    birthDate: "២៨ កញ្ញា ២០១៦",
    birthPlace: "សូត្រនិគម សៀមរាប",
    fromGrade: "៣(ក)",
    fatherName: "ហេង រិទ្ធី",
    fatherJob: "នេសាទ",
    motherName: "តូច ផល្លា",
    motherJob: "លក់ដូរ",
    guardianPhone: "095 88 55 22",
    address: "កំពង់ឃ្លាំង សៀមរាប",
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300"
  }
];

// Initial Attendance record (month 4 = May, index 4 corresponds to index 4 e.g. "ឧសភា")
export const INITIAL_ATTENDANCE: MonthlyAttendance = {
  // Let's seed for May (index 4)
  "577": { 1: "P", 2: "P", 3: "P", 4: "P", 5: "C", 6: "P", 7: "P", 8: "P", 9: "P", 10: "P", 11: "P", 12: "P", 13: "P", 14: "P", 15: "P", 16: "P", 17: "P", 18: "P", 19: "P", 20: "P", 21: "P", 22: "A", 23: "P", 24: "P", 25: "P", 26: "P", 27: "P", 28: "P", 29: "P", 30: "P", 31: "P" },
  "578": { 1: "P", 2: "P", 3: "P", 4: "P", 5: "P", 6: "P", 7: "P", 8: "P", 9: "P", 10: "P", 11: "P", 12: "P", 13: "P", 14: "P", 15: "P", 16: "P", 17: "P", 18: "P", 19: "P", 20: "P", 21: "P", 22: "P", 23: "P", 24: "P", 25: "P", 26: "P", 27: "P", 28: "P", 29: "P", 30: "P", 31: "P" },
  "579": { 1: "P", 2: "P", 3: "P", 4: "P", 5: "P", 6: "P", 7: "P", 8: "P", 9: "P", 10: "P", 11: "P", 12: "P", 13: "P", 14: "P", 15: "P", 16: "P", 17: "P", 18: "P", 19: "P", 20: "P", 21: "P", 22: "P", 23: "P", 24: "P", 25: "P", 26: "P", 27: "P", 28: "P", 29: "P", 30: "P", 31: "P" },
  "580": { 1: "P", 2: "P", 3: "P", 4: "P", 5: "P", 6: "P", 7: "A", 8: "P", 9: "P", 10: "P", 11: "P", 12: "P", 13: "P", 14: "P", 15: "P", 16: "P", 17: "P", 18: "P", 19: "P", 20: "P", 21: "P", 22: "P", 23: "P", 24: "P", 25: "P", 26: "P", 27: "P", 28: "P", 29: "P", 30: "P", 31: "P" },
  "581": { 1: "P", 2: "P", 3: "P", 4: "P", 5: "P", 6: "P", 7: "P", 8: "P", 9: "P", 10: "P", 11: "P", 12: "P", 13: "P", 14: "P", 15: "C", 16: "P", 17: "P", 18: "P", 19: "P", 20: "P", 21: "P", 22: "P", 23: "P", 24: "P", 25: "P", 26: "P", 27: "P", 28: "P", 29: "P", 30: "P", 31: "P" }
};

// May/April scores - real realistic scoring out of 10 for each subject
export const INITIAL_SCORES: MonthlyScores = {
  "577": {
    reading: 9.5, dictation: 8.0, composition: 7.5,
    mathNumber: 9.0, mathAlgebra: 8.5, mathMeasurement: 9.0, mathGeometry: 8.0,
    science: 8.5, morality: 9.0, geography: 8.0, history: 8.5, lifeSkills: 9.0,
    drawing: 8.5, sports: 9.0, english: 9.5
  },
  "579": {
    reading: 10.0, dictation: 9.5, composition: 9.0,
    mathNumber: 9.5, mathAlgebra: 9.5, mathMeasurement: 10.0, mathGeometry: 9.5,
    science: 9.5, morality: 10.0, geography: 9.0, history: 9.5, lifeSkills: 9.5,
    drawing: 9.0, sports: 8.5, english: 10.0
  },
  "578": {
    reading: 9.0, dictation: 8.5, composition: 8.5,
    mathNumber: 8.5, mathAlgebra: 8.0, mathMeasurement: 8.5, mathGeometry: 9.0,
    science: 9.0, morality: 9.5, geography: 8.5, history: 9.0, lifeSkills: 9.0,
    drawing: 8.0, sports: 9.5, english: 9.0
  },
  "580": {
    reading: 7.5, dictation: 7.0, composition: 6.5,
    mathNumber: 8.0, mathAlgebra: 7.5, mathMeasurement: 7.0, mathGeometry: 7.5,
    science: 8.0, morality: 8.0, geography: 7.5, history: 8.0, lifeSkills: 8.0,
    drawing: 8.5, sports: 9.0, english: 7.0
  },
  "581": {
    reading: 8.5, dictation: 8.0, composition: 8.5,
    mathNumber: 8.0, mathAlgebra: 8.5, mathMeasurement: 8.0, mathGeometry: 8.5,
    science: 8.5, morality: 9.0, geography: 8.0, history: 8.5, lifeSkills: 8.5,
    drawing: 8.0, sports: 8.0, english: 8.5
  },
  "582": {
    reading: 8.0, dictation: 7.5, composition: 7.0,
    mathNumber: 9.0, mathAlgebra: 8.5, mathMeasurement: 9.0, mathGeometry: 8.5,
    science: 8.5, morality: 8.0, geography: 8.0, history: 7.5, lifeSkills: 8.0,
    drawing: 8.5, sports: 9.0, english: 8.0
  },
  "583": {
    reading: 7.0, dictation: 6.5, composition: 6.0,
    mathNumber: 8.0, mathAlgebra: 7.5, mathMeasurement: 8.0, mathGeometry: 7.0,
    science: 7.5, morality: 8.0, geography: 7.0, history: 7.0, lifeSkills: 7.5,
    drawing: 7.5, sports: 9.5, english: 6.5
  },
  "584": {
    reading: 8.5, dictation: 8.0, composition: 8.0,
    mathNumber: 7.5, mathAlgebra: 7.5, mathMeasurement: 8.0, mathGeometry: 8.0,
    science: 8.0, morality: 8.5, geography: 8.0, history: 8.0, lifeSkills: 8.5,
    drawing: 9.0, sports: 8.0, english: 8.0
  },
  "585": {
    reading: 8.0, dictation: 7.5, composition: 7.0,
    mathNumber: 8.0, mathAlgebra: 8.0, mathMeasurement: 8.5, mathGeometry: 8.0,
    science: 8.0, morality: 8.0, geography: 8.5, history: 8.0, lifeSkills: 8.0,
    drawing: 7.5, sports: 8.5, english: 7.5
  },
  "586": {
    reading: 6.5, dictation: 6.0, composition: 6.0,
    mathNumber: 7.0, mathAlgebra: 6.5, mathMeasurement: 6.5, mathGeometry: 7.0,
    science: 6.5, morality: 7.0, geography: 6.5, history: 6.0, lifeSkills: 7.0,
    drawing: 8.0, sports: 8.5, english: 6.0
  },
  "587": {
    reading: 9.0, dictation: 8.5, composition: 8.0,
    mathNumber: 8.5, mathAlgebra: 9.0, mathMeasurement: 8.5, mathGeometry: 8.5,
    science: 9.0, morality: 9.5, geography: 8.5, history: 9.0, lifeSkills: 9.0,
    drawing: 8.5, sports: 8.0, english: 9.0
  },
  "588": {
    reading: 7.5, dictation: 7.0, composition: 6.5,
    mathNumber: 8.5, mathAlgebra: 8.0, mathMeasurement: 8.0, mathGeometry: 8.0,
    science: 8.0, morality: 8.0, geography: 7.5, history: 7.5, lifeSkills: 8.0,
    drawing: 8.0, sports: 9.0, english: 7.0
  }
};

// Cleaning table (Monday to Saturday) -> initial matching Image 2
export const INITIAL_CLEAN_DUTY: CleaningDuty[] = [
  {
    day: "ចន្ទ ( ចន្ទ )",
    groupNumber: 1,
    leaderId: "579", // ផន សៀវម៉ី (ប្រធានថ្នាក់)
    deputedLeaderId: "577", // កែវ លីណា (អនុប្រធានទី១)
    members: ["580", "581", "582"]
  },
  {
    day: "អង្គារ ( អង្គារ )",
    groupNumber: 2,
    leaderId: "578", // ម៉ែន ស្រីលក្ខ័ (អនុប្រធានទី២)
    deputedLeaderId: "583",
    members: ["584", "585", "586"]
  },
  {
    day: "ពុធ ( ពុធ )",
    groupNumber: 3,
    leaderId: "587",
    deputedLeaderId: "588",
    members: ["577", "579", "580"]
  },
  {
    day: "ព្រហស្បតិ៍ ( ព្រហស្បតិ៍ )",
    groupNumber: 4,
    leaderId: "581",
    deputedLeaderId: "582",
    members: ["583", "584", "585"]
  },
  {
    day: "សុក្រ ( សុក្រ )",
    groupNumber: 5,
    leaderId: "586",
    deputedLeaderId: "587",
    members: ["588", "578", "579"]
  },
  {
    day: "សៅរ៍ ( សៅរ៍ )",
    groupNumber: 6,
    leaderId: "580",
    deputedLeaderId: "581",
    members: ["582", "583", "584"]
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  telegramBotToken: "",
  telegramChannelId: "",
  googleSheetsUrl: "https://docs.google.com/spreadsheets/d/1YourSpreadsheetIDHere/edit"
};
