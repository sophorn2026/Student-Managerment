import React from "react";
import { Student, ClassStructure, ClassScores, MonthlyScores } from "../types";
import { toKhmerNumeral, formatKhmerScore, getKhmerLunarSignatureDate, getKhmerMention, exportToExcel } from "../utils";
import Header from "./Header";
import { BookOpen, Award, CheckSquare, PlusCircle, Trash, Edit, Star, Search, Download, Printer, User, Sparkles, ChevronRight, BookOpenCheck } from "lucide-react";

interface ScoreRecordProps {
  students: Student[];
  structure: ClassStructure;
  scores: MonthlyScores;
  onUpdateScores: (updated: MonthlyScores) => void;
  selectedMonthName: string;
  setActiveTab?: (tab: string) => void;
}

export default function ScoreRecord({
  students,
  structure,
  scores,
  onUpdateScores,
  selectedMonthName,
  setActiveTab
}: ScoreRecordProps) {
  const [viewMode, setViewMode] = React.useState<"input" | "sheet" | "card">("input");
  const [draftScores, setDraftScores] = React.useState<MonthlyScores>(scores);
  const [scoreType, setScoreType] = React.useState<"monthly" | "semester">("monthly");
  const [academicYear, setAcademicYear] = React.useState(structure.academicYear || "២០២៥-២០២៦");
  const [selectedMonth, setSelectedMonth] = React.useState(selectedMonthName || "មិថុនា");
  const [selectedSubject, setSelectedSubject] = React.useState<string>("គណិតវិទ្យា");
  const [activeSubTab, setActiveSubTab] = React.useState<string | null>(null);
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");

  React.useEffect(() => {
    setDraftScores(scores);
  }, [scores]);

  React.useEffect(() => {
    if (selectedMonthName) {
      setSelectedMonth(selectedMonthName);
    }
  }, [selectedMonthName]);

  const [selectedStudentId, setSelectedStudentId] = React.useState(students[0]?.id || "");
  const [editingStudentId, setEditingStudentId] = React.useState<string | null>(null);

  // Score Fields State for currently editing student
  const [reading, setReading] = React.useState(0);
  const [dictation, setDictation] = React.useState(0);
  const [composition, setComposition] = React.useState(0);
  const [mathNum, setMathNum] = React.useState(0);
  const [mathAlg, setMathAlg] = React.useState(0);
  const [mathMeas, setMathMeas] = React.useState(0);
  const [mathGeom, setMathGeom] = React.useState(0);
  const [science, setScience] = React.useState(0);
  const [morality, setMorality] = React.useState(0);
  const [geography, setGeography] = React.useState(0);
  const [history, setHistory] = React.useState(0);
  const [lifeSkills, setLifeSkills] = React.useState(0);
  const [drawing, setDrawing] = React.useState(0);
  const [sports, setSports] = React.useState(0);
  const [english, setEnglish] = React.useState(0);

  // Load scores for edit
  const openEditScores = (studentId: string) => {
    setEditingStudentId(studentId);
    const existing = scores[studentId] || {
      reading: 0, dictation: 0, composition: 0,
      mathNumber: 0, mathAlgebra: 0, mathMeasurement: 0, mathGeometry: 0,
      science: 0, morality: 0, geography: 0, history: 0, lifeSkills: 0,
      drawing: 0, sports: 0, english: 0
    };
    
    setReading(existing.reading);
    setDictation(existing.dictation);
    setComposition(existing.composition);
    setMathNum(existing.mathNumber);
    setMathAlg(existing.mathAlgebra);
    setMathMeas(existing.mathMeasurement);
    setMathGeom(existing.mathGeometry);
    setScience(existing.science);
    setMorality(existing.morality);
    setGeography(existing.geography);
    setHistory(existing.history);
    setLifeSkills(existing.lifeSkills);
    setDrawing(existing.drawing);
    setSports(existing.sports);
    setEnglish(existing.english);
  };

  const handleSaveScores = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudentId) return;

    const updatedScores: ClassScores = {
      reading, dictation, composition,
      mathNumber: mathNum, mathAlgebra: mathAlg, mathMeasurement: mathMeas, mathGeometry: mathGeom,
      science, morality, geography, history, lifeSkills, drawing, sports, english
    };

    onUpdateScores({
      ...scores,
      [editingStudentId]: updatedScores
    });
    setEditingStudentId(null);
  };

  // Pre-seed mock realistic grades for all empty students
  const autoSeedAllScores = () => {
    const updated = { ...scores };
    students.forEach((student) => {
      if (!updated[student.id]) {
        // Generate random realistic marks between 5.5 and 10.0
        const randMark = (min: number, max: number) => Math.fround((Math.random() * (max - min) + min) * 2) / 2;
        updated[student.id] = {
          reading: parseFloat(randMark(7.0, 10.0).toFixed(1)),
          dictation: parseFloat(randMark(6.0, 9.5).toFixed(1)),
          composition: parseFloat(randMark(5.5, 9.0).toFixed(1)),
          mathNumber: parseFloat(randMark(6.5, 10.0).toFixed(1)),
          mathAlgebra: parseFloat(randMark(6.0, 9.5).toFixed(1)),
          mathMeasurement: parseFloat(randMark(7.0, 9.5).toFixed(1)),
          mathGeometry: parseFloat(randMark(5.5, 9.0).toFixed(1)),
          science: parseFloat(randMark(7.0, 10.0).toFixed(1)),
          morality: parseFloat(randMark(7.5, 10.0).toFixed(1)),
          geography: parseFloat(randMark(6.5, 9.5).toFixed(1)),
          history: parseFloat(randMark(6.0, 9.0).toFixed(1)),
          lifeSkills: parseFloat(randMark(7.5, 10.0).toFixed(1)),
          drawing: parseFloat(randMark(8.0, 10.0).toFixed(1)),
          sports: parseFloat(randMark(8.0, 10.0).toFixed(1)),
          english: parseFloat(randMark(6.0, 10.0).toFixed(1))
        };
      }
    });
    onUpdateScores(updated);
    alert("បានបំពេញពិន្ទុគំរូជូនសិស្សគ្រប់រូបដោយជោគជ័យ! 🎉");
  };

  // Helper to calculate student totals
  const getStudentStats = (studentId: string) => {
    const record = scores[studentId];
    if (!record) return { total: 0, average: 0, mention: { char: "F", phrase: "ធ្លាក់", color: "text-red-500" }, rank: 1 };

    // 15 categories
    const vals = [
      record.reading, record.dictation, record.composition,
      record.mathNumber, record.mathAlgebra, record.mathMeasurement, record.mathGeometry,
      record.science, record.morality, record.geography, record.history,
      record.lifeSkills, record.drawing, record.sports, record.english
    ];

    const total = vals.reduce((a, b) => a + b, 0);
    const average = total / vals.length;
    const mention = getKhmerMention(average);

    return { total, average, mention };
  };

  // Rank computations descending
  const calculatedRanks = React.useMemo(() => {
    const list = students.map((s) => {
      const stats = getStudentStats(s.id);
      return { id: s.id, average: stats.average };
    });
    
    // Sort descending
    list.sort((a, b) => b.average - a.average);

    const ranksMap: { [id: string]: number } = {};
    list.forEach((item, index) => {
      ranksMap[item.id] = index + 1;
    });

    return ranksMap;
  }, [students, scores]);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const selectedStudentStats = selectedStudent ? getStudentStats(selectedStudentId) : null;
  const currentRank = selectedStudent ? (calculatedRanks[selectedStudentId] || 1) : 1;

  const todayStr = getKhmerLunarSignatureDate(new Date());

  const SUBJECT_FIELDS: { [key: string]: { label: string; field: keyof ClassScores }[] } = {
    "គណិតវិទ្យា": [
      { label: "ចំនួន", field: "mathNumber" },
      { label: "រង្វាស់", field: "mathMeasurement" },
      { label: "ធរណី", field: "mathGeometry" },
      { label: "ពីជគណិត", field: "mathAlgebra" },
      { label: "ស្ថិតិ", field: "english" }
    ],
    "ភាសាខ្មែរ": [
      { label: "អំណាន", field: "reading" },
      { label: "សរសេរតាមអាន", field: "dictation" },
      { label: "តែងសេចក្តី", field: "composition" }
    ],
    "វិទ្យាសាស្ត្រ & សីលធម៌": [
      { label: "វិទ្យាសាស្ត្រ", field: "science" },
      { label: "សីលធម៌", field: "morality" }
    ],
    "ភូមិវិទ្យា & ប្រវត្តិវិទ្យា": [
      { label: "ភូមិវិទ្យា", field: "geography" },
      { label: "ប្រវត្តិវិទ្យា", field: "history" }
    ],
    "បំណិនជីវិត & សិល្បៈ": [
      { label: "បំណិនជីវិត", field: "lifeSkills" },
      { label: "គំនូរ", field: "drawing" },
      { label: "កីឡា", field: "sports" }
    ]
  };

  const handleDraftScoreChange = (studentId: string, field: keyof ClassScores, valStr: string) => {
    const val = valStr === "" ? 0 : parseFloat(valStr);
    const clampedVal = Math.min(10, Math.max(0, val));
    setDraftScores(prev => {
      const currentStudentScores = prev[studentId] || {
        reading: 0, dictation: 0, composition: 0,
        mathNumber: 0, mathAlgebra: 0, mathMeasurement: 0, mathGeometry: 0,
        science: 0, morality: 0, geography: 0, history: 0, lifeSkills: 0,
        drawing: 0, sports: 0, english: 0
      };
      return {
        ...prev,
        [studentId]: {
          ...currentStudentScores,
          [field]: clampedVal
        }
      };
    });
  };

  const handleSaveAllDraftScores = () => {
    onUpdateScores(draftScores);
    setToastMessage("💾 បានរក្សាទុកទិន្នន័យពិន្ទុសិស្សទៅកាន់ Cloud Database (Firebase) រួចរាល់!");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">

      {/* Floating Success Notification Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[9999] bg-slate-900 border border-slate-800 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in font-sans">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg font-bold">
            ✓
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-100">ជោគជ័យ!</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">{toastMessage}</p>
          </div>
        </div>
      )}
      
      {/* Tab bar header */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4 print:hidden m-1">
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setViewMode("input")}
            className={`px-4 py-1.5 rounded-lg text-xs font-sans font-bold cursor-pointer transition ${
              viewMode === "input" ? "bg-white text-sky-950 shadow-sm" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            📝 ទម្រង់បញ្ចូលពិន្ទុ (Input Form)
          </button>
          <button
            onClick={() => setViewMode("sheet")}
            className={`px-4 py-1.5 rounded-lg text-xs font-sans font-bold cursor-pointer transition ${
              viewMode === "sheet" ? "bg-white text-sky-950 shadow-sm" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            📊 បាក់ឌុបសរុប (Score Sheet)
          </button>
          <button
            onClick={() => setViewMode("card")}
            className={`px-4 py-1.5 rounded-lg text-xs font-sans font-bold cursor-pointer transition ${
              viewMode === "card" ? "bg-white text-sky-950 shadow-sm" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            📖 សៀវភៅតាមដានសិក្សា (Individual Card)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={autoSeedAllScores}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-bold rounded-xl shadow-md cursor-pointer transition active:scale-95 flex items-center gap-1"
          >
            <Sparkles size={13} />
            បំពេញពិន្ទុគំរូ
          </button>
          <button
            onClick={() => exportToExcel("score-sheet-element", `report-scores-${selectedMonthName}`)}
            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200"
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

      {/* Main Container Views */}

      {/* VIEW 0: High-fidelity entry form matching the requested screenshot */}
      {viewMode === "input" && (
        <div className="space-y-6">
          
          {/* Custom Header with Deep Purple Indigo color matching #2d3277 exactly */}
          <div className="bg-[#2d3277] text-white p-4 rounded-3xl flex items-center justify-between shadow-xl print:hidden relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 to-purple-900/20 pointer-events-none"></div>
            <button
              onClick={() => setActiveTab && setActiveTab("home")}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-xs text-white font-extrabold font-sans rounded-xl transition cursor-pointer flex items-center gap-1.5 z-10"
            >
              ← ត្រឡប់
            </button>
            <h2 className="font-moul text-xs md:text-sm text-white tracking-wide z-10 font-bold">
              បញ្ចូលពិន្ទុ (Online)
            </h2>
            <button
              onClick={() => setViewMode("sheet")}
              className="px-4 py-2 bg-[#22c55e] hover:bg-[#16a34a] active:scale-95 text-xs text-white font-extrabold font-sans rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1.5 z-10"
            >
              田 តារាងពិន្ទុ
            </button>
          </div>

          {/* Green Top Border Main Card Wrapper */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md relative overflow-hidden">
            {/* The Green strip accent in the screenshot */}
            <div className="h-2 w-full bg-[#34d399]"></div>
            
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Heading with Student Profile Input banner */}
              <div className="space-y-1">
                <h2 className="font-moul text-lg md:text-xl text-[#2a2d64] font-bold">
                  ទម្រង់បញ្ចូលពិន្ទុសិស្ស
                </h2>
                <p className="text-xs text-slate-400 font-sans tracking-wide">
                  ទិន្នន័យនឹងត្រូវបានរក្សាទុកក្នុង Online Database (Firebase)
                </p>
              </div>

              {/* Responsive 3D Configurations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
                
                {/* 1. Types of score selection */}
                <div className="col-span-1 md:col-span-3 xl:col-span-1 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-sans">
                    ជ្រើសរើសប្រភេទពិន្ទុ
                  </span>
                  <div className="flex bg-slate-100 p-1 rounded-2xl w-full">
                    <button
                      type="button"
                      onClick={() => setScoreType("monthly")}
                      className={`flex-1 py-3 text-xs font-sans font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        scoreType === "monthly"
                          ? "bg-[#4f46e5] text-white shadow-md active:scale-98"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      🏆 ពិន្ទុប្រចាំខែ
                    </button>
                    <button
                      type="button"
                      onClick={() => setScoreType("semester")}
                      className={`flex-1 py-3 text-xs font-sans font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        scoreType === "semester"
                          ? "bg-[#4f46e5] text-white shadow-md active:scale-98"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      🎖️ ពិន្ទុប្រចាំឆមាស
                    </button>
                  </div>
                </div>

                {/* 2. Academic Year */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-sans">
                    ឆ្នាំសិក្សា
                  </span>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                      📅
                    </div>
                    <select
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200/85 rounded-2xl text-xs font-sans font-bold text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition appearance-none cursor-pointer"
                    >
                      <option value="២០២៥-២០២៦">២០២៥-២០២៦</option>
                      <option value="២០២៦-២០២៧">២០២៦-២០២៧</option>
                      <option value="២០២ presentation">២០២៧-២០២៨</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-450 text-xs text-[10px]">
                      ▼
                    </div>
                  </div>
                </div>

                {/* 3. Month selector */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-sans">
                    ខែ
                  </span>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                      ⏰
                    </div>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200/85 rounded-2xl text-xs font-sans font-bold text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition appearance-none cursor-pointer"
                    >
                      {["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"].map((m, idx) => (
                        <option key={idx} value={m}>
                          ខែ{m} ឆ្នាំ ២០២៦
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-450 text-xs text-[10px]">
                      ▼
                    </div>
                  </div>
                </div>

                {/* 4. Subject Selector */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-sans">
                      មុខវិជ្ជា
                    </span>
                    <div className="flex gap-1.5 text-[10px] font-sans font-bold">
                      <button
                        type="button"
                        onClick={() => {
                          setToastMessage("🎨 មុខងារបន្ថែមមុខវិជ្ជាថ្មីកំពុងស្ថិតក្នុងការអភិវឌ្ឍន៍!");
                          setShowToast(true);
                          setTimeout(() => setShowToast(false), 3000);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-lg transition cursor-pointer"
                      >
                        + បន្ថែម
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setToastMessage("⚙️ សូមទាក់ទងអ្នកគ្រប់គ្រងដើម្បីកែប្រែបញ្ជីមុខវិជ្ជាថ្នាក់ជាតិ!");
                          setShowToast(true);
                          setTimeout(() => setShowToast(false), 3000);
                        }}
                        className="text-rose-600 hover:text-rose-800 bg-rose-50 px-2 py-0.5 rounded-lg transition cursor-pointer"
                      >
                        ⚙️ គ្រប់គ្រង
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                      📖
                    </div>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200/85 rounded-2xl text-xs font-sans font-bold text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition appearance-none cursor-pointer"
                    >
                      {Object.keys(SUBJECT_FIELDS).map((subj, idx) => (
                        <option key={idx} value={subj}>
                          {subj}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-450 text-xs text-[10px]">
                      ▼
                    </div>
                  </div>
                </div>

              </div>

              {/* Beautiful Sub-Component Fast Selection Shortcut Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                {[
                  { id: "oral", label: "បញ្ចូលពិន្ទុ សំណួរផ្ទាល់មាត់", emoji: "🎙️", bg: "bg-blue-50/50 border-blue-100 text-blue-900 font-bold" },
                  { id: "attendance", label: "បញ្ចូលពិន្ទុ វត្តមាន", emoji: "👥", bg: "bg-emerald-50/50 border-emerald-100 text-emerald-900 font-bold" },
                  { id: "notebook", label: "បញ្ចូលពិន្ទុ សៀវភៅ", emoji: "📖", bg: "bg-purple-50/50 border-purple-100 text-purple-900 font-bold" },
                  { id: "homework", label: "បញ្ចូលពិន្ទុ កិច្ចការផ្ទះ", emoji: "🏠", bg: "bg-amber-50/50 border-amber-100 text-amber-900 font-bold" }
                ].map((item) => {
                  const isActive = activeSubTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSubTab(isActive ? null : item.id)}
                      className={`p-3.5 rounded-3xl border text-left transition-all duration-300 cursor-pointer flex items-center space-x-3 select-none active:scale-95 ${
                        isActive
                          ? "bg-indigo-50 border-[#4f46e5]/40 -translate-y-0.5 shadow-md shadow-indigo-150"
                          : `${item.bg} hover:border-slate-300`
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-base shadow-sm border border-slate-100">
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-moul text-[9px] text-[#2a2d64] leading-normal truncate">{item.label}</h4>
                        <p className="text-[8px] text-slate-400 font-sans mt-0.5">សកម្មភាពសិក្សា</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Central Table Data Entry Block */}
              <div className="overflow-x-auto border border-slate-200/80 rounded-2xl max-w-full">
                <table className="font-sans text-xs w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-705 border-b border-slate-200 font-bold text-center select-none text-[11px]">
                      <th className="py-3 border-r border-slate-200/80 w-12 text-center">ល.រ</th>
                      <th className="border-r border-slate-200/80 text-left px-4 w-52">ឈ្មោះសិស្ស</th>
                      {SUBJECT_FIELDS[selectedSubject]?.map((item, idx) => (
                        <th key={idx} className="border-r border-slate-200/80 px-2 py-3 w-28 text-center bg-indigo-50/10 text-indigo-950 font-bold">
                          {item.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, sIdx) => {
                      return (
                        <tr
                          key={student.id}
                          className="border-b border-slate-150 last:border-b-0 hover:bg-slate-50/40 text-center font-sans tracking-wide transition duration-150"
                        >
                          {/* S.N. */}
                          <td className="py-3 border-r border-slate-200/80 font-bold text-slate-400 text-center">
                            {toKhmerNumeral(sIdx + 1)}
                          </td>
                          {/* Student Details with Photo */}
                          <td className="border-r border-slate-200/80 text-left px-3 py-2 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-indigo-200 bg-indigo-50 flex-shrink-0">
                              <img
                                src={student.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.khmerName)}`}
                                alt={student.khmerName}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="truncate">
                              <p className="font-bold text-slate-800 text-[11px] font-sans">{student.khmerName}</p>
                              <p className="text-[9px] text-slate-400 font-mono">អត្តលេខ៖ {toKhmerNumeral(student.id)}</p>
                            </div>
                          </td>
                          {/* Dynamically matching inputs */}
                          {SUBJECT_FIELDS[selectedSubject]?.map((item, idx) => {
                            return (
                              <td key={idx} className="border-r border-slate-200/80 py-2.5">
                                <div className="flex items-center justify-center p-0.5">
                                  <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={draftScores[student.id]?.[item.field] ?? ""}
                                    placeholder="-"
                                    onChange={(e) => {
                                      handleDraftScoreChange(student.id, item.field, e.target.value);
                                    }}
                                    className="w-14 h-10 text-center font-bold text-[12px] font-sans bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 hover:border-slate-300 rounded-xl transition focus:outline-none placeholder-slate-400 shadow-inner"
                                  />
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons Block */}
              <div className="space-y-4 pt-3">
                <button
                  type="button"
                  onClick={handleSaveAllDraftScores}
                  className="w-full py-4 bg-[#22c55e] hover:bg-[#16a34a] active:scale-99 text-white font-moul tracking-wide text-xs md:text-sm font-extrabold rounded-2xl shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center gap-2 select-none"
                >
                  💾 រក្សាទុកពិន្ទុ (Cloud)
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("sheet")}
                  className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold font-sans text-xs hover:bg-slate-50 border-slate-350 rounded-2xl active:scale-99 shadow-sm transition cursor-pointer flex items-center justify-center gap-2 select-none"
                >
                  田 មើលតារាងពិន្ទុសរុប
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* VIEW 1: Score Sheet Registry Grid */}
      {viewMode === "sheet" && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm print:p-0 print:border-0 print:shadow-none m-1">
          {/* Kingdom Standard Header */}
          <Header structure={structure} />

          <div className="text-center my-6">
            <h2 className="font-sans text-xl md:text-2xl font-bold text-sky-950">
              តារាងស្រង់ពិន្ទុសិស្សប្រចាំខែ{selectedMonthName}
            </h2>
            <p className="font-sans text-xs text-gray-500 mt-1">
              គណនាចំណាត់ថ្នាក់ដាច់ដោយឡែកផ្អែកលើពិន្ទុមធ្យមភាគសរុប (១៥ ជម្រើសមុខវិជ្ជា)
            </p>
          </div>

          {/* Table list */}
          <div className="overflow-x-auto border border-gray-200 rounded-2xl max-w-full my-6">
            <table id="score-sheet-element" className="font-sans text-[10px] w-full border-collapse">
              <thead>
                {/* Subject Categories header groups */}
                <tr className="bg-sky-50 text-sky-950 border-b border-gray-200 font-bold text-center text-[9px]">
                  <th colSpan={4} className="py-2 border-r border-gray-200">ព័ត៌មានលម្អិតសិស្ស</th>
                  <th colSpan={3} className="border-r border-gray-200 bg-[#eff6ff]">ភាសាខ្មែរ</th>
                  <th colSpan={4} className="border-r border-gray-200 bg-teal-50/55">គណិតវិទ្យា (Maths)</th>
                  <th colSpan={8} className="border-r border-gray-200">អត្តវិទ្យាផ្សេងៗ (Other Subjects)</th>
                  <th colSpan={4} className="bg-emerald-50 text-emerald-950">របាយការណ៍សរុប</th>
                </tr>
                {/* Specific subjects headers */}
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold text-center text-[8px] leading-tight select-none">
                  <th className="py-2 border-r border-gray-200 w-8">ល.រ</th>
                  <th className="border-r border-gray-200 w-12">អត្តលេខ</th>
                  <th className="border-r border-gray-200 text-left px-2 w-28">គោត្តនាម-នាម</th>
                  <th className="border-r border-gray-200 w-8">ភេទ</th>
                  {/* Khmer */}
                  <th className="border-r border-gray-200 px-1 bg-[#eff6ff] w-12">អំណាន</th>
                  <th className="border-r border-gray-200 px-1 bg-[#eff6ff] w-12">សរសេរអាន</th>
                  <th className="border-r border-gray-200 px-1 bg-[#eff6ff] w-12">តែងសេចក្ដី</th>
                  {/* Maths */}
                  <th className="border-r border-gray-200 px-1 bg-teal-50/50 w-12">ចំនួន</th>
                  <th className="border-r border-gray-200 px-1 bg-teal-50/50 w-12">ពេជ្រគណិត</th>
                  <th className="border-r border-gray-200 px-1 bg-teal-50/50 w-12">រង្វាស់</th>
                  <th className="border-r border-gray-200 px-1 bg-teal-50/50 w-12">ធរណីមាត្រ</th>
                  {/* Others */}
                  <th className="border-r border-gray-200 px-0.5 w-12">វិទ្យាសាស្ត្រ</th>
                  <th className="border-r border-gray-200 px-0.5 w-12">សីលធម៌</th>
                  <th className="border-r border-gray-200 px-0.5 w-12">ភូមិវិទ្យា</th>
                  <th className="border-r border-gray-200 px-0.5 w-12">ប្រវត្តិវិទ្យា</th>
                  <th className="border-r border-gray-200 px-0.5 w-12">បំណិន</th>
                  <th className="border-r border-gray-200 px-0.5 w-12">គំនូរ</th>
                  <th className="border-r border-gray-200 px-0.5 w-12">កីឡា</th>
                  <th className="border-r border-gray-200 px-0.5 w-12">អង់គ្លេស</th>
                  {/* Summary summaries */}
                  <th className="bg-emerald-50 text-emerald-950 border-r border-gray-200 w-16">ពិន្ទុសរុប</th>
                  <th className="bg-emerald-50 text-emerald-950 border-r border-gray-200 w-14">មធ្យមភាគ</th>
                  <th className="bg-emerald-50 text-emerald-950 border-r border-gray-200 w-12">ចំណាត់ថ្នាក់</th>
                  <th className="bg-emerald-50 text-emerald-950">កែប្រែ</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, sIdx) => {
                  const record = scores[student.id];
                  const stats = getStudentStats(student.id);
                  const rank = calculatedRanks[student.id] || sIdx + 1;

                  return (
                    <tr key={student.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/30 text-center font-sans">
                      <td className="py-2.5 border-r border-gray-200 font-bold text-gray-500">{toKhmerNumeral(sIdx + 1)}</td>
                      <td className="border-r border-gray-200 font-bold text-sky-950 bg-sky-50/5">{toKhmerNumeral(student.id)}</td>
                      <td className="border-r border-gray-200 text-left font-bold text-gray-800 px-2 truncate max-w-[120px]">{student.khmerName}</td>
                      <td className={`border-r border-gray-200 font-semibold ${student.gender === "ស្រី" ? "text-rose-600" : "text-sky-700"}`}>
                        {student.gender}
                      </td>

                      {record ? (
                        <>
                          <td className="border-r border-gray-200">{formatKhmerScore(record.reading)}</td>
                          <td className="border-r border-gray-200">{formatKhmerScore(record.dictation)}</td>
                          <td className="border-r border-gray-200">{formatKhmerScore(record.composition)}</td>
                          <td className="border-r border-gray-200 bg-teal-50/10">{formatKhmerScore(record.mathNumber)}</td>
                          <td className="border-r border-gray-200 bg-teal-50/10">{formatKhmerScore(record.mathAlgebra)}</td>
                          <td className="border-r border-gray-200 bg-teal-50/10">{formatKhmerScore(record.mathMeasurement)}</td>
                          <td className="border-r border-gray-200 bg-teal-50/10">{formatKhmerScore(record.mathGeometry)}</td>
                          <td className="border-r border-gray-200">{formatKhmerScore(record.reading)}</td>
                          <td className="border-r border-gray-200">{formatKhmerScore(record.morality)}</td>
                          <td className="border-r border-gray-200">{formatKhmerScore(record.geography)}</td>
                          <td className="border-r border-gray-200">{formatKhmerScore(record.history)}</td>
                          <td className="border-r border-gray-200">{formatKhmerScore(record.lifeSkills)}</td>
                          <td className="border-r border-gray-200">{formatKhmerScore(record.drawing)}</td>
                          <td className="border-r border-gray-200">{formatKhmerScore(record.sports)}</td>
                          <td className="border-r border-gray-200">{formatKhmerScore(record.english)}</td>
                          <td className="border-r border-gray-200 font-bold text-sky-800 bg-sky-50/10">{toKhmerNumeral(stats.total.toFixed(2))}</td>
                          <td className="border-r border-gray-200 font-extrabold text-gray-900 bg-emerald-50/10">{toKhmerNumeral(stats.average.toFixed(2))}</td>
                          <td className="border-r border-gray-200 font-extrabold text-[#1d4ed8] bg-sky-50">{toKhmerNumeral(rank)}</td>
                          <td className="print:hidden">
                            <button
                              onClick={() => openEditScores(student.id)}
                              className="p-1 text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-md cursor-pointer transition"
                            >
                              <Edit size={11} />
                            </button>
                          </td>
                        </>
                      ) : (
                        <td colSpan={19} className="py-2.5 text-center text-gray-300 font-semibold italic bg-gray-50/50">
                          - មិនទាន់មានពិន្ទុ (សូមចុចបំពេញគំរូ ឬចុចកែប្រែគ្រាប់ចុចខាងស្ដាំ) -
                          <button
                            onClick={() => openEditScores(student.id)}
                            className="ml-3 px-2.5 py-0.5 bg-sky-600 text-white rounded text-[8px] font-bold inline-flex items-center gap-1 cursor-pointer print:hidden"
                          >
                            <PlusCircle size={10} /> បញ្ចូលពិន្ទុ
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Embedded Editor Modal Form */}
          {editingStudentId && (
            <div className="fixed inset-0 bg-black/50 overflow-y-auto flex items-center justify-center p-4 z-50 animate-fade-in print:hidden">
              <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-gray-100 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <h4 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-1">
                    <BookOpenCheck size={16} className="text-sky-600" />
                    បញ្ចូលពិន្ទុសិស្ស៖ {students.find((s)=>s.id === editingStudentId)?.khmerName} (ID: {toKhmerNumeral(editingStudentId)})
                  </h4>
                  <button onClick={() => setEditingStudentId(null)} className="text-gray-400 hover:text-gray-600 font-bold font-sans text-xs">✕ ឧបករណ៍</button>
                </div>

                <form onSubmit={handleSaveScores} className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans text-xs">
                  {/* Category 1: Khmer */}
                  <div className="col-span-2 sm:col-span-4 border-b border-gray-100 pb-1 font-bold text-sky-800 text-[11px]">ផ្នែកភាសាខ្មែរ (ពិន្ទុពេញ ១០)៖</div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">អំណាន</label>
                    <input type="number" step="0.1" min="0" max="10" required value={reading} onChange={(e)=>setReading(parseFloat(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">សរសេរអាន</label>
                    <input type="number" step="0.1" min="0" max="10" required value={dictation} onChange={(e)=>setDictation(parseFloat(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">តែងសេចក្ដី</label>
                    <input type="number" step="0.1" min="0" max="10" required value={composition} onChange={(e)=>setComposition(parseFloat(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded-md" />
                  </div>

                  {/* Category 2: Math */}
                  <div className="col-span-2 sm:col-span-4 border-b border-gray-100 pb-1 font-bold text-teal-800 text-[11px] pt-2">ផ្នែកគណិតវិទ្យា (Maths)៖</div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">ចំនួន</label>
                    <input type="number" step="0.1" min="0" max="10" required value={mathNum} onChange={(e)=>setMathNum(parseFloat(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded-md bg-teal-50/10" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">ពេជ្រគណិត</label>
                    <input type="number" step="0.1" min="0" max="10" required value={mathAlg} onChange={(e)=>setMathAlg(parseFloat(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded-md bg-teal-50/10" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">រង្វាស់</label>
                    <input type="number" step="0.1" min="0" max="10" required value={mathMeas} onChange={(e)=>setMathMeas(parseFloat(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded-md bg-teal-50/10" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">ធរណីមាត្រ</label>
                    <input type="number" step="0.1" min="0" max="10" required value={mathGeom} onChange={(e)=>setMathGeom(parseFloat(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded-md bg-teal-50/10" />
                  </div>

                  {/* Category 3: Others */}
                  <div className="col-span-2 sm:col-span-4 border-b border-gray-100 pb-1 font-bold text-gray-800 text-[11px] pt-2">មុខវិជ្ជាចំណេះដឹងទូទៅ៖</div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">វិទ្យាសាស្ត្រ</label>
                    <input type="number" step="0.1" min="0" max="10" required value={science} onChange={(e)=>setScience(parseFloat(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">សីលធម៌</label>
                    <input type="number" step="0.1" min="0" max="10" required value={morality} onChange={(e)=>setMorality(parseFloat(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">ភូមិវិទ្យា</label>
                    <input type="number" step="0.1" min="0" max="10" required value={geography} onChange={(e)=>setGeography(parseFloat(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">ប្រវត្តិវិទ្យា</label>
                    <input type="number" step="0.1" min="0" max="10" required value={history} onChange={(e)=>setHistory(parseFloat(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">អប់រំបំណិន</label>
                    <input type="number" step="0.1" min="0" max="10" required value={lifeSkills} onChange={(e)=>setLifeSkills(parseFloat(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">គំនូរ</label>
                    <input type="number" step="0.1" min="0" max="10" required value={drawing} onChange={(e)=>setDrawing(parseFloat(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">កីឡា</label>
                    <input type="number" step="0.1" min="0" max="10" required value={sports} onChange={(e)=>setSports(parseFloat(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">អង់គ្លេស</label>
                    <input type="number" step="0.1" min="0" max="10" required value={english} onChange={(e)=>setEnglish(parseFloat(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded-md" />
                  </div>

                  <div className="col-span-2 sm:col-span-4 flex justify-end gap-2 pt-4 border-t border-gray-50">
                    <button type="button" onClick={() => setEditingStudentId(null)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl cursor-pointer">បោះបង់</button>
                    <button type="submit" className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl cursor-pointer">រក្សាទុក</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: Individual student tracking card (Image 5 and 6) */}
      {viewMode === "card" && selectedStudent && selectedStudentStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-sans">
          {/* Navigator Side columns */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3 print:hidden max-h-[500px] overflow-y-auto m-1">
            <h4 className="text-xs font-bold text-gray-500 border-b border-gray-50 pb-2">ជ្រើសរើសសិស្សដើម្បីមើលប័ណ្ណ៖</h4>
            <div className="space-y-1.5">
              {students.map((student) => {
                const isSelected = student.id === selectedStudentId;
                return (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`w-full py-2 px-3 border rounded-xl text-left font-sans text-xs cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? "border-sky-500 bg-sky-50/50 text-sky-950 font-bold"
                        : "border-gray-100 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{student.khmerName}</span>
                    <ChevronRight size={12} className={isSelected ? "text-sky-600" : "text-gray-300"} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Major Report Card Sheet matching layout and fields of image 5 */}
          <div className="md:col-span-3 bg-white p-6 md:p-8 rounded-3xl border border-sky-200 shadow-sm print:p-0 print:border-0 print:shadow-none relative m-1">
            
            {/* Cambodian classic border graphic */}
            <div className="absolute inset-2 border-2 border-dashed border-sky-450/40 rounded-2xl pointer-events-none -z-10 print:border-sky-600"></div>

            {/* Book title and Header */}
            <div className="text-center relative">
              <Header structure={structure} />
              <h2 className="font-sans text-xl md:text-2xl font-bold text-amber-600 mt-2">សៀវភៅការសិក្សាតាមដានលទ្ធផល</h2>
              <span className="text-xs font-bold bg-sky-50 text-sky-950 px-4 py-1 rounded-full mt-1 inline-block border border-sky-100">
                លទ្ធផលប្រចាំខែ៖ {selectedMonthName}
              </span>
            </div>

            {/* Split panels - Left block: Identical to Image 5 Left part (Biodata)
                              - Right block: Subject Score records layout like image 5 right part */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6 pt-4 border-t border-gray-100">
              
              {/* Left Side: Photo Frame & Student Biodata */}
              <div className="border border-sky-100 bg-sky-50/10 p-4 rounded-2xl space-y-4">
                <div className="flex flex-col items-center">
                  {/* Photo Frame */}
                  <div className="w-24 h-32 bg-gray-50 rounded-xl overflow-hidden border-2 border-sky-400 p-0.5 shadow-sm flex items-center justify-center">
                    <img
                      src={selectedStudent.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedStudent.khmerName)}`}
                      alt={selectedStudent.khmerName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-sans text-xs font-bold text-sky-900 mt-2">អត្តលេខ៖ {toKhmerNumeral(selectedStudent.id)}</span>
                </div>

                <div className="space-y-2.5 text-xs font-sans text-gray-800 border-t border-gray-50 pt-3">
                  <p><strong>គោត្តនាម និងនាម៖</strong> <span className="font-bold text-base text-sky-950">{selectedStudent.khmerName}</span></p>
                  <p><strong>ភេទ៖</strong> {selectedStudent.gender}</p>
                  <p><strong>ថ្ងៃខែឆ្នាំកំណើត៖</strong> {toKhmerNumeral(selectedStudent.birthDate)}</p>
                  <p><strong>ទីកន្លែងកំណើត៖</strong> {selectedStudent.birthPlace}</p>
                  <p><strong>ឈ្មោះឪពុក៖</strong> {selectedStudent.fatherName || "កូនខ្មែរ"} (មុខរបរ៖ {selectedStudent.fatherJob || "កសិករ"})</p>
                  <p><strong>ឈ្មោះម្ដាយ៖</strong> {selectedStudent.motherName || "កូនខ្មែរ"} (មុខរបរ៖ {selectedStudent.motherJob || "លក់ដូរ"})</p>
                  <p><strong>លេខទូរស័ព្ទអាណាព្យាបាល៖</strong> <span className="font-bold">{selectedStudent.guardianPhone}</span></p>
                  <p><strong>អាសយដ្ឋានបច្ចុប្បន្ន៖</strong> {selectedStudent.address}</p>
                </div>
              </div>

              {/* Right Side: Score Records table */}
              <div className="border border-sky-100 rounded-2xl overflow-hidden bg-white">
                <div className="bg-sky-600 text-white py-2 px-3 text-center font-bold text-xs tracking-wide">
                  តារាងពិន្ទុបញ្ជីសរុប (Score Book)
                </div>

                {scores[selectedStudentId] ? (
                  <table className="w-full text-center text-xs border-collapse">
                    <thead>
                      <tr className="bg-sky-50 text-sky-950 border-b border-sky-100 font-bold text-[10px]">
                        <th className="py-2 border-r border-sky-100 w-12 text-center">ល.រ</th>
                        <th className="py-2 border-r border-sky-100 text-left px-3">មុខវិជ្ជា</th>
                        <th className="py-2 border-r border-sky-100">ពិន្ទុអតិបរមា</th>
                        <th className="py-2 border-r border-sky-100 text-sky-900">ពិន្ទុទទួលបាន</th>
                        <th className="py-2">និទ្ទេស</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Generates rows matching keys of scores */}
                      {[
                        { name: "អំណាន", score: scores[selectedStudentId].reading },
                        { name: "សរសេរតាមអាន", score: scores[selectedStudentId].dictation },
                        { name: "តែងសេចក្ដី", score: scores[selectedStudentId].composition },
                        { name: "គណិតវិទ្យា-ចំនួន", score: scores[selectedStudentId].mathNumber },
                        { name: "គណិតវិទ្យា-ពេជ្រគណិត", score: scores[selectedStudentId].mathAlgebra },
                        { name: "គណិតវិទ្យា-រង្វាស់", score: scores[selectedStudentId].mathMeasurement },
                        { name: "គណិតវិទ្យា-ធរណីមាត្រ", score: scores[selectedStudentId].mathGeometry },
                        { name: "វិទ្យាសាស្ត្រ", score: scores[selectedStudentId].science },
                        { name: "សីលធម៌", score: scores[selectedStudentId].morality },
                        { name: "ភូមិវិទ្យា", score: scores[selectedStudentId].geography },
                        { name: "ប្រវត្តិវិទ្យា", score: scores[selectedStudentId].history },
                        { name: "អប់រំបំណិន", score: scores[selectedStudentId].lifeSkills },
                        { name: "គំនូរ", score: scores[selectedStudentId].drawing },
                        { name: "កីឡា", score: scores[selectedStudentId].sports },
                        { name: "អង់គ្លេស", score: scores[selectedStudentId].english }
                      ].map((item, idx) => {
                        const scoreRate = item.score / 10 * 100;
                        let mentionChar = "D";
                        if (scoreRate >= 90) mentionChar = "A";
                        else if (scoreRate >= 80) mentionChar = "B";
                        else if (scoreRate >= 65) mentionChar = "C";
                        else if (scoreRate >= 50) mentionChar = "D";
                        else mentionChar = "F";

                        return (
                          <tr key={idx} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                            <td className="py-1 border-r border-gray-150 font-bold text-gray-500">{toKhmerNumeral(idx + 1)}</td>
                            <td className="py-1 border-r border-gray-150 text-left px-3 font-semibold text-gray-800">{item.name}</td>
                            <td className="py-1 border-r border-gray-150 font-bold text-gray-400">១០</td>
                            <td className="py-1 border-r border-gray-100 font-extrabold text-sky-900 bg-sky-50/20">{formatKhmerScore(item.score)}</td>
                            <td className="py-1 font-bold text-sky-700">{mentionChar}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-20 text-center font-sans text-gray-400 font-semibold italic">
                    មិនទាន់បានបញ្ចូលពិន្ទុប្រចាំខែសម្រាប់សិស្សរូបនេះទេ...
                  </div>
                )}
              </div>
            </div>

            {/* Embedded summary cards inside book card */}
            <div className="grid grid-cols-3 gap-3 font-sans text-center my-6 print:grid">
              <div className="bg-[#eff6ff] p-3 rounded-2xl border border-blue-100">
                <span className="text-[10px] text-blue-700 font-bold block uppercase">ពិន្ទុសរុប</span>
                <span className="text-base font-extrabold text-blue-950 font-sans">{toKhmerNumeral(selectedStudentStats.total.toFixed(2))}</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                <span className="text-[10px] text-emerald-700 font-bold block uppercase">មធ្យមភាគ</span>
                <span className="text-base font-extrabold text-emerald-950 font-sans">{toKhmerNumeral(selectedStudentStats.average.toFixed(2))}</span>
              </div>
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
                <span className="text-[10px] text-amber-700 font-bold block uppercase">ចំណាត់ថ្នាក់</span>
                <span className="text-base font-extrabold text-amber-950 font-sans">{toKhmerNumeral(currentRank)} / {toKhmerNumeral(students.length)}</span>
              </div>
            </div>

            {/* Bottom Signature Sign-off exactly matching traditional layout */}
            <div className="flex flex-col md:flex-row justify-between items-start pt-10 px-4 font-sans text-xs md:text-sm text-gray-700 space-y-6 md:space-y-0 print:flex-row print:space-y-0 print:pt-4">
              <div className="text-center font-bold flex flex-col items-center">
                <span className="text-gray-500 text-xs mb-1 font-normal">បានឃើញ និងឯកភាព</span>
                <span className="text-sky-950 font-sans font-bold py-1">នាយកសាលា</span>
                <div className="h-16"></div>
                <span className="text-gray-800 font-semibold border-b-2 border-transparent">{structure.principalName}</span>
              </div>

              <div className="text-center font-bold flex flex-col items-center md:ml-auto">
                <span className="italic font-normal text-gray-500 font-sans text-[11px] whitespace-pre-wrap text-center leading-normal">
                  {todayStr}
                </span>
                <span className="text-sky-950 font-sans font-bold py-1 text-center font-sans">គ្រូទទួលបន្ទុកថ្នាក់</span>
                <div className="h-16"></div>
                <span className="text-gray-800 font-semibold border-b-2 border-transparent">{structure.teacherName}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
