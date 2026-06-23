import React from "react";
import { Student, ClassStructure } from "../types";
import { toKhmerNumeral, exportDataToCSV, exportToExcel } from "../utils";
import Header from "./Header";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  UserCheck, 
  ShieldAlert, 
  ArrowDownWideNarrow, 
  Download, 
  Upload, 
  Eye, 
  MapPin, 
  Home, 
  Award, 
  Users, 
  FileText, 
  Info, 
  Camera, 
  Image as ImageIcon,
  Printer,
  ArrowLeft
} from "lucide-react";

interface StudentListProps {
  students: Student[];
  structure: ClassStructure;
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onClearAllStudents?: () => void;
}

const AVATAR_PRESETS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&hair=short01&eyes=happy",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&hair=long01&eyes=wink",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Jack&hair=short02&eyes=surprised",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Maya&hair=bob01&eyes=happy",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Leo&hair=short03&eyes=wink",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe&hair=long02&eyes=happy",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Sam&hair=short04&eyes=happy",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Elena&hair=long03&eyes=sparkle"
];

const CAMBODIA_PROVINCES = [
  "ភ្នំពេញ", "សៀមរាប", "បាត់ដំបង", "កំពង់ចាម", "កណ្តាល", 
  "ព្រះសីហនុ", "កំពត", "បន្ទាយមានជ័យ", "ស្វាយរៀង", "ព្រៃវែង", 
  "តាកែវ", "កំពង់ស្ពឺ", "កំពង់ធំ", "ពោធិ៍សាត់", "ក្រចេះ", 
  "ស្ទឹងត្រែង", "រតនគិរី", "មណ្ឌលគិរី", "ព្រះវិហារ", "ឧត្តរមានជ័យ", 
  "ប៉ៃលិន", "កែប", "កោះកុង", "ត្បូងឃ្មុំ"
];

