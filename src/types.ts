export interface Student {
  id: string; // ID e.g. "577", "578"
  khmerName: string; // គោត្តនាម និងនាម
  gender: "ប្រុស" | "ស្រី";
  birthDate: string; // e.g., "02 March 2017" or "02-03-2017"
  birthPlace: string; // ទីកន្លែងកំណើត
  fromGrade: string; // មកពីថ្នាក់ទី
  fatherName: string;
  fatherJob: string;
  motherName: string;
  motherJob: string;
  guardianPhone: string; // លេខទូរស័ព្ទអាណាព្យាបាល
  telegramChatId?: string; // សម្រាប់ផ្ញើសារ telegram
  address: string; // អាសយដ្ឋានបច្ចុប្បន្ន
  photoUrl?: string; // portrait data URL
  notes?: string;
  
  // Extended fields for high-fidelity Khmer Student Form
  latinName?: string; // ឈ្មោះឡាតាំង
  gradeName?: string; // ថ្នាក់ទី
  guardianName?: string; // ឈ្មោះអាណាព្យាបាល
  guardianJob?: string; // មុខរបរអាណាព្យាបាល
  
  birthProvince?: string;     // ទីកន្លែងកំណើត - ខេត្ត
  birthDistrict?: string;     // ទីកន្លែងកំណើត - ស្រុក
  birthCommune?: string;      // ទីកន្លែងកំណើត - ឃុំ
  birthVillage?: string;      // ទីកន្លែងកំណើត - ភូមិ
  
  addressProvince?: string;   // អាសយដ្ឋានបច្ចុប្បន្ន - ខេត្ត
  addressDistrict?: string;   // អាសយដ្ឋានបច្ចុប្បន្ន - ស្រុក
  addressCommune?: string;    // អាសយដ្ឋានបច្ចុប្បន្ន - ឃុំ
  addressVillage?: string;    // អាសយដ្ឋានបច្ចុប្បន្ន - ភូមិ

  isNewStudent?: string;      // សិស្សថ្មី (បាទ/ចាស ឬ ទេ)
  isRepeated?: string;        // សិស្សត្រួតថ្នាក់ (ទេ ឬ បាទ/ចាស)
  poorStatus?: string;        // ស្ថានភាពគ្រួសារ (ក្រីក្រ) (ទេ ឬ ក្រីក្រ១ ឬ ក្រីក្រ២)
  disability?: string;        // ពិការភាព (ទេ ឬ មាន)
  idPoorCard?: string;        // ប័ណ្ណក្រីក្រ (គ្មាន ឬ មាន)
  isEthnic?: string;          // សិស្សជនជាតិភាគតិច (ទេ ឬ បាទ)
  scholarship?: string;       // អាហារូបករណ៍ (ទេ ឬ មាន)
  
  ethnicGroup?: string;       // ជនជាតិដើមភាគតិច
  specialTrait?: string;      // លក្ខណៈពិសេស
}

export type AttendanceType = "P" | "C" | "A" | ""; // P: វត្តមាន (Present), C: ច្បាប់ (Absent with permission), A: អត់ច្បាប់ (Absent without permission)

export interface MonthlyAttendance {
  [studentId: string]: {
    [day: number]: AttendanceType;
  };
}

// មុខវិជ្ជាពិន្ទុ
export interface ClassScores {
  reading: number; // អំណាន (max 10)
  dictation: number; // សរសេរតាមអាន (max 10)
  composition: number; // តែងសេចក្ដី (max 10)
  mathNumber: number; // គណិតវិទ្យា-ចំនួន (max 10)
  mathAlgebra: number; // គណិតវិទ្យា-ពេជ្រគណិត (max 10)
  mathMeasurement: number; // គណិតវិទ្យា-រង្វាស់រង្វាល់ (max 10)
  mathGeometry: number; // គណិតវិទ្យា-ធរណីមាត្រ (max 10)
  science: number; // វិទ្យាសាស្ត្រ (max 10)
  morality: number; // សីលធម៌ (max 10)
  geography: number; // ភូមិវិទ្យា (max 10)
  history: number; // ប្រវត្តិវិទ្យា (max 10)
  lifeSkills: number; // អប់រំបំណិន (max 10)
  drawing: number; // គំនូរ (max 10)
  sports: number; // កីឡា (max 10)
  english: number; // អង់គ្លេស (max 10)
}

export interface MonthlyScores {
  [studentId: string]: ClassScores;
}

export interface CleaningDuty {
  day: string; // ចន្ទ - សៅរ៍, វេនរួម
  groupNumber: number;
  leaderId: string;
  deputedLeaderId: string;
  members: string[]; // array of studentIds
}

export interface ClassStructure {
  presidentId: string; // ប្រធានថ្នាក់
  vicePresident1Id: string; // អនុប្រធានទី១
  vicePresident2Id: string; // អនុប្រធានទី២
  teacherName: string; // គ្រូទទួលបន្ទុកថ្នាក់
  principalName: string; // នាយកសាលា
  districtName: string; // ស្រុក
  schoolCluster: string; // កម្រងសាលារៀន
  schoolName: string; // សាលារៀន
  gradeName: string; // ថ្នាក់ទី (e.g. ៤ (ក))
  academicYear: string; // ឆ្នាំសិក្សា (e.g. ២០២៥-២០២៦)
}

export interface AppSettings {
  telegramBotToken: string;
  telegramChannelId: string;
  googleSheetsUrl: string;
}
