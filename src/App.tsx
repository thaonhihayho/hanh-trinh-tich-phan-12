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

interface BankItem extends Omit<ExamQuestion, 'id'> {
  bankKey: string;
}

// Trộn ngẫu nhiên mảng theo thuật toán Fisher-Yates
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Hàm tạo câu hỏi Trắc nghiệm 4 lựa chọn (Tự động trộn vị trí A, B, C, D và khớp lời giải)
function createMcqItem(
  bankKey: string,
  level: ExamQuestion['level'],
  questionLatex: string,
  correctRaw: string,
  wrongRaws: [string, string, string],
  thinkingHint: string,
  solutionBody: string,
  geogebra?: GeoGebraConfig
): BankItem {
  const pool = [
    { text: correctRaw, isCorrect: true },
    { text: wrongRaws[0], isCorrect: false },
    { text: wrongRaws[1], isCorrect: false },
    { text: wrongRaws[2], isCorrect: false },
  ];
  const shuffled = shuffleArray(pool);
  const labels = ['A', 'B', 'C', 'D'];
  const correctIdx = shuffled.findIndex((item) => item.isCorrect);
  const options = shuffled.map((item, idx) => `${labels[idx]}. ${item.text}`);
  const detailedSolution = `${solutionBody}\n\nChọn đáp án **${labels[correctIdx]}**.`;

  return {
    bankKey,
    part: 'mcq',
    level,
    questionLatex,
    options,
    correctOptionIndex: correctIdx,
    thinkingHint,
    detailedSolution,
    geogebra,
  };
}

