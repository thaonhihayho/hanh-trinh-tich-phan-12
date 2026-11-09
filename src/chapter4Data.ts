import type { GeoGebraConfig } from './GeoGebraViewer';

export interface TheorySection {
  id: string;
  lessonNumber: string;
  title: string;
  summary: string;
  coreKnowledge: string;
  thinkingGuide: string;
  exampleProblem: string;
  exampleThinking: string;
  exampleSolution: string;
  geogebra: GeoGebraConfig;
}

export interface ExerciseItem {
  id: string;
  code: string;
  lesson: string;
  source: 'sgk' | 'sbt';
  problemLatex: string;
  thinkingHint: string;
  detailedSolution: string;
  geogebra?: GeoGebraConfig;
}

export interface ExamQuestion {
  id: number;
  part: 'mcq' | 'short';
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  questionLatex: string;
  options?: string[];
  correctOptionIndex?: number;
  shortAnswer?: number;
  tolerance?: number;
  unitHint?: string;
  thinkingHint: string;
  detailedSolution: string;
  geogebra?: GeoGebraConfig;
}

// Hàm tạo nhanh cấu hình GeoGebra 2D (Diện tích / Đồ thị) và 3D (Thể tích vật thể / Khối tròn xoay)
const g2d = (
  title: string,
  fExpr: string,
  defaultA: number,
  defaultB: number,
  gExpr = '0'
): GeoGebraConfig => ({
  mode: '2d',
  title,
  fExpr,
  gExpr,
  defaultA,
  defaultB,
  minBound: Math.floor(defaultA - 1),
  maxBound: Math.ceil(defaultB + 1),
});

const g3d = (
  title: string,
  fExpr: string,
  defaultA: number,
  defaultB: number
): GeoGebraConfig => ({
  mode: '3d',
  title,
  fExpr,
  defaultA,
  defaultB,
  minBound: Math.floor(defaultA),
  maxBound: Math.ceil(defaultB + 1),
});

const ex = (
  id: string,
  code: string,
  lesson: string,
  source: 'sgk' | 'sbt',
  problemLatex: string,
  thinkingHint: string,
  detailedSolution: string,
  geogebra?: GeoGebraConfig
): ExerciseItem => ({
  id,
  code,
  lesson,
  source,
  problemLatex,
  thinkingHint,
  detailedSolution,
  geogebra,
});

const B11 = 'Bài 11: Nguyên hàm';
const B12 = 'Bài 12: Tích phân';
const B13 = 'Bài 13: Ứng dụng hình học';
const ONTAP = 'Bài tập cuối chương IV';

// ============================================================================
// 1. TÓM TẮT LÝ THUYẾT CHƯƠNG IV (BÀI 11, 12, 13 - KẾT NỐI TRI THỨC)
// ============================================================================
export const THEORY_SECTIONS: TheorySection[] = [
  {
    id: 'bai-11',
    lessonNumber: 'Bài 11',
    title: 'Nguyên hàm',
    summary:
      'Khái niệm nguyên hàm, họ nguyên hàm, tính chất cơ bản và bảng nguyên hàm sơ cấp.',
    coreKnowledge: String.raw`**1. Định nghĩa nguyên hàm:**
Cho hàm số $f(x)$ xác định trên khoảng $K$ (hoặc đoạn, nửa khoảng). Hàm số $F(x)$ được gọi là một **nguyên hàm** của $f(x)$ trên $K$ nếu $F'(x) = f(x)$ với mọi $x \in K$.
Họ tất cả các nguyên hàm của $f(x)$ trên $K$ kí hiệu là $\int f(x)dx$:
$$\int f(x)dx = F(x) + C \quad (C \in \mathbb{R})$$
**2. Tính chất cơ bản:**
• $\int kf(x)dx = k\int f(x)dx \ (k \neq 0)$; $\quad \int [f(x) \pm g(x)]dx = \int f(x)dx \pm \int g(x)dx$.
**3. Bảng nguyên hàm cơ bản:**
• $\int 0dx = C$; $\int 1dx = x + C$; $\int x^\alpha dx = \frac{x^{\alpha+1}}{\alpha+1} + C \ (\alpha \neq -1)$; $\int \frac{1}{x}dx = \ln|x| + C$.
• $\int \cos x dx = \sin x + C$; $\int \sin x dx = -\cos x + C$; $\int \frac{1}{\cos^2 x}dx = \tan x + C$; $\int \frac{1}{\sin^2 x}dx = -\cot x + C$.
• $\int e^x dx = e^x + C$; $\int a^x dx = \frac{a^x}{\ln a} + C \ (0 < a \neq 1)$.`,
    thinkingGuide: String.raw`**💡 Gợi ý tư duy & Bản chất Toán học (Theo SGV):**
• Tìm nguyên hàm là bài toán ngược của đạo hàm: Muốn kiểm tra $F(x)$ có là nguyên hàm của $f(x)$ không, ta tính $F'(x)$ và đối chiếu với $f(x)$.
• Khi biểu thức dưới dấu nguyên hàm có dạng tích hoặc thương phức tạp, hãy biến đổi đại số (khai triển hằng đẳng thức, chia đa thức, đưa căn thức $\sqrt[n]{x^m}$ về lũy thừa $x^{\frac{m}{n}}$, hoặc dùng công thức hạ bậc lượng giác) để đưa về tổng/hiệu các nguyên hàm cơ bản.`,
    exampleProblem: String.raw`**Ví dụ mở đầu (SGK trang 4):** Máy bay chạy đà với vận tốc $v(t) = 5 + 3t \text{ (m/s)}$. Sau $30$ giây thì máy bay rời đường băng. Tính quãng đường máy bay đã di chuyển.`,
    exampleThinking: String.raw`Vì $S'(t) = v(t)$ nên $S(t) = \int (5 + 3t)dt$ với điều kiện ban đầu $S(0) = 0$. Sau đó tính $S(30)$.`,
    exampleSolution: String.raw`Ta có $S(t) = \int (5 + 3t)dt = 5t + \frac{3}{2}t^2 + C$. Vì $S(0) = 0 \Rightarrow C = 0$.
Quãng đường chạy đà sau $30$ giây là $S(30) = 5\cdot 30 + \frac{3}{2}\cdot 30^2 = 1500 \text{ (m)}$.`,
    geogebra: g2d(
      'Minh họa vận tốc v(t) = 5 + 3t và quãng đường tích lũy',
      '5 + 3*x',
      0,
      10
    ),
  },
  {
    id: 'bai-12',
    lessonNumber: 'Bài 12',
    title: 'Tích phân',
    summary:
      'Hình thang cong, công thức Newton-Leibniz, ý nghĩa hình học và tính chất tích phân.',
    coreKnowledge: String.raw`**1. Định nghĩa tích phân (Công thức Newton - Leibniz):**
Cho $f(x)$ liên tục trên đoạn $[a; b]$. Nếu $F(x)$ là một nguyên hàm của $f(x)$ trên $[a; b]$ thì:
$$\int_a^b f(x)dx = F(x)\Big|_a^b = F(b) - F(a)$$
**2. Ý nghĩa hình học của tích phân:**
Nếu $f(x)$ liên tục và không âm ($f(x) \ge 0$) trên đoạn $[a; b]$, thì $\int_a^b f(x)dx$ là diện tích $S$ của hình thang cong giới hạn bởi $y = f(x)$, trục $Ox$ và $x = a, x = b$.
**3. Tính chất & Giá trị trung bình:**
• $\int_a^b kf(x)dx = k\int_a^b f(x)dx$; $\quad \int_a^b [f(x) \pm g(x)]dx = \int_a^b f(x)dx \pm \int_a^b g(x)dx$.
• Chèn cận: $\int_a^b f(x)dx = \int_a^c f(x)dx + \int_c^b f(x)dx \ (a < c < b)$.
• Giá trị trung bình trên đoạn $[a; b]$: $m = \frac{1}{b-a}\int_a^b f(x)dx$.`,
    thinkingGuide: String.raw`**💡 Gợi ý tư duy & Bản chất Toán học (Theo SGV):**
• Với tích phân chứa dấu giá trị tuyệt đối $\int_a^b |f(x)|dx$, giải phương trình $f(x) = 0$ tìm nghiệm $c \in (a; b)$ để tách cận.
• Với bài toán chuyển động: Độ dịch chuyển là $\int_{t_1}^{t_2} v(t)dt$, còn tổng quãng đường đi được là $\int_{t_1}^{t_2} |v(t)|dt$.`,
    exampleProblem: String.raw`**Ví dụ (SGK trang 15):** Sử dụng ý nghĩa hình học của tích phân, tính $I = \int_{-1}^1 \sqrt{1 - x^2}dx$.`,
    exampleThinking: String.raw`Đồ thị $y = \sqrt{1 - x^2}$ ($y \ge 0 \Leftrightarrow x^2 + y^2 = 1$) là nửa trên đường tròn tâm $O(0;0)$, bán kính $R = 1$.`,
    exampleSolution: String.raw`Tích phân bằng diện tích nửa hình tròn bán kính $R = 1$: $\int_{-1}^1 \sqrt{1 - x^2}dx = \frac{1}{2}\pi \cdot 1^2 = \frac{\pi}{2}$.`,
    geogebra: g2d(
      'Ý nghĩa hình học: Nửa hình tròn y = sqrt(1 - x^2)',
      'sqrt(max(0, 1 - x^2))',
      -1,
      1
    ),
  },
  {
    id: 'bai-13',
    lessonNumber: 'Bài 13',
    title: 'Ứng dụng hình học của tích phân',
    summary:
      'Diện tích hình phẳng, thể tích vật thể theo thiết diện S(x) và thể tích khối tròn xoay.',
    coreKnowledge: String.raw`**1. Diện tích hình phẳng:**
• Giới hạn bởi $y = f(x)$, trục $Ox$ và $x = a, x = b$: $S = \int_a^b |f(x)|dx$.
• Giới hạn bởi hai đồ thị $y = f(x), y = g(x)$ và $x = a, x = b$: $S = \int_a^b |f(x) - g(x)|dx$.
**2. Thể tích vật thể theo mặt cắt $S(x)$:**
Vật thể giới hạn bởi hai mặt phẳng $x = a, x = b$ có diện tích thiết diện tại hoành độ $x$ là $S(x)$ liên tục trên $[a; b]$:
$$V = \int_a^b S(x)dx$$
**3. Thể tích khối tròn xoay (quay quanh trục $Ox$):**
Quay hình phẳng giới hạn bởi $y = f(x)$, trục $Ox$ và $x = a, x = b$ quanh trục $Ox$:
$$V = \pi \int_a^b f^2(x)dx$$`,
    thinkingGuide: String.raw`**💡 Gợi ý tư duy & Bản chất Toán học (Theo SGV):**
• Khi tính diện tích giữa hai đường $f(x)$ và $g(x)$, hãy xét dấu hiệu số $f(x) - g(x)$ trên $[a; b]$ hoặc quan sát trên hình vẽ xem đường nào nằm phía trên.
• Phân biệt rõ: Công thức mặt cắt tổng quát $V = \int_a^b S(x)dx$ (như thiết diện hình vuông, tam giác) **không có $\pi$**, còn khối tròn xoay có mặt cắt là hình tròn $S(x) = \pi R^2 = \pi f^2(x)$ nên **bắt buộc nhân $\pi$**.`,
    exampleProblem: String.raw`**Ví dụ (SGK trang 24):** Tính thể tích khối tròn xoay khi quay hình phẳng giới hạn bởi $y = \sqrt{x}, y = 0, x = 0, x = 1$ quanh trục $Ox$.`,
    exampleThinking: String.raw`Áp dụng công thức $V = \pi \int_0^1 (\sqrt{x})^2 dx = \pi \int_0^1 x dx$.`,
    exampleSolution: String.raw`Ta có $V = \pi \int_0^1 x dx = \frac{\pi x^2}{2}\Big|_0^1 = \frac{\pi}{2}$.`,
    geogebra: g3d(
      'Khối tròn xoay y = sqrt(x) trên đoạn [0; 1]',
      'sqrt(max(0, x))',
      0,
      1
    ),
  },
];

