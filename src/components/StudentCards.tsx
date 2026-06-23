import React from "react";
import { Student, ClassStructure } from "../types";
import { toKhmerNumeral } from "../utils";
import { Printer, CreditCard, Shield, IdCard, Stamp } from "lucide-react";

interface StudentCardsProps {
  students: Student[];
  structure: ClassStructure;
}

export default function StudentCards({ students, structure }: StudentCardsProps) {
  // Take at most first 12 students or let them pick 6 for printing
  const [selectedIds, setSelectedIds] = React.useState<string[]>(
    students.slice(0, 6).map((s) => s.id)
  );

  const toggleSelectStudent = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const currentPrintedStudents = students.filter(s => selectedIds.includes(s.id));

  return (
    <div className="space-y-6">
      {/* Configuration bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 print:hidden m-1">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-sky-50 rounded-lg text-sky-600">
            <IdCard size={24} />
          </div>
          <div>
            <h3 className="font-sans font-bold text-gray-800 text-sm">បោះពុម្ពកាតសិស្ស (Student ID Cards)</h3>
            <p className="font-sans text-xs text-gray-500">
              ជ្រើសរើសសិស្ស ៦នាក់ ដើម្បីបោះពុម្ពក្នុងតារាងក្រដាស A4 ផ្ដេក (Landscape) មួយសន្លឹក
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-sans text-xs bg-sky-50 text-sky-800 font-bold px-3 py-1.5 rounded-full select-none">
            បានជ្រើសរើស៖ {toKhmerNumeral(selectedIds.length)} / ៦សន្លឹក
          </span>
          <button
            onClick={() => window.print()}
            disabled={selectedIds.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-300 text-white font-sans text-xs font-bold rounded-xl shadow-md cursor-pointer transition active:scale-95"
          >
            <Printer size={14} />
            បោះពុម្ពភ្លាមៗ
          </button>
        </div>
      </div>

      {/* Checklist to choose students */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm print:hidden m-1">
        <h4 className="font-sans text-xs font-bold text-gray-700 mb-2">បញ្ជីសិស្សសម្រាប់ជ្រើសរើសបោះពុម្ព៖</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {students.map((student) => {
            const isSelected = selectedIds.includes(student.id);
            return (
              <button
                key={student.id}
                onClick={() => toggleSelectStudent(student.id)}
                className={`py-2 px-3 rounded-lg border text-left font-sans text-xs font-medium cursor-pointer transition flex items-center justify-between ${
                  isSelected
                    ? "border-sky-500 bg-sky-50/50 text-sky-950"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="truncate">
                  <p className="font-bold">{student.khmerName}</p>
                  <p className="text-[10px] text-gray-400">អត្តលេខ {toKhmerNumeral(student.id)}</p>
                </div>
                <div
                  className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center text-[8px] font-bold ${
                    isSelected ? "bg-sky-600 border-sky-600 text-white" : "border-gray-300 bg-white"
                  }`}
                >
                  {isSelected && "✓"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ID Cards Layout strictly formatted to render 6 cards on Landscape A4 */}
      <div className="overflow-x-auto print:overflow-visible m-1">
        <div
          id="print-student-cards"
          className="mx-auto w-[1120px] h-[790px] bg-white p-8 border border-gray-200 rounded-3xl shadow-sm grid grid-cols-3 grid-rows-2 gap-4 print:p-0 print:border-0 print:shadow-none print:w-full print:h-full print:grid print:gap-2 print:m-0"
          style={{ pageBreakInside: "avoid" }}
        >
          {currentPrintedStudents.slice(0, 6).map((student) => {
            const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.khmerName)}&backgroundColor=b6e3f4,059669`;

            return (
              <div
                key={student.id}
                className="relative border-2 border-dashed border-sky-400 rounded-2xl p-4 flex flex-col justify-between overflow-hidden bg-gradient-to-tr from-sky-50/30 via-white to-blue-50/20 shadow-sm print:shadow-none print:border-2 print:border-sky-600 w-full h-full relative"
              >
                {/* Visual Watermark / Decorative badge */}
                <div className="absolute top-2 right-1 lg:right-2 opacity-10 pointer-events-none">
                  <Shield size={120} className="text-sky-900" />
                </div>

                {/* ID Card Header */}
                <div className="flex items-center space-x-2 border-b border-sky-200 pb-2 mb-2">
                  <div className="flex-1 text-center">
                    <h5 className="font-sans text-[11px] font-bold text-sky-950 uppercase tracking-wide">
                      {structure.schoolName}
                    </h5>
                    <p className="font-sans text-[8px] text-sky-800 font-semibold">
                      បណ្ណសម្គាល់ខ្លួនសិស្ស (Student ID Card)
                    </p>
                  </div>
                </div>

                {/* ID Card Body */}
                <div className="flex items-start space-x-3 my-2 z-10">
                  {/* Photo Profile Frame */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden border border-sky-300 shadow-xs flex justify-center items-center">
                      <img
                        src={student.photoUrl || defaultAvatar}
                        alt={student.khmerName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = defaultAvatar;
                        }}
                      />
                    </div>
                    <span className="text-[7px] font-bold text-sky-800 tracking-wider">
                      ID: {toKhmerNumeral(student.id)}
                    </span>
                  </div>

                  {/* Student Details */}
                  <div className="flex-1 space-y-1 font-sans text-[9px] text-gray-800 leading-tight">
                    <p>
                      <strong className="text-sky-950">គោត្តនាម-នាម៖</strong>{" "}
                      <span className="font-bold text-xs">{student.khmerName}</span>
                    </p>
                    <p>
                      <strong className="text-sky-950">ភេទ៖</strong> {student.gender}
                    </p>
                    <p>
                      <strong className="text-sky-950">ថ្ងៃខែឆ្នាំកំណើត៖</strong> {toKhmerNumeral(student.birthDate)}
                    </p>
                    <p>
                      <strong className="text-sky-950">ថ្នាក់ទី៖</strong> {structure.gradeName}
                    </p>
                    <p>
                      <strong className="text-sky-950">អាណាព្យាបាល៖</strong> {student.guardianPhone}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Signature, Academic year, Barcode mock */}
                <div className="flex items-end justify-between border-t border-sky-100 pt-1.5 mt-1 z-10">
                  <div className="flex flex-col">
                    <span className="font-sans font-medium text-[8px] text-sky-900">ឆ្នាំសិក្សា៖ {structure.academicYear}</span>
                    {/* Mock barcode */}
                    <div className="flex items-center space-x-[1px] mt-1 opacity-85">
                      {[1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 1, 2].map((w, index) => (
                        <span key={index} className="bg-gray-800 h-3" style={{ width: `${w}px` }}></span>
                      ))}
                    </div>
                  </div>

                  {/* Stamp & Sign area */}
                  <div className="text-center relative pr-2">
                    <p className="font-sans text-[8px] text-sky-950 font-bold mb-0.5">នាយកសាលា</p>
                    {/* Visual Stamp Icon Overlay to replicate image style */}
                    <div className="absolute -top-3 -right-2 text-rose-500/30 scale-75 select-none pointer-events-none">
                      <Stamp size={28} />
                    </div>
                    <div className="h-4"></div>
                    <p className="font-sans text-[7px] text-gray-500 italic font-semibold border-t border-dotted border-gray-400 pt-0.5 w-16">
                      {structure.principalName}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {currentPrintedStudents.length === 0 && (
            <div className="col-span-3 row-span-2 flex flex-col justify-center items-center text-gray-400 space-y-3 font-sans py-20">
              <CreditCard size={48} className="text-gray-300" />
              <p className="text-sm font-semibold">សូមជ្រើសរើសសិស្សដើម្បីបង្ហាញកាតបោះពុម្ព</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
