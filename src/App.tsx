import React from "react";
import { Student, ClassStructure, CleaningDuty, MonthlyAttendance, MonthlyScores, AppSettings } from "./types";
import {
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_SCORES,
  INITIAL_CLEAN_DUTY,
  DEFAULT_CLASS_STRUCTURE,
  DEFAULT_SETTINGS,
  KHMER_MONTHS
} from "./constants";
import { toKhmerNumeral } from "./utils";

// Importing views
import DashboardGrid from "./components/DashboardGrid";
import StudentList from "./components/StudentList";
import AttendanceRecord from "./components/AttendanceRecord";
import ScoreRecord from "./components/ScoreRecord";
import RankingTable from "./components/RankingTable";
import HonorBoard from "./components/HonorBoard";
import CleaningSchedule from "./components/CleaningSchedule";
import StudentCards from "./components/StudentCards";
import SyncSettings from "./components/SyncSettings";
import StudentAnalytics from "./components/StudentAnalytics";
import ClassroomAdmin from "./components/ClassroomAdmin";
import AccountDashboard from "./components/AccountDashboard";
import LoginRegister from "./components/LoginRegister";

// Beautiful 3D-feeling gradient classes for each navigation tab
const TAB_DECORATIONS = [
  { id: "home", label: "ទំព័រដើម (Home)", emoji: "🏠", desc: "ផ្ទាំងបញ្ជាមុខងាររួមទាំង២៦", grad: "from-indigo-500 via-purple-600 to-pink-500 shadow-indigo-150" },
  { id: "students", label: "បញ្ជីឈ្មោះសិស្ស", emoji: "🎒", desc: "ស្ថិតិនិងព័ត៌មានលម្អិត", grad: "from-blue-500 via-indigo-600 to-indigo-700 shadow-indigo-200" },
  { id: "adminBooks", label: "រដ្ឋបាលថ្នាក់រៀន", emoji: "📚", desc: "សៀវភៅរដ្ឋបាលថ្នាក់រៀនទាំង១៣", grad: "from-violet-600 via-indigo-600 to-indigo-700 shadow-indigo-200" },
  { id: "attendance", label: "ស្រង់វត្តមាន", emoji: "📅", desc: "គ្រប់គ្រងវត្តមានគ្រប់ខែ", grad: "from-amber-400 via-amber-500 to-orange-500 shadow-amber-200" },
  { id: "scores", label: "ស្រង់ពិន្ទុសិស្ស", emoji: "📝", desc: "មុខវិជ្ជា និងសៀវភៅតាមដាន", grad: "from-sky-400 via-sky-500 to-blue-600 shadow-sky-200" },
  { id: "ranking", label: "តារាងចំណាត់ថ្នាក់", emoji: "🏆", desc: "លំដាប់ពិន្ទុមធ្យមភាគសរុប", grad: "from-yellow-400 via-amber-500 to-yellow-600 shadow-yellow-250" },
  { id: "honor", label: "តារាងកិត្តិយស", emoji: "⭐", desc: "បង្ហាញសិស្សឆ្នើមទាំង៥រូប", grad: "from-rose-500 via-pink-600 to-pink-700 shadow-rose-200" },
  { id: "cleaning", label: "វេនសម្អាតថ្នាក់", emoji: "🧼", desc: "ក្រុមការងារ និងកិច្ចការប្រចាំថ្ងៃ", grad: "from-emerald-400 via-teal-500 to-teal-600 shadow-teal-200" },
  { id: "cards", label: "កាតសិស្ស A4", emoji: "🪪", desc: "៦សន្លឹកក្នុងមួយសន្លឹក A4 ផ្ដេក", grad: "from-cyan-400 via-cyan-500 to-sky-600 shadow-cyan-200" },
  { id: "sync", label: "កម្រិតតភ្ជាប់", emoji: "⚙️", desc: "Telegram & Google Sheets", grad: "from-slate-500 via-slate-600 to-zinc-700 shadow-slate-200" },
  { id: "analytics", label: "វិភាគទិន្នន័យ", emoji: "🔮", desc: "ប្រព័ន្ធវិភាគទិន្នន័យសិក្សាកម្រិតខ្ពស់", grad: "from-indigo-600 via-purple-600 to-pink-500 shadow-indigo-150" },
  { id: "account", label: "ព័ត៌មានគណនី", emoji: "👤", desc: "គ្រប់គ្រងគណនីអ្នកប្រើប្រាស់ និងសាលា", grad: "from-slate-600 to-zinc-700 shadow-slate-150" }
];

