import React from "react";
import { User, Camera, Upload, Shield, Lock, Eye, EyeOff, Save, Check, MapPin, ArrowLeft } from "lucide-react";
import { ClassStructure } from "../types";

interface AccountDashboardProps {
  structure: ClassStructure;
  onUpdateStructure: (updated: ClassStructure) => void;
  setActiveTab: (tab: string) => void;
}

const CAMBODIA_GEO = {
  "សៀមរាប": {
    "ក្រុងសៀមរាប": [
      "សង្កាត់សាលាកំរើក",
      "សង្កាត់ស្វាយដង្គំ",
      "សង្កាត់គោកចក",
      "សង្កាត់ចុងកៅស៊ូ",
      "សង្កាត់ស្លក្រាម",
      "សង្កាត់ជ្រាវ",
      "សង្កាត់ទឹកវិល"
    ],
    "ស្រុកសូទ្រនិគម": [
      "ឃុំកំពង់ឃ្លាំង",
      "ឃុំដំដែក",
      "ឃុំខ្ចាស់",
      "ឃុំគោកធ្លកក្រោម",
      "ឃុំគោកធ្លកលើ",
      "ឃុំចំណារ",
      "ឃុំតាយ៉ែក"
    ],
    "ស្រុកពួក": [
      "ឃុំពួក",
      "ឃុំល្វា",
      "ឃុំសសរស្តម្ភ",
      "ឃុំកែវពណ៌",
      "ឃុំខ្នាត",
      "ឃុំរើល"
    ],
    "ស្រុកជីក្រែង": [
      "ឃុំកំពង់ក្តី",
      "ឃុំជីក្រែង",
      "ឃុំគោកធ្លក",
      "ឃុំស្ពានត្នោត",
      "ឃុំអន្លង់សំណ"
    ]
  },
  "ភ្នំពេញ": {
    "ខណ្ឌចំការមន": [
      "សង្កាត់ទន្លេបាសាក់",
      "សង្កាត់បឹងត្របែក",
      "សង្កាត់ផ្សារដើមថ្កូវ"
    ],
    "ខណ្ឌដូនពេញ": [
      "សង្កាត់ផ្សារថ្មីទី១",
      "សង្កាត់ផ្សារថ្មីទី២",
      "សង្កាត់ផ្សារថ្មីទី៣",
      "សង្កាត់ចតុមុខ",
      "សង្កាត់វត្តភ្នំ"
    ],
    "ខណ្ឌទួលគោក": [
      "សង្កាត់ផ្សារដេប៉ូទី១",
      "សង្កាត់ទឹកល្អក់ទី១",
      "សង្កាត់បឹងកក់ទី១"
    ],
    "ខណ្ឌ៧មករា": [
      "សង្កាត់អូរឡាំពិក",
      "សង្កាត់មនោរម្យ",
      "សង្កាត់វាលវង់"
    ]
  },
  "បាត់ដំបង": {
    "ក្រុងបាត់ដំបង": [
      "សង្កាត់ស្វាយប៉ោ",
      "សង្កាត់ព្រែកព្រះស្តេច",
      "សង្កាត់រកា",
      "សង្កាត់ចំការសំរោង"
    ],
    "ស្រុកឯកភ្នំ": [
      "ឃុំពាមឯក",
      "ឃុំព្រែកនរិន្ទ",
      "ឃុំព្រែកហ្លួង",
      "ឃុំព្រែកខ្ពប"
    ],
    "ស្រុកសង្កែ": [
      "ឃុំអន្លង់វិល",
      "ឃុំសង្កែ",
      "ឃុំនរា",
      "ឃុំតាប៉ុន"
    ]
  },
  "កំពង់ចាម": {
    "ក្រុងកំពង់ចាម": [
      "សង្កាត់វាលវង់",
      "សង្កាត់សំបួរមាស",
      "សង្កាត់បឹងកុក"
    ],
    "ស្រុកកំពង់សៀម": [
      "ឃុំអំពិល",
      "ឃុំកៀនជ្រៃ",
      "ឃុំកោះទន្ទឹម"
    ]
  },
  "ព្រះសីហនុ": {
    "ក្រុងព្រះសីហនុ": [
      "សង្កាត់ទី១",
      "សង្កាត់ទី២",
      "សង្កាត់ទី៣",
      "សង្កាត់ទី៤"
    ],
    "ស្រុកព្រៃនប់": [
      "ឃុំវាលរេញ",
      "ឃុំព្រៃនប់",
      "ឃុំទឹកល្អក់"
    ]
  }
};

