import React from "react";
import { AppSettings, Student, ClassStructure } from "../types";
import { toKhmerNumeral } from "../utils";
import { Send, FileCode, CheckCircle, RefreshCw, Smartphone, ListCollapse, Play, Copy, HelpCircle } from "lucide-react";

interface SyncSettingsProps {
  settings: AppSettings;
  onUpdateSettings: (updated: AppSettings) => void;
  students: Student[];
  structure: ClassStructure;
}

export default function SyncSettings({
  settings,
  onUpdateSettings,
  students,
  structure
}: SyncSettingsProps) {
  const [botToken, setBotToken] = React.useState(settings.telegramBotToken);
  const [channelId, setChannelId] = React.useState(settings.telegramChannelId);
  const [sheetsUrl, setSheetsUrl] = React.useState(settings.googleSheetsUrl);

  const [testStudentId, setTestStudentId] = React.useState(students[0]?.id || "");
  const [testMessage, setTestMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [logs, setLogs] = React.useState<{ time: string; text: string; success: boolean }[]>([]);
  const [copySuccess, setCopySuccess] = React.useState(false);

  // Auto-compose message when student selection changes
  React.useEffect(() => {
    const student = students.find((s) => s.id === testStudentId);
    if (student) {
      setTestMessage(
        `🔔 [ជូនដំណឹងពីប្រព័ន្ធគ្រប់គ្រងសាលា]\nជម្រាបសួរអាណាព្យាបាលសិស្ស ${student.khmerName} (${student.gender}) ថ្នាក់ទី ${structure.gradeName}។\nថ្ងៃនេះសិស្សបានអវត្តមាន (អត់ច្បាប់) ពីការសិក្សា។ សូមលោកអាណាព្យាបាលមេត្តាជួយតាមដាន និងទាក់ទងមកលោកគ្រូតាមលេខ៖ ${structure.teacherName}។`
      );
    }
  }, [testStudentId, students, structure]);

  const saveSettings = () => {
    onUpdateSettings({
      telegramBotToken: botToken,
      telegramChannelId: channelId,
      googleSheetsUrl: sheetsUrl
    });
    alert("រក្សាទុកការកំណត់ប្រព័ន្ធស្វ័យប្រវត្តបានសម្រេច! 🎉");
  };

  // Real Telegram Sender Integration
  const handleSendTelegram = async () => {
    if (!botToken || !channelId) {
      alert("សូមបញ្ចូល Token ប៊ុត និង Chat ID ជាមុនសិន!");
      return;
    }

    setLoading(true);
    const timeNow = new Date().toLocaleTimeString();

    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: channelId,
          text: testMessage,
          parse_mode: "Markdown"
        })
      });

      const resData = await response.json();
      if (resData.ok) {
        setLogs(prev => [{ time: timeNow, text: `ផ្ញើសារជោគជ័យទៅកាន់ ${channelId}`, success: true }, ...prev]);
        alert("ការផ្ញើសារជោគជ័យទៅកាន់ Telegram! ✉️");
      } else {
        throw new Error(resData.description || "បរាជ័យ");
      }
    } catch (err: any) {
      setLogs(prev => [{ time: timeNow, text: `កំហុស៖ ${err.message}`, success: false }, ...prev]);
      alert(`មិនអាចផ្ញើសារបានទេ៖ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Google Apps Script source code template
  const appsScriptCode = `/*
  Google Apps Script សម្រាប់ភ្ជាប់ប្រព័ន្ធគ្រប់គ្រងសិស្សជាមួយ Google Sheet
  ១. បើក Google Sheet របស់អ្នក
  ២. ទាញយកម៉ឺនុយ Extensions -> Apps Script
  ៣. លុបកូដចាស់ៗចោល និងផាស (Paste) កូដទំនើបនេះចូល
  ៤. ចុច Deploy -> New Deployment -> Select Web App
  ៥. កំណត់ "Who has access" ទៅជា "Anyone" រួចចុច Deploy
*/

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("បញ្ជីសិស្ស") || 
                SpreadsheetApp.getActiveSpreadsheet().insertSheet("បញ្ជីសិស្ស");
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["អត្តលេខ", "ឈ្មោះសិស្ស", "ភេទ", "ថ្ងៃខែឆ្នាំកំណើត", "លេខអាណាព្យាបាល", "អាសយដ្ឋាន"]);
    }
    
    if (data.action === "sync_students") {
      sheet.clearContents();
      sheet.appendRow(["អត្តលេខ", "ឈ្មោះសិស្ស", "ភេទ", "ថ្ងៃខែឆ្នាំកំណើត", "លេខអាណាព្យាបាល", "អាសយដ្ឋាន"]);
      data.students.forEach(function(s) {
        sheet.appendRow([s.id, s.khmerName, s.gender, s.birthDate, s.guardianPhone, s.address]);
      });
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "ធ្វើបច្ចុប្បន្នភាពបានសម្រេច!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "មិនស្គាល់សកម្មភាព" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Col 1: Telegram Bot alert config */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-gray-50 pb-4">
          <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
            <Smartphone size={24} />
          </div>
          <div>
            <h3 className="font-sans font-bold text-gray-800 text-base">ការភ្ជាប់ជាមួយ Telegram Bot ជូនដំណឹង</h3>
            <p className="font-sans text-xs text-gray-500">ផ្ញើសារអវត្តមាន ឬពិន្ទុសិស្សលឿនរហ័សទៅទូរស័ព្ទដៃរបស់អាណាព្យាបាល</p>
          </div>
        </div>

        {/* Configurations fields */}
        <div className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Telegram Bot Token (*)</label>
            <input
              type="text"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="ឧទាហរណ៍៖ 123456789:ABCdefGhIJKlmNoPQ..."
              className="w-full text-xs px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Telegram Chat ID / Group Chat ID (*)</label>
            <input
              type="text"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              placeholder="ឧទាហរណ៍៖ -100456182121 ឬ ID ឆាតផ្ទាល់ខ្លួន"
              className="w-full text-xs px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
          <button
            onClick={saveSettings}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm transition"
          >
            💾 រក្សាទុកការកំណត់ Telegram & Sheets
          </button>
        </div>

        {/* Active Simulator Sender block */}
        <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-3 font-sans">
          <h4 className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
            <Send size={14} className="animate-pulse" />
            ម៉ាស៊ីនសាកល្បងផ្ញើសារជូនដំណឹង (Parent Alert Simulator)
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] text-gray-500 mb-1">ជ្រើសរើសសិស្សដែលត្រូវសាកល្បង៖</label>
              <select
                value={testStudentId}
                onChange={(e) => setTestStudentId(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-sky-200 rounded-lg bg-white"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.khmerName} (ID: {toKhmerNumeral(s.id)})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSendTelegram}
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs rounded-lg cursor-pointer shadow-md transition-all active:scale-95 disabled:bg-gray-300"
              >
                {loading ? <RefreshCw className="animate-spin" size={12} /> : <Play size={12} />}
                ផ្ញើសារសាកល្បងភ្លាមៗ
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-gray-500 mb-1">អត្ថបទជូនដំណឹង (អាចកែប្រែបាន)៖</label>
            <textarea
              rows={4}
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="w-full text-[11px] font-sans antialiased bg-white border border-sky-200 outline-none focus:ring-1 focus:ring-sky-500 rounded-xl p-3 text-gray-800"
            />
          </div>
        </div>

        {/* Display response live console logs */}
        <div className="p-3 bg-gray-950 text-emerald-400 rounded-2xl font-mono text-[10px] space-y-1 max-h-32 overflow-y-auto">
          <p className="text-gray-400 border-b border-gray-800 pb-1 flex justify-between items-center">
            <span>🖥️ កំណត់ត្រាផ្ញើសារ (Live Console Logs)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </p>
          {logs.length === 0 ? (
            <p className="text-gray-600">គ្មានសកម្មភាពថ្មីៗទេ...</p>
          ) : (
            logs.map((log, index) => (
              <p key={index} className={log.success ? "text-emerald-400" : "text-rose-400"}>
                [{log.time}] {log.text}
              </p>
            ))
          )}
        </div>
      </div>

      {/* Col 2: Google Sheets Copy scripts */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-gray-50 pb-4">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <FileCode size={24} />
          </div>
          <div>
            <h3 className="font-sans font-bold text-gray-800 text-base">ការភ្ជាប់ជាមួយ Google Sheets</h3>
            <p className="font-sans text-xs text-gray-500">ស្គ្រីប Apps Script នាំចេញរបាយការណ៍សិស្សស្វ័យប្រវត្តទៅហ្គូហ្គលស៊ីត</p>
          </div>
        </div>

        {/* Input link Spreadsheet */}
        <div className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">ហ្គូហ្គលស៊ីតលីង (Spreadsheet URL)</label>
            <input
              type="text"
              value={sheetsUrl}
              onChange={(e) => setSheetsUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/your-id..."
              className="w-full text-xs px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
        </div>

        {/* Instructions with code list and copy button */}
        <div className="p-4 bg-emerald-50/55 rounded-2xl border border-emerald-100 space-y-2 font-sans">
          <div className="flex justify-between items-center border-b border-emerald-100 pb-2 mb-2">
            <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1">
              <CheckCircle size={14} className="text-emerald-600" />
              របៀបបង្កើតការតភ្ជាប់ (Google apps script)
            </h4>
            <button
              onClick={copyCodeToClipboard}
              className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-sans text-[10px] font-bold rounded-lg cursor-pointer transition shadow-xs"
            >
              <Copy size={12} />
              {copySuccess ? "បានចម្លងរួច!" : "ចម្លងកូដស្គ្រីប"}
            </button>
          </div>

          <ol className="list-decimal pl-4 space-y-1.5 text-xs text-emerald-950 leading-relaxed">
            <li>ចុចលើប៊ូតុង <strong>"ចម្លងកូដស្គ្រីប"</strong> ខាងលើ</li>
            <li>បើកឯកសារ Google Sheet របស់អ្នក</li>
            <li>ចុចលើម៉ឺនុយ <strong>Extensions → Apps Script</strong></li>
            <li>ផាសកូដស្គ្រីប រួចចុច <strong>Deploy → New Deployment</strong></li>
            <li>ជ្រើសរើសជាប្រភេទ <strong>"Web App"</strong>, កំណត់ Access ជា <strong>"Anyone"</strong> រួចចុច Deploy។</li>
          </ol>
        </div>

        {/* View source code field */}
        <div className="space-y-1 font-sans">
          <span className="text-[10px] font-bold text-gray-500 uppercase block">ទិដ្ឋភាពកូដ (Apps Script Preview)៖</span>
          <pre className="p-3 bg-gray-50 text-gray-700 rounded-2xl text-[9px] overflow-x-auto max-h-48 border border-gray-100 font-mono">
            {appsScriptCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