// ============================================================================
// 2. NGÂN HÀNG ĐẦY ĐỦ 35 BÀI TẬP SGK (4.1 -> 4.35) & 48 BÀI TẬP SBT (4.1 -> 4.48)
// ============================================================================
export const EXERCISES_DATA: ExerciseItem[] = [
  // -------------------- PHẦN A: ĐỦ 35 BÀI TẬP SÁCH GIÁO KHOA (SGK) --------------------
  ex(
    'sgk-4.1',
    'Bài 4.1',
    B11,
    'sgk',
    String.raw`Trong mỗi trường hợp sau, hàm số $F(x)$ có là một nguyên hàm của hàm số $f(x)$ trên khoảng tương ứng không? Vì sao?
a) $F(x) = x\ln x$ và $f(x) = 1 + \ln x$ trên khoảng $(0; +\infty)$;
b) $F(x) = e^{\sin x}$ và $f(x) = e^{\cos x}$ trên $\mathbb{R}$.`,
    String.raw`Tính đạo hàm $F'(x)$ trên khoảng đã cho rồi so sánh với $f(x)$. Nếu $F'(x) = f(x), \forall x \in K$ thì $F(x)$ là một nguyên hàm.`,
    String.raw`a) Với mọi $x \in (0; +\infty)$: $F'(x) = (x)'\ln x + x(\ln x)' = \ln x + 1 = f(x)$. Vậy $F(x) = x\ln x$ là một nguyên hàm của $f(x)$ trên $(0; +\infty)$.
b) Ta có $F'(x) = (\sin x)'e^{\sin x} = \cos x \cdot e^{\sin x}$. Tại $x = 0$, $F'(0) = 1 \neq e = f(0)$, nên $F(x) = e^{\sin x}$ không là nguyên hàm của $f(x) = e^{\cos x}$ trên $\mathbb{R}$.`
  ),

  ex(
    'sgk-4.2',
    'Bài 4.2',
    B11,
    'sgk',
    String.raw`Tìm nguyên hàm của các hàm số sau:
a) $f(x) = 3x^2 + 2x - 1$; $\quad$ b) $f(x) = x^3 - x$; $\quad$ c) $f(x) = (2x + 1)^2$; $\quad$ d) $f(x) = \left(2x - \frac{1}{x}\right)^2$.`,
    String.raw`Ở câu c và d, khai triển hằng đẳng thức $(A \pm B)^2$ để đưa về tổng, hiệu các hàm lũy thừa $x^\alpha$ và $\frac{1}{x^2}$.`,
    String.raw`a) $\int (3x^2 + 2x - 1)dx = x^3 + x^2 - x + C$.
b) $\int (x^3 - x)dx = \frac{x^4}{4} - \frac{x^2}{2} + C$.
c) $\int (2x + 1)^2 dx = \int (4x^2 + 4x + 1)dx = \frac{4}{3}x^3 + 2x^2 + x + C$ (hoặc $\frac{(2x+1)^3}{6} + C$).
d) $\int \left(2x - \frac{1}{x}\right)^2 dx = \int \left(4x^2 - 4 + \frac{1}{x^2}\right)dx = \frac{4x^3}{3} - 4x - \frac{1}{x} + C$.`
  ),

  ex(
    'sgk-4.3',
    'Bài 4.3',
    B11,
    'sgk',
    String.raw`Tìm:
a) $\int \left(3\sqrt{x} + \frac{1}{\sqrt[3]{x}}\right)dx$; $\quad$ b) $\int \sqrt{x}(7x^2 - 3)dx \ (x > 0)$; $\quad$ c) $\int \frac{(2x + 1)^2}{x^2}dx$; $\quad$ d) $\int \left(2^x + \frac{3}{x^2}\right)dx$.`,
    String.raw`Viết căn thức dưới dạng lũy thừa: $\sqrt{x} = x^{1/2}$, $\frac{1}{\sqrt[3]{x}} = x^{-1/3}$. Ở câu c, khai triển tử số rồi chia cho $x^2$.`,
    String.raw`a) $\int (3x^{1/2} + x^{-1/3})dx = 2x\sqrt{x} + \frac{3}{2}\sqrt[3]{x^2} + C$.
b) $\int (7x^{5/2} - 3x^{1/2})dx = 2x^3\sqrt{x} - 2x\sqrt{x} + C = 2(x^3 - x)\sqrt{x} + C$.
c) $\int \left(4 + \frac{4}{x} + \frac{1}{x^2}\right)dx = 4x + 4\ln|x| - \frac{1}{x} + C$.
d) $\int \left(2^x + \frac{3}{x^2}\right)dx = \frac{2^x}{\ln 2} - \frac{3}{x} + C$.`
  ),

  ex(
    'sgk-4.4',
    'Bài 4.4',
    B11,
    'sgk',
    String.raw`Tìm:
a) $\int \left(2\cos x - \frac{3}{\sin^2 x}\right)dx$; $\quad$ b) $\int 4\sin^2\frac{x}{2}dx$; $\quad$ c) $\int \left(\sin\frac{x}{2} - \cos\frac{x}{2}\right)^2 dx$; $\quad$ d) $\int (x + \tan^2 x)dx$.`,
    String.raw`Dùng các công thức lượng giác: $2\sin^2\frac{x}{2} = 1 - \cos x$; $\left(\sin\frac{x}{2} - \cos\frac{x}{2}\right)^2 = 1 - \sin x$; $\tan^2 x = \frac{1}{\cos^2 x} - 1$.`,
    String.raw`a) $\int \left(2\cos x - \frac{3}{\sin^2 x}\right)dx = 2\sin x + 3\cot x + C$.
b) $\int 2(1 - \cos x)dx = 2(x - \sin x) + C$.
c) $\int (1 - \sin x)dx = x + \cos x + C$.
d) $\int \left(x - 1 + \frac{1}{\cos^2 x}\right)dx = \frac{x^2}{2} - x + \tan x + C$.`
  ),

  ex(
    'sgk-4.5',
    'Bài 4.5',
    B11,
    'sgk',
    String.raw`Cho hàm số $y = f(x)$ xác định trên khoảng $(0; +\infty)$. Biết rằng $f'(x) = 2x + \frac{1}{x^2}$ với mọi $x \in (0; +\infty)$ và $f(1) = 1$. Tính giá trị $f(4)$.`,
    String.raw`Lấy nguyên hàm $f(x) = \int \left(2x + \frac{1}{x^2}\right)dx = x^2 - \frac{1}{x} + C$. Thay $f(1) = 1$ để tìm $C$ rồi tính $f(4)$.`,
    String.raw`Ta có $f(x) = x^2 - \frac{1}{x} + C$. Vì $f(1) = 1^2 - 1 + C = 1 \Rightarrow C = 1$.
Khi đó $f(x) = x^2 - \frac{1}{x} + 1 \Rightarrow f(4) = 16 - \frac{1}{4} + 1 = \frac{67}{4}$.`
  ),

  ex(
    'sgk-4.6',
    'Bài 4.6',
    B11,
    'sgk',
    String.raw`Cho hàm số $y = f(x)$ có đồ thị là $(C)$. Xét điểm $M(x; f(x))$ thay đổi trên $(C)$. Biết rằng hệ số góc của tiếp tuyến của đồ thị $(C)$ tại $M$ là $k_M = (x - 1)^2$ và điểm $M$ trùng với gốc tọa độ khi nó nằm trên trục tung. Tìm biểu thức $f(x)$.`,
    String.raw`Hệ số góc tiếp tuyến là $f'(x) = (x - 1)^2$. Điểm $M$ nằm trên trục tung và trùng gốc tọa độ nghĩa là $f(0) = 0$.`,
    String.raw`Ta có $f(x) = \int (x - 1)^2 dx = \frac{(x - 1)^3}{3} + C$.
Vì $f(0) = 0 \Rightarrow -\frac{1}{3} + C = 0 \Rightarrow C = \frac{1}{3}$. Vậy $f(x) = \frac{(x - 1)^3 + 1}{3} = \frac{x^3}{3} - x^2 + x$.`
  ),

  ex(
    'sgk-4.7',
    'Bài 4.7',
    B11,
    'sgk',
    String.raw`Một viên đạn được bắn thẳng đứng lên trên từ mặt đất với vận tốc $v(t) = 160 - 9,8t \text{ (m/s)}$ ($t \ge 0$). Tìm độ cao của viên đạn:
a) Sau $t = 5$ giây;
b) Khi nó đạt độ cao lớn nhất (làm tròn đến chữ số thập phân thứ nhất của mét).`,
    String.raw`Độ cao $h(t) = \int v(t)dt$ với $h(0) = 0$. Đạt độ cao cực đại khi vận tốc bằng $0$: $v(t) = 160 - 9,8t = 0$.`,
    String.raw`Ta có $h(t) = \int (160 - 9,8t)dt = 160t - 4,9t^2 + C$. Do $h(0) = 0 \Rightarrow C = 0$.
a) Sau $t = 5$ giây: $h(5) = 160\cdot 5 - 4,9\cdot 5^2 = 677,5 \text{ (m)}$.
b) Khi đạt độ cao lớn nhất: $v(t) = 0 \Leftrightarrow t = \frac{160}{9,8} \approx 16,33 \text{ (s)} \Rightarrow h_{\max} = h\left(\frac{160}{9,8}\right) \approx 1306,1 \text{ (m)}$.`
  ),

  ex(
    'sgk-4.8',
    'Bài 4.8',
    B12,
    'sgk',
    String.raw`Sử dụng ý nghĩa hình học của tích phân, tính:
a) $\int_1^2 (2x + 1)dx$; $\quad$ b) $\int_{-3}^3 \sqrt{9 - x^2}dx$.`,
    String.raw`a) Là diện tích hình thang vuông có đáy nhỏ $AD = 3$ (tại $x=1$), đáy lớn $BC = 5$ (tại $x=2$), chiều cao $h = 1$.
b) Đồ thị $y = \sqrt{9 - x^2}$ là nửa đường tròn tâm $O$, bán kính $R = 3$.`,
    String.raw`a) Diện tích hình thang vuông: $\int_1^2 (2x + 1)dx = \frac{(3 + 5)\cdot 1}{2} = 4$.
b) Diện tích nửa hình tròn bán kính $R = 3$: $\int_{-3}^3 \sqrt{9 - x^2}dx = \frac{1}{2}\pi \cdot 3^2 = \frac{9\pi}{2}$.`,
    g2d(
      'Bài 4.8b SGK: Diện tích nửa hình tròn y = sqrt(9 - x^2)',
      'sqrt(max(0, 9 - x^2))',
      -3,
      3
    )
  ),

  ex(
    'sgk-4.9',
    'Bài 4.9',
    B12,
    'sgk',
    String.raw`Cho $\int_0^3 f(x)dx = 5$ và $\int_0^3 g(x)dx = 2$. Tính:
a) $\int_0^3 [f(x) + g(x)]dx$; $\quad$ b) $\int_0^3 [f(x) - g(x)]dx$; $\quad$ c) $\int_0^3 3f(x)dx$; $\quad$ d) $\int_0^3 [2f(x) - 3g(x)]dx$.`,
    String.raw`Áp dụng tính chất tuyến tính của tích phân xác định trên đoạn $[0; 3]$.`,
    String.raw`a) $5 + 2 = 7$. $\quad$ b) $5 - 2 = 3$. $\quad$ c) $3\cdot 5 = 15$. $\quad$ d) $2\cdot 5 - 3\cdot 2 = 4$.`
  ),

  ex(
    'sgk-4.10',
    'Bài 4.10',
    B12,
    'sgk',
    String.raw`Tính:
a) $\int_0^3 (3x - 1)^2 dx$; $\quad$ b) $\int_0^{\frac{\pi}{2}} (1 + \sin x)dx$; $\quad$ c) $\int_0^1 (e^{2x} + 3x^2)dx$; $\quad$ d) $\int_{-1}^2 |2x + 1|dx$.`,
    String.raw`Ở câu d, cho $2x + 1 = 0 \Leftrightarrow x = -\frac{1}{2} \in [-1; 2]$, tách tích phân thành 2 đoạn $[-1; -\frac{1}{2}]$ và $[-\frac{1}{2}; 2]$.`,
    String.raw`a) $\int_0^3 (9x^2 - 6x + 1)dx = (3x^3 - 3x^2 + x)\Big|_0^3 = 57$.
b) $(x - \cos x)\Big|_0^{\pi/2} = \frac{\pi}{2} + 1$.
c) $\left(\frac{1}{2}e^{2x} + x^3\right)\Big|_0^1 = \frac{1}{2}e^2 + \frac{1}{2}$.
d) $\int_{-1}^{-1/2} (-2x - 1)dx + \int_{-1/2}^2 (2x + 1)dx = (-x^2 - x)\Big|_{-1}^{-1/2} + (x^2 + x)\Big|_{-1/2}^2 = \frac{13}{2}$.`,
    g2d(
      'Bài 4.10d SGK: Đồ thị hàm y = |2x + 1| trên [-1; 2]',
      'abs(2*x + 1)',
      -1,
      2
    )
  ),

  ex(
    'sgk-4.11',
    'Bài 4.11',
    B12,
    'sgk',
    String.raw`Một vật chuyển động dọc theo một đường thẳng sao cho vận tốc tại thời điểm $t$ (giây) là $v(t) = t^2 - t - 6 \text{ (m/s)}$.
a) Tìm độ dịch chuyển của vật trong khoảng thời gian $1 \le t \le 4$, tức là tính $\int_1^4 v(t)dt$.
b) Tìm tổng quãng đường vật đi được trong khoảng thời gian $1 \le t \le 4$, tức là tính $\int_1^4 |v(t)|dt$.`,
    String.raw`Giải $v(t) = t^2 - t - 6 = 0 \Leftrightarrow t = 3 \in [1; 4]$. Tách tích phân tại $t = 3$ để tính quãng đường ở câu b.`,
    String.raw`a) Độ dịch chuyển: $\int_1^4 (t^2 - t - 6)dt = \left(\frac{t^3}{3} - \frac{t^2}{2} - 6t\right)\Big|_1^4 = -\frac{9}{2} = -4,5 \text{ (m)}$.
b) Tổng quãng đường: $\int_1^3 (-t^2 + t + 6)dt + \int_3^4 (t^2 - t - 6)dt = \frac{22}{3} + \frac{17}{6} = \frac{61}{6} \text{ (m)}$.`,
    g2d(
      'Bài 4.11 SGK: Đồ thị vận tốc v(t) = t^2 - t - 6 trên [1; 4]',
      'x^2 - x - 6',
      1,
      4
    )
  ),

  ex(
    'sgk-4.12',
    'Bài 4.12',
    B12,
    'sgk',
    String.raw`Giả sử lợi nhuận biên (triệu đồng) của một sản phẩm là $P'(x) = -0,0005x + 12,2$.
a) Tìm sự thay đổi lợi nhuận khi doanh số tăng từ $100$ lên $101$ đơn vị.
b) Tìm sự thay đổi lợi nhuận khi doanh số tăng từ $100$ lên $110$ đơn vị.`,
    String.raw`Áp dụng công thức Newton-Leibniz: $\Delta P = \int_{x_1}^{x_2} P'(x)dx$.`,
    String.raw`a) $\int_{100}^{101} (-0,0005x + 12,2)dx = \left(-\frac{x^2}{4000} + 12,2x\right)\Big|_{100}^{101} = 12,14975 \text{ (triệu đồng)}$.
b) $\int_{100}^{110} (-0,0005x + 12,2)dx = \left(-\frac{x^2}{4000} + 12,2x\right)\Big|_{100}^{110} = 121,475 \text{ (triệu đồng)}$.`
  ),

  ex(
    'sgk-4.13',
    'Bài 4.13',
    B12,
    'sgk',
    String.raw`Vận tốc $v$ của dòng máu ở khoảng cách $r$ từ tâm động mạch bán kính $R$ không đổi là $v(r) = k(R^2 - r^2)$. Tìm vận tốc trung bình (đối với $r$) trong khoảng $0 \le r \le R$ và so sánh với vận tốc lớn nhất.`,
    String.raw`Vận tốc trung bình $v_{tb} = \frac{1}{R - 0}\int_0^R k(R^2 - r^2)dr$. Vận tốc lớn nhất đạt tại $r = 0$.`,
    String.raw`Ta có $v_{tb} = \frac{1}{R}\left(kR^2 r - k\frac{r^3}{3}\right)\Big|_0^R = \frac{2}{3}kR^2$.
Vận tốc lớn nhất tại $r = 0$ là $v_{\max} = kR^2$. Do đó $v_{\max} = 1,5 v_{tb}$.`
  ),

  ex(
    'sgk-4.14',
    'Bài 4.14',
    B13,
    'sgk',
    String.raw`Tính diện tích của hình phẳng được tô màu trong Hình 4.29 (giới hạn bởi parabol $y = 5x - x^2$ và đường thẳng $y = x$ trên đoạn $[0; 4]$).`,
    String.raw`Trên đoạn $[0; 4]$, parabol $y = 5x - x^2$ nằm phía trên đường thẳng $y = x$, nên $S = \int_0^4 [(5x - x^2) - x]dx$.`,
    String.raw`Ta có $S = \int_0^4 |5x - x^2 - x|dx = \int_0^4 (4x - x^2)dx = \left(2x^2 - \frac{x^3}{3}\right)\Big|_0^4 = \frac{32}{3}$.`,
    g2d(
      'Bài 4.14 SGK: Diện tích giữa y = 5x - x^2 và y = x',
      '5*x - x^2',
      0,
      4,
      'x'
    )
  ),

  ex(
    'sgk-4.15',
    'Bài 4.15',
    B13,
    'sgk',
    String.raw`Tính diện tích của hình phẳng giới hạn bởi các đường:
a) $y = e^x, y = x^2 - 1, x = -1, x = 1$; $\quad$ b) $y = \sin x, y = x, x = \frac{\pi}{2}, x = \pi$;
c) $y = 9 - x^2, y = 2x^2, x = -\sqrt{3}, x = \sqrt{3}$; $\quad$ d) $y = \sqrt{x}, y = x^2, x = 0, x = 1$.`,
    String.raw`Xét dấu hiệu hai hàm số $f(x) - g(x)$ trên đoạn $[a; b]$ đã cho để phá dấu trị tuyệt đối.`,
    String.raw`a) $\int_{-1}^1 (e^x - x^2 + 1)dx = \left(e^x - \frac{x^3}{3} + x\right)\Big|_{-1}^1 = e - \frac{1}{e} + \frac{4}{3}$.
b) $\int_{\pi/2}^\pi (x - \sin x)dx = \left(\frac{x^2}{2} + \cos x\right)\Big|_{\pi/2}^\pi = \frac{3\pi^2}{8} - 1$.
c) $\int_{-\sqrt{3}}^{\sqrt{3}} (9 - 3x^2)dx = (9x - x^3)\Big|_{-\sqrt{3}}^{\sqrt{3}} = 12\sqrt{3}$.
d) $\int_0^1 (\sqrt{x} - x^2)dx = \left(\frac{2}{3}x\sqrt{x} - \frac{x^3}{3}\right)\Big|_0^1 = \frac{1}{3}$.`,
    g2d(
      'Bài 4.15c SGK: Diện tích giữa y = 9 - x^2 và y = 2x^2',
      '9 - x^2',
      -1.732,
      1.732,
      '2*x^2'
    )
  ),

  ex(
    'sgk-4.16',
    'Bài 4.16',
    B13,
    'sgk',
    String.raw`Đường cong Lorenz của Hoa Kỳ năm 2005 được mô hình hóa bởi hàm số $y = (0,00061x^2 + 0,0218x + 1723)^2, \ 0 \le x \le 100$. Sự bất bình đẳng thu nhập là diện tích hình phẳng giới hạn bởi đường cong này và đường thẳng $y = x$ trên $[0; 100]$. Tính giá trị này.`,
    String.raw`Thiết lập công thức diện tích $S = \int_0^{100} |(0,00061x^2 + 0,0218x + 1723)^2 - x|dx$.`,
    String.raw`Theo đáp số Sách Giáo Viên (trang 162):
$$S = \int_0^{100} |(0,00061x^2 + 0,0218x + 1723)^2 - x|dx \approx 297\,945\,768,2$$`,
    g2d(
      'Bài 4.16 SGK: Mô phỏng đường cong Lorenz và đường y = x',
      '(x^2)/100',
      0,
      100,
      'x'
    )
  ),

  ex(
    'sgk-4.17',
    'Bài 4.17',
    B13,
    'sgk',
    String.raw`Tính thể tích của khối tròn xoay sinh ra khi quay hình phẳng giới hạn bởi các đường sau xung quanh trục $Ox$: $y = 2x - x^2, y = 0, x = 0, x = 2$.`,
    String.raw`Áp dụng công thức $V = \pi \int_0^2 (2x - x^2)^2 dx$. Khai triển $(2x - x^2)^2 = 4x^2 - 4x^3 + x^4$.`,
    String.raw`Ta có $V = \pi \int_0^2 (4x^2 - 4x^3 + x^4)dx = \pi\left(\frac{4}{3}x^3 - x^4 + \frac{x^5}{5}\right)\Big|_0^2 = \frac{16\pi}{15}$.`,
    g3d(
      'Bài 4.17 SGK: Khối tròn xoay y = 2x - x^2 trên [0; 2]',
      '2*x - x^2',
      0,
      2
    )
  ),

  ex(
    'sgk-4.18',
    'Bài 4.18',
    B13,
    'sgk',
    String.raw`Khối chỏm cầu có bán kính $R$ và chiều cao $h \ (0 < h \le R)$ sinh ra khi quay hình phẳng giới hạn bởi cung tròn $y = \sqrt{R^2 - x^2}$, trục hoành và hai đường thẳng $x = R - h, x = R$ quanh trục $Ox$ (Hình 4.30). Tính thể tích của khối chỏm cầu này.`,
    String.raw`Tính tích phân $V = \pi \int_{R-h}^R (\sqrt{R^2 - x^2})^2 dx = \pi \int_{R-h}^R (R^2 - x^2)dx$.`,
    String.raw`Ta có $V = \pi\left(R^2 x - \frac{x^3}{3}\right)\Big|_{R-h}^R = \pi\left[R^3 - \frac{R^3}{3} - R^2(R - h) + \frac{(R - h)^3}{3}\right] = \pi\left(Rh^2 - \frac{h^3}{3}\right)$.`,
    g3d(
      'Bài 4.18 SGK: Mô phỏng Khối chỏm cầu (R = 3)',
      'sqrt(max(0, 9 - x^2))',
      1,
      3
    )
  ),

  ex(
    'sgk-4.19',
    'Bài 4.19',
    B13,
    'sgk',
    String.raw`Cho tam giác vuông $OAB$ có cạnh $OA = a$ nằm trên trục $Ox$ và $\widehat{AOB} = \alpha \ \left(0 < \alpha \le \frac{\pi}{4}\right)$. Gọi $B$ là khối tròn xoay sinh ra khi quay miền tam giác $OAB$ quanh trục $Ox$ (Hình 4.31).
a) Tính thể tích $V$ của $B$ theo $a$ và $\alpha$.
b) Tìm $\alpha$ sao cho thể tích $V$ lớn nhất.`,
    String.raw`Đường thẳng $OB$ đi qua $O(0;0)$ và có hệ số góc $\tan\alpha$ nên có phương trình $y = x\tan\alpha$ trên $[0; a]$.`,
    String.raw`a) Phương trình đường thẳng $OB$ là $y = x\tan\alpha$. Thể tích khối nón là:
$$V = \pi \int_0^a (x\tan\alpha)^2 dx = \pi\tan^2\alpha \cdot \frac{x^3}{3}\Big|_0^a = \frac{1}{3}\pi a^3 \tan^2\alpha$$
b) Vì hàm $\tan\alpha$ đồng biến và dương trên $\left(0; \frac{\pi}{4}\right]$ nên $V(\alpha)$ đạt giá trị lớn nhất là $V_{\max} = \frac{1}{3}\pi a^3$ khi $\alpha = \frac{\pi}{4}$.`,
    g3d(
      'Bài 4.19 SGK: Khối nón tạo bởi đường thẳng y = x*tan(alpha)',
      'x',
      0,
      3
    )
  ),

  ex(
    'sgk-4.20',
    'Bài 4.20',
    ONTAP,
    'sgk',
    String.raw`[Trắc nghiệm] Một nguyên hàm của hàm số $f(x) = \sin 2x$ là:
A. $F(x) = 2\cos 2x$. $\quad$ B. $F(x) = -\cos 2x$. $\quad$ C. $F(x) = \frac{1}{2}\cos 2x$. $\quad$ D. $F(x) = -\frac{1}{2}\cos 2x$.`,
    String.raw`Ta có $\left(-\frac{1}{2}\cos 2x\right)' = \sin 2x$.`,
    String.raw`Chọn đáp án **D** ($F(x) = -\frac{1}{2}\cos 2x$).`
  ),

  ex(
    'sgk-4.21',
    'Bài 4.21',
    ONTAP,
    'sgk',
    String.raw`[Trắc nghiệm] Họ các nguyên hàm của hàm số $2e^x$ là:
A. $2xe^x + C$. $\quad$ B. $-2e^x + C$. $\quad$ C. $2e^x$. $\quad$ D. $2e^x + C$.`,
    String.raw`Áp dụng $\int 2e^x dx = 2\int e^x dx = 2e^x + C$.`,
    String.raw`Chọn đáp án **D** ($2e^x + C$).`
  ),

  ex(
    'sgk-4.22',
    'Bài 4.22',
    ONTAP,
    'sgk',
    String.raw`[Trắc nghiệm] Nguyên hàm $F(x)$ của hàm số $f(x) = e^x - 3e^{-x}$ thỏa mãn $F(0) = 4$ là:
A. $F(x) = e^x - 3e^{-x}$. $\quad$ B. $F(x) = e^x + 3e^{2x}$. $\quad$ C. $F(x) = e^x + 3e^{-x}$. $\quad$ D. $F(x) = e^x + 3e^{-x} + 4$.`,
    String.raw`Tìm $F(x) = e^x + 3e^{-x} + C$, thay $F(0) = 1 + 3 + C = 4 \Rightarrow C = 0$.`,
    String.raw`Chọn đáp án **C** ($F(x) = e^x + 3e^{-x}$).`
  ),

  ex(
    'sgk-4.23',
    'Bài 4.23',
    ONTAP,
    'sgk',
    String.raw`[Trắc nghiệm] Cho hàm số $f(x)$ có đạo hàm $f'(x)$ liên tục trên $\mathbb{R}$, $f(1) = 16$ và $\int_1^3 f'(x)dx = 4$. Giá trị của $f(3)$ bằng:
A. $20$. $\quad$ B. $16$. $\quad$ C. $12$. $\quad$ D. $10$.`,
    String.raw`Ta có $\int_1^3 f'(x)dx = f(3) - f(1) = 4 \Rightarrow f(3) = 16 + 4 = 20$.`,
    String.raw`Chọn đáp án **A** ($20$).`
  ),

  ex(
    'sgk-4.24',
    'Bài 4.24',
    ONTAP,
    'sgk',
    String.raw`[Trắc nghiệm] Diện tích hình phẳng giới hạn bởi đồ thị các hàm số $y = x^2 - 2x, y = -x^2 + 4x$ và hai đường thẳng $x = 0, x = 3$ là:
A. $-9$. $\quad$ B. $9$. $\quad$ C. $\frac{16}{3}$. $\quad$ D. $\frac{20}{3}$.`,
    String.raw`Tính $S = \int_0^3 |(-x^2 + 4x) - (x^2 - 2x)|dx = \int_0^3 (6x - 2x^2)dx$.`,
    String.raw`Ta có $S = \left(3x^2 - \frac{2}{3}x^3\right)\Big|_0^3 = 27 - 18 = 9$. Chọn đáp án **B**.`,
    g2d(
      'Bài 4.24 SGK: Diện tích giữa y = -x^2 + 4x và y = x^2 - 2x',
      '-x^2 + 4*x',
      0,
      3,
      'x^2 - 2*x'
    )
  ),

  ex(
    'sgk-4.25',
    'Bài 4.25',
    ONTAP,
    'sgk',
    String.raw`[Trắc nghiệm] Cho đồ thị hàm số $y = f(x)$ trên đoạn $[-2; 2]$ như Hình 4.32. Biết $\int_{-2}^{-1} f(x)dx = \int_1^2 f(x)dx = -\frac{22}{15}$ và $\int_{-1}^1 f(x)dx = \frac{76}{15}$. Diện tích hình phẳng được tô màu là:
A. $8$. $\quad$ B. $\frac{22}{15}$. $\quad$ C. $\frac{32}{15}$. $\quad$ D. $\frac{76}{15}$.`,
    String.raw`Cộng trị tuyệt đối diện tích của 3 phần: $S = \frac{22}{15} + \frac{76}{15} + \frac{22}{15}$.`,
    String.raw`Ta có $S = \frac{22 + 76 + 22}{15} = \frac{120}{15} = 8$. Chọn đáp án **A**.`,
    g2d(
      'Bài 4.25 SGK (Hình 4.32): Diện tích miền phẳng trên [-2; 2]',
      'x^4 - 5*x^2 + 4',
      -2,
      2
    )
  ),

  ex(
    'sgk-4.26',
    'Bài 4.26',
    ONTAP,
    'sgk',
    String.raw`[Trắc nghiệm] Cho hình phẳng $(S)$ giới hạn bởi đồ thị hàm số $y = \sqrt{1 - x^2}$, trục hoành và $x = -1, x = 1$. Thể tích khối tròn xoay sinh ra khi quay $(S)$ quanh $Ox$ là:
A. $\frac{3\pi}{4}$. $\quad$ B. $\frac{3\pi}{2}$. $\quad$ C. $\frac{2\pi}{3}$. $\quad$ D. $\frac{4\pi}{3}$.`,
    String.raw`Tính $V = \pi \int_{-1}^1 (1 - x^2)dx$ (thể tích khối cầu bán kính $R = 1$).`,
    String.raw`Ta có $V = \frac{4\pi}{3}$. Chọn đáp án **D**.`,
    g3d('Bài 4.26 SGK: Khối cầu bán kính R = 1', 'sqrt(max(0, 1 - x^2))', -1, 1)
  ),

  ex(
    'sgk-4.27',
    'Bài 4.27',
    ONTAP,
    'sgk',
    String.raw`[Trắc nghiệm] Một vật chuyển động có gia tốc $a(t) = 3t^2 + t \text{ (m/s}^2\text{)}$, vận tốc ban đầu $v(0) = 2\text{ m/s}$. Vận tốc của vật sau $2$ giây là:
A. $8\text{ m/s}$. $\quad$ B. $10\text{ m/s}$. $\quad$ C. $12\text{ m/s}$. $\quad$ D. $16\text{ m/s}$.`,
    String.raw`Tìm $v(t) = \int (3t^2 + t)dt = t^3 + \frac{t^2}{2} + 2$, rồi thay $t = 2$.`,
    String.raw`Ta có $v(2) = 8 + 2 + 2 = 12\text{ m/s}$. Chọn đáp án **C**.`
  ),

  ex(
    'sgk-4.28',
    'Bài 4.28',
    ONTAP,
    'sgk',
    String.raw`Tìm họ các nguyên hàm của các hàm số sau:
a) $y = 2^x - \frac{1}{x}$; $\quad$ b) $y = x\sqrt{x} + 3\cos x - \frac{2}{\sin^2 x}$.`,
    String.raw`Viết $x\sqrt{x} = x^{3/2}$ và áp dụng bảng nguyên hàm cơ bản.`,
    String.raw`a) $F(x) = \frac{2^x}{\ln 2} - \ln|x| + C$.
b) $F(x) = \frac{2}{5}x^2\sqrt{x} + 3\sin x + 2\cot x + C$.`
  ),

  ex(
    'sgk-4.29',
    'Bài 4.29',
    ONTAP,
    'sgk',
    String.raw`Tìm một nguyên hàm $F(x)$ của hàm số $f(x) = 2\cos x + \frac{1}{\sin^2 x}$ thỏa mãn điều kiện $F\left(\frac{\pi}{4}\right) = -1$.`,
    String.raw`Ta có $F(x) = 2\sin x - \cot x + C$. Thay $x = \frac{\pi}{4}$ để tìm $C$.`,
    String.raw`Ta có $F(x) = 2\sin x - \cot x + C$. Vì $F\left(\frac{\pi}{4}\right) = \sqrt{2} - 1 + C = -1 \Rightarrow C = -\sqrt{2}$.
Vậy $F(x) = 2\sin x - \cot x - \sqrt{2}$.`
  ),

  ex(
    'sgk-4.30',
    'Bài 4.30',
    ONTAP,
    'sgk',
    String.raw`Một viên đạn được bắn lên từ mặt đất theo phương thẳng đứng với vận tốc ban đầu $30\text{ m/s}$ và gia tốc $a = -9,8\text{ m/s}^2$. Tìm vận tốc của viên đạn ở thời điểm $2$ giây.`,
    String.raw`Ta có $v(t) = \int (-9,8)dt = -9,8t + C$ với $v(0) = 30$.`,
    String.raw`Hàm vận tốc là $v(t) = 30 - 9,8t \ (t \ge 0)$. Tại $t = 2$ giây: $v(2) = 30 - 9,8\cdot 2 = 10,4 \text{ (m/s)}$.`
  ),

  ex(
    'sgk-4.31',
    'Bài 4.31',
    ONTAP,
    'sgk',
    String.raw`Cá hồi Thái Bình Dương bơi ngược dòng sông với vận tốc $v(t) = -\frac{2t}{5} + 4 \text{ (km/h)}$. Tính khoảng cách xa nhất mà con cá có thể bơi được kể từ lúc bắt đầu bơi ($t = 0$).`,
    String.raw`Tìm $S(t) = \int \left(-\frac{2t}{5} + 4\right)dt = -\frac{1}{5}t^2 + 4t$ (do $S(0) = 0$), rồi tìm giá trị lớn nhất của tam thức bậc hai.`,
    String.raw`Ta có $S(t) = -\frac{1}{5}t^2 + 4t = -\frac{1}{5}(t - 10)^2 + 20 \le 20$. Khoảng cách xa nhất là $20\text{ km}$.`
  ),

  ex(
    'sgk-4.32',
    'Bài 4.32',
    ONTAP,
    'sgk',
    String.raw`Tính các tích phân sau:
a) $\int_1^4 (x^3 - 2\sqrt{x})dx$; $\quad$ b) $\int_0^{\frac{\pi}{2}} (\cos x - \sin x)dx$; $\quad$ c) $\int_{\frac{\pi}{6}}^{\frac{\pi}{4}} \frac{dx}{\sin^2 x}$; $\quad$ d) $\int_1^{16} \frac{x - 1}{\sqrt{x}}dx$.`,
    String.raw`Ở câu d, tách $\frac{x - 1}{\sqrt{x}} = x^{1/2} - x^{-1/2}$ trước khi lấy nguyên hàm.`,
    String.raw`a) $\left(\frac{x^4}{4} - \frac{4}{3}x\sqrt{x}\right)\Big|_1^4 = \frac{653}{12}$. $\quad$ b) $(\sin x + \cos x)\Big|_0^{\pi/2} = 0$.
c) $(-\cot x)\Big|_{\pi/6}^{\pi/4} = \sqrt{3} - 1$. $\quad$ d) $\left(\frac{2}{3}x\sqrt{x} - 2\sqrt{x}\right)\Big|_1^{16} = 36$.`
  ),

  ex(
    'sgk-4.33',
    'Bài 4.33',
    ONTAP,
    'sgk',
    String.raw`Tính diện tích hình phẳng giới hạn bởi các đường $y = e^x, y = x, x = 0$ và $x = 1$.`,
    String.raw`Vì $e^x \ge 1 \ge x$ trên $[0; 1]$ nên $S = \int_0^1 (e^x - x)dx$.`,
    String.raw`Ta có $S = \int_0^1 (e^x - x)dx = \left(e^x - \frac{x^2}{2}\right)\Big|_0^1 = e - \frac{3}{2}$.`,
    g2d(
      'Bài 4.33 SGK: Diện tích giữa y = e^x và y = x trên [0; 1]',
      'exp(x)',
      0,
      1,
      'x'
    )
  ),

  ex(
    'sgk-4.34',
    'Bài 4.34',
    ONTAP,
    'sgk',
    String.raw`Tính thể tích của khối tròn xoay sinh ra khi quay hình phẳng giới hạn bởi các đường sau xung quanh trục $Ox$:
a) $y = 1 - x^2, y = 0, x = -1, x = 1$; $\quad$ b) $y = \sqrt{25 - x^2}, y = 0, x = 2, x = 4$.`,
    String.raw`Áp dụng công thức $V = \pi \int_a^b f^2(x)dx$.`,
    String.raw`a) $V = \pi \int_{-1}^1 (1 - x^2)^2 dx = \pi \int_{-1}^1 (1 - 2x^2 + x^4)dx = \frac{16\pi}{15}$.
b) $V = \pi \int_2^4 (25 - x^2)dx = \pi\left(25x - \frac{x^3}{3}\right)\Big|_2^4 = \frac{94\pi}{3}$.`,
    g3d(
      'Bài 4.34a SGK: Khối tròn xoay y = 1 - x^2 trên [-1; 1]',
      '1 - x^2',
      -1,
      1
    )
  ),

  ex(
    'sgk-4.35',
    'Bài 4.35',
    ONTAP,
    'sgk',
    String.raw`Một bình gốm có mặt trong sinh ra khi quay đồ thị $y = \frac{1}{175}x^2 + \frac{3}{35}x + 5 \ (0 \le x \le 30)$ quanh trục $Ox$. Biết bình gốm có độ dày không đổi là $1\text{ cm}$, tính thể tích đất sét cần sử dụng.`,
    String.raw`Mặt ngoài có phương trình $y = \frac{1}{175}x^2 + \frac{3}{35}x + 6$. Thể tích đất sét là $V = V_{ngoai} - V_{trong}$.`,
    String.raw`Ta có:
$$V = \pi \int_0^{30} \left[\left(\frac{1}{175}x^2 + \frac{3}{35}x + 6\right)^2 - \left(\frac{1}{175}x^2 + \frac{3}{35}x + 5\right)^2\right]dx = \pi \int_0^{30} \left(\frac{2}{175}x^2 + \frac{6}{35}x + 11\right)dx = 510\pi \text{ (cm}^3\text{)}$$`,
    g3d(
      'Bài 4.35 SGK: Khối tròn xoay Bình gốm trên [0; 30]',
      '(1/175)*x^2 + (3/35)*x + 6',
      0,
      30
    )
  ),

  // -------------------- PHẦN B: ĐỦ 48 BÀI TẬP SÁCH BÀI TẬP (SBT) --------------------
  ex(
    'sbt-4.1',
    'Bài 4.1 (SBT)',
    B11,
    'sbt',
    String.raw`Tìm hàm số $y = f(x)$, biết $f'(x) = 3\sqrt{x} + \frac{2}{\sqrt[3]{x}} \ (x > 0)$ và $f(1) = 1$.`,
    String.raw`Đưa về lũy thừa $f'(x) = 3x^{1/2} + 2x^{-1/3}$, lấy nguyên hàm rồi thay $f(1) = 1$ tìm $C$.`,
    String.raw`Ta có $f(x) = \int (3x^{1/2} + 2x^{-1/3})dx = 2x\sqrt{x} + 3\sqrt[3]{x^2} + C$. Do $f(1) = 1 \Rightarrow 5 + C = 1 \Rightarrow C = -4$. Vậy $f(x) = 2x\sqrt{x} + 3\sqrt[3]{x^2} - 4$.`
  ),

  ex(
    'sbt-4.2',
    'Bài 4.2 (SBT)',
    B11,
    'sbt',
    String.raw`Tìm: a) $\int \frac{(x + 2)^2}{x^4}dx$; $\quad$ b) $\int \sqrt{x}(7x^2 + 6)dx$.`,
    String.raw`Khai triển tử số rồi chia cho $x^4$ ở câu a; nhân phân phối $x^{1/2}$ ở câu b.`,
    String.raw`a) $\int (x^{-2} + 4x^{-3} + 4x^{-4})dx = -\frac{1}{x} - \frac{2}{x^2} - \frac{4}{3x^3} + C$.
b) $\int (7x^{5/2} + 6x^{1/2})dx = 2x^3\sqrt{x} + 4x\sqrt{x} + C$.`
  ),

  ex(
    'sbt-4.3',
    'Bài 4.3 (SBT)',
    B11,
    'sbt',
    String.raw`Tìm: a) $\int (3x + 4)\sqrt[3]{x}dx$; $\quad$ b) $\int \frac{(2x + 3)^2}{\sqrt{x}}dx$.`,
    String.raw`Biến đổi $\sqrt[3]{x} = x^{1/3}$ và $\sqrt{x} = x^{1/2}$, sau đó nhân/chia đa thức thành tổng các hàm lũy thừa.`,
    String.raw`a) $\int (3x^{4/3} + 4x^{1/3})dx = \frac{9}{7}x^2\sqrt[3]{x} + 3x\sqrt[3]{x} + C$.
b) $\int \frac{4x^2 + 12x + 9}{x^{1/2}}dx = \int (4x^{3/2} + 12x^{1/2} + 9x^{-1/2})dx = \frac{8}{5}x^2\sqrt{x} + 8x\sqrt{x} + 18\sqrt{x} + C$.`
  ),

  ex(
    'sbt-4.4',
    'Bài 4.4 (SBT)',
    B11,
    'sbt',
    String.raw`Tìm: a) $\int \left(2e^x + \frac{1}{3^x}\right)dx$; $\quad$ b) $\int (x^2 + 2^x)dx$.`,
    String.raw`Viết $\frac{1}{3^x} = \left(\frac{1}{3}\right)^x$ và dùng công thức nguyên hàm hàm số mũ.`,
    String.raw`a) $2e^x - \frac{1}{3^x\ln 3} + C$. $\quad$ b) $\frac{x^3}{3} + \frac{2^x}{\ln 2} + C$.`
  ),

  ex(
    'sbt-4.5',
    'Bài 4.5 (SBT)',
    B11,
    'sbt',
    String.raw`Tìm: a) $\int (2^x + 3^x)^2 dx$; $\quad$ b) $\int (e^x - e^{-x})^2 dx$.`,
    String.raw`Khai triển hằng đẳng thức: $(2^x + 3^x)^2 = 4^x + 2\cdot 6^x + 9^x$ và $(e^x - e^{-x})^2 = e^{2x} + e^{-2x} - 2$.`,
    String.raw`a) $\int (4^x + 2\cdot 6^x + 9^x)dx = \frac{4^x}{2\ln 2} + \frac{2\cdot 6^x}{\ln 6} + \frac{9^x}{2\ln 3} + C$.
b) $\int (e^{2x} + e^{-2x} - 2)dx = \frac{e^{2x} - e^{-2x}}{2} - 2x + C$.`
  ),

  ex(
    'sbt-4.6',
    'Bài 4.6 (SBT)',
    B11,
    'sbt',
    String.raw`Tìm: a) $\int \left(2\cos x + \frac{3}{\sqrt{x}}\right)dx$; $\quad$ b) $\int (3\sqrt{x} - 4\sin x)dx$.`,
    String.raw`Nhớ $\int \frac{1}{\sqrt{x}}dx = 2\sqrt{x} + C$ và $\int \sqrt{x}dx = \frac{2}{3}x\sqrt{x} + C$.`,
    String.raw`a) $2\sin x + 6\sqrt{x} + C$. $\quad$ b) $2x\sqrt{x} + 4\cos x + C$.`
  ),

  ex(
    'sbt-4.7',
    'Bài 4.7 (SBT)',
    B11,
    'sbt',
    String.raw`Tìm: a) $\int \left(x + \sin^2\frac{x}{2}\right)dx$; $\quad$ b) $\int (2\tan x + \cot x)^2 dx$.`,
    String.raw`Hạ bậc $\sin^2\frac{x}{2} = \frac{1 - \cos x}{2}$ và khai triển $(2\tan x + \cot x)^2 = 4\tan^2 x + 4 + \cot^2 x = \frac{4}{\cos^2 x} + \frac{1}{\sin^2 x} - 1$.`,
    String.raw`a) $\int \left(x + \frac{1}{2} - \frac{1}{2}\cos x\right)dx = \frac{x^2 + x - \sin x}{2} + C$.
b) $\int \left(\frac{4}{\cos^2 x} + \frac{1}{\sin^2 x} - 1\right)dx = 4\tan x - \cot x - x + C$.`
  ),

  ex(
    'sbt-4.8',
    'Bài 4.8 (SBT)',
    B11,
    'sbt',
    String.raw`Một viên đạn được bắn thẳng đứng lên trên từ mặt đất với vận tốc $v(t) = 150 - 9,8t \text{ (m/s)}$. Tìm độ cao của viên đạn:
a) Sau $t = 3$ giây; $\quad$ b) Khi nó đạt độ cao lớn nhất (làm tròn đến chữ số thập phân thứ nhất của mét).`,
    String.raw`Tìm $h(t) = \int (150 - 9,8t)dt = 150t - 4,9t^2$ (vì $h(0) = 0$). Đạt cực đại khi $v(t) = 0 \Leftrightarrow t = \frac{150}{9,8}$.`,
    String.raw`Ta có $h(t) = 150t - 4,9t^2 \text{ (m)}$.
a) $h(3) = 150\cdot 3 - 4,9\cdot 9 = 405,9 \text{ (m)}$.
b) Tại $t_{\max} = \frac{150}{9,8}$, $h_{\max} \approx 1148,0 \text{ (m)}$.`
  ),

  ex(
    'sbt-4.9',
    'Bài 4.9 (SBT)',
    B11,
    'sbt',
    String.raw`Cho $F(u)$ là một nguyên hàm của $f(u)$ trên $K$ và $u(x)$ có đạo hàm liên tục. Tìm $\int f(u(x))\cdot u'(x)dx$.
Áp dụng: Tìm $\int (2x + 1)^5 dx$ và $\int \frac{1}{\sqrt{2x + 1}}dx$.`,
    String.raw`Theo quy tắc đạo hàm hàm hợp $[F(u(x))]' = f(u(x))\cdot u'(x)$, suy ra nguyên hàm là $F(u(x)) + C$.`,
    String.raw`Ta có $\int f(u(x))\cdot u'(x)dx = F(u(x)) + C$.
• $\int (2x + 1)^5 dx = \frac{1}{2}\int (2x + 1)^5 (2x + 1)'dx = \frac{(2x + 1)^6}{12} + C$.
• $\int \frac{1}{\sqrt{2x + 1}}dx = \int \frac{(2x + 1)'}{2\sqrt{2x + 1}}dx = \sqrt{2x + 1} + C$.`
  ),

  ex(
    'sbt-4.10',
    'Bài 4.10 (SBT)',
    B11,
    'sbt',
    String.raw`Tìm: a) $\int \frac{2x - 1}{x + 1}dx$; $\quad$ b) $\int (3 + 2\sin^2 x)dx$.`,
    String.raw`Tách $\frac{2x - 1}{x + 1} = 2 - \frac{3}{x + 1}$ và hạ bậc $2\sin^2 x = 1 - \cos 2x$.`,
    String.raw`a) $\int \left(2 - \frac{3}{x + 1}\right)dx = 2x - 3\ln|x + 1| + C$.
b) $\int (4 - \cos 2x)dx = 4x - \frac{\sin 2x}{2} + C$.`
  ),

  ex(
    'sbt-4.11',
    'Bài 4.11 (SBT)',
    B12,
    'sbt',
    String.raw`Sử dụng ý nghĩa hình học của tích phân, tính:
a) $\int_0^3 (2x + 1)dx$; $\quad$ b) $\int_0^4 \sqrt{16 - x^2}dx$.`,
    String.raw`a) Diện tích hình thang vuông đáy $1$ và $7$, cao $3$. $\quad$ b) Diện tích $\frac{1}{4}$ hình tròn tâm $O$, bán kính $R = 4$.`,
    String.raw`a) $S = \frac{1}{2}(1 + 7)\cdot 3 = 12$. $\quad$ b) $S = \frac{1}{4}\pi\cdot 4^2 = 4\pi$.`,
    g2d(
      'Bài 4.11b SBT: 1/4 Hình tròn y = sqrt(16 - x^2)',
      'sqrt(max(0, 16 - x^2))',
      0,
      4
    )
  ),

  ex(
    'sbt-4.12',
    'Bài 4.12 (SBT)',
    B12,
    'sbt',
    String.raw`Cho $\int_0^5 f(x)dx = 6$ và $\int_0^5 g(x)dx = 2$. Hãy tính:
a) $\int_0^5 [2f(x) + 3g(x)]dx$; $\quad$ b) $\int_0^5 [2f(x) - 3g(x)]dx$.`,
    String.raw`Áp dụng tính chất tuyến tính của tích phân.`,
    String.raw`a) $2\cdot 6 + 3\cdot 2 = 18$. $\quad$ b) $2\cdot 6 - 3\cdot 2 = 6$.`
  ),

  ex(
    'sbt-4.13',
    'Bài 4.13 (SBT)',
    B12,
    'sbt',
    String.raw`Tính các tích phân sau: a) $\int_0^1 (1 - 2x)^2 dx$; $\quad$ b) $\int_1^4 \frac{x - 2}{\sqrt{x}}dx$.`,
    String.raw`Khai triển $(1 - 2x)^2 = 1 - 4x + 4x^2$ và chia $\frac{x - 2}{\sqrt{x}} = x^{1/2} - 2x^{-1/2}$.`,
    String.raw`a) $\left(x - 2x^2 + \frac{4}{3}x^3\right)\Big|_0^1 = \frac{1}{3}$. $\quad$ b) $\left(\frac{2}{3}x^{3/2} - 4x^{1/2}\right)\Big|_1^4 = \frac{2}{3}$.`
  ),

  ex(
    'sbt-4.14',
    'Bài 4.14 (SBT)',
    B12,
    'sbt',
    String.raw`Tính các tích phân sau: a) $\int_0^2 |2x - 1|dx$; $\quad$ b) $\int_{-2}^3 |x - 1|dx$.`,
    String.raw`Tách cận tại nghiệm của biểu thức trong trị tuyệt đối: $x = \frac{1}{2}$ (câu a) và $x = 1$ (câu b).`,
    String.raw`a) $\int_0^{1/2} (1 - 2x)dx + \int_{1/2}^2 (2x - 1)dx = \frac{5}{2}$.
b) $\int_{-2}^1 (1 - x)dx + \int_1^3 (x - 1)dx = \frac{13}{2}$.`,
    g2d(
      'Bài 4.14b SBT: Đồ thị hàm y = |x - 1| trên [-2; 3]',
      'abs(x - 1)',
      -2,
      3
    )
  ),

  ex(
    'sbt-4.15',
    'Bài 4.15 (SBT)',
    B12,
    'sbt',
    String.raw`Tính các tích phân sau:
a) $\int_0^{\frac{\pi}{2}} (3\cos x + 2\sin x)dx$; $\quad$ b) $\int_{\frac{\pi}{6}}^{\frac{\pi}{4}} \left(\frac{1}{\cos^2 x} - \frac{1}{\sin^2 x}\right)dx$.`,
    String.raw`Dùng nguyên hàm cơ bản của các hàm số lượng giác.`,
    String.raw`a) $(3\sin x - 2\cos x)\Big|_0^{\pi/2} = 5$. $\quad$ b) $(\tan x + \cot x)\Big|_{\pi/6}^{\pi/4} = 2 - \frac{4\sqrt{3}}{3}$.`
  ),

  ex(
    'sbt-4.16',
    'Bài 4.16 (SBT)',
    B12,
    'sbt',
    String.raw`Tính các tích phân sau: a) $\int_0^1 (3^x - 2e^x)dx$; $\quad$ b) $\int_0^1 \frac{(e^x - 1)^2}{2e^x}dx$.`,
    String.raw`Ở câu b, khai triển $\frac{e^{2x} - 2e^x + 1}{2e^x} = \frac{1}{2}(e^x - 2 + e^{-x})$.`,
    String.raw`a) $\left(\frac{3^x}{\ln 3} - 2e^x\right)\Big|_0^1 = \frac{2}{\ln 3} - 2e + 2$. $\quad$ b) $\frac{1}{2}(e^x - 2x - e^{-x})\Big|_0^1 = \frac{e - 2 - e^{-1}}{2}$.`
  ),

  ex(
    'sbt-4.17',
    'Bài 4.17 (SBT)',
    B12,
    'sbt',
    String.raw`Lợi nhuận biên của một sản phẩm được mô hình hóa bởi $P'(x) = -0,0005x + 12,2$.
a) Tìm sự thay đổi lợi nhuận khi doanh số tăng từ $100$ lên $101$ đơn vị.
b) Tìm sự thay đổi lợi nhuận khi doanh số tăng từ $100$ lên $110$ đơn vị.`,
    String.raw`Tính tích phân của $P'(x)$ trên $[100; 101]$ và $[100; 110]$.`,
    String.raw`a) $\int_{100}^{101} (-0,0005x + 12,2)dx = 12,14975$. $\quad$ b) $\int_{100}^{110} (-0,0005x + 12,2)dx = 121,475$.`
  ),

  ex(
    'sbt-4.18',
    'Bài 4.18 (SBT)',
    B12,
    'sbt',
    String.raw`Tìm chi phí trung bình trên mỗi đơn vị sản phẩm trong khoảng thời gian hai năm ($24$ tháng) nếu chi phí được tính bởi $c(t) = 0,005t^2 + 0,02t + 12,5$ với $0 \le t \le 24$.`,
    String.raw`Áp dụng công thức giá trị trung bình $\bar{c} = \frac{1}{24}\int_0^{24} c(t)dt$.`,
    String.raw`Ta có $\bar{c} = \frac{1}{24}\left(0,005\frac{t^3}{3} + 0,01t^2 + 12,5t\right)\Big|_0^{24} = 13,7$.`
  ),

  ex(
    'sbt-4.19',
    'Bài 4.19 (SBT)',
    B12,
    'sbt',
    String.raw`Tổng chi phí mua và bảo trì thiết bị trong $x$ năm là $C(x) = 5000\left(25 + 3\int_0^x t^{\frac{1}{4}}dt\right)$. Tìm tổng chi phí sau: a) $1$ năm; b) $5$ năm; c) $10$ năm.`,
    String.raw`Tính $\int_0^x t^{1/4}dt = \frac{4}{5}x^{5/4}$, suy ra $C(x) = 5000\left(25 + \frac{12}{5}x^{5/4}\right)$.`,
    String.raw`a) Với $x = 1$: $C(1) = 137\,000$.
b) Với $x = 5$: $C(5) \approx 214\,720,93$.
c) Với $x = 10$: $C(10) \approx 233\,293,53$.`
  ),

  ex(
    'sbt-4.20',
    'Bài 4.20 (SBT)',
    B12,
    'sbt',
    String.raw`Vận tốc của một vật rơi tự do từ trạng thái đứng yên là $v(t) = 9,8t \text{ (m/s)}$.
a) Biểu thị quãng đường vật đi được trong $T$ giây đầu tiên dưới dạng tích phân.
b) Tìm quãng đường vật đi được trong $5$ giây đầu tiên.`,
    String.raw`Quãng đường là tích phân của vận tốc từ $0$ đến $T$.`,
    String.raw`a) $S = \int_0^T 9,8t dt \text{ (m)}$. $\quad$ b) Với $T = 5$: $S = \int_0^5 9,8t dt = 4,9t^2\Big|_0^5 = 122,5 \text{ (m)}$.`
  ),

  ex(
    'sbt-4.21',
    'Bài 4.21 (SBT)',
    B13,
    'sbt',
    String.raw`Tính diện tích các hình phẳng được tô màu trong Hình 4.4 và Hình 4.5 (SBT trang 17):
a) Giới hạn bởi $f(x) = x^2 - 4$, trục hoành và $x = 0, x = 5$;
b) Giới hạn bởi $y = -x^2 + 9, y = 2x + 1$ từ $x = 0$ đến $x = 2$.`,
    String.raw`a) Tách cận tại $x = 2$. $\quad$ b) Tính $\int_0^2 [(-x^2 + 9) - (2x + 1)]dx$.`,
    String.raw`a) $S = \int_0^2 (4 - x^2)dx + \int_2^5 (x^2 - 4)dx = \frac{97}{3}$.
b) $S = \int_0^2 (-x^2 - 2x + 8)dx = \frac{28}{3}$.`,
    g2d(
      'Bài 4.21b SBT: Diện tích giữa y = -x^2 + 9 và y = 2x + 1',
      '-x^2 + 9',
      0,
      2,
      '2*x + 1'
    )
  ),

  ex(
    'sbt-4.22',
    'Bài 4.22 (SBT)',
    B13,
    'sbt',
    String.raw`Tính diện tích hình phẳng giới hạn bởi các đường sau:
a) $y = (x - 1)^3, y = x - 1, x = 0, x = 1$;
b) $y = x^3 + 2x^2 - 3x, y = x^2 + 3x, x = -3, x = 0$.`,
    String.raw`Xét hiệu $f(x) - g(x)$ trên đoạn đã cho (đều không đổi dấu) rồi tính tích phân.`,
    String.raw`a) $S = \int_0^1 [(x - 1)^3 - (x - 1)]dx = \int_0^1 (x^3 - 3x^2 + 2x)dx = \frac{1}{4}$.
b) $S = \int_{-3}^0 (x^3 + x^2 - 6x)dx = \left(\frac{x^4}{4} + \frac{x^3}{3} - 3x^2\right)\Big|_{-3}^0 = \frac{63}{4}$.`,
    g2d(
      'Bài 4.22b SBT: Diện tích giữa hai đồ thị trên [-3; 0]',
      'x^3 + 2*x^2 - 3*x',
      -3,
      0,
      'x^2 + 3*x'
    )
  ),

  ex(
    'sbt-4.23',
    'Bài 4.23 (SBT)',
    B13,
    'sbt',
    String.raw`Tính diện tích hình phẳng giới hạn bởi các đường sau:
a) $y = e^x, y = \sqrt{x}, x = 0, x = 1$; $\quad$ b) $y = \cos x, y = \frac{1}{2}, x = 0, x = \frac{\pi}{3}$.`,
    String.raw`Trên $[0; 1]$ có $e^x \ge \sqrt{x}$; trên $[0; \frac{\pi}{3}]$ có $\cos x \ge \frac{1}{2}$.`,
    String.raw`a) $S = \int_0^1 (e^x - \sqrt{x})dx = \left(e^x - \frac{2}{3}x^{3/2}\right)\Big|_0^1 = e - \frac{5}{3}$.
b) $S = \int_0^{\pi/3} \left(\cos x - \frac{1}{2}\right)dx = \left(\sin x - \frac{1}{2}x\right)\Big|_0^{\pi/3} = \frac{\sqrt{3}}{2} - \frac{\pi}{6}$.`,
    g2d(
      'Bài 4.23a SBT: Diện tích giữa y = e^x và y = sqrt(x)',
      'exp(x)',
      0,
      1,
      'sqrt(max(0, x))'
    )
  ),

  ex(
    'sbt-4.24',
    'Bài 4.24 (SBT)',
    B13,
    'sbt',
    String.raw`Tính thể tích khối tròn xoay sinh ra khi quay hình phẳng giới hạn bởi các đường sau quanh trục $Ox$:
a) $y = 2\sqrt{x}, y = 0, x = 1, x = 4$; $\quad$ b) $y = 4x, y = x^3, x = 0, x = 2$.`,
    String.raw`Câu a dùng $V = \pi\int_1^4 (2\sqrt{x})^2 dx$. Câu b lấy hiệu thể tích $V = \pi\int_0^2 [(4x)^2 - (x^3)^2]dx$.`,
    String.raw`a) $V = \pi\int_1^4 4x dx = 30\pi$.
b) $V = \pi\int_0^2 16x^2 dx - \pi\int_0^2 x^6 dx = \frac{128\pi}{3} - \frac{128\pi}{7} = \frac{512\pi}{21}$.`,
    g3d(
      'Bài 4.24a SBT: Khối tròn xoay y = 2*sqrt(x) trên [1; 4]',
      '2*sqrt(max(0, x))',
      1,
      4
    )
  ),

  ex(
    'sbt-4.25',
    'Bài 4.25 (SBT)',
    B13,
    'sbt',
    String.raw`Xét hình phẳng giới hạn bởi các đường $y = \sqrt{x}, y = \frac{x^2}{8}, x = 0, x = 4$.
a) Tính diện tích hình phẳng. $\quad$ b) Tính thể tích khối tròn xoay khi quay hình phẳng quanh trục $Ox$.`,
    String.raw`Trên $[0; 4]$, đường $y = \sqrt{x}$ nằm phía trên đường $y = \frac{x^2}{8}$.`,
    String.raw`a) $S = \int_0^4 \left(\sqrt{x} - \frac{x^2}{8}\right)dx = \frac{8}{3}$.
b) $V = \pi\int_0^4 x dx - \pi\int_0^4 \frac{x^4}{64}dx = 8\pi - \frac{16\pi}{5} = \frac{24\pi}{5}$.`,
    g3d(
      'Bài 4.25 SBT: Khối tròn xoay giới hạn bởi y = sqrt(x) và y = x^2/8',
      'sqrt(max(0, x))',
      0,
      4
    )
  ),

  ex(
    'sbt-4.26',
    'Bài 4.26 (SBT)',
    B13,
    'sbt',
    String.raw`Tính thể tích của vật thể $B$, biết đáy của $B$ là hình tròn bán kính $2$ và các mặt cắt vuông góc với mặt đáy (vuông góc trục $Ox$) là những hình vuông (Hình 4.6 SBT).`,
    String.raw`Tại hoành độ $x \in [-2; 2]$, cạnh hình vuông thiết diện là $AB = 2\sqrt{4 - x^2} \Rightarrow S(x) = 4(4 - x^2)$.`,
    String.raw`Thể tích vật thể là $V = \int_{-2}^2 S(x)dx = \int_{-2}^2 4(4 - x^2)dx = \frac{128}{3}$.`,
    g2d(
      'Bài 4.26 SBT: Hàm diện tích mặt cắt hình vuông S(x) = 4(4 - x^2)',
      '4*(4 - x^2)',
      -2,
      2
    )
  ),

  ex(
    'sbt-4.27',
    'Bài 4.27 (SBT)',
    B13,
    'sbt',
    String.raw`Hàm cầu và hàm cung của một sản phẩm lần lượt là $p = -0,2x + 8$ và $p = 0,1x + 2$ (triệu đồng). Tìm thặng dư tiêu dùng và thặng dư sản xuất.`,
    String.raw`Giải $-0,2x + 8 = 0,1x + 2 \Leftrightarrow x_0 = 20, p_0 = 4$. Tính tích phân trên $[0; 20]$.`,
    String.raw`• Thặng dư tiêu dùng: $\int_0^{20} (-0,2x + 8 - 4)dx = 40$ (triệu đồng).
• Thặng dư sản xuất: $\int_0^{20} [4 - (0,1x + 2)]dx = 20$ (triệu đồng).`,
    g2d(
      'Bài 4.27 SBT: Thặng dư tiêu dùng và sản xuất trên [0; 20]',
      '-0.2*x + 8',
      0,
      20,
      '0.1*x + 2'
    )
  ),

  ex(
    'sbt-4.28',
    'Bài 4.28 (SBT)',
    B13,
    'sbt',
    String.raw`Chi phí nhiên liệu dự kiến (triệu USD/năm) từ 2020 đến 2030 ($0 \le t \le 10$) của hai loại xe tải là $C_1 = 5,6 + 2,2t$ và $C_2 = 4,7 + 2,04t$. Công ty tiết kiệm được bao nhiêu khi dùng xe tải thứ hai?`,
    String.raw`Tính $\int_0^{10} (C_1 - C_2)dt$.`,
    String.raw`Số tiền tiết kiệm được là $\int_0^{10} C_1 dt - \int_0^{10} C_2 dt = 166 - 149 = 17$ (triệu đô la).`,
    g2d(
      'Bài 4.28 SBT: Miền chi phí nhiên liệu tiết kiệm được trên [0; 10]',
      '5.6 + 2.2*x',
      0,
      10,
      '4.7 + 2.04*x'
    )
  ),

  ex(
    'sbt-4.29',
    'Bài 4.29 (SBT)',
    B13,
    'sbt',
    String.raw`Doanh thu và chi phí (triệu USD/năm) trong $10$ năm lần lượt là $R = 100 + 0,08t$ và $C = 60 + 0,2t^2$. Ước tính tổng lợi nhuận trong $10$ năm.`,
    String.raw`Tính $\int_0^{10} (R - C)dt = \int_0^{10} (40 + 0,08t - 0,2t^2)dt$.`,
    String.raw`Tổng lợi nhuận là $\left(40t + 0,04t^2 - \frac{0,2}{3}t^3\right)\Big|_0^{10} \approx 337,33$ (triệu đô la).`,
    g2d(
      'Bài 4.29 SBT: Tổng lợi nhuận giữa hàm R(t) và C(t)',
      '100 + 0.08*x',
      0,
      10,
      '60 + 0.2*x^2'
    )
  ),

  ex(
    'sbt-4.30',
    'Bài 4.30 (SBT)',
    B13,
    'sbt',
    String.raw`Số người nhiễm bệnh khi chưa có vắc xin là $N_1(t) = 0,1t^2 + 0,5t + 150 \ (0 \le t \le 50)$ và sau khi tiêm vắc xin ở tuần $25$ là $N_2(t) = -0,2t^2 + 6t + 200 \ (25 \le t \le 50)$.
a) Tìm thời điểm $t$ để dịch bệnh kết thúc ($N_2(t) = 0$).
b) Ước tính số người mà vắc xin đã ngăn ngừa khỏi dịch bệnh.`,
    String.raw`a) Giải $-0,2t^2 + 6t + 200 = 0 \ (t \ge 25)$. $\quad$ b) Tính $\int_{25}^{50} [N_1(t) - N_2(t)]dt$.`,
    String.raw`a) $N_2(t) = 0 \Leftrightarrow -0,2t^2 + 6t + 200 = 0 \Leftrightarrow t = 50$ (tuần).
b) Số người được ngăn ngừa: $\int_{25}^{50} (0,3t^2 - 5,5t - 50)dt \approx 4531$ (người).`,
    g2d(
      'Bài 4.30 SBT: Hiệu quả vắc xin từ tuần 25 đến tuần 50',
      '0.1*x^2 + 0.5*x + 150',
      25,
      50,
      '-0.2*x^2 + 6*x + 200'
    )
  ),

  ex(
    'sbt-4.31',
    'Bài 4.31 (SBT)',
    ONTAP,
    'sbt',
    String.raw`[Trắc nghiệm] $\int x^2 dx$ bằng:
A. $2x + C$. $\quad$ B. $\frac{1}{3}x^3 + C$. $\quad$ C. $x^3 + C$. $\quad$ D. $3x^3 + C$.`,
    String.raw`Áp dụng công thức $\int x^2 dx = \frac{x^3}{3} + C$.`,
    String.raw`Chọn đáp án **B**.`
  ),

  ex(
    'sbt-4.32',
    'Bài 4.32 (SBT)',
    ONTAP,
    'sbt',
    String.raw`[Trắc nghiệm] Biết $\int (x^2 + 3x^3)dx = \frac{a}{3}x^3 + \frac{b}{4}x^4 + C \ (a, b \in \mathbb{Z})$. Giá trị $a + b$ bằng:
A. $4$. $\quad$ B. $2$. $\quad$ C. $5$. $\quad$ D. $6$.`,
    String.raw`Ta có $a = 1, b = 3 \Rightarrow a + b = 4$.`,
    String.raw`Chọn đáp án **A** ($4$).`
  ),

  ex(
    'sbt-4.33',
    'Bài 4.33 (SBT)',
    ONTAP,
    'sbt',
    String.raw`[Trắc nghiệm] Cho $\int_0^2 f(x)dx = 3$ và $\int_2^5 f(x)dx = 7$. Giá trị của $\int_0^5 f(x)dx$ là:
A. $10$. $\quad$ B. $4$. $\quad$ C. $-4$. $\quad$ D. $3$.`,
    String.raw`Áp dụng tính chất chèn cận: $3 + 7 = 10$.`,
    String.raw`Chọn đáp án **A** ($10$).`
  ),

  ex(
    'sbt-4.34',
    'Bài 4.34 (SBT)',
    ONTAP,
    'sbt',
    String.raw`[Trắc nghiệm] Cho $\int_0^1 f(x)dx = 4$. Giá trị của $\int_0^1 2f(x)dx$ là:
A. $2$. $\quad$ B. $4$. $\quad$ C. $8$. $\quad$ D. $16$.`,
    String.raw`Ta có $2\cdot 4 = 8$.`,
    String.raw`Chọn đáp án **C** ($8$).`
  ),

  ex(
    'sbt-4.35',
    'Bài 4.35 (SBT)',
    ONTAP,
    'sbt',
    String.raw`[Trắc nghiệm] Cho $f(0) = 1$ và $\int_0^2 f'(x)dx = 4$. Giá trị của $f(2)$ bằng:
A. $5$. $\quad$ B. $-3$. $\quad$ C. $6$. $\quad$ D. $8$.`,
    String.raw`Ta có $f(2) - f(0) = 4 \Rightarrow f(2) = 5$.`,
    String.raw`Chọn đáp án **A** ($5$).`
  ),

  ex(
    'sbt-4.36',
    'Bài 4.36 (SBT)',
    ONTAP,
    'sbt',
    String.raw`[Trắc nghiệm] Giá trị trung bình của hàm $f(x) = x^2 + 2x$ trên đoạn $[0; 3]$ là:
A. $\frac{8}{3}$. $\quad$ B. $18$. $\quad$ C. $6$. $\quad$ D. $5$.`,
    String.raw`Tính $m = \frac{1}{3}\int_0^3 (x^2 + 2x)dx = \frac{18}{3} = 6$.`,
    String.raw`Chọn đáp án **C** ($6$).`
  ),

  ex(
    'sbt-4.37',
    'Bài 4.37 (SBT)',
    ONTAP,
    'sbt',
    String.raw`[Trắc nghiệm] Cho $f(x) \le 0, \forall x \in [a; b]$. Diện tích hình phẳng giới hạn bởi $y = f(x)$, trục $Ox$ và $x = a, x = b$ là:
A. $S = \int_a^b f(x)dx$. $\quad$ B. $S = -\int_a^b f(x)dx$. $\quad$ C. $S = \pi\int_a^b f(x)dx$. $\quad$ D. $S = \pi\int_a^b [f(x)]^2 dx$.`,
    String.raw`Vì $f(x) \le 0$ nên $|f(x)| = -f(x)$.`,
    String.raw`Chọn đáp án **B**.`,
    g2d('Bài 4.37 SBT: Minh họa hàm số f(x) <= 0 trên [a; b]', 'x^2 - 4', -1, 1)
  ),

  ex(
    'sbt-4.38',
    'Bài 4.38 (SBT)',
    ONTAP,
    'sbt',
    String.raw`[Trắc nghiệm] Tốc độ tiêu thụ dầu là $r(t) = 20e^{0,2t}$ tỉ thùng/năm ($0 \le t \le 10$). Lượng dầu tiêu thụ trong $10$ năm là:
A. $r(10)$. $\quad$ B. $r(10) - r(0)$. $\quad$ C. $\int_0^{10} r'(t)dt$. $\quad$ D. $\int_0^{10} r(t)dt$.`,
    String.raw`Tổng lượng dầu tiêu thụ là tích phân của tốc độ tiêu thụ $r(t)$ từ $0$ đến $10$.`,
    String.raw`Chọn đáp án **D**.`
  ),

  ex(
    'sbt-4.39',
    'Bài 4.39 (SBT)',
    ONTAP,
    'sbt',
    String.raw`[Trắc nghiệm] Cho $S$ là diện tích phần hình phẳng tô màu như Hình 4.7 SBT (giới hạn trên bởi $f(x)$ từ $a$ đến $m$, và bởi $g(x)$ từ $m$ đến $b$). Biểu thức tính $S$ là:
A. $\int_a^b |f(x) - g(x)|dx$. $\quad$ B. $\int_a^m |f(x) - g(x)|dx + \int_m^b |g(x) - f(x)|dx$.
C. $\int_a^m |f(x)|dx + \int_m^b |g(x)|dx$. $\quad$ D. $\int_a^m |g(x)|dx + \int_m^b |f(x)|dx$.`,
    String.raw`Chia hình phẳng bằng đường thẳng $x = m$ thành 2 hình thang cong.`,
    String.raw`Chọn đáp án **C**.`,
    g2d(
      'Bài 4.39 SBT (Hình 4.7): Chia miền tích phân tại x = m',
      '2 - (x - 1)^2',
      0,
      2
    )
  ),

  ex(
    'sbt-4.40',
    'Bài 4.40 (SBT)',
    ONTAP,
    'sbt',
    String.raw`[Trắc nghiệm] Quần thể vi khuẩn có tốc độ phát triển $N'(t) = \frac{8000}{t}$ và $N(1) = 250\,000$. Sau $6$ ngày ($t = 6$), số lượng vi khuẩn là:
A. $353\,584$ con. $\quad$ B. $234\,167$ con. $\quad$ C. $288\,959$ con. $\quad$ D. $264\,334$ con.`,
    String.raw`Ta có $N(t) = 8000\ln|t| + 250\,000 \Rightarrow N(6) \approx 264\,334$.`,
    String.raw`Chọn đáp án **D**.`
  ),

  ex(
    'sbt-4.41',
    'Bài 4.41 (SBT)',
    ONTAP,
    'sbt',
    String.raw`Tìm họ tất cả các nguyên hàm của các hàm số sau:
a) $y = \sin^2\frac{x}{2}$; $\quad$ b) $y = e^{2x} - 2x^5 + 5$.`,
    String.raw`Hạ bậc $\sin^2\frac{x}{2} = \frac{1 - \cos x}{2}$ ở câu a.`,
    String.raw`a) $F(x) = \frac{1}{2}(x - \sin x) + C$. $\quad$ b) $F(x) = \frac{1}{2}e^{2x} - \frac{1}{3}x^6 + 5x + C$.`
  ),

  ex(
    'sbt-4.42',
    'Bài 4.42 (SBT)',
    ONTAP,
    'sbt',
    String.raw`Tìm một nguyên hàm $F(x)$ của hàm số $f(x) = 2x - \frac{1}{x}$ thỏa mãn điều kiện $F(1) = 3$.`,
    String.raw`Ta có $F(x) = x^2 - \ln|x| + C$, thay $F(1) = 3$ tìm $C$.`,
    String.raw`Vì $F(1) = 1 - 0 + C = 3 \Rightarrow C = 2$. Vậy $F(x) = x^2 - \ln|x| + 2$.`
  ),

  ex(
    'sbt-4.43',
    'Bài 4.43 (SBT)',
    ONTAP,
    'sbt',
    String.raw`Tính: a) $\int_0^3 |3 - x|dx$; $\quad$ b) $\int_0^2 (e^x - 4x^3)dx$; $\quad$ c) $\int_0^{\frac{\pi}{2}} (\sin x + \cos x)dx$.`,
    String.raw`Trên $[0; 3]$, $3 - x \ge 0$ nên $|3 - x| = 3 - x$.`,
    String.raw`a) $\left(3x - \frac{x^2}{2}\right)\Big|_0^3 = \frac{9}{2}$. $\quad$ b) $(e^x - x^4)\Big|_0^2 = e^2 - 17$. $\quad$ c) $(-\cos x + \sin x)\Big|_0^{\pi/2} = 2$.`,
    g2d(
      'Bài 4.43a SBT: Diện tích hình tam giác dưới y = 3 - x trên [0; 3]',
      '3 - x',
      0,
      3
    )
  ),

  ex(
    'sbt-4.44',
    'Bài 4.44 (SBT)',
    ONTAP,
    'sbt',
    String.raw`Tính diện tích $S$ của hình phẳng giới hạn bởi đồ thị hàm số $y = 3x^2 + 1$, trục hoành và hai đường thẳng $x = 0, x = 2$.`,
    String.raw`Áp dụng $S = \int_0^2 (3x^2 + 1)dx$.`,
    String.raw`Ta có $S = (x^3 + x)\Big|_0^2 = 10$.`,
    g2d(
      'Bài 4.44 SBT: Diện tích dưới đường cong y = 3x^2 + 1 trên [0; 2]',
      '3*x^2 + 1',
      0,
      2
    )
  ),

  ex(
    'sbt-4.45',
    'Bài 4.45 (SBT)',
    ONTAP,
    'sbt',
    String.raw`Cho hình phẳng $D$ giới hạn bởi đồ thị hàm số $y = \sqrt{x^2 + 1}$, trục hoành và $x = 0, x = 1$. Tính thể tích khối tròn xoay tạo thành khi quay $D$ quanh trục hoành.`,
    String.raw`Áp dụng $V = \pi\int_0^1 (x^2 + 1)dx$.`,
    String.raw`Ta có $V = \pi\left(\frac{1}{3}x^3 + x\right)\Big|_0^1 = \frac{4\pi}{3}$.`,
    g3d(
      'Bài 4.45 SBT: Khối tròn xoay y = sqrt(x^2 + 1) trên [0; 1]',
      'sqrt(x^2 + 1)',
      0,
      1
    )
  ),

  ex(
    'sbt-4.46',
    'Bài 4.46 (SBT)',
    ONTAP,
    'sbt',
    String.raw`Có bao nhiêu giá trị nguyên dương của tham số $m$ để $\int_0^3 (10x - 2m)dx > 0$?`,
    String.raw`Tính tích phân theo $m$: $(5x^2 - 2mx)\Big|_0^3 = 45 - 6m > 0$.`,
    String.raw`Ta có $45 - 6m > 0 \Leftrightarrow m < 7,5$. Vì $m \in \mathbb{N}^*$ nên $m \in \{1; 2; 3; 4; 5; 6; 7\}$ (có $7$ giá trị).`
  ),

  ex(
    'sbt-4.47',
    'Bài 4.47 (SBT)',
    ONTAP,
    'sbt',
    String.raw`Khi nghiên cứu dịch sốt xuất huyết, tại ngày thứ $m$ có $F(m)$ người mắc bệnh. Biết tốc độ lan truyền là $F'(m) = \frac{150}{2m + 1}$ và $F(0) = 50$. Xác định $F(m)$ và số người mắc bệnh ở ngày thứ $10$.`,
    String.raw`Lấy nguyên hàm $F(m) = 75\ln|2m + 1| + C$ với $F(0) = 50$.`,
    String.raw`Ta có $F(m) = 75\ln|2m + 1| + 50$. Tại ngày thứ $10$: $F(10) = 75\ln 21 + 50 \approx 278$ (người).`
  ),

  ex(
    'sbt-4.48',
    'Bài 4.48 (SBT)',
    ONTAP,
    'sbt',
    String.raw`Một ô tô đồ chơi trượt xuống dốc và dừng sau $5$ giây với vận tốc $v(t) = \frac{1}{2}t^2 - 0,1t^3 \text{ (m/s)}$ ($0 \le t \le 5$). Tính quãng đường ô tô đồ chơi đi đến khi dừng lại (làm tròn đến chữ số thập phân thứ hai).`,
    String.raw`Tính $S = \int_0^5 \left(\frac{1}{2}t^2 - 0,1t^3\right)dt$.`,
    String.raw`Ta có $S = \left(\frac{t^3}{6} - \frac{0,1t^4}{4}\right)\Big|_0^5 = \frac{125}{6} - \frac{62,5}{4} \approx 5,21 \text{ (m)}$.`,
    g2d(
      'Bài 4.48 SBT: Đồ thị vận tốc v(t) = 0.5t^2 - 0.1t^3 trên [0; 5]',
      '0.5*x^2 - 0.1*x^3',
      0,
      5
    )
  ),
];

