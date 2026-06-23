import React from "react";
import { ClassStructure } from "../types";

interface HeaderProps {
  structure: ClassStructure;
  subTitle?: string;
  theme?: "standard" | "royal" | "gold";
}

export default function Header({ structure, subTitle, theme = "standard" }: HeaderProps) {
  return (
    <div className="hidden print:flex flex-col items-center justify-center text-center space-y-2 py-4 border-b border-gray-100 mb-6 print:border-0 print:mb-2 print:py-1">
      {/* ព្រះរាជាណាចក្រកម្ពុជា */}
      <div className="space-y-1">
        <h1 className="font-sans text-xl md:text-2xl font-bold text-sky-900 tracking-wider print:text-lg">
          ព្រះរាជាណាចក្រកម្ពុជា
        </h1>
        <h2 className="font-sans text-base md:text-lg font-semibold text-gray-700 tracking-normal print:text-sm">
          ជាតិ សាសនា ព្រះមហាក្សត្រ
        </h2>
        {/* Decorative divider svg */}
        <div className="flex justify-center items-center py-1 select-none">
          <span className="text-gray-400">❖</span>
          <span className="w-20 md:w-32 h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-2"></span>
          <span className="text-gray-400">❖</span>
        </div>
      </div>

      {/* School standard custom headers */}
      <div className="flex flex-col md:flex-row md:justify-between w-full max-w-4xl px-4 text-left font-sans text-xs md:text-sm text-gray-600 font-medium space-y-1 md:space-y-0 print:flex-col print:text-[10px] print:space-y-0 print:px-0">
        <div className="space-y-0.5">
          <p className="border-b border-dotted border-gray-400 w-fit">រដ្ឋបាល standard៖ {structure.districtName}</p>
          <p className="border-b border-dotted border-gray-400 w-fit">កម្រងសាលារៀន៖ {structure.schoolCluster}</p>
          <p className="border-b border-dotted border-gray-400 w-fit font-semibold text-sky-800">{structure.schoolName}</p>
        </div>
        <div className="md:text-right space-y-0.5 print:text-left print:mt-1">
          <p className="border-b border-dotted border-gray-400 w-fit md:ml-auto">ថ្នាក់ទី៖ {structure.gradeName}</p>
          <p className="border-b border-dotted border-gray-400 w-fit md:ml-auto">ឆ្នាំសិក្សា៖ {structure.academicYear}</p>
        </div>
      </div>

      {subTitle && (
        <div className="mt-4 px-6 py-2 rounded-full bg-sky-50 text-sky-900 font-bold text-sm md:text-lg tracking-wide shadow-sm print:bg-transparent print:shadow-none print:py-0 print:mt-2 print:text-base">
          {subTitle}
        </div>
      )}
    </div>
  );
}