export default function App() {
  // App States with LocalStorage backups
  const [students, setStudents] = React.useState<Student[]>(() => {
    const saved = localStorage.getItem("khmer_students");
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [structure, setStructure] = React.useState<ClassStructure>(() => {
    const saved = localStorage.getItem("khmer_structure");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.schoolName === "សាលាបឋមសិក្សាកំពង់ឃ្លាំង" || parsed.schoolName === "សាលាបឋមសិក្សាកំពង់ឃ្នាស") {
          parsed.schoolName = "សាលាបឋមសិក្សាកំពង់ស្ដៅ";
        }
        if (parsed.teacherName === "សេង សុភាស់") {
          parsed.teacherName = "សេង សុភាន់";
        }
        return parsed;
      } catch (e) {
        return DEFAULT_CLASS_STRUCTURE;
      }
    }
    return DEFAULT_CLASS_STRUCTURE;
  });

  const [attendance, setAttendance] = React.useState<MonthlyAttendance>(() => {
    const saved = localStorage.getItem("khmer_attendance");
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [scores, setScores] = React.useState<MonthlyScores>(() => {
    const saved = localStorage.getItem("khmer_scores");
    return saved ? JSON.parse(saved) : INITIAL_SCORES;
  });

  const [dutyGroups, setDutyGroups] = React.useState<CleaningDuty[]>(() => {
    const saved = localStorage.getItem("khmer_cleaning");
    return saved ? JSON.parse(saved) : INITIAL_CLEAN_DUTY;
  });

  const [settings, setSettings] = React.useState<AppSettings>(() => {
    const saved = localStorage.getItem("khmer_settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [activeTab, setActiveTab] = React.useState("home");
  const [activeMonthFilter, setActiveMonthFilter] = React.useState(4); // Default May
  
  // Login Session authentication state with persistent storage backup
  const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
    return localStorage.getItem("khmer_auth_logged_in") === "true";
  });

  // Settings modification states
  const [isClassEditorOpen, setIsClassEditorOpen] = React.useState(false);

  // Backup saves
  React.useEffect(() => {
    localStorage.setItem("khmer_students", JSON.stringify(students));
  }, [students]);

  React.useEffect(() => {
    localStorage.setItem("khmer_structure", JSON.stringify(structure));
  }, [structure]);

  React.useEffect(() => {
    localStorage.setItem("khmer_attendance", JSON.stringify(attendance));
  }, [attendance]);

  React.useEffect(() => {
    localStorage.setItem("khmer_scores", JSON.stringify(scores));
  }, [scores]);

  React.useEffect(() => {
    localStorage.setItem("khmer_cleaning", JSON.stringify(dutyGroups));
  }, [dutyGroups]);

  React.useEffect(() => {
    localStorage.setItem("khmer_settings", JSON.stringify(settings));
  }, [settings]);

  // Handle student modifications
  const handleAddStudent = (newStudent: Student) => {
    setStudents([...students, newStudent]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const handleClearAllStudents = () => {
    setStudents([]);
  };

  const handleSaveClassBio = (e: React.FormEvent) => {
    e.preventDefault();
    setIsClassEditorOpen(false);
  };

  const currentMonthName = KHMER_MONTHS[activeMonthFilter] || "ឧសភា";

  if (!isLoggedIn) {
    return <LoginRegister onSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      
      {/* Dynamic Header Dashboard panel */}
      <header className="bg-gradient-to-r from-indigo-600 via-sky-600 to-sky-500 text-white shadow-xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 print:hidden sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-2xl shadow-lg border border-amber-300">
            🏫
          </div>
          <div>
            <h1 className="font-moul text-sm md:text-base tracking-wide text-amber-200">ប្រព័ន្ធគ្រប់គ្រងសិស្សទំនើប</h1>
            <p className="font-sans text-[10px] text-sky-100 font-semibold uppercase tracking-wider">
              {structure.schoolName} | ថ្នាក់ទី {structure.gradeName} | គ្រូ៖ {structure.teacherName}
            </p>
          </div>
        </div>

        {/* Configurations details */}
        <div className="flex items-center gap-3">
          {activeTab !== "home" && (
            <button
              onClick={() => setActiveTab("home")}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 active:scale-95 text-xs text-slate-900 font-extrabold font-sans rounded-xl shadow-lg shadow-amber-500/25 transition cursor-pointer flex items-center gap-1.5"
            >
              🏠 ទៅទំព័រដើម (Home)
            </button>
          )}

          <div className="hidden sm:flex flex-col text-right text-xs font-sans text-sky-100">
            <span>ឆ្នាំសិក្សា៖ {structure.academicYear}</span>
            <span>សិស្សសរុប៖ {toKhmerNumeral(students.length)} នាក់</span>
          </div>

          <button
            onClick={() => setIsClassEditorOpen(true)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-xs text-white font-sans font-bold rounded-xl shadow-md transition border border-white/10 cursor-pointer"
          >
            ✏️ កែប្រែព័ត៌មានថ្នាក់
          </button>

          <button
            onClick={() => {
              if (window.confirm("🚪 តើអ្នកពិតជាចង់ចាកចេញពីគណនីគ្រូបង្រៀនមែនទេ?")) {
                localStorage.removeItem("khmer_auth_logged_in");
                localStorage.removeItem("khmer_auth_email");
                setIsLoggedIn(false);
              }
            }}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-xs text-white font-sans font-semibold rounded-xl shadow-md transition border border-rose-500/20 cursor-pointer flex items-center gap-1 shrink-0"
          >
            🚪 ចាកចេញ
          </button>
        </div>
      </header>

      {/* Main Flex Layout Body */}
      <div className="flex-1 flex flex-col relative">

        {/* Master Detail Contents frame with smooth page entry and layout pairing */}
        <main className="flex-1 p-4 md:p-6 bg-slate-50 overflow-y-auto print:p-0 print:bg-white">
          <div className="max-w-7xl mx-auto animate-fade-in print:max-w-full">
            {/* Elegant Month Filter Bar shown only when a month-dependent page is active */}
            {["scores", "ranking", "honor"].includes(activeTab) && (
              <div className="bg-white p-4 rounded-3xl border border-slate-200/60 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 font-bold shadow-inner">
                    📅
                  </div>
                  <div>
                    <h4 className="font-moul text-[11px] text-slate-800">ជ្រើសរើសខែរបាយការណ៍</h4>
                    <p className="text-[9px] text-slate-500 font-sans">ជ្រើសរើសខែដើម្បីបង្ហាញការវិភាគ និងចំណាត់ថ្នាក់ពិន្ទុសិស្ស</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 md:justify-end">
                  {KHMER_MONTHS.map((mName, mIdx) => {
                    const isCurrent = activeMonthFilter === mIdx;
                    return (
                      <button
                        key={mIdx}
                        onClick={() => setActiveMonthFilter(mIdx)}
                        className={`px-3 py-1.5 text-[11px] font-sans font-bold rounded-xl transition border cursor-pointer ${
                          isCurrent
                            ? "bg-sky-600 border-sky-600 text-white shadow-md shadow-sky-100"
                            : "bg-white border-slate-200/60 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {mName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "home" && (
              <DashboardGrid
                students={students}
                structure={structure}
                scores={scores}
                attendance={attendance}
                onUpdateScores={setScores}
                onUpdateAttendance={setAttendance}
                setActiveTab={setActiveTab}
                openClassEditor={() => setIsClassEditorOpen(true)}
              />
            )}

            {activeTab === "students" && (
              <StudentList
                students={students}
                structure={structure}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                onClearAllStudents={handleClearAllStudents}
              />
            )}

            {activeTab === "attendance" && (
              <AttendanceRecord
                students={students}
                structure={structure}
                attendance={attendance}
                onUpdateAttendance={setAttendance}
                settings={settings}
              />
            )}

            {activeTab === "scores" && (
              <ScoreRecord
                students={students}
                structure={structure}
                scores={scores}
                onUpdateScores={setScores}
                selectedMonthName={currentMonthName}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "ranking" && (
              <RankingTable
                students={students}
                structure={structure}
                scores={scores}
                selectedMonthName={currentMonthName}
              />
            )}

            {activeTab === "honor" && (
              <HonorBoard
                students={students}
                structure={structure}
                scores={scores}
                monthName={currentMonthName}
              />
            )}

            {activeTab === "cleaning" && (
              <CleaningSchedule
                students={students}
                structure={structure}
                dutyGroups={dutyGroups}
                onUpdateDutyGroups={setDutyGroups}
              />
            )}

            {activeTab === "cards" && (
              <StudentCards
                students={students}
                structure={structure}
              />
            )}

            {activeTab === "sync" && (
              <SyncSettings
                settings={settings}
                onUpdateSettings={setSettings}
                students={students}
                structure={structure}
              />
            )}

            {activeTab === "analytics" && (
              <StudentAnalytics
                students={students}
                structure={structure}
                scores={scores}
                attendance={attendance}
              />
            )}

            {activeTab === "adminBooks" && (
              <ClassroomAdmin
                students={students}
                structure={structure}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "account" && (
              <AccountDashboard
                structure={structure}
                onUpdateStructure={setStructure}
                setActiveTab={setActiveTab}
              />
            )}
          </div>
        </main>
      </div>

      {/* Class Editor Modal overlay */}
      {isClassEditorOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in print:hidden">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <h3 className="font-sans font-bold text-gray-800 text-sm border-b border-gray-100 pb-2">
              ✏️ កែប្រែបុរេវិជ្ជាព័ត៌មានថ្នាក់ (Class Biodata)
            </h3>

            <form onSubmit={handleSaveClassBio} className="space-y-3 font-sans text-xs text-gray-700">
              <div>
                <label className="block font-bold text-gray-500 mb-0.5">ឈ្មោះសាលារៀន</label>
                <input
                  type="text"
                  value={structure.schoolName}
                  onChange={(e) => setStructure({ ...structure, schoolName: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-0.5">កម្រងសាលារៀន</label>
                <input
                  type="text"
                  value={structure.schoolCluster}
                  onChange={(e) => setStructure({ ...structure, schoolCluster: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-0.5">រដ្ឋបាល standard</label>
                <input
                  type="text"
                  value={structure.districtName}
                  onChange={(e) => setStructure({ ...structure, districtName: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-500 mb-0.5">ថ្នាក់ទី</label>
                  <input
                    type="text"
                    value={structure.gradeName}
                    onChange={(e) => setStructure({ ...structure, gradeName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 mb-0.5">ឆ្នាំសិក្សា</label>
                  <input
                    type="text"
                    value={structure.academicYear}
                    onChange={(e) => setStructure({ ...structure, academicYear: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-500 mb-0.5">ឈ្មោះគ្រូបន្ទុកថ្នាក់</label>
                  <input
                    type="text"
                    value={structure.teacherName}
                    onChange={(e) => setStructure({ ...structure, teacherName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 mb-0.5">ឈ្មោះនាយកសាលា</label>
                  <input
                    type="text"
                    value={structure.principalName}
                    onChange={(e) => setStructure({ ...structure, principalName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setIsClassEditorOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 font-bold rounded-lg cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg cursor-pointer animate-pulse"
                >
                  យល់ព្រម
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