// ============================================================================
// NGÂN HÀNG ĐẦY ĐỦ CÁC DẠNG BÀI TẬP TỪ SGK (4.1 -> 4.35) & SBT (4.1 -> 4.48)
// ============================================================================
function buildDiverseQuestionBank(seedVer: number): {
  mcqPool: BankItem[];
  shortPool: BankItem[];
} {
  // Các tham số ngẫu nhiên nhẹ để ngay cả khi gặp lại cùng dạng bài vẫn có số mới
  const k = (seedVer % 3) + 2; // 2, 3, 4
  const m = (seedVer % 4) + 2; // 2, 3, 4, 5
  const R = (seedVer % 3) + 2; // 2, 3, 4

  const mcqPool: BankItem[] = [
    // --- NHÓM 1: MỨC ĐỘ NHẬN BIẾT (BÁM SÁT BÀI 11, 12, 13 SGK & SBT) ---
    createMcqItem(
      'nb-def-prim',
      'Nhận biết',
      String.raw`*(Theo Bài 4.1 SGK)* Cho hàm số $F(x)$ là một nguyên hàm của hàm số $f(x)$ trên khoảng $K$. Khẳng định nào sau đây là **đúng**?`,
      String.raw`$F'(x) = f(x), \forall x \in K$`,
      [
        String.raw`$f'(x) = F(x), \forall x \in K$`,
        String.raw`$F(x) = f'(x) + C, \forall x \in K$`,
        String.raw`$F'(x) = f'(x), \forall x \in K$`,
      ],
      String.raw`Dựa vào định nghĩa nguyên hàm (Bài 11 SGK): $F(x)$ là nguyên hàm của $f(x)$ trên $K$ nếu $F'(x) = f(x)$ với mọi $x \in K$.`,
      String.raw`Theo định nghĩa nguyên hàm trong SGK trang 5, hàm số $F(x)$ được gọi là nguyên hàm của $f(x)$ trên $K$ nếu $F'(x) = f(x)$ với mọi $x \in K$.`
    ),

    createMcqItem(
      'nb-power-rule',
      'Nhận biết',
      String.raw`*(Theo Bài 4.1 SBT)* Với $\alpha \ne -1$, họ tất cả các nguyên hàm của hàm số $f(x) = x^\alpha$ trên khoảng $(0; +\infty)$ là:`,
      String.raw`$\frac{x^{\alpha + 1}}{\alpha + 1} + C$`,
      [
        String.raw`$\alpha x^{\alpha - 1} + C$`,
        String.raw`$\frac{x^\alpha}{\alpha + 1} + C$`,
        String.raw`$(\alpha + 1)x^{\alpha + 1} + C$`,
      ],
      String.raw`Áp dụng công thức nguyên hàm của hàm số lũy thừa trong bảng nguyên hàm cơ bản (Bài 11 SGK).`,
      String.raw`Ta có công thức nguyên hàm cơ bản: $\int x^\alpha dx = \frac{x^{\alpha+1}}{\alpha+1} + C \ (\alpha \ne -1)$.`
    ),

    createMcqItem(
      'nb-inv-x',
      'Nhận biết',
      String.raw`*(Theo Bài 4.3 SGK)* Họ tất cả các nguyên hàm của hàm số $f(x) = \frac{${k}}{x}$ trên khoảng $(0; +\infty)$ là:`,
      String.raw`$${k}\ln x + C$`,
      [
        String.raw`$-\frac{${k}}{x^2} + C$`,
        String.raw`$\frac{1}{${k}}\ln|x| + C$`,
        String.raw`$${k}x\ln x + C$`,
      ],
      String.raw`Sử dụng tính chất $\int k\cdot \frac{1}{x}dx = k\ln|x| + C$ và lưu ý trên khoảng $(0; +\infty)$ thì $|x| = x$.`,
      String.raw`Trên khoảng $(0; +\infty)$, ta có:
$$\int \frac{${k}}{x}dx = ${k}\int \frac{1}{x}dx = ${k}\ln x + C$$`
    ),

    createMcqItem(
      'nb-trig-basic',
      'Nhận biết',
      String.raw`*(Theo Bài 4.4a SGK)* Tìm họ nguyên hàm của hàm số $f(x) = ${k}\cos x - ${m}\sin x$.`,
      String.raw`$${k}\sin x + ${m}\cos x + C$`,
      [
        String.raw`$-${k}\sin x - ${m}\cos x + C$`,
        String.raw`$${k}\sin x - ${m}\cos x + C$`,
        String.raw`$-${k}\sin x + ${m}\cos x + C$`,
      ],
      String.raw`Áp dụng bảng nguyên hàm lượng giác: $\int \cos x dx = \sin x + C$ và $\int \sin x dx = -\cos x + C$.`,
      String.raw`Ta có:
$$\int (${k}\cos x - ${m}\sin x)dx = ${k}\sin x - ${m}(-\cos x) + C = ${k}\sin x + ${m}\cos x + C$$`
    ),

    createMcqItem(
      'nb-trig-cos2',
      'Nhận biết',
      String.raw`*(Theo Bài 4.4b SGK)* Trên khoảng $\left(-\frac{\pi}{2}; \frac{\pi}{2}\right)$, họ tất cả các nguyên hàm của hàm số $f(x) = \frac{1}{\cos^2 x}$ là:`,
      String.raw`$\tan x + C$`,
      [
        String.raw`$-\tan x + C$`,
        String.raw`$\cot x + C$`,
        String.raw`$-\cot x + C$`,
      ],
      String.raw`Vì $(\tan x)' = \frac{1}{\cos^2 x}$ nên nguyên hàm của $\frac{1}{\cos^2 x}$ là $\tan x + C$.`,
      String.raw`Theo bảng nguyên hàm cơ bản (Bài 11 SGK), ta có $\int \frac{1}{\cos^2 x}dx = \tan x + C$.`
    ),

    createMcqItem(
      'nb-exp-ax',
      'Nhận biết',
      String.raw`*(Theo Bài 4.5 SGK)* Họ tất cả các nguyên hàm của hàm số $f(x) = ${m}^x + e^x$ trên $\mathbb{R}$ là:`,
      String.raw`$\frac{${m}^x}{\ln ${m}} + e^x + C$`,
      [
        String.raw`$${m}^x\ln ${m} + e^x + C$`,
        String.raw`$\frac{${m}^{x+1}}{x+1} + e^x + C$`,
        String.raw`$${m}^x + e^x + C$`,
      ],
      String.raw`Áp dụng công thức $\int a^x dx = \frac{a^x}{\ln a} + C$ và $\int e^x dx = e^x + C$.`,
      String.raw`Ta có:
$$\int (${m}^x + e^x)dx = \frac{${m}^x}{\ln ${m}} + e^x + C$$`
    ),

    createMcqItem(
      'nb-newton-leibniz',
      'Nhận biết',
      String.raw`*(Theo Bài 12 SGK)* Cho hàm số $f(x)$ liên tục trên đoạn $[a; b]$ và $F(x)$ là một nguyên hàm của $f(x)$ trên $[a; b]$. Biết $F(a) = ${k}$ và $F(b) = ${k + m + 3}$, giá trị của $\int_a^b f(x)dx$ bằng:`,
      String.raw`$${m + 3}$`,
      [
        String.raw`$-${m + 3}$`,
        String.raw`$${2 * k + m + 3}$`,
        String.raw`$${k * (k + m + 3)}$`,
      ],
      String.raw`Áp dụng công thức Newton – Leibniz: $\int_a^b f(x)dx = F(b) - F(a)$.`,
      String.raw`Theo định nghĩa tích phân:
$$\int_a^b f(x)dx = F(b) - F(a) = ${k + m + 3} - ${k} = ${m + 3}$$`
    ),

    createMcqItem(
      'nb-area-formula',
      'Nhận biết',
      String.raw`*(Theo Bài 4.21 SBT)* Cho hai hàm số $y = f(x)$ và $y = g(x)$ liên tục trên đoạn $[a; b]$. Diện tích hình phẳng giới hạn bởi đồ thị hai hàm số đó và hai đường thẳng $x = a, x = b$ được tính theo công thức:`,
      String.raw`$S = \int_a^b |f(x) - g(x)|dx$`,
      [
        String.raw`$S = \pi\int_a^b |f(x) - g(x)|dx$`,
        String.raw`$S = \int_a^b [f(x) - g(x)]dx$`,
        String.raw`$S = \pi\int_a^b [f^2(x) - g^2(x)]dx$`,
      ],
      String.raw`Nhớ lại công thức tính diện tích hình phẳng giới hạn bởi 2 đồ thị hàm số ở Bài 13 SGK (luôn có dấu giá trị tuyệt đối và không nhân $\pi$).`,
      String.raw`Diện tích hình phẳng giới hạn bởi đồ thị hai hàm số $y = f(x), y = g(x)$ và $x = a, x = b$ là:
$$S = \int_a^b |f(x) - g(x)|dx$$`
    ),

    createMcqItem(
      'nb-vol-section-formula',
      'Nhận biết',
      String.raw`*(Theo Bài 13 SGK)* Cắt một vật thể giới hạn bởi hai mặt phẳng $x = a$ và $x = b$ bởi mặt phẳng vuông góc với trục $Ox$ tại điểm có hoành độ $x \ (a \le x \le b)$ thì được thiết diện có diện tích là hàm liên tục $S(x)$. Thể tích $V$ của vật thể là:`,
      String.raw`$V = \int_a^b S(x)dx$`,
      [
        String.raw`$V = \pi\int_a^b S(x)dx$`,
        String.raw`$V = \pi\int_a^b S^2(x)dx$`,
        String.raw`$V = \int_a^b S^2(x)dx$`,
      ],
      String.raw`Phân biệt rõ: Công thức tính thể tích vật thể khi biết diện tích mặt cắt $S(x)$ thì **không** có nhân tử $\pi$ và không bình phương $S(x)$.`,
      String.raw`Theo công thức thể tích vật thể trong Bài 13 SGK trang 22:
$$V = \int_a^b S(x)dx$$`
    ),

    createMcqItem(
      'nb-vol-rot-formula',
      'Nhận biết',
      String.raw`*(Theo Bài 4.20 SGK)* Cho hàm số $y = f(x)$ liên tục trên $[a; b]$. Thể tích khối tròn xoay sinh ra khi quay hình phẳng giới hạn bởi đồ thị $y = f(x)$, trục $Ox$ và $x = a, x = b$ quanh trục $Ox$ là:`,
      String.raw`$V = \pi\int_a^b f^2(x)dx$`,
      [
        String.raw`$V = \int_a^b f^2(x)dx$`,
        String.raw`$V = \pi\int_a^b |f(x)|dx$`,
        String.raw`$V = 2\pi\int_a^b f^2(x)dx$`,
      ],
      String.raw`Khi quay quanh trục $Ox$, thiết diện mặt cắt là hình tròn bán kính $R = |f(x)|$ nên diện tích mặt cắt là $S(x) = \pi f^2(x)$.`,
      String.raw`Thể tích khối tròn xoay khi quay quanh trục $Ox$ được tính bởi công thức:
$$V = \pi\int_a^b f^2(x)dx$$`
    ),

    createMcqItem(
      'nb-area-from-graph',
      'Nhận biết',
      String.raw`*(Theo Bài 4.21 SBT)* Cho hàm số $y = f(x)$ liên tục trên đoạn $[-1; 3]$, có đồ thị nằm phía trên trục hoành trên $[-1; 1]$ và nằm phía dưới trục hoành trên $[1; 3]$. Diện tích $S$ của hình phẳng giới hạn bởi đồ thị $y = f(x)$, trục hoành và $x = -1, x = 3$ bằng:`,
      String.raw`$S = \int_{-1}^1 f(x)dx - \int_1^3 f(x)dx$`,
      [
        String.raw`$S = \int_{-1}^1 f(x)dx + \int_1^3 f(x)dx$`,
        String.raw`$S = -\int_{-1}^1 f(x)dx + \int_1^3 f(x)dx$`,
        String.raw`$S = \int_{-1}^3 f(x)dx$`,
      ],
      String.raw`Trên đoạn nào đồ thị nằm phía trên trục hoành thì $f(x) \ge 0 \Rightarrow |f(x)| = f(x)$; nằm phía dưới trục hoành thì $f(x) \le 0 \Rightarrow |f(x)| = -f(x)$.`,
      String.raw`Vì $f(x) \ge 0$ trên $[-1; 1]$ và $f(x) \le 0$ trên $[1; 3]$ nên:
$$S = \int_{-1}^3 |f(x)|dx = \int_{-1}^1 f(x)dx + \int_1^3 [-f(x)]dx = \int_{-1}^1 f(x)dx - \int_1^3 f(x)dx$$`,
      {
        mode: '2d',
        title: 'Minh họa xét dấu f(x) trên [-1; 1] và [1; 3]',
        fExpr: '1 - x',
        defaultA: -1,
        defaultB: 3,
      }
    ),

    createMcqItem(
      'nb-poly-prim',
      'Nhận biết',
      String.raw`*(Theo Bài 4.2 SGK)* Họ tất cả các nguyên hàm của hàm số $f(x) = 3x^2 - ${2 * k}x + 1$ là:`,
      String.raw`$x^3 - ${k}x^2 + x + C$`,
      [
        String.raw`$6x - ${2 * k} + C$`,
        String.raw`$3x^3 - ${k}x^2 + x + C$`,
        String.raw`$x^3 - ${2 * k}x^2 + x + C$`,
      ],
      String.raw`Áp dụng nguyên hàm từng số hạng: $\int x^n dx = \frac{x^{n+1}}{n+1} + C$.`,
      String.raw`Ta có:
$$\int (3x^2 - ${2 * k}x + 1)dx = 3\cdot\frac{x^3}{3} - ${2 * k}\cdot\frac{x^2}{2} + x + C = x^3 - ${k}x^2 + x + C$$`
    ),

    // --- NHÓM 2: MỨC ĐỘ THÔNG HIỂU (BÁM SÁT BÀI TẬP SGK & SBT) ---
    createMcqItem(
      'th-find-C-poly',
      'Thông hiểu',
      String.raw`*(Theo Bài 4.2 SGK & 4.2 SBT)* Tìm nguyên hàm $F(x)$ của hàm số $f(x) = 2x + ${k}$ biết rằng $F(1) = ${k + 5}$.`,
      String.raw`$F(x) = x^2 + ${k}x + 4$`,
      [
        String.raw`$F(x) = x^2 + ${k}x + ${k + 5}$`,
        String.raw`$F(x) = x^2 + ${k}x - 4$`,
        String.raw`$F(x) = 2x^2 + ${k}x + 3$`,
      ],
      String.raw`Tìm họ nguyên hàm $F(x) = x^2 + ${k}x + C$, sau đó thay điều kiện $F(1) = ${k + 5}$ để giải tìm hằng số $C$.`,
      String.raw`Ta có $F(x) = \int (2x + ${k})dx = x^2 + ${k}x + C$.
Do $F(1) = ${k + 5}$ nên:
$$1^2 + ${k}\cdot 1 + C = ${k + 5} \Leftrightarrow C = 4$$
Vậy $F(x) = x^2 + ${k}x + 4$.`
    ),

    createMcqItem(
      'th-radical-prim',
      'Thông hiểu',
      String.raw`*(Theo Bài 4.3b SGK & 4.4 SBT)* Trên khoảng $(0; +\infty)$, họ tất cả các nguyên hàm của hàm số $f(x) = 3\sqrt{x} + \frac{1}{\sqrt{x}}$ là:`,
      String.raw`$2x\sqrt{x} + 2\sqrt{x} + C$`,
      [
        String.raw`$2x\sqrt{x} + \frac{1}{2\sqrt{x}} + C$`,
        String.raw`$\frac{3}{2\sqrt{x}} + 2\sqrt{x} + C$`,
        String.raw`$x\sqrt{x} + \sqrt{x} + C$`,
      ],
      String.raw`Đưa căn thức về lũy thừa số mũ hữu tỉ: $\sqrt{x} = x^{\frac{1}{2}}$ và $\frac{1}{\sqrt{x}} = x^{-\frac{1}{2}}$, sau đó áp dụng $\int x^\alpha dx = \frac{x^{\alpha+1}}{\alpha+1} + C$.`,
      String.raw`Viết lại hàm số: $f(x) = 3x^{\frac{1}{2}} + x^{-\frac{1}{2}}$.
Khi đó:
$$\int f(x)dx = 3\cdot\frac{x^{\frac{3}{2}}}{\frac{3}{2}} + \frac{x^{\frac{1}{2}}}{\frac{1}{2}} + C = 2x\sqrt{x} + 2\sqrt{x} + C$$`
    ),

    createMcqItem(
      'th-rational-expand',
      'Thông hiểu',
      String.raw`*(Theo Bài 4.3c SGK & 4.5 SBT)* Tìm họ nguyên hàm của hàm số $f(x) = \frac{(x - 1)^2}{x^2}$ trên khoảng $(0; +\infty)$.`,
      String.raw`$x - 2\ln x - \frac{1}{x} + C$`,
      [
        String.raw`$x - 2\ln x + \frac{1}{x} + C$`,
        String.raw`$\frac{(x-1)^3}{3x^3} + C$`,
        String.raw`$1 - \frac{2}{x} + \frac{1}{x^2} + C$`,
      ],
      String.raw`Khai triển hằng đẳng thức $(x-1)^2 = x^2 - 2x + 1$ rồi chia từng hạng tử của tử cho mẫu $x^2$.`,
      String.raw`Trên khoảng $(0; +\infty)$, ta biến đổi:
$$f(x) = \frac{x^2 - 2x + 1}{x^2} = 1 - \frac{2}{x} + x^{-2}$$
Suy ra:
$$\int f(x)dx = x - 2\ln x - \frac{1}{x} + C$$`
    ),

    createMcqItem(
      'th-trig-tan2',
      'Thông hiểu',
      String.raw`*(Theo Bài 4.4b SGK & 4.6a SBT)* Tìm họ nguyên hàm của hàm số $f(x) = ${k} + \tan^2 x$ trên khoảng $\left(-\frac{\pi}{2}; \frac{\pi}{2}\right)$.`,
      String.raw`$\tan x + ${k - 1}x + C$`,
      [
        String.raw`$\tan x + ${k}x + C$`,
        String.raw`$\frac{\tan^3 x}{3} + ${k}x + C$`,
        String.raw`$\cot x + ${k - 1}x + C$`,
      ],
      String.raw`Sử dụng hằng đẳng thức lượng giác $1 + \tan^2 x = \frac{1}{\cos^2 x}$, tách $f(x) = (1 + \tan^2 x) + ${k - 1}$.`,
      String.raw`Ta biến đổi:
$$f(x) = (1 + \tan^2 x) + ${k - 1} = \frac{1}{\cos^2 x} + ${k - 1}$$
Suy ra:
$$\int f(x)dx = \tan x + ${k - 1}x + C$$`
    ),

    createMcqItem(
      'th-trig-half-angle',
      'Thông hiểu',
      String.raw`*(Theo Bài 4.4c SGK)* Họ tất cả các nguyên hàm của hàm số $f(x) = 2\sin^2\frac{x}{2}$ là:`,
      String.raw`$x - \sin x + C$`,
      [
        String.raw`$x + \sin x + C$`,
        String.raw`$x - \cos x + C$`,
        String.raw`$2x - \sin x + C$`,
      ],
      String.raw`Áp dụng công thức hạ bậc lượng giác: $2\sin^2\frac{x}{2} = 1 - \cos x$.`,
      String.raw`Sử dụng công thức hạ bậc $2\sin^2\frac{x}{2} = 1 - \cos x$, ta có:
$$\int 2\sin^2\frac{x}{2}dx = \int (1 - \cos x)dx = x - \sin x + C$$`
    ),

    createMcqItem(
      'th-integral-linear-prop',
      'Thông hiểu',
      String.raw`*(Theo Bài 4.9 SGK & 4.12 SBT)* Cho $\int_0^2 f(x)dx = ${k}$ và $\int_0^2 g(x)dx = -3$. Giá trị của tích phân $I = \int_0^2 [3f(x) - 2g(x) + 1]dx$ bằng:`,
      String.raw`$${3 * k + 8}$`,
      [
        String.raw`$${3 * k + 6}$`,
        String.raw`$${3 * k - 4}$`,
        String.raw`$${3 * k + 7}$`,
      ],
      String.raw`Tách tích phân theo tính chất tuyến tính: $I = 3\int_0^2 f(x)dx - 2\int_0^2 g(x)dx + \int_0^2 1dx$.`,
      String.raw`Áp dụng tính chất tuyến tính của tích phân:
$$I = 3\int_0^2 f(x)dx - 2\int_0^2 g(x)dx + \int_0^2 1dx = 3\cdot(${k}) - 2\cdot(-3) + 2 = ${3 * k + 8}$$`
    ),

    createMcqItem(
      'th-integral-split-bounds',
      'Thông hiểu',
      String.raw`*(Theo Bài 4.9b SGK)* Cho hàm số $f(x)$ liên tục trên $\mathbb{R}$ thỏa mãn $\int_1^5 f(x)dx = ${k + 7}$ và $\int_3^5 f(x)dx = ${k}$. Giá trị của $\int_1^3 f(x)dx$ bằng:`,
      String.raw`$7$`,
      [
        String.raw`$${2 * k + 7}$`,
        String.raw`$-7$`,
        String.raw`$${k + 4}$`,
      ],
      String.raw`Sử dụng tính chất chèn cận tích phân: $\int_1^5 f(x)dx = \int_1^3 f(x)dx + \int_3^5 f(x)dx$.`,
      String.raw`Ta có:
$$\int_1^5 f(x)dx = \int_1^3 f(x)dx + \int_3^5 f(x)dx \Rightarrow \int_1^3 f(x)dx = ${k + 7} - ${k} = 7$$`
    ),

    createMcqItem(
      'th-semicircle-geo',
      'Thông hiểu',
      String.raw`*(Theo Bài 4.8b SGK & 4.11b SBT)* Sử dụng ý nghĩa hình học của tích phân, giá trị của tích phân $I = \int_{-${R}}^{${R}} \sqrt{${R * R} - x^2}dx$ bằng:`,
      String.raw`$\frac{${R * R}\pi}{2}$`,
      [
        String.raw`$${R * R}\pi$`,
        String.raw`$\frac{${R * R}\pi}{4}$`,
        String.raw`$${2 * R}\pi$`,
      ],
      String.raw`Đồ thị hàm số $y = \sqrt{${R * R} - x^2}$ trên đoạn $[-${R}; ${R}]$ là nửa đường tròn tâm $O(0; 0)$, bán kính $R = ${R}$ nằm phía trên trục hoành.`,
      String.raw`Vì $y = \sqrt{${R * R} - x^2} \ge 0 \Leftrightarrow x^2 + y^2 = ${R * R} \ (y \ge 0)$ biểu diễn nửa đường tròn tâm $O$, bán kính $R = ${R}$ nên tích phân $I$ chính bằng diện tích nửa hình tròn đó:
$$I = \frac{1}{2}\pi R^2 = \frac{${R * R}\pi}{2}$$`,
      {
        mode: '2d',
        title: `Nửa hình tròn y = sqrt(${R * R} - x^2) trên [-${R}; ${R}]`,
        fExpr: `sqrt(max(0, ${R * R} - x^2))`,
        defaultA: -R,
        defaultB: R,
      }
    ),

    createMcqItem(
      'th-trapezoid-geo',
      'Thông hiểu',
      String.raw`*(Theo Bài 4.8a SGK)* Sử dụng ý nghĩa hình học của tích phân, tính $I = \int_1^3 (2x + 1)dx$ thông qua diện tích hình thang vuông.`,
      String.raw`$10$`,
      [String.raw`$8$`, String.raw`$12$`, String.raw`$20$`],
      String.raw`Hình thang vuông giới hạn bởi $y = 2x + 1, y = 0, x = 1, x = 3$ có đáy nhỏ $f(1) = 3$, đáy lớn $f(3) = 7$ và chiều cao $h = 3 - 1 = 2$.`,
      String.raw`Tích phân $I$ bằng diện tích hình thang vuông có hai đáy $f(1) = 3$, $f(3) = 7$ và chiều cao $h = 3 - 1 = 2$:
$$I = \frac{(3 + 7)\cdot 2}{2} = 10$$`,
      {
        mode: '2d',
        title: 'Hình thang vuông y = 2x + 1 trên [1; 3]',
        fExpr: '2*x + 1',
        defaultA: 1,
        defaultB: 3,
      }
    ),

    createMcqItem(
      'th-abs-integral',
      'Thông hiểu',
      String.raw`*(Theo Bài 4.10c SGK & 4.14 SBT)* Tính tích phân có chứa dấu giá trị tuyệt đối $I = \int_0^3 |x - ${k === 4 ? 2 : k}|dx$.`,
      k === 2 || k === 4 ? String.raw`$\frac{5}{2}$` : String.raw`$\frac{9}{2}$`,
      k === 2 || k === 4
        ? [String.raw`$\frac{3}{2}$`, String.raw`$\frac{7}{2}$`, String.raw`$3$`]
        : [String.raw`$\frac{5}{2}$`, String.raw`$3$`, String.raw`$\frac{7}{2}$`],
      String.raw`Tìm nghiệm của biểu thức trong trị tuyệt đối trên đoạn $[0; 3]$ để tách tích phân thành các đoạn không đổi dấu.`,
      k === 2 || k === 4
        ? String.raw`Cho $x - 2 = 0 \Leftrightarrow x = 2 \in [0; 3]$. Ta tách cận tại $x = 2$:
$$I = \int_0^2 (2 - x)dx + \int_2^3 (x - 2)dx = 2 + \frac{1}{2} = \frac{5}{2}$$`
        : String.raw`Trên đoạn $[0; 3]$, ta có $x - 3 \le 0$ nên:
$$I = \int_0^3 (3 - x)dx = \left(3x - \frac{x^2}{2}\right)\Big|_0^3 = 9 - \frac{9}{2} = \frac{9}{2}$$`,
      {
        mode: '2d',
        title: `Đồ thị hàm trị tuyệt đối y = |x - ${k === 4 ? 2 : k}| trên [0; 3]`,
        fExpr: `abs(x - ${k === 4 ? 2 : k})`,
        defaultA: 0,
        defaultB: 3,
      }
    ),

    createMcqItem(
      'th-piecewise-integral',
      'Thông hiểu',
      String.raw`*(Theo Bài 4.15 SBT)* Cho hàm số $f(x) = \begin{cases} 2x + 1 & \text{khi } x \ge 1 \\ 3x^2 & \text{khi } x < 1 \end{cases}$. Giá trị của tích phân $I = \int_0^2 f(x)dx$ bằng:`,
      String.raw`$5$`,
      [String.raw`$4$`, String.raw`$6$`, String.raw`$7$`],
      String.raw`Tách cận tích phân tại điểm chuyển công thức $x = 1$: $I = \int_0^1 f(x)dx + \int_1^2 f(x)dx$.`,
      String.raw`Ta tách tích phân tại $x = 1$:
$$I = \int_0^1 3x^2 dx + \int_1^2 (2x + 1)dx = x^3\Big|_0^1 + (x^2 + x)\Big|_1^2 = 1 + (6 - 2) = 5$$`
    ),

    createMcqItem(
      'th-vol-sqrt-linear',
      'Thông hiểu',
      String.raw`*(Theo Bài 4.18 SBT & Ví dụ 7 SGK)* Thể tích khối tròn xoay sinh ra khi quay hình phẳng giới hạn bởi đồ thị $y = \sqrt{x^2 + ${k}}$, trục hoành và hai đường thẳng $x = 0, x = 1$ quanh trục $Ox$ bằng:`,
      String.raw`$\frac{${3 * k + 1}\pi}{3}$`,
      [
        String.raw`$\frac{${3 * k + 1}}{3}$`,
        String.raw`$\frac{${k + 1}\pi}{3}$`,
        String.raw`$${k + 1}\pi$`,
      ],
      String.raw`Áp dụng công thức $V = \pi\int_0^1 (\sqrt{x^2 + ${k}})^2 dx = \pi\int_0^1 (x^2 + ${k})dx$.`,
      String.raw`Thể tích khối tròn xoay cần tìm là:
$$V = \pi\int_0^1 \left(\sqrt{x^2 + ${k}}\right)^2 dx = \pi\int_0^1 (x^2 + ${k})dx = \pi\left(\frac{x^3}{3} + ${k}x\right)\Big|_0^1 = \frac{${3 * k + 1}\pi}{3}$$`,
      {
        mode: '3d',
        title: `Khối tròn xoay y = sqrt(x^2 + ${k}) trên [0; 1]`,
        fExpr: `sqrt(x^2 + ${k})`,
        defaultA: 0,
        defaultB: 1,
      }
    ),

    // --- NHÓM 3: MỨC ĐỘ VẬN DỤNG (BÁM SÁT BÀI TẬP SGK & SBT) ---
    createMcqItem(
      'vd-area-parabola-line',
      'Vận dụng',
      String.raw`*(Theo Bài 4.14a SGK & 4.22 SBT)* Diện tích hình phẳng giới hạn bởi parabol $y = x^2 - 2x$ và đường thẳng $y = x$ bằng:`,
      String.raw`$\frac{9}{2}$`,
      [
        String.raw`$\frac{9}{4}$`,
        String.raw`$\frac{7}{2}$`,
        String.raw`$9$`,
      ],
      String.raw`Bước 1: Giải phương trình hoành độ giao điểm $x^2 - 2x = x$ để tìm hai cận tích phân $a, b$. Bước 2: Tính $S = \int_a^b |(x^2 - 2x) - x|dx$.`,
      String.raw`Phương trình hoành độ giao điểm:
$$x^2 - 2x = x \Leftrightarrow x^2 - 3x = 0 \Leftrightarrow x = 0 \text{ hoặc } x = 3$$
Trên đoạn $[0; 3]$, đường thẳng $y = x$ nằm phía trên parabol $y = x^2 - 2x$ nên:
$$S = \int_0^3 (3x - x^2)dx = \left(\frac{3x^2}{2} - \frac{x^3}{3}\right)\Big|_0^3 = \frac{27}{2} - 9 = \frac{9}{2}$$`,
      {
        mode: '2d',
        title: 'Diện tích giới hạn bởi y = x^2 - 2x và y = x trên [0; 3]',
        fExpr: 'x^2 - 2*x',
        gExpr: 'x',
        defaultA: 0,
        defaultB: 3,
      }
    ),

    createMcqItem(
      'vd-area-cubic-3-roots',
      'Vận dụng',
      String.raw`*(Theo Bài 4.15 SGK & 4.23a SBT)* Tính diện tích hình phẳng giới hạn bởi đồ thị hàm số $y = x^3 - 3x$ và đường thẳng $y = x$.`,
      String.raw`$8$`,
      [String.raw`$4$`, String.raw`$0$`, String.raw`$16$`],
      String.raw`Giải phương trình hoành độ giao điểm $x^3 - 3x = x \Leftrightarrow x^3 - 4x = 0$ tìm được 3 nghiệm $x = -2; 0; 2$. Tách tích phân thành 2 đoạn $[-2; 0]$ và $[0; 2]$.`,
      String.raw`Phương trình hoành độ giao điểm:
$$x^3 - 3x = x \Leftrightarrow x^3 - 4x = 0 \Leftrightarrow x \in \{-2; 0; 2\}$$
Diện tích hình phẳng là:
$$S = \int_{-2}^0 (x^3 - 4x)dx + \int_0^2 (4x - x^3)dx = 4 + 4 = 8$$`,
      {
        mode: '2d',
        title: 'Diện tích giới hạn bởi y = x^3 - 3x và y = x trên [-2; 2]',
        fExpr: 'x^3 - 3*x',
        gExpr: 'x',
        defaultA: -2,
        defaultB: 2,
      }
    ),

    createMcqItem(
      'vd-area-exp',
      'Vận dụng',
      String.raw`*(Theo Bài 4.14b SGK)* Diện tích hình phẳng giới hạn bởi hai đồ thị hàm số $y = e^x, y = e^{-x}$ và hai đường thẳng $x = 0, x = 2$ bằng:`,
      String.raw`$e^2 + \frac{1}{e^2} - 2$`,
      [
        String.raw`$e^2 - \frac{1}{e^2}$`,
        String.raw`$e^2 + \frac{1}{e^2}$`,
        String.raw`$e^2 - \frac{1}{e^2} - 2$`,
      ],
      String.raw`Trên đoạn $[0; 2]$, ta luôn có $e^x \ge e^{-x}$ nên $S = \int_0^2 (e^x - e^{-x})dx$.`,
      String.raw`Vì với mọi $x \in [0; 2]$ ta có $e^x \ge e^{-x}$ nên diện tích hình phẳng là:
$$S = \int_0^2 (e^x - e^{-x})dx = (e^x + e^{-x})\Big|_0^2 = \left(e^2 + \frac{1}{e^2}\right) - (1 + 1) = e^2 + \frac{1}{e^2} - 2$$`,
      {
        mode: '2d',
        title: 'Diện tích giới hạn bởi y = e^x và y = e^(-x) trên [0; 2]',
        fExpr: 'exp(x)',
        gExpr: 'exp(-x)',
        defaultA: 0,
        defaultB: 2,
      }
    ),

    createMcqItem(
      'vd-vol-parabola-417',
      'Vận dụng',
      String.raw`*(Bài 4.17 SGK)* Thể tích của khối tròn xoay sinh ra khi quay hình phẳng giới hạn bởi các đường $y = 2x - x^2, y = 0, x = 0, x = 2$ xung quanh trục $Ox$ bằng:`,
      String.raw`$\frac{16\pi}{15}$`,
      [
        String.raw`$\frac{16}{15}$`,
        String.raw`$\frac{4\pi}{3}$`,
        String.raw`$\frac{32\pi}{15}$`,
      ],
      String.raw`Áp dụng công thức $V = \pi\int_0^2 (2x - x^2)^2 dx$, khai triển hằng đẳng thức $(2x - x^2)^2 = 4x^2 - 4x^3 + x^4$.`,
      String.raw`Ta có:
$$V = \pi\int_0^2 (2x - x^2)^2 dx = \pi\int_0^2 (4x^2 - 4x^3 + x^4)dx = \pi\left(\frac{4}{3}x^3 - x^4 + \frac{x^5}{5}\right)\Big|_0^2 = \frac{16\pi}{15}$$`,
      {
        mode: '3d',
        title: 'Bài 4.17 SGK: Khối tròn xoay y = 2x - x^2 trên [0; 2]',
        fExpr: '2*x - x^2',
        defaultA: 0,
        defaultB: 2,
      }
    ),

    createMcqItem(
      'vd-vol-washer-sbt424b',
      'Vận dụng',
      String.raw`*(Bài 4.24b SBT)* Gọi $(H)$ là hình phẳng giới hạn bởi đồ thị hai hàm số $y = 4x$ và $y = x^3$ với $0 \le x \le 2$. Thể tích khối tròn xoay sinh ra khi quay $(H)$ quanh trục $Ox$ bằng:`,
      String.raw`$\frac{512\pi}{21}$`,
      [
        String.raw`$\frac{256\pi}{21}$`,
        String.raw`$\frac{512}{21}$`,
        String.raw`$4\pi$`,
      ],
      String.raw`Trên đoạn $[0; 2]$, hai đồ thị $y = 4x$ và $y = x^3$ đều không âm và $4x \ge x^3$, nên thể tích khối tròn xoay là hiệu thể tích hai khối: $V = \pi\int_0^2 [(4x)^2 - (x^3)^2]dx$.`,
      String.raw`Trên đoạn $[0; 2]$, ta có $4x \ge x^3 \ge 0$. Thể tích khối tròn xoay là:
$$V = \pi\int_0^2 \left[(4x)^2 - (x^3)^2\right]dx = \pi\int_0^2 (16x^2 - x^6)dx = \pi\left(\frac{16x^3}{3} - \frac{x^7}{7}\right)\Big|_0^2 = \frac{512\pi}{21}$$`,
      {
        mode: '3d',
        title: 'Bài 4.24b SBT: Quay miền giữa y = 4x và y = x^3 trên [0; 2]',
        fExpr: '4*x',
        gExpr: 'x^3',
        defaultA: 0,
        defaultB: 2,
      }
    ),

    createMcqItem(
      'vd-vol-trig-cos',
      'Vận dụng',
      String.raw`*(Bài 4.26a SGK)* Thể tích khối tròn xoay sinh ra khi quay hình phẳng giới hạn bởi các đường $y = \sqrt{\cos x}, y = 0, x = 0, x = \frac{\pi}{2}$ xung quanh trục $Ox$ bằng:`,
      String.raw`$\pi$`,
      [
        String.raw`$\frac{\pi}{2}$`,
        String.raw`$\pi^2$`,
        String.raw`$1$`,
      ],
      String.raw`Áp dụng công thức $V = \pi\int_0^{\pi/2} (\sqrt{\cos x})^2 dx = \pi\int_0^{\pi/2} \cos x dx$.`,
      String.raw`Ta có:
$$V = \pi\int_0^{\pi/2} (\sqrt{\cos x})^2 dx = \pi\int_0^{\pi/2} \cos x dx = \pi\sin x\Big|_0^{\pi/2} = \pi(1 - 0) = \pi$$`,
      {
        mode: '3d',
        title: 'Bài 4.26a SGK: Khối tròn xoay y = sqrt(cos(x)) trên [0; pi/2]',
        fExpr: 'sqrt(max(0, cos(x)))',
        defaultA: 0,
        defaultB: 1.57,
      }
    ),

    createMcqItem(
      'vd-vol-cross-square',
      'Vận dụng',
      String.raw`*(Bài 4.26b SBT)* Một vật thể nằm giữa hai mặt phẳng $x = -2$ và $x = 2$, có đáy là hình tròn $x^2 + y^2 \le 4$. Biết thiết diện của vật thể bị cắt bởi mặt phẳng vuông góc với trục $Ox$ tại điểm có hoành độ $x \in [-2; 2]$ là một hình vuông. Thể tích của vật thể đó bằng:`,
      String.raw`$\frac{128}{3}$`,
      [
        String.raw`$\frac{128\pi}{3}$`,
        String.raw`$\frac{32}{3}$`,
        String.raw`$\frac{64\pi}{3}$`,
      ],
      String.raw`Tại hoành độ $x \in [-2; 2]$, dây cung của đường tròn $x^2 + y^2 = 4$ có độ dài là $a(x) = 2\sqrt{4 - x^2}$. Vì thiết diện là hình vuông cạnh $a(x)$ nên diện tích mặt cắt là $S(x) = a^2(x) = 4(4 - x^2)$. Áp dụng $V = \int_{-2}^2 S(x)dx$ (không có $\pi$).`,
      String.raw`Cạnh của thiết diện hình vuông tại hoành độ $x$ là $a(x) = 2\sqrt{4 - x^2}$, suy ra diện tích mặt cắt là $S(x) = 4(4 - x^2)$.
Thể tích vật thể là:
$$V = \int_{-2}^2 4(4 - x^2)dx = 4\left(4x - \frac{x^3}{3}\right)\Big|_{-2}^2 = \frac{128}{3}$$`,
      {
        mode: '2d',
        title: 'Bài 4.26b SBT: Hàm diện tích thiết diện S(x) = 4(4 - x^2) trên [-2; 2]',
        fExpr: '4*(4 - x^2)',
        defaultA: -2,
        defaultB: 2,
      }
    ),

    createMcqItem(
      'vd-kinematics-sgk411',
      'Vận dụng',
      String.raw`*(Bài 4.11 SGK)* Một vật chuyển động dọc theo một đường thẳng với vận tốc $v(t) = t^2 - t - 6 \text{ (m/s)}$ trong khoảng thời gian $1 \le t \le 4$. Tổng quãng đường vật đi được trong khoảng thời gian đó bằng:`,
      String.raw`$\frac{61}{6}\text{ (m)}$`,
      [
        String.raw`$-\frac{9}{2}\text{ (m)}$`,
        String.raw`$\frac{9}{2}\text{ (m)}$`,
        String.raw`$\frac{49}{6}\text{ (m)}$`,
      ],
      String.raw`Phân biệt rõ: Độ dịch chuyển là $\int_1^4 v(t)dt$, còn **Tổng quãng đường đi được** là $s = \int_1^4 |v(t)|dt$. Giải $t^2 - t - 6 = 0 \Leftrightarrow t = 3 \in [1; 4]$ để tách cận.`,
      String.raw`Trên đoạn $[1; 4]$, phương trình $v(t) = 0 \Leftrightarrow t^2 - t - 6 = 0 \Leftrightarrow t = 3$.
Tổng quãng đường vật đi được là:
$$s = \int_1^4 |t^2 - t - 6|dt = -\int_1^3 (t^2 - t - 6)dt + \int_3^4 (t^2 - t - 6)dt = \frac{22}{3} + \frac{17}{6} = \frac{61}{6}\text{ (m)}$$`,
      {
        mode: '2d',
        title: 'Bài 4.11 SGK: Đồ thị vận tốc v(t) = t^2 - t - 6 trên [1; 4]',
        fExpr: 'x^2 - x - 6',
        defaultA: 1,
        defaultB: 4,
      }
    ),

    // --- NHÓM 4: MỨC ĐỘ VẬN DỤNG CAO (BÀI TOÁN THỰC TIỄN SGK & SBT) ---
    createMcqItem(
      'vdc-vase-sgk435',
      'Vận dụng cao',
      String.raw`*(Bài 4.35 SGK)* Một nghệ nhân làm một chiếc bình gốm có mặt trong sinh ra khi quay đồ thị hàm số $y = \frac{1}{175}x^2 + \frac{3}{35}x + 5 \ (0 \le x \le 30)$ ($x, y$ tính theo $\text{cm}$) quanh trục $Ox$. Biết bình gốm có độ dày không đổi là $1\text{ cm}$, thể tích đất sét cần sử dụng để làm thân bình gốm là:`,
      String.raw`$510\pi\text{ (cm}^3\text{)}$`,
      [
        String.raw`$480\pi\text{ (cm}^3\text{)}$`,
        String.raw`$30\pi\text{ (cm}^3\text{)}$`,
        String.raw`$540\pi\text{ (cm}^3\text{)}$`,
      ],
      String.raw`Do bình gốm dày đều $1\text{ cm}$ nên đường sinh mặt ngoài là $R_{\text{ngoài}}(x) = \frac{1}{175}x^2 + \frac{3}{35}x + 6$. Thể tích đất sét là hiệu thể tích khối tròn xoay ngoài và khối lòng trong: $V = \pi\int_0^{30} [R_{\text{ngoài}}^2(x) - R_{\text{trong}}^2(x)]dx$.`,
      String.raw`Bán kính mặt trong là $R_1(x) = \frac{1}{175}x^2 + \frac{3}{35}x + 5$ và bán kính mặt ngoài là $R_2(x) = \frac{1}{175}x^2 + \frac{3}{35}x + 6$.
Thể tích đất sét cần dùng là:
$$V = \pi\int_0^{30} \left[R_2^2(x) - R_1^2(x)\right]dx = \pi\int_0^{30} \left(\frac{2}{175}x^2 + \frac{6}{35}x + 11\right)dx = 510\pi\text{ (cm}^3\text{)}$$`,
      {
        mode: '3d',
        title: 'Bài 4.35 SGK: Mô phỏng 3D Bình gốm trên [0; 30]',
        fExpr: '(1/175)*x^2 + (3/35)*x + 6',
        defaultA: 0,
        defaultB: 30,
      }
    ),

    createMcqItem(
      'vdc-spherical-cap-sgk418',
      'Vận dụng cao',
      String.raw`*(Bài 4.18 SGK)* Quay hình phẳng giới hạn bởi cung tròn $y = \sqrt{R^2 - x^2}$, trục hoành $Ox$ và hai đường thẳng $x = R - h, x = R \ (0 < h < R)$ xung quanh trục $Ox$ ta thu được một khối chỏm cầu có chiều cao $h$. Công thức thể tích khối chỏm cầu đó là:`,
      String.raw`$V = \pi h^2\left(R - \frac{h}{3}\right)$`,
      [
        String.raw`$V = \pi R^2\left(h - \frac{R}{3}\right)$`,
        String.raw`$V = \frac{4}{3}\pi R^2 h$`,
        String.raw`$V = \pi h^2\left(R + \frac{h}{3}\right)$`,
      ],
      String.raw`Thiết lập tích phân $V = \pi\int_{R-h}^R (R^2 - x^2)dx$, tính nguyên hàm theo biến $x$ rồi thay cận từ $R - h$ đến $R$.`,
      String.raw`Áp dụng công thức thể tích khối tròn xoay:
$$V = \pi\int_{R-h}^R (R^2 - x^2)dx = \pi\left(R^2 x - \frac{x^3}{3}\right)\Big|_{R-h}^R = \pi h^2\left(R - \frac{h}{3}\right)$$`,
      {
        mode: '3d',
        title: 'Bài 4.18 SGK: Khối chỏm cầu bán kính R = 3 trên [1; 3]',
        fExpr: 'sqrt(max(0, 9 - x^2))',
        defaultA: 1,
        defaultB: 3,
      }
    ),

    createMcqItem(
      'vdc-lorenz-gini-sgk416',
      'Vận dụng cao',
      String.raw`*(Bài 4.16 SGK)* Trong kinh tế học, đường cong Lorenz $y = L(x)$ biểu diễn tỉ lệ thu nhập tích lũy của $x \ (0 \le x \le 1)$ phần trăm hộ gia đình. Hệ số bất bình đẳng thu nhập Gini được tính bởi $G = 2\int_0^1 [x - L(x)]dx$. Nếu đường cong Lorenz của một quốc gia là $L(x) = x^2$ thì hệ số Gini bằng:`,
      String.raw`$\frac{1}{3}$`,
      [
        String.raw`$\frac{1}{6}$`,
        String.raw`$\frac{2}{3}$`,
        String.raw`$\frac{1}{2}$`,
      ],
      String.raw`Thay $L(x) = x^2$ vào công thức $G = 2\int_0^1 (x - x^2)dx$ và tính tích phân trên đoạn $[0; 1]$.`,
      String.raw`Thay $L(x) = x^2$ vào công thức hệ số bất bình đẳng Gini:
$$G = 2\int_0^1 (x - x^2)dx = 2\left(\frac{x^2}{2} - \frac{x^3}{3}\right)\Big|_0^1 = 2\cdot\frac{1}{6} = \frac{1}{3}$$`,
      {
        mode: '2d',
        title: 'Bài 4.16 SGK: Đường cong Lorenz L(x) = x^2 và đường bình đẳng y = x',
        fExpr: 'x',
        gExpr: 'x^2',
        defaultA: 0,
        defaultB: 1,
      }
    ),

    createMcqItem(
      'vdc-divide-area-sbt444',
      'Vận dụng cao',
      String.raw`*(Bài 4.44 SBT)* Cho hình phẳng $(H)$ giới hạn bởi đồ thị hàm số $y = \sqrt{x}$, trục hoành và đường thẳng $x = 4$. Đường thẳng $x = m \ (0 < m < 4)$ chia hình phẳng $(H)$ thành hai phần có diện tích bằng nhau. Giá trị của $m$ bằng:`,
      String.raw`$2\sqrt[3]{2}$`,
      [
        String.raw`$2$`,
        String.raw`$2\sqrt{2}$`,
        String.raw`$\sqrt[3]{16}$`,
      ],
      String.raw`Tính diện tích toàn bộ hình phẳng $S = \int_0^4 \sqrt{x}dx = \frac{16}{3}$. Đường thẳng $x = m$ chia đôi diện tích khi $\int_0^m \sqrt{x}dx = \frac{1}{2}S = \frac{8}{3}$.`,
      String.raw`Ta có diện tích hình phẳng trên $[0; m]$ bằng một nửa diện tích trên $[0; 4]$:
$$\int_0^m \sqrt{x}dx = \frac{1}{2}\int_0^4 \sqrt{x}dx \Leftrightarrow \frac{2}{3}m^{\frac{3}{2}} = \frac{1}{2}\cdot\frac{2}{3}\cdot 4^{\frac{3}{2}} \Leftrightarrow m^{\frac{3}{2}} = 4 \Leftrightarrow m = 4^{\frac{2}{3}} = 2\sqrt[3]{2}$$`,
      {
        mode: '2d',
        title: 'Bài 4.44 SBT: Đường thẳng x = m chia đôi diện tích hình phẳng y = sqrt(x)',
        fExpr: 'sqrt(max(0, x))',
        defaultA: 0,
        defaultB: 2.52,
      }
    ),

    createMcqItem(
      'vdc-salmon-sgk431',
      'Vận dụng cao',
      String.raw`*(Bài 4.31 SGK)* Cá hồi Thái Bình Dương bơi ngược dòng để đẻ trứng. Khoa học đã chứng minh vận tốc bơi của cá khi nước đứng yên là $v(u) = -\frac{1}{8}u^2 + \frac{5}{2}u \text{ (km/h)}$, trong đó $u$ là nồng độ chất kích thích sinh học. Nếu vận tốc dòng nước chảy ngược là $5\text{ km/h}$, giá trị trung bình của vận tốc thực tế của cá hồi trên đoạn $u \in [2; 10]$ gần nhất với kết quả nào?`,
      String.raw`$4,83\text{ km/h}$`,
      [
        String.raw`$9,83\text{ km/h}$`,
        String.raw`$6,50\text{ km/h}$`,
        String.raw`$3,25\text{ km/h}$`,
      ],
      String.raw`Vận tốc thực tế khi bơi ngược dòng là $v_{\text{thực}}(u) = v(u) - 5$. Giá trị trung bình của hàm số trên đoạn $[a; b]$ là $\frac{1}{b - a}\int_a^b v_{\text{thực}}(u)du$.`,
      String.raw`Vận tốc thực tế của cá hồi khi bơi ngược dòng là $v_{\text{thực}}(u) = -\frac{1}{8}u^2 + \frac{5}{2}u - 5$.
Giá trị trung bình trên đoạn $[2; 10]$ là:
$$\bar{v} = \frac{1}{10 - 2}\int_2^{10} \left(-\frac{1}{8}u^2 + \frac{5}{2}u - 5\right)du = \frac{29}{6} \approx 4,83\text{ (km/h)}$$`,
      {
        mode: '2d',
        title: 'Bài 4.31 SGK: Vận tốc bơi ngược dòng của cá hồi trên [2; 10]',
        fExpr: '-(1/8)*x^2 + 2.5*x - 5',
        defaultA: 2,
        defaultB: 10,
      }
    ),
  ];

  // --- NGÂN HÀNG CÂU HỎI TRẢ LỜI NGẮN (ĐIỀN ĐÁP SỐ - PHẦN II) ---
  const shortPool: BankItem[] = [
    {
      bankKey: 'short-bullet-sgk47',
      part: 'short',
      level: 'Vận dụng',
      questionLatex: String.raw`*(Theo Bài 4.7 SGK & 4.8 SBT)* Một viên đạn được bắn thẳng đứng lên trên từ mặt đất (độ cao $s(0) = 0\text{ m}$) với vận tốc ban đầu $v_0 = 29,4\text{ m/s}$. Biết vận tốc của viên đạn tại thời điểm $t$ giây là $v(t) = 29,4 - 9,8t\text{ (m/s)}$. Độ cao lớn nhất mà viên đạn đạt được là bao nhiêu mét?`,
      shortAnswer: 44.1,
      tolerance: 0.05,
      unitHint: 'Đơn vị: mét (VD: 44,1)',
      thinkingHint: String.raw`Bước 1: Viên đạn đạt độ cao lớn nhất khi vận tốc bằng $0$: giải $v(t) = 29,4 - 9,8t = 0$ tìm thời điểm $t$. Bước 2: Tính độ cao lớn nhất $h_{\max} = \int_0^t (29,4 - 9,8u)du$.`,
      detailedSolution: String.raw`Viên đạn đạt độ cao cực đại khi $v(t) = 0 \Leftrightarrow 29,4 - 9,8t = 0 \Leftrightarrow t = 3\text{ (s)}$.
Độ cao lớn nhất mà viên đạn đạt được là:
$$h_{\max} = \int_0^3 (29,4 - 9,8t)dt = \left(29,4t - 4,9t^2\right)\Big|_0^3 = 88,2 - 44,1 = 44,1\text{ (m)}$$
**Đáp số:** $44,1$.`,
      geogebra: {
        mode: '2d',
        title: 'Bài 4.7 SGK: Vận tốc viên đạn v(t) = 29,4 - 9,8t trên [0; 3]',
        fExpr: '29.4 - 9.8*x',
        defaultA: 0,
        defaultB: 3,
      },
    },
    {
      bankKey: 'short-profit-sgk412',
      part: 'short',
      level: 'Vận dụng',
      questionLatex: String.raw`*(Theo Bài 4.12 SGK & 4.17 SBT)* Giả sử doanh thu biên và chi phí biên của một xưởng sản xuất lần lượt là $R'(t) = 20 - 2t$ và $C'(t) = 4 + 0,4t$ (tính bằng triệu đồng/tuần). Tính tổng lợi nhuận thu được của xưởng trong $5$ tuần đầu tiên (từ $t = 0$ đến $t = 5$, đơn vị: triệu đồng).`,
      shortAnswer: 50,
      tolerance: 0.05,
      unitHint: 'Đơn vị: triệu đồng',
      thinkingHint: String.raw`Lợi nhuận biên là $P'(t) = R'(t) - C'(t) = 16 - 2,4t$. Tổng lợi nhuận trong $5$ tuần đầu là $P = \int_0^5 [R'(t) - C'(t)]dt$.`,
      detailedSolution: String.raw`Tổng lợi nhuận thu được từ $t = 0$ đến $t = 5$ là:
$$P = \int_0^5 \left[(20 - 2t) - (4 + 0,4t)\right]dt = \int_0^5 (16 - 2,4t)dt = \left(16t - 1,2t^2\right)\Big|_0^5 = 80 - 30 = 50\text{ (triệu đồng)}$$
**Đáp số:** $50$.`,
      geogebra: {
        mode: '2d',
        title: 'Bài 4.12 SGK: Doanh thu biên R(t) và Chi phí biên C(t) trên [0; 5]',
        fExpr: '20 - 2*x',
        gExpr: '4 + 0.4*x',
        defaultA: 0,
        defaultB: 5,
      },
    },
    {
      bankKey: 'short-gate-arch-sbt428',
      part: 'short',
      level: 'Vận dụng',
      questionLatex: String.raw`*(Theo Vận dụng Bài 13 SGK & Bài 4.28 SBT)* Một chiếc cổng hình parabol có chiều rộng chân cổng là $4\text{ m}$ và chiều cao tại đỉnh cổng là $4\text{ m}$. Chọn hệ trục tọa độ $Oxy$ sao cho vòm cổng có phương trình $y = 4 - x^2$ với $-2 \le x \le 2$. Tính diện tích của chiếc cổng đó (làm tròn đến hàng phần trăm, đơn vị: $\text{m}^2$).`,
      shortAnswer: 10.67,
      tolerance: 0.05,
      unitHint: 'Làm tròn 2 chữ số thập phân (VD: 10,67)',
      thinkingHint: String.raw`Diện tích chiếc cổng parabol được tính bởi tích phân $S = \int_{-2}^2 (4 - x^2)dx$.`,
      detailedSolution: String.raw`Diện tích của chiếc cổng hình parabol là:
$$S = \int_{-2}^2 (4 - x^2)dx = \left(4x - \frac{x^3}{3}\right)\Big|_{-2}^2 = \frac{32}{3} \approx 10,67\text{ (m}^2\text{)}$$
**Đáp số:** $10,67$.`,
      geogebra: {
        mode: '2d',
        title: 'Bài 4.28 SBT: Cổng Parabol y = 4 - x^2 trên [-2; 2]',
        fExpr: '4 - x^2',
        defaultA: -2,
        defaultB: 2,
      },
    },
    {
      bankKey: 'short-surplus-sbt427',
      part: 'short',
      level: 'Vận dụng cao',
      questionLatex: String.raw`*(Theo Vận dụng 1 Bài 13 SGK & Bài 4.27 SBT)* Cho hàm cầu của một mặt hàng là $p = D(q) = 50 - 0,5q^2$ và mức sản lượng cân bằng thị trường là $q_0 = 6$ (tương ứng mức giá cân bằng $p_0 = D(6) = 32$). Tính **thặng dư tiêu dùng** $CS = \int_0^{q_0} [D(q) - p_0]dq$.`,
      shortAnswer: 72,
      tolerance: 0.05,
      unitHint: 'Nhập số nguyên',
      thinkingHint: String.raw`Thay $q_0 = 6$ và $p_0 = 32$ vào công thức thặng dư tiêu dùng: $CS = \int_0^6 [(50 - 0,5q^2) - 32]dq = \int_0^6 (18 - 0,5q^2)dq$.`,
      detailedSolution: String.raw`Thặng dư tiêu dùng tại mức sản lượng $q_0 = 6$ và giá $p_0 = 32$ là:
$$CS = \int_0^6 \left(50 - 0,5q^2 - 32\right)dq = \int_0^6 \left(18 - 0,5q^2\right)dq = \left(18q - \frac{q^3}{6}\right)\Big|_0^6 = 108 - 36 = 72$$
**Đáp số:** $72$.`,
      geogebra: {
        mode: '2d',
        title: 'Bài 4.27 SBT: Thặng dư tiêu dùng giữa D(q) = 50 - 0,5q^2 và p0 = 32',
        fExpr: '50 - 0.5*x^2',
        gExpr: '32',
        defaultA: 0,
        defaultB: 6,
      },
    },
    {
      bankKey: 'short-vaccine-sbt430',
      part: 'short',
      level: 'Vận dụng cao',
      questionLatex: String.raw`*(Theo Bài 4.30 SBT)* Nếu không có vắc xin, tốc độ phát sinh ca nhiễm mới của một dịch bệnh là $f(t) = 30t - t^2$ (người/ngày); khi tiêm vắc xin, tốc độ ca nhiễm mới giảm xuống còn $g(t) = 15t - 0,5t^2$ (người/ngày), với $t$ là số ngày tính từ lúc bắt đầu dịch. Trong $20$ ngày đầu ($0 \le t \le 20$), vắc xin đã giúp giảm được bao nhiêu ca nhiễm bệnh?`,
      shortAnswer: 1666.67,
      tolerance: 0.5,
      unitHint: 'Làm tròn đến hàng phần trăm (VD: 1666,67)',
      thinkingHint: String.raw`Số ca nhiễm giảm được nhờ vắc xin bằng diện tích miền giới hạn giữa hai đồ thị tốc độ trên $[0; 20]$: $\Delta N = \int_0^{20} [f(t) - g(t)]dt$.`,
      detailedSolution: String.raw`Số ca nhiễm bệnh giảm được trong $20$ ngày đầu là:
$$\Delta N = \int_0^{20} \left[(30t - t^2) - (15t - 0,5t^2)\right]dt = \int_0^{20} (15t - 0,5t^2)dt = \left(\frac{15t^2}{2} - \frac{t^3}{6}\right)\Big|_0^{20} = \frac{5000}{3} \approx 1666,67$$
**Đáp số:** $1666,67$.`,
      geogebra: {
        mode: '2d',
        title: 'Bài 4.30 SBT: Hiệu quả vắc xin giữa f(t) và g(t) trên [0; 20]',
        fExpr: '30*x - x^2',
        gExpr: '15*x - 0.5*x^2',
        defaultA: 0,
        defaultB: 20,
      },
    },
    {
      bankKey: 'short-bacteria-sgk432',
      part: 'short',
      level: 'Vận dụng',
      questionLatex: String.raw`*(Theo Bài 4.32 SGK & 4.40 SBT)* Một quần thể vi khuẩn ban đầu có $1000$ cá thể. Tốc độ tăng trưởng của quần thể tại thời điểm $t$ giờ được cho bởi $N'(t) = 100t + 200$ (con/giờ). Hỏi sau $4$ giờ, số lượng vi khuẩn trong quần thể là bao nhiêu con?`,
      shortAnswer: 2600,
      tolerance: 0.5,
      unitHint: 'Đơn vị: con',
      thinkingHint: String.raw`Số lượng vi khuẩn tại thời điểm $t = 4$ là $N(4) = N(0) + \int_0^4 N'(t)dt = 1000 + \int_0^4 (100t + 200)dt$.`,
      detailedSolution: String.raw`Số lượng vi khuẩn tăng thêm sau $4$ giờ là:
$$\Delta N = \int_0^4 (100t + 200)dt = (50t^2 + 200t)\Big|_0^4 = 800 + 800 = 1600\text{ (con)}$$
Tổng số lượng vi khuẩn sau $4$ giờ là:
$$N(4) = 1000 + 1600 = 2600\text{ (con)}$$
**Đáp số:** $2600$.`,
    },
    {
      bankKey: 'short-blood-sgk413',
      part: 'short',
      level: 'Vận dụng',
      questionLatex: String.raw`*(Theo Bài 4.13 SGK)* Giả sử lưu lượng máu chảy qua mặt cắt động mạch trong khoảng thời gian từ $t = 0$ đến $t = 3$ giây có tốc độ $F(t) = 3t^2 + 2t + 1 \text{ (cm}^3\text{/s)}$. Tổng thể tích máu chảy qua mặt cắt đó trong $3$ giây đầu là bao nhiêu $\text{cm}^3$?`,
      shortAnswer: 39,
      tolerance: 0.05,
      unitHint: 'Đơn vị: cm^3',
      thinkingHint: String.raw`Tổng lượng máu chảy qua mặt cắt trong khoảng thời gian $[0; 3]$ là $V = \int_0^3 F(t)dt$.`,
      detailedSolution: String.raw`Tổng thể tích máu chảy qua mặt cắt trong $3$ giây đầu là:
$$V = \int_0^3 (3t^2 + 2t + 1)dt = (t^3 + t^2 + t)\Big|_0^3 = 27 + 9 + 3 = 39\text{ (cm}^3\text{)}$$
**Đáp số:** $39$.`,
    },
    {
      bankKey: 'short-cone-vol-sgk419',
      part: 'short',
      level: 'Vận dụng',
      questionLatex: String.raw`*(Theo Bài 4.19 SGK)* Quay hình tam giác vuông giới hạn bởi đường thẳng $y = \frac{1}{2}x$, trục hoành $Ox$ và đường thẳng $x = 6$ xung quanh trục $Ox$ ta được một khối nón. Biết thể tích khối nón có dạng $V = a\pi$. Giá trị của $a$ bằng bao nhiêu?`,
      shortAnswer: 18,
      tolerance: 0.05,
      unitHint: 'Chỉ nhập hệ số a đứng trước pi',
      thinkingHint: String.raw`Áp dụng công thức thể tích khối tròn xoay: $V = \pi\int_0^6 \left(\frac{1}{2}x\right)^2 dx = \pi\int_0^6 \frac{x^2}{4}dx$.`,
      detailedSolution: String.raw`Thể tích khối nón tròn xoay là:
$$V = \pi\int_0^6 \frac{x^2}{4}dx = \pi\cdot\frac{x^3}{12}\Big|_0^6 = \frac{216\pi}{12} = 18\pi$$
Vậy $a = 18$.
**Đáp số:** $18$.`,
      geogebra: {
        mode: '3d',
        title: 'Bài 4.19 SGK: Khối nón sinh bởi y = 0,5x trên [0; 6]',
        fExpr: '0.5*x',
        defaultA: 0,
        defaultB: 6,
      },
    },
    {
      bankKey: 'short-toy-car-sbt448',
      part: 'short',
      level: 'Vận dụng cao',
      questionLatex: String.raw`*(Theo Bài 4.48 SBT)* Một ô tô đồ chơi chuyển động trên đường thẳng có gia tốc phụ thuộc thời gian theo công thức $a(t) = 6t - 12 \text{ (m/s}^2\text{)}$. Biết vận tốc ban đầu $v(0) = 9\text{ m/s}$. Tính độ dịch chuyển của ô tô trong $3$ giây đầu tiên (từ $t = 0$ đến $t = 3$, đơn vị: mét).`,
      shortAnswer: 0,
      tolerance: 0.05,
      unitHint: 'Đơn vị: mét',
      thinkingHint: String.raw`Bước 1: Tìm hàm vận tốc $v(t) = \int a(t)dt = 3t^2 - 12t + C$, dùng $v(0) = 9 \Rightarrow C = 9$. Bước 2: Độ dịch chuyển trên $[0; 3]$ là $\Delta s = \int_0^3 v(t)dt$.`,
      detailedSolution: String.raw`Ta có $v(t) = \int (6t - 12)dt = 3t^2 - 12t + C$. Do $v(0) = 9$ nên $C = 9 \Rightarrow v(t) = 3t^2 - 12t + 9$.
Độ dịch chuyển của ô tô trong $3$ giây đầu là:
$$\Delta s = \int_0^3 (3t^2 - 12t + 9)dt = (t^3 - 6t^2 + 9t)\Big|_0^3 = 27 - 54 + 27 = 0\text{ (m)}$$
**Đáp số:** $0$.`,
      geogebra: {
        mode: '2d',
        title: 'Bài 4.48 SBT: Đồ thị vận tốc v(t) = 3t^2 - 12t + 9 trên [0; 3]',
        fExpr: '3*x^2 - 12*x + 9',
        defaultA: 0,
        defaultB: 3,
      },
    },
  ];

  // Bổ sung thêm các bài tập còn lại trong EXERCISES_DATA (SGK & SBT) được chuyển hóa thành câu hỏi trắc nghiệm
  const extraMcqFromExercises: BankItem[] = [
    createMcqItem(
      'ex-sgk-410a',
      'Thông hiểu',
      String.raw`*(Bài 4.10a SGK)* Tính tích phân $I = \int_1^2 \frac{x^3 - 2x^2 + 1}{x^2}dx$.`,
      String.raw`$0$`,
      [String.raw`$1$`, String.raw`$\frac{1}{2}$`, String.raw`$-\frac{1}{2}$`],
      String.raw`Chia tử cho mẫu: $\frac{x^3 - 2x^2 + 1}{x^2} = x - 2 + \frac{1}{x^2}$, sau đó áp dụng công thức Newton – Leibniz trên $[1; 2]$.`,
      String.raw`Ta có:
$$I = \int_1^2 \left(x - 2 + \frac{1}{x^2}\right)dx = \left(\frac{x^2}{2} - 2x - \frac{1}{x}\right)\Big|_1^2 = \left(2 - 4 - \frac{1}{2}\right) - \left(\frac{1}{2} - 2 - 1\right) = 0$$`
    ),
    createMcqItem(
      'ex-sgk-410b',
      'Thông hiểu',
      String.raw`*(Bài 4.10b SGK)* Giá trị của tích phân $I = \int_0^1 (2^x + 3e^x)dx$ bằng:`,
      String.raw`$\frac{1}{\ln 2} + 3e - 3$`,
      [
        String.raw`$\ln 2 + 3e - 3$`,
        String.raw`$\frac{2}{\ln 2} + 3e$`,
        String.raw`$\frac{1}{\ln 2} + 3e$`,
      ],
      String.raw`Áp dụng $\int 2^x dx = \frac{2^x}{\ln 2} + C$ và $\int 3e^x dx = 3e^x + C$.`,
      String.raw`Ta có:
$$I = \left(\frac{2^x}{\ln 2} + 3e^x\right)\Big|_0^1 = \left(\frac{2}{\ln 2} + 3e\right) - \left(\frac{1}{\ln 2} + 3\right) = \frac{1}{\ln 2} + 3e - 3$$`
    ),
    createMcqItem(
      'ex-sbt-422c',
      'Vận dụng',
      String.raw`*(Bài 4.22c SBT)* Diện tích hình phẳng giới hạn bởi đồ thị hàm số $y = x^2 - 4x + 3$, trục hoành và hai đường thẳng $x = 0, x = 3$ bằng:`,
      String.raw`$\frac{8}{3}$`,
      [String.raw`$\frac{4}{3}$`, String.raw`$0$`, String.raw`$4$`],
      String.raw`Giải phương trình $x^2 - 4x + 3 = 0 \Leftrightarrow x = 1; x = 3$. Tách tích phân trên $[0; 1]$ (dương) và $[1; 3]$ (âm).`,
      String.raw`Phương trình $x^2 - 4x + 3 = 0 \Leftrightarrow x = 1$ hoặc $x = 3$.
Diện tích hình phẳng là:
$$S = \int_0^1 (x^2 - 4x + 3)dx - \int_1^3 (x^2 - 4x + 3)dx = \frac{4}{3} + \frac{4}{3} = \frac{8}{3}$$`,
      {
        mode: '2d',
        title: 'Bài 4.22c SBT: Diện tích y = x^2 - 4x + 3 trên [0; 3]',
        fExpr: 'x^2 - 4*x + 3',
        defaultA: 0,
        defaultB: 3,
      }
    ),
    createMcqItem(
      'ex-sgk-425b',
      'Vận dụng',
      String.raw`*(Bài 4.25b SGK)* Diện tích hình phẳng giới hạn bởi đồ thị hai hàm số $y = x^2, y = 2 - x$ và hai đường thẳng $x = 0, x = 2$ bằng:`,
      String.raw`$3$`,
      [
        String.raw`$\frac{7}{6}$`,
        String.raw`$\frac{11}{6}$`,
        String.raw`$\frac{8}{3}$`,
      ],
      String.raw`Giải phương trình $x^2 = 2 - x \Leftrightarrow x = 1 \in (0; 2)$ (loại $x = -2$). Tách tích phân thành $\int_0^1 (2 - x - x^2)dx + \int_1^2 (x^2 + x - 2)dx$.`,
      String.raw`Hoành độ giao điểm trên $(0; 2)$ là $x = 1$. Ta tách tích phân:
$$S = \int_0^1 (2 - x - x^2)dx + \int_1^2 (x^2 + x - 2)dx = \frac{7}{6} + \frac{11}{6} = 3$$`,
      {
        mode: '2d',
        title: 'Bài 4.25b SGK: Diện tích giữa y = x^2 và y = 2 - x trên [0; 2]',
        fExpr: 'x^2',
        gExpr: '2 - x',
        defaultA: 0,
        defaultB: 2,
      }
    ),
    createMcqItem(
      'ex-sbt-419-hooke',
      'Vận dụng',
      String.raw`*(Bài 4.19 SBT)* Theo định luật Hooke, lực cần thiết để giữ một lò xo giãn thêm $x$ mét so với độ dài tự nhiên là $F(x) = kx \text{ (N)}$. Biết cần một lực $40\text{ N}$ để giữ lò xo giãn thêm $0,1\text{ m}$. Công thực hiện để kéo giãn lò xo từ vị trí tự nhiên ($x = 0$) đến vị trí giãn thêm $0,2\text{ m}$ là:`,
      String.raw`$8\text{ (J)}$`,
      [
        String.raw`$4\text{ (J)}$`,
        String.raw`$16\text{ (J)}$`,
        String.raw`$80\text{ (J)}$`,
      ],
      String.raw`Bước 1: Tìm độ cứng lò xo $k$ từ $F(0,1) = 40 \Rightarrow 0,1k = 40 \Leftrightarrow k = 400$. Bước 2: Công của lực là $A = \int_0^{0,2} 400x dx$.`,
      String.raw`Từ $F(0,1) = 40 \Rightarrow k = \frac{40}{0,1} = 400\text{ (N/m)}$.
Công thực hiện để kéo giãn lò xo từ $0$ đến $0,2\text{ m}$ là:
$$A = \int_0^{0,2} 400x dx = 200x^2\Big|_0^{0,2} = 200\cdot 0,04 = 8\text{ (J)}$$`
    ),
    createMcqItem(
      'ex-sgk-434-vol',
      'Vận dụng',
      String.raw`*(Bài 4.34 SGK)* Thể tích khối tròn xoay sinh ra khi quay hình phẳng giới hạn bởi đồ thị hàm số $y = e^x$, trục hoành $Ox$ và hai đường thẳng $x = 0, x = 1$ quanh trục $Ox$ bằng:`,
      String.raw`$\frac{\pi(e^2 - 1)}{2}$`,
      [
        String.raw`$\pi(e^2 - 1)$`,
        String.raw`$\pi(e - 1)$`,
        String.raw`$\frac{e^2 - 1}{2}$`,
      ],
      String.raw`Áp dụng công thức $V = \pi\int_0^1 (e^x)^2 dx = \pi\int_0^1 e^{2x}dx$.`,
      String.raw`Ta có:
$$V = \pi\int_0^1 (e^x)^2 dx = \pi\int_0^1 e^{2x}dx = \pi\cdot\frac{e^{2x}}{2}\Big|_0^1 = \frac{\pi(e^2 - 1)}{2}$$`,
      {
        mode: '3d',
        title: 'Bài 4.34 SGK: Khối tròn xoay y = e^x trên [0; 1]',
        fExpr: 'exp(x)',
        defaultA: 0,
        defaultB: 1,
      }
    ),
    createMcqItem(
      'ex-sbt-426a-tri',
      'Vận dụng cao',
      String.raw`*(Ví dụ 6 Bài 13 SGK & Bài 4.26a SBT)* Một vật thể nằm giữa hai mặt phẳng $x = 0$ và $x = 3$. Cắt vật thể bởi mặt phẳng vuông góc với trục $Ox$ tại điểm có hoành độ $x \ (0 \le x \le 3)$ ta được thiết diện là một tam giác đều có cạnh bằng $2\sqrt{x}$. Thể tích của vật thể đó bằng:`,
      String.raw`$\frac{9\sqrt{3}}{2}$`,
      [
        String.raw`$\frac{9\sqrt{3}\pi}{2}$`,
        String.raw`$9\sqrt{3}$`,
        String.raw`$3\sqrt{3}$`,
      ],
      String.raw`Diện tích tam giác đều cạnh $a = 2\sqrt{x}$ là $S(x) = \frac{a^2\sqrt{3}}{4} = \frac{(2\sqrt{x})^2\sqrt{3}}{4} = x\sqrt{3}$. Áp dụng $V = \int_0^3 S(x)dx$.`,
      String.raw`Diện tích thiết diện tam giác đều tại hoành độ $x$ là:
$$S(x) = \frac{(2\sqrt{x})^2\sqrt{3}}{4} = x\sqrt{3}$$
Thể tích vật thể là:
$$V = \int_0^3 x\sqrt{3}dx = \frac{\sqrt{3}x^2}{2}\Big|_0^3 = \frac{9\sqrt{3}}{2}$$`
    ),
  ];

  return {
    mcqPool: [...mcqPool, ...extraMcqFromExercises],
    shortPool,
  };
}

