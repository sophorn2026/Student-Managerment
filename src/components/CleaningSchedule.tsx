import React from "react";
import { Student, ClassStructure, CleaningDuty } from "../types";
import { toKhmerNumeral, getKhmerLunarSignatureDate } from "../utils";
import Header from "./Header";
import { ArrowLeftRight, ChevronRight, Sparkles, Trash2, CalendarRange } from "lucide-react";

interface CleaningScheduleProps {
  students: Student[];
  structure: ClassStructure;
  dutyGroups: CleaningDuty[];
  onUpdateDutyGroups: (updated: CleaningDuty[]) => void;
}

export default function CleaningSchedule({
  students,
  structure,
  dutyGroups,
  onUpdateDutyGroups
}: CleaningScheduleProps) {
  const getStudentName = (id: string) => {
    return students.find(s => s.id === id)?.khmerName || "មិនទាន់កំណត់";
  };

  const todayStr = getKhmerLunarSignatureDate(new Date());

  // Function to edit or auto-shuffle groups
  const autoAssignGroups = () => {
    if (students.length === 0) return;
    
    // Sort students randomly or orderly
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    const newGroups: CleaningDuty[] = [
      { day: "ចន្ទ (ក្រុម១)", groupNumber: 1, leaderId: "", deputedLeaderId: "", members: [] },
      { day: "អង្គារ (ក្រុម២)", groupNumber: 2, leaderId: "", deputedLeaderId: "", members: [] },
      { day: "ពុធ (ក្រុម៣)", groupNumber: 3, leaderId: "", deputedLeaderId: "", members: [] },
      { day: "ព្រហស្បតិ៍ (ក្រុម៤)", groupNumber: 4, leaderId: "", deputedLeaderId: "", members: [] },
      { day: "សុក្រ (ក្រុម៥)", groupNumber: 5, leaderId: "", deputedLeaderId: "", members: [] },
      { day: "សៅរ៍ (ក្រុម៦)", groupNumber: 6, leaderId: "", deputedLeaderId: "", members: [] }
    ];

    // Distribute
    shuffled.forEach((student, index) => {
      const groupIdx = index % 6;
      if (!newGroups[groupIdx].leaderId) {
        newGroups[groupIdx].leaderId = student.id;
      } else if (!newGroups[groupIdx].deputedLeaderId) {
        newGroups[groupIdx].deputedLeaderId = student.id;
      } else {
        newGroups[groupIdx].members.push(student.id);
      }
    });

    onUpdateDutyGroups(newGroups);
  };

  return (
    <div className="space-y-6">
      {/* Configuration operations / Command bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 print:hidden m-1">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-rose-50 rounded-lg text-rose-500">
            <CalendarRange size={22} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-gray-800 text-sm">រៀបចំវេនសម្អាតថ្នាក់រៀន</h3>
            <p className="font-sans text-xs text-gray-500">បែងចែកក្រុម និងសិស្សទទួលខុសត្រូវតាមថ្ងៃនីមួយៗ</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={autoAssignGroups}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-sans text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Sparkles size={14} />
            បែងចែកក្រុមស្វ័យប្រវត្ត
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-sans text-xs font-bold rounded-xl shadow-md cursor-pointer transition"
          >
            បោះពុម្ព (Print PDF)
          </button>
        </div>
      </div>

      {/* Main Print Container & Graphic Board */}
      <div id="print-cleaning-schedule" className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm print:p-0 print:border-0 print:shadow-none m-1">
        {/* Kingdom Standard Header */}
        <Header structure={structure} />

        <div className="text-center my-6">
          <h2 className="font-sans text-xl md:text-2xl font-bold text-red-600 tracking-wide">
            វេនសម្អាតប្រចាំសប្ដាហ៍ / ថ្នាក់ទី {structure.gradeName} / ឆ្នាំសិក្សា៖ {structure.academicYear}
          </h2>
        </div>

        {/* Tree Flow Diagram block - exactly modeled after Image 2 */}
        <div className="flex flex-col items-center justify-center space-y-6 my-10 relative">
          
          {/* Row 1: President <-> Teacher in Charge */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 w-full max-w-2xl relative z-10">
            {/* Class President */}
            <div className="flex flex-col items-center justify-center px-6 py-3 bg-blue-50 border-2 border-blue-500 rounded-2xl w-48 shadow-sm">
              <span className="font-sans text-xs text-blue-600 font-bold">ប្រធានថ្នាក់</span>
              <span className="font-sans text-sm font-bold text-gray-800">{getStudentName(structure.presidentId)}</span>
            </div>

            {/* Bidirectional Arrow */}
            <div className="hidden sm:flex items-center justify-center text-blue-500 bg-white p-2 rounded-full border border-gray-200 shadow-sm">
              <ArrowLeftRight size={20} className="text-blue-500" />
            </div>

            {/* Teacher */}
            <div className="flex flex-col items-center justify-center px-6 py-3 bg-rose-50 border-2 border-rose-500 rounded-2xl w-48 shadow-sm">
              <span className="font-sans text-xs text-rose-600 font-bold">គ្រូទទួលបន្ទុកថ្នាក់</span>
              <span className="font-sans text-sm font-bold text-gray-800">{structure.teacherName}</span>
            </div>
          </div>

          {/* Connectors Layout SVG for desktop */}
          <div className="hidden md:block absolute top-10 left-1/2 -translate-x-1/2 w-full h-32 pointer-events-none -z-10">
            <svg className="w-full h-full" viewBox="0 0 800 120" fill="none">
              {/* Connect President & Teacher to Vice Presidents */}
              <path d="M 280 40 L 280 80 L 180 80 L 180 120" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M 520 40 L 520 80 L 620 80 L 620 120" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Row 2: Vice Presidents */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-20 w-full max-w-4xl pt-2 relative z-10">
            {/* 1st Vice President */}
            <div className="flex flex-col items-center justify-center px-6 py-2.5 bg-blue-50 border border-blue-400 rounded-xl w-44 shadow-sm">
              <span className="font-sans text-xs text-blue-500">អនុប្រធានទី១ (សិក្សា)</span>
              <span className="font-sans text-sm font-semibold text-gray-800">{getStudentName(structure.vicePresident1Id)}</span>
            </div>

            {/* 2nd Vice President */}
            <div className="flex flex-col items-center justify-center px-6 py-2.5 bg-blue-50 border border-blue-400 rounded-xl w-44 shadow-sm">
              <span className="font-sans text-xs text-blue-500">អនុប្រធានទី២ (ពលកម្ម)</span>
              <span className="font-sans text-sm font-semibold text-gray-800">{getStudentName(structure.vicePresident2Id)}</span>
            </div>
          </div>

          {/* Connectors for days */}
          <div className="hidden md:block absolute top-[110px] left-1/2 -translate-x-1/2 w-full h-24 pointer-events-none -z-10">
            <svg className="w-full h-full" viewBox="0 0 800 80" fill="none">
              {/* Lines flowing to groups */}
              <path d="M 180 10 L 180 42 L 30 42 L 30 80" stroke="#10b981" strokeWidth="1.5" />
              <path d="M 180 10 L 180 42 L 210 42 L 210 80" stroke="#10b981" strokeWidth="1.5" />
              <path d="M 180 10 L 180 42 L 390 42 L 390 80" stroke="#10b981" strokeWidth="1.5" />
              <path d="M 620 10 L 620 42 L 410 42 L 410 80" stroke="#10b981" strokeWidth="1.5" />
              <path d="M 620 10 L 620 42 L 590 42 L 590 80" stroke="#10b981" strokeWidth="1.5" />
              <path d="M 620 10 L 620 42 L 770 42 L 770 80" stroke="#10b981" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Traditional Weekdays Grids matching the table representation of image 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-10 max-w-5xl mx-auto">
          {dutyGroups.map((group, gIdx) => {
            const daysNames = ["ចន្ទ (ក្រុម១)", "អង្គារ (ក្រុម២)", "ពុធ (ក្រុម៣)", "ព្រហស្បតិ៍ (ក្រុម៤)", "សុក្រ (ក្រុម៥)", "សៅរ៍ (ក្រុម៦)"];
            const currentDayTitle = daysNames[gIdx] || group.day;

            return (
              <div key={gIdx} className="border-2 border-[#10b981] rounded-2xl overflow-hidden shadow-sm flex flex-col bg-white">
                <div className="bg-[#10b981] text-white py-1 px-3 text-center font-sans text-xs font-bold tracking-wide flex justify-between items-center">
                  <span>{currentDayTitle}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">ក្រុមទិសដៅ</span>
                </div>

                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="bg-emerald-50 text-emerald-950 border-b border-emerald-100 font-semibold text-[10px] uppercase">
                      <th className="py-2 px-3 text-center border-r border-emerald-100 w-12">ល.រ</th>
                      <th className="py-2 px-3 border-r border-emerald-100">ឈ្មោះសិស្ស</th>
                      <th className="py-2 px-3 text-center w-20">តួនាទី</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Leader */}
                    <tr className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-1.5 px-3 text-center border-r border-gray-100 font-semibold text-gray-500">១</td>
                      <td className="py-1.5 px-3 border-r border-gray-100 font-bold text-gray-800">{getStudentName(group.leaderId)}</td>
                      <td className="py-1.5 px-3 text-center text-emerald-600 font-bold text-[10px] bg-emerald-50/30">ប្រធានក្រុម</td>
                    </tr>
                    {/* Deputed leader */}
                    <tr className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-1.5 px-3 text-center border-r border-gray-100 font-semibold text-gray-500">២</td>
                      <td className="py-1.5 px-3 border-r border-gray-100 font-semibold text-gray-700">{getStudentName(group.deputedLeaderId)}</td>
                      <td className="py-1.5 px-3 text-center text-blue-600 font-semibold text-[10px] bg-blue-50/30">អនុប្រធាន</td>
                    </tr>
                    {/* Members */}
                    {group.members.slice(0, 3).map((memberId, mIdx) => (
                      <tr key={mIdx} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                        <td className="py-1.5 px-3 text-center border-r border-gray-100 font-semibold text-gray-400">
                          {toKhmerNumeral(mIdx + 3)}
                        </td>
                        <td className="py-1.5 px-3 border-r border-gray-100 text-gray-600">{getStudentName(memberId)}</td>
                        <td className="py-1.5 px-3 text-center text-gray-500 text-[10px]">សមាជិក</td>
                      </tr>
                    ))}
                    {/* Padding blank members if less than 5 rows */}
                    {Array.from({ length: Math.max(0, 3 - group.members.length) }).map((_, padIdx) => (
                      <tr key={`pad-${padIdx}`} className="border-b border-gray-100 last:border-b-0 text-gray-300">
                        <td className="py-1.5 px-3 text-center border-r border-gray-100">
                          {toKhmerNumeral(group.members.length + padIdx + 3)}
                        </td>
                        <td className="py-1.5 px-3 border-r border-gray-100">-</td>
                        <td className="py-1.5 px-3 text-center text-[10px]">-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        {/* Shared Rotation Highlight Card exactly labeled as វេនរួម as in image 2 */}
        <div className="border border-dashed border-red-300 bg-red-50/30 rounded-2xl p-4 my-6 text-center max-w-sm mx-auto shadow-sm">
          <h3 className="font-sans text-red-600 font-bold text-sm tracking-wide mb-1">🧼 ​វេនសម្អាតរួមថ្នាក់រៀន</h3>
          <p className="font-sans text-xs text-gray-600 leading-relaxed">
            រៀងរាល់ថ្ងៃសៅរ៍ចុងសប្ដាហ៍ សមាជិកទាំង៦ក្រុម ត្រូវចូលរួម សម្អាតថ្នាក់រៀនរួមគ្នា (ជូតក្ដារខៀន ជូតកញ្ចក់បង្អួច និងរៀបចំតុគ្រូ)។
          </p>
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
            <span className="text-sky-950 font-sans font-bold py-1 text-center">គ្រូទទួលបន្ទុកថ្នាក់</span>
            <div className="h-16"></div>
            <span className="text-gray-800 font-semibold border-b-2 border-transparent">{structure.teacherName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
