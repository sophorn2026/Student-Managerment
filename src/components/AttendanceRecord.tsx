import React from "react";
import { Student, ClassStructure, MonthlyAttendance, AttendanceType, AppSettings } from "../types";
import { toKhmerNumeral, getKhmerLunarSignatureDate, getKhmerMonthName, exportToExcel } from "../utils";
import Header from "./Header";
import { 
  CalendarRange, 
  Sparkles, 
  Check, 
  ChevronDown, 
  CheckCircle, 
  Smartphone, 
  AlertCircle, 
  Printer, 
  Download, 
  Send,
  Trash2,
  UserCheck,
  Grid,
  FileText
} from "lucide-react";

interface AttendanceRecordProps {
  students: Student[];
  structure: ClassStructure;
  attendance: MonthlyAttendance;
  onUpdateAttendance: (updated: MonthlyAttendance) => void;
  settings: AppSettings;
}

// Ministry emblem styled in vector path SVG
const KhmerEmblemSVG = () => (
  <svg width="68" height="68" viewBox="0 0 100 100" fill="none" className="mx-auto drop-shadow-sm select-none">
    <circle cx="50" cy="50" r="46" stroke="#fbbf24" strokeWidth="1.5" fill="#fefaf0" />
    <circle cx="50" cy="50" r="42" stroke="#d97706" strokeWidth="1" strokeDasharray="3 1" />
    <path d="M50 25 C35 55 45 75 50 82 C55 75 65 55 50 25 Z" fill="#ea580c" opacity="0.8" />
    <path d="M50 35 C42 55 46 72 50 78 C54 72 58 55 50 35 Z" fill="#fb923c" />
    <path d="M50 48 C46 62 48 72 50 75 C52 72 54 62 50 48 Z" fill="#fef08a" />
    <path d="M18 55 C22 40 40 42 42 52 C32 55 24 64 18 55 Z" fill="#d97706" />
    <path d="M82 55 C78 40 60 42 58 52 C68 55 76 64 82 55 Z" fill="#d97706" />
    <path d="M43 20 L57 20 L50 14 Z" fill="#ca8a04" />
    <rect x="48" y="20" width="4" height="6" fill="#d97706" />
    <ellipse cx="50" cy="22" rx="8" ry="1.5" fill="#ea580c" />
    <path d="M28 78 Q50 84 72 78 L68 85 Q50 82 32 85 Z" fill="#ca8a04" />
  </svg>
);