// Hàm rút ngẫu nhiên 20 câu Trắc nghiệm + 5 câu Trả lời ngắn (Ưu tiên các dạng chưa xuất hiện ở đề ngay trước đó)
function pickRandomExamFromBank(
  version: number,
  prevUsedKeys: Set<string>
): { questions: ExamQuestion[]; usedKeys: Set<string> } {
  const { mcqPool, shortPool } = buildDiverseQuestionBank(version);

  const pickWithPriority = (pool: BankItem[], count: number): BankItem[] => {
    const fresh = shuffleArray(pool.filter((item) => !prevUsedKeys.has(item.bankKey)));
    constused = shuffleArray(pool.filter((item) => prevUsedKeys.has(item.bankKey)));
    return [...fresh, ...used].slice(0, count);
  };

  // Phân bổ chuẩn ma trận đề kiểm tra: 6 Nhận biết + 6 Thông hiểu + 5 Vận dụng + 3 Vận dụng cao = 20 câu MCQ
  const nbItems = pickWithPriority(
    mcqPool.filter((q) => q.level === 'Nhận biết'),
    6
  );
  const thItems = pickWithPriority(
    mcqPool.filter((q) => q.level === 'Thông hiểu'),
    6
  );
  const vdItems = pickWithPriority(
    mcqPool.filter((q) => q.level === 'Vận dụng'),
    5
  );
  const vdcItems = pickWithPriority(
    mcqPool.filter((q) => q.level === 'Vận dụng cao'),
    3
  );

  const selectedMcqs = [...nbItems, ...thItems, ...vdItems, ...vdcItems];
  const selectedShorts = pickWithPriority(shortPool, 5);

  const newUsedKeys = new Set<string>();
  const finalQuestions: ExamQuestion[] = [];

  selectedMcqs.forEach((item, idx) => {
    newUsedKeys.add(item.bankKey);
    finalQuestions.push({
      ...item,
      id: idx + 1,
    });
  });

  selectedShorts.forEach((item, idx) => {
    newUsedKeys.add(item.bankKey);
    finalQuestions.push({
      ...item,
      id: 21 + idx,
    });
  });

  return { questions: finalQuestions, usedKeys: newUsedKeys };
}

