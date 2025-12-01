import React, { useState } from 'react';
import { ShieldAlert, Send, AlertTriangle, Info, Zap, Mail, ExternalLink, Users } from 'lucide-react';
import { ViolationType, ReportFormData, ReportResult } from './types';
import { generateReportText } from './services/geminiService';
import { InputField } from './components/InputField';
import { ResultCard } from './components/ResultCard';

const App: React.FC = () => {
  const [formData, setFormData] = useState<ReportFormData>({
    username: '',
    violationType: ViolationType.HATE_SPEECH,
    details: '',
    timestamp: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.details) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await generateReportText(formData);
      setResult(response);
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = () => {
    if (!result) return;
    const subject = encodeURIComponent(`Urgent Report: Community Guidelines Violation - @${formData.username}`);
    const body = encodeURIComponent(result.englishReport + "\n\nSent via LiveStream Report Assistant");
    window.location.href = `mailto:legal@tiktok.com?cc=feedback@tiktok.com&subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-12">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 rounded-lg">
              <ShieldAlert className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">مساعد البلاغات</h1>
              <p className="text-xs text-slate-400">أداة ذكية لصياغة بلاغات الانتهاكات</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="bg-slate-800 text-cyan-400 text-xs py-1 px-3 rounded-full border border-slate-700">
               مدعوم بالذكاء الاصطناعي
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Intro Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-rose-500"></div>
          <div className="flex items-start gap-4 z-10 relative">
            <div className="p-3 bg-slate-800 rounded-full text-yellow-500 hidden sm:block">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white mb-2">تنويه هام</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                هذا التطبيق لا يقوم بحذف البث بشكل مباشر، حيث أن هذا الإجراء حصري لإدارة تيك توك. 
                هذا التطبيق يساعدك في <span className="text-cyan-400 font-bold">صياغة تقرير قانوني واحترافي</span> لزيادة سرعة استجابة فريق الدعم وإغلاق البث المخالف.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Form Section */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Info size={20} className="text-cyan-500" />
                تفاصيل البث المخالف
              </h3>
              
              <form onSubmit={handleSubmit}>
                <InputField 
                  label="اسم المستخدم (Streamer Username)"
                  placeholder="@example_user"
                  value={formData.username}
                  onChange={(val) => setFormData({...formData, username: val})}
                  required
                />

                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2">
                    نوع المخالفة
                  </label>
                  <select 
                    className="shadow border border-slate-700 bg-slate-950 rounded w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer"
                    value={formData.violationType}
                    onChange={(e) => setFormData({...formData, violationType: e.target.value as ViolationType})}
                  >
                    {Object.values(ViolationType).map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <InputField 
                  label="تفاصيل الانتهاك (ماذا حدث؟)"
                  placeholder="اشرح بالتفصيل ما يفعله صاحب البث..."
                  type="textarea"
                  value={formData.details}
                  onChange={(val) => setFormData({...formData, details: val})}
                  required
                />

                <InputField 
                  label="وقت الحدوث (اختياري)"
                  placeholder="مثال: الدقيقة 10 من البث"
                  value={formData.timestamp || ''}
                  onChange={(val) => setFormData({...formData, timestamp: val})}
                />

                {error && (
                  <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded text-red-200 text-sm flex items-center gap-2">
                    <AlertTriangle size={16} />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] ${
                    loading 
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/20'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <Zap size={20} fill="currentColor" />
                      توليد نص البلاغ
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <div className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">التقارير الجاهزة</h3>
                  <span className="text-xs text-green-400 border border-green-500/30 bg-green-500/10 px-2 py-1 rounded">تم التوليد بنجاح</span>
                </div>
                
                <ResultCard 
                  title="التقرير باللغة الإنجليزية (موصى به)" 
                  content={result.englishReport} 
                  color="cyan"
                />
                
                <ResultCard 
                  title="التقرير باللغة العربية" 
                  content={result.arabicReport} 
                  color="rose"
                />

                {/* Community Alert Section */}
                <div className="mt-8 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="text-purple-400" size={24} />
                    <h3 className="text-lg font-bold text-white">حشد المجتمع (آلاف البلاغات)</h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">
                    لزيادة فعالية البلاغ، قم بنسخ الرسالة أدناه وشاركها فوراً في مجموعات الواتساب وتيليجرام لحث الآخرين على الإبلاغ معك.
                  </p>
                  <ResultCard 
                    title="رسالة نداء للمجتمع (للنشر)" 
                    content={result.communityAlert} 
                    color="purple"
                  />
                </div>

                {/* Direct Send Options */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mt-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl -mr-10 -mt-10"></div>
                   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                     <Send size={20} className="text-cyan-400" />
                     إرسال البلاغ مباشرة
                   </h3>
                   <div className="grid grid-cols-1 gap-3 relative z-10">
                     <button 
                        onClick={handleSendEmail}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 w-full"
                     >
                       <Mail size={18} />
                       إرسال لبريد الدعم القانوني (Email)
                     </button>
                     <a 
                        href="https://www.tiktok.com/legal/report/feedback" 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-xl font-bold transition-all border border-slate-600 w-full"
                     >
                        <ExternalLink size={18} />
                        فتح نموذج البلاغات الرسمي
                     </a>
                   </div>
                   <p className="text-xs text-slate-400 mt-3 text-center">
                     سيتم فتح تطبيق البريد الإلكتروني لديك مع تعبئة البيانات تلقائياً.
                   </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl mt-6">
                  <h4 className="text-yellow-500 font-bold mb-2 flex items-center gap-2">
                    <Info size={18} />
                    نصيحة إضافية
                  </h4>
                  <p className="text-gray-300 text-sm">{result.advice}</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30 text-center">
                <div className="bg-slate-800 p-4 rounded-full mb-4">
                  <ShieldAlert size={40} className="text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-400 mb-2">لا توجد نتائج حتى الآن</h3>
                <p className="text-slate-500 text-sm max-w-xs">
                  قم بملء النموذج بتفاصيل البث المخالف، وسيقوم الذكاء الاصطناعي بكتابة تقرير احترافي لك فوراً.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;