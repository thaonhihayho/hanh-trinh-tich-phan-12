import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Sparkles,
  ChevronDown,
  Send,
  RotateCcw,
  GraduationCap,
  Award,
  Compass,
  RefreshCw,
} from 'lucide-react';
import { LatexRenderer } from './LatexRenderer';
import { GeoGebraViewer, type GeoGebraConfig } from './GeoGebraViewer';
import {
  THEORY_SECTIONS,
  EXERCISES_DATA,
  generateExamQuestions,
  type ExerciseItem,
  type ExamQuestion,
} from './chapter4Data';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text?: string;
  questionNumber?: number;
  examVer?: number;
  questionLatex?: string;
  optionsLatex?: string[];
  thinkingHint?: string;
  detailedSolution?: string;
  geogebra?: GeoGebraConfig;
}

// Chuẩn hóa bộ câu hỏi đề kiểm tra để mọi phương án và lời giải khớp tuyệt đối 100%
const getNormalizedExamQuestions = (version: number): ExamQuestion[] => {
  const rawList = generateExamQuestions(version);
  const c2 = (Math.max(1, version) % 4) + 2;
  return rawList.map((q) => {
    if (q.id === 18) {
      return {
        ...q,
        questionLatex: String.raw`Tính thể tích khối tròn xoay sinh ra khi quay hình phẳng giới hạn bởi $y = ${c2}\sqrt{x}, y = 0, x = 0, x = 4$ quanh trục $Ox$.`,
        options: [
          String.raw`A. $${8 * c2 * c2}\pi$`,
          String.raw`B. $${4 * c2 * c2}\pi$`,
          String.raw`C. $${16 * c2}\pi$`,
          String.raw`D. $${8 * c2 * c2}$`,
        ],
        correctOptionIndex: 0,
        thinkingHint: String.raw`Áp dụng công thức thể tích khối tròn xoay quanh trục $Ox$: $V = \pi\int_0^4 (${c2}\sqrt{x})^2 dx = \pi\int_0^4 ${
          c2 * c2
        }x dx$ (tương tự Bài 4.24a SBT).`,
        detailedSolution: String.raw`Ta có:
$$V = \pi\int_0^4 (${c2}\sqrt{x})^2 dx = \pi\int_0^4 ${
          c2 * c2
        }x dx = \pi \cdot ${c2 * c2}\frac{x^2}{2}\Big|_0^4 = ${8 * c2 * c2}\pi$$
Chọn đáp án **A**.`,
        geogebra: {
          mode: '3d',
          title: `Khối tròn xoay y = ${c2}*sqrt(x) trên [0; 4]`,
          fExpr: `${c2}*sqrt(max(0, x))`,
          defaultA: 0,
          defaultB: 4,
          minBound: 0,
          maxBound: 5,
        },
      };
    }
    return q;
  });
};

export default function App() {
  // Điều hướng 3 phân hệ chính
  const [activeTab, setActiveTab] = useState<'theory' | 'exercises' | 'exam'>(
    'theory'
  );
  const [exerciseSource, setExerciseSource] = useState<'sgk' | 'sbt'>('sgk');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Phân hệ 1: Lý thuyết
  const [selectedTheoryId, setSelectedTheoryId] = useState<string>(
    THEORY_SECTIONS[0].id
  );
  const [showTheoryExampleSol, setShowTheoryExampleSol] = useState<
    Record<string, boolean>
  >({});

  // Phân hệ 2: Giải bài tập SGK (35 bài) & SBT (48 bài)
  const filteredExercises = EXERCISES_DATA.filter(
    (ex) => ex.source === exerciseSource
  );
  const [selectedExerciseId, setSelectedExerciseId] =
    useState<string>('sgk-4.14');
  const [unlockedHintMap, setUnlockedHintMap] = useState<
    Record<string, boolean>
  >({
    'sgk-4.14': true,
  });
  const [unlockedSolMap, setUnlockedSolMap] = useState<Record<string, boolean>>(
    {}
  );

  const currentExercise: ExerciseItem =
    filteredExercises.find((e) => e.id === selectedExerciseId) ||
    filteredExercises[0];

  // Phân hệ 3: Đề kiểm tra cuối chương (25 câu) + Nút "Làm đề khác"
  const [examVersion, setExamVersion] = useState<number>(1);
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>(() =>
    getNormalizedExamQuestions(1)
  );
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<number, string>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);

  // Phân hệ 4: Chatbot AI chuyên giải Đề kiểm tra cuối chương (Từ Câu 1 đến Câu 25)
  const [chatInput, setChatInput] = useState<string>('');
  const [unlockedChatSolMap, setUnlockedChatSolMap] = useState<
    Record<string, boolean>
  >({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      thinkingHint: String.raw`Chào em! Thầy là **Trợ lý AI chuyên giải Đề Kiểm Tra Cuối Chương IV**.
• **Cách sử dụng:** Sau khi em làm bài ở mục **3. Đề Kiểm tra Cuối chương** và bấm **Nộp bài**, hệ thống sẽ cho biết câu nào **Đúng** hoặc **Sai**.
• Để xem **💡 Gợi ý tư duy giải**, **📖 Lời giải chi tiết** và **📐 Hình vẽ GeoGebra (nếu có)** của bất kỳ câu nào, em chỉ cần bấm vào nút **"🤖 Hỏi đáp AI"** ngay tại câu hỏi đó (hoặc gõ số câu vào ô chat bên dưới)!`,
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Chuyển đổi SGK / SBT
  const handleSelectExerciseSource = (src: 'sgk' | 'sbt') => {
    setExerciseSource(src);
    setActiveTab('exercises');
    setIsDropdownOpen(false);
    const firstItem = EXERCISES_DATA.find((e) => e.source === src);
    if (firstItem) {
      setSelectedExerciseId(firstItem.id);
    }
  };

  // Kiểm tra 1 câu trong đề kiểm tra là Đúng hay Sai
  const isQuestionCorrect = (q: ExamQuestion): boolean => {
    if (q.part === 'mcq') {
      return (
        mcqAnswers[q.id] !== undefined &&
        mcqAnswers[q.id] === q.correctOptionIndex
      );
    }
    const rawUser = (shortAnswers[q.id] || '').trim().replace(',', '.');
    const numUser = parseFloat(rawUser);
    return (
      !Number.isNaN(numUser) &&
      q.shortAnswer !== undefined &&
      Math.abs(numUser - q.shortAnswer) <= (q.tolerance ?? 0.05)
    );
  };

  // Tính tổng số câu đúng khi nộp bài
  const calculateExamResult = () => {
    let mcqCorrect = 0;
    let shortCorrect = 0;

    examQuestions.forEach((q) => {
      if (isQuestionCorrect(q)) {
        if (q.part === 'mcq') mcqCorrect += 1;
        else shortCorrect += 1;
      }
    });

    return {
      mcqCorrect,
      shortCorrect,
      totalCorrect: mcqCorrect + shortCorrect,
      totalQuestions: examQuestions.length,
    };
  };

  // Sinh đề kiểm tra mới khi bấm "Làm đề khác"
  const handleGenerateNewExam = () => {
    const nextVer = examVersion + 1;
    setExamVersion(nextVer);
    setExamQuestions(getNormalizedExamQuestions(nextVer));
    setIsExamSubmitted(false);
    setMcqAnswers({});
    setShortAnswers({});
    setChatMessages([
      {
        id: `new-exam-${nextVer}`,
        role: 'assistant',
        thinkingHint: String.raw`Hệ thống đã tạo **Đề kiểm tra số ${nextVer}** hoàn toàn mới!
Em hãy hoàn thành 25 câu hỏi và bấm **Nộp bài**, sau đó bấm nút **"🤖 Hỏi đáp AI"** ở bất kỳ câu nào để xem gợi ý tư duy, lời giải chi tiết và hình minh họa nhé.`,
      },
    ]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Gửi câu hỏi trong Đề kiểm tra sang Chatbot AI
  const handleAskAIForExamQuestion = (q: ExamQuestion) => {
    const msgId = `bot-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: `Nhờ AI hướng dẫn tư duy, giải chi tiết và vẽ hình minh họa (nếu có) cho Câu ${q.id} (Đề kiểm tra số ${examVersion}).`,
    };

    const botMsg: ChatMessage = {
      id: msgId,
      role: 'assistant',
      questionNumber: q.id,
      examVer: examVersion,
      questionLatex: q.questionLatex,
      optionsLatex: q.options,
      thinkingHint: q.thinkingHint,
      detailedSolution: q.detailedSolution,
      geogebra: q.geogebra,
    };

    setChatMessages((prev) => [...prev, userMsg, botMsg]);
  };

  // Xử lý khi học sinh nhập số câu (VD: "Câu 12" hoặc "12") vào ô chat
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = chatInput.trim();
    if (!raw) return;
    setChatInput('');

    const match = raw.match(/\d+/);
    if (match) {
      const qNum = parseInt(match[0], 10);
      const foundQ = examQuestions.find((item) => item.id === qNum);
      if (foundQ) {
        handleAskAIForExamQuestion(foundQ);
        return;
      }
    }

    setChatMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        text: raw,
      },
      {
        id: `bot-${Date.now() + 1}`,
        role: 'assistant',
        thinkingHint: String.raw`Chatbot này chuyên dùng để giải **25 câu trong Đề Kiểm Tra Cuối Chương IV (Đề số ${examVersion})**.
Em hãy bấm trực tiếp vào nút **"🤖 Hỏi đáp AI"** ở từng câu hỏi bên đề kiểm tra (hoặc nhập số câu từ **1 đến 25**, ví dụ: *"Câu 14"*) nhé!`,
      },
    ]);
  };

  const examResult = calculateExamResult();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* HEADER CHÍNH */}
      <header className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 font-semibold">
                Toán 12 • Bộ sách Kết nối tri thức với cuộc sống
              </span>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight mt-0.5">
                CHƯƠNG IV: NGUYÊN HÀM VÀ TÍCH PHÂN
              </h1>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('theory')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition ${
                activeTab === 'theory'
                  ? 'bg-white text-indigo-950 shadow'
                  : 'text-indigo-100 hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              1. Tóm tắt Lý thuyết
            </button>

            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition ${
                  activeTab === 'exercises'
                    ? 'bg-white text-indigo-950 shadow'
                    : 'text-indigo-100 hover:bg-white/10'
                }`}
              >
                <FileText className="w-4 h-4" />
                2. Giải Bài Tập (
                {exerciseSource === 'sgk' ? 'SGK - 35 bài' : 'SBT - 48 bài'})
                <ChevronDown className="w-4 h-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800">
                  <button
                    type="button"
                    onClick={() => handleSelectExerciseSource('sgk')}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between hover:bg-indigo-50 transition ${
                      activeTab === 'exercises' && exerciseSource === 'sgk'
                        ? 'text-indigo-700 bg-indigo-50/70'
                        : 'text-slate-700'
                    }`}
                  >
                    <span>📘 Bài tập Sách giáo khoa (SGK)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      Đủ 35 bài
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectExerciseSource('sbt')}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between hover:bg-indigo-50 transition ${
                      activeTab === 'exercises' && exerciseSource === 'sbt'
                        ? 'text-indigo-700 bg-indigo-50/70'
                        : 'text-slate-700'
                    }`}
                  >
                    <span>📙 Bài tập Sách bài tập (SBT)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      Đủ 48 bài
                    </span>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('exam')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition ${
                activeTab === 'exam'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-amber-200 hover:bg-white/10'
              }`}
            >
              <Award className="w-4 h-4" />
              3. Đề Kiểm tra Cuối chương (25 câu)
            </button>
          </nav>
        </div>
      </header>

      {/* NỘI DUNG CHÍNH */}
      <div className="max-w-7xl w-full mx-auto px-4 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <main className="lg:col-span-8 space-y-6">
          {/* =================================================================
              PHÂN HỆ 1: TÓM TẮT LÝ THUYẾT
             ================================================================= */}
          {activeTab === 'theory' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap gap-2">
                {THEORY_SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSelectedTheoryId(sec.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition border ${
                      selectedTheoryId === sec.id
                        ? 'bg-indigo-700 text-white border-indigo-700 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50'
                    }`}
                  >
                    {sec.lessonNumber}: {sec.title}
                  </button>
                ))}
              </div>

              {THEORY_SECTIONS.filter((s) => s.id === selectedTheoryId).map(
                (sec) => (
                  <div
                    key={sec.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5"
                  >
                    <div className="border-b border-slate-200 pb-3">
                      <span className="text-xs font-bold uppercase text-indigo-600">
                        {sec.lessonNumber} • Chương IV SGK Kết nối tri thức
                      </span>
                      <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                        {sec.title}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        {sec.summary}
                      </p>
                    </div>

                    <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5">
                      <LatexRenderer content={sec.coreKnowledge} />
                    </div>

                    <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5">
                      <LatexRenderer content={sec.thinkingGuide} />
                    </div>

                    <GeoGebraViewer config={sec.geogebra} />

                    <div className="border border-indigo-200 rounded-2xl p-5 bg-indigo-50/30 space-y-3">
                      <LatexRenderer content={sec.exampleProblem} />

                      <div className="bg-white border border-amber-200 rounded-xl p-4">
                        <div className="text-xs font-bold text-amber-800 uppercase mb-1 flex items-center gap-1">
                          <Lightbulb className="w-4 h-4" /> Gợi ý tư duy giải ví
                          dụ:
                        </div>
                        <LatexRenderer content={sec.exampleThinking} />
                      </div>

                      {!showTheoryExampleSol[sec.id] ? (
                        <button
                          type="button"
                          onClick={() =>
                            setShowTheoryExampleSol((prev) => ({
                              ...prev,
                              [sec.id]: true,
                            }))
                          }
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition"
                        >
                          📖 Xem Lời giải chi tiết ví dụ
                        </button>
                      ) : (
                        <div className="bg-white border border-emerald-200 rounded-xl p-4">
                          <LatexRenderer content={sec.exampleSolution} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* =================================================================
              PHÂN HỆ 2: GIẢI BÀI TẬP SGK (35 BÀI) & SBT (48 BÀI)
             ================================================================= */}
          {activeTab === 'exercises' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase text-indigo-600">
                      Hệ thống hướng dẫn giải chuẩn Sách Giáo Viên & SBT
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      {exerciseSource === 'sgk'
                        ? '📘 Bài Tập Sách Giáo Khoa (Đủ 35 bài: 4.1 → 4.35)'
                        : '📙 Bài Tập Sách Bài Tập (Đủ 48 bài: 4.1 → 4.48)'}
                    </h2>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectExerciseSource('sgk')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        exerciseSource === 'sgk'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Bài tập SGK (35)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectExerciseSource('sbt')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        exerciseSource === 'sbt'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Bài tập SBT (48)
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-500 mb-2">
                    Nhấp vào số bài để xem Đề bài, Gợi ý tư duy, Mô phỏng
                    GeoGebra & Lời giải chi tiết:
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto p-1">
                    {filteredExercises.map((ex) => {
                      const isSelected = currentExercise?.id === ex.id;
                      return (
                        <button
                          key={ex.id}
                          type="button"
                          onClick={() => setSelectedExerciseId(ex.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1 ${
                            isSelected
                              ? 'bg-indigo-700 text-white border-indigo-700 shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50'
                          }`}
                        >
                          <span>{ex.code.replace(' (SBT)', '')}</span>
                          {ex.geogebra && (
                            <Compass
                              className={`w-3.5 h-3.5 ${
                                isSelected
                                  ? 'text-amber-300'
                                  : 'text-indigo-600'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {currentExercise && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs">
                        {currentExercise.lesson}
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                        {currentExercise.code}
                      </h3>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">
                      Đề bài:
                    </div>
                    <LatexRenderer content={currentExercise.problemLatex} />
                  </div>

                  {currentExercise.geogebra && (
                    <GeoGebraViewer config={currentExercise.geogebra} />
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setUnlockedHintMap((prev) => ({
                          ...prev,
                          [currentExercise.id]: !prev[currentExercise.id],
                        }))
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition"
                    >
                      <Lightbulb className="w-4 h-4" />
                      {unlockedHintMap[currentExercise.id]
                        ? 'Ẩn Gợi ý tư duy giải'
                        : '1. Xem Gợi ý tư duy giải'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUnlockedHintMap((prev) => ({
                          ...prev,
                          [currentExercise.id]: true,
                        }));
                        setUnlockedSolMap((prev) => ({
                          ...prev,
                          [currentExercise.id]: !prev[currentExercise.id],
                        }));
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
                    >
                      <BookOpen className="w-4 h-4" />
                      {unlockedSolMap[currentExercise.id]
                        ? 'Ẩn Lời giải chi tiết'
                        : '2. Xem Lời giải chi tiết (Chuẩn SGV/SBT)'}
                    </button>
                  </div>

                  {unlockedHintMap[currentExercise.id] && (
                    <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-5">
                      <div className="text-xs font-bold uppercase text-amber-900 mb-1.5 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        Gợi ý tư duy & Định hướng phương pháp giải:
                      </div>
                      <LatexRenderer content={currentExercise.thinkingHint} />
                    </div>
                  )}

                  {unlockedSolMap[currentExercise.id] && (
                    <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-5">
                      <div className="text-xs font-bold uppercase text-emerald-900 mb-1.5">
                        📖 Lời giải chi tiết:
                      </div>
                      <LatexRenderer
                        content={currentExercise.detailedSolution}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              PHÂN HỆ 3: ĐỀ KIỂM TRA CUỐI CHƯƠNG (25 CÂU)
             ================================================================= */}
          {activeTab === 'exam' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 text-xs font-extrabold uppercase">
                    Đề kiểm tra số {examVersion} • Bám sát SGK & SBT Kết nối tri
                    thức
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                    Đề Kiểm Tra & Ôn Tập Cuối Chương IV (20 Trắc Nghiệm + 5 Trả
                    Lời Ngắn)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Khi bấm <b>Nộp bài</b>, hệ thống chỉ báo câu Đúng / Sai. Để
                    xem <b>Gợi ý tư duy, Lời giải chi tiết và Hình vẽ</b>, hãy
                    bấm nút <b>"🤖 Hỏi đáp AI"</b> ở từng câu để hiển thị bên
                    khung Chatbot!
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleGenerateNewExam}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs md:text-sm font-extrabold shadow transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Làm đề khác (Tạo đề mới)
                  </button>

                  {!isExamSubmitted ? (
                    <button
                      type="button"
                      onClick={() => setIsExamSubmitted(true)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-extrabold shadow-md transition"
                    >
                      Nộp bài & Chấm Đúng/Sai
                    </button>
                  ) : (
                    <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl px-4 py-2 text-center">
                      <div className="text-[11px] font-bold text-emerald-800 uppercase">
                        Kết quả Đề số {examVersion}
                      </div>
                      <div className="text-lg font-extrabold text-emerald-700">
                        Đúng {examResult.totalCorrect} /{' '}
                        {examResult.totalQuestions} câu
                      </div>
                      <div className="text-[11px] text-slate-600">
                        (Trắc nghiệm: {examResult.mcqCorrect}/20 • Trả lời ngắn:{' '}
                        {examResult.shortCorrect}/5)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PHẦN I: 20 CÂU TRẮC NGHIỆM */}
              <div className="space-y-4">
                <div className="bg-indigo-900 text-white px-5 py-3 rounded-2xl font-bold text-sm">
                  PHẦN I. CÂU HỎI TRẮC NGHIỆM 4 LỰA CHỌN (20 CÂU: TỪ CÂU 1 ĐẾN
                  CÂU 20)
                </div>

                {examQuestions
                  .filter((q) => q.part === 'mcq')
                  .map((q) => {
                    const userChoice = mcqAnswers[q.id];
                    const isCorrect = isQuestionCorrect(q);

                    return (
                      <div
                        key={`${examVersion}-${q.id}`}
                        className={`bg-white rounded-2xl p-5 shadow-sm border transition space-y-3 ${
                          isExamSubmitted
                            ? isCorrect
                              ? 'border-emerald-300'
                              : 'border-rose-300'
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-lg bg-slate-900 text-white font-bold text-xs">
                              Câu {q.id}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-xs">
                              {q.level}
                            </span>

                            {/* Sau khi nộp bài: Chỉ hiện trạng thái Đúng hoặc Sai */}
                            {isExamSubmitted && (
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                                  isCorrect
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                                }`}
                              >
                                {isCorrect ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />{' '}
                                    Đúng
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5" /> Sai
                                  </>
                                )}
                              </span>
                            )}
                          </div>

                          {/* Nút Hỏi đáp AI để xem Gợi ý tư duy, Lời giải chi tiết & Hình vẽ trong Chatbot */}
                          <button
                            type="button"
                            onClick={() => handleAskAIForExamQuestion(q)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-sm transition"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            🤖 Hỏi đáp AI (Xem Gợi ý, Lời giải & Hình vẽ)
                          </button>
                        </div>

                        <LatexRenderer content={q.questionLatex} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {q.options?.map((opt, optIdx) => {
                            const isSelected = userChoice === optIdx;
                            let styleClass =
                              'bg-slate-50 border-slate-200 hover:border-indigo-400';

                            if (!isExamSubmitted && isSelected) {
                              styleClass =
                                'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/30';
                            } else if (isExamSubmitted && isSelected) {
                              styleClass = isCorrect
                                ? 'bg-emerald-50 border-emerald-500 font-bold'
                                : 'bg-rose-50 border-rose-400';
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={isExamSubmitted}
                                onClick={() =>
                                  setMcqAnswers((prev) => ({
                                    ...prev,
                                    [q.id]: optIdx,
                                  }))
                                }
                                className={`text-left px-4 py-2.5 rounded-xl border transition flex items-center justify-between ${styleClass}`}
                              >
                                <LatexRenderer content={opt} />
                                {isExamSubmitted && isSelected && isCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                                {isExamSubmitted &&
                                  isSelected &&
                                  !isCorrect && (
                                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                  )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* PHẦN II: 5 CÂU TRẢ LỜI NGẮN */}
              <div className="space-y-4">
                <div className="bg-amber-500 text-slate-950 px-5 py-3 rounded-2xl font-extrabold text-sm">
                  PHẦN II. CÂU HỎI TRẢ LỜI NGẮN - ĐIỀN ĐÁP SỐ (5 CÂU: TỪ CÂU 21
                  ĐẾN CÂU 25)
                </div>

                {examQuestions
                  .filter((q) => q.part === 'short')
                  .map((q) => {
                    const rawVal = shortAnswers[q.id] || '';
                    const isShortCorrect = isQuestionCorrect(q);

                    return (
                      <div
                        key={`${examVersion}-${q.id}`}
                        className={`bg-white rounded-2xl p-5 shadow-sm border transition space-y-3 ${
                          isExamSubmitted
                            ? isShortCorrect
                              ? 'border-emerald-300'
                              : 'border-rose-300'
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-extrabold text-xs">
                              Câu {q.id} (Trả lời ngắn)
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-xs">
                              {q.level}
                            </span>

                            {isExamSubmitted && (
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                                  isShortCorrect
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                                }`}
                              >
                                {isShortCorrect ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />{' '}
                                    Đúng
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5" /> Sai
                                  </>
                                )}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAskAIForExamQuestion(q)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-sm transition"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            🤖 Hỏi đáp AI (Xem Gợi ý, Lời giải & Hình vẽ)
                          </button>
                        </div>

                        <LatexRenderer content={q.questionLatex} />

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <label className="text-xs font-bold text-slate-700">
                            Điền đáp số của em:
                          </label>
                          <input
                            type="text"
                            disabled={isExamSubmitted}
                            value={rawVal}
                            onChange={(e) =>
                              setShortAnswers((prev) => ({
                                ...prev,
                                [q.id]: e.target.value,
                              }))
                            }
                            placeholder="Nhập đáp số..."
                            className={`px-3.5 py-2 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44 ${
                              isExamSubmitted
                                ? isShortCorrect
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                  : 'bg-rose-50 border-rose-400 text-rose-900'
                                : 'bg-white border-slate-300 text-indigo-900'
                            }`}
                          />
                          <span className="text-xs text-slate-500 italic">
                            ({q.unitHint})
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </main>

        {/* =================================================================
            PHÂN HỆ 4: CHATBOT AI CHUYÊN GIẢI ĐỀ KIỂM TRA CUỐI CHƯƠNG
           ================================================================= */}
        <aside className="lg:col-span-4 lg:sticky lg:top-20">
          <div className="bg-white rounded-2xl shadow-lg border border-indigo-200 overflow-hidden flex flex-col h-[700px]">
            {/* Header Chatbot */}
            <div className="bg-gradient-to-r from-indigo-800 to-violet-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    Chatbot AI Giải Đề Kiểm Tra (Đề số {examVersion})
                  </h3>
                  <p className="text-[11px] text-indigo-200">
                    Gợi ý tư duy • Lời giải chi tiết & Hình vẽ GeoGebra
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setChatMessages([
                    {
                      id: 'reset',
                      role: 'assistant',
                      thinkingHint: String.raw`Đã làm mới khung hội thoại! Em hãy bấm nút **"🤖 Hỏi đáp AI"** ở bất kỳ câu hỏi nào trong **Đề kiểm tra số ${examVersion}** để xem gợi ý tư duy, lời giải chi tiết và hình vẽ nhé.`,
                    },
                  ])
                }
                title="Làm mới đoạn chat"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Nội dung tin nhắn Chatbot */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-4 bg-slate-50">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <div
                      className="max-w-[90%] bg-indigo-600 text-white rounded-2xl rounded-br-none px-4 py-2.5 shadow-sm"
                      style={{
                        fontFamily: "'Times New Roman', Times, serif",
                        fontSize: '12pt',
                      }}
                    >
                      {msg.text}
                    </div>
                  ) : (
                    <div className="w-full space-y-3">
                      {/* Nếu là phản hồi giải một câu trong Đề kiểm tra -> Hiện Đề bài câu đó */}
                      {msg.questionNumber && msg.questionLatex && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-2">
                          <div className="text-xs font-extrabold uppercase text-indigo-700">
                            📌 Đề bài Câu {msg.questionNumber} (Đề số{' '}
                            {msg.examVer}):
                          </div>
                          <LatexRenderer content={msg.questionLatex} />
                          {msg.optionsLatex && (
                            <div className="grid grid-cols-1 gap-1 pt-1 border-t border-slate-100">
                              {msg.optionsLatex.map((opt, idx) => (
                                <LatexRenderer key={idx} content={opt} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 1. Phần Gợi ý tư duy giải */}
                      {msg.thinkingHint && (
                        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl rounded-bl-none p-3.5 shadow-sm">
                          {msg.questionNumber && (
                            <div className="text-xs font-extrabold uppercase text-amber-900 mb-1 flex items-center gap-1">
                              <Lightbulb className="w-4 h-4 text-amber-600" />
                              1. Gợi ý tư duy giải Câu {msg.questionNumber}:
                            </div>
                          )}
                          <LatexRenderer content={msg.thinkingHint} />
                        </div>
                      )}

                      {/* 2. Phần Lời giải chi tiết & Đáp số */}
                      {msg.detailedSolution && (
                        <div>
                          {!unlockedChatSolMap[msg.id] ? (
                            <button
                              type="button"
                              onClick={() =>
                                setUnlockedChatSolMap((prev) => ({
                                  ...prev,
                                  [msg.id]: true,
                                }))
                              }
                              className="w-full py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition text-center"
                            >
                              📖 Bấm để xem Lời giải chi tiết & Đáp số Câu{' '}
                              {msg.questionNumber}
                            </button>
                          ) : (
                            <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-3.5 shadow-sm">
                              <div className="text-xs font-extrabold uppercase text-emerald-900 mb-1">
                                📖 2. Lời giải chi tiết & Đáp số:
                              </div>
                              <LatexRenderer content={msg.detailedSolution} />
                            </div>
                          )}
                        </div>
                      )}

                      {/* 3. Hình vẽ minh họa GeoGebra (Nếu câu hỏi có hình) */}
                      {msg.geogebra && <GeoGebraViewer config={msg.geogebra} />}
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Ô nhập nhanh số thứ tự câu hỏi */}
            <form
              onSubmit={handleChatSubmit}
              className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Gõ số câu trong đề kiểm tra (VD: Câu 14)..."
                className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