export default function App() {
  // Điều hướng 3 phân hệ chính
  const [activeTab, setActiveTab] = useState<'theory' | 'exercises' | 'exam'>('theory');
  const [exerciseSource, setExerciseSource] = useState<'sgk' | 'sbt'>('sgk');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Phân hệ 1: Lý thuyết
  const [selectedTheoryId, setSelectedTheoryId] = useState<string>(THEORY_SECTIONS[0].id);
  const [showTheoryExampleSol, setShowTheoryExampleSol] = useState<Record<string, boolean>>({});

  // Phân hệ 2: Giải bài tập SGK (35 bài) & SBT (48 bài)
  const filteredExercises = EXERCISES_DATA.filter((ex) => ex.source === exerciseSource);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('sgk-4.14');
  const [unlockedHintMap, setUnlockedHintMap] = useState<Record<string, boolean>>({
    'sgk-4.14': true,
  });
  const [unlockedSolMap, setUnlockedSolMap] = useState<Record<string, boolean>>({});

  const currentExercise: ExerciseItem =
    filteredExercises.find((e) => e.id === selectedExerciseId) || filteredExercises[0];

  // Phân hệ 3: Đề kiểm tra cuối chương (25 câu bốc ngẫu nhiên từ tất cả các dạng bài SGK & SBT)
  const prevUsedKeysRef = useRef<Set<string>>(new Set());
  const [examVersion, setExamVersion] = useState<number>(1);
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>(() => {
    const initial = pickRandomExamFromBank(1, new Set());
    prevUsedKeysRef.current = initial.usedKeys;
    return initial.questions;
  });
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<number, string>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);

  // Phân hệ 4: Chatbot AI chuyên giải Đề kiểm tra cuối chương
  const [chatInput, setChatInput] = useState<string>('');
  const [unlockedChatSolMap, setUnlockedChatSolMap] = useState<Record<string, boolean>>({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      thinkingHint: String.raw`Chào em! Thầy là **Trợ lý AI chuyên giải Đề Kiểm Tra Cuối Chương IV**.
• **Ngân hàng đề đa dạng:** Mỗi lần bấm **"Làm đề khác"**, hệ thống sẽ chọn ngẫu nhiên 25 câu hỏi từ tất cả các dạng bài tập trong **SGK (35 bài)** và **SBT (48 bài)**.
• Để xem **💡 Gợi ý tư duy giải**, **📖 Lời giải chi tiết** và **📐 Hình vẽ GeoGebra (nếu có)** của bất kỳ câu nào, em chỉ cần bấm vào nút **"🤖 Hỏi đáp AI"** ngay tại câu hỏi đó!`,
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
      return mcqAnswers[q.id] !== undefined && mcqAnswers[q.id] === q.correctOptionIndex;
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

  // Sinh đề kiểm tra mới với các dạng bài tập hoàn toàn mới từ SGK & SBT
  const handleGenerateNewExam = () => {
    const nextVer = examVersion + 1;
    const picked = pickRandomExamFromBank(nextVer, prevUsedKeysRef.current);
    prevUsedKeysRef.current = picked.usedKeys;

    setExamVersion(nextVer);
    setExamQuestions(picked.questions);
    setIsExamSubmitted(false);
    setMcqAnswers({});
    setShortAnswers({});
    setChatMessages([
      {
        id: `new-exam-${nextVer}`,
        role: 'assistant',
        thinkingHint: String.raw`Hệ thống đã rút ngẫu nhiên **25 dạng bài tập mới từ SGK & SBT** để tạo **Đề kiểm tra số ${nextVer}**!
Em hãy làm bài và bấm **Nộp bài**, sau đó bấm nút **"🤖 Hỏi đáp AI"** ở bất kỳ câu nào để xem gợi ý tư duy, lời giải chi tiết và hình minh họa nhé.`,
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
                2. Giải Bài Tập ({exerciseSource === 'sgk' ? 'SGK - 35 bài' : 'SBT - 48 bài'})
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

              {THEORY_SECTIONS.filter((s) => s.id === selectedTheoryId).map((sec) => (
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
                    <p className="text-xs text-slate-500 mt-1">{sec.summary}</p>
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
                        <Lightbulb className="w-4 h-4" /> Gợi ý tư duy giải ví dụ:
                      </div>
                      <LatexRenderer content={sec.exampleThinking} />
                    </div>

                    {!showTheoryExampleSol[sec.id] ? (
                      <button
                        type="button"
                        onClick={() =>
                          setShowTheoryExampleSol((prev) => ({ ...prev, [sec.id]: true }))
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
              ))}
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
                    Nhấp vào số bài để xem Đề bài, Gợi ý tư duy, Mô phỏng GeoGebra & Lời giải chi tiết:
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
                                isSelected ? 'text-amber-300' : 'text-indigo-600'
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
                        setUnlockedHintMap((prev) => ({ ...prev, [currentExercise.id]: true }));
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
                      <LatexRenderer content={currentExercise.detailedSolution} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              PHÂN HỆ 3: ĐỀ KIỂM TRA CUỐI CHƯƠNG (25 CÂU ĐA DẠNG TỪ SGK & SBT)
             ================================================================= */}
          {activeTab === 'exam' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 text-xs font-extrabold uppercase">
                    Đề kiểm tra số {examVersion} • Tuyển chọn ngẫu nhiên từ 35 bài SGK & 48 bài SBT
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                    Đề Kiểm Tra & Ôn Tập Cuối Chương IV (20 Trắc Nghiệm + 5 Trả Lời Ngắn)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Mỗi lần bấm <b>"Làm đề khác"</b>, hệ thống sẽ bốc ngẫu nhiên 25 dạng bài tập khác nhau từ SGK & SBT. Bấm <b>"🤖 Hỏi đáp AI"</b> ở từng câu để xem Gợi ý tư duy, Lời giải và Hình vẽ bên khung Chatbot!
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
                        Đúng {examResult.totalCorrect} / {examResult.totalQuestions} câu
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
                  PHẦN I. CÂU HỎI TRẮC NGHIỆM 4 LỰA CHỌN (20 CÂU: TỪ CÂU 1 ĐẾN CÂU 20)
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
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Đúng
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
                                  setMcqAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                                }
                                className={`text-left px-4 py-2.5 rounded-xl border transition flex items-center justify-between ${styleClass}`}
                              >
                                <LatexRenderer content={opt} />
                                {isExamSubmitted && isSelected && isCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                                {isExamSubmitted && isSelected && !isCorrect && (
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
                  PHẦN II. CÂU HỎI TRẢ LỜI NGẮN - ĐIỀN ĐÁP SỐ (5 CÂU: TỪ CÂU 21 ĐẾN CÂU 25)
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
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Đúng
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
                              setShortAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
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
                          <span className="text-xs text-slate-500 italic">({q.unitHint})</span>
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
                      {msg.questionNumber && msg.questionLatex && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-2">
                          <div className="text-xs font-extrabold uppercase text-indigo-700">
                            📌 Đề bài Câu {msg.questionNumber} (Đề số {msg.examVer}):
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
                              📖 Bấm để xem Lời giải chi tiết & Đáp số Câu {msg.questionNumber}
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

                      {msg.geogebra && <GeoGebraViewer config={msg.geogebra} />}
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

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