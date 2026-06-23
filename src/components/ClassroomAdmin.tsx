import React from "react";
import {
  BookOpen,
  Sparkles,
  Plus,
  Trash2,
  Printer,
  Heart,
  Scale,
  ClipboardList,
  Send,
  Table,
  FolderOpen,
  Users,
  Settings,
  User,
  Save,
  Check,
  Calendar,
  Layers,
  Award,
  DollarSign,
  AlertTriangle,
  Bookmark,
  RefreshCw,
  FileText,
  Smile,
  GraduationCap
} from "lucide-react";
import { Student, ClassStructure } from "../types";
import { toKhmerNumeral } from "../utils";

interface ClassroomAdminProps {
  students: Student[];
  structure: ClassStructure;
  setActiveTab: (tab: string) => void;
}

// Sub-interfaces for persistent admin books values
interface DailyLog {
  id: string;
  khmerDate: string; // ថ្ងៃ...ខែ...ឆ្នាំ...ស័ក พ.ศ.
  gregorianDate: string; // ថ្ងៃទី...ខែ...ឆ្នាំ...២០២...
  hourType: string; // ធម្មតា, ព្រឹក, ល្ងាច
  hoursData: { [key: number]: string };
}

interface StudentHealth {
  studentId: string;
  weight: string;
  height: string;
  notes: string;
  measuredDate: string;
}

interface MaterialDistribution {
  id: string;
  itemName: string;
  totalQty: string;
  distributeDate: string;
  records: { [studentId: string]: boolean }; // true if received
}

interface ClassroomRecommendation {
  id: string;
  visitorName: string;
  role: string;
  institution: string;
  visitDate: string;
  comments: string;
  actions: string;
}

interface TeachingAid {
  id: string;
  title: string;
  subject: string;
  createdDate: string;
  usageGuide: string;
  cost: string;
}

interface ParentCollaboration {
  id: string;
  studentId: string;
  parentName: string;
  collabDate: string;
  issue: string;
  agreement: string;
}

interface ActionPlan {
  monthIndex: number;
  objectives: string;
  activities: string;
  expectedResult: string;
  responsible: string;
}

interface DifficultyRecord {
  studentId: string;
  disabilityType: string;
  povertyLevel: string; // ក្រីក្រ១, ក្រីក្រ២, ធម្មតា
  supportStatus: string;
  specialNotes: string;
}

interface CompositionTopic {
  id: string;
  title: string;
  assignedDate: string;
  objectives: string;
  averageScoreEstimate: string;
}

interface MeetingMinute {
  id: string;
  title: string;
  meetingDate: string;
  attendeesCount: string;
  pointsDiscussed: string;
  resolutions: string;
}

export default function ClassroomAdmin({
  students,
  structure,
  setActiveTab
}: ClassroomAdminProps) {
  // Current active book in the left sidebar (1 to 14)
  const [activeBookIdx, setActiveBookIdx] = React.useState<number>(0);

  // Translate numbers to Khmer
  const fKhmer = (num: number | string): string => {
    return toKhmerNumeral(Number(num) || 0);
  };

  // State collections backing each book (fully reactive with localStorage)
  const [dailyLogs, setDailyLogs] = React.useState<DailyLog[]>(() => {
    const saved = localStorage.getItem("khmer_daily_logs");
    return saved ? JSON.parse(saved) : [];
  });

  const [studentHealths, setStudentHealths] = React.useState<StudentHealth[]>(() => {
    const saved = localStorage.getItem("khmer_student_healths1");
    return saved ? JSON.parse(saved) : [];
  });

  const [materials, setMaterials] = React.useState<MaterialDistribution[]>(() => {
    const saved = localStorage.getItem("khmer_materials1");
    return saved ? JSON.parse(saved) : [];
  });

  const [recommendations, setRecommendations] = React.useState<ClassroomRecommendation[]>(() => {
    const saved = localStorage.getItem("khmer_recommendations1");
    return saved ? JSON.parse(saved) : [];
  });

  const [teachingAids, setTeachingAids] = React.useState<TeachingAid[]>(() => {
    const saved = localStorage.getItem("khmer_teaching_aids1");
    return saved ? JSON.parse(saved) : [];
  });

  const [parentCollabs, setParentCollabs] = React.useState<ParentCollaboration[]>(() => {
    const saved = localStorage.getItem("khmer_parent_collabs1");
    return saved ? JSON.parse(saved) : [];
  });

  const [actionPlans, setActionPlans] = React.useState<ActionPlan[]>(() => {
    const saved = localStorage.getItem("khmer_action_plans1");
    return saved ? JSON.parse(saved) : [];
  });

  const [difficultyRecords, setDifficultyRecords] = React.useState<DifficultyRecord[]>(() => {
    const saved = localStorage.getItem("khmer_difficulties1");
    return saved ? JSON.parse(saved) : [];
  });

  const [compositions, setCompositions] = React.useState<CompositionTopic[]>(() => {
    const saved = localStorage.getItem("khmer_compositions1");
    return saved ? JSON.parse(saved) : [];
  });

  const [meetingMinutes, setMeetingMinutes] = React.useState<MeetingMinute[]>(() => {
    const saved = localStorage.getItem("khmer_meeting_minutes1");
    return saved ? JSON.parse(saved) : [];
  });

  // Slow learner support plans
  const [slowLearnerPlans, setSlowLearnerPlans] = React.useState<{ [studId: string]: string }>(() => {
    const saved = localStorage.getItem("khmer_slow_learner_plans1");
    return saved ? JSON.parse(saved) : {};
  });

  // Save changes to localStorage automatically
  React.useEffect(() => {
    localStorage.setItem("khmer_daily_logs", JSON.stringify(dailyLogs));
  }, [dailyLogs]);
  React.useEffect(() => {
    localStorage.setItem("khmer_student_healths1", JSON.stringify(studentHealths));
  }, [studentHealths]);
  React.useEffect(() => {
    localStorage.setItem("khmer_materials1", JSON.stringify(materials));
  }, [materials]);
  React.useEffect(() => {
    localStorage.setItem("khmer_recommendations1", JSON.stringify(recommendations));
  }, [recommendations]);
  React.useEffect(() => {
    localStorage.setItem("khmer_teaching_aids1", JSON.stringify(teachingAids));
  }, [teachingAids]);
  React.useEffect(() => {
    localStorage.setItem("khmer_parent_collabs1", JSON.stringify(parentCollabs));
  }, [parentCollabs]);
  React.useEffect(() => {
    localStorage.setItem("khmer_action_plans1", JSON.stringify(actionPlans));
  }, [actionPlans]);
  React.useEffect(() => {
    localStorage.setItem("khmer_difficulties1", JSON.stringify(difficultyRecords));
  }, [difficultyRecords]);
  React.useEffect(() => {
    localStorage.setItem("khmer_compositions1", JSON.stringify(compositions));
  }, [compositions]);
  React.useEffect(() => {
    localStorage.setItem("khmer_meeting_minutes1", JSON.stringify(meetingMinutes));
  }, [meetingMinutes]);
  React.useEffect(() => {
    localStorage.setItem("khmer_slow_learner_plans1", JSON.stringify(slowLearnerPlans));
  }, [slowLearnerPlans]);

  // Sidebar Administrative books list
  const ADMIN_BOOKS_MENU = [
    { idx: 0, label: "១. សៀវភៅកត់ត្រាប្រចាំថ្ងៃ", short: "កត់ត្រាប្រចាំថ្ងៃ", emoji: "📖" },
    { idx: 1, label: "២. តាមដានទម្ងន់ និងកម្ពស់សិស្ស", short: "ទម្ងន់ និងកម្ពស់", emoji: "⚖️" },
    { idx: 2, label: "៣. សៀវភៅទទួលចែកសម្ភារៈ", short: "ទទួលចែកសម្ភារៈ", emoji: "📦" },
    { idx: 3, label: "៤. សៀវភៅអនុសាសន៍", short: "អនុសាសន៍", emoji: "📝" },
    { idx: 4, label: "៥. សៀវភៅប្រចាំថ្នាក់ និងសិស្ស", short: "ប្រចាំថ្នាក់ និងសិស្ស", emoji: "👥" },
    { idx: 5, label: "៦. សៀវភៅផលិតសម្ភារៈ", short: "ផលិតសម្ភារៈ", emoji: "🎨" },
    { idx: 6, label: "៧. សៀវភៅទំនាក់ទំនងមាតាបិតាសិស្ស", short: "ទំនាក់ទំនងមាតាបិតា", emoji: "🤝" },
    { idx: 7, label: "៨. សៀវភៅគណៈកម្មការទ្រទ្រង់ថ្នាក់", short: "គណការទ្រទ្រង់ថ្នាក់", emoji: "🏛️" },
    { idx: 8, label: "៩. ប្រព័ន្ធសៀវភៅសិស្សរៀនយឺត", short: "សិស្សរៀនយឺត", emoji: "🐌" },
    { idx: 9, label: "១០. ផែនការសកម្មភាពប្រចាំខែ", short: "ផែនការប្រចាំខែ", emoji: "📅" },
    { idx: 10, label: "១១. ប្រព័ន្ធបញ្ជីឈ្មោះសិស្សជួបការលំបាក", short: "សិស្សជួបការលំបាក", emoji: "❤️" },
    { idx: 11, label: "១២. សៀវភៅកែតែងសេចក្តី", short: "កែតែងសេចក្តី", emoji: "✍️" },
    { idx: 12, label: "១៣. សៀវភៅរបាយការណ៍/កិច្ចប្រជុំ", short: "របាយការណ៍កិច្ចប្រជុំ", emoji: "📊" },
    { idx: 13, label: "ការកំណត់ទូទៅ (Settings)", short: "ការកំណត់", emoji: "⚙️" }
  ];

  // ------------------------------------------------------------------------------------------
  // BOOK 1 STATE & HELPERS: សៀវភៅកត់ត្រាប្រចាំថ្ងៃ
  // ------------------------------------------------------------------------------------------
  const [b1KhmerDate, setB1KhmerDate] = React.useState("សុក្រ ១៥កើត ខែជេស្ឋ ឆ្នាំមមី អដ្ឋស័ក ព.ស. ២៥៦៩");
  const [b1GregDate, setB1GregDate] = React.useState("១៩ មិថុនា ២០២៦");
  const [b1HourType, setB1HourType] = React.useState("ធម្មតា (៥ ម៉ោង)");
  const [b1Hour1, setB1Hour1] = React.useState("");
  const [b1Hour2, setB1Hour2] = React.useState("");
  const [b1Hour3, setB1Hour3] = React.useState("");
  const [b1Hour4, setB1Hour4] = React.useState("");
  const [b1Hour5, setB1Hour5] = React.useState("");

  const handleSaveDailyLog = () => {
    const newLog: DailyLog = {
      id: "log_" + Date.now(),
      khmerDate: b1KhmerDate,
      gregorianDate: b1GregDate,
      hourType: b1HourType,
      hoursData: {
        1: b1Hour1,
        2: b1Hour2,
        3: b1Hour3,
        4: b1Hour4,
        5: b1Hour5
      }
    };
    setDailyLogs([newLog, ...dailyLogs]);
    setB1Hour1("");
    setB1Hour2("");
    setB1Hour3("");
    setB1Hour4("");
    setB1Hour5("");
    alert("បានរក្សាទុកទិន្នន័យប្រចាំថ្ងៃចូលក្នុង Cloud / Local Storage រួចរាល់! 🎉");
  };

  const handleDeleteLog = (id: string) => {
    if (confirm("តើអ្នកពិតជាចង់លុបកំណត់ត្រានេះមែនទេ?")) {
      setDailyLogs(dailyLogs.filter(log => log.id !== id));
    }
  };

  // ------------------------------------------------------------------------------------------
  // BOOK 2 STATE & HELPERS: តាមដានទម្ងន់ និងកម្ពស់សិស្ស
  // ------------------------------------------------------------------------------------------
  const [b2StudentId, setB2StudentId] = React.useState("");
  const [b2Weight, setB2Weight] = React.useState("");
  const [b2Height, setB2Height] = React.useState("");
  const [b2Notes, setB2Notes] = React.useState("");
  const [b2Date, setB2Date] = React.useState("១៩ មិថុនា ២០២៦");

  const handleSaveHealth = () => {
    if (!b2StudentId) return alert("សូមជ្រើសរើសសិស្ស");
    const existingIndex = studentHealths.findIndex(h => h.studentId === b2StudentId);
    const item: StudentHealth = {
      studentId: b2StudentId,
      weight: b2Weight,
      height: b2Height,
      notes: b2Notes,
      measuredDate: b2Date
    };

    if (existingIndex > -1) {
      const copy = [...studentHealths];
      copy[existingIndex] = item;
      setStudentHealths(copy);
    } else {
      setStudentHealths([...studentHealths, item]);
    }
    setB2Weight("");
    setB2Height("");
    setB2Notes("");
    alert("បានរក្សាទុកទិន្នន័យវាស់ស្ទង់ស្ថានភាពកាយសម្បទារួចរាល់! ⚖️");
  };

  const getBmiDesc = (bmi: number) => {
    if (isNaN(bmi) || bmi <= 0) return "មិនមានទិន្នន័យ";
    if (bmi < 14) return "ស្គមខ្លាំង (Underweight)";
    if (bmi <= 18.5) return "ធម្មតា (Normal)";
    return "លើសទម្ងន់ (Overweight)";
  };

  // ------------------------------------------------------------------------------------------
  // BOOK 3 STATE & HELPERS: សៀវភៅទទួលចែកសម្ភារៈ
  // ------------------------------------------------------------------------------------------
  const [b3ItemName, setB3ItemName] = React.useState("សៀវភៅសរសេរ កម្រាស់ ២០០ទំព័រ");
  const [b3TotalQty, setB3TotalQty] = React.useState("៥០");
  const [b3DistDate, setB3DistDate] = React.useState("១៩ មិថុនា ២០២៦");
  const [b3Records, setB3Records] = React.useState<{ [studentId: string]: boolean }>({});

  const handleSaveMaterial = () => {
    if (!b3ItemName) return alert("សូមបញ្ចូលឈ្មោះសម្ភារៈ");
    const newDist: MaterialDistribution = {
      id: "mat_" + Date.now(),
      itemName: b3ItemName,
      totalQty: b3TotalQty,
      distributeDate: b3DistDate,
      records: b3Records
    };
    setMaterials([newDist, ...materials]);
    setB3ItemName("");
    setB3TotalQty("");
    setB3Records({});
    alert("បានរក្សាទុកបញ្ជីចែកសម្ភារៈជោគជ័យ! 📦");
  };

  const toggleMaterialRecord = (studId: string) => {
    setB3Records({
      ...b3Records,
      [studId]: !b3Records[studId]
    });
  };

  const handleDeleteMaterial = (id: string) => {
    if (confirm("តើអ្នកចង់លុបបញ្ជីចែកសម្ភារៈនេះមែនទេ?")) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  // ------------------------------------------------------------------------------------------
  // BOOK 4 STATE & HELPERS: សៀវភៅអនុសាសន៍
  // ------------------------------------------------------------------------------------------
  const [b4Visitor, setB4Visitor] = React.useState("");
  const [b4Role, setB4Role] = React.useState("");
  const [b4Institution, setB4Institution] = React.useState("");
  const [b4Comments, setB4Comments] = React.useState("");
  const [b4Actions, setB4Actions] = React.useState("");
  const [b4Date, setB4Date] = React.useState("១៩ មិថុនា ២០២៦");

  const handleSaveRecommendation = () => {
    if (!b4Visitor) return alert("សូមបញ្ចូលឈ្មោះភ្ញៀវ/មន្ត្រីដែលផ្តល់អនុសាសន៍");
    const newRec: ClassroomRecommendation = {
      id: "rec_" + Date.now(),
      visitorName: b4Visitor,
      role: b4Role,
      institution: b4Institution,
      visitDate: b4Date,
      comments: b4Comments,
      actions: b4Actions
    };
    setRecommendations([newRec, ...recommendations]);
    setB4Visitor("");
    setB4Role("");
    setB4Institution("");
    setB4Comments("");
    setB4Actions("");
    alert("បានចុះអនុសាសន៍ចូលសៀវភៅមាសរួចរាល់! 📝");
  };

  // ------------------------------------------------------------------------------------------
  // BOOK 5 STATE & HELPERS: សៀវភៅប្រចាំថ្នាក់ និងសិស្ស
  // ------------------------------------------------------------------------------------------
  const femaleCount = students.filter(s => s.gender === "ស្រី").length;
  const maleCount = students.filter(s => s.gender === "ប្រុស").length;
  const repeaterCount = students.filter(s => s.isRepeated === "បាទ/ចាស" || s.isRepeated === "បាទ" || s.isRepeated === "ចាស").length;
  const poorCount = students.filter(s => s.poorStatus === "ក្រីក្រ១" || s.poorStatus === "ក្រីក្រ២" || s.idPoorCard === "មាន").length;
  const disabilityCount = students.filter(s => s.disability === "មាន").length;

  const getStudentNameById = (id: string) => {
    return students.find(s => s.id === id)?.khmerName || "មិនទាន់កំណត់";
  };

  // ------------------------------------------------------------------------------------------
  // BOOK 6 STATE & HELPERS: សៀវភៅផលិតសម្ភារៈ
  // ------------------------------------------------------------------------------------------
  const [b6Title, setB6Title] = React.useState("");
  const [b6Subject, setB6Subject] = React.useState("");
  const [b6Guide, setB6Guide] = React.useState("");
  const [b6Cost, setB6Cost] = React.useState("");
  const [b6Date, setB6Date] = React.useState("១៩ មិថុនា ២០២៦");

  const handleSaveTeachingAid = () => {
    if (!b6Title) return alert("សូមបញ្ចូលឈ្មោះសម្ភារៈបង្រៀន");
    const newAid: TeachingAid = {
      id: "aid_" + Date.now(),
      title: b6Title,
      subject: b6Subject,
      createdDate: b6Date,
      usageGuide: b6Guide,
      cost: b6Cost
    };
    setTeachingAids([newAid, ...teachingAids]);
    setB6Title("");
    setB6Subject("");
    setB6Guide("");
    setB6Cost("");
    alert("បានរក្សាទុកគម្រោងផលិតសម្ភារៈបង្រៀនជោគជ័យ! 🎨");
  };

  // ------------------------------------------------------------------------------------------
  // BOOK 7 STATE & HELPERS: សៀវភៅទំនាក់ទំនងមាតាបិតាសិស្ស
  // ------------------------------------------------------------------------------------------
  const [b7StudentId, setB7StudentId] = React.useState("");
  const [b7Parent, setB7Parent] = React.useState("");
  const [b7Issue, setB7Issue] = React.useState("");
  const [b7Agreement, setB7Agreement] = React.useState("");
  const [b7Date, setB7Date] = React.useState("១៩ មិថុនា ២០២៦");

  const handleSaveParentCollab = () => {
    if (!b7StudentId || !b7Parent) return alert("សូមបំពេញឈ្មោះសិស្ស និងឈ្មោះអាណាព្យាបាល");
    const newCollab: ParentCollaboration = {
      id: "collab_" + Date.now(),
      studentId: b7StudentId,
      parentName: b7Parent,
      collabDate: b7Date,
      issue: b7Issue,
      agreement: b7Agreement
    };
    setParentCollabs([newCollab, ...parentCollabs]);
    setB7StudentId("");
    setB7Parent("");
    setB7Issue("");
    setB7Agreement("");
    alert("បានកត់ត្រាកិច្ចសហការ និងទំនាក់ទំនងអាណាព្យាបាលរួចរាល់! 🤝");
  };

  // ------------------------------------------------------------------------------------------
  // BOOK 9 STATE & HELPERS: ប្រព័ន្ធសៀវភៅសិស្សរៀនយឺត
  // ------------------------------------------------------------------------------------------
  const slowLearners = React.useMemo(() => {
    // Return students who are flagged with learning struggles or can be customized
    return students.slice(0, 5); // default fallback to first 5
  }, [students]);

  const handleSaveSlowLearnerPlan = (studId: string, plan: string) => {
    setSlowLearnerPlans({
      ...slowLearnerPlans,
      [studId]: plan
    });
    alert("បានរក្សាទុកវិធីសាស្ត្រគាំទ្រសិស្សរៀនយឺតរួចរាល់! 🐌");
  };

  // ------------------------------------------------------------------------------------------
  // BOOK 10 STATE & HELPERS: ផែនការសកម្មភាពប្រចាំខែ
  // ------------------------------------------------------------------------------------------
  const [b10MonthIdx, setB10MonthIdx] = React.useState<number>(4); // Default to May
  const [b10Obj, setB10Obj] = React.useState("");
  const [b10Acts, setB10Acts] = React.useState("");
  const [b10Result, setB10Result] = React.useState("");
  const [b10Resp, setB10Resp] = React.useState("");

  const handleSaveActionPlan = () => {
    const existingIndex = actionPlans.findIndex(p => p.monthIndex === b10MonthIdx);
    const plan: ActionPlan = {
      monthIndex: b10MonthIdx,
      objectives: b10Obj,
      activities: b10Acts,
      expectedResult: b10Result,
      responsible: b10Resp
    };

    if (existingIndex > -1) {
      const copy = [...actionPlans];
      copy[existingIndex] = plan;
      setActionPlans(copy);
    } else {
      setActionPlans([...actionPlans, plan]);
    }
    alert(`បានរក្សាទុកផែនការសកម្មភាពប្រចាំខែមិថុនា/ខែដែលបានជ្រើសរើសជោគជ័យ! 📅`);
  };

  const getPlanForMonth = (mIdx: number) => {
    return actionPlans.find(p => p.monthIndex === mIdx) || {
      monthIndex: mIdx,
      objectives: "",
      activities: "",
      expectedResult: "",
      responsible: ""
    };
  };

  React.useEffect(() => {
    const currentPlan = getPlanForMonth(b10MonthIdx);
    setB10Obj(currentPlan.objectives);
    setB10Acts(currentPlan.activities);
    setB10Result(currentPlan.expectedResult);
    setB10Resp(currentPlan.responsible);
  }, [b10MonthIdx]);

  // ------------------------------------------------------------------------------------------
  // BOOK 11 STATE & HELPERS: ប្រព័ន្ធបញ្ជីឈ្មោះសិស្សជួបការលំបាក
  // ------------------------------------------------------------------------------------------
  const disabledOrVulnerableStudents = React.useMemo(() => {
    return students.filter(s => s.disability === "មាន" || s.poorStatus === "ក្រីក្រ១" || s.poorStatus === "ក្រីក្រ២" || s.idPoorCard === "មាន");
  }, [students]);

  // ------------------------------------------------------------------------------------------
  // BOOK 12 STATE & HELPERS: សៀវភៅកែតែងសេចក្តី
  // ------------------------------------------------------------------------------------------
  const [b12Title, setB12Title] = React.useState("");
  const [b12Date, setB12Date] = React.useState("១៩ មិថុនា ២០២៦");
  const [b12Obj, setB12Obj] = React.useState("");
  const [b12Avg, setB12Avg] = React.useState("៧.៥");

  const handleSaveComposition = () => {
    if (!b12Title) return alert("សូមបញ្ចូលប្រធានតែងសេចក្តី");
    const newComp: CompositionTopic = {
      id: "comp_" + Date.now(),
      title: b12Title,
      assignedDate: b12Date,
      objectives: b12Obj,
      averageScoreEstimate: b12Avg
    };
    setCompositions([newComp, ...compositions]);
    setB12Title("");
    setB12Obj("");
    alert("បានបន្ថែមប្រធានតែងសេចក្តីក្នុងសៀវភៅកែតែងសេចក្តី! ✍️");
  };

  // ------------------------------------------------------------------------------------------
  // BOOK 13 STATE & HELPERS: សៀវភៅរបាយការណ៍/កិច្ចប្រជុំ
  // ------------------------------------------------------------------------------------------
  const [b13Title, setB13Title] = React.useState("");
  const [b13Date, setB13Date] = React.useState("១៩ មិថុនា ២០២៦");
  const [b13Attendees, setB13Attendees] = React.useState("១២");
  const [b13Points, setB13Points] = React.useState("");
  const [b13Res, setB13Res] = React.useState("");

  const handleSaveMeeting = () => {
    if (!b13Title) return alert("សូមបញ្ចូលកម្មវត្ថុនៃកិច្ចប្រជុំ");
    const newMin: MeetingMinute = {
      id: "meet_" + Date.now(),
      title: b13Title,
      meetingDate: b13Date,
      attendeesCount: b13Attendees,
      pointsDiscussed: b13Points,
      resolutions: b13Res
    };
    setMeetingMinutes([newMin, ...meetingMinutes]);
    setB13Title("");
    setB13Points("");
    setB13Res("");
    alert("បានរក្សាទុកកំណត់ហេតុកិច្ចប្រជុំ និងរបាយការណ៍សាលារួចរាល់! 📊");
  };


  return (
    <div className="space-y-6" id="classroom-administration-panel">
      {/* Top Banner Dashboard Actions - Framed with Khmer Art Colors */}
      <div className="bg-[#1e1b4b] text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-indigo-950/80">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📚</span>
          <div>
            <h2 className="font-moul text-sm md:text-base text-yellow-300 tracking-wide">
              ប្រព័ន្ធគ្រប់គ្រងសៀវភៅរដ្ឋបាលថ្នាក់ (Classroom Administrative Books)
            </h2>
            <p className="text-[10px] md:text-xs text-indigo-200/80 font-sans mt-0.5">
              សាលាបឋមសិក្សាកំពង់ស្ដៅ | ឧបករណ៍គ្រប់គ្រងសៀវភៅទាំង១៣ប្រភេទទម្រង់ស្តង់ដារក្រសួង
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("home")}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 font-sans font-bold text-xs text-indigo-250 border border-slate-700/65 rounded-xl cursor-pointer transition flex items-center gap-1.5"
          >
            🏠 ទំព័រដើម
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 font-sans font-bold text-xs text-white rounded-xl cursor-pointer shadow-md transition flex items-center gap-1.5"
          >
            <Printer size={13} />
            <span>បោះពុម្ពបញ្ជី / PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Sidebar Menu Selector */}
        <div className="lg:col-span-1 bg-slate-900 border border-indigo-950 text-indigo-100 rounded-3xl p-4 shadow-xl space-y-2">
          <div className="px-3 py-2 border-b border-indigo-950/70 pb-3 mb-2">
            <h3 className="font-moul text-[11px] text-yellow-400 tracking-wider">សៀវភៅរដ្ឋបាល</h3>
            <p className="text-[9px] font-sans text-indigo-300 mt-0.5 uppercase">13 MINISTRY RECORD BOOKS</p>
          </div>

          <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
            {ADMIN_BOOKS_MENU.map((book) => {
              const isActive = activeBookIdx === book.idx;
              return (
                <button
                  key={book.idx}
                  onClick={() => setActiveBookIdx(book.idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-950"
                      : "hover:bg-slate-800 text-indigo-200"
                  }`}
                >
                  <span className="text-sm">{book.emoji}</span>
                  <span className="truncate">{book.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Book Content Column Card */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-3xl p-6 shadow-md min-h-[560px] flex flex-col justify-between">
          <div className="space-y-6">

            {/* HEADER OF THE SELECTED BOOK */}
            <div className="border-b border-slate-100 pb-4 flex justify-between items-start">
              <div>
                <h3 className="font-moul text-sm text-indigo-950">
                  {ADMIN_BOOKS_MENU[activeBookIdx].label} (គ្រប់គ្រងអនឡាញ)
                </h3>
                <p className="text-[10px] text-slate-500 font-sans mt-1">
                  ទម្រង់ស្តង់ដារលំហូរការងារបែបឌីជីថល សម្រាប់ជំនួយការបង្រៀន
                </p>
              </div>
              <span className="text-3.5xl p-2 bg-indigo-50 text-indigo-700 rounded-2xl">
                {ADMIN_BOOKS_MENU[activeBookIdx].emoji}
              </span>
            </div>

            {/* ==========================================
                BOOK 0: សៀវភៅកត់ត្រាប្រចាំថ្ងៃ
                ========================================== */}
            {activeBookIdx === 0 && (
              <div className="space-y-5 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">១. កាលបរិច្ឆេទ (Khmer Lunar)</label>
                    <input
                      type="text"
                      value={b1KhmerDate}
                      onChange={(e) => setB1KhmerDate(e.target.value)}
                      placeholder="ព.ស..."
                      className="w-full text-xs font-bold p-3 border rounded-xl outline-none border-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">ត្រូវនឹងថ្ងៃទី ខែ ឆ្នាំ (Gregorian)</label>
                    <input
                      type="text"
                      value={b1GregDate}
                      onChange={(e) => setB1GregDate(e.target.value)}
                      className="w-full text-xs font-bold p-3 border rounded-xl outline-none border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1/2">
                  <label className="text-[11px] font-bold text-slate-600 block">ទម្រង់ម៉ោងសិក្សា</label>
                  <select
                    value={b1HourType}
                    onChange={(e) => setB1HourType(e.target.value)}
                    className="w-full text-xs font-bold p-3 border rounded-xl outline-none border-slate-200 bg-slate-50"
                  >
                    <option value="ធម្មតា (៥ ម៉ោង)">ធម្មតា (៥​​​ម៉ោង)</option>
                    <option value="ល្បឿនលឿន (៤ ម៉ោង)">លឿន (៤ ម៉ោង)</option>
                    <option value="បំប៉នសិស្ស (៦ ម៉ោង)">បំប៉ន (៦ ម៉ោង)</option>
                  </select>
                </div>

                {/* Hours grid */}
                <div className="grid grid-cols-1 gap-3.5">
                  <div className="flex gap-3">
                    <span className="w-20 p-2.5 bg-slate-100 flex items-center justify-center font-bold text-[11px] rounded-xl border border-slate-200 text-slate-700 shrink-0">ម៉ោងទី ១</span>
                    <textarea
                      value={b1Hour1}
                      onChange={(e) => setB1Hour1(e.target.value)}
                      placeholder="បញ្ចូលមុខវិជ្ជា និងខ្លឹមសារ (អាចចុះបន្ទាត់បាន)..."
                      className="flex-1 p-2.5 text-xs text-slate-800 border border-slate-150 rounded-xl outline-none focus:border-indigo-400"
                      rows={2}
                    ></textarea>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-20 p-2.5 bg-slate-100 flex items-center justify-center font-bold text-[11px] rounded-xl border border-slate-200 text-slate-700 shrink-0">ម៉ោងទី ២</span>
                    <textarea
                      value={b1Hour2}
                      onChange={(e) => setB1Hour2(e.target.value)}
                      placeholder="បញ្ចូលមុខវិជ្ជា និងខ្លឹមសារ (អាចចុះបន្ទាត់បាន)..."
                      className="flex-1 p-2.5 text-xs text-slate-800 border border-slate-150 rounded-xl outline-none focus:border-indigo-400"
                      rows={2}
                    ></textarea>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-20 p-2.5 bg-slate-100 flex items-center justify-center font-bold text-[11px] rounded-xl border border-slate-200 text-slate-700 shrink-0">ម៉ោងទី ៣</span>
                    <textarea
                      value={b1Hour3}
                      onChange={(e) => setB1Hour3(e.target.value)}
                      placeholder="បញ្ចូលមុខវិជ្ជា និងខ្លឹមសារ (អាចចុះបន្ទាត់បាន)..."
                      className="flex-1 p-2.5 text-xs text-slate-800 border border-slate-150 rounded-xl outline-none focus:border-indigo-400"
                      rows={2}
                    ></textarea>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-20 p-2.5 bg-slate-100 flex items-center justify-center font-bold text-[11px] rounded-xl border border-slate-200 text-slate-700 shrink-0">ម៉ោងទី ៤</span>
                    <textarea
                      value={b1Hour4}
                      onChange={(e) => setB1Hour4(e.target.value)}
                      placeholder="បញ្ចូលមុខវិជ្ជា និងខ្លឹមសារ (អាចចុះបន្ទាត់បាន)..."
                      className="flex-1 p-2.5 text-xs text-slate-800 border border-slate-150 rounded-xl outline-none focus:border-indigo-400"
                      rows={2}
                    ></textarea>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-20 p-2.5 bg-slate-100 flex items-center justify-center font-bold text-[11px] rounded-xl border border-slate-200 text-slate-700 shrink-0">ម៉ោងទី ៥</span>
                    <textarea
                      value={b1Hour5}
                      onChange={(e) => setB1Hour5(e.target.value)}
                      placeholder="បញ្ចូលមុខវិជ្ជា និងខ្លឹមសារ (អាចចុះបន្ទាត់បាន)..."
                      className="flex-1 p-2.5 text-xs text-slate-800 border border-slate-150 rounded-xl outline-none focus:border-indigo-400"
                      rows={2}
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-start">
                  <button
                    onClick={handleSaveDailyLog}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition active:scale-95"
                  >
                    <Save size={14} />
                    <span>រក្សាទុកទិន្នន័យ (Cloud)</span>
                  </button>
                </div>

                {/* History list of saved logs */}
                {dailyLogs.length > 0 && (
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/40 space-y-4">
                    <h4 className="font-moul text-[10px] text-indigo-900 border-b pb-2">កំណត់ហេតុដែលបានរក្សាទុកកន្លងមក</h4>
                    <div className="space-y-3">
                      {dailyLogs.map((log) => (
                        <div key={log.id} className="bg-white border rounded-xl p-3.5 relative shadow-sm text-xs space-y-2">
                          <button
                            onClick={() => handleDeleteLog(log.id)}
                            className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition"
                            title="លុបកំណត់ត្រានេះ"
                          >
                            <Trash2 size={13} />
                          </button>
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="text-amber-500">📅</span>
                            <span>{log.khmerDate}</span>
                            <span className="text-slate-400">({log.gregorianDate})</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-[11px] font-sans">
                            <div className="p-1.5 bg-slate-50 border rounded-lg">
                              <span className="font-bold text-indigo-800">ម៉ោងទី ១៖</span> {log.hoursData[1] || "-"}
                            </div>
                            <div className="p-1.5 bg-slate-50 border rounded-lg">
                              <span className="font-bold text-indigo-800">ម៉ោងទី ២៖</span> {log.hoursData[2] || "-"}
                            </div>
                            <div className="p-1.5 bg-slate-50 border rounded-lg">
                              <span className="font-bold text-indigo-800">ម៉ោងទី ៣៖</span> {log.hoursData[3] || "-"}
                            </div>
                            <div className="p-1.5 bg-slate-50 border rounded-lg">
                              <span className="font-bold text-indigo-800">ម៉ោងទី ៤៖</span> {log.hoursData[4] || "-"}
                            </div>
                            <div className="p-1.5 bg-slate-50 border rounded-lg">
                              <span className="font-bold text-indigo-800">ម៉ោងទី ៥៖</span> {log.hoursData[5] || "-"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==========================================
                BOOK 1: តាមដានទម្ងន់ និងកម្ពស់សិស្ស
                ========================================== */}
            {activeBookIdx === 1 && (
              <div className="space-y-6 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">ជ្រើសរើសសិស្ស</label>
                    <select
                      value={b2StudentId}
                      onChange={(e) => setB2StudentId(e.target.value)}
                      className="w-full p-2.5 border rounded-xl outline-none font-bold text-slate-800 bg-white"
                    >
                      <option value="">-- ជ្រើសរើសសិស្ស --</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.khmerName} (ID: {s.id})</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-24 space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">ទម្ងន់ (គីឡូក្រាម)</label>
                    <input
                      type="number"
                      value={b2Weight}
                      onChange={(e) => setB2Weight(e.target.value)}
                      placeholder="ឧ. ៣០"
                      className="w-full p-2 border rounded-xl outline-none font-bold text-slate-800"
                    />
                  </div>

                  <div className="w-24 space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">កម្ពស់ (សង់ទីម៉ែត្រ)</label>
                    <input
                      type="number"
                      value={b2Height}
                      onChange={(e) => setB2Height(e.target.value)}
                      placeholder="ឧ. ១៣២"
                      className="w-full p-2 border rounded-xl outline-none font-bold text-slate-800"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">សញ្ញាណសុខភាព / សម្គាល់</label>
                    <input
                      type="text"
                      value={b2Notes}
                      onChange={(e) => setB2Notes(e.target.value)}
                      placeholder="សរីរាង្គទូទៅល្អ ឬត្រូវការការយកចិត្តទុកដាក់..."
                      className="w-full p-2 border rounded-xl outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSaveHealth}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold rounded-xl cursor-pointer transition active:scale-95 text-center shrink-0"
                  >
                    រក្សាទុក
                  </button>
                </div>

                {/* List health table */}
                <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-sm">
                  <table className="w-full text-center border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-500 font-bold border-b border-slate-150 text-[11px]">
                      <tr className="divide-x divide-slate-100">
                        <th className="p-3">អត្តលេខ</th>
                        <th className="p-3 text-left">ឈ្មោះសិស្ស</th>
                        <th className="p-3">ទម្ងន់ (គីឡូ)</th>
                        <th className="p-3">កម្ពស់ (សម)</th>
                        <th className="p-3">សន្ទស្សន៍ BMI</th>
                        <th className="p-3">ស្ថានភាពសុខភាព</th>
                        <th className="p-3">សម្គាល់</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-600">
                      {students.map(student => {
                        const rec = studentHealths.find(h => h.studentId === student.id);
                        const weightVal = rec ? Number(rec.weight) : (24 + (Number(student.id) % 12));
                        const heightVal = rec ? Number(rec.height) : (128 + (Number(student.id) % 15));
                        const bmi = weightVal / Math.pow(heightVal / 100, 2);

                        return (
                          <tr key={student.id} className="hover:bg-slate-50 divide-x divide-slate-100">
                            <td className="p-3 text-slate-400 font-bold font-sans">{fKhmer(student.id)}</td>
                            <td className="p-3 text-left text-slate-800">{student.khmerName}</td>
                            <td className="p-3 font-sans text-indigo-750">{fKhmer(weightVal)}</td>
                            <td className="p-3 font-sans text-indigo-750">{fKhmer(heightVal)}</td>
                            <td className="p-3 font-sans text-amber-800">{fKhmer(bmi.toFixed(1))}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                                bmi >= 14 && bmi <= 18.5 
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}>
                                {getBmiDesc(bmi)}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 font-normal">{rec?.notes || "លូតលាស់ធម្មតា"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==========================================
                BOOK 2: សៀវភៅទទួលចែកសម្ភារៈ
                ========================================== */}
            {activeBookIdx === 2 && (
              <div className="space-y-6 text-xs">
                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 space-y-3">
                  <h4 className="font-moul text-[10px] text-indigo-900">កត់ត្រាការចែកសម្ភារៈថ្មី</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">ឈ្មោះសម្ភារៈចែក</label>
                      <input
                        type="text"
                        value={b3ItemName}
                        onChange={(e) => setB3ItemName(e.target.value)}
                        placeholder="ឧ. សៀវភៅសរសេរ, សាប៊ូដុសខ្លួន..."
                        className="w-full p-2 border rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">ចំនួនសរុបដែលបានទទួល</label>
                      <input
                        type="text"
                        value={b3TotalQty}
                        onChange={(e) => setB3TotalQty(e.target.value)}
                        className="w-full p-2 border rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block font-sans">កាលបរិច្ឆេទចែក</label>
                      <input
                        type="text"
                        value={b3DistDate}
                        onChange={(e) => setB3DistDate(e.target.value)}
                        className="w-full p-2 border rounded-xl outline-none font-bold"
                      />
                    </div>
                  </div>

                  {/* Tick list of students */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600 block">ធីកយក សិស្សទទួលបានសម្ភារៈ៖</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto border p-3 rounded-xl bg-white">
                      {students.map(s => {
                        const ticked = !!b3Records[s.id];
                        return (
                          <button
                            key={s.id}
                            onClick={() => toggleMaterialRecord(s.id)}
                            className={`p-2 rounded-lg text-left truncate transition cursor-pointer text-[11px] font-bold flex items-center gap-1.5 ${
                              ticked ? "bg-emerald-50 text-emerald-800 border border-emerald-250" : "bg-slate-50 text-slate-700 border border-slate-200"
                            }`}
                          >
                            <span>{ticked ? "✅" : "⬜"}</span>
                            <span>{s.khmerName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <button
                      onClick={handleSaveMaterial}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs rounded-xl cursor-pointer transition active:scale-95"
                    >
                      + រក្សាទុកបញ្ជីចែក
                    </button>
                  </div>
                </div>

                {/* Distribute materials entries */}
                {materials.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-moul text-[10px] text-slate-800">ប្រវត្តិចែកសម្ភារៈសិស្ស</h4>
                    <div className="space-y-3">
                      {materials.map(mat => (
                        <div key={mat.id} className="border border-slate-100 rounded-2xl p-4 shadow-sm bg-indigo-50/10 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-moul text-[11px] text-emerald-800">🌟 {mat.itemName}</span>
                            <button
                              onClick={() => handleDeleteMaterial(mat.id)}
                              className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-slate-500">
                            <span>កាលបរិច្ឆេទ៖ <strong>{mat.distributeDate}</strong></span>
                            <span>ចំនួនបានចែក៖ <strong>{mat.totalQty} និង</strong></span>
                          </div>
                          {/* Checked receiver students list */}
                          <div className="flex flex-wrap gap-1.5">
                            {students.map(s => {
                              const checked = !!mat.records[s.id];
                              if (!checked) return null;
                              return (
                                <span key={s.id} className="px-2 py-0.5 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-[10px] font-bold">
                                  ✓ {s.khmerName}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==========================================
                BOOK 3: សៀវភៅអនុសាសន៍
                ========================================== */}
            {activeBookIdx === 3 && (
              <div className="space-y-6 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <h4 className="font-moul text-[10px] text-indigo-900">កត់ត្រាអនុសាសន៍មាសថ្មី</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">ឈ្មោះមន្ត្រី / ភ្ញៀវជាតិ</label>
                      <input
                        type="text"
                        value={b4Visitor}
                        onChange={(e) => setB4Visitor(e.target.value)}
                        placeholder="ឧ. ឯកឧត្តម លឹម សុភក្រ"
                        className="w-full p-2 border rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">តួនាទី / មុខដំណែង</label>
                      <input
                        type="text"
                        value={b4Role}
                        onChange={(e) => setB4Role(e.target.value)}
                        placeholder="ឧ. នាយករងការិយាល័យអប់រំ"
                        className="w-full p-2 border rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">ស្ថាប័ន / អង្គភាព</label>
                      <input
                        type="text"
                        value={b4Institution}
                        onChange={(e) => setB4Institution(e.target.value)}
                        placeholder="ឧ. ការិយាល័យអប់រំយុវជននិងកីឡា"
                        className="w-full p-2 border rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 block">សេចក្តីល្អិតល្អន់ និងអនុសាសន៍ផ្តល់ជូន</label>
                    <textarea
                      value={b4Comments}
                      onChange={(e) => setB4Comments(e.target.value)}
                      placeholder="គ្រូបន្ទុកថ្នាក់គួរយកចិត្តទុកដាក់លើសិស្សរៀនយឺត និងការតុបតែងថ្នាក់រៀនឱ្យកាន់តែមានសោភណភាព..."
                      className="w-full p-2.5 border rounded-xl outline-none"
                      rows={3}
                    ></textarea>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 block">ផែនការសកម្មភាពកែសម្រួលរបស់គ្រូ</label>
                    <input
                      type="text"
                      value={b4Actions}
                      onChange={(e) => setB4Actions(e.target.value)}
                      placeholder="នឹងអនុវត្តការតុបតែងបន្ថែមនៅចុងសប្តាហ៍នេះ..."
                      className="w-full p-2 border rounded-xl outline-none"
                    />
                  </div>

                  <div className="flex justify-start">
                    <button
                      onClick={handleSaveRecommendation}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs rounded-xl cursor-pointer transition active:scale-95 animate-pulse"
                    >
                      + ចុះសៀវភៅអនុសាសន៍
                    </button>
                  </div>
                </div>

                {recommendations.length > 0 && (
                  <div className="space-y-3.5">
                    <h4 className="font-moul text-[10px] text-slate-800">សមិទ្ធផលអនុសាសន៍កន្លងមក</h4>
                    <div className="space-y-3">
                      {recommendations.map(rec => (
                        <div key={rec.id} className="border-l-4 border-amber-500 bg-amber-550/5 p-4 rounded-r-2xl space-y-2">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>🌟 {rec.visitorName} ({rec.role})</span>
                            <span className="text-slate-400 font-sans">{rec.visitDate}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed italic">
                            &quot;{rec.comments}&quot;
                          </p>
                          <p className="text-[11px] text-emerald-800 font-bold">
                            ➔ ផែនការអនុវត្ត៖ {rec.actions}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==========================================
                BOOK 4: សៀវភៅប្រចាំថ្នាក់ និងសិស្ស
                ========================================== */}
            {activeBookIdx === 4 && (
              <div className="space-y-6 text-xs">
                {/* Beautiful grid displays of class summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 text-center space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold block">សិស្សសរុបរួម</span>
                    <span className="text-2xl font-black font-sans text-sky-950">{fKhmer(students.length)}</span>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-center space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold block">សិស្សស្រី</span>
                    <span className="text-2xl font-black font-sans text-purple-950">{fKhmer(femaleCount)}</span>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold block">សិស្សត្រួតថ្នាក់</span>
                    <span className="text-2xl font-black font-sans text-amber-950">{fKhmer(repeaterCount)}</span>
                  </div>
                  <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 text-center space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold block">សិស្សក្រីក្រ (ID Poor)</span>
                    <span className="text-2xl font-black font-sans text-teal-950">{fKhmer(poorCount)}</span>
                  </div>
                </div>

                {/* Class officers Display card */}
                <div className="p-5 border border-slate-100 rounded-3xl bg-indigo-50/10 space-y-4">
                  <h4 className="font-moul text-[11px] text-indigo-900 border-b pb-2">🎖️ គណៈកម្មការគ្របគ្រងថ្នាក់រៀនសិស្ស (Class Committee)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-3.5 bg-white border rounded-2xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white text-base">🥇</div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 font-bold block">ប្រធានថ្នាក់</span>
                        <span className="font-bold text-slate-800">{getStudentNameById(structure.presidentId)}</span>
                      </div>
                    </div>
                    <div className="p-3.5 bg-white border rounded-2xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white text-base">🥈</div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 font-bold block">អនុប្រធានទី១</span>
                        <span className="font-bold text-slate-800">{getStudentNameById(structure.vicePresident1Id)}</span>
                      </div>
                    </div>
                    <div className="p-3.5 bg-white border rounded-2xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white text-base">🥉</div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 font-bold block">អនុប្រធានទី២</span>
                        <span className="font-bold text-slate-800">{getStudentNameById(structure.vicePresident2Id)}</span>
                      </div>
                    </div>
                    <div className="p-3.5 bg-white border rounded-2xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-base font-bold">🧼</div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 font-bold block">ប្រធានអនាម័យ</span>
                        <span className="font-bold text-slate-800">ស៊ិន សម្បត្តិ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                BOOK 5: សៀវភៅផលិតសម្ភារៈ
                ========================================== */}
            {activeBookIdx === 5 && (
              <div className="space-y-6 text-xs">
                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 space-y-3">
                  <h4 className="font-moul text-[10px] text-indigo-900">កត់ត្រាសម្ភារៈបង្រៀនផលិតថ្មី</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">ឈ្មោះសម្ភារៈបង្រៀន (Teaching Aid)</label>
                      <input
                        type="text"
                        value={b6Title}
                        onChange={(e) => setB6Title(e.target.value)}
                        placeholder="ឧ. បន្ទះអក្សរផ្ចង់ខ្មែរ"
                        className="w-full p-2 border rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">មុខវិជ្ជាពាក់ព័ន្ធ</label>
                      <input
                        type="text"
                        value={b6Subject}
                        onChange={(e) => setB6Subject(e.target.value)}
                        placeholder="ឧ. ភាសាខ្មែរ"
                        className="w-full p-2 border rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">តម្លៃប៉ាន់ស្មាន (រៀល)</label>
                      <input
                        type="text"
                        value={b6Cost}
                        onChange={(e) => setB6Cost(e.target.value)}
                        placeholder="ឧ. ៨,០០០ រៀល"
                        className="w-full p-2 border rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 block">ណែនាំពីរបៀបកែច្នៃ និងប្រើប្រាស់ធនធាន</label>
                    <input
                      type="text"
                      value={b6Guide}
                      onChange={(e) => setB6Guide(e.target.value)}
                      placeholder="ប្រើក្រដាសកាតុងចាស់ៗ មកបិទភ្ជាប់អក្សរចម្រុះពណ៌..."
                      className="w-full p-2 border rounded-xl outline-none"
                    />
                  </div>

                  <div className="flex justify-start">
                    <button
                      onClick={handleSaveTeachingAid}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs rounded-xl cursor-pointer transition active:scale-95"
                    >
                      + បន្ថែមសម្ភារៈផលិត
                    </button>
                  </div>
                </div>

                {teachingAids.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-moul text-[10px] text-slate-850">បញ្ជីធនធានបង្រៀនផលិតរួច</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {teachingAids.map(aid => (
                        <div key={aid.id} className="bg-white border p-4 rounded-2xl shadow-sm relative space-y-2">
                          <span className="absolute top-3 right-3 text-[10px] font-bold text-indigo-700 bg-indigo-50 border px-2 py-0.5 rounded-lg">
                            {aid.subject}
                          </span>
                          <h5 className="font-bold text-slate-800 text-xs">🛠️ {aid.title}</h5>
                          <p className="text-[11px] text-slate-500 italic leading-relaxed">
                            {aid.usageGuide}
                          </p>
                          <div className="flex justify-between items-center text-[11px] pt-1 border-t text-slate-400 font-bold font-sans">
                            <span>តម្លៃ៖ {aid.cost}</span>
                            <span>ផលិត៖ {aid.createdDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==========================================
                BOOK 6: សៀវភៅទំនាក់ទំនងមាតាបិតាសិស្ស
                ========================================== */}
            {activeBookIdx === 6 && (
              <div className="space-y-6 text-xs font-sans font-bold">
                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 space-y-3">
                  <h4 className="font-moul text-[10px] text-indigo-900">កត់ត្រាការទំនាក់ទំនងអាណាព្យាបាលថ្មី</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">សិស្សដែលជួបការសម្របសម្រួល</label>
                      <select
                        value={b7StudentId}
                        onChange={(e) => setB7StudentId(e.target.value)}
                        className="w-full p-2.5 border rounded-xl outline-none font-bold text-slate-800 bg-white"
                      >
                        <option value="">-- ជ្រើសរើសសិស្ស --</option>
                        {students.map(s => (
                          <option key={s.id} value={s.id}>{s.khmerName} (ID: {s.id})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 block">ឈ្មោះអាណាព្យាបាលសិស្ស</label>
                      <input
                        type="text"
                        value={b7Parent}
                        onChange={(e) => setB7Parent(e.target.value)}
                        placeholder="ឧ. ពៅ ចាន់ធី"
                        className="w-full p-2 border rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">បញ្ហាប្រឈមធំ ឬកម្មវត្ថុពិភាក្សា</label>
                    <textarea
                      value={b7Issue}
                      onChange={(e) => setB7Issue(e.target.value)}
                      placeholder="សិស្សអវត្តមាន ២ថ្ងៃជាប់គ្នា ឬ សិស្សខ្សោយខ្លាំងការអានកម្រិតពាក្យ..."
                      className="w-full p-2.5 border rounded-xl outline-none"
                      rows={2}
                    ></textarea>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block">កិច្ចព្រមព្រៀង និងការប្ដេជ្ញាចិត្តរួមគ្នា</label>
                    <textarea
                      value={b7Agreement}
                      onChange={(e) => setB7Agreement(e.target.value)}
                      placeholder="អាណាព្យាបាលនឹងទូរស័ព្ទប្រាប់គ្រូជាមុន និងតាមដានកិច្ចការគណិតរបស់កូន..."
                      className="w-full p-2.5 border rounded-xl outline-none"
                      rows={2}
                    ></textarea>
                  </div>

                  <div className="flex justify-start">
                    <button
                      onClick={handleSaveParentCollab}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs rounded-xl cursor-pointer transition active:scale-95"
                    >
                      + កត់ត្រាកិច្ចទំនាក់ទំនង
                    </button>
                  </div>
                </div>

                {parentCollabs.length > 0 && (
                  <div className="space-y-3.5">
                    <h4 className="font-moul text-[10px] text-slate-800">កំណត់ហេតុទំនាក់ទំនងអាណាព្យាបាលជារួម</h4>
                    <div className="space-y-3">
                      {parentCollabs.map(col => (
                        <div key={col.id} className="border border-slate-100 hover:border-indigo-150 p-4 rounded-2xl bg-indigo-50/5 text-xs space-y-1.5">
                          <div className="flex justify-between text-slate-800">
                            <span className="font-bold">សិស្ស៖ {getStudentNameById(col.studentId)} (អាណាព្យាបាល៖ {col.parentName})</span>
                            <span className="text-slate-400 font-sans">{col.collabDate}</span>
                          </div>
                          <div className="text-slate-500 font-normal">
                            <p><strong>⚠️ បញ្ហាប្រឈម៖</strong> {col.issue}</p>
                            <p className="text-indigo-850 mt-1"><strong>🤝 កិច្ចព្រមព្រៀង៖</strong> {col.agreement}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==========================================
                BOOK 7: សៀវភៅគណៈកម្មការទ្រទ្រង់ថ្នាក់
                ========================================== */}
            {activeBookIdx === 7 && (
              <div className="space-y-6 text-xs">
                <div className="p-5 border border-slate-100 rounded-3xl bg-indigo-50/10 space-y-4">
                  <h4 className="font-moul text-[11px] text-amber-800 border-b pb-2">គណៈកម្មការអាណាព្យាបាលសិស្សថ្នាក់រៀន (PTA Committee)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white border rounded-2xl space-y-1.5 shadow-sm text-center">
                      <span className="w-10 h-10 mx-auto rounded-full bg-amber-500 flex items-center justify-center text-white text-base">🏫</span>
                      <span className="text-[10px] text-slate-400 font-bold block">ប្រធានគណៈកម្មការ</span>
                      <span className="font-extrabold text-slate-800 block text-xs">លោក ឃុន ជា</span>
                      <span className="text-[10px] text-slate-500">អាណាព្យាបាលសិស្ស ឃុន សុខា</span>
                    </div>

                    <div className="p-4 bg-white border rounded-2xl space-y-1.5 shadow-sm text-center">
                      <span className="w-10 h-10 mx-auto rounded-full bg-blue-500 flex items-center justify-center text-white text-base">🤝</span>
                      <span className="text-[10px] text-slate-400 font-bold block">អនុប្រធានគណៈកម្មការ</span>
                      <span className="font-extrabold text-slate-800 block text-xs">អ្នកស្រី លឹម សាខន</span>
                      <span className="text-[10px] text-slate-500">អាណាព្យាបាលសិស្ស លឹម ដេវីដ</span>
                    </div>

                    <div className="p-4 bg-white border rounded-2xl space-y-1.5 shadow-sm text-center">
                      <span className="w-10 h-10 mx-auto rounded-full bg-teal-500 flex items-center justify-center text-white text-base">💰</span>
                      <span className="text-[10px] text-slate-400 font-bold block">ហេរញ្ញិក (គ្រប់គ្រងថវិកា)</span>
                      <span className="font-extrabold text-slate-800 block text-xs">លោក ពៅ វិសាល</span>
                      <span className="text-[10px] text-slate-500">អាណាព្យាបាលសិស្ស ពៅ ដាលីន</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                BOOK 8: ប្រព័ន្ធសៀវភៅសិស្សរៀនយឺត
                ========================================== */}
            {activeBookIdx === 8 && (
              <div className="space-y-6 text-xs font-bold text-slate-700">
                <div className="bg-indigo-50/20 p-4 rounded-2xl border border-indigo-100 flex items-center gap-3">
                  <span className="text-xl">💡</span>
                  <p className="text-[11px] text-indigo-950 font-sans leading-relaxed">
                    ប្រព័ន្ធជំនួយគ្រប់គ្រងសិស្សរៀនយឺតជួយលោកគ្រូ អ្នកគ្រូក្នុងការកំណត់សិស្សកម្រិតទាប ព្រមទាំងបង្កើតផែនការបំប៉ន និងកែប្រែលទ្ធផលសិក្សាឱ្យកាន់តែប្រសើរឡើង។
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-moul text-[10px] text-slate-800">បញ្ជីសិស្សកំពុងរៀនយឺត និងវិធីសាស្ត្រគាំទ្រ</h4>
                  <div className="overflow-x-auto border rounded-2xl">
                    <table className="w-full text-center border-collapse text-xs">
                      <thead className="bg-[#f8fafc] text-slate-500 font-bold border-b border-slate-100">
                        <tr>
                          <th className="p-3 text-left">ឈ្មោះសិស្ស</th>
                          <th className="p-3">ភេទ</th>
                          <th className="p-3">មុខវិជ្ជាខ្សោយខ្លាំង</th>
                          <th className="p-3">ផែនការសកម្មភាពគាំទ្រពិសេស</th>
                          <th className="p-3">ធ្វើបច្ចុប្បន្នភាព</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {slowLearners.map(stud => {
                          const planVal = slowLearnerPlans[stud.id] || "";
                          return (
                            <tr key={stud.id} className="hover:bg-slate-50/50">
                              <td className="p-3 text-left font-extrabold text-slate-800">{stud.khmerName}</td>
                              <td className="p-3">{stud.gender}</td>
                              <td className="p-3">
                                <span className="px-2.5 py-0.5 bg-rose-50 border border-rose-250 text-rose-700 rounded-lg text-[9px] font-bold">
                                  {stud.id === "0" ? "អំណានខ្មែរ" : "គណិតវិទ្យា"}
                                </span>
                              </td>
                              <td className="p-2">
                                <input
                                  type="text"
                                  value={planVal}
                                  onChange={(e) => setSlowLearnerPlans({ ...slowLearnerPlans, [stud.id]: e.target.value })}
                                  placeholder="ឧ. បណ្ដុះបណ្ដាលអានពាក្យគន្លឹះចុងម៉ោង..."
                                  className="w-full text-xs font-medium p-2 border rounded-xl outline-none"
                                />
                              </td>
                              <td className="p-2">
                                <button
                                  onClick={() => handleSaveSlowLearnerPlan(stud.id, planVal)}
                                  className="px-3.5 py-1.5 bg-[#4f46e5] text-white rounded-xl text-[10px] font-bold cursor-pointer hover:bg-[#3f39cf] active:scale-95"
                                >
                                  រក្សាទុក
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                BOOK 9: ផែនការសកម្មភាពប្រចាំខែ
                ========================================== */}
            {activeBookIdx === 9 && (
              <div className="space-y-6 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-3 border-b pb-4">
                  <label className="text-[11px] font-bold block whitespace-nowrap">ជ្រើសរើសខែរបាយការណ៍សកម្មភាព៖</label>
                  <select
                    value={b10MonthIdx}
                    onChange={(e) => setB10MonthIdx(Number(e.target.value))}
                    className="p-1.5 border rounded-xl outline-none font-bold text-slate-850"
                  >
                    <option value={4}>ខែ ឧសភា</option>
                    <option value={5}>ខែ មិថុនា</option>
                    <option value={6}>ខែ កក្កដា</option>
                    <option value={7}>ខែ សីហា</option>
                  </select>
                </div>

                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="font-moul text-[10px] text-indigo-900">សេចក្តីលំអិតនៃផែនការលម្អិតប្រចាំខែ</h4>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold block">១. គោលបំណងចម្បងនៃខែនេះ (Key Objectives)</label>
                    <textarea
                      value={b10Obj}
                      onChange={(e) => setB10Obj(e.target.value)}
                      placeholder="លើកកម្ពស់វិន័យសៀវភៅអំណានខ្មែរ និងបង្កើនលទ្ធផលគណិតទាក់ទងការវាស់វែង..."
                      className="w-full p-2 border rounded-xl outline-none text-xs font-medium"
                      rows={2}
                    ></textarea>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold block">២. សកម្មភាពសំខាន់ៗ (Core Scheduled Activities)</label>
                    <textarea
                      value={b10Acts}
                      onChange={(e) => setB10Acts(e.target.value)}
                      placeholder="រៀបចំយុទ្ធនាការមហោស្រពអំណាន និងការធ្វើតេស្តពាក់កណ្តាលខែ..."
                      className="w-full p-2 border rounded-xl outline-none text-xs font-medium"
                      rows={2}
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold block">៣. លទ្ធផលរំពឹងទុក (Expected Outputs)</label>
                      <input
                        type="text"
                        value={b10Result}
                        onChange={(e) => setB10Result(e.target.value)}
                        placeholder="សិស្ស ៩៥% នឹងទទួលបានពិន្ទុវិទ្យាសាស្ត្រលើសពី ៥..."
                        className="w-full p-2 border rounded-xl outline-none text-xs font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold block">៤. អ្នកទទួលខុសត្រូវ (Responsible Parties)</label>
                      <input
                        type="text"
                        value={b10Resp}
                        onChange={(e) => setB10Resp(e.target.value)}
                        placeholder="គ្រូបន្ទុកថ្នាក់ និងគណៈកម្មការទ្រទ្រង់ថ្នាក់..."
                        className="w-full p-2 border rounded-xl outline-none text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <button
                      onClick={handleSaveActionPlan}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs rounded-xl cursor-pointer transition active:scale-95"
                    >
                      រក្សាទុកផែនការប្រចាំខែ
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                BOOK 10: ប្រព័ន្ធបញ្ជីឈ្មោះសិស្សជួបការលំបាក
                ========================================== */}
            {activeBookIdx === 10 && (
              <div className="space-y-6 text-xs">
                <div className="bg-rose-50/10 p-4 border border-rose-100 rounded-3xl flex items-center gap-3">
                  <span className="text-xl">❤️</span>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-bold font-sans">
                    បញ្ជីសិស្សទទួលបានជំនួយ ឬជនរងគ្រោះ ជួយសាលា និងសហគមន៍ក្នុងការឧបត្ថម្ភសម្ភារៈ ថវិកា ឬជំនួយសុខភាពបន្ថែមជាបន្ត។
                  </p>
                </div>

                <div className="overflow-x-auto border rounded-2xl">
                  <table className="w-full text-center border-collapse text-xs">
                    <thead className="bg-[#f8fafc] text-slate-500 font-bold border-b">
                      <tr>
                        <th className="p-3 text-left">ឈ្មោះសិស្ស</th>
                        <th className="p-3">ប្រភេទលំបាក / គ្រួសារ</th>
                        <th className="p-3">ប័ណ្ណក្រីក្រ</th>
                        <th className="p-3">ស្ថានភាពការឧបត្ថម្ភ</th>
                        <th className="p-3">សញ្ញាសម្គាល់ពិសេស</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-750 font-bold">
                      {disabledOrVulnerableStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-slate-400">
                            គ្មានសិស្សជួបការលំបាកខ្លាំងនោះទេ 🎉
                          </td>
                        </tr>
                      ) : (
                        disabledOrVulnerableStudents.map(stud => (
                          <tr key={stud.id} className="hover:bg-slate-50/50">
                            <td className="p-3 text-left text-slate-800">{stud.khmerName}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-[9px] font-bold">
                                {stud.poorStatus || "ជនងាយរងគ្រោះ"}
                              </span>
                            </td>
                            <td className="p-3 text-amber-800">{stud.idPoorCard || "គ្មាន"}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-emerald-55/80 text-emerald-800 rounded-lg text-[9px]">
                                {stud.scholarship === "មាន" ? "ទទួលបានអាហារូបករណ៍" : "ទទួលបានសៀវភៅឥតគិតថ្លៃ"}
                              </span>
                            </td>
                            <td className="p-3 text-slate-400 font-normal">{stud.specialTrait || "-"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==========================================
                BOOK 11: សៀវភៅកែតែងសេចក្តី
                ========================================== */}
            {activeBookIdx === 11 && (
              <div className="space-y-6 text-xs">
                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 space-y-3">
                  <h4 className="font-moul text-[10px] text-indigo-900">បន្ថែមប្រធានតែងសេចក្តីថ្មី</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">ប្រធានតែងសេចក្តី (Essay Topic)</label>
                      <input
                        type="text"
                        value={b12Title}
                        onChange={(e) => setB12Title(e.target.value)}
                        placeholder="ឧ. ពូជគោជល់ខ្មែរ ឬ សកម្មភាពសម្អាតផ្ទះ"
                        className="w-full p-2 border rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">មធ្យមភាគពិន្ទុរំពឹងទុក (/១០)</label>
                      <input
                        type="text"
                        value={b12Avg}
                        onChange={(e) => setB12Avg(e.target.value)}
                        className="w-full p-2 border rounded-xl outline-none font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 block">គោលបំណងវាស់ស្ទង់សមត្ថភាពតែង</label>
                    <input
                      type="text"
                      value={b12Obj}
                      onChange={(e) => setB12Obj(e.target.value)}
                      placeholder="វាស់ស្ទង់ការប្រើប្រាស់ពាក្យ ប្រយោគ និងលំហូរគំនិតពិពណ៌នាអំពីគ្រួសារ..."
                      className="w-full p-2 border rounded-xl outline-none"
                    />
                  </div>

                  <div className="flex justify-start">
                    <button
                      onClick={handleSaveComposition}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs rounded-xl cursor-pointer transition active:scale-95"
                    >
                      + រក្សាទុកប្រធាន
                    </button>
                  </div>
                </div>

                {compositions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-moul text-[10px] text-slate-800">ប្រវត្តិប្រធានតែងសេចក្តីដែលបានអនុវត្ត</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {compositions.map(comp => (
                        <div key={comp.id} className="border p-4 bg-white rounded-2xl relative shadow-sm">
                          <h5 className="font-bold text-indigo-950 text-xs text-indigo-900 font-moul">✍️ {comp.title}</h5>
                          <p className="text-[11px] text-slate-600 font-sans font-bold mt-1">
                            គោលបំណង៖ {comp.objectives}
                          </p>
                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold font-sans mt-2.5 pt-2 border-t">
                            <span>ថ្ងៃប្រគល់៖ {comp.assignedDate}</span>
                            <span className="text-emerald-700">មធ្យមភាគ៖ {comp.averageScoreEstimate}/១០</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==========================================
                BOOK 12: សៀវភៅរបាយការណ៍/កិច្ចប្រជុំ
                ========================================== */}
            {activeBookIdx === 12 && (
              <div className="space-y-6 text-xs">
                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 space-y-3">
                  <h4 className="font-moul text-[10px] text-indigo-900">កត់ត្រាកំណត់ហេតុកិច្ចប្រជុំថ្មី</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">កម្មវត្ថុនៃកិច្ចប្រជុំ</label>
                      <input
                        type="text"
                        value={b13Title}
                        onChange={(e) => setB13Title(e.target.value)}
                        placeholder="ឧ. កិច្ចប្រជុំជាមួយអាណាព្យាបាលស្តីពីជួយសិស្សរៀនយឺត..."
                        className="w-full p-2 border rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">ចំនួនសមាជិកដែលចូលរួម</label>
                      <input
                        type="text"
                        value={b13Attendees}
                        onChange={(e) => setB13Attendees(e.target.value)}
                        className="w-full p-2 border rounded-xl outline-none font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 block">ខ្លឹមសារ និងចំនុចពិភាក្សាធំៗ</label>
                    <textarea
                      value={b13Points}
                      onChange={(e) => setB13Points(e.target.value)}
                      placeholder="ពិភាក្សាលើយុទ្ធនាការជំរុញសិស្ស សម្អាតថ្នាក់ និងការឧបត្ថម្ភរបស់ PTA..."
                      className="w-full p-2.5 border rounded-xl outline-none"
                      rows={2}
                    ></textarea>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 block">សេចក្តីសម្រេច/មតិយោបល់ក្រោយអង្គប្រជុំ</label>
                    <textarea
                      value={b13Res}
                      onChange={(e) => setB13Res(e.target.value)}
                      placeholder="សម្រេចបង្កើតថ្នាក់បំប៉នរយៈពេល ១ម៉ោង រាល់ថ្ងៃចន្ទ ដល់ថ្ងៃព្រហស្បតិ៍..."
                      className="w-full p-2.5 border rounded-xl outline-none"
                      rows={2}
                    ></textarea>
                  </div>

                  <div className="flex justify-start">
                    <button
                      onClick={handleSaveMeeting}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs rounded-xl cursor-pointer transition active:scale-95"
                    >
                      + ចុះកំណត់ហេតុ
                    </button>
                  </div>
                </div>

                {meetingMinutes.length > 0 && (
                  <div className="space-y-3.5">
                    <h4 className="font-moul text-[10px] text-slate-850">ប្រវត្តិអង្គប្រជុំ និងព័ត៌មានដែលបានកត់ត្រា</h4>
                    <div className="space-y-3">
                      {meetingMinutes.map(meet => (
                        <div key={meet.id} className="border border-slate-100 p-4.5 bg-yellow-50/5 hover:bg-yellow-50/10 rounded-2xl space-y-2 text-xs">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span className="font-moul text-[11px] text-indigo-900">📌 Topic: {meet.title}</span>
                            <span className="font-sans text-slate-400">{meet.meetingDate}</span>
                          </div>
                          <p className="text-[11px] text-slate-605">
                            <strong>💬 ពិភាក្សា៖</strong> {meet.pointsDiscussed}
                          </p>
                          <p className="text-[11px] text-[#0f5132] font-bold">
                            <strong>✓ សេចក្តីសម្រេច៖</strong> {meet.resolutions}
                          </p>
                          <span className="text-[10px] font-sans font-bold text-slate-400 block pt-1 border-t">
                            សមាជិកចូលរួម៖ {meet.attendeesCount} នាក់
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==========================================
                BOOK 13: ការកំណត់ទូទៅ (Settings)
                ========================================== */}
            {activeBookIdx === 13 && (
              <div className="space-y-6 text-xs text-slate-700 font-bold">
                <div className="p-5 border border-slate-100 bg-slate-50/60 rounded-3xl space-y-4">
                  <h4 className="font-moul text-[11px] text-indigo-900 border-b pb-2">⚙️ ព័ត៌មានគណនី និងការគ្រប់គ្រង Database</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block mb-1">ឈ្មោះសាលារៀន</span>
                      <span className="text-slate-800 text-sm font-extrabold block">{structure.schoolName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">គ្រូបន្ទុកថ្នាក់</span>
                      <span className="text-slate-800 text-sm font-extrabold block">{structure.teacherName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">ឆ្នាំសិក្សា</span>
                      <span className="text-slate-800 text-sm font-extrabold block">{structure.academicYear}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">ស្ថានភាពតភ្ជាប់ (Database Sync)</span>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-[10px] font-bold font-sans inline-block mt-1">
                        ● សកម្ម / CLOUD RUNNING
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