export default function AttendanceRecord({
  students,
  structure,
  attendance,
  onUpdateAttendance,
  settings
}: AttendanceRecordProps) {
  // Main subtab inside AttendanceRecord: roster, desk, notice, data
  const [attSubTab, setAttSubTab] = React.useState<"roster" | "desk" | "notice" | "data">("roster");

  const [selectedMonth, setSelectedMonth] = React.useState(4); // default May (index 4)
  const [selectedYear, setSelectedYear] = React.useState(2026);

  // Seating plan/Desk day active state
  const [deskActiveDay, setDeskActiveDay] = React.useState(() => {
    const today = new Date();
    return today.getDate();
  });

  // Notice Letter Builder States
  const [eduOffice, setEduOffice] = React.useState("ការិយាល័យអប់រំ យុវជន និងកីឡាស្រុកសូទ្រនិគម");
  const [schoolNameInput, setSchoolNameInput] = React.useState(structure.schoolName);
  const [gradeInput, setGradeInput] = React.useState(structure.gradeName);
  const [teacherNameInput, setTeacherNameInput] = React.useState(structure.teacherName);
  const [teacherPhoneInput, setTeacherPhoneInput] = React.useState("012 345 678");
  const [isCity, setIsCity] = React.useState(false); // false = ខេត្ត, true = រាជធានី
  const [provinceInput, setProvinceInput] = React.useState("សៀមរាប");
  const [districtInput, setDistrictInput] = React.useState("សូទ្រនិគម");
  const [communeInput, setCommuneInput] = React.useState("ដំដែក");

  // Absence section states
  const [selectedStudentId, setSelectedStudentId] = React.useState("");
  const [startDateNum, setStartDateNum] = React.useState("១២");
  const [endDateNum, setEndDateNum] = React.useState("១៥");
  const [absenceMonth, setAbsenceMonth] = React.useState("មិថុនា");
  const [absenceYear, setAbsenceYear] = React.useState("២០២៦");
  const [totalAbsenceDays, setTotalAbsenceDays] = React.useState("0");

  // Historical Saved Notices States
  interface SavedNotice {
    id: string;
    studentName: string;
    studentId: string;
    gender: string;
    startDate: string;
    endDate: string;
    month: string;
    year: string;
    days: string;
    dateSaved: string;
  }
  const [savedNotices, setSavedNotices] = React.useState<SavedNotice[]>(() => {
    const saved = localStorage.getItem("absence_registry_letters");
    return saved ? JSON.parse(saved) : [];
  });

  // Save noticed list update
  React.useEffect(() => {
    localStorage.setItem("absence_registry_letters", JSON.stringify(savedNotices));
  }, [savedNotices]);

  // Sync state values when structural details change
  React.useEffect(() => {
    setSchoolNameInput(structure.schoolName);
    setGradeInput(structure.gradeName);
    setTeacherNameInput(structure.teacherName);
    if (structure.districtName) {
      setDistrictInput(structure.districtName);
    }
  }, [structure]);

  // Auto calculate missed days when a student selection or filters change
  React.useEffect(() => {
    if (selectedStudentId) {
      const record = attendance[selectedStudentId] || {};
      let count = 0;
      Object.keys(record).forEach((dayKey) => {
        const val = record[parseInt(dayKey, 10)];
        if (val === "A") count++; // Only consider unpermitted absence "A" (អត់ច្បាប់)
      });
      setTotalAbsenceDays(toKhmerNumeral(count || 0));
    } else {
      setTotalAbsenceDays("0");
    }
  }, [selectedStudentId, attendance]);

  // Handle saving notices to history
  const handleSaveNotice = () => {
    if (!selectedStudentId) {
      alert("សូមជ្រើសរើសសិស្សម្នាក់ជាមុនសិន!");
      return;
    }
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    const newNotice: SavedNotice = {
      id: Date.now().toString(),
      studentName: student.khmerName,
      studentId: student.id,
      gender: student.gender,
      startDate: startDateNum,
      endDate: endDateNum,
      month: absenceMonth,
      year: absenceYear,
      days: totalAbsenceDays,
      dateSaved: new Date().toLocaleDateString("km-KH")
    };

    setSavedNotices([newNotice, ...savedNotices]);
    alert("លិខិតជូនដំណឹងអវត្តមានត្រូវបានរក្សាទុកដោយជោគជ័យ! 💾");
  };

  const handleDeleteNotice = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("តើអ្នកពិតជាចង់លុបរបាយការណ៍លិខិតនេះមែនទេ?")) {
      setSavedNotices(savedNotices.filter(n => n.id !== id));
    }
  };

  const handleLoadNotice = (notice: SavedNotice) => {
    setSelectedStudentId(notice.studentId);
    setStartDateNum(notice.startDate);
    setEndDateNum(notice.endDate);
    setAbsenceMonth(notice.month);
    setAbsenceYear(notice.year);
    setTotalAbsenceDays(notice.days);
  };

  // Days Count computing
  const getDaysInMonthCount = (year: number, monthIdx: number) => {
    return new Date(year, monthIdx + 1, 0).getDate();
  };

  const daysCount = getDaysInMonthCount(selectedYear, selectedMonth);
  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);

  // Day Name Translation
  const getDayOfWeekName = (day: number) => {
    const d = new Date(selectedYear, selectedMonth, day);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[d.getDay()];
  };

  const isSunday = (day: number) => {
    const d = new Date(selectedYear, selectedMonth, day);
    return d.getDay() === 0;
  };

  // Toggle Day Attendance records
  const toggleAttendance = (studentId: string, day: number) => {
    const currentRecord = attendance[studentId] || {};
    const currentState = currentRecord[day] || "";
    
    let nextState: AttendanceType = "";
    if (currentState === "") nextState = "P";
    else if (currentState === "P") nextState = "C";
    else if (currentState === "C") nextState = "A";
    else nextState = "";

    const updated = {
      ...attendance,
      [studentId]: {
        ...currentRecord,
        [day]: nextState
      }
    };
    onUpdateAttendance(updated);
  };

  // Prepopulate present values
  const autoMarkAllPresent = () => {
    const updated = { ...attendance };
    students.forEach((student) => {
      const currentRecord = updated[student.id] || {};
      const newRecord = { ...currentRecord };
      daysArray.forEach((day) => {
        if (!isSunday(day) && !newRecord[day]) {
          newRecord[day] = "P";
        }
      });
      updated[student.id] = newRecord;
    });
    onUpdateAttendance(updated);
    alert("បានបំពេញវត្តមាន (P) ជូនគ្រប់សិស្សស្វ័យប្រវត្តរួចរាល់! ✨");
  };

  // Calculate statistics for single student
  const getStudentStats = (studentId: string) => {
    const record = attendance[studentId] || {};
    let present = 0;
    let permitted = 0;
    let unpermitted = 0;

    daysArray.forEach((day) => {
      if (isSunday(day)) return;
      const val = record[day];
      if (val === "P") present++;
      else if (val === "C") permitted++;
      else if (val === "A") unpermitted++;
    });

    const totalMissed = permitted + unpermitted;
    const studyDays = daysArray.filter(d => !isSunday(d)).length;
    const rate = studyDays > 0 ? ((studyDays - totalMissed) / studyDays) * 100 : 100;

    return { permitted, unpermitted, totalMissed, rate };
  };

  const handleSendTelegramAlert = async (student: Student, stats: any) => {
    if (!settings.telegramBotToken || !settings.telegramChannelId) {
      alert("សូមកំណត់កូដ Telegram Bot Token និង Channel ID ក្នុងម៉ឺនុយ 'កម្រិតតភ្ជាប់ Settings' ជាមុនសិន!");
      return;
    }

    const textMsg = `🔔 *[របាយការណ៍អវត្តមានសិស្ស]*\nជម្រាបសួរអាណាព្យាបាលសិស្ស *${student.khmerName}* (${student.gender}) ថ្នាក់ទី *${structure.gradeName}*。\nថ្ងៃនេះសិស្សបានអវត្តមាន (គ្មានច្បាប់អនុញ្ញាត) ពីការសិក្សា។ សូមលោកអាណាព្យាបាលទាក់ទងមកលោកគ្រូដើម្បីសហការតាមដានការសិស្ស។\n\n_អវត្តមានសរុបប្រចាំខែនេះ៖_ ច្បាប់: *${stats.permitted}*​ដង | អត់ច្បាប់: *${stats.unpermitted}*​ដង។`;

    try {
      const url = `https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: settings.telegramChannelId,
          text: textMsg,
          parse_mode: "Markdown"
        })
      });

      const resData = await response.json();
      if (resData.ok) {
        alert(`បានផ្ញើសារជូនដំណឹងទៅកាន់ Telegram អាណាព្យាបាលសិស្ស ${student.khmerName} ដោយជោគជ័យ! ✉️`);
      } else {
        throw new Error(resData.description);
      }
    } catch (e: any) {
      alert(`មិនអាចផ្ញើសារបានទេ៖ ${e.message}`);
    }
  };

  const currentMonthKh = getKhmerMonthName(selectedMonth);
  const signatureDate = getKhmerLunarSignatureDate(new Date(selectedYear, selectedMonth, 15));

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="space-y-6 font-battambang">
      
      {/* Dynamic Sub-tab selector that matches the blue toolbar request */}
      <div className="bg-[#0f5ca8] p-3 text-white flex flex-col md:flex-row justify-between items-center rounded-2xl print:hidden shadow-md font-battambang">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-inner select-none font-sans">
            📅
          </div>
          <div className="flex flex-col">
            <h2 className="font-moul text-[11px] tracking-wide text-amber-300">ប្រព័ន្ធគ្រប់គ្រងវត្តមាន</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] text-sky-100/90 font-semibold uppercase font-sans">
                ថ្នាក់ទី {structure.gradeName} | គ្រូ៖ {structure.teacherName}
              </span>
            </div>
          </div>
          
          {/* Action indicator colors matching the screenshot toolbar buttons */}
          <div className="flex items-center gap-1.5 ml-2">
            <button onClick={autoMarkAllPresent} className="w-6 h-6 bg-emerald-500 hover:bg-emerald-600 active:scale-95 rounded-md flex items-center justify-center text-xs font-bold text-white transition shadow cursor-pointer tooltip" title="បំពេញ P ស្វ័យប្រវត្ត">+</button>
            <button onClick={() => setAttSubTab("data")} className="w-6 h-6 bg-amber-400 hover:bg-amber-500 active:scale-95 rounded-md flex items-center justify-center text-xs text-slate-950 transition shadow cursor-pointer" title="កម្រិតតភ្ជាប់">✏️</button>
            <button onClick={() => window.location.reload()} className="w-6 h-6 bg-sky-500 hover:bg-sky-600 active:scale-95 rounded-md flex items-center justify-center text-xs text-white transition shadow cursor-pointer" title="ទាញយកឡើងវិញ">🔄</button>
            <button onClick={() => window.print()} className="w-6 h-6 bg-rose-500 hover:bg-rose-600 active:scale-95 rounded-md flex items-center justify-center text-xs text-white transition shadow cursor-pointer" title="ព្រីនឯកសារ">🚪</button>
          </div>
        </div>

        {/* Action Tabs list (វត្តមានបញ្ជី | វត្តមានប្លង់តុ | លិខិតជូនដំណឹង | ទិន្នន័យ) */}
        <div className="flex items-center gap-1 mt-3 md:mt-0 overflow-x-auto max-w-full">
          <button
            onClick={() => setAttSubTab("roster")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              attSubTab === "roster"
                ? "bg-white text-sky-900 shadow-md scale-102"
                : "text-sky-100 hover:bg-white/10"
            }`}
          >
            📋 វត្តមានបញ្ជី
          </button>
          <button
            onClick={() => setAttSubTab("desk")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              attSubTab === "desk"
                ? "bg-white text-sky-900 shadow-md scale-102"
                : "text-sky-100 hover:bg-white/10"
            }`}
          >
            🖥️ វត្តមានប្លង់តុ
          </button>
          <button
            onClick={() => setAttSubTab("notice")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              attSubTab === "notice"
                ? "bg-white text-sky-900 shadow-md scale-102"
                : "text-sky-100 hover:bg-white/10"
            }`}
          >
            📩 លិខិតជូនដំណឹង
          </button>
          <button
            onClick={() => setAttSubTab("data")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              attSubTab === "data"
                ? "bg-white text-sky-900 shadow-md scale-102"
                : "text-sky-100 hover:bg-white/10"
            }`}
          >
            🔑 ទិន្នន័យ
          </button>
        </div>
      </div>

      {/* RENDER SUB-TAB 1: ROSTER (STANDARD SUMMARY ATTENDANCE LIST) */}
      {attSubTab === "roster" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4 print:hidden m-1">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-yellow-50 text-amber-500 rounded-lg">
                <CalendarRange size={24} />
              </div>
              <div>
                <h3 className="font-sans font-bold text-gray-800 text-sm">បញ្ជីស្រង់វត្តមានប្រចាំខែ (Attendance Registry)</h3>
                <p className="font-sans text-xs text-gray-500">
                  ស្រង់វត្តមានសិស្សតាមថ្ងៃនិមួយៗ និងគណនាភាគរយវត្តមានសរុបប្រចាំខែស្វ័យប្រវត្ត
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <div className="relative font-sans text-xs font-semibold">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 pr-8 focus:ring-2 focus:ring-sky-500 outline-none w-36 cursor-pointer text-slate-800"
                >
                  {Array.from({ length: 12 }).map((_, mIdx) => (
                    <option key={mIdx} value={mIdx}>
                      ខែ {getKhmerMonthName(mIdx)}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={autoMarkAllPresent}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-sans text-xs font-bold rounded-xl shadow-md cursor-pointer transition active:scale-95"
              >
                <Sparkles size={13} />
                បំពេញ P ស្វ័យប្រវត្ត
              </button>

              <button
                onClick={() => exportToExcel("attendance-print-table", `attendance-reporting-${selectedMonth + 1}`)}
                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 transition cursor-pointer"
                title="ទាញយកជា Excel"
              >
                <Download size={16} />
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-sans text-xs font-bold rounded-xl shadow-md cursor-pointer transition"
              >
                បោះពុម្ព (Print PDF)
              </button>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm print:p-0 print:border-0 print:shadow-none overflow-x-auto m-1">
            <Header structure={structure} />

            <div className="bg-[#fcd34d]/90 text-yellow-950 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-2 mb-6 shadow-sm border border-yellow-200">
              <div>
                <h2 className="font-sans text-base md:text-xl font-bold">
                  សម្រង់វត្តមានប្រចាំថ្ងៃសម្រាប់ខែ {currentMonthKh} ឆ្នាំ {toKhmerNumeral(selectedYear)}
                </h2>
              </div>
              <div className="flex items-center gap-4 text-xs font-sans font-bold">
                <span>សិស្សសរុប៖ {toKhmerNumeral(students.length)} នាក់</span>
                <span className="border-l border-yellow-800/20 pl-4">ស្រី៖ {toKhmerNumeral(students.filter(s=>s.gender==="ស្រី").length)} នាក់</span>
                <span className="border-l border-yellow-800/20 pl-4">ប្រុស៖ {toKhmerNumeral(students.filter(s=>s.gender==="ប្រុស").length)} នាក់</span>
              </div>
            </div>

            <div className="flex gap-4 text-[10px] sm:text-xs font-sans text-gray-500 mb-2 justify-end print:hidden">
              <span className="flex items-center gap-1"><span className="w-4 h-4 bg-emerald-100 rounded flex items-center justify-center text-[8px] text-emerald-800 font-bold">P</span> វត្តមាន​ (មក)</span>
              <span className="flex items-center gap-1"><span className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center text-[8px] text-blue-800 font-bold">ច</span> ច្បាប់ (សុំច្បាប់)</span>
              <span className="flex items-center gap-1"><span className="w-4 h-4 bg-rose-100 rounded flex items-center justify-center text-[8px] text-rose-800 font-bold">អ</span> អត់ច្បាប់ (អវត្តមាន)</span>
              <span className="text-gray-400 font-medium italic">(*ចុចលើក្រឡាដើម្បីផ្លាស់ប្ដូរវត្តមាន)</span>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-2xl max-w-full">
              <table id="attendance-print-table" className="font-sans text-[10px] w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-800 font-bold text-center">
                    <th colSpan={4} className="py-2 border-r border-gray-200">ព័ត៌មានលម្អិតសិស្ស</th>
                    {daysArray.map((day) => {
                      const sun = isSunday(day);
                      return (
                        <th
                          key={day}
                          className={`min-w-[20px] p-1 border-r border-gray-200 text-[10px] leading-tight ${
                            sun ? "text-rose-600 bg-rose-50" : "text-gray-700"
                          }`}
                        >
                          {toKhmerNumeral(day)}
                        </th>
                      );
                    })}
                    <th colSpan={4} className="border-l border-gray-300 bg-sky-50 text-sky-950 font-bold">សម្រង់ប្រចាំខែ</th>
                  </tr>
                  <tr className="bg-gray-100/50 border-b border-gray-200 text-[9px] text-center text-gray-500 font-semibold uppercase">
                    <th className="py-1 border-r border-gray-200 w-8">ល.រ</th>
                    <th className="border-r border-gray-200 w-12">អត្តលេខ</th>
                    <th className="border-r border-gray-200 text-left px-2 w-28">គោត្តនាម និងនាម</th>
                    <th className="border-r border-gray-200 w-8">ភេទ</th>
                    {daysArray.map((day) => {
                      const sun = isSunday(day);
                      const dayStr = getDayOfWeekName(day);
                      return (
                        <th key={day} className={`border-r border-gray-200 text-[8px] ${sun ? "text-rose-500 bg-rose-50 font-bold" : ""}`}>
                          {dayStr}
                        </th>
                      );
                    })}
                    <th className="border-l border-gray-300 px-1 hover:bg-sky-50">ច្បាប់</th>
                    <th className="px-1 hover:bg-sky-50">អត់ច្បាប់</th>
                    <th className="px-1 hover:bg-sky-50">សរុប</th>
                    <th className="px-1.5 hover:bg-sky-50">%វត្តមាន</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, sIdx) => {
                    const record = attendance[student.id] || {};
                    const stats = getStudentStats(student.id);

                    return (
                      <tr key={student.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/40 text-center">
                        <td className="py-2.5 border-r border-gray-200 font-bold text-gray-500">{toKhmerNumeral(sIdx + 1)}</td>
                        <td className="border-r border-gray-200 font-bold text-sky-950 bg-sky-50/10">{toKhmerNumeral(student.id)}</td>
                        <td className="border-r border-gray-200 text-left font-bold text-gray-800 px-2 truncate max-w-[120px]">{student.khmerName}</td>
                        <td className={`border-r border-gray-200 font-semibold ${student.gender === "ស្រី" ? "text-rose-600" : "text-sky-700"}`}>
                          {student.gender}
                        </td>

                        {daysArray.map((day) => {
                          const sun = isSunday(day);
                          const status = record[day] || "";
                          let bgColor = "";
                          let textSymbol = "";
                          let textColor = "";

                          if (status === "P") {
                            bgColor = "bg-emerald-50/25";
                            textSymbol = "✔";
                            textColor = "text-emerald-600 font-bold text-[8px]";
                          } else if (status === "C") {
                            bgColor = "bg-blue-50/80";
                            textSymbol = "ច្បាប់";
                            textColor = "text-blue-700 font-bold text-[8px]";
                          } else if (status === "A") {
                            bgColor = "bg-rose-50";
                            textSymbol = "អត់";
                            textColor = "text-rose-600 font-extrabold text-[8px]";
                          }

                          return (
                            <td
                              key={day}
                              onClick={() => !sun && toggleAttendance(student.id, day)}
                              className={`border-r border-gray-200 p-0 text-[8px] cursor-pointer hover:bg-sky-50 transition-colors select-none ${bgColor} ${
                                sun ? "bg-rose-100/30 text-rose-500 pointer-events-none font-bold" : ""
                              }`}
                            >
                              <span className={textColor}>{sun ? "អា" : textSymbol}</span>
                            </td>
                          );
                        })}

                        <td className="border-l border-gray-300 font-bold text-sky-800 bg-sky-50/10">{toKhmerNumeral(stats.permitted)}</td>
                        <td className="font-bold text-rose-600 bg-rose-50/5">
                          <div className="flex items-center justify-center gap-1">
                            {toKhmerNumeral(stats.unpermitted)}
                            {stats.unpermitted > 0 && (
                              <button
                                onClick={() => handleSendTelegramAlert(student, stats)}
                                className="p-1 bg-rose-55 hover:bg-rose-200 text-rose-600 rounded-full cursor-pointer transition print:hidden"
                                title="ផ្ញើសារជូនដំណឹងទៅអាណាព្យាបាល"
                              >
                                <Send size={10} />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="font-bold text-gray-700">{toKhmerNumeral(stats.totalMissed)}</td>
                        <td className={`font-bold bg-sky-50/20 text-xs ${stats.rate >= 90 ? "text-emerald-600" : "text-amber-600"}`}>
                          {toKhmerNumeral(stats.rate.toFixed(0))}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start pt-10 px-4 font-sans text-xs md:text-sm text-gray-700 space-y-6 md:space-y-0 print:flex-row print:space-y-0 print:pt-4">
              <div className="text-center font-bold flex flex-col items-center">
                <span className="text-gray-500 text-xs mb-1 font-normal">បានឃើញ និងឯកភាព</span>
                <span className="text-sky-950 font-sans font-bold py-1 font-battambang">នាយកសាលា</span>
                <div className="h-16"></div>
                <span className="text-gray-800 font-semibold border-b-2 border-transparent font-battambang">{structure.principalName}</span>
              </div>

              <div className="text-center font-bold flex flex-col items-center md:ml-auto">
                <span className="italic font-normal text-gray-500 font-sans text-[11px] whitespace-pre-wrap text-center leading-normal font-battambang">
                  {signatureDate}
                </span>
                <span className="text-sky-950 font-sans font-bold py-1 text-center font-battambang">គ្រូទទួលបន្ទុកថ្នាក់</span>
                <div className="h-16"></div>
                <span className="text-gray-800 font-semibold border-b-2 border-transparent font-battambang">{structure.teacherName}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER SUB-TAB 2: DESK SEATING CLASSROOM ATTENDANCE */}
      {attSubTab === "desk" && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 m-1">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-moul text-xs text-sky-850">ចុះវត្តមានទូទៅតាមរៀបចំគំនូសប្លង់តុ (Desk Attendance layout)</h3>
              <p className="text-[10px] text-gray-550 mt-1">
                ជ្រើសរើសចុចលើតុសិស្ស ដើម្បីផ្លាស់ប្តូរស្ថានភាព៖ វត្តមាន (P), ច្បាប់ (C), អត់ច្បាប់ (A)
              </p>
            </div>

            {/* Day Selector specifically for Seating chart mapping */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-650">ស្រង់វត្តមានសម្រាប់ថ្ងៃទី៖</span>
              <div className="relative text-xs">
                <select
                  value={deskActiveDay}
                  onChange={(e) => setDeskActiveDay(parseInt(e.target.value, 10))}
                  className="appearance-none bg-sky-50 text-sky-950 border border-sky-200 rounded-xl px-4 py-1.5 pr-8 font-bold outline-none cursor-pointer"
                >
                  {daysArray.map((day) => (
                    <option key={day} value={day}>
                      ថ្ងៃទី {toKhmerNumeral(day)} ({getDayOfWeekName(day)})
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-700 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Blackboard section */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center">
            <div className="w-full max-w-md py-2.5 bg-sky-950 text-white rounded-2xl text-center font-moul text-[11px] uppercase tracking-wider mb-10 shadow-md border-b-4 border-sky-900 select-none">
              🧑‍🏫 ក្តារខៀន និងតុគ្រូបង្រៀន (FRONT OF SCREEN)
            </div>

            {/* Grid layout containing 20 beautiful desks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full">
              {Array.from({ length: Math.max(20, students.length) }).map((_, dIdx) => {
                const student = students[dIdx];
                if (!student) {
                  return (
                    <div 
                      key={dIdx} 
                      className="h-24 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 text-[10px]"
                    >
                      តុទំនេរ #{toKhmerNumeral(dIdx + 1)}
                    </div>
                  );
                }

                const record = attendance[student.id] || {};
                const currentStatus = record[deskActiveDay] || "P"; // Default to present P if empty

                const handleToggle = () => {
                  let nextStatus: AttendanceType = "P";
                  if (currentStatus === "P") nextStatus = "C";
                  else if (currentStatus === "C") nextStatus = "A";
                  else nextStatus = "P";

                  const updatedAttendance = {
                    ...attendance,
                    [student.id]: {
                      ...record,
                      [deskActiveDay]: nextStatus
                    }
                  };
                  onUpdateAttendance(updatedAttendance);
                };

                return (
                  <div
                    key={student.id}
                    onClick={handleToggle}
                    className={`h-24 rounded-2xl p-3 border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm select-none hover:shadow-md hover:scale-102 ${
                      currentStatus === "P"
                        ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                        : currentStatus === "C"
                        ? "bg-blue-55/70 border-blue-200 text-blue-950"
                        : "bg-rose-50/70 border-rose-250 text-rose-950"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-gray-450 font-extrabold uppercase">តុ #{toKhmerNumeral(dIdx + 1)}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full text-white font-extrabold uppercase ${
                        currentStatus === "P" ? "bg-emerald-600" : currentStatus === "C" ? "bg-blue-600" : "bg-rose-500"
                      }`}>
                        {currentStatus === "P" ? "មក" : currentStatus === "C" ? "ច្បាប់" : "អត់ច្បាប់"}
                      </span>
                    </div>
                    <div className="font-extrabold text-xs truncate drop-shadow-sm">{student.khmerName}</div>
                    <div className="text-[9.5px] text-gray-500 flex justify-between">
                      <span>{student.gender}</span>
                      <span>ល.រ {toKhmerNumeral(student.id)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* RENDER SUB-TAB 3: ABSENCE NOTICE GENERATOR (លិខិតជូនដំណឹង) */}
      {attSubTab === "notice" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start m-1">
          {/* Temporary A4 Portrait Printing override element */}
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              @page {
                size: A4 portrait !important;
                margin: 1.4cm !important;
              }
              body * {
                visibility: hidden !important;
              }
              #printable-absence-letter, #printable-absence-letter * {
                visibility: visible !important;
              }
              #printable-absence-letter {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                background: white !important;
                padding: 0 !important;
                margin: 0 !important;
                box-shadow: none !important;
                border: 0 !important;
              }
            }
          `}} />

          {/* Left Panel - Configurations Form (4 columns) */}
          <div className="lg:col-span-5 space-y-6 print:hidden">
            
            {/* Form 1: School & Location layout */}
            <div className="bg-white p-5 rounded-3xl border border-gray-150 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-100 pb-2.5">
                <span className="text-sky-600 font-bold">🏫</span>
                <h3 className="font-sans font-extrabold text-xs text-gray-800 uppercase tracking-wider">ព័ត៌មានសាលា និងទីតាំង</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-gray-500 font-bold mb-1">ការិយាល័យអប់រំ</label>
                  <input
                    type="text"
                    value={eduOffice}
                    onChange={(e) => setEduOffice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-sky-500 outline-none text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-gray-500 font-bold mb-1">សាលារៀន</label>
                    <input
                      type="text"
                      value={schoolNameInput}
                      onChange={(e) => setSchoolNameInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-sky-500 outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 font-bold mb-1">ថ្នាក់ទី</label>
                    <input
                      type="text"
                      value={gradeInput}
                      onChange={(e) => setGradeInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-sky-500 outline-none text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-gray-500 font-bold mb-1">ឈ្មោះគ្រូទទួលថ្នាក់</label>
                    <input
                      type="text"
                      value={teacherNameInput}
                      onChange={(e) => setTeacherNameInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-sky-500 outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 font-bold mb-1">លេខទូរស័ព្ទគ្រូ</label>
                    <input
                      type="text"
                      value={teacherPhoneInput}
                      onChange={(e) => setTeacherPhoneInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-sky-500 outline-none text-slate-800"
                    />
                  </div>
                </div>

                {/* City type toggle */}
                <div>
                  <label className="block text-[11px] text-gray-500 font-bold mb-1">ប្រភេទទីតាំងសាលា</label>
                  <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        checked={!isCity}
                        onChange={() => setIsCity(false)}
                        className="w-3.5 h-3.5 accent-sky-600"
                      />
                      ខេត្ត (Province)
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        checked={isCity}
                        onChange={() => setIsCity(true)}
                        className="w-3.5 h-3.5 accent-sky-600"
                      />
                      រាជធានី (Capital)
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">{isCity ? "រាជធានី" : "ខេត្ត"}</label>
                    <input
                      type="text"
                      value={provinceInput}
                      onChange={(e) => setProvinceInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">{isCity ? "ខណ្ឌ" : "ស្រុក"}</label>
                    <input
                      type="text"
                      value={districtInput}
                      onChange={(e) => setDistrictInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">{isCity ? "សង្កាត់" : "ឃុំ"}</label>
                    <input
                      type="text"
                      value={communeInput}
                      onChange={(e) => setCommuneInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form 2: Absence content parameters */}
            <div className="bg-white p-5 rounded-3xl border border-gray-150 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-100 pb-2.5">
                <span className="text-rose-500 font-bold">📩</span>
                <h3 className="font-sans font-extrabold text-xs text-gray-800 uppercase tracking-wider">ព័ត៌មានអវត្តមាន</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-gray-500 font-bold mb-1">ជ្រើសរើសសិស្ស</label>
                  <div className="relative text-xs">
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-8 focus:ring-1 focus:ring-sky-500 outline-none font-bold text-slate-800 cursor-pointer"
                    >
                      <option value="">-- សូមជ្រើសរើសសិស្ស --</option>
                      {students.map((std) => (
                        <option key={std.id} value={std.id}>
                          {std.khmerName} ({std.gender}) - ល.រ {toKhmerNumeral(std.id)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-gray-500 font-bold mb-1">ចាប់ពីថ្ងៃទី</label>
                    <input
                      type="text"
                      value={startDateNum}
                      onChange={(e) => setStartDateNum(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-sky-500 outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 font-bold mb-1">ដល់ថ្ងៃទី</label>
                    <input
                      type="text"
                      value={endDateNum}
                      onChange={(e) => setEndDateNum(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-sky-500 outline-none text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-gray-500 font-bold mb-1">ខែ</label>
                    <input
                      type="text"
                      value={absenceMonth}
                      onChange={(e) => setAbsenceMonth(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-sky-500 outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 font-bold mb-1">ឆ្នាំ</label>
                    <input
                      type="text"
                      value={absenceYear}
                      onChange={(e) => setAbsenceYear(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-sky-500 outline-none text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-500 font-bold mb-1">ចំនួនថ្ងៃឈប់សរុប</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={totalAbsenceDays}
                      onChange={(e) => setTotalAbsenceDays(e.target.value)}
                      className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-center focus:ring-1 focus:ring-sky-500 outline-none font-extrabold text-slate-800"
                    />
                    <span className="text-xs text-gray-500 font-semibold">ថ្ងៃ</span>
                    <span className="text-[10px] text-rose-500 font-sans italic ml-auto">(ស្វ័យប្រវត្តតាមប្រព័ន្ធ)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-105 flex gap-2">
                <button
                  onClick={handleSaveNotice}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold font-sans text-xs shadow transition active:scale-95 cursor-pointer"
                >
                  រក្សាទុក (Save)
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold font-sans text-xs shadow transition active:scale-95 cursor-pointer"
                >
                  ព្រីនលិខិត
                </button>
              </div>
            </div>

            {/* Form 3: Saved notice logs history */}
            <div className="bg-white p-5 rounded-3xl border border-gray-150 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="text-amber-500 font-bold">📋</span>
                  <h3 className="font-sans font-extrabold text-xs text-gray-800 uppercase tracking-wider">ប្រវត្តិរក្សាទុក</h3>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  {savedNotices.length}
                </span>
              </div>

              {savedNotices.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  <p>គ្មានទិន្នន័យរក្សាទុកទេ</p>
                </div>
              ) : (
                <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
                  {savedNotices.map((notice) => (
                    <div
                      key={notice.id}
                      onClick={() => handleLoadNotice(notice)}
                      className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-110 rounded-xl text-left font-sans text-[11px] cursor-pointer transition flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800">លិខិតសិស្ស {notice.studentName}</p>
                        <p className="text-slate-500 text-[10px]">
                          ឈប់ {notice.days} ថ្ងៃ ({notice.startDate} - {notice.endDate} {notice.month})
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteNotice(notice.id, e)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Printable Letter Display Layout (7 columns) */}
          <div className="lg:col-span-7 bg-slate-100 p-4 md:p-8 rounded-3xl min-h-[90vh] flex justify-center items-start overflow-x-auto print:bg-white print:p-0">
            
            {/* The Document Card resembling Screenshot 2 */}
            <div 
              id="printable-absence-letter" 
              className="bg-white p-6 md:p-12 w-full max-w-[21cm] min-h-[29.7cm] shadow-xl border border-gray-200 rounded-2xl print:shadow-none print:border-0 print:rounded-none relative flex flex-col justify-between font-battambang"
            >
              <div>
                {/* Official Headers */}
                <div className="grid grid-cols-2 gap-4 items-start border-b border-transparent pb-3">
                  
                  {/* Top Left Area - school administration */}
                  <div className="text-center space-y-1">
                    <KhmerEmblemSVG />
                    <p className="font-bold text-[10px] text-sky-950 mt-1 uppercase border-b border-dotted border-gray-300 w-fit mx-auto leading-relaxed">
                      {eduOffice}
                    </p>
                    <p className="font-moul text-[9px] text-sky-850 mt-1">
                      {schoolNameInput}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      លេខ៖ .............................................
                    </p>
                  </div>

                  {/* Top Right Area - Kingdom title */}
                  <div className="text-center space-y-1.5 pt-2">
                    <h2 className="font-moul text-xs md:text-sm text-sky-900 tracking-wider">
                      ព្រះរាជាណាចក្រកម្ពុជា
                    </h2>
                    <h3 className="font-moul text-[9px] text-gray-700 tracking-normal">
                      ជាតិ សាសនា ព្រះមហាក្សត្រ
                    </h3>
                    <div className="flex justify-center items-center py-1 select-none text-[8px] text-amber-600">
                      <span>❖</span>
                      <span className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-1"></span>
                      <span>❖</span>
                    </div>
                  </div>
                </div>

                {/* Main letter big red title matches Image 2 */}
                <div className="text-center my-8">
                  <h1 className="font-moul text-base md:text-lg text-[#ea580c] font-black tracking-widest drop-shadow-sm">
                    សេចក្តីជូនដំណឹង
                  </h1>
                </div>

                {/* Body paragraph content blocks */}
                <div className="space-y-6 text-xs md:text-sm text-slate-900 leading-relaxed text-justify px-2 font-battambang">
                  <p className="indent-8 leading-loose">
                    ខ្ញុំបាទ/នាងខ្ញុំឈ្មោះ <strong className="font-bold text-sky-950">{teacherNameInput}</strong> ជាគ្រូបង្រៀន{isCity ? "សង្កាត់" : "ថ្នាក់"} <strong className="font-bold text-sky-950">{gradeInput}</strong> នៃសាលាបឋមសិក្សា <strong className="font-bold text-sky-950">{schoolNameInput}</strong> {isCity ? "សង្កាត់" : "ឃុំ"} <strong className="font-bold text-sky-950">{communeInput}</strong> {isCity ? "ខណ្ឌ" : "ស្រុក"} <strong className="font-bold text-sky-950">{districtInput}</strong> {isCity ? "" : "ខេត្ត"} <strong className="font-bold text-sky-950">{provinceInput}</strong> ។
                  </p>

                  <h2 className="font-moul text-[11px] text-emerald-800 text-center font-extrabold my-4 uppercase tracking-wider select-none leading-normal">
                    សូមជម្រាបមក
                  </h2>

                  <p className="indent-8 leading-loose">
                    លោក/លោកស្រីដែលជាអាណាព្យាបាលរបស់សិស្សឈ្មោះ <strong className="font-extrabold text-sky-950 underline underline-offset-4 decoration-sky-800/40 text-[13px]">{selectedStudent?.khmerName || "..................................................."}</strong> ភេទ <strong className="font-bold text-sky-950">{selectedStudent?.gender || "........."}</strong> ជានិស្សិត <strong className="font-bold text-sky-950">{gradeInput}</strong> បាន ត្រលប់ជា៖ សិស្សមានឈ្មោះខាងលើនេះបានឈប់មិនឃើញមករៀនចំនួន <strong className="font-black text-[#ea580c] text-base px-1.5">{totalAbsenceDays}</strong> ថ្ងៃ មកហើយ ចាប់ពីថ្ងៃទី <strong className="font-bold text-sky-950">{startDateNum}</strong> ដល់ថ្ងៃទី <strong className="font-bold text-sky-950">{endDateNum}</strong> ខែ <strong className="font-bold text-sky-950">{absenceMonth}</strong> ឆ្នាំ <strong className="font-bold text-sky-950">{absenceYear}</strong> ដោយខាងសាលាមិនបានដឹងមូលហេតុ ។
                  </p>

                  <p className="indent-8 leading-loose">
                    អាស្រ័យហេតុនេះ សូមលោក លោកស្រីជ្រាបព័ត៌មាន និងមេត្តាជួយផ្តល់ដំណឹងតាមរយៈសៀវភៅតាមដានឬទូរស័ព្ទ ខ្ញុំបាទ/នាងខ្ញុំ ដោយក្ដីអនុគ្រោះ ។
                  </p>
                </div>

                {/* Signatures rows */}
                <div className="grid grid-cols-2 gap-4 items-start mt-12 text-xs text-sky-950 font-battambang">
                  <div className="text-center space-y-1">
                    <p className="font-semibold text-gray-500 text-[10px]">បានឃើញ និងឯកភាព</p>
                    <p className="font-moul text-[9px] text-sky-900 leading-normal">នាយកសាលា</p>
                    <div className="h-16"></div>
                    <p className="font-bold text-slate-800 text-sm border-b border-dotted border-gray-300 w-fit mx-auto pb-0.5">{structure.principalName}</p>
                  </div>

                  <div className="text-center space-y-1">
                    <p className="italic text-gray-400 text-[10px]">
                      ថ្ងៃ................ខែ..........ឆ្នាំ..........ស័ក ព.ស. ២៥.......
                    </p>
                    <p className="text-gray-550 text-[10px]">
                      ថ្ងៃទី.......ខែ............ឆ្នាំ២០[\_].......
                    </p>
                    <p className="font-moul text-[9px] text-sky-900 leading-normal">គ្រូទទួលបន្ទុកថ្នាក់</p>
                    <div className="h-16"></div>
                    <p className="font-bold text-slate-800 text-sm border-b border-dotted border-gray-300 w-fit mx-auto pb-0.5">{teacherNameInput}</p>
                  </div>
                </div>
              </div>

              {/* Parents' feedback and teacher mobile contact row */}
              <div className="mt-12 border-t border-dashed border-emerald-500/25 pt-6 space-y-4 text-xs font-battambang print:mt-8">
                <div className="text-center">
                  <span className="font-moul text-[9.5px] text-emerald-800 bg-emerald-50/50 py-1.5 px-4 rounded-xl border border-emerald-100/50">
                    ទូរស័ព្ទ ៖ {teacherPhoneInput}
                  </span>
                </div>
                
                <div className="bg-[#10b981] text-white py-1.5 px-6 rounded-lg text-center font-moul text-[9px] tracking-wide w-fit mx-auto shadow-sm select-none">
                  មតិឆ្លើយតបរបស់អាណាព្យាបាល
                </div>

                <div className="space-y-4 pt-3 px-2 select-none">
                  <div className="border-b border-dotted border-gray-300 w-full h-1"></div>
                  <div className="border-b border-dotted border-gray-300 w-full h-1"></div>
                  <div className="border-b border-dotted border-gray-300 w-full h-1"></div>
                  <div className="border-b border-dotted border-gray-300 w-full h-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER SUB-TAB 4: DATA PREFERENCES & SYSTEM UTILLS */}
      {attSubTab === "data" && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 max-w-4xl mx-auto m-1">
          <div className="border-b border-gray-100 pb-3 flex items-center space-x-2">
            <span className="text-xl">🔩</span>
            <div>
              <h3 className="font-moul text-xs text-sky-800">ម៉ាស៊ីននិងការស្រង់ទិន្នន័យ (Data Toolset Settings)</h3>
              <p className="text-[10px] text-gray-500">កំណត់ការសេវាកម្មទិន្នន័យ ស្ដារ និងនាំចេញឯកសារទូទៅ</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
              <h4 className="font-bold text-emerald-950 font-sans text-xs flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-600" /> សោអនុគមន៍ស្វ័យប្រវត្ត
              </h4>
              <p className="text-[11px] text-emerald-900 leading-normal">
                បំពេញវត្ថមាន "P" សម្រាប់គ្រប់ថ្ងៃដែលមិនមែនជាថ្ងៃអាទិត្យ ជូនគ្រប់សិស្សគ្រប់គ្នាក្នុងខែ {currentMonthKh} ស្វ័យប្រវត្ត ដើម្បីសម្រួលល្បឿនស្រង់។
              </p>
              <button
                onClick={autoMarkAllPresent}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-bold rounded-xl transition cursor-pointer"
              >
                បំពេញទម្រង់វត្តមាន P គ្រប់សិស្ស
              </button>
            </div>

            <div className="p-5 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-3">
              <h4 className="font-bold text-sky-950 font-sans text-xs flex items-center gap-1.5">
                <Download size={14} className="text-sky-600" /> ទាញយករបាយការណ៍សរុប
              </h4>
              <p className="text-[11px] text-sky-900 leading-normal">
                នាំចេញទិន្នន័យតារាងស្រង់វត្តមានសរុបប្រចាំខែ {currentMonthKh} ទៅជាឯកសារ Excel (.xls) សម្រាប់គ្រប់គ្រងបន្ត។
              </p>
              <button
                onClick={() => exportToExcel("attendance-print-table", `attendance-reporting-${selectedMonth + 1}`)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-sans text-xs font-bold rounded-xl transition cursor-pointer"
              >
                ទាញយកតារាងវត្តមាន (.XLS)
              </button>
            </div>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 space-y-3 text-xs text-gray-700">
            <h4 className="font-extrabold text-gray-800 flex items-center gap-1">
              <Smartphone size={14} className="text-sky-600" /> Telegram Parent Alert Integration
            </h4>
            <p className="text-[11px] text-gray-500 leading-normal">
              នៅពេលសិស្សមានអវត្តមានអត់ច្បាប់ (A) តារាងស្រង់វត្តមានបញ្ជី នឹងបង្ហាញរូបសញ្ញាសារ <Send size={10} className="inline mx-0.5" /> ពណ៌ក្រហម។ លោកគ្រូអ្នកគ្រូអាចចុចលើរូបសញ្ញានោះ ដើម្បីផ្ញើសារស្វ័យប្រវត្តរហ័ស ទៅកាន់ Telegram Bot របស់អាណាព្យាបាលសិស្សផ្ទាល់ភ្លាមៗ។
            </p>
            <div className="bg-white p-3 rounded-xl border border-gray-100 space-y-1">
              <p className="text-[10px] text-gray-650 font-sans">
                <strong>Bot Token:</strong> {settings.telegramBotToken ? "********** (ជំនួសដោយកូដសម្ងាត់)" : "មិនទាន់កំណត់ទេ ❌"}
              </p>
              <p className="text-[10px] text-gray-655 font-sans">
                <strong>Channel ID:</strong> {settings.telegramChannelId ? settings.telegramChannelId : "មិនទាន់កំណត់ទេ ❌"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