export default function StudentList({
  students,
  structure,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onClearAllStudents
}: StudentListProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(null);
  const [activeTab, setActiveTab] = React.useState<"manager" | "roster">("roster");
  const [showPrintView, setShowPrintView] = React.useState(false);

  // Extended Advanced Form States
  const [id, setId] = React.useState("");
  const [khmerName, setKhmerName] = React.useState("");
  const [latinName, setLatinName] = React.useState("");
  const [gender, setGender] = React.useState<"ប្រុស" | "ស្រី">("ស្រី");
  const [birthDate, setBirthDate] = React.useState("");
  const [guardianPhone, setGuardianPhone] = React.useState("");
  const [fromGrade, setFromGrade] = React.useState("");
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [notes, setNotes] = React.useState("");

  // Place of Birth
  const [birthProvince, setBirthProvince] = React.useState("");
  const [birthDistrict, setBirthDistrict] = React.useState("");
  const [birthCommune, setBirthCommune] = React.useState("");
  const [birthVillage, setBirthVillage] = React.useState("");

  // Current Address
  const [addressProvince, setAddressProvince] = React.useState("");
  const [addressDistrict, setAddressDistrict] = React.useState("");
  const [addressCommune, setAddressCommune] = React.useState("");
  const [addressVillage, setAddressVillage] = React.useState("");

  // Scholar & Status dropdowns
  const [isNewStudent, setIsNewStudent] = React.useState("បាទ/ចាស");
  const [isRepeated, setIsRepeated] = React.useState("ទេ");
  const [poorStatus, setPoorStatus] = React.useState("ទេ");
  const [disability, setDisability] = React.useState("ទេ");
  const [idPoorCard, setIdPoorCard] = React.useState("គ្មាន");
  const [isEthnic, setIsEthnic] = React.useState("ទេ");
  const [scholarship, setScholarship] = React.useState("ទេ");

  // Family details
  const [fatherName, setFatherName] = React.useState("");
  const [fatherJob, setFatherJob] = React.useState("");
  const [motherName, setMotherName] = React.useState("");
  const [motherJob, setMotherJob] = React.useState("");
  const [guardianName, setGuardianName] = React.useState("");
  const [guardianJob, setGuardianJob] = React.useState("");

  // Other configurations
  const [ethnicGroup, setEthnicGroup] = React.useState("");
  const [specialTrait, setSpecialTrait] = React.useState("");

  // Temporary UI popup flags
  const [showAvatarGrid, setShowAvatarGrid] = React.useState(false);
  const [showCameraInput, setShowCameraInput] = React.useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = React.useState("");
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const csvImportInputRef = React.useRef<HTMLInputElement>(null);

  // Trigger brief alert banner
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Synchronize edit values
  React.useEffect(() => {
    if (editingStudent) {
      setId(editingStudent.id);
      setKhmerName(editingStudent.khmerName);
      setGender(editingStudent.gender);
      setBirthDate(editingStudent.birthDate);
      setFromGrade(editingStudent.fromGrade);
      setGuardianPhone(editingStudent.guardianPhone);
      setNotes(editingStudent.notes || "");
      
      setLatinName(editingStudent.latinName || "");
      setFatherName(editingStudent.fatherName || "");
      setFatherJob(editingStudent.fatherJob || "");
      setMotherName(editingStudent.motherName || "");
      setMotherJob(editingStudent.motherJob || "");
      setPhotoUrl(editingStudent.photoUrl || "");
      
      setBirthProvince(editingStudent.birthProvince || "");
      setBirthDistrict(editingStudent.birthDistrict || "");
      setBirthCommune(editingStudent.birthCommune || "");
      setBirthVillage(editingStudent.birthVillage || "");
      
      setAddressProvince(editingStudent.addressProvince || "");
      setAddressDistrict(editingStudent.addressDistrict || "");
      setAddressCommune(editingStudent.addressCommune || "");
      setAddressVillage(editingStudent.addressVillage || "");
      
      setIsNewStudent(editingStudent.isNewStudent || "បាទ/ចាស");
      setIsRepeated(editingStudent.isRepeated || "ទេ");
      setPoorStatus(editingStudent.poorStatus || "ទេ");
      setDisability(editingStudent.disability || "ទេ");
      setIdPoorCard(editingStudent.idPoorCard || "គ្មាន");
      setIsEthnic(editingStudent.isEthnic || "ទេ");
      setScholarship(editingStudent.scholarship || "ទេ");
      
      setGuardianName(editingStudent.guardianName || "");
      setGuardianJob(editingStudent.guardianJob || "");
      setEthnicGroup(editingStudent.ethnicGroup || "");
      setSpecialTrait(editingStudent.specialTrait || "");
    } else {
      // Auto-increment Id safely
      const numericIds = students.map((s) => parseInt(s.id, 10)).filter((n) => !isNaN(n));
      const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
      setId(String(nextId));
      setKhmerName("");
      setLatinName("");
      setGender("ស្រី");
      setBirthDate("");
      setFromGrade(structure.gradeName || "");
      setGuardianPhone("");
      setNotes("");
      setPhotoUrl("");
      
      setBirthProvince("");
      setBirthDistrict("");
      setBirthCommune("");
      setBirthVillage("");
      
      setAddressProvince("");
      setAddressDistrict("");
      setAddressCommune("");
      setAddressVillage("");
      
      setIsNewStudent("បាទ/ចាស");
      setIsRepeated("ទេ");
      setPoorStatus("ទេ");
      setDisability("ទេ");
      setIdPoorCard("គ្មាន");
      setIsEthnic("ទេ");
      setScholarship("ទេ");
      
      setFatherName("");
      setFatherJob("");
      setMotherName("");
      setMotherJob("");
      setGuardianName("");
      setGuardianJob("");
      setEthnicGroup("");
      setSpecialTrait("");
    }
  }, [editingStudent, isAdding, students, structure]);

  // Dynamic automatic calculation of Khmer Age based on the typed Birth Date
  const khmerAge = React.useMemo(() => {
    if (!birthDate) return "មិនទាន់កំណត់";
    const khmerToEng = (str: string) => {
      const map: { [key: string]: string } = {
        "០": "0", "១": "1", "២": "2", "៣": "3", "៤": "4",
        "៥": "5", "៦": "6", "៧": "7", "៨": "8", "៩": "9"
      };
      return str.replace(/[០-៩]/g, (d) => map[d] || d);
    };

    const parsed = khmerToEng(birthDate);
    // Search for 4 consecutive numbers (either 19xx or 20xx)
    const match = parsed.match(/\b(19\d{2}|20\d{2})\b/);
    if (match) {
      const birthYear = parseInt(match[1], 10);
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;
      if (age > 0 && age < 100) {
        return toKhmerNumeral(age);
      }
    }
    return "គណនាស្វ័យប្រវត្ត";
  }, [birthDate]);

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!khmerName || !id) {
       alert("សូមបំពេញអត្តលេខ និងឈ្មោះសិស្ស!");
       return;
    }

    // Combine locations for backward compat properties if requested
    const fullBirthPlace = `${birthProvince || ""} ${birthDistrict || ""} ${birthCommune || ""} ${birthVillage || ""}`.trim();
    const fullAddress = `${addressProvince || ""} ${addressDistrict || ""} ${addressCommune || ""} ${addressVillage || ""}`.trim();

    const payload: Student = {
      id,
      khmerName,
      gender,
      birthDate: birthDate || "មិនទាន់កំណត់",
      birthPlace: fullBirthPlace || "មិនទាន់កំណត់",
      fromGrade: fromGrade || "មិនទាន់កំណត់",
      guardianPhone: guardianPhone || "មិនទាន់កំណត់",
      address: fullAddress || "មិនទាន់កំណត់",
      fatherName: fatherName || "មិនទាន់កំណត់",
      fatherJob: fatherJob || "មិនទាន់កំណត់",
      motherName: motherName || "មិនទាន់កំណត់",
      motherJob: motherJob || "មិនទាន់កំណត់",
      notes: notes || "",
      
      // Extended fields
      latinName,
      gradeName: structure.gradeName || "",
      guardianName,
      guardianJob,
      birthProvince,
      birthDistrict,
      birthCommune,
      birthVillage,
      addressProvince,
      addressDistrict,
      addressCommune,
      addressVillage,
      isNewStudent,
      isRepeated,
      poorStatus,
      disability,
      idPoorCard,
      isEthnic,
      scholarship,
      ethnicGroup,
      specialTrait,
      photoUrl
    };

    if (editingStudent) {
      onUpdateStudent(payload);
      triggerToast("💾 បានកែប្រែព័ត៌មានលម្អិតសិស្សដោយជោគជ័យ!");
      setEditingStudent(null);
    } else {
      if (students.length >= 60) {
        alert("មិនអាចបន្ថែមសិស្សបានទេ! ចំនួនសិស្សសរុបគឺអតិបរិមា ៦០ នាក់។");
        return;
      }
      if (students.some(s => s.id === id)) {
        alert("អត្តលេខនេះមានរួចហើយ! សូមប្ដូរអត្តលេខថ្មី។");
        return;
      }
      onAddStudent(payload);
      triggerToast("✨ បញ្ចូលសិស្សថ្មីទៅក្នុងបញ្ជី Cloud ដោយជោគជ័យ!");
      setIsAdding(false);
    }
  };

  const handleDelete = (studentId: string, name: string) => {
    if (confirm(`តើអ្នកពិតជាចង់លុបសិស្សឈ្មោះ "${name}" ចេញពីប្រព័ន្ធមែនទេ?`)) {
      onDeleteStudent(studentId);
      triggerToast("🗑️ លុបព័ត៌មានសិស្សរួចរាល់!");
    }
  };

  // Convert uploaded custom file to Base64 safely
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result as string);
      triggerToast("📸 បានបញ្ចូលរូបថតពីកុំព្យូទ័ររបស់អ្នក!");
    };
    reader.readAsDataURL(file);
  };

  // Export full detailed Roster to CSV
  const exportCSV = () => {
    const headers = [
      "ID", "Khmer Name", "Latin Name", "Gender", "Birth Date", "From Grade", 
      "Phone", "Father Name", "Father Job", "Mother Name", "Mother Job", "Birth Province",
      "Address Province", "Is New Student", "Is Repeated", "Poor Status", "Disability", "Notes"
    ];
    const rows = students.map((s) => [
      s.id,
      s.khmerName,
      s.latinName || "",
      s.gender,
      s.birthDate,
      s.fromGrade,
      s.guardianPhone,
      s.fatherName || "",
      s.fatherJob || "",
      s.motherName || "",
      s.motherJob || "",
      s.birthProvince || "",
      s.addressProvince || "",
      s.isNewStudent || "",
      s.isRepeated || "",
      s.poorStatus || "",
      s.disability || "",
      s.notes || ""
    ]);
    exportDataToCSV(headers, rows, "roster-export-khmer-detailed");
    triggerToast("📥 បានទាញយកបញ្ជីរាយនាមសិស្សជាឯកសារ Excel Roster រួចរាល់!");
  };

  const downloadExcelTemplate = () => {
    const headers = [
      "ID", "Khmer Name", "Gender", "Birth Date", "From Grade", "Phone", "Notes"
    ];
    const mockRow = [
      "001", "នួន ចាន់សារ៉ា", "ស្រី", "១២ មិថុនា ២០១៦", "៤(ក)", "0965321877", "សិស្សពូកែ"
    ];
    exportDataToCSV(headers, [mockRow], "academic-student-roster-template");
    triggerToast("📑 បានទាញយកទម្រង់គំរូ Excel សម្រាប់បញ្ចូលព័ត៌មានរួចរាល់!");
  };

  // Import CSV roster file and append students
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n");
        if (lines.length <= 1) {
          alert("ឯកសារគ្មានទិន្នន័យទេ!");
          return;
        }

        const imported: Student[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Split columns while respecting quoted comma strings
          const columns = [];
          let current = "";
          let inQuotes = false;
          for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              columns.push(current.trim());
              current = "";
            } else {
              current += char;
            }
          }
          columns.push(current.trim());

          if (columns.length >= 2 && columns[0] && columns[1]) {
            const studentId = columns[0].replace(/^"|"$/g, "");
            const sName = columns[1].replace(/^"|"$/g, "");
            const sGender = (columns[2]?.replace(/^"|"$/g, "") === "ប្រុស" ? "ប្រុស" : "ស្រី") as "ប្រុស" | "ស្រី";
            const sBDate = columns[3]?.replace(/^"|"$/g, "") || "មិនទាន់កំណត់";
            const sFromGrade = columns[4]?.replace(/^"|"$/g, "") || "មិនទាន់កំណត់";
            const sPhone = columns[5]?.replace(/^"|"$/g, "") || "";
            const sNotes = columns[6]?.replace(/^"|"$/g, "") || "";

            imported.push({
              id: studentId,
              khmerName: sName,
              gender: sGender,
              birthDate: sBDate,
              birthPlace: "មិនទាន់កំណត់",
              fromGrade: sFromGrade,
              guardianPhone: sPhone,
              address: "មិនទាន់កំណត់",
              fatherName: "មិនទាន់កំណត់",
              fatherJob: "មិនទាន់កំណត់",
              motherName: "មិនទាន់កំណត់",
              motherJob: "មិនទាន់កំណត់",
              notes: sNotes
            });
          }
        }

        if (imported.length > 0) {
          const availableSlots = 60 - students.length;
          if (availableSlots <= 0) {
            alert("មិនអាចនាំចូលសិស្សបានទេ! ថ្នាក់រៀនរបស់អ្នកបានដល់ចំនួនអតិបរិមា ៦០ នាក់រួចហើយ។");
            return;
          }
          let toImport = imported;
          if (imported.length > availableSlots) {
            alert(`ចំនួនសិស្សនាំចូលលើសពីដែនកំណត់! ប្រព័ន្ធនឹងនាំចូលតែសិស្ស ${toKhmerNumeral(availableSlots)} នាក់ដំបូងប៉ុណ្ណោះ ដើម្បីកុំឱ្យលើសពីចំនួនអតិបរិមា ៦០ នាក់។`);
            toImport = imported.slice(0, availableSlots);
          }
          toImport.forEach((stud) => {
            onAddStudent(stud);
          });
          triggerToast(`📥 បាននាំចូលសិស្សចំនួន ${toKhmerNumeral(toImport.length)} នាក់ទៅក្នុងប្រព័ន្ធដោយជោគជ័យ!`);
        } else {
          alert("រកមិនឃើញទិន្នន័យសិស្សត្រឹមត្រូវសម្រាប់ការនាំចូលទេ!");
        }
      } catch (err) {
        console.error(err);
        alert("មានបញ្ហាក្នុងការអានឯកសារ CSV របស់អ្នក!");
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (csvImportInputRef.current) csvImportInputRef.current.value = "";
  };

  const filteredStudents = students.filter((s) =>
    s.khmerName.includes(searchTerm) || s.id.includes(searchTerm)
  );

  if (showPrintView) {
    return (
      <div className="space-y-6">
        {/* Print friendly toolbar hidden on paper */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm print:hidden m-1 animate-fade-in">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPrintView(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-805 font-sans text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-slate-200 active:scale-95"
            >
              <ArrowLeft size={14} />
              ត្រឡប់ក្រោយ (Back)
            </button>
            <h3 className="font-moul text-[11px] text-[#2a2d64]">
              បោះពុម្ពបញ្ជីជីវប្រវត្តិសិស្ស
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToExcel("student-bio-print-table", `student-biography-${structure.gradeName}`)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition font-semibold shadow-md inline-flex active:scale-95"
            >
              <Download size={14} />
              ទាញយក Excel
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-sans text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition shadow-md inline-flex active:scale-95"
            >
              <Printer size={14} />
              បោះពុម្ព
            </button>
          </div>
        </div>

        {/* The Printable document sheets */}
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm print:p-0 print:border-0 print:shadow-none m-1">
          {/* Kingdom / Royal Header */}
          <div className="flex flex-col md:flex-row justify-between items-start font-sans text-xs text-gray-700 border-b border-gray-100 pb-4 mb-6 print:flex-row print:pb-2 print:mb-4">
            <div className="text-left space-y-1">
              <p className="font-bold text-[#2a2d64]">ក្រសួងអប់រំ យុវជន និងកីឡា</p>
              <p className="font-semibold text-slate-700">មន្ទីរអប់រំ យុវជន និងកីឡាខេត្តសៀមរាប</p>
              <p className="font-semibold text-slate-700">ការិយាល័យអប់រំ យុវជន និងកីឡាស្រុកសូទ្រនិគម</p>
              <p className="font-bold text-sky-850">{structure.schoolName}</p>
              <p className="text-[10px] text-gray-400">លេខកូដសាលា៖ មិនទាន់កំណត់</p>
            </div>
            <div className="text-center space-y-1 mt-4 md:mt-0 print:mt-0">
              <h1 className="font-sans text-sm md:text-md font-bold tracking-widest text-[#2a2d64]">ព្រះរាជាណាចក្រកម្ពុជា</h1>
              <h2 className="font-sans text-xs md:text-sm font-semibold text-gray-700">ជាតិ សាសនា ព្រះមហាក្សត្រ</h2>
              <div className="flex justify-center items-center py-0.5">
                <span className="text-[7px]">✍️✍️✍️✍️✍️</span>
              </div>
            </div>
          </div>

          <div className="text-center my-6">
            <h2 className="font-moul text-md md:text-lg text-[#2a2d64] leading-relaxed">
              បញ្ជីហៅឈ្មោះសិស្ស
            </h2>
            <h3 className="font-moul text-xs md:text-sm text-[#2a2d64] leading-relaxed mt-1">
              និងផ្នែកជីវប្រវត្តិសង្ខេបរបស់សិស្ស
            </h3>
            <p className="font-sans text-xs md:text-sm text-gray-500 font-semibold mt-2">
              ថ្នាក់ទី៖ {structure.gradeName} | ឆ្នាំសិក្សា៖ {structure.academicYear}
            </p>
            <p className="font-sans text-xs text-gray-700 font-bold mt-1">
              គ្រូបង្រៀនទទួលបន្ទុកថ្នាក់៖ {structure.teacherName}
            </p>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-2xl mt-6">
            <table id="student-bio-print-table" className="w-full font-sans text-[10px] md:text-xs border-collapse text-left">
              <thead>
                <tr className="bg-sky-50 text-sky-950 font-bold border-b border-gray-200 uppercase text-[10px] text-center divide-x divide-gray-200">
                  <th className="py-2.5 px-2 w-10">ល.រ</th>
                  <th className="py-2.5 px-2 w-16">អត្តលេខ</th>
                  <th className="py-2.5 px-2 text-left min-w-32">គោត្តនាម និងនាម</th>
                  <th className="py-2.5 px-2 w-12">ភេទ</th>
                  <th className="py-2.5 px-2 w-24">ថ្ងៃខែឆ្នាំកំណើត</th>
                  <th className="py-2.5 px-2 min-w-40">ទីកន្លែងកំណើត (ភូមិ,ឃុំ,ស្រុក,ខេត្ត)</th>
                  <th className="py-2.5 px-2 min-w-28">ឈ្មោះឪពុក</th>
                  <th className="py-2.5 px-2 min-w-28">ឈ្មោះម្តាយ</th>
                  <th className="py-2.5 px-2 min-w-24">មុខរបរអាណាព្យាបាល</th>
                  <th className="py-2.5 px-2 min-w-48">អាសយដ្ឋានបច្ចុប្បន្ន</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student, index) => {
                  // Construct birthplace safely
                  const bProvince = student.birthProvince || "";
                  const bDistrict = student.birthDistrict || "";
                  const bCommune = student.birthCommune || "";
                  const bVillage = student.birthVillage || "";
                  const birthLoc = [bVillage, bCommune, bDistrict, bProvince].filter(Boolean).join(", ") || student.birthPlace || "-";

                  // Construct address safely
                  const aProvince = student.addressProvince || "";
                  const aDistrict = student.addressDistrict || "";
                  const aCommune = student.addressCommune || "";
                  const aVillage = student.addressVillage || "";
                  const addressLoc = [aVillage, aCommune, aDistrict, aProvince].filter(Boolean).join(", ") || student.address || "-";

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50/50 transition-colors text-center divide-x divide-gray-150"
                    >
                      <td className="py-2 px-1.5 font-bold text-gray-500">
                        {toKhmerNumeral(index + 1)}
                      </td>
                      <td className="py-2 px-1.5 font-bold text-sky-900 bg-sky-50/10">
                        {toKhmerNumeral(student.id)}
                      </td>
                      <td className="py-2 px-2 text-left font-extrabold text-slate-800">
                        {student.khmerName}
                      </td>
                      <td className={`py-2 px-1.5 font-bold ${
                        student.gender === "ស្រី" ? "text-rose-600" : "text-sky-700"
                      }`}>
                        {student.gender}
                      </td>
                      <td className="py-2 px-1.5 leading-tight font-semibold text-gray-600">
                        {toKhmerNumeral(student.birthDate)}
                      </td>
                      <td className="py-2 px-2 text-left text-gray-500 font-medium leading-relaxed text-[11px]">
                        {birthLoc}
                      </td>
                      <td className="py-2 px-2 text-left font-semibold text-slate-800">
                        {student.fatherName || "-"}
                      </td>
                      <td className="py-2 px-2 text-left font-semibold text-slate-800">
                        {student.motherName || "-"}
                      </td>
                      <td className="py-2 px-2 text-left text-slate-600 font-medium">
                        {student.guardianJob || student.fatherJob || student.motherJob || "-"}
                      </td>
                      <td className="py-2 px-2 text-left text-gray-500 font-medium leading-relaxed text-[11px]">
                        {addressLoc}
                      </td>
                    </tr>
                  );
                })}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-400 font-bold font-sans text-xs">
                      គ្មានទិន្នន័យសិស្សឡើយ។
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Traditional Cambodian Footer details */}
          <div className="flex flex-col md:flex-row justify-between items-start pt-10 px-4 font-sans text-xs text-gray-700 space-y-6 md:space-y-0 print:flex-row print:space-y-0 print:pt-6">
            <div className="text-center font-bold flex flex-col items-center">
              <span className="text-gray-500 text-[10px] mb-1 font-normal">បានឃើញ និងពិនិត្យត្រឹមត្រូវ</span>
              <span className="text-sky-950 font-sans font-bold py-1">នាយកសាលា</span>
              <div className="h-16"></div>
              <span className="text-gray-800 font-semibold border-b-2 border-transparent">{structure.principalName}</span>
            </div>
            
            <div className="text-center font-bold flex flex-col items-center md:ml-auto print:ml-auto">
              <span className="text-gray-500 text-[10px] mb-1 font-medium font-sans">ថ្ងៃ................ខែ..........ឆ្នាំ..........ស័ក ព.ស. ២៥៦៨</span>
              <span className="text-gray-500 text-[10px] mb-1 font-normal">ធ្វើនៅ ថ្ងៃទី..........ខែ..........ឆ្នាំ២០២៦</span>
              <span className="text-sky-950 font-sans font-bold py-1">គ្រូទទួលបន្ទុកថ្នាក់</span>
              <div className="h-16"></div>
              <span className="text-gray-800 font-semibold border-b-2 border-transparent">{structure.teacherName}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Toast Popup Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[9999] bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in font-sans">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg">
            ✓
          </div>
          <div>
            <h5 className="font-bold text-xs text-slate-100">ជោគជ័យ!</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* Hidden inputs for importers */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handlePhotoUpload} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={csvImportInputRef} 
        onChange={handleImportCSV} 
        accept=".csv, .xlsx, .xls" 
        className="hidden" 
      />

      {/* Dynamic Tab Switch & Search Block */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm print:hidden m-1">
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("roster")}
            className={`px-4 py-1.5 rounded-lg text-xs font-sans font-bold cursor-pointer transition ${
              activeTab === "roster" ? "bg-white text-sky-950 shadow-sm" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            📋 ទិដ្ឋភាពបញ្ជីរាយនាម (Roster View)
          </button>
          <button
            onClick={() => {
              setActiveTab("manager");
              setIsAdding(true);
              setEditingStudent(null);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-sans font-bold cursor-pointer transition ${
              activeTab === "manager" ? "bg-white text-sky-950 shadow-sm" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            ⚙️ គ្រប់គ្រងព័ត៌មានសិស្ស (Add/Edit)
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search tool */}
          <div className="relative flex-1 md:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ស្វែងរកឈ្មោះ ឬអត្តលេខ..."
              className="w-full text-xs pl-8 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50"
            />
          </div>

          <button
            onClick={() => {
              if (students.length >= 60) {
                alert("មិនអាចបន្ថែមសិស្សបានទេ! ចំនួនសិស្សសរុបគឺអតិបរិមា ៦០ នាក់។");
                return;
              }
              setEditingStudent(null);
              setIsAdding(true);
              setActiveTab("manager");
            }}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-sans text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-50"
            disabled={students.length >= 60}
          >
            <Plus size={14} />
            បន្ថែមសិស្សថ្មី
          </button>

          <button
            onClick={exportCSV}
            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 transition cursor-pointer"
            title="ទាញយកបញ្ជីលម្អិត"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Roster View View - Replica of layout image 1 */}
      {activeTab === "roster" && (
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm print:p-0 print:border-0 print:shadow-none m-1">
          {/* Cambodian Royal Header */}
          <Header structure={structure} />

          <div className="my-6">
            <div className="text-center mb-3">
              <h2 className="font-moul text-sm md:text-md text-[#2a2d64]">
                បញ្ជីរាយនាមសិស្សថ្នាក់ទី {structure.gradeName} ថ្មី
              </h2>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4 print:pb-0 print:border-0">
              <p className="font-sans text-xs md:text-sm text-gray-500 font-bold">
                ឆ្នាំសិក្សា៖ {structure.academicYear} &bull; សិស្សសរុប៖ <span className="text-sky-700 font-extrabold">{toKhmerNumeral(filteredStudents.length)}</span> នាក់ (ស្រី {toKhmerNumeral(filteredStudents.filter(s => s.gender === "ស្រី").length)} នាក់)
              </p>
              
              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={() => setShowPrintView(true)}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-sans text-[11px] font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer select-none active:scale-95"
                >
                  <Printer size={13} />
                  ទម្រង់បោះពុម្ព និង ទាញយក
                </button>
                <button
                  onClick={() => {
                    if (onClearAllStudents) {
                      if (confirm("🚨 តើអ្នកពិតជាចង់លុបទិន្នន័យសិស្សទាំងអស់ចេញពីប្រព័ន្ធមែនទេ? ការលុបនេះមិនអាចសងវិញបានទេ!")) {
                        onClearAllStudents();
                      }
                    } else {
                      alert("មុខងារនេះមិនទាន់អាចប្រើប្រាស់បានទេ។");
                    }
                  }}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-sans text-[11px] font-bold rounded-xl transition flex items-center gap-1 cursor-pointer select-none active:scale-95"
                >
                  <Trash2 size={13} />
                  លុបទាំងអស់
                </button>
              </div>
            </div>
          </div>

          {/* Roster Table matching layout image 1 Exactly */}
          <div className="overflow-x-auto border border-gray-200 rounded-2xl mt-6">
            <table id="roster-table" className="w-full font-sans text-xs border-collapse text-left">
              <thead>
                <tr className="bg-sky-50 text-sky-950 font-bold border-b border-gray-200 uppercase text-[11px]">
                  <th className="py-3 px-4 text-center border-r border-gray-100 w-16">ល.រ</th>
                  <th className="py-3 px-4 border-r border-gray-100 text-center w-24">អត្តលេខ</th>
                  <th className="py-3 px-4 border-r border-gray-100">គោត្តនាម និងនាម</th>
                  <th className="py-3 px-4 border-r border-gray-100 text-center w-16">ភេទ</th>
                  <th className="py-3 px-4 border-r border-gray-100 text-center">ថ្ងៃខែឆ្នាំកំណើត</th>
                  <th className="py-3 px-4 border-r border-gray-100 text-center">មកពីថ្នាក់ទី</th>
                  <th className="py-3 px-4 border-r border-gray-100 text-center">លេខទូរស័ព្ទ</th>
                  <th className="py-3 px-4 text-center w-24 print:hidden">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-2.5 px-4 text-center border-r border-gray-100 font-bold text-gray-500">
                      {toKhmerNumeral(index + 1)}
                    </td>
                    <td className="py-2.5 px-4 text-center border-r border-gray-100 font-bold text-sky-900 bg-sky-50/20">
                      {toKhmerNumeral(student.id)}
                    </td>
                    <td className="py-2.5 px-4 border-r border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-indigo-150 bg-indigo-50/40 flex-shrink-0">
                          <img 
                            src={student.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.khmerName)}`}
                            alt={student.khmerName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{student.khmerName}</p>
                          {student.latinName && <p className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">{student.latinName}</p>}
                        </div>
                      </div>
                    </td>
                    <td className={`py-2.5 px-4 text-center border-r border-gray-100 font-bold ${
                      student.gender === "ស្រី" ? "text-rose-600" : "text-sky-700"
                    }`}>
                      {student.gender}
                    </td>
                    <td className="py-2.5 px-4 text-center border-r border-gray-100 font-semibold text-gray-650">
                      {toKhmerNumeral(student.birthDate)}
                    </td>
                    <td className="py-2.5 px-4 text-center border-r border-gray-100 text-gray-500 font-semibold">
                      {toKhmerNumeral(student.fromGrade)}
                    </td>
                    <td className="py-2.5 px-4 border-r border-gray-100 font-medium text-slate-600">
                      {toKhmerNumeral(student.guardianPhone) || "-"}
                    </td>
                    <td className="py-2.5 px-4 text-center print:hidden">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingStudent(student);
                            setActiveTab("manager");
                          }}
                          className="p-1 px-2 bg-indigo-50 hover:bg-indigo-100 text-[#4f46e5] rounded-lg transition text-[10px] font-sans font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 size={10} /> កែប្រែ
                        </button>
                        <button
                          onClick={() => handleDelete(student.id, student.khmerName)}
                          className="p-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                          title="លុបឈ្មោះសិស្ស"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400 font-bold">
                      រកមិនឃើញសិស្សតាមការស្វែងរករបស់អ្នកទេ។
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Roster CRUD Form & Manager card */}
      {activeTab === "manager" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 m-1">
          
          {/* Detailed High-Fidelity Student Input Form (taking 3 cols of width) */}
          <div className="lg:col-span-3 space-y-6">
            
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md relative overflow-hidden">
              {/* Green indicator bar accent */}
              <div className="h-2 w-full bg-[#34d399]"></div>
              
              <div className="p-6 md:p-8 space-y-8">
                
                {/* Form Card Header */}
                <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                  <h3 className="font-moul text-[#2a2d64] text-xs md:text-sm font-bold tracking-wide">
                    {editingStudent ? `កែសម្រួលព័ត៌មានរបស់សិស្ស៖ ${khmerName}` : `គ្រប់គ្រងបញ្ជីសិស្ស (អតិបរិមា ៦០ នាក់)`}
                  </h3>
                  <div className="text-xs text-[#2a2d64] font-bold font-sans">
                    {editingStudent ? "📝 របៀបកែប្រែ" : "✨ បញ្ចូលថ្មី"}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Part 1: Student Picture & Essential Data Block */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Left 4 Cols: Image Picker Block */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50/50 rounded-2xl border border-slate-250/50 relative">
                      <span className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wide font-sans">
                        រូបថតសិស្ស
                      </span>
                      
                      {/* Frame */}
                      <div className="w-36 h-44 rounded-2xl overflow-hidden border border-slate-200 bg-white flex items-center justify-center shadow-inner relative group">
                        {photoUrl ? (
                          <img 
                            src={photoUrl} 
                            alt="Student Profile" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="flex flex-col items-center text-slate-350">
                            <ImageIcon size={28} />
                            <span className="text-[9px] mt-1 font-bold font-sans">គ្មានរូបភាព</span>
                          </div>
                        )}
                        
                        {photoUrl && (
                          <button
                            type="button"
                            onClick={() => setPhotoUrl("")}
                            className="absolute bottom-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[8px] font-bold select-none cursor-pointer"
                          >
                            ✖ លុប
                          </button>
                        )}
                      </div>

                      {/* Photo Controller Buttons */}
                      <div className="mt-4 w-full space-y-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2 bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#15803d] border border-green-200 text-[10px] font-bold font-sans rounded-xl transition cursor-pointer flex items-center justify-center gap-1 select-none"
                        >
                          😊 ជ្រើសរូបថតសិស្ស
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setShowAvatarGrid(!showAvatarGrid)}
                          className="w-full py-2 bg-[#f0f9ff] hover:bg-[#e0f2fe] text-[#0369a1] border border-sky-200 text-[10px] font-bold font-sans rounded-xl transition cursor-pointer flex items-center justify-center gap-1 select-none"
                        >
                          🎭 ប្រើរូបតុក្កតា/គំរូ
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowCameraInput(!showCameraInput)}
                          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold font-sans rounded-xl transition cursor-pointer flex items-center justify-center gap-1 select-none"
                        >
                          📷 ប្រើប្រាស់កាមេរ៉ា ឬ URL
                        </button>
                      </div>

                      {/* Hidden Preset Avatar Selector popup drawer */}
                      {showAvatarGrid && (
                        <div className="absolute top-2 left-2 right-2 bg-white border border-slate-200 rounded-2xl p-3 shadow-xl z-10 animate-fade-in text-center">
                          <h5 className="text-[10px] font-bold text-[#2a2d64] mb-2 font-sans">ជ្រើសរូបតុក្កតាគំរូ៖</h5>
                          <div className="grid grid-cols-4 gap-2">
                            {AVATAR_PRESETS.map((avUrl, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setPhotoUrl(avUrl);
                                  setShowAvatarGrid(false);
                                }}
                                className="w-10 h-10 rounded-full overflow-hidden border hover:border-indigo-600 hover:scale-105 active:scale-95 transition block bg-slate-50 relative"
                              >
                                <img src={avUrl} className="w-full h-full object-cover" alt="Student avatar" />
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowAvatarGrid(false)}
                            className="mt-3 text-[10px] text-slate-500 font-bold hover:text-slate-800"
                          >
                            បិទផ្ទាំង
                          </button>
                        </div>
                      )}

                      {/* Camera URL Box popup */}
                      {showCameraInput && (
                        <div className="absolute top-2 left-2 right-2 bg-white border border-slate-200 rounded-2xl p-3 shadow-xl z-10 animate-fade-in text-center space-y-2">
                          <h5 className="text-[10px] font-bold text-[#2a2d64] font-sans">វាយបញ្ចូលតំណភ្ជាប់រូបភាព (Photo URL)</h5>
                          <input 
                            type="text"
                            placeholder="https://example.com/photo.jpg"
                            value={customPhotoUrl}
                            onChange={(e) => setCustomPhotoUrl(e.target.value)}
                            className="w-full text-[10px] p-2 border border-slate-200 rounded-lg outline-none"
                          />
                          <div className="flex gap-1 justify-center pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (customPhotoUrl) {
                                  setPhotoUrl(customPhotoUrl);
                                  setCustomPhotoUrl("");
                                }
                                setShowCameraInput(false);
                              }}
                              className="px-2.5 py-1 bg-green-600 text-white font-bold text-[9px] rounded-md"
                            >
                              កំណត់យក
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowCameraInput(false);
                                setCustomPhotoUrl("");
                              }}
                              className="px-2.5 py-1 bg-slate-100 text-[#2a2d64] font-bold text-[9px] rounded-md"
                            >
                              បោះបង់
                            </button>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Right 8 Cols: Input Essentials Grid */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
                      
                      {/* ID field */}
                      <div>
                        <label className="block font-bold text-slate-600 mb-1">អត្តលេខ*</label>
                        <input
                          type="text"
                          required
                          value={id}
                          onChange={(e) => setId(e.target.value)}
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-150 outline-none font-bold"
                          placeholder="អត្តលេខ"
                        />
                      </div>

                      {/* Grade field */}
                      <div>
                        <label className="block font-bold text-slate-600 mb-1">ថ្នាក់ទី*</label>
                        <input
                          type="text"
                          required
                          disabled
                          value={structure.gradeName}
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-600"
                          placeholder="ឧ. ១ក"
                        />
                      </div>

                      {/* Khmer Name */}
                      <div>
                        <label className="block font-bold text-slate-600 mb-1">ឈ្មោះសិស្ស (ខ្មែរ)*</label>
                        <input
                          type="text"
                          required
                          value={khmerName}
                          onChange={(e) => setKhmerName(e.target.value)}
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-150 outline-none font-bold placeholder-slate-350"
                          placeholder="គោត្តនាម និងនាម"
                        />
                      </div>

                      {/* Latin Name */}
                      <div>
                        <label className="block font-bold text-slate-600 mb-1">ឈ្មោះសិស្សជាអក្សរឡាតាំង</label>
                        <input
                          type="text"
                          value={latinName}
                          onChange={(e) => setLatinName(e.target.value)}
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-150 outline-none uppercase font-mono placeholder-slate-300"
                          placeholder="Latin Name"
                        />
                      </div>

                      {/* Gender select */}
                      <div>
                        <label className="block font-bold text-slate-600 mb-1">ភេទ*</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value as any)}
                          className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-150 outline-none font-bold cursor-pointer bg-white"
                        >
                          <option value="ស្រី">ស្រី</option>
                          <option value="ប្រុស">ប្រុស</option>
                        </select>
                      </div>

                      {/* Birth Date */}
                      <div>
                        <label className="block font-bold text-slate-600 mb-1">ថ្ងៃខែឆ្នាំកំណើត*</label>
                        <input
                          type="text"
                          required
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          placeholder="ឧ. ០២ មីនា ២០១៦"
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-150 outline-none font-bold"
                        />
                      </div>

                      {/* Khmer Calculated Age */}
                      <div>
                        <label className="block font-bold text-slate-600 mb-1">អាយុ (ឆ្នាំ)</label>
                        <input
                          type="text"
                          disabled
                          value={khmerAge}
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold text-[#4f46e5]"
                          placeholder="រក្សាទុកអាយុស្វ័យប្រវត្ត"
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block font-bold text-slate-600 mb-1">លេខទូរស័ព្ទអាណាព្យាបាល</label>
                        <input
                          type="text"
                          value={guardianPhone}
                          onChange={(e) => setGuardianPhone(e.target.value)}
                          placeholder="លេខទូរស័ព្ទ"
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-150 outline-none placeholder-slate-300"
                        />
                      </div>

                    </div>
                  </div>

                  {/* Part 2: Place of Birth Block */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1 border-b border-slate-100 pb-1.5 font-sans">
                      <MapPin size={14} className="text-indigo-600" />
                      ទីកន្លែងកំណើត
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">រាជធានី/ខេត្ត</label>
                        <select
                          value={birthProvince}
                          onChange={(e) => setBirthProvince(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 cursor-pointer outline-none"
                        >
                          <option value="">វាយបញ្ចូល ឬជ្រើសរើស...</option>
                          {CAMBODIA_PROVINCES.map((p, idx) => (
                            <option key={idx} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">ក្រុង/ស្រុក/ខណ្ឌ</label>
                        <input
                          type="text"
                          value={birthDistrict}
                          onChange={(e) => setBirthDistrict(e.target.value)}
                          placeholder="ក្រុង/ស្រុក..."
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">ឃុំ/សង្កាត់</label>
                        <input
                          type="text"
                          value={birthCommune}
                          onChange={(e) => setBirthCommune(e.target.value)}
                          placeholder="ឃុំ/សង្កាត់..."
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">ភូមិ</label>
                        <input
                          type="text"
                          value={birthVillage}
                          onChange={(e) => setBirthVillage(e.target.value)}
                          placeholder="ភូមិ..."
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Part 3: Current Address Block */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1 border-b border-slate-100 pb-1.5 font-sans">
                      <Home size={14} className="text-indigo-600" />
                      អាសយដ្ឋានបច្ចុប្បន្ន
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">រាជធានី/ខេត្ត</label>
                        <select
                          value={addressProvince}
                          onChange={(e) => setAddressProvince(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 cursor-pointer outline-none"
                        >
                          <option value="">វាយបញ្ចូល ឬជ្រើសរើស...</option>
                          {CAMBODIA_PROVINCES.map((p, idx) => (
                            <option key={idx} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">ក្រុង/ស្រុក/ខណ្ឌ</label>
                        <input
                          type="text"
                          value={addressDistrict}
                          onChange={(e) => setAddressDistrict(e.target.value)}
                          placeholder="ក្រុង/ស្រុក..."
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">ឃុំ/សង្កាត់</label>
                        <input
                          type="text"
                          value={addressCommune}
                          onChange={(e) => setAddressCommune(e.target.value)}
                          placeholder="ឃុំ/សង្កាត់..."
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">ភូមិ</label>
                        <input
                          type="text"
                          value={addressVillage}
                          onChange={(e) => setAddressVillage(e.target.value)}
                          placeholder="ភូមិ..."
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Part 4: Scholar, Disability and Status Block */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1 border-b border-slate-100 pb-1.5 font-sans">
                      <Award size={14} className="text-indigo-600" />
                      ស្ថានភាព និងអាហារូបករណ៍
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans text-slate-600">
                      
                      {/* New Student */}
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">សិស្សថ្មី</label>
                        <select
                          value={isNewStudent}
                          onChange={(e) => setIsNewStudent(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer"
                        >
                          <option value="បាទ/ចាស">បាទ/ចាស</option>
                          <option value="ទេ">ទេ</option>
                        </select>
                      </div>

                      {/* Repetition */}
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">សិស្សត្រួតថ្នាក់</label>
                        <select
                          value={isRepeated}
                          onChange={(e) => setIsRepeated(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer"
                        >
                          <option value="ទេ">ទេ</option>
                          <option value="បាទ/ចាស">បាទ/ចាស</option>
                        </select>
                      </div>

                      {/* Poor Status */}
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">ស្ថានភាពគ្រួសារ (ក្រីក្រ)</label>
                        <select
                          value={poorStatus}
                          onChange={(e) => setPoorStatus(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer"
                        >
                          <option value="ទេ">ទេ</option>
                          <option value="ក្រីក្រ១">ក្រីក្រ១</option>
                          <option value="ក្រីក្រ២">ក្រីក្រ២</option>
                        </select>
                      </div>

                      {/* Disability option */}
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">ពិការភាព</label>
                        <select
                          value={disability}
                          onChange={(e) => setDisability(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer"
                        >
                          <option value="ទេ">ទេ</option>
                          <option value="មាន">មាន</option>
                        </select>
                      </div>

                      {/* ID Poor Card */}
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">ប័ណ្ណក្រីក្រ</label>
                        <select
                          value={idPoorCard}
                          onChange={(e) => setIdPoorCard(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer"
                        >
                          <option value="គ្មាន">គ្មាន</option>
                          <option value="មាន">មាន</option>
                        </select>
                      </div>

                      {/* Indigenous Options */}
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">សិស្សជនជាតិភាគតិច</label>
                        <select
                          value={isEthnic}
                          onChange={(e) => setIsEthnic(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer"
                        >
                          <option value="ទេ">ទេ</option>
                          <option value="បាទ">បាទ</option>
                        </select>
                      </div>

                      {/* Scholarship options */}
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">អាហារូបករណ៍</label>
                        <select
                          value={scholarship}
                          onChange={(e) => setScholarship(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer"
                        >
                          <option value="ទេ">ទេ</option>
                          <option value="មាន">មាន</option>
                        </select>
                      </div>

                    </div>
                  </div>

                  {/* Part 5: Parents & Guardian Information */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1 border-b border-slate-100 pb-1.5 font-sans">
                      <Users size={14} className="text-indigo-600" />
                      ព័ត៌មានឪពុកម្តាយ និងអាណាព្យាបាល
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">ឈ្មោះឪពុក</label>
                        <input
                          type="text"
                          value={fatherName}
                          onChange={(e) => setFatherName(e.target.value)}
                          placeholder="ឈ្មោះឪពុក"
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">មុខរបរឪពុក</label>
                        <input
                          type="text"
                          value={fatherJob}
                          onChange={(e) => setFatherJob(e.target.value)}
                          placeholder="មុខរបរ"
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">ឈ្មោះម្តាយ</label>
                        <input
                          type="text"
                          value={motherName}
                          onChange={(e) => setMotherName(e.target.value)}
                          placeholder="ឈ្មោះម្តាយ"
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">មុខរបរម្តាយ</label>
                        <input
                          type="text"
                          value={motherJob}
                          onChange={(e) => setMotherJob(e.target.value)}
                          placeholder="មុខរបរ"
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">ឈ្មោះអាណាព្យាបាល (ក្រៅពីឪពុកម្តាយ)</label>
                        <input
                          type="text"
                          value={guardianName}
                          onChange={(e) => setGuardianName(e.target.value)}
                          placeholder="ឈ្មោះអាណាព្យាបាល"
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">មុខរបរអាណាព្យាបាល</label>
                        <input
                          type="text"
                          value={guardianJob}
                          onChange={(e) => setGuardianJob(e.target.value)}
                          placeholder="មុខរបរ"
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Part 6: Additional details & General Notes */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1 border-b border-slate-100 pb-1.5 font-sans">
                      <FileText size={14} className="text-indigo-600" />
                      ព័ត៌មានបន្ថែមផ្សេងៗ
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">ជនជាតិដើមភាគតិច</label>
                        <input
                          type="text"
                          value={ethnicGroup}
                          onChange={(e) => setEthnicGroup(e.target.value)}
                          placeholder="ឧ. ព្នង, គួយ..."
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-500 mb-1">លក្ខណៈពិសេស</label>
                        <input
                          type="text"
                          value={specialTrait}
                          onChange={(e) => setSpecialTrait(e.target.value)}
                          placeholder="លក្ខណៈផ្សេងៗ..."
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-500 mb-1">សេចក្តីផ្សេងៗ</label>
                        <input
                          type="text"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="ព័ត៌មានបន្ថែមផ្សេងៗ..."
                          className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Part 7: Cambodian Official Information Alert Box */}
                  <div className="p-4 bg-[#f0f9ff] border border-blue-150 rounded-2xl flex items-start gap-3 text-[11px] font-sans text-blue-900 shadow-sm">
                    <Info size={16} className="text-sky-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold">បញ្ជាក់៖ ចំការព័ត៌មានដែលគ្មានសញ្ញា * ត្រូវបំពេញជាបន្តបន្ទាប់ក្រោយៗ។ អាយុនឹងត្រូវបានគណនាដោយស្វ័យប្រវត្ត។</p>
                      <p className="font-semibold text-rose-600 mt-1">ចំណាំ៖ ចំនួនសិស្សសរុបក្នុងមួយថ្នាក់គឺ ១០០នាក់ ប៉ុណ្ណោះ។</p>
                    </div>
                  </div>

                  {/* Submit Form Actions */}
                  <div className="pt-2 flex flex-col md:flex-row gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-[#22c55e] hover:bg-[#16a34a] text-white font-moul tracking-wider text-xs md:text-sm font-extrabold rounded-2xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 select-none"
                    >
                      💾 រក្សាទុកទិន្នន័យ (Cloud)
                    </button>
                    <button
                      type="button"
                      onClick={downloadExcelTemplate}
                      className="md:flex-1 py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-moul tracking-wider text-xs rounded-2xl shadow-sm transition active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 select-none"
                    >
                      📥 ទាញយកគំរូ Excel (.xlsx)
                    </button>
                    <button
                      type="button"
                      onClick={() => csvImportInputRef.current?.click()}
                      className="md:flex-1 py-3.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-moul tracking-wider text-xs rounded-2xl shadow-sm transition active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 select-none"
                    >
                      📤 នាំចូលទិន្នន័យ Excel / CSV
                    </button>
                    {editingStudent && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingStudent(null);
                          setIsAdding(false);
                        }}
                        className="py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border rounded-2xl cursor-pointer"
                      >
                        បោះបង់
                      </button>
                    )}
                  </div>

                </form>
              </div>
            </div>

          </div>

          {/* Quick Active Student list sidebar on the right (taking 1 col) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-md flex flex-col max-h-[750px]">
              <div className="border-b border-gray-50 pb-3 flex items-center justify-between">
                <h4 className="font-moul text-[10px] text-sky-950 font-bold">
                  បញ្ជីសិស្សសកម្ម ({toKhmerNumeral(students.length)}/៦០)
                </h4>
                <button
                  onClick={() => {
                    if (students.length >= 60) {
                      alert("មិនអាចបន្ថែមសិស្សបានទេ! ចំនួនសិស្សសរុបគឺអតិបរិមា ៦០ នាក់។");
                      return;
                    }
                    setEditingStudent(null);
                    setIsAdding(true);
                  }}
                  className="text-[9px] font-bold text-sky-600 hover:text-sky-800 font-sans disabled:opacity-55"
                  disabled={students.length >= 60}
                >
                  + បង្កើតថ្មី
                </button>
              </div>

              <div className="space-y-2 mt-4 overflow-y-auto flex-1 pr-1">
                {filteredStudents.map((s) => {
                  const isSelected = editingStudent?.id === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setEditingStudent(s)}
                      className={`p-2.5 rounded-2xl border transition-all font-sans text-xs flex items-center justify-between cursor-pointer select-none ${
                        isSelected 
                          ? "bg-indigo-50/70 border-indigo-200 shadow-sm" 
                          : "bg-slate-50/50 hover:bg-slate-50 border-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-white">
                          <img 
                            src={s.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(s.khmerName)}`} 
                            className="w-full h-full object-cover" 
                            alt={s.khmerName} 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-800 text-[11px]">{s.khmerName}</h5>
                          <p className="text-[9px] text-slate-400 font-mono">ID: {toKhmerNumeral(s.id)} | {s.gender}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(s.id, s.khmerName);
                        }}
                        className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-lg transition"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <p className="text-center text-slate-400 text-[10px] font-bold py-6">គ្មានទិន្នន័យសិស្ស</p>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
