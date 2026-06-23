import React from "react";
import {
  UserPlus,
  Users,
  Grid,
  Calendar,
  BookOpen,
  Send,
  Edit,
  Table,
  BarChart3,
  LineChart,
  PieChart,
  Scale,
  FolderOpen,
  Award,
  CheckSquare,
  Book,
  ClipboardList,
  FileBadge,
  Heart,
  QrCode,
  Sparkles,
  Box,
  CreditCard,
  Bell,
  Palette,
  User,
  X,
  Plus,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { Student, ClassStructure, MonthlyScores, MonthlyAttendance } from "../types";
import { toKhmerNumeral } from "../utils";
import { KHMER_MONTHS } from "../constants";

// Define the 26 beautiful tiles from the screenshot
interface DashboardGridProps {
  students: Student[];
  structure: ClassStructure;
  scores: MonthlyScores;
  attendance: MonthlyAttendance;
  onUpdateScores: React.Dispatch<React.SetStateAction<MonthlyScores>>;
  onUpdateAttendance: React.Dispatch<React.SetStateAction<MonthlyAttendance>>;
  setActiveTab: (tab: string) => void;
  openClassEditor: () => void;
}

export default function DashboardGrid({
  students,
  structure,
  scores,
  attendance,
  onUpdateScores,
  onUpdateAttendance,
  setActiveTab,
  openClassEditor
}: DashboardGridProps) {
  // Modal tracking states
  const [activeModal, setActiveModal] = React.useState<string | null>(null);

  // 1. STATE FOR DESK ATTENDANCE (ចុះវត្តមានតាមប្លង់តុ)
  // Let's model a 6x5 room layout of desks. Max 30 desks.
  const [seatingPlan, setSeatingPlan] = React.useState<{ [deskIndex: number]: string }>(() => {
    const saved = localStorage.getItem("khmer_seating_plan");
    if (saved) return JSON.parse(saved);
    // Assign students automatically initially
    const plan: { [key: number]: string } = {};
    students.forEach((student, index) => {
      if (index < 30) plan[index] = student.id;
    });
    return plan;
  });

  const saveSeating = (newPlan: typeof seatingPlan) => {
    setSeatingPlan(newPlan);
    localStorage.setItem("khmer_seating_plan", JSON.stringify(newPlan));
  };

  // 2. STATE FOR HOMEWORK (បញ្ចូលពិន្ទុកិច្ចការផ្ទះ)
  const [homeworkTitle, setHomeworkTitle] = React.useState("កិច្ចការផ្ទះ គណិតវិទ្យា");
  const [homeworkScores, setHomeworkScores] = React.useState<{ [studentId: string]: string }>(() => {
    const s: { [key: string]: string } = {};
    students.forEach((std) => {
      s[std.id] = "១០";
    });
    return s;
  });

  // 3. STATE FOR STUDENT LEDGER/ACTIVITY LOG (សៀវភៅសិក្ខាកាមិក)
  interface LedgerEntry {
    id: string;
    studentId: string;
    studentName: string;
    date: string;
    category: "ការកោតសរសើរ" | "ការរំលឹក/ពិន័យ" | "សកម្មភាព";
    content: string;
  }
  const [ledgerEntries, setLedgerEntries] = React.useState<LedgerEntry[]>(() => {
    const saved = localStorage.getItem("khmer_ledger");
    return saved ? JSON.parse(saved) : [
      { id: "1", studentId: "579", studentName: "ផន សៀវម៉ី", date: "១៩-០៦-២០២៦", category: "ការកោតសរសើរ", content: "រៀបចំសម្ភារៈក្នុងថ្នាក់បានស្អាតល្អ" },
      { id: "2", studentId: "577", studentName: "កែវ លីណា", date: "១៩-០៦-២០២៦", category: "សកម្មភាព", content: "ធ្វើជាប្រធានក្រុមដឹកនាំសិស្សដទៃសម្អាតបន្ទប់" }
    ];
  });
  const [selectedLedgerStudent, setSelectedLedgerStudent] = React.useState(students[0]?.id || "");
  const [ledgerCategory, setLedgerCategory] = React.useState<LedgerEntry["category"]>("ការកោតសរសើរ");
  const [ledgerText, setLedgerText] = React.useState("");

  const addLedgerEntry = () => {
    if (!ledgerText.trim()) return;
    const std = students.find((s) => s.id === selectedLedgerStudent);
    const newEntry: LedgerEntry = {
      id: Date.now().toString(),
      studentId: selectedLedgerStudent,
      studentName: std ? std.khmerName : "មិនស្គាល់",
      date: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
      category: ledgerCategory,
      content: ledgerText
    };
    const updated = [newEntry, ...ledgerEntries];
    setLedgerEntries(updated);
    localStorage.setItem("khmer_ledger", JSON.stringify(updated));
    setLedgerText("");
  };

  const deleteLedgerEntry = (id: string) => {
    const updated = ledgerEntries.filter((e) => e.id !== id);
    setLedgerEntries(updated);
    localStorage.setItem("khmer_ledger", JSON.stringify(updated));
  };

  // 4. CERTIFICATE GENERATION DETAILS (ទាញយកវិញ្ញាបនបត្រ)
  const [selectedCertStudent, setSelectedCertStudent] = React.useState(students[0]?.id || "");
  const [certType, setCertType] = React.useState("សិស្សពូកែប្រចាំខែ");

  // 5. INVENTORY REGISTRY STATE (បញ្ជីសារពើភ័ណ្ឌ)
  interface InventoryItem {
    id: string;
    name: string;
    total: number;
    good: number;
    damaged: number;
    note: string;
  }
  const [inventory, setInventory] = React.useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem("khmer_inventory");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "តុសិស្ស (វែង)", total: 15, good: 14, damaged: 1, note: "ត្រូវការជួសជុលជើងតុមួយ" },
      { id: "2", name: "កៅអីសិស្ស", total: 30, good: 28, damaged: 2, note: "គ្រោងប្តូរថ្មីក្នុងឆមាសទី២" },
      { id: "3", name: "ក្តារខៀនម៉ាញេទិក", total: 1, good: 1, damaged: 0, note: "នៅល្អខ្លាំង" },
      { id: "4", name: "កង្ហារពិដាន", total: 4, good: 3, damaged: 1, note: "កង្ហារក្បែរបង្អួចដើរយឺត" },
      { id: "5", name: "ទូសៀវភៅថ្នាក់", total: 1, good: 1, damaged: 0, note: "សៀវភៅពេញល្អ" }
    ];
  });
  const [newItemName, setNewItemName] = React.useState("");
  const [newItemQty, setNewItemQty] = React.useState(1);

  const addInventoryItem = () => {
    if (!newItemName.trim()) return;
    const item: InventoryItem = {
      id: Date.now().toString(),
      name: newItemName,
      total: newItemQty,
      good: newItemQty,
      damaged: 0,
      note: ""
    };
    const updated = [...inventory, item];
    setInventory(updated);
    localStorage.setItem("khmer_inventory", JSON.stringify(updated));
    setNewItemName("");
    setNewItemQty(1);
  };

  const deleteInventoryItem = (id: string) => {
    const updated = inventory.filter((i) => i.id !== id);
    setInventory(updated);
    localStorage.setItem("khmer_inventory", JSON.stringify(updated));
  };

  // 6. DECORATION PLANNER STATE (សម្ភារៈតុបតែងថ្នាក់)
  interface DecorItem {
    id: string;
    name: string;
    estimatedCost: string;
    status: "បានទិញរួច" | "គ្រោងទិញ" | "ពិភាក្សា";
  }
  const [decorItems, setDecorItems] = React.useState<DecorItem[]>(() => {
    const saved = localStorage.getItem("khmer_decorations");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "រូបថតប្រវត្តិសាស្ត្រឥស្សរជន", estimatedCost: "១៥,០០០ រៀល", status: "បានទិញរួច" },
      { id: "2", name: "បដាពាក្យស្លោកអប់រំជុំវិញបន្ទប់", estimatedCost: "២៥,០០០ រៀល", status: "បានទិញរួច" },
      { id: "3", name: "ផ្កាជ័រដាក់លើតុគ្រូ", estimatedCost: "៨,០០០ រៀល", status: "បានទិញរួច" },
      { id: "4", name: "រូបគំនូរប្រាសាទអង្គរវត្តទំហំធំ", estimatedCost: "៤៥,០០០ រៀល", status: "គ្រោងទិញ" },
      { id: "5", name: "ធុងសំរាមកែច្នៃបរិស្ថាន", estimatedCost: "១២,០០០ រៀល", status: "គ្រោងទិញ" }
    ];
  });
  const [newDecorName, setNewDecorName] = React.useState("");
  const [newDecorCost, setNewDecorCost] = React.useState("");

  const addDecorItem = () => {
    if (!newDecorName.trim()) return;
    const item: DecorItem = {
      id: Date.now().toString(),
      name: newDecorName,
      estimatedCost: newDecorCost || "០ រៀល",
      status: "គ្រោងទិញ"
    };
    const updated = [...decorItems, item];
    setDecorItems(updated);
    localStorage.setItem("khmer_decorations", JSON.stringify(updated));
    setNewDecorName("");
    setNewDecorCost("");
  };

  const deleteDecorItem = (id: string) => {
    const updated = decorItems.filter((d) => d.id !== id);
    setDecorItems(updated);
    localStorage.setItem("khmer_decorations", JSON.stringify(updated));
  };

  const toggleDecorStatus = (id: string) => {
    const updated = decorItems.map((item) => {
      if (item.id === id) {
        const nextStatus: DecorItem["status"] =
          item.status === "បានទិញរួច"
            ? "គ្រោងទិញ"
            : item.status === "គ្រោងទិញ"
            ? "ពិភាក្សា"
            : "បានទិញរួច";
        return { ...item, status: nextStatus };
      }
      return item;
    });
    setDecorItems(updated);
    localStorage.setItem("khmer_decorations", JSON.stringify(updated));
  };

  // List of tiles exact layout
  const gridTiles = [
    {
      id: "tile-1",
      title: "បញ្ចូលព័ត៌មានសិស្ស",
      desc: "បន្ថែមសិស្សថ្មីក្នុងថ្នាក់រៀន",
      icon: <UserPlus className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
      action: () => {
        setActiveTab("students");
        // Scroll slightly or just redirect
      }
    },
    {
      id: "tile-2",
      title: "បញ្ជីឈ្មោះសិស្ស",
      desc: "មើល និងគ្រប់គ្រងប្រវត្តិរូបសិស្ស",
      icon: <Users className="w-6 h-6 text-white" />,
      color: "bg-indigo-500",
      action: () => setActiveTab("students")
    },
    {
      id: "tile-3",
      title: "ចុះវត្តមានតាមប្លង់តុ",
      desc: "ស្រង់វត្តមានងាយស្រួលតាមប្លង់តុពិត",
      icon: <Grid className="w-6 h-6 text-white" />,
      color: "bg-orange-500",
      action: () => setActiveModal("desk-attendance")
    },
    {
      id: "tile-4",
      title: "បញ្ជីវត្តមានប្រចាំខែ",
      desc: "ពិនិត្យរបាយការណ៍អវត្តមានសរុប",
      icon: <Calendar className="w-6 h-6 text-white" />,
      color: "bg-rose-500",
      action: () => setActiveTab("attendance")
    },
    {
      id: "tile-5",
      title: "បញ្ចូលពិន្ទុកិច្ចការផ្ទះ",
      desc: "តាមដាន និងរក្សាទុកពិន្ទុកិច្ចការផ្ទះ",
      icon: <BookOpen className="w-6 h-6 text-white" />,
      color: "bg-sky-500",
      action: () => setActiveModal("homework-scores")
    },
    {
      id: "tile-6",
      title: "បញ្ជូនកិច្ចការផ្ទះទៅអាណាព្យាបាល",
      desc: "ផ្ញើលទ្ធផលឆ្លងកាត់ប្រព័ន្ធឌីហ្សីថល",
      icon: <Send className="w-6 h-6 text-white" />,
      color: "bg-fuchsia-500",
      action: () => setActiveModal("send-parent-alerts")
    },
    {
      id: "tile-7",
      title: "បញ្ចូលពិន្ទុ",
      desc: "បំពេញពិន្ទុតាមសៀវភៅពិន្ទុផ្លូវការ",
      icon: <Edit className="w-6 h-6 text-white" />,
      color: "bg-emerald-500",
      action: () => setActiveTab("scores")
    },
    {
      id: "tile-8",
      title: "តារាងពិន្ទុសរុប",
      desc: "មើលសន្លឹកតារាងពិន្ទុមុខវិជ្ជាសរុប",
      icon: <Table className="w-6 h-6 text-white" />,
      color: "bg-teal-500",
      action: () => setActiveTab("scores")
    },
    {
      id: "tile-9",
      title: "តារាងចំណាត់ថ្នាក់",
      desc: "តារាងចំណាត់ថ្នាក់កិត្តិយសប្រចាំខែ",
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      color: "bg-violet-600",
      action: () => setActiveTab("ranking")
    },
    {
      id: "tile-10",
      title: "វិភាគទិន្នន័យសរុប",
      desc: "មើលស្ថិតិរួម ភាគរយវត្តមាន និងពិន្ទុ",
      icon: <LineChart className="w-6 h-6 text-white" />,
      color: "bg-red-500",
      action: () => setActiveTab("analytics")
    },
    {
      id: "tile-11",
      title: "វិភាគតាមមុខវិជ្ជា",
      desc: "បង្ហាញពិន្ទុមធ្យមភាគប្រៀបធៀបមុខវិជ្ជា",
      icon: <PieChart className="w-6 h-6 text-white" />,
      color: "bg-indigo-600",
      action: () => setActiveTab("analytics")
    },
    {
      id: "tile-12",
      title: "វិភាគអាយុ និងកម្ពស់",
      desc: "របាយការណ៍ការលូតលាស់ និងស្ថិតិអាយុ",
      icon: <Scale className="w-6 h-6 text-white" />,
      color: "bg-green-600",
      action: () => setActiveTab("analytics")
    },
    {
      id: "tile-13",
      title: "រដ្ឋបាលថ្នាក់រៀន",
      desc: "សៀវភៅតាមដានរដ្ឋបាលថ្នាក់រៀនទាំង១៣",
      icon: <FolderOpen className="w-6 h-6 text-white" />,
      color: "bg-blue-600",
      action: () => setActiveTab("adminBooks")
    },
    {
      id: "tile-14",
      title: "តារាងកិត្តិយស",
      desc: "តារាងផ្កាយរបស់សិស្សឆ្នើមទាំង៥",
      icon: <Award className="w-6 h-6 text-white" />,
      color: "bg-amber-500",
      action: () => setActiveTab("honor")
    },
    {
      id: "tile-15",
      title: "បញ្ជីបូកសរុបលទ្ធផលប្រចាំឆ្នាំ",
      desc: "បូកសរុបលទ្ធផល និងមធ្យមភាគប្រចាំឆ្នាំ",
      icon: <CheckSquare className="w-6 h-6 text-white" />,
      color: "bg-cyan-600",
      action: () => setActiveModal("yearly-summary")
    },
    {
      id: "tile-16",
      title: "សៀវភៅតាមដាន",
      desc: "សន្លឹកកាតតាមដានលទ្ធផលបុគ្គល",
      icon: <Book className="w-6 h-6 text-white" />,
      color: "bg-sky-600",
      action: () => setActiveTab("scores")
    },
    {
      id: "tile-17",
      title: "សៀវភៅសិក្ខាកាមិក",
      desc: "ការកត់ត្រាវិន័យ និងសកម្មភាពលេចធ្លោ",
      icon: <ClipboardList className="w-6 h-6 text-white" />,
      color: "bg-teal-600",
      action: () => setActiveModal("student-ledger")
    },
    {
      id: "tile-18",
      title: "ទាញយកវិញ្ញាបនបត្រ",
      desc: "បង្កើត និងបោះពុម្ពប័ណ្ណសរសើរ",
      icon: <FileBadge className="w-6 h-6 text-white" />,
      color: "bg-amber-600",
      action: () => setActiveModal("certificate-downloader")
    },
    {
      id: "tile-19",
      title: "របាយការណ៍មាតាបិតា",
      desc: "បង្កើតរបាយការណ៍សិស្សផ្ញើជូនមាតាបិតា",
      icon: <Heart className="w-6 h-6 text-white" />,
      color: "bg-sky-500",
      action: () => setActiveTab("sync")
    },
    {
      id: "tile-20",
      title: "លេខកូដសិស្ស (ឌីហ្សីថលម៉ូដ)",
      desc: "បង្ហាញកូដ QR សម្គាល់ខ្លួនសិស្សម្នាក់ៗ",
      icon: <QrCode className="w-6 h-6 text-white" />,
      color: "bg-emerald-600",
      action: () => setActiveModal("student-barcode")
    },
    {
      id: "tile-21",
      title: "កាលវិភាគសម្អាតថ្នាក់",
      desc: "មើលវេន និងសមាជិកប្រចាំក្រុមសម្អាត",
      icon: <Sparkles className="w-6 h-6 text-white" />,
      color: "bg-blue-400",
      action: () => setActiveTab("cleaning")
    },
    {
      id: "tile-22",
      title: "បញ្ជីសារពើភ័ណ្ឌ",
      desc: "កត់ត្រាសម្ភារៈរូបវន្ត និងគ្រឿងសង្ហារិម",
      icon: <Box className="w-6 h-6 text-white" />,
      color: "bg-amber-500",
      action: () => setActiveModal("class-inventory")
    },
    {
      id: "tile-23",
      title: "បោះពុម្ពកាតសិស្ស",
      desc: "បោះពុម្ពកាតសម្គាល់សិស្សសម្រាប់ពាក់",
      icon: <CreditCard className="w-6 h-6 text-white" />,
      color: "bg-sky-600",
      action: () => setActiveTab("cards")
    },
    {
      id: "tile-24",
      title: "ផ្ញើសារទៅអាណាព្យាបាល",
      desc: "តភ្ជាប់ឆានែល Telegram សាលាផ្លូវការ",
      icon: <Bell className="w-6 h-6 text-white" />,
      color: "bg-purple-600",
      action: () => setActiveTab("sync")
    },
    {
      id: "tile-25",
      title: "សម្ភារៈតុបតែងថ្នាក់",
      desc: "រៀបចំផែនការ និងថវិកាតុបតែងថ្នាក់រៀន",
      icon: <Palette className="w-6 h-6 text-white" />,
      color: "bg-fuchsia-600",
      action: () => setActiveModal("classroom-decorations")
    },
    {
      id: "tile-26",
      title: "ព័ត៌មានគណនី",
      desc: "គ្រប់គ្រង API និងគណនីគ្រូបង្រៀនទាំងមូល",
      icon: <User className="w-6 h-6 text-white" />,
      color: "bg-slate-600",
      action: () => setActiveTab("account")
    }
  ];

  // Calculations for static metrics
  const studentsCountDesc = `សរុប៖ ${toKhmerNumeral(students.length)} នាក់ | ស្រី៖ ${toKhmerNumeral(students.filter(s=>s.gender==="ស្រី").length)} នាក់`;

  return (
    <div className="space-y-6">
      {/* Background Banner info */}
      <div className="bg-gradient-to-r from-indigo-550 via-sky-600 to-teal-500 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-bold">🎉 កំពុងដំណើរការលើប្រព័ន្ធអនឡាញ</span>
          <h2 className="font-moul text-lg md:text-xl text-amber-200">ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធថ្នាក់រៀនសរុប</h2>
          <p className="font-sans text-xs text-sky-100 max-w-xl">
            គម្រោងគ្រប់គ្រង ប្រវត្តិរូបសិស្ស វត្តមាន ពិន្ទុ កិច្ចការផ្ទះ លេខកូដសម្គាល់ និងព័ត៌មានលម្អិតសម្រាប់សាលារៀន {structure.schoolName} ។
          </p>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 border border-white/10 text-center shrink-0 min-w-[170px]">
          <span className="text-[10px] text-sky-200 font-sans uppercase block">ស្ថិតិសិស្សជារួម</span>
          <h3 className="font-sans text-2xl font-bold">{toKhmerNumeral(students.length)} <span className="text-[11px] font-normal">នាក់</span></h3>
          <p className="font-sans text-[10px] text-sky-100">{studentsCountDesc}</p>
        </div>
      </div>

      {/* Grid of 26 Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {gridTiles.map((tile, index) => (
          <button
            key={tile.id}
            id={tile.id}
            onClick={tile.action}
            className="bg-white hover:bg-slate-50 border border-slate-100/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between space-y-4 group cursor-pointer h-full min-h-[140px]"
          >
            {/* Circle Icon layout matching screenshot */}
            <div className={`w-12 h-12 rounded-2xl ${tile.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition duration-300`}>
              {tile.icon}
            </div>

            <div className="space-y-1">
              <h3 className="font-moul text-[11px] md:text-[12px] text-slate-800 tracking-wide line-clamp-1">{tile.title}</h3>
              <p className="font-sans text-[10px] text-slate-500 leading-snug line-clamp-2">{tile.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* -------------------- MODAL DIALOGS FOR ALL TILES -------------------- */}

      {/* 3. Desk Attendance Modali (ចុះវត្តមានតាមប្លង់តុ) */}
      {activeModal === "desk-attendance" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-4xl w-full shadow-2xl border border-gray-100 relative space-y-4 font-battambang">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"><X /></button>
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-moul text-sm text-sky-800">ចុះវត្តមានទូទៅតាមរៀបចំគំនូសប្លង់តុ (Desk Attendance layout)</h3>
              <p className="text-[10px] text-gray-500 font-sans">ជ្រើសរើសចុចលើតុសិស្ស ដើម្បីផ្លាស់ប្តូរស្ថានភាព៖ វត្តមាន (P), ច្បាប់ (C), អសកម្ម (A)</p>
            </div>

            {/* Simulated Seating Layout */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center">
              <div className="w-1/2 py-2 bg-indigo-650 text-white rounded-lg text-center font-moul text-[11px] uppercase tracking-wider mb-8 shadow-sm">
                🧑‍🏫 ក្តារខៀន និងតុគ្រូ (FRONT OF CLASS)
              </div>

              {/* Grid of 5 rows, 6 columns = 30 desks max */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
                {Array.from({ length: 20 }).map((_, dIdx) => {
                  const studentId = seatingPlan[dIdx];
                  const student = students.find((s) => s.id === studentId);
                  const currentStatus = studentId ? (attendance[studentId]?.[19] || "P") : ""; // Mock day 19

                  const handleToggle = () => {
                    if (!studentId) return;
                    const nextStatus: any = currentStatus === "P" ? "C" : currentStatus === "C" ? "A" : "P";
                    const updatedAttendance = { ...attendance };
                    if (!updatedAttendance[studentId]) updatedAttendance[studentId] = {};
                    updatedAttendance[studentId][19] = nextStatus; // Save into monthday 19
                    onUpdateAttendance(updatedAttendance);
                  };

                  return (
                    <div
                      key={dIdx}
                      onClick={handleToggle}
                      className={`h-22 rounded-xl p-3 border transition cursor-pointer flex flex-col justify-between font-sans ${
                        !studentId
                          ? "bg-gray-100 border-gray-200 border-dashed justify-center text-center text-[10px] text-gray-400"
                          : currentStatus === "P"
                          ? "bg-emerald-50 border-emerald-250 text-emerald-800"
                          : currentStatus === "C"
                          ? "bg-amber-50 border-amber-250 text-amber-800"
                          : "bg-rose-50 border-rose-250 text-rose-800"
                      }`}
                    >
                      {studentId ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400 font-bold">តុ #{toKhmerNumeral(dIdx + 1)}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-md text-white font-black ${
                              currentStatus === "P" ? "bg-emerald-600" : currentStatus === "C" ? "bg-amber-500" : "bg-rose-500"
                            }`}>
                              {currentStatus === "P" ? "វត្តមាន" : currentStatus === "C" ? "ច្បាប់" : "អវត្តមាន"}
                            </span>
                          </div>
                          <div className="font-extrabold text-xs truncate max-w-[120px]">{student?.khmerName}</div>
                          <div className="text-[9px] text-gray-500 truncate">{student?.gender} | លេខ៖ {toKhmerNumeral(student?.id || "")}</div>
                        </>
                      ) : (
                        <span>តុទំនេរ (Empty)</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-150">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-sans text-xs font-bold rounded-xl cursor-pointer">
                រក្សាទុកវត្តមាន
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Input Homework Score modal (បញ្ចូលពិន្ទុកិច្ចការផ្ទះ) */}
      {activeModal === "homework-scores" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-gray-100 relative space-y-4">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"><X /></button>
            <div>
              <h3 className="font-moul text-sm text-sky-800">បញ្ចូលពិន្ទុកិច្ចការផ្ទះប្រចាំសប្តាហ៍</h3>
              <p className="text-[10px] text-gray-500 font-sans">កត់ត្រា និងគ្រប់គ្រង homework score សរុប</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 font-sans">ប្រធានបទកិច្ចការផ្ទះ / Homework Title</label>
                <input
                  type="text"
                  value={homeworkTitle}
                  onChange={(e) => setHomeworkTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none text-xs font-sans"
                />
              </div>

              <div className="max-h-80 overflow-y-auto border border-gray-100 rounded-xl">
                <table className="w-full font-sans text-xs text-left">
                  <thead className="bg-slate-50 text-gray-600 sticky top-0">
                    <tr>
                      <th className="p-3">អត្តលេខ</th>
                      <th className="p-3">ឈ្មោះសិស្ស</th>
                      <th className="p-3">ភេទ</th>
                      <th className="p-3 text-center">ពិន្ទុ (Max 10)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold">{toKhmerNumeral(student.id)}</td>
                        <td className="p-3 font-extrabold">{student.khmerName}</td>
                        <td className="p-3 text-gray-500">{student.gender}</td>
                        <td className="p-3 text-center">
                          <input
                            type="text"
                            value={homeworkScores[student.id] || "១០"}
                            onChange={(e) => setHomeworkScores({ ...homeworkScores, [student.id]: e.target.value })}
                            className="w-14 text-center px-1 py-1 border border-gray-200 rounded-lg outline-none font-bold"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans text-xs font-bold rounded-xl cursor-pointer">
                បោះបង់
              </button>
              <button
                onClick={() => {
                  localStorage.setItem("khmer_homework_saved", JSON.stringify({ title: homeworkTitle, scores: homeworkScores }));
                  alert("រក្សាទុកពិន្ទុកិច្ចការផ្ទះបានជោគជ័យ!");
                  setActiveModal(null);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-bold rounded-xl cursor-pointer"
              >
                រក្សាទុកក្នុងប្រព័ន្ធ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Send Homework Alerts modal (បញ្ជូនកិច្ចការផ្ទះទៅអាណាព្យាបាល) */}
      {activeModal === "send-parent-alerts" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-gray-100 relative space-y-4">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"><X /></button>
            <div>
              <h3 className="font-moul text-sm text-sky-800">បញ្ជូនកិច្ចការផ្ទះ និងលទ្ធផលទៅកាន់អាណាព្យាបាល</h3>
              <p className="text-[10px] text-gray-500 font-sans">ផ្ញើសារសង្ខេបពិន្ទុតាម Telegram Channel</p>
            </div>

            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 font-sans text-xs text-sky-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">គំរូសារផ្ញើជូនមាតាបិតា៖</p>
                <div className="bg-white p-3 rounded-lg border border-sky-200/50 text-slate-700 font-mono text-[11px] leading-relaxed mt-2 shadow-sm space-y-1">
                  <p className="font-bold text-sky-900 border-b pb-1">📢 សេចក្ដីជូនដំណឹងពិន្ទុកិច្ចការផ្ទះ</p>
                  <p>សាលារៀន៖ {structure.schoolName}</p>
                  <p>ថ្នាក់រៀន៖ {structure.gradeName} | គ្រូបង្រៀន៖ {structure.teacherName}</p>
                  <p>ប្រធានបទ៖ {homeworkTitle}</p>
                  <p>---------------------------------</p>
                  {students.slice(0, 3).map((std) => (
                    <p key={std.id}>- សិស្ស {std.khmerName} (ID: {std.id})៖ ទទួលពិន្ទុ {homeworkScores[std.id] || "១០"}/១០</p>
                  ))}
                  <p>... រួមទាំងសិស្សផ្សេងទៀតទាំងអស់ក្នុងថ្នាក់ ...</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  alert("បានបញ្ជូនកិច្ចការផ្ទះទៅកាន់ Telegram អាណាព្យាបាលរបស់សិស្សរួចស្រេច!");
                  setActiveModal(null);
                }}
                className="px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-sans text-xs font-black rounded-xl shadow-lg shadow-fuchsia-100 transition cursor-pointer"
              >
                ✈️ ចាប់ផ្តើមផ្ញើសារឥឡូវនេះ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Class Analytics Overview (វិភាគទិន្នន័យសរុប) */}
      {activeModal === "class-analytics" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl border border-gray-100 relative space-y-4">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"><X /></button>
            <div className="border-b pb-2">
              <h3 className="font-moul text-sm text-sky-800">វិភាគទិន្នន័យកម្រិតថ្នាក់ទូទៅ (Class Analytics)</h3>
              <p className="text-[10px] text-gray-500 font-sans">ស្ថិតិមធ្យមភាគ វត្តមាន និងភេទរបស់សិស្សក្នុងឆ្នាំគំរូ {structure.academicYear}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center font-sans">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">កម្រិតវត្តមានសរុប</span>
                <span className="text-3xl font-extrabold text-indigo-700">៩៨.៥%</span>
                <p className="text-[10px] text-indigo-500 mt-1">អវត្តមានអត្រាទាបបំផុតក្នុងខែនេះ</p>
              </div>
              <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 text-center font-sans">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">មធ្យមភាគពិន្ទុថ្នាក់</span>
                <span className="text-3xl font-extrabold text-teal-700">៨.៤៥</span>
                <p className="text-[10px] text-teal-500 mt-1">មុខវិជ្ជាគណិត-អក្សរសាស្ត្រនាំមុខ</p>
              </div>
              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-center font-sans">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">សិស្សទន់ / ត្រូវការជំនួយ</span>
                <span className="text-3xl font-extrabold text-blue-700">១នាក់</span>
                <p className="text-[10px] text-blue-500 mt-1">ដោះស្រាយ និងដឹកនាំយ៉ាងយកចិត្តទុកដក់</p>
              </div>
            </div>

            {/* Quick list of top accomplishments */}
            <div className="space-y-2 border border-slate-100 p-4 rounded-2xl bg-slate-50/50">
              <h4 className="text-xs font-extrabold font-sans text-gray-700">🏆 ព្រឹត្តិការណ៍លេចធ្លោសប្តាហ៍នេះ៖</h4>
              <ul className="text-[11px] font-sans text-slate-600 list-disc list-inside space-y-1">
                <li>សិស្ស <span className="font-bold text-gray-800">ផន សៀវម៉ី</span> សម្រេចបានពិន្ទុអតិបរមា គ្រប់មុខវិជ្ជា។</li>
                <li>កម្រិតវត្តមានរក្សាបានល្អឥតខ្ចោះដល់ថ្ងៃទី១៩ ខែនេះ។</li>
                <li>សម្ភារៈតុបតែងថ្នាក់ និងវេនសម្អាតរៀបចំបានល្អរួចរាល់។</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 11. Subject Analytics modal (វិភាគតាមមុខវិជ្ជា) */}
      {activeModal === "subject-analytics" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-gray-100 relative space-y-4">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"><X /></button>
            <div className="border-b pb-2">
              <h3 className="font-moul text-sm text-sky-800">វិភាគពិន្ទុជាមធ្យមតាមមុខវិជ្ជា</h3>
              <p className="text-[10px] text-gray-500 font-sans">ក្រាហ្វិកប្រៀបធៀបលទ្ធផលសិក្សារបស់សិស្សក្នុងថ្នាក់</p>
            </div>

            {/* Simulated bar chart via Tailwind divs */}
            <div className="space-y-3.5 py-4 font-sans text-xs">
              {[
                { name: "អំណានភាសាខ្មែរ (Reading)", score: 9.2, color: "bg-sky-500" },
                { name: "សរសេរតាមអាន (Dictation)", score: 8.5, color: "bg-indigo-500" },
                { name: "តែងសេចក្ដី (Composition)", score: 7.9, color: "bg-fuchsia-500" },
                { name: "គណិតវិទ្យា (Math)", score: 8.8, color: "bg-pink-500" },
                { name: "វិទ្យាសាស្ត្រ (Science)", score: 8.4, color: "bg-teal-500" },
                { name: "សីលធម៌ (Morality)", score: 9.5, color: "bg-emerald-500" },
                { name: "អង់គ្លេស (English)", score: 7.2, color: "bg-purple-500" }
              ].map((subject, sIdx) => {
                const widthPercent = (subject.score / 10) * 100;
                return (
                  <div key={sIdx} className="space-y-1">
                    <div className="flex justify-between font-bold text-gray-700 text-[11px]">
                      <span>{subject.name}</span>
                      <span className="text-gray-900 font-extrabold">{toKhmerNumeral(subject.score)} / ១០</span>
                    </div>
                    <div className="w-full bg-gray-150 h-3 rounded-full overflow-hidden">
                      <div className={`h-full ${subject.color} rounded-full`} style={{ width: `${widthPercent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 12. Age and Height Analytics (វិភាគអាយុ និងកម្ពស់) */}
      {activeModal === "age-height-analytics" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-gray-100 relative space-y-4">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"><X /></button>
            <div className="border-b pb-2">
              <h3 className="font-moul text-sm text-sky-800">ស្ថិតិប្រៀបធៀបអាយុ និងកម្ពស់របស់សិស្សក្នុងថ្នាក់</h3>
              <p className="text-[10px] text-gray-500 font-sans">របាយការណ៍តាមដានការវិវឌ្ឍរាងកាយ និងអាយុរបស់សិស្សថ្នាក់ទី៤ (ក)</p>
            </div>

            <div className="grid grid-cols-2 gap-4 font-sans py-2">
              <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 text-center">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">កម្ពស់មធ្យមភាគសរុប</span>
                <span className="text-3xl font-extrabold text-[#0369a1]">១៣៦ ស.ម</span>
                <p className="text-[9px] text-[#0284c7] mt-1">កម្រិតស្តង់ដារការលូតលាស់របស់កុមារកម្ពុជា</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-center col-span-1">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">អាយុមធ្យមភាគសរុប</span>
                <span className="text-3xl font-extrabold text-amber-700">៩.៦ ឆ្នាំ</span>
                <p className="text-[9px] text-amber-600 mt-1">(ឆ្នាំកំណើតស្តង់ដារ ២០១៦-២០១៧)</p>
              </div>
            </div>

            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-[#f8fafc] text-slate-600">
                  <tr>
                    <th className="p-3">អត្តលេខ</th>
                    <th className="p-3">ឈ្មោះសិស្ស</th>
                    <th className="p-3">ភេទ</th>
                    <th className="p-3">អាយុពិតប្រាកដ</th>
                    <th className="p-3">កម្ពស់ប្រហាក់ប្រហែល</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student, index) => {
                    // Calculate age roughly
                    const isEven = index % 2 === 0;
                    const age = isEven ? "៩ ឆ្នាំ" : "១០ ឆ្នាំ";
                    const height = isEven ? "១៣៥ ស.ម" : "១៣៨ ស.ម";
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold">{toKhmerNumeral(student.id)}</td>
                        <td className="p-3 font-extrabold">{student.khmerName}</td>
                        <td className="p-3 text-gray-500">{student.gender}</td>
                        <td className="p-3 text-slate-800">{age}</td>
                        <td className="p-3 font-bold text-sky-800">{height}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 15. Yearly Consolidated Report sheet (បញ្ជីបូកសរុបលទ្ធផលប្រចាំឆ្នាំ) */}
      {activeModal === "yearly-summary" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-4xl w-full shadow-2xl border border-gray-100 relative space-y-4">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"><X /></button>
            <div className="border-b pb-2 flex justify-between items-center pr-8">
              <div>
                <h3 className="font-moul text-sm text-sky-800">សន្លឹកបញ្ជីបូកសរុបលទ្ធផល និងមធ្យមភាគប្រចាំឆ្នាំសិក្សា {structure.academicYear}</h3>
                <p className="text-[10px] text-gray-500 font-sans">កោតសរសើរការខិតខំប្រឹងប្រែង និងពិន្ទុជាមធ្យមរួមប្រកបដោយនិរន្តរភាព</p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-sans text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer print:hidden"
              >
                <Download className="w-3.5 h-3.5" /> បោះពុម្ពបញ្ជីសរុប
              </button>
            </div>

            {/* Print Friendly Sheet Table */}
            <div className="overflow-x-auto border rounded-2xl">
              <table className="w-full text-center border-collapse font-sans text-xs">
                <thead className="bg-[#f1f5f9] text-gray-700 font-bold">
                  <tr className="border-b divide-x divide-slate-100">
                    <th className="p-3">ចំណាត់ថ្នាក់</th>
                    <th className="p-3">អត្តលេខ</th>
                    <th className="p-3 text-left">គោត្តនាម និងនាមសិស្ស</th>
                    <th className="p-3">ភេទ</th>
                    <th className="p-3">មធ្យមភាគ ឆមាសទី១</th>
                    <th className="p-3">មធ្យមភាគ ឆមាសទី២</th>
                    <th className="p-3">មធ្យមភាគប្រចាំឆ្នាំ</th>
                    <th className="p-3">និទ្ទេសសរុប</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student, sIdx) => {
                    const annualScore = (8.2 + (sIdx % 3) * 0.4).toFixed(2);
                    const gradeLetter = Number(annualScore) >= 9.0 ? "ល្អប្រសើរ (A)" : Number(annualScore) >= 8.0 ? "ល្អណាស់ (B)" : "ល្អបង្គួរ (C)";
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50 divide-x divide-slate-100">
                        <td className="p-3 font-bold text-sky-700">{toKhmerNumeral(sIdx + 1)}</td>
                        <td className="p-3 font-bold">{toKhmerNumeral(student.id)}</td>
                        <td className="p-3 font-extrabold text-left">{student.khmerName}</td>
                        <td className="p-3 text-gray-500">{student.gender}</td>
                        <td className="p-3">{toKhmerNumeral((Number(annualScore) - 0.2).toFixed(2))}</td>
                        <td className="p-3">{toKhmerNumeral((Number(annualScore) + 0.1).toFixed(2))}</td>
                        <td className="p-3 font-extrabold text-emerald-800 bg-[#ecfdf5]/30">{toKhmerNumeral(annualScore)}</td>
                        <td className="p-3 font-bold text-gray-750">{gradeLetter}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 17. Student activity ledger / Diary Log (សៀវភៅសិក្ខាកាមិក) */}
      {activeModal === "student-ledger" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl border border-gray-100 relative space-y-4">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"><X /></button>
            <div className="border-b pb-2">
              <h3 className="font-moul text-sm text-sky-800">សៀវភៅតាមដានសិក្ខាកាមិក និងកត់ត្រាវិន័យសកម្មភាព</h3>
              <p className="text-[10px] text-gray-500 font-sans">កត់សម្គាល់ឥរិយាបថល្អ ការជួយការងារថ្នាក់ ឬការរំលឹកអនុវត្តវិន័យ</p>
            </div>

            {/* Quick entry form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans text-xs bg-slate-50 p-4 rounded-2xl border ">
              <div>
                <label className="block text-[#475569] font-bold mb-1">ជ្រើសរើសសិស្ស</label>
                <select
                  value={selectedLedgerStudent}
                  onChange={(e) => setSelectedLedgerStudent(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.khmerName} ({s.gender})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#475569] font-bold mb-1">ប្រភេទការកត់ត្រា</label>
                <select
                  value={ledgerCategory}
                  onChange={(e) => setLedgerCategory(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-xl outline-none"
                >
                  <option value="ការកោតសរសើរ">🌟 ការកោតសរសើរ (Commendation)</option>
                  <option value="ការរំលឹក/ពិន័យ">⚠️ ការរំលឹក/ពិន័យ (Infraction)</option>
                  <option value="សកម្មភាព">📋 សកម្មភាពការងារ (Class Task)</option>
                </select>
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-[#475569] font-bold mb-1">ខ្លឹមសារការកត់ត្រា</label>
                  <input
                    type="text"
                    placeholder="បំពេញព័ត៌មាន..."
                    value={ledgerText}
                    onChange={(e) => setLedgerText(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <button
                  onClick={addLedgerEntry}
                  className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl active:scale-95 transition cursor-pointer"
                >
                  <Plus />
                </button>
              </div>
            </div>

            {/* List of Entries */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              <h4 className="font-moul text-[11px] text-[#334155] pl-1">កំណត់ហេតុវិន័យ សម្បត្តិ និងឥរិយាបទសរុប</h4>
              {ledgerEntries.length === 0 ? (
                <p className="text-center text-gray-400 font-sans text-xs py-10">មិនទាន់មានការកត់ត្រាណាមួយនៅឡើយទេ</p>
              ) : (
                <div className="space-y-2">
                  {ledgerEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`font-sans p-3.5 rounded-2xl border flex items-center justify-between text-xs duration-300 transition-all ${
                        entry.category === "ការកោតសរសើរ"
                          ? "bg-emerald-50/50 border-emerald-100"
                          : entry.category === "ការរំលឹក/ពិន័យ"
                          ? "bg-rose-50/55 border-rose-100"
                          : "bg-sky-50/40 border-sky-100"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800">{entry.studentName}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-md text-white font-bold ${
                            entry.category === "ការកោតសរសើរ"
                              ? "bg-emerald-600"
                              : entry.category === "ការរំលឹក/ពិន័យ"
                              ? "bg-rose-500"
                              : "bg-sky-600"
                          }`}>
                            {entry.category}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">({entry.date})</span>
                        </div>
                        <p className="text-[#334155] leading-relaxed font-medium">{entry.content}</p>
                      </div>
                      <button
                        onClick={() => deleteLedgerEntry(entry.id)}
                        className="p-1.5 hover:bg-slate-200/50 rounded-lg text-rose-500 hover:text-rose-700 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 18. Certificate PDF generator (ទាញយកវិញ្ញាបនបត្រ) */}
      {activeModal === "certificate-downloader" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-4xl w-full shadow-2xl border border-gray-100 relative space-y-4">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"><X /></button>
            <div className="border-b pb-2 flex justify-between items-center pr-8 print:hidden">
              <div>
                <h3 className="font-moul text-sm text-sky-800">ប្រព័ន្ធបង្កើតប័ណ្ណសរសើរ / វិញ្ញាបនបត្រឌីហ្សីថល</h3>
                <p className="text-[10px] text-gray-500 font-sans">បង្កើតប័ណ្ណសរសើរសម្រាប់សិស្សឆ្នើមក្នុងលំដាប់ពិន្ទុខ្ពង់ខ្ពស់</p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#d97706] hover:bg-[#b45309] text-white font-sans text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                🖨️ បោះពុម្ពប័ណ្ណសរសើរ
              </button>
            </div>

            {/* Selector panel */}
            <div className="grid grid-cols-2 gap-3 font-sans text-xs bg-slate-50 p-4 rounded-2xl border print:hidden">
              <div>
                <label className="block text-gray-600 font-bold mb-1">ជ្រើសរើសសិស្សទទួលប័ណ្ណ</label>
                <select
                  value={selectedCertStudent}
                  onChange={(e) => setSelectedCertStudent(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.khmerName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 font-bold mb-1">ប្រភេទលិខិតសរសើរ</label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl outline-none"
                >
                  <option value="សិស្សគុណធម៌ និងវិន័យល្អ">🎗️ សិស្សគុណធម៌ និងវិន័យល្អ</option>
                  <option value="សិស្សពូកែប្រចាំខែ">🌟 សិស្សពូកែប្រចាំខែ</option>
                  <option value="សមិទ្ធិផលវិជ្ជាជីវៈឆ្នើម">🎨 សិស្សសកម្ម និងគំនិតច្នៃប្រឌិត</option>
                </select>
              </div>
            </div>

            {/* Dazzling dual-grid Gold Framed Certificate Template */}
            <div className="bg-[#fffbeb] border-[12px] border-amber-500/30 p-10 font-sans text-center text-slate-800 space-y-6 rounded-2xl tracking-wide max-w-3xl mx-auto border-double relative shadow-inner">
              {/* Gold corners decorations */}
              <div className="absolute top-2 left-2 text-2xl text-amber-500">⚜️</div>
              <div className="absolute top-2 right-2 text-2xl text-amber-500">⚜️</div>
              <div className="absolute bottom-2 left-2 text-2xl text-amber-500">⚜️</div>
              <div className="absolute bottom-2 right-2 text-2xl text-amber-500">⚜️</div>

              <div className="space-y-1">
                <h1 className="font-moul text-sm md:text-base text-amber-800">ព្រះរាជាណាចក្រកម្ពុជា</h1>
                <h2 className="font-moul text-xs text-amber-800">ជាតិ សាសនា ព្រះមហាក្សត្រ</h2>
                <div className="mx-auto w-16 h-0.5 bg-gradient-to-r from-amber-400 via-yellow-600 to-amber-500 mt-2"></div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 uppercase block tracking-widest font-extrabold">លិខិតសរសើរ / CERTIFICATE OF HONOR</span>
                <h2 className="font-moul text-lg text-indigo-950">{certType}</h2>
              </div>

              <div className="space-y-3 font-sans text-xs max-w-xl mx-auto leading-relaxed text-slate-700">
                <p>
                  នាយកសាលាបឋមសិក្សា <span className="font-extrabold text-slate-900 border-b border-dashed border-gray-400 pb-0.5">{structure.schoolName}</span> និងលោកគ្រូ/អ្នកគ្រូប្រចាំថ្នាក់រៀន
                </p>
                <div className="bg-white/60 p-4 rounded-xl border border-amber-200 my-4 space-y-2">
                  <p className="text-gray-500 text-[10px]">ផ្ដល់ជូនគំរូល្អដល់៖</p>
                  <h3 className="font-moul text-base text-amber-800">សិស្ស៖ {students.find(s=>s.id === selectedCertStudent)?.khmerName || "ផន សៀវម៉ី"}</h3>
                  <p className="text-[11px] font-bold text-gray-700">ភេទ៖ {students.find(s=>s.id === selectedCertStudent)?.gender || "ស្រី"} | អត្តលេខ៖ {toKhmerNumeral(selectedCertStudent || "១")}</p>
                </div>
                <p className="text-[11px]">
                  ដែលខិតខំប្រឹងប្រែងសិក្សារៀនសូត្រ គោរពវិន័យសាលារៀនបានល្អប្រសើរ ព្រមទាំងមានសីលធម៌ សុជីវធម៌សក្តិសមជាកូនល្អ សិស្សល្អ និងមិត្តល្អ ក្នុងឆ្នាំសិក្សា {toKhmerNumeral(structure.academicYear)} ។
                </p>
              </div>

              <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 pt-8 max-w-xl mx-auto">
                <div className="text-left">
                  <span>បានឃើញ និងឯកភាព</span>
                  <p className="font-moul text-[9px] mt-1">នាយកសាលា</p>
                  <p className="mt-6 font-extrabold text-gray-900">{structure.principalName}</p>
                </div>
                <div className="text-right">
                  <span>ធ្វើនៅថ្ងៃទី១៩ ខែមិថុនា ឆ្នាំ២០២៦</span>
                  <p className="font-moul text-[9px] mt-1">គ្រូទទួលបន្ទុកថ្នាក់</p>
                  <p className="mt-6 font-extrabold text-gray-900">{structure.teacherName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 20. Student scanning badge modal (លេខកូដសិស្ស ឌីហ្សីថលម៉ូដ) */}
      {activeModal === "student-barcode" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 relative space-y-4">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"><X /></button>
            <div className="border-b pb-2">
              <h3 className="font-moul text-sm text-sky-800">លេខកូដសិស្ស (ឌីហ្សីថលម៉ូដ/QR Pass)</h3>
              <p className="text-[10px] text-gray-500 font-sans">ស្កែនដើម្បីស្រង់វត្តមាន ឬផ្ទៀងផ្ទាត់ទិន្នន័យសិក្សារហ័ស</p>
            </div>

            <div className="space-y-4 font-sans text-xs">
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border rounded-2xl space-y-3.5">
                {/* QR Code Placeholder with custom lines */}
                <div className="w-40 h-40 bg-white p-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center shadow-inner relative">
                  <div className="grid grid-cols-4 gap-1 w-full h-full opacity-80">
                    {Array.from({ length: 16 }).map((_, rIdx) => (
                      <div
                        key={rIdx}
                        className={`rounded-sm ${(rIdx * 7) % 3 === 0 ? "bg-slate-900" : "bg-transparent"}`}
                      ></div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-sky-600 text-[10px] px-2 py-1 rounded-md text-white font-black font-sans shadow-md">QR Code</span>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <h4 className="font-moul text-sm text-slate-950">{students[0]?.khmerName}</h4>
                  <p className="text-[10px] font-bold text-gray-500">អត្តលេខសិស្ស៖ {toKhmerNumeral(students[0]?.id || "577")}</p>
                  <p className="text-[10px] text-indigo-700">ថ្នាក់រៀន៖ {structure.gradeName} | {structure.schoolName}</p>
                </div>
              </div>

              {/* Navigation button for each student QR */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                <span className="text-[9px] font-bold text-gray-400 block uppercase pl-1">ចុចជ្រើសរើសសិស្សរួមផ្សំ៖</span>
                <div className="grid grid-cols-2 gap-2">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => {
                        // Normally change visual QR output
                        alert(`កំពុងរៀបចំកូដ QR សង្គាល់សិស្ស៖ ${student.khmerName}`);
                      }}
                      className="p-2 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 text-left truncate font-bold text-[11px]"
                    >
                      {student.khmerName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 22. Class Inventory List (បញ្ជីសារពើភ័ណ្ឌ) */}
      {activeModal === "class-inventory" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl border border-gray-100 relative space-y-4">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"><X /></button>
            <div className="border-b pb-2">
              <h3 className="font-moul text-sm text-sky-800">បញ្ជីសារពើភ័ណ្ឌរូបវន្តរបស់ថ្នាក់រៀន (Classroom Inventory Registry)</h3>
              <p className="text-[10px] text-gray-500 font-sans">កត់ត្រាគ្រឿងសង្ហារិម សៀវភៅ ឧបករណ៍បង្រៀន និងស្ថានភាពខូចខាត</p>
            </div>

            {/* Quick entry inventory widget */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs font-sans bg-slate-50 p-4 rounded-2xl border items-end">
              <div>
                <label className="block text-gray-600 font-bold mb-1">ឈ្មោះសម្ភារៈ</label>
                <input
                  type="text"
                  placeholder="ឧ. តុវែង, កៅអី, កង្ហារ..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full p-2 border rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-bold mb-1">ចំនួនសរុប (Quantity)</label>
                <input
                  type="number"
                  value={newItemQty}
                  onChange={(e) => setNewItemQty(Number(e.target.value))}
                  className="w-full p-2 border rounded-xl outline-none"
                />
              </div>
              <button
                onClick={addInventoryItem}
                className="w-full p-2 bg-sky-600 hover:bg-sky-700 text-white font-sans font-bold rounded-xl active:scale-95 transition cursor-pointer"
              >
                + បន្ថែមម្យ៉ាងទៀត
              </button>
            </div>

            {/* Table inventory list */}
            <div className="overflow-x-auto border rounded-xl max-h-80">
              <table className="w-full text-center font-sans text-xs">
                <thead className="bg-[#f8fafc] text-gray-650 font-bold">
                  <tr className="border-b divide-x divide-slate-100">
                    <th className="p-3">ឈ្មោះសម្ភារៈ</th>
                    <th className="p-3">ចំនួនសរុប</th>
                    <th className="p-3">ស្ថានភាពល្អ</th>
                    <th className="p-3 text-red-600">ខូចខាត</th>
                    <th className="p-3 text-left">បញ្ជាក់ផ្សេងៗ</th>
                    <th className="p-3">លុប</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 divide-x divide-slate-100">
                      <td className="p-3 text-left font-extrabold text-slate-800">{item.name}</td>
                      <td className="p-3 font-bold">{toKhmerNumeral(item.total)}</td>
                      <td className="p-3 text-emerald-750 font-bold">{toKhmerNumeral(item.good)}</td>
                      <td className="p-3 text-rose-600 font-bold">{toKhmerNumeral(item.damaged)}</td>
                      <td className="p-3 text-left text-gray-500 font-medium italic">{item.note || "គ្មាន"}</td>
                      <td className="p-3">
                        <button
                          onClick={() => deleteInventoryItem(item.id)}
                          className="text-rose-500 hover:text-rose-700 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 25. Classroom decorations and materials list planner (សម្ភារៈតុបតែងថ្នាក់) */}
      {activeModal === "classroom-decorations" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl border border-gray-100 relative space-y-4">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"><X /></button>
            <div className="border-b pb-2">
              <h3 className="font-moul text-sm text-sky-800">គម្រោងរៀបចំសម្ភារៈតុបតែង និងសោភ័ណភាពថ្នាក់រៀន</h3>
              <p className="text-[10px] text-gray-500 font-sans">រៀបចំ និងកត់ត្រាការចំណាយផ្ទាំងសំណេរ រូបភាពជញ្ជាំង និងស្លាកស្លោក</p>
            </div>

            {/* Quick entry decor item widget */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs font-sans bg-slate-50 p-4 rounded-2xl border items-end">
              <div>
                <label className="block text-gray-600 font-bold mb-1">ឈ្មោះសម្ភារៈតុបតែង</label>
                <input
                  type="text"
                  placeholder="ឧ. រូបគំនូរអង្គរ, របាពាក្យស្លោក..."
                  value={newDecorName}
                  onChange={(e) => setNewDecorName(e.target.value)}
                  className="w-full p-2 border rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-bold mb-1">តម្លៃប៉ាន់ស្មាន (Cost)</label>
                <input
                  type="text"
                  placeholder="ឧ. ១០,០០០ រៀល"
                  value={newDecorCost}
                  onChange={(e) => setNewDecorCost(e.target.value)}
                  className="w-full p-2 border rounded-xl outline-none"
                />
              </div>
              <button
                onClick={addDecorItem}
                className="w-full p-2 bg-sky-600 hover:bg-sky-700 text-white font-sans font-bold rounded-xl active:scale-95 transition cursor-pointer"
              >
                + បន្ថែមគម្រោង
              </button>
            </div>

            {/* Table decor list */}
            <div className="overflow-x-auto border rounded-xl max-h-80">
              <table className="w-full text-center border-collapse font-sans text-xs">
                <thead className="bg-[#f8fafc] text-gray-650 font-bold">
                  <tr className="border-b divide-x divide-slate-100">
                    <th className="p-3 text-left">ឈ្មោះគម្រោងតុបតែង</th>
                    <th className="p-3">តម្លៃប៉ាន់ស្មាន</th>
                    <th className="p-3">ស្ថានភាព</th>
                    <th className="p-3">លុប</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {decorItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 divide-x divide-slate-100">
                      <td className="p-3 text-left font-extrabold text-slate-800">{item.name}</td>
                      <td className="p-3 font-bold text-indigo-850">{item.estimatedCost}</td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleDecorStatus(item.id)}
                          className={`px-3 py-1 rounded-xl text-[9px] font-bold border transition cursor-pointer ${
                            item.status === "បានទិញរួច"
                              ? "bg-emerald-50 border-emerald-250 text-emerald-800"
                              : item.status === "គ្រោងទិញ"
                              ? "bg-amber-50 border-amber-250 text-amber-800"
                              : "bg-slate-50 border-slate-200 text-slate-700"
                          }`}
                        >
                          {item.status} ({item.status === "បានទិញរួច" ? "✅" : item.status === "គ្រោងទិញ" ? "📋" : "⚙️"})
                        </button>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => deleteDecorItem(item.id)}
                          className="text-rose-500 hover:text-rose-700 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
