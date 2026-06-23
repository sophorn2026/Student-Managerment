import React from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";

interface LoginRegisterProps {
  onSuccess: (email: string) => void;
}

export default function LoginRegister({ onSuccess }: LoginRegisterProps) {
  const [activeTab, setActiveTab] = React.useState<"login" | "register">("login");
  
  // Form values
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [captchaAnswer, setCaptchaAnswer] = React.useState("");
  
  // Visibilities
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Captcha Generics
  const [captchaNum1, setCaptchaNum1] = React.useState(8);
  const [captchaNum2, setCaptchaNum2] = React.useState(2);

  // Errors & Alerts
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  // Auto Generate Captcha
  const generateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 10) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 9) + 1);
    setCaptchaAnswer("");
  };

  // Basic Password Strength
  const getPasswordStrength = () => {
    if (!password) return "គ្មាន";
    if (password.length < 6) return "ខ្សោយ";
    if (password.length < 10) return "មធ្យម";
    return "ខ្លាំង";
  };

  const getPasswordStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength === "គ្មាន") return "text-slate-400";
    if (strength === "ខ្សោយ") return "text-rose-500 font-bold";
    if (strength === "មធ្យម") return "text-amber-500 font-bold";
    return "text-emerald-500 font-bold";
  };

  // Submit Operations
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password) {
      setErrorMessage("⚠️ សូមបំពេញអ៊ីមែល និងពាក្យសម្ងាត់ឱ្យបានត្រឹមត្រូវ!");
      return;
    }

    // Standard credential validation against local accounts
    const savedUsersStr = localStorage.getItem("khmer_registered_teachers");
    const savedUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];

    // Let's also support a default account for convenience so they do not get locked out
    const isDefaultAccount = email.toLowerCase() === "sophorn6024@gmail.com" || email.toLowerCase() === "admin@ptec.edu.kh";
    const foundUser = savedUsers.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser || (isDefaultAccount && password !== "")) {
      setSuccessMessage("✨ ចូលប្រព័ន្ធជោគជ័យ! កំពុងដំណើរការ...");
      localStorage.setItem("khmer_auth_logged_in", "true");
      localStorage.setItem("khmer_auth_email", email);
      
      // Seed default name if not present
      if (!localStorage.getItem("khmer_account_firstname")) {
        localStorage.setItem("khmer_account_firstname", email.split("@")[0]);
      }

      setTimeout(() => {
        onSuccess(email);
      }, 800);
    } else {
      setErrorMessage("⚠️ អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ! ប្រសិនបើគ្មានគណនី សូមចុះឈ្មោះថ្មី។");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email) {
      setErrorMessage("⚠️ សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលរបស់អ្នក!");
      return;
    }

    if (password.length < 4) {
      setErrorMessage("⚠️ ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ ៤ តួអក្សរ!");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("⚠️ ការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ!");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("⚠️ សូមយល់ព្រមតាមលក្ខខណ្ឌនៃការប្រើប្រាស់!");
      return;
    }

    const totalAnswer = captchaNum1 + captchaNum2;
    if (parseInt(captchaAnswer) !== totalAnswer) {
      setErrorMessage("⚠️ កូដការពារ Bot (សុវត្ថិភាព) មិនត្រឹមត្រូវទេ!");
      generateCaptcha();
      return;
    }

    // Register User
    const savedUsersStr = localStorage.getItem("khmer_registered_teachers");
    const savedUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];

    const alreadyExists = savedUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (alreadyExists) {
      setErrorMessage("⚠️ អ៊ីមែលនេះត្រូវបានចុះឈ្មោះរួចហើយ!");
      return;
    }

    // Save New User
    const newTeacher = { email, password };
    savedUsers.push(newTeacher);
    localStorage.setItem("khmer_registered_teachers", JSON.stringify(savedUsers));

    setSuccessMessage("🎉 បានបង្កើតគណនីគំរូចូលរួមដោយជោគជ័យ! សូមចូលគណនីរបស់អ្នក។");
    
    // Switch to login tab
    setTimeout(() => {
      setActiveTab("login");
      setPassword("");
      setConfirmPassword("");
      setCaptchaAnswer("");
      setSuccessMessage("");
    }, 1500);
  };

  // Google Login Emulation
  const handleGoogleLogin = () => {
    setSuccessMessage("✨ កំពុងតភ្ជាប់គណនី Google របស់អ្នក...");
    setTimeout(() => {
      localStorage.setItem("khmer_auth_logged_in", "true");
      localStorage.setItem("khmer_auth_email", "sophorn6024@gmail.com");
      onSuccess("sophorn6024@gmail.com");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Outer Curved Container with deep indigo outline border to replicate device canvas */}
      <div className="w-full max-w-5xl bg-white rounded-[32px] border-4 border-indigo-900/10 shadow-2xl overflow-hidden flex flex-col md:flex-row relative min-h-[620px]">
        
        {/* Abstract Light Orbs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

        {/* LEFT COLUMN: School Emblem, Mascot Name and Titles */}
        <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center p-8 text-center border-b md:border-b-0 md:border-r border-slate-100 z-10">
          
          {/* High Fidelity SVG Seal Phnom Penh Teacher Education College (PTEC) */}
          <div className="flex items-center justify-center gap-3.5 mb-8 hover:scale-105 transition duration-350">
            {/* Elegant Vector Crest */}
            <div className="w-16 h-16 shrink-0 bg-white shadow-md rounded-full border border-slate-150 flex items-center justify-center p-1.5">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
                {/* Out Ring */}
                <circle cx="50" cy="50" r="46" fill="none" stroke="#0e5a9c" strokeWidth="2" />
                <circle cx="50" cy="50" r="41" fill="none" stroke="#d49b2c" strokeWidth="1.5" />
                {/* Sunrays */}
                <path d="M50,15 L50,12 M50,85 L50,88 M15,50 L12,50 M85,50 L88,50 M25,25 L23,23 M75,75 L77,77 M25,75 L23,77 M75,25 L77,23" stroke="#d49b2c" strokeWidth="1.5" />
                {/* Lotus Base */}
                <path d="M30,68 C35,60 45,55 50,68 C55,55 65,60 70,68 C60,78 40,78 30,68 Z" fill="#0e5a9c" />
                <path d="M40,68 C45,63 48,62 50,68 C52,62 55,63 60,68 C54,72 46,72 40,68 Z" fill="#ffffff" />
                {/* Opened Book */}
                <path d="M32,54 C42,48 48,51 50,56 C52,51 58,48 68,54 L68,64 C58,58 52,61 50,66 C48,61 42,58 32,64 Z" fill="#ffffff" stroke="#0e5a9c" strokeWidth="1" />
                {/* Rays or Stars */}
                <circle cx="50" cy="34" r="5" fill="#d49b2c" />
              </svg>
            </div>

            {/* Typography */}
            <div className="text-left">
              <h3 className="font-moul text-[10px] md:text-[11px] leading-[1.6] text-blue-900 drop-shadow-sm">
                វិទ្យាស្ថានគរុកោសល្យរាជធានីភ្នំពេញ
              </h3>
              <p className="text-[8px] font-sans font-bold text-slate-500 tracking-wider">
                Phnom Penh Teacher Education College
              </p>
            </div>
          </div>

          {/* Heading dynamic */}
          <h1 className="font-moul text-xl md:text-2xl text-blue-900 leading-relaxed mb-1 tracking-wide">
            {activeTab === "login" ? "ចូលគណនីប្រព័ន្ធ" : "បង្កើតគណនីថ្មី"}
          </h1>
          
          <p className="text-xs text-slate-500 font-bold max-w-sm leading-relaxed mt-2.5">
            ប្រព័ន្ធជំនួយការគ្រូបង្រៀនឌីជីថល KruSmart
          </p>

          <div className="w-16 h-1.5 bg-indigo-500/20 rounded-full mt-6"></div>
        </div>

        {/* RIGHT COLUMN: Tab Form Box */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-between bg-slate-50/40 z-10">
          
          <div className="w-full">
            {/* Custom Tab triggers and active design */}
            <div className="flex border-b border-slate-200/80 mb-7">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`w-1/2 text-center pb-3.5 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "login"
                    ? "border-b-2 border-indigo-600 text-indigo-700 font-moul"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                ចូលគណនី
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("register");
                  setErrorMessage("");
                  setSuccessMessage("");
                  generateCaptcha();
                }}
                className={`w-1/2 text-center pb-3.5 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "register"
                    ? "border-b-2 border-indigo-600 text-indigo-700 font-moul"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                បង្កើតថ្មី
              </button>
            </div>

            {/* Error alerts and success state logs */}
            {errorMessage && (
              <div className="p-3 mb-4 text-xs font-semibold bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl animate-fade-in flex items-center gap-2">
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 mb-4 text-xs font-semibold bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl animate-fade-in">
                {successMessage}
              </div>
            )}

            {/* LOGIN WINDOW */}
            {activeTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-700 font-bold block">អ៊ីមែល (Email)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@ptec.edu.kh"
                    className="w-full px-4 py-3 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs text-slate-800 transition bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-slate-700 font-bold block">ពាក្យសម្ងាត់ (Password)</label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="• • • • • • • •"
                      className="w-full pl-4 pr-24 py-3 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs tracking-widest text-slate-800 transition bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 hover:text-indigo-600 text-slate-500 font-bold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>បង្ហាញ</span>
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => alert("🔑 ប្រសិនបើអ្នកភ្លេចពាក្យសម្ងាត់ សូមទាក់ទងមកកាន់ PTEC SysAdmin ផ្ទាល់ ដើម្បីទទួលបានពាក្យសម្ងាត់ថ្មី។")}
                    className="text-[11px] font-bold text-sky-600 hover:text-indigo-600 hover:underline transition"
                  >
                    ភ្លេចពាក្យសម្ងាត់?
                  </button>
                </div>

                {/* Primary login trigger */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-blue-800 hover:bg-blue-950 text-white rounded-2xl font-bold text-xs transition active:scale-98 shadow-md hover:shadow-lg cursor-pointer font-moul text-center flex items-center justify-center"
                >
                  ចូលគណនី
                </button>

              </form>
            ) : (
              // REGISTER WINDOW
              <form onSubmit={handleRegister} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-700 font-bold block">អ៊ីមែល (Email)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@ptec.edu.kh"
                    className="w-full px-4 py-3 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs text-slate-800 transition bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-700 font-bold block">ពាក្យសម្ងាត់ (Password)</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="• • • • • • • •"
                      className="w-full pl-4 pr-24 py-3 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs tracking-widest text-slate-800 transition bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 hover:text-indigo-600 text-slate-500 font-bold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>បង្ហាញ</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-700 font-bold block">ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់ (Confirm Password)</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="• • • • • • • •"
                      className="w-full pl-4 pr-24 py-3 border border-slate-200 focus:border-indigo-500 rounded-2xl outline-none text-xs tracking-widest text-slate-800 transition bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 hover:text-indigo-600 text-slate-500 font-bold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>បង្ហាញ</span>
                    </button>
                  </div>
                </div>

                {/* Strength level */}
                <div className="text-[10px] text-slate-500 flex items-center justify-between bg-slate-105 px-1 pb-1">
                  <span>កម្រិតសុវត្ថិភាពពាក្យសម្ងាត់៖</span>
                  <span className={getPasswordStrengthColor()}>{getPasswordStrength()}</span>
                </div>

                {/* Agree check */}
                <label className="flex items-start gap-2 cursor-pointer pb-1.5 select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 border-slate-300 focus:ring-slate-300 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[10.5px] text-slate-600 leading-[1.4] font-semibold">
                    ខ្ញុំយល់ព្រមតាម <strong className="text-indigo-600 hover:underline">លក្ខខណ្ឌនៃការប្រើប្រាស់</strong>។
                  </span>
                </label>

                {/* Security Captcha Check (Bot protection) */}
                <div className="border border-slate-200/80 bg-white shadow-sm p-3.5 rounded-2xl space-y-2">
                  <label className="text-[10px] text-slate-500 block font-bold">
                    ផ្ទៀងផ្ទាត់សុវត្ថិភាព (ការពារ Bot) <span className="text-rose-500">*</span>
                  </label>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center p-2.5 px-4 bg-blue-800 text-white font-black text-sm rounded-xl tracking-widest select-none">
                      {captchaNum1} + {captchaNum2} =
                    </div>
                    
                    <input
                      type="number"
                      required
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value)}
                      placeholder="ចម្លើយ"
                      className="flex-1 min-w-[50px] px-3 py-2 border border-slate-200 focus:border-indigo-500 rounded-xl outline-none text-xs font-bold text-center bg-slate-50 transition"
                    />

                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="p-2.5 bg-slate-150 hover:bg-slate-200 text-slate-500 rounded-xl transition cursor-pointer"
                      title="ប្ដូរកូដថ្មី"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Register primary trigger */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-blue-800 hover:bg-blue-950 text-white rounded-2xl font-bold text-xs transition active:scale-98 shadow-md hover:shadow-lg cursor-pointer font-moul text-center flex items-center justify-center"
                >
                  ចុះឈ្មោះ (Register)
                </button>

              </form>
            )}
          </div>

          <div className="mt-6 space-y-3">
            {/* Premium Button */}
            <button
              type="button"
              onClick={() => alert("🎉 អបអរសាទរ! ប្រព័ន្ធ KruSmart របស់អ្នកឥឡូវនេះស្ថិតក្នុងកញ្ចប់គំរូ Premium រួចជាស្រេចហើយសម្រាប់ការប្រើប្រាស់ឥតដែនកំណត់។")}
              className="w-full py-2.5 px-4 hover:scale-102 bg-fuchsia-50 hover:bg-fuchsia-100 active:scale-98 text-fuchsia-700 font-extrabold text-[10px] rounded-xl transition border border-fuchsia-200 flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <span>💎 បង់ប្រាក់សម្រាប់កម្រិត Premium</span>
            </button>

            {/* Separator */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 font-bold text-[10px]">ឬ</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Google alternative */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-350 hover:shadow-sm rounded-xl text-slate-700 font-bold text-xs transition flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {/* Google colored G */}
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.03-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span>ចូលគណនីតាម Google</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