export default function AccountDashboard({
  structure,
  onUpdateStructure,
  setActiveTab
}: AccountDashboardProps) {
  // Profile picture image loading from key
  const [avatar, setAvatar] = React.useState<string>(() => {
    return localStorage.getItem("khmer_account_avatar") || "";
  });

  // Account Basic Form values
  const [lastName, setLastName] = React.useState(() => {
    return localStorage.getItem("khmer_account_lastname") || "ខ. វិទ";
  });
  const [firstName, setFirstName] = React.useState(() => {
    return localStorage.getItem("khmer_account_firstname") || "ខ. វឌ្ឍ";
  });
  const [phoneNumber, setPhoneNumber] = React.useState(() => {
    return localStorage.getItem("khmer_account_phone") || "012 345 678";
  });

  // Section 1: ព័ត៌មានរដ្ឋបាល និង សាលារៀន
  const [adminUnit1, setAdminUnit1] = React.useState(() => {
    return localStorage.getItem("khmer_account_adminunit1") || "មន្ទីរអប់រំ យុវជន និងកីឡា រាជធានី ភ្នំពេញ";
  });
  const [adminUnit2, setAdminUnit2] = React.useState(() => {
    return localStorage.getItem("khmer_account_adminunit2") || "ការិយាល័យអប់រំ យុវជន និងកីឡានៃ ខណ្ឌចំការមន";
  });
  
  // Syncing schoolName, gradeName, teacherName with structures by default, or letting them override with custom values
  const [schoolName, setSchoolName] = React.useState(structure.schoolName);
  const [schoolCode, setSchoolCode] = React.useState(() => {
    return localStorage.getItem("khmer_account_schoolcode") || "14090207006";
  });
  const [gradeName, setGradeName] = React.useState(structure.gradeName);
  const [teacherName, setTeacherName] = React.useState(structure.teacherName);
  
  const [gender, setGender] = React.useState(() => {
    return localStorage.getItem("khmer_account_gender") || "ប្រុស";
  });
  const [degrees, setDegrees] = React.useState(() => {
    return localStorage.getItem("khmer_account_degrees") || "បរិញ្ញាបត្រ";
  });
  const [trainingLevel, setTrainingLevel] = React.useState(() => {
    return localStorage.getItem("khmer_account_training_level") || "១២+៤";
  });
  const [seniority, setSeniority] = React.useState(() => {
    return localStorage.getItem("khmer_account_seniority") || "៥";
  });
  const [managerRole, setManagerRole] = React.useState(() => {
    return localStorage.getItem("khmer_account_manager_role") || "គ្រូបន្ទុកថ្នាក់";
  });
  const [provinceForDate, setProvinceForDate] = React.useState(() => {
    return localStorage.getItem("khmer_account_province_date") || "សៀមរាប";
  });
  const [academicYear, setAcademicYear] = React.useState(structure.academicYear);
  const [guardianAssocPhone, setGuardianAssocPhone] = React.useState(() => {
    return localStorage.getItem("khmer_account_guardian_assoc_phone") || "012 345 678";
  });

  // Section 2: Logo image state
  const [logoUrl, setLogoUrl] = React.useState<string>(() => {
    return localStorage.getItem("khmer_account_logo") || "";
  });

  // Section 3: ទីតាំងរដ្ឋបាលនៃអង្គភាព
  const [selectedProvince, setSelectedProvince] = React.useState<string>(() => {
    return localStorage.getItem("khmer_account_sel_province") || "សៀមរាប";
  });
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>(() => {
    return localStorage.getItem("khmer_account_sel_district") || "ស្រុកសូទ្រនិគម";
  });
  const [selectedCommune, setSelectedCommune] = React.useState<string>(() => {
    return localStorage.getItem("khmer_account_sel_commune") || "ឃុំកំពង់ឃ្លាំង";
  });

  // Section 4: សុវត្ថិភាពគណនី (ប្តូរពាក្យសម្ងាត់)
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showNewPass, setShowNewPass] = React.useState(false);
  const [showConfirmPass, setShowConfirmPass] = React.useState(false);

  // Auto Reset District and Commune when Province changes
  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    const provinceData = CAMBODIA_GEO[province as keyof typeof CAMBODIA_GEO];
    if (provinceData) {
      const firstDistrict = Object.keys(provinceData)[0];
      setSelectedDistrict(firstDistrict);
      const firstCommune = provinceData[firstDistrict as keyof typeof provinceData][0] || "";
      setSelectedCommune(firstCommune);
    } else {
      setSelectedDistrict("");
      setSelectedCommune("");
    }
  };

  // Auto Reset Commune when District changes
  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    const provinceData = CAMBODIA_GEO[selectedProvince as keyof typeof CAMBODIA_GEO];
    if (provinceData) {
      const communes = provinceData[district as keyof typeof provinceData] || [];
      setSelectedCommune(communes[0] || "");
    } else {
      setSelectedCommune("");
    }
  };

  // Image Upload handler for Avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ទំហំរូបភាពមិនត្រូវលើសពី ៥MB ទេ!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        localStorage.setItem("khmer_account_avatar", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Image Upload handler for School Logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ទំហំឡូហ្គោមិនត្រូវលើសពី ៥MB ទេ!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoUrl(base64String);
        localStorage.setItem("khmer_account_logo", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save function
  const handleSaveChanges = () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert("⚠️ ពាក្យសម្ងាត់ថ្មី និងបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ!");
      return;
    }

    // Persist all localized states
    localStorage.setItem("khmer_account_lastname", lastName);
    localStorage.setItem("khmer_account_firstname", firstName);
    localStorage.setItem("khmer_account_phone", phoneNumber);
    localStorage.setItem("khmer_account_adminunit1", adminUnit1);
    localStorage.setItem("khmer_account_adminunit2", adminUnit2);
    localStorage.setItem("khmer_account_schoolcode", schoolCode);
    localStorage.setItem("khmer_account_gender", gender);
    localStorage.setItem("khmer_account_degrees", degrees);
    localStorage.setItem("khmer_account_training_level", trainingLevel);
    localStorage.setItem("khmer_account_seniority", seniority);
    localStorage.setItem("khmer_account_manager_role", managerRole);
    localStorage.setItem("khmer_account_province_date", provinceForDate);
    localStorage.setItem("khmer_account_guardian_assoc_phone", guardianAssocPhone);
    localStorage.setItem("khmer_account_sel_province", selectedProvince);
    localStorage.setItem("khmer_account_sel_district", selectedDistrict);
    localStorage.setItem("khmer_account_sel_commune", selectedCommune);

    if (newPassword) {
      localStorage.setItem("khmer_account_password_mock", newPassword);
      setNewPassword("");
      setConfirmPassword("");
    }

    // Sync back properties to master application structure
    onUpdateStructure({
      ...structure,
      schoolName,
      gradeName,
      teacherName,
      academicYear
    });

    alert("✨ បានរក្សាទុកការកែប្រែគណនីរបស់អ្នកប្រាស់យ៉ាងជោគជ័យ និងចូលទៅកាន់ Cloud!");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-12">
      
      {/* Curved Blue Header/Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-3xl p-6 shadow-xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Abstract light effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full filter blur-2xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-sky-500/10 rounded-full filter blur-xl transform -translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

        <div className="flex items-center gap-3.5 z-10 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("home")}
            className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-xs text-white rounded-xl shadow-md transition border border-white/10 cursor-pointer flex items-center justify-center gap-1 shrink-0"
            title="ត្រឡប់ទៅទំព័រដើម"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-moul text-[10px] hidden sm:inline">ត្រឡប់ទៅទំព័រដើម</span>
          </button>
          
          <div className="w-px h-8 bg-white/20 hidden sm:block"></div>
          
          <div>
            <h2 className="font-moul text-sm md:text-base tracking-wide text-amber-200">គណនីរបស់អ្នកប្រើប្រាស់</h2>
            <p className="text-[10px] text-sky-100 font-bold uppercase tracking-wider mt-0.5">
              ប្រវត្តរូបផ្ទាល់ខ្លួន ស្ថានភាពរដ្ឋបាល និងទីតាំងអង្គភាពរបស់គ្រូបង្រៀន
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <span className="px-3 py-1 bg-amber-400 text-slate-900 font-extrabold text-[9px] uppercase tracking-wider rounded-lg shadow-sm font-sans">
            ● គណនីសកម្ម
          </span>
        </div>
      </div>

      {/* Main Container - Card Stack */}
      <div className="space-y-6">
        
        {/* Card 1: Avatar and basic names */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row items-center gap-6">
            
            {/* Round Avatar edit circle */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 rounded-full border-4 border-slate-100 shadow-md bg-slate-50 flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-14 h-14 text-slate-300" />
                )}
              </div>
              
              <label className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-110 active:scale-95 transition">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Basic Info input labels fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 w-full">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold block">✓ នាមត្រកូល</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="នាមត្រកូល..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold block">✓ ឈ្មោះ</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="ឈ្មោះ..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold block">✓ លេខទូរស័ព្ទ</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="លេខទូរស័ព្ទ..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Card 2: ព័ត៌មានរដ្ឋបាល និង សាលារៀន */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-xl">
              <Shield className="w-4 h-4" />
            </span>
            <h3 className="font-moul text-[11px] text-slate-800">ព័ត៌មានរដ្ឋបាល និង សាលារៀន</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
            
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold block">១. អង្គភាពគ្រប់គ្រង ១</label>
              <input
                type="text"
                value={adminUnit1}
                onChange={(e) => setAdminUnit1(e.target.value)}
                placeholder="មន្ទីរអប់រំ យុវជន និងកីឡា..."
                className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold block">២. អង្គភាពគ្រប់គ្រង ២</label>
              <input
                type="text"
                value={adminUnit2}
                onChange={(e) => setAdminUnit2(e.target.value)}
                placeholder="ការិយាល័យអប់រំ..."
                className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold block">៣. ឈ្មោះសាលា</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="ឈ្មោះសាលា..."
                className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold block">៤. លេខកូដសាលា</label>
              <input
                type="text"
                value={schoolCode}
                onChange={(e) => setSchoolCode(e.target.value)}
                placeholder="លេខកូដសាលា..."
                className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 md:col-span-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold block">៥. ឈ្មោះថ្នាក់</label>
                <input
                  type="text"
                  value={gradeName}
                  onChange={(e) => setGradeName(e.target.value)}
                  placeholder="ឈ្មោះថ្នាក់..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold block">៦. ឈ្មោះគ្រូកម្រិត</label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="ឈ្មោះគ្រូ..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:col-span-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold block">៧. ភេទ</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition bg-white"
                >
                  <option value="ប្រុស">ប្រុស</option>
                  <option value="ស្រី">ស្រី</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold block">៨. កម្រិតវប្បធម៌</label>
                <input
                  type="text"
                  value={degrees}
                  onChange={(e) => setDegrees(e.target.value)}
                  placeholder="កម្រិតវប្បធម៌..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:col-span-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold block">៩. កម្រិតបណ្តុះបណ្តាល</label>
                <input
                  type="text"
                  value={trainingLevel}
                  onChange={(e) => setTrainingLevel(e.target.value)}
                  placeholder="កម្រិតបណ្តុះបណ្តាល..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold block">១០. អតីតភាពឆ្នាំ</label>
                <input
                  type="text"
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value)}
                  placeholder="អតីតភាពឆ្នាំ..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:col-span-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold block">១១. តួនាទីអ្នកគ្រប់គ្រង</label>
                <input
                  type="text"
                  value={managerRole}
                  onChange={(e) => setManagerRole(e.target.value)}
                  placeholder="តួនាទីអ្នកគ្រប់គ្រង..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold block">១២. ខេត្ត (សម្រាប់ថ្ងៃខែ)</label>
                <input
                  type="text"
                  value={provinceForDate}
                  onChange={(e) => setProvinceForDate(e.target.value)}
                  placeholder="ខេត្ត..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:col-span-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold block">១៣. ឆ្នាំសិក្សា</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="ឆ្នាំសិក្សា..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold block">១៤. លេខទូរស័ព្ទសមាគមអាណាព្យាបាល</label>
                <input
                  type="text"
                  value={guardianAssocPhone}
                  onChange={(e) => setGuardianAssocPhone(e.target.value)}
                  placeholder="លេខទូរស័ព្ទសមាគមអាណាព្យាបាល..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition"
                />
              </div>
            </div>

          </div>

          {/* School Logo Drag Drop Upload Box - inline within the card stack matching photo placement */}
          <div className="border border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-6 transition flex flex-col items-center justify-center space-y-3 cursor-pointer relative min-h-[140px] text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {logoUrl ? (
              <div className="flex items-center gap-4 text-left">
                <img src={logoUrl} alt="School Logo" className="w-16 h-16 rounded-xl object-contain border border-slate-100 bg-white p-1" />
                <div>
                  <p className="text-xs font-bold text-slate-800">✓ រូបសញ្ញាសាលាបានជ្រើសរើស</p>
                  <p className="text-[9px] text-slate-400 font-sans">ទំហំតូចល្អ និងរួចរាល់សម្រាប់ការបោះពុម្ព</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-500">
                  <Upload className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-800">ទ្បូហ្គោ. រូបសញ្ញាសាលា (Logo)</p>
                  <p className="text-[9px] text-slate-400 font-sans mt-0.5">ទំហំមិនលើសពី 5MB ទ្រង់ទ្រាយ៖ PNG, JPG</p>
                </div>
              </>
            )}
          </div>

        </div>

        {/* Card 3: ទីតាំងរដ្ឋបាលនៃអង្គភាព */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
            <span className="p-1.5 bg-sky-50 text-sky-600 rounded-xl">
              <MapPin className="w-4 h-4" />
            </span>
            <h3 className="font-moul text-[11px] text-slate-800">ទីតាំងរដ្ឋបាលនៃអង្គភាព</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold block">១៥. រាជធានី/ខេត្ត</label>
              <select
                value={selectedProvince}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition bg-white"
              >
                {Object.keys(CAMBODIA_GEO).map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold block">១៦. ក្រុង/ស្រុក/ខណ្ឌ</label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition bg-white"
                disabled={!selectedProvince}
              >
                {selectedProvince &&
                  Object.keys(CAMBODIA_GEO[selectedProvince as keyof typeof CAMBODIA_GEO] || {}).map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold block">១៧. ឃុំ/សង្កាត់/ភូមិ</label>
              <select
                value={selectedCommune}
                onChange={(e) => setSelectedCommune(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold text-slate-800 transition bg-white"
                disabled={!selectedDistrict}
              >
                {selectedProvince && selectedDistrict &&
                  (CAMBODIA_GEO[selectedProvince as keyof typeof CAMBODIA_GEO] as any)[selectedDistrict]?.map((comm: string) => (
                    <option key={comm} value={comm}>{comm}</option>
                  ))}
              </select>
            </div>

          </div>
        </div>

        {/* Card 4: សុវត្ថិភាពគណនី (ប្តូរពាក្យសម្ងាត់) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
            <span className="p-1.5 bg-amber-55 text-amber-600 bg-amber-50 rounded-xl">
              <Lock className="w-4 h-4" />
            </span>
            <h3 className="font-moul text-[11px] text-slate-800">សុវត្ថិភាពគណនី (ប្តូរពាក្យសម្ងាត់)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold block">ពាក្យសម្ងាត់ថ្មី (បើចង់ប្តូរ)</label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold tracking-widest text-slate-800 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 hover:text-indigo-600 text-slate-400 cursor-pointer"
                >
                  {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold block">បញ្ជាក់ពាក្យសម្ងាត់ថ្មី</label>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs font-bold tracking-widest text-slate-800 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 hover:text-indigo-600 text-slate-400 cursor-pointer"
                >
                  {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

          </div>

          <p className="text-[10px] text-amber-600 font-semibold flex items-center gap-1.5 pt-1">
            <span>ℹ️</span> ទុកឱ្យនៅទំនេរ ប្រសិនបើមិនចង់ប្តូរពាក្យសម្ងាត់។
          </p>
        </div>

        {/* Save Bar Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveChanges}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-lg focus:ring-4 focus:ring-indigo-100 text-white font-semibold rounded-2xl cursor-pointer transition active:scale-95 flex items-center gap-2 "
          >
            <Save className="w-4 h-4" />
            <span className="font-moul text-[11px] tracking-wide">រក្សាទុកការកែប្រែ</span>
          </button>
        </div>

      </div>

    </div>
  );
}
