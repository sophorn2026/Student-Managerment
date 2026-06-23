import React from "react";
import { Student, ClassStructure, MonthlyScores } from "../types";
import { toKhmerNumeral, getKhmerLunarSignatureDate, getKhmerMention } from "../utils";
import Header from "./Header";
import { Award, Trophy, Star, Medal, Sparkles, Printer } from "lucide-react";

interface HonorBoardProps {
  students: Student[];
  structure: ClassStructure;
  scores: MonthlyScores;
  monthName: string;
}

export default function HonorBoard({ students, structure, scores, monthName }: HonorBoardProps) {
  // Compute top 5 students based on average score for the selected month
  const topStudents = React.useMemo(() => {
    if (students.length === 0) return [];

    const computedList = students.map((student) => {
      const studentScores = scores[student.id];
      if (!studentScores) return { student, avg: 0 };

      // Calculate simple average across all subjects
      const vals = Object.values(studentScores);
      const total = vals.reduce((a, b) => a + b, 0);
      const avg = total / vals.length;
      return { student, avg };
    });

    // Sort descending by average
    return computedList
      .filter((item) => item.avg > 0)
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);
  }, [students, scores]);

  const todayStr = getKhmerLunarSignatureDate(new Date());

  // Positions configurations matching Image 4 layout:
  // Item 1 (Rank 1): Top Center
  // Item 2 (Rank 2): Middle Left
  // Item 3 (Rank 3): Middle Right
  // Item 4 (Rank 4): Bottom Left
  // Item 5 (Rank 5): Bottom Right

  const rank1 = topStudents[0];
  const rank2 = topStudents[1];
  const rank3 = topStudents[2];
  const rank4 = topStudents[3];
  const rank5 = topStudents[4];

  const getCardStyle = (rankNum: number) => {
    switch (rankNum) {
      case 1:
        return "border-4 border-amber-400 bg-amber-50/20 shadow-amber-100 ring-4 ring-amber-300/30";
      case 2:
        return "border-4 border-slate-300 bg-slate-50/20 shadow-slate-100 ring-2 ring-slate-200/30";
      case 3:
        return "border-4 border-orange-300 bg-orange-50/20 shadow-orange-100 ring-2 ring-orange-200/20";
      case 4:
        return "border-2 border-emerald-400 bg-emerald-50/10 shadow-emerald-50";
      case 5:
        return "border-2 border-indigo-400 bg-indigo-50/10 shadow-indigo-50";
      default:
        return "";
    }
  };

  const getRankBadgeProps = (rankNum: number) => {
    const defaultClasses = "absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-md font-sans text-sm ";
    switch (rankNum) {
      case 1:
        return {
          icon: <Trophy size={16} className="text-amber-500 animate-bounce" />,
          bgColor: "bg-amber-400 text-amber-950 ring-2 ring-white",
          labelText: "១"
        };
      case 2:
        return {
          icon: <Award size={16} className="text-slate-500" />,
          bgColor: "bg-slate-400 text-slate-950 ring-2 ring-white",
          labelText: "២"
        };
      case 3:
        return {
          icon: <Medal size={16} className="text-orange-500" />,
          bgColor: "bg-orange-400 text-orange-950 ring-2 ring-white",
          labelText: "៣"
        };
      case 4:
        return {
          icon: <Star size={14} className="text-emerald-500 animate-spin" style={{ animationDuration: '3s' }} />,
          bgColor: "bg-emerald-500 ring-2 ring-white",
          labelText: "៤"
        };
      case 5:
        return {
          icon: <Star size={14} className="text-indigo-500" />,
          bgColor: "bg-indigo-505 bg-indigo-500 ring-2 ring-white",
          labelText: "៥"
        };
      default:
        return { icon: null, bgColor: "bg-gray-400", labelText: "" };
    }
  };

  const renderStudentFrame = (item: typeof rank1, rankNum: number) => {
    if (!item) {
      return (
        <div className="flex flex-col items-center justify-center w-36 h-48 border-2 border-dashed border-gray-200 rounded-xl text-gray-300 font-sans text-xs">
          <span>មិនទាន់មាន</span>
        </div>
      );
    }

    const badge = getRankBadgeProps(rankNum);
    const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.student.khmerName)}&backgroundColor=0369a1`;
    const mention = getKhmerMention(item.avg);

    return (
      <div className="flex flex-col items-center select-none">
        {/* Rounded Portrait Container */}
        <div className={`relative w-28 h-36 md:w-32 md:h-40 rounded-2xl overflow-hidden shadow-md group ${getCardStyle(rankNum)}`}>
          <img
            src={item.student.photoUrl || defaultAvatar}
            alt={item.student.khmerName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            onError={(e) => {
              e.currentTarget.src = defaultAvatar;
            }}
          />
          {/* Rank Badge inside/outside */}
          <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 ${badge.bgColor} px-3 py-0.5 rounded-full text-xs font-bold shadow-md border border-white flex items-center gap-1 min-w-[36px] justify-center`}>
            {badge.icon}
            <span className="font-sans text-[11px] leading-tight">{badge.labelText}</span>
          </div>
        </div>

        {/* Name Slate underneath with customizable frame */}
        <div className="mt-3.5 px-4 py-1.5 rounded-xl border border-gray-100 bg-white shadow-xs text-center min-w-[120px] max-w-[140px]">
          <h4 className="font-sans text-[13px] font-bold text-sky-950 truncate">{item.student.khmerName}</h4>
          <span className="font-sans text-[9px] text-gray-400 block font-semibold">
            មធ្យមភាគ៖ {toKhmerNumeral(item.avg.toFixed(2))}
          </span>
          <span className={`font-sans text-[9px] ${mention.color}`}>
            {mention.phrase} ({mention.char})
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Configuration operations / Command bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 print:hidden m-1">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
            <Trophy size={22} className="animate-bounce" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-gray-800 text-sm">តារាងកិត្តិយសរបស់សិស្ស</h3>
            <p className="font-sans text-xs text-gray-500">
              បង្ហាញសិស្សឆ្នើមទាំង ៥រូប ដែលទទួលបានពិន្ទុខ្ពស់ជាងគេប្រចាំខែ {monthName}
            </p>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-sans text-xs font-bold rounded-xl shadow-md cursor-pointer transition active:scale-95"
        >
          <Printer size={14} />
          បោះពុម្ពតារាងកិត្តិយស (Print PDF)
        </button>
      </div>

      {/* Main Print Container & Graphic Board */}
      <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm print:p-0 print:border-0 print:shadow-none relative overflow-hidden m-1">
        {/* Optional decorative background frame matching Image 4 border decoration */}
        <div className="absolute inset-2 border-4 border-double border-red-500/20 rounded-2xl pointer-events-none -z-10"></div>

        {/* Kingdom Standard Header */}
        <Header structure={structure} />

        <div className="text-center my-6">
          <h2 className="font-sans text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-red-600 via-sky-600 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider py-1 select-none">
            តារាងកិត្តិយស
          </h2>
          <p className="font-sans text-sm md:text-lg font-bold text-sky-800 mt-1">
            ប្រចាំខែ{monthName} ឆ្នាំសិក្សា {structure.academicYear}
          </p>
        </div>

        {/* Absolute Top-5 Layout representing image 4:
            - Center Top: Position 1
            - Mid row (Left / Right): Position 2 & 3
            - Bottom row (Left / Right): Position 4 & 5
        */}
        <div className="flex flex-col items-center py-6 space-y-6 md:space-y-10 max-w-2xl mx-auto my-8 relative">
          
          {/* Row 1: Rank 1 (Center Top) */}
          <div className="flex justify-center w-full relative">
            {/* Soft decorative cloud/shining vector underneath rank 1 */}
            <div className="absolute -inset-10 bg-radial-gradient from-amber-200/20 via-transparent to-transparent -z-10 animate-pulse pointer-events-none"></div>
            {renderStudentFrame(rank1, 1)}
          </div>

          {/* Row 2: Rank 2 (Left) & Rank 3 (Right) */}
          <div className="flex justify-between w-full max-w-lg px-6 gap-4 md:gap-16">
            {renderStudentFrame(rank2, 2)}
            {renderStudentFrame(rank3, 3)}
          </div>

          {/* Row 3: Rank 4 (Left) & Rank 5 (Right) */}
          <div className="flex justify-between w-full max-w-md px-10 gap-4 md:gap-20">
            {renderStudentFrame(rank4, 4)}
            {renderStudentFrame(rank5, 5)}
          </div>
        </div>

        {/* Decorative footer notes */}
        <div className="text-center font-sans text-[11px] text-gray-500 italic max-w-md mx-auto my-6 leading-relaxed">
          🏆 ការទទួលបានកិត្តិយសនេះ គឺផ្អែកទៅលើការខិតខំប្រឹងប្រែងរៀនសូត្រ វត្តមានជាប់លាប់ និងការចូលរួមកិច្ចការសាលាបានយ៉ាងល្អប្រចាំខែ។
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
  );
}