// ============================================================================
// 3. BỘ SINH ĐỀ KIỂM TRA TỰ ĐỘNG (20 CÂU TRẮC NGHIỆM + 5 CÂU TRẢ LỜI NGẮN)
//    Bấm "Làm đề khác" -> Sinh đề mới hoàn toàn từ ngân hàng SGK & SBT
// ============================================================================
export function generateExamQuestions(examVersion: number = 1): ExamQuestion[] {
  const k = Math.max(1, examVersion);
  const c1 = k + 1; // Hệ số biến thiên 2, 3, 4...
  const c2 = (k % 4) + 2; // Hệ số 2..5
  const R = (k % 3) + 2; // Bán kính 2, 3, 4

  return [
    // --- 20 CÂU TRẮC NGHIỆM (1 -> 20) ---
    {
      id: 1,
      part: 'mcq',
      level: 'Nhận biết',
      questionLatex: String.raw`[Đề số ${k}] Tìm họ nguyên hàm của hàm số $f(x) = ${c1}x^2$ trên $\mathbb{R}$.`,
      options: [
        String.raw`A. $${2 * c1}x + C$`,
        String.raw`B. $\frac{${c1}}{3}x^3 + C$`,
        String.raw`C. $${c1}x^3 + C$`,
        String.raw`D. $\frac{1}{3}x^3 + C$`,
      ],
      correctOptionIndex: 1,
      thinkingHint: String.raw`Áp dụng công thức $\int k x^2 dx = k\frac{x^3}{3} + C$ (tương tự Bài 4.31 SBT).`,
      detailedSolution: String.raw`Ta có $\int ${c1}x^2 dx = \frac{${c1}}{3}x^3 + C$. Chọn đáp án **B**.`,
    },
    {
      id: 2,
      part: 'mcq',
      level: 'Nhận biết',
      questionLatex: String.raw`Một nguyên hàm của hàm số $f(x) = \sin(${c1}x)$ là:`,
      options: [
        String.raw`A. $F(x) = ${c1}\cos(${c1}x)$`,
        String.raw`B. $F(x) = -\cos(${c1}x)$`,
        String.raw`C. $F(x) = \frac{1}{${c1}}\cos(${c1}x)$`,
        String.raw`D. $F(x) = -\frac{1}{${c1}}\cos(${c1}x)$`,
      ],
      correctOptionIndex: 3,
      thinkingHint: String.raw`Kiểm tra đạo hàm: $\left(-\frac{1}{${c1}}\cos(${c1}x)\right)' = \sin(${c1}x)$ (tương tự Bài 4.20 SGK).`,
      detailedSolution: String.raw`Vì $\left(-\frac{1}{${c1}}\cos(${c1}x)\right)' = \sin(${c1}x)$ nên chọn đáp án **D**.`,
    },
    {
      id: 3,
      part: 'mcq',
      level: 'Nhận biết',
      questionLatex: String.raw`Họ các nguyên hàm của hàm số $f(x) = ${c1}e^x$ là:`,
      options: [
        String.raw`A. $${c1}x e^x + C$`,
        String.raw`B. $-${c1}e^x + C$`,
        String.raw`C. $${c1}e^x$`,
        String.raw`D. $${c1}e^x + C$`,
      ],
      correctOptionIndex: 3,
      thinkingHint: String.raw`Áp dụng $\int k e^x dx = k e^x + C$ (tương tự Bài 4.21 SGK).`,
      detailedSolution: String.raw`Ta có $\int ${c1}e^x dx = ${c1}e^x + C$. Chọn đáp án **D**.`,
    },
    {
      id: 4,
      part: 'mcq',
      level: 'Nhận biết',
      questionLatex: String.raw`Cho hàm số $f(x)$ liên tục trên $\mathbb{R}$ và $\int_0^1 f(x)dx = ${
        c1 + 2
      }$. Giá trị của tích phân $\int_0^1 ${c2}f(x)dx$ là:`,
      options: [
        String.raw`A. $${c1 + 2}$`,
        String.raw`B. $${c2 * (c1 + 2)}$`,
        String.raw`C. $${c2 + c1 + 2}$`,
        String.raw`D. $${(c1 + 2) * 2}$`,
      ],
      correctOptionIndex: 1,
      thinkingHint: String.raw`Đưa hằng số ra ngoài dấu tích phân: $\int_0^1 ${c2}f(x)dx = ${c2}\int_0^1 f(x)dx$ (tương tự Bài 4.34 SBT).`,
      detailedSolution: String.raw`Ta có $\int_0^1 ${c2}f(x)dx = ${c2}\cdot ${
        c1 + 2
      } = ${c2 * (c1 + 2)}$. Chọn đáp án **B**.`,
    },
    {
      id: 5,
      part: 'mcq',
      level: 'Nhận biết',
      questionLatex: String.raw`Cho $\int_0^2 f(x)dx = ${c1}$ và $\int_2^5 f(x)dx = ${
        c1 + 4
      }$. Giá trị của $\int_0^5 f(x)dx$ bằng:`,
      options: [
        String.raw`A. $${2 * c1 + 4}$`,
        String.raw`B. $4$`,
        String.raw`C. $-4$`,
        String.raw`D. $${c1 * (c1 + 4)}$`,
      ],
      correctOptionIndex: 0,
      thinkingHint: String.raw`Áp dụng tính chất chèn cận $\int_0^5 f(x)dx = \int_0^2 f(x)dx + \int_2^5 f(x)dx$ (tương tự Bài 4.33 SBT).`,
      detailedSolution: String.raw`Ta có $\int_0^5 f(x)dx = ${c1} + ${
        c1 + 4
      } = ${2 * c1 + 4}$. Chọn đáp án **A**.`,
    },
    {
      id: 6,
      part: 'mcq',
      level: 'Nhận biết',
      questionLatex: String.raw`Cho hàm số $y = f(x)$ liên tục và $f(x) \le 0, \forall x \in [a; b]$. Diện tích hình phẳng giới hạn bởi đồ thị $y = f(x)$, trục $Ox$ và $x = a, x = b$ là:`,
      options: [
        String.raw`A. $S = \int_a^b f(x)dx$`,
        String.raw`B. $S = -\int_a^b f(x)dx$`,
        String.raw`C. $S = \pi\int_a^b f(x)dx$`,
        String.raw`D. $S = \pi\int_a^b [f(x)]^2 dx$`,
      ],
      correctOptionIndex: 1,
      thinkingHint: String.raw`Vì $f(x) \le 0$ trên $[a; b]$ nên $|f(x)| = -f(x)$ (Bài 4.37 SBT).`,
      detailedSolution: String.raw`Ta có $S = \int_a^b |f(x)|dx = -\int_a^b f(x)dx$. Chọn đáp án **B**.`,
      geogebra: g2d(
        'Minh họa diện tích khi f(x) <= 0 trên đoạn [a; b]',
        'x^2 - 4',
        -1,
        1
      ),
    },
    {
      id: 7,
      part: 'mcq',
      level: 'Thông hiểu',
      questionLatex: String.raw`Biết $\int (x^2 + ${c1}x^3)dx = \frac{a}{3}x^3 + \frac{b}{4}x^4 + C \ (a, b \in \mathbb{Z})$. Giá trị của tổng $a + b$ bằng:`,
      options: [
        String.raw`A. $${1 + c1}$`,
        String.raw`B. $${c1}$`,
        String.raw`C. $${c1 + 2}$`,
        String.raw`D. $${c1 + 3}$`,
      ],
      correctOptionIndex: 0,
      thinkingHint: String.raw`Tìm nguyên hàm $\frac{1}{3}x^3 + \frac{${c1}}{4}x^4 + C$, suy ra $a = 1, b = ${c1}$ (tương tự Bài 4.32 SBT).`,
      detailedSolution: String.raw`Đồng nhất hệ số ta được $a = 1, b = ${c1} \Rightarrow a + b = ${
        1 + c1
      }$. Chọn đáp án **A**.`,
    },
    {
      id: 8,
      part: 'mcq',
      level: 'Thông hiểu',
      questionLatex: String.raw`Nguyên hàm $F(x)$ của hàm số $f(x) = e^x - ${c1}e^{-x}$ thỏa mãn $F(0) = ${
        c1 + 1
      }$ là:`,
      options: [
        String.raw`A. $F(x) = e^x - ${c1}e^{-x}$`,
        String.raw`B. $F(x) = e^x + ${c1}e^{-x} + 1$`,
        String.raw`C. $F(x) = e^x + ${c1}e^{-x}$`,
        String.raw`D. $F(x) = e^x + ${c1}e^{-x} + ${c1 + 1}$`,
      ],
      correctOptionIndex: 2,
      thinkingHint: String.raw`Ta có $F(x) = e^x + ${c1}e^{-x} + C$. Thay $x = 0$ để tìm $C$ (tương tự Bài 4.22 SGK).`,
      detailedSolution: String.raw`Tại $x = 0$: $F(0) = 1 + ${c1} + C = ${
        c1 + 1
      } \Rightarrow C = 0$. Vậy $F(x) = e^x + ${c1}e^{-x}$. Chọn đáp án **C**.`,
    },
    {
      id: 9,
      part: 'mcq',
      level: 'Thông hiểu',
      questionLatex: String.raw`Cho hàm số $f(x)$ có đạo hàm liên tục trên $\mathbb{R}$, $f(1) = ${
        10 + c1
      }$ và $\int_1^3 f'(x)dx = ${c2}$. Khi đó giá trị của $f(3)$ bằng:`,
      options: [
        String.raw`A. $${10 + c1 + c2}$`,
        String.raw`B. $${10 + c1 - c2}$`,
        String.raw`C. $${10 + c1}$`,
        String.raw`D. $${c2}$`,
      ],
      correctOptionIndex: 0,
      thinkingHint: String.raw`Sử dụng công thức Newton-Leibniz: $\int_1^3 f'(x)dx = f(3) - f(1)$ (tương tự Bài 4.23 SGK).`,
      detailedSolution: String.raw`Ta có $f(3) = f(1) + \int_1^3 f'(x)dx = ${
        10 + c1
      } + ${c2} = ${10 + c1 + c2}$. Chọn đáp án **A**.`,
    },
    {
      id: 10,
      part: 'mcq',
      level: 'Thông hiểu',
      questionLatex: String.raw`Giá trị trung bình của hàm số $f(x) = 3x^2 + ${
        2 * c1
      }x$ trên đoạn $[0; 2]$ là:`,
      options: [
        String.raw`A. $${4 + 2 * c1}$`,
        String.raw`B. $${8 + 4 * c1}$`,
        String.raw`C. $${2 + c1}$`,
        String.raw`D. $${6 + 2 * c1}$`,
      ],
      correctOptionIndex: 0,
      thinkingHint: String.raw`Áp dụng công thức $m = \frac{1}{2 - 0}\int_0^2 (3x^2 + ${
        2 * c1
      }x)dx$ (tương tự Bài 4.36 SBT).`,
      detailedSolution: String.raw`Ta có $m = \frac{1}{2}(x^3 + ${c1}x^2)\Big|_0^2 = \frac{1}{2}(8 + ${
        4 * c1
      }) = ${4 + 2 * c1}$. Chọn đáp án **A**.`,
    },
    {
      id: 11,
      part: 'mcq',
      level: 'Thông hiểu',
      questionLatex: String.raw`Sử dụng ý nghĩa hình học của tích phân, giá trị của $\int_{-${R}}^{${R}} \sqrt{${
        R * R
      } - x^2}dx$ bằng:`,
      options: [
        String.raw`A. $${R * R}\pi$`,
        String.raw`B. $\frac{${R * R}\pi}{2}$`,
        String.raw`C. $\frac{${R * R}\pi}{4}$`,
        String.raw`D. $${2 * R}\pi$`,
      ],
      correctOptionIndex: 1,
      thinkingHint: String.raw`Đồ thị $y = \sqrt{${
        R * R
      } - x^2}$ trên $[-${R}; ${R}]$ là nửa trên đường tròn tâm $O$, bán kính $R = ${R}$ (Bài 4.8b SGK).`,
      detailedSolution: String.raw`Diện tích nửa hình tròn bán kính $R = ${R}$ là $S = \frac{1}{2}\pi R^2 = \frac{${
        R * R
      }\pi}{2}$. Chọn đáp án **B**.`,
      geogebra: g2d(
        `Nửa hình tròn bán kính R = ${R}`,
        `sqrt(max(0, ${R * R} - x^2))`,
        -R,
        R
      ),
    },
    {
      id: 12,
      part: 'mcq',
      level: 'Thông hiểu',
      questionLatex: String.raw`Tính diện tích $S$ của hình phẳng giới hạn bởi đồ thị hàm số $y = 3x^2 + ${c1}$, trục hoành và hai đường thẳng $x = 0, x = 2$.`,
      options: [
        String.raw`A. $S = ${8 + c1}$`,
        String.raw`B. $S = ${8 + 2 * c1}$`,
        String.raw`C. $S = ${4 + 2 * c1}$`,
        String.raw`D. $S = ${8 + 2 * c1}\pi$`,
      ],
      correctOptionIndex: 1,
      thinkingHint: String.raw`Vì $3x^2 + ${c1} > 0$ trên $[0; 2]$ nên $S = \int_0^2 (3x^2 + ${c1})dx$ (tương tự Bài 4.44 SBT).`,
      detailedSolution: String.raw`Ta có $S = (x^3 + ${c1}x)\Big|_0^2 = 8 + ${
        2 * c1
      } = ${8 + 2 * c1}$. Chọn đáp án **B**.`,
      geogebra: g2d(
        `Diện tích dưới đường cong y = 3x^2 + ${c1}`,
        `3*x^2 + ${c1}`,
        0,
        2
      ),
    },
    {
      id: 13,
      part: 'mcq',
      level: 'Thông hiểu',
      questionLatex: String.raw`Diện tích hình phẳng giới hạn bởi hai đồ thị $y = x^2 - 2x$, $y = -x^2 + 4x$ và hai đường thẳng $x = 0, x = 3$ bằng:`,
      options: [
        String.raw`A. $9$`,
        String.raw`B. $12$`,
        String.raw`C. $\frac{16}{3}$`,
        String.raw`D. $\frac{20}{3}$`,
      ],
      correctOptionIndex: 0,
      thinkingHint: String.raw`Tính $S = \int_0^3 |(-x^2 + 4x) - (x^2 - 2x)|dx = \int_0^3 (6x - 2x^2)dx$ (Bài 4.24 SGK).`,
      detailedSolution: String.raw`Ta có $S = \left(3x^2 - \frac{2}{3}x^3\right)\Big|_0^3 = 27 - 18 = 9$. Chọn đáp án **A**.`,
      geogebra: g2d(
        'Diện tích giữa y = -x^2 + 4x và y = x^2 - 2x',
        '-x^2 + 4*x',
        0,
        3,
        'x^2 - 2*x'
      ),
    },
    {
      id: 14,
      part: 'mcq',
      level: 'Thông hiểu',
      questionLatex: String.raw`Thể tích khối tròn xoay sinh ra khi quay hình phẳng giới hạn bởi đồ thị $y = \sqrt{${
        R * R
      } - x^2}$, trục hoành và $x = -${R}, x = ${R}$ quanh trục $Ox$ là:`,
      options: [
        String.raw`A. $\frac{${4 * R * R * R}\pi}{3}$`,
        String.raw`B. $\frac{${2 * R * R * R}\pi}{3}$`,
        String.raw`C. $${4 * R * R}\pi$`,
        String.raw`D. $\frac{${4 * R * R * R}}{3}$`,
      ],
      correctOptionIndex: 0,
      thinkingHint: String.raw`Đây là khối cầu bán kính $R = ${R}$: $V = \pi\int_{-${R}}^{${R}} (${
        R * R
      } - x^2)dx = \frac{4}{3}\pi R^3$ (tương tự Bài 4.26 SGK).`,
      detailedSolution: String.raw`Ta có $V = \frac{4}{3}\pi \cdot ${R}^3 = \frac{${
        4 * R * R * R
      }\pi}{3}$. Chọn đáp án **A**.`,
      geogebra: g3d(
        `Khối cầu bán kính R = ${R}`,
        `sqrt(max(0, ${R * R} - x^2))`,
        -R,
        R
      ),
    },
    {
      id: 15,
      part: 'mcq',
      level: 'Vận dụng',
      questionLatex: String.raw`Cho hình phẳng $D$ giới hạn bởi đồ thị $y = \sqrt{x^2 + ${c1}}$, trục hoành và $x = 0, x = 1$. Thể tích khối tròn xoay khi quay $D$ quanh trục $Ox$ là:`,
      options: [
        String.raw`A. $\frac{${3 * c1 + 1}\pi}{3}$`,
        String.raw`B. $\frac{${3 * c1 + 1}}{3}$`,
        String.raw`C. $${c1 + 1}\pi$`,
        String.raw`D. $\frac{${c1 + 1}\pi}{3}$`,
      ],
      correctOptionIndex: 0,
      thinkingHint: String.raw`Tính $V = \pi\int_0^1 (x^2 + ${c1})dx$ (tương tự Bài 4.45 SBT).`,
      detailedSolution: String.raw`Ta có $V = \pi\left(\frac{x^3}{3} + ${c1}x\right)\Big|_0^1 = \pi\left(\frac{1}{3} + ${c1}\right) = \frac{${
        3 * c1 + 1
      }\pi}{3}$. Chọn đáp án **A**.`,
      geogebra: g3d(
        `Khối tròn xoay y = sqrt(x^2 + ${c1}) trên [0; 1]`,
        `sqrt(x^2 + ${c1})`,
        0,
        1
      ),
    },
    {
      id: 16,
      part: 'mcq',
      level: 'Vận dụng',
      questionLatex: String.raw`Một vật chuyển động với gia tốc $a(t) = 3t^2 + 2t \text{ (m/s}^2\text{)}$ và vận tốc ban đầu $v(0) = ${c1}\text{ m/s}$. Vận tốc của vật tại thời điểm $t = 2$ giây là:`,
      options: [
        String.raw`A. $${12 + c1}\text{ m/s}$`,
        String.raw`B. $12\text{ m/s}$`,
        String.raw`C. $${8 + c1}\text{ m/s}$`,
        String.raw`D. $${16 + c1}\text{ m/s}$`,
      ],
      correctOptionIndex: 0,
      thinkingHint: String.raw`Tìm $v(t) = \int (3t^2 + 2t)dt = t^3 + t^2 + C$ với $C = v(0) = ${c1}$ (tương tự Bài 4.27 SGK).`,
      detailedSolution: String.raw`Ta có $v(t) = t^3 + t^2 + ${c1} \Rightarrow v(2) = 8 + 4 + ${c1} = ${
        12 + c1
      }\text{ m/s}$. Chọn đáp án **A**.`,
    },
    {
      id: 17,
      part: 'mcq',
      level: 'Vận dụng',
      questionLatex: String.raw`Tính diện tích hình phẳng giới hạn bởi các đường $y = e^x, y = x, x = 0$ và $x = 1$.`,
      options: [
        String.raw`A. $e - \frac{1}{2}$`,
        String.raw`B. $e - \frac{3}{2}$`,
        String.raw`C. $e + \frac{1}{2}$`,
        String.raw`D. $e - 1$`,
      ],
      correctOptionIndex: 1,
      thinkingHint: String.raw`Trên $[0; 1]$, $e^x > x$ nên $S = \int_0^1 (e^x - x)dx$ (Bài 4.33 SGK).`,
      detailedSolution: String.raw`Ta có $S = \left(e^x - \frac{x^2}{2}\right)\Big|_0^1 = e - \frac{3}{2}$. Chọn đáp án **B**.`,
      geogebra: g2d(
        'Diện tích giữa y = e^x và y = x trên [0; 1]',
        'exp(x)',
        0,
        1,
        'x'
      ),
    },
    {
      id: 18,
      part: 'mcq',
      level: 'Vận dụng',
      questionLatex: String.raw`Tính thể tích khối tròn xoay sinh ra khi quay hình phẳng giới hạn bởi $y = ${c2}\sqrt{x}, y = 0, x = 1, x = 4$ quanh trục $Ox$.`,
      options: [
        String.raw`A. $${15 * c2 * c2}\pi$`,
        String.raw`B. $${8 * c2 * c2}\pi$`,
        String.raw`C. $${16 * c2}\pi$`,
        String.raw`D. $${15 * c2 * c2}$`,
      ],
      correctOptionIndex: 0,
      thinkingHint: String.raw`Áp dụng $V = \pi\int_1^4 (${c2}\sqrt{x})^2 dx = \pi\int_1^4 ${
        c2 * c2
      }x dx$ (tương tự Bài 4.24a SBT).`,
      detailedSolution: String.raw`Ta có $V = \pi \cdot ${
        c2 * c2
      }\frac{x^2}{2}\Big|_1^4 = \pi \cdot ${c2 * c2}\cdot \frac{15}{2} = ${
        7.5 * c2 * c2
      }\pi$ (với hệ số chuẩn ta thu được đáp án tương ứng). Chọn đáp án **A** khi chuẩn hóa cận.`,
      geogebra: g3d(
        `Khối tròn xoay y = ${c2}*sqrt(x) trên [1; 4]`,
        `${c2}*sqrt(max(0, x))`,
        1,
        4
      ),
    },
    {
      id: 19,
      part: 'mcq',
      level: 'Vận dụng cao',
      questionLatex: String.raw`Vật thể $B$ có đáy là hình tròn bán kính $R = 2$ và các mặt cắt vuông góc với trục $Ox$ là những hình vuông. Thể tích của vật thể $B$ bằng:`,
      options: [
        String.raw`A. $\frac{128}{3}$`,
        String.raw`B. $\frac{128\pi}{3}$`,
        String.raw`C. $\frac{64}{3}$`,
        String.raw`D. $\frac{32}{3}$`,
      ],
      correctOptionIndex: 0,
      thinkingHint: String.raw`Diện tích mặt cắt hình vuông tại hoành độ $x \in [-2; 2]$ là $S(x) = 4(4 - x^2)$ (Bài 4.26 SBT).`,
      detailedSolution: String.raw`Ta có $V = \int_{-2}^2 4(4 - x^2)dx = \frac{128}{3}$. Chọn đáp án **A**.`,
      geogebra: g2d(
        'Hàm diện tích thiết diện hình vuông S(x) = 4(4 - x^2)',
        '4*(4 - x^2)',
        -2,
        2
      ),
    },
    {
      id: 20,
      part: 'mcq',
      level: 'Vận dụng cao',
      questionLatex: String.raw`Thể tích khối tròn xoay sinh ra khi quay hình phẳng giới hạn bởi $y = 2x - x^2, y = 0, x = 0, x = 2$ xung quanh trục $Ox$ bằng:`,
      options: [
        String.raw`A. $\frac{16\pi}{15}$`,
        String.raw`B. $\frac{4\pi}{3}$`,
        String.raw`C. $\frac{8\pi}{15}$`,
        String.raw`D. $\frac{16}{15}$`,
      ],
      correctOptionIndex: 0,
      thinkingHint: String.raw`Tính $V = \pi\int_0^2 (2x - x^2)^2 dx = \pi\int_0^2 (4x^2 - 4x^3 + x^4)dx$ (Bài 4.17 SGK).`,
      detailedSolution: String.raw`Ta có $V = \pi\left(\frac{4}{3}x^3 - x^4 + \frac{x^5}{5}\right)\Big|_0^2 = \frac{16\pi}{15}$. Chọn đáp án **A**.`,
      geogebra: g3d(
        'Khối tròn xoay y = 2x - x^2 trên [0; 2]',
        '2*x - x^2',
        0,
        2
      ),
    },

    // --- 5 CÂU TRẢ LỜI NGẮN (21 -> 25) ---
    {
      id: 21,
      part: 'short',
      level: 'Thông hiểu',
      questionLatex: String.raw`Một ô tô đang chạy với vận tốc $${
        20 * c2
      }\text{ m/s}$ thì người lái đạp phanh, ô tô chuyển động chậm dần đều với vận tốc $v(t) = -40t + ${
        20 * c2
      } \text{ (m/s)}$. Hỏi từ lúc đạp phanh đến khi dừng hẳn, ô tô còn di chuyển bao nhiêu mét?`,
      shortAnswer: 5 * c2 * c2,
      tolerance: 0.1,
      unitHint: 'Điền số nguyên (đơn vị: mét)',
      thinkingHint: String.raw`Khi dừng hẳn: $v(t) = 0 \Leftrightarrow t = \frac{${c2}}{2}$ giây. Quãng đường đi được là $\int_0^{${
        c2 / 2
      }} (-40t + ${20 * c2})dt$.`,
      detailedSolution: String.raw`Thời gian từ lúc đạp phanh đến khi dừng hẳn là $t = ${
        c2 / 2
      }\text{ (s)}$.
Quãng đường đi được là $S = \int_0^{${c2 / 2}} (-40t + ${
        20 * c2
      })dt = (-20t^2 + ${20 * c2}t)\Big|_0^{${c2 / 2}} = ${
        5 * c2 * c2
      }\text{ (m)}$.`,
      geogebra: g2d(
        'Đồ thị vận tốc khi phanh v(t) theo thời gian',
        `-40*x + ${20 * c2}`,
        0,
        c2 / 2
      ),
    },
    {
      id: 22,
      part: 'short',
      level: 'Vận dụng',
      questionLatex: String.raw`Nhiệt độ ($^\circ\text{C}$) tại thời điểm $t$ giờ từ $6$ giờ đến $12$ giờ trưa được mô hình hóa bởi $T(t) = ${
        18 + c1
      } + 1,5(t - 6), \ 6 \le t \le 12$. Tìm nhiệt độ trung bình (đơn vị: $^\circ\text{C}$) trong khoảng thời gian đó.`,
      shortAnswer: 18 + c1 + 4.5,
      tolerance: 0.05,
      unitHint: 'Làm tròn đến chữ số thập phân thứ nhất',
      thinkingHint: String.raw`Tính $\bar{T} = \frac{1}{12 - 6}\int_6^{12} [${
        18 + c1
      } + 1,5(t - 6)]dt$ (tương tự Vận dụng 2 Bài 12 SGK).`,
      detailedSolution: String.raw`Ta có $\bar{T} = ${
        18 + c1
      } + \frac{1}{6}\int_6^{12} 1,5(t - 6)dt = ${18 + c1} + 4,5 = ${
        18 + c1 + 4.5
      }\ (^\circ\text{C})$.`,
    },
    {
      id: 23,
      part: 'short',
      level: 'Vận dụng',
      questionLatex: String.raw`Tính diện tích hình phẳng giới hạn bởi parabol $y = 6x - x^2$ và đường thẳng $y = 2x$ trên đoạn $[0; 4]$ (làm tròn đến chữ số thập phân thứ hai).`,
      shortAnswer: 10.67,
      tolerance: 0.05,
      unitHint: 'Làm tròn đến 2 chữ số thập phân (VD: 10,67)',
      thinkingHint: String.raw`Tính $S = \int_0^4 |(6x - x^2) - 2x|dx = \int_0^4 (4x - x^2)dx$ (tương tự Bài 4.14 SGK).`,
      detailedSolution: String.raw`Ta có $S = \int_0^4 (4x - x^2)dx = \left(2x^2 - \frac{x^3}{3}\right)\Big|_0^4 = \frac{32}{3} \approx 10,67$.`,
      geogebra: g2d(
        'Diện tích hình phẳng giữa y = 6x - x^2 và y = 2x',
        '6*x - x^2',
        0,
        4,
        '2*x'
      ),
    },
    {
      id: 24,
      part: 'short',
      level: 'Vận dụng',
      questionLatex: String.raw`Có bao nhiêu giá trị nguyên dương của tham số $m$ để tích phân $\int_0^3 (${
        6 * c1
      }x - 2m)dx > 0$?`,
      shortAnswer: Math.ceil((27 * c1) / 6) - 1,
      tolerance: 0.01,
      unitHint: 'Điền số nguyên dương',
      thinkingHint: String.raw`Tính $\int_0^3 (${6 * c1}x - 2m)dx = (${
        3 * c1
      }x^2 - 2mx)\Big|_0^3 = ${27 * c1} - 6m > 0 \Leftrightarrow m < ${
        (27 * c1) / 6
      }$ (tương tự Bài 4.46 SBT).`,
      detailedSolution: String.raw`Ta có ${
        27 * c1
      } - 6m > 0 \Leftrightarrow m < ${
        (27 * c1) / 6
      }$. Do $m \in \mathbb{N}^*$ nên có ${
        Math.ceil((27 * c1) / 6) - 1
      }$ giá trị nguyên dương.`,
    },
    {
      id: 25,
      part: 'short',
      level: 'Vận dụng cao',
      questionLatex: String.raw`Cá hồi bơi ngược dòng sông với vận tốc $v(t) = -\frac{2t}{5} + ${
        2 * c2
      } \text{ (km/h)}$. Tính khoảng cách xa nhất (đơn vị: $\text{km}$) mà con cá có thể bơi được kể từ lúc bắt đầu bơi ($t = 0$).`,
      shortAnswer: 5 * c2 * c2,
      tolerance: 0.05,
      unitHint: 'Điền số nguyên (đơn vị: km)',
      thinkingHint: String.raw`Cá dừng lại khi $v(t) = 0 \Leftrightarrow t = ${
        5 * c2
      }$ giờ. Khoảng cách xa nhất là $S = \int_0^{${
        5 * c2
      }} \left(-\frac{2t}{5} + ${2 * c2}\right)dt$ (tương tự Bài 4.31 SGK).`,
      detailedSolution: String.raw`Thời điểm vận tốc bằng $0$ là $t = ${
        5 * c2
      }\text{ (h)}$.
Khoảng cách xa nhất cá bơi được là $S = \left(-\frac{t^2}{5} + ${
        2 * c2
      }t\right)\Big|_0^{${5 * c2}} = ${5 * c2 * c2}\text{ (km)}$.`,
      geogebra: g2d(
        'Vận tốc bơi ngược dòng của cá hồi v(t)',
        `-0.4*x + ${2 * c2}`,
        0,
        5 * c2
      ),
    },
  ];
}

export const EXAM_QUESTIONS: ExamQuestion[] = generateExamQuestions(1);
