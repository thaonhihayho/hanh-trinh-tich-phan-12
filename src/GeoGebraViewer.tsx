import React, { useEffect, useRef, useState } from 'react';
import { Sliders, RotateCcw, Play, Pause, Grid } from 'lucide-react';
import { LatexRenderer } from './LatexRenderer';

export interface GeoGebraConfig {
  mode: '2d' | '3d';
  title: string;
  fExpr: string;
  gExpr?: string;
  defaultA: number;
  defaultB: number;
  minBound?: number;
  maxBound?: number;
  formulaNote?: string;
}

interface GeoGebraViewerProps {
  config: GeoGebraConfig;
}

export const exprToLatex = (expr: string): string => {
  if (!expr) return '0';
  let s = expr.trim();
  s = s.replace(/sqrt\(\s*max\(\s*0\s*,\s*([^)]+)\)\s*\)/g, '\\sqrt{$1}');
  s = s.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
  s = s.replace(/abs\(([^)]+)\)/g, '|$1|');
  s = s.replace(/exp\(([^)]+)\)/g, 'e^{$1}');
  s = s.replace(
    /\(1\/175\)\*x\^2\s*\+\s*\(3\/35\)\*x\s*\+\s*6/g,
    '\\frac{1}{175}x^2 + \\frac{3}{35}x + 6'
  );
  s = s.replace(/\(x\^2\)\/(\d+)/g, '\\frac{x^2}{$1}');
  s = s.replace(/x\*tan\(alpha\)/g, 'x\\tan\\alpha');
  s = s.replace(/sin\(([^)]+)\)/g, '\\sin($1)');
  s = s.replace(/cos\(([^)]+)\)/g, '\\cos($1)');
  s = s.replace(/tan\(([^)]+)\)/g, '\\tan($1)');
  s = s.replace(/\*/g, '');
  return s;
};

const formatTitleLatex = (rawTitle: string): string => {
  if (!rawTitle) return '';
  if (rawTitle.includes('$')) return rawTitle;

  let s = rawTitle;
  s = s.replace(/1\/4/g, '$\\frac{1}{4}$');
  s = s.replace(/f\(x\)\s*<=\s*0/g, '$f(x) \\le 0$');
  s = s.replace(/S\(x\)\s*=\s*4\(4\s*-\s*x\^2\)/g, '$S(x) = 4(4 - x^2)$');
  s = s.replace(/y\s*=\s*x\*tan\(alpha\)/g, '$y = x\\tan\\alpha$');
  s = s.replace(/y\s*=\s*sqrt\(max\(0,\s*([^)]+)\)\)/g, '$y = \\sqrt{$1}$');
  s = s.replace(/y\s*=\s*sqrt\(([^)]+)\)/g, '$y = \\sqrt{$1}$');
  s = s.replace(/y\s*=\s*(\d+)\*sqrt\(x\)/g, '$y = $1\\sqrt{x}$');
  s = s.replace(/y\s*=\s*e\^x/g, '$y = e^x$');
  s = s.replace(/y\s*=\s*x\^2\s*\/\s*8/g, '$y = \\frac{x^2}{8}$');

  s = s.replace(
    /\b(y|v\(t\)|f\(x\)|p|p0)\s*=\s*([0-9x t^+\-*/.|()]+)/g,
    (fullMatch, lhs, rhs) => {
      if (fullMatch.includes('$')) return fullMatch;
      const cleanRhs = rhs.trim().replace(/\*/g, '');
      return `$${lhs === 'p0' ? 'p_0' : lhs} = ${cleanRhs}$`;
    }
  );

  s = s.replace(/\b(v\(t\)|R\(t\)|C\(t\))\b/g, (m) => `$${m}$`);
  s = s.replace(
    /\b(R|x)\s*=\s*([0-9a-zA-Z-]+)\b/g,
    (_m, k, v) => `$${k} = ${v}$`
  );
  s = s.replace(/\[([0-9a-zA-Z\-.;\s]+)\]/g, (_m, inner) => `$[${inner}]$`);
  s = s.replace(/\$\$/g, '');
  return s;
};

export const GeoGebraViewer: React.FC<GeoGebraViewerProps> = ({ config }) => {
  const [boundA, setBoundA] = useState<number>(config.defaultA);
  const [boundB, setBoundB] = useState<number>(config.defaultB);
  const [angleDeg, setAngleDeg] = useState<number>(320);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [equalAspect, setEqualAspect] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setBoundA(config.defaultA);
    setBoundB(config.defaultB);
    setAngleDeg(320);
    setIsAutoRotate(false);
  }, [config]);

  useEffect(() => {
    if (!isAutoRotate) return;
    const timer = setInterval(() => {
      setAngleDeg((prev) => (prev >= 360 ? 20 : prev + 5));
    }, 50);
    return () => clearInterval(timer);
  }, [isAutoRotate]);

  // Hàm tính giá trị biểu thức toán học (Đã xử lý triệt để lỗi dấu trừ trước lũy thừa -x^2 trong JS)
  const evalMathExpr = (
    expr: string,
    xVal: number,
    strictDomain = true
  ): number => {
    try {
      if (!expr) return 0;
      let cleanExpr = expr.trim();
      if (strictDomain) {
        cleanExpr = cleanExpr.replace(
          /sqrt\(\s*max\(\s*0\s*,\s*([^)]+)\)\s*\)/g,
          'sqrt($1)'
        );
      }
      const normalized = cleanExpr
        // Xử lý số mũ âm như x^-2 -> x^(-2)
        .replace(/\^\s*-\s*([a-zA-Z0-9_.]+)/g, '^(-$1)')
        // Đổi dấu trừ đơn ngôi (như -x^2, -(x-1)^2) thành (-1)* để không bao giờ bị lỗi Unary ** trong JS
        .replace(/(^|[=(+\-*/?:,])\s*-\s*/g, '$1(-1)*')
        .replace(/\^/g, '**')
        .replace(/sqrt\(/g, '__SQRT__(')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/exp\(/g, 'Math.exp(')
        .replace(/max\(/g, 'Math.max(')
        .replace(/\bpi\b/g, 'Math.PI')
        .replace(/\be\b/g, 'Math.E');

      const fn = new Function(
        'x',
        `const __SQRT__ = (v) => (v < -1e-7 ? NaN : Math.sqrt(Math.max(0, v))); return ${normalized};`
      );
      const res = Number(fn(xVal));
      return Number.isFinite(res) ? res : NaN;
    } catch {
      return NaN;
    }
  };

  const computeNumericalMetric = (): number => {
    if (boundB <= boundA) return 0;
    const steps = 300;
    const dx = (boundB - boundA) / steps;
    let sum = 0;
    for (let i = 0; i < steps; i++) {
      const xm = boundA + (i + 0.5) * dx;
      const y1 = evalMathExpr(config.fExpr, xm, false);
      const y2 = config.gExpr ? evalMathExpr(config.gExpr, xm, false) : 0;
      const v1 = Number.isFinite(y1) ? y1 : 0;
      const v2 = Number.isFinite(y2) ? y2 : 0;
      if (config.mode === '2d') {
        sum += Math.abs(v1 - v2) * dx;
      } else {
        sum += Math.PI * Math.abs(v1 * v1 - v2 * v2) * dx;
      }
    }
    return sum;
  };

  const drawArrowHead = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color = '#1e293b'
  ) => {
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const headLen = 8;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLen * Math.cos(angle - Math.PI / 6),
      toY - headLen * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLen * Math.cos(angle + Math.PI / 6),
      toY - headLen * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const getNiceStep = (maxSpan: number): number => {
    if (maxSpan > 40) return 10;
    if (maxSpan > 16) return 5;
    if (maxSpan > 7.5) return 2;
    if (maxSpan <= 3.2) return 0.5;
    return 1;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (config.mode === '2d') {
      const padLeft = 42;
      const padRight = 28;
      const padTop = 24;
      const padBottom = 30;
      const plotW = width - padLeft - padRight;
      const plotH = height - padTop - padBottom;

      const spanAB = Math.max(1.5, boundB - boundA);
      let minX = Math.min(-0.5, boundA - spanAB * 0.45);
      let maxX = Math.max(0.5, boundB + spanAB * 0.45);

      let minY = -0.5;
      let maxY = 1.5;
      for (let i = 0; i <= 140; i++) {
        const x = minX + (i / 140) * (maxX - minX);
        const y1 = evalMathExpr(config.fExpr, x, true);
        const y2 = config.gExpr ? evalMathExpr(config.gExpr, x, true) : 0;
        if (Number.isFinite(y1)) {
          minY = Math.min(minY, y1);
          maxY = Math.max(maxY, y1);
        }
        if (Number.isFinite(y2)) {
          minY = Math.min(minY, y2);
          maxY = Math.max(maxY, y2);
        }
      }

      const rawXSpan = Math.max(1, maxX - minX);
      const rawYSpan = Math.max(1, maxY - minY);
      const useIsometric2D =
        equalAspect && rawYSpan / rawXSpan <= 5 && rawXSpan / rawYSpan <= 5;

      if (useIsometric2D) {
        const paddedX = rawXSpan * 1.25;
        const paddedY = rawYSpan * 1.28;
        const unitPx = Math.min(plotW / paddedX, plotH / paddedY);
        const midX = (minX + maxX) / 2;
        const midY = (minY + maxY) / 2;
        minX = midX - plotW / (2 * unitPx);
        maxX = midX + plotW / (2 * unitPx);
        minY = midY - plotH / (2 * unitPx);
        maxY = midY + plotH / (2 * unitPx);
      } else {
        minX -= rawXSpan * 0.12;
        maxX += rawXSpan * 0.12;
        minY -= rawYSpan * 0.15;
        maxY += rawYSpan * 0.15;
      }

      const toSX = (x: number) =>
        padLeft + ((x - minX) / (maxX - minX || 1)) * plotW;
      const toSY = (y: number) =>
        height - padBottom - ((y - minY) / (maxY - minY || 1)) * plotH;

      const tickStepX = getNiceStep(maxX - minX);
      const tickStepY = useIsometric2D ? tickStepX : getNiceStep(maxY - minY);

      // 1. Lưới tọa độ
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      const startGX = Math.ceil(minX / tickStepX) * tickStepX;
      for (let gx = startGX; gx <= maxX; gx += tickStepX) {
        const sx = toSX(gx);
        ctx.beginPath();
        ctx.moveTo(sx, padTop);
        ctx.lineTo(sx, height - padBottom);
        ctx.stroke();
      }
      const startGY = Math.ceil(minY / tickStepY) * tickStepY;
      for (let gy = startGY; gy <= maxY; gy += tickStepY) {
        const sy = toSY(gy);
        ctx.beginPath();
        ctx.moveTo(padLeft, sy);
        ctx.lineTo(width - padRight, sy);
        ctx.stroke();
      }

      // 2. Tô miền diện tích tích phân
      if (boundB > boundA) {
        ctx.fillStyle = 'rgba(37, 99, 235, 0.24)';
        const N = 220;
        const dx = (boundB - boundA) / N;
        for (let i = 0; i < N; i++) {
          const x1 = boundA + i * dx;
          const x2 = x1 + dx;
          const f1 = evalMathExpr(config.fExpr, x1, true);
          const f2 = evalMathExpr(config.fExpr, x2, true);
          const g1 = config.gExpr ? evalMathExpr(config.gExpr, x1, true) : 0;
          const g2 = config.gExpr ? evalMathExpr(config.gExpr, x2, true) : 0;

          if (
            Number.isFinite(f1) &&
            Number.isFinite(f2) &&
            Number.isFinite(g1) &&
            Number.isFinite(g2)
          ) {
            ctx.beginPath();
            ctx.moveTo(toSX(x1), toSY(f1));
            ctx.lineTo(toSX(x2), toSY(f2));
            ctx.lineTo(toSX(x2), toSY(g2));
            ctx.lineTo(toSX(x1), toSY(g1));
            ctx.closePath();
            ctx.fill();
          }
        }
      }

      // 3. Vẽ trục Ox, Oy
      const oxY = Math.min(Math.max(toSY(0), padTop), height - padBottom);
      const oyX = Math.min(Math.max(toSX(0), padLeft), width - padRight);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(padLeft - 5, oxY);
      ctx.lineTo(width - padRight + 8, oxY);
      ctx.moveTo(oyX, height - padBottom + 5);
      ctx.lineTo(oyX, padTop - 8);
      ctx.stroke();

      drawArrowHead(ctx, padLeft, oxY, width - padRight + 8, oxY);
      drawArrowHead(ctx, oyX, height - padBottom, oyX, padTop - 8);

      ctx.fillStyle = '#334155';
      ctx.font = '11px Times New Roman';
      for (let gx = startGX; gx <= maxX; gx += tickStepX) {
        if (Math.abs(gx) < 1e-6) continue;
        const sx = toSX(gx);
        ctx.beginPath();
        ctx.moveTo(sx, oxY - 3.5);
        ctx.lineTo(sx, oxY + 3.5);
        ctx.stroke();
        ctx.fillText(Number(gx.toFixed(1)).toString(), sx - 6, oxY + 15);
      }
      for (let gy = startGY; gy <= maxY; gy += tickStepY) {
        if (Math.abs(gy) < 1e-6) continue;
        const sy = toSY(gy);
        ctx.beginPath();
        ctx.moveTo(oyX - 3.5, sy);
        ctx.lineTo(oyX + 3.5, sy);
        ctx.stroke();
        ctx.fillText(Number(gy.toFixed(1)).toString(), oyX - 24, sy + 4);
      }

      ctx.font = 'italic bold 13px Times New Roman';
      ctx.fillText('O', oyX - 14, oxY + 15);
      ctx.fillText('x', width - padRight + 12, oxY + 4);
      ctx.fillText('y', oyX - 14, padTop - 6);

      // 4. Vẽ đồ thị f(x) và g(x)
      const drawMathCurve = (exprStr: string, strokeColor: string) => {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        let penDown = false;
        const samples = 450;
        for (let i = 0; i <= samples; i++) {
          const x = minX + (i / samples) * (maxX - minX);
          const y = evalMathExpr(exprStr, x, true);
          if (
            Number.isFinite(y) &&
            y >= minY - (maxY - minY) &&
            y <= maxY + (maxY - minY)
          ) {
            const sx = toSX(x);
            const sy = toSY(y);
            if (!penDown) {
              ctx.moveTo(sx, sy);
              penDown = true;
            } else {
              ctx.lineTo(sx, sy);
            }
          } else {
            penDown = false;
          }
        }
        ctx.stroke();
      };

      if (config.gExpr && config.gExpr !== '0') {
        drawMathCurve(config.gExpr, '#0d9488');
      }
      drawMathCurve(config.fExpr, '#2563eb');

      // 5. Đường gióng cận x = a và x = b
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1.4;
      [boundA, boundB].forEach((bx) => {
        const sx = toSX(bx);
        if (sx >= padLeft && sx <= width - padRight) {
          ctx.beginPath();
          ctx.moveTo(sx, padTop);
          ctx.lineTo(sx, height - padBottom);
          ctx.stroke();
        }
      });
      ctx.setLineDash([]);

      // 6. Chấm tròn đánh dấu giao điểm giữa f(x) và g(x)
      const samplesRoot = 400;
      let prevX = boundA;
      let prevD =
        evalMathExpr(config.fExpr, prevX, true) -
        (config.gExpr ? evalMathExpr(config.gExpr, prevX, true) : 0);
      for (let i = 0; i <= samplesRoot; i++) {
        const curX = boundA + (i / samplesRoot) * (boundB - boundA);
        const curD =
          evalMathExpr(config.fExpr, curX, true) -
          (config.gExpr ? evalMathExpr(config.gExpr, curX, true) : 0);
        if (Number.isFinite(prevD) && Number.isFinite(curD)) {
          if (Math.abs(curD) < 1e-4 || (i > 0 && prevD * curD <= 0)) {
            const rx = Math.abs(curD) < 1e-4 ? curX : 0.5 * (prevX + curX);
            const ry = evalMathExpr(config.fExpr, rx, true);
            if (Number.isFinite(ry)) {
              ctx.fillStyle = '#dc2626';
              ctx.beginPath();
              ctx.arc(toSX(rx), toSY(ry), 4, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
        }
        prevX = curX;
        prevD = curD;
      }
    } else {
      // CHẾ ĐỘ 3D: HỆ TRỤC TỌA ĐỘ KHÔNG GIAN Oxyz
      let maxR = 1;
      for (let i = 0; i <= 80; i++) {
        const x = boundA + (i / 80) * Math.max(0.1, boundB - boundA);
        const val = evalMathExpr(config.fExpr, x, false);
        if (Number.isFinite(val)) maxR = Math.max(maxR, Math.abs(val));
      }

      const xMin3D = Math.min(0, boundA);
      const xMax3D = Math.max(1, boundB);
      const xAxisMin =
        xMin3D < 0 ? xMin3D * 1.2 : -Math.max(0.5, xMax3D * 0.15);
      const xAxisMax = xMax3D * 1.22;
      const yzAxisMax = maxR * 1.28;

      const originX = xMin3D < 0 ? width * 0.44 : width * 0.27;
      const originY = height * 0.54;
      const scaleX = (width * 0.56) / Math.max(1, xAxisMax - xAxisMin);
      const scaleYZ = (height * 0.36) / Math.max(1, yzAxisMax);

      const zAngle = (38 * Math.PI) / 180;
      const zForeshorten = 0.62;
      const projectOxyz = (
        x: number,
        y: number,
        z: number
      ): [number, number] => {
        const px =
          originX + x * scaleX - z * scaleYZ * zForeshorten * Math.cos(zAngle);
        const py =
          originY - y * scaleYZ + z * scaleYZ * zForeshorten * Math.sin(zAngle);
        return [px, py];
      };

      const stepX = getNiceStep(xAxisMax - xAxisMin);
      const stepYZ = getNiceStep(yzAxisMax * 2);

      const maxRad = (angleDeg * Math.PI) / 180;
      const nx = 26;
      const nt = 28;
      for (let i = 0; i < nx; i++) {
        const x1 = boundA + (i / nx) * (boundB - boundA);
        const x2 = boundA + ((i + 1) / nx) * (boundB - boundA);
        const r1 = Math.abs(evalMathExpr(config.fExpr, x1, false) || 0);
        const r2 = Math.abs(evalMathExpr(config.fExpr, x2, false) || 0);

        for (let j = 0; j < nt; j++) {
          const t1 = (j / nt) * maxRad;
          const t2 = ((j + 1) / nt) * maxRad;
          const p1 = projectOxyz(x1, r1 * Math.cos(t1), r1 * Math.sin(t1));
          const p2 = projectOxyz(x2, r2 * Math.cos(t1), r2 * Math.sin(t1));
          const p3 = projectOxyz(x2, r2 * Math.cos(t2), r2 * Math.sin(t2));
          const p4 = projectOxyz(x1, r1 * Math.cos(t2), r1 * Math.sin(t2));

          ctx.fillStyle =
            Math.sin(t1) >= 0
              ? 'rgba(59, 130, 246, 0.22)'
              : 'rgba(99, 102, 241, 0.11)';
          ctx.strokeStyle = 'rgba(67, 56, 202, 0.26)';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
          ctx.lineTo(p3[0], p3[1]);
          ctx.lineTo(p4[0], p4[1]);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }

      const midSliceX = (boundA + boundB) / 2;
      const midSliceR = Math.abs(
        evalMathExpr(config.fExpr, midSliceX, false) || 0
      );
      if (midSliceR > 0) {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        const [cSX, cSY] = projectOxyz(midSliceX, 0, 0);
        ctx.moveTo(cSX, cSY);
        for (let j = 0; j <= 40; j++) {
          const t = (j / 40) * maxRad;
          const [px, py] = projectOxyz(
            midSliceX,
            midSliceR * Math.cos(t),
            midSliceR * Math.sin(t)
          );
          ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.8;

      const [oxStart, oyStart] = projectOxyz(xAxisMin, 0, 0);
      const [oxEnd, oyEnd] = projectOxyz(xAxisMax, 0, 0);
      ctx.beginPath();
      ctx.moveTo(oxStart, oyStart);
      ctx.lineTo(oxEnd, oyEnd);
      ctx.stroke();
      drawArrowHead(ctx, oxStart, oyStart, oxEnd, oyEnd, '#0f172a');

      ctx.fillStyle = '#0f172a';
      ctx.font = '11px Times New Roman';
      const firstTickX = Math.ceil(xAxisMin / stepX) * stepX;
      for (let tx = firstTickX; tx <= xAxisMax - stepX * 0.25; tx += stepX) {
        if (Math.abs(tx) < 1e-6) continue;
        const [px, py] = projectOxyz(tx, 0, 0);
        ctx.beginPath();
        ctx.moveTo(px, py - 3.5);
        ctx.lineTo(px, py + 3.5);
        ctx.stroke();
        ctx.fillText(Number(tx.toFixed(1)).toString(), px - 5, py + 15);
      }
      ctx.font = 'italic bold 14px Times New Roman';
      ctx.fillText('x', oxEnd + 7, oyEnd + 4);

      const [yBottomX, yBottomY] = projectOxyz(0, -yzAxisMax * 0.85, 0);
      const [yTopX, yTopY] = projectOxyz(0, yzAxisMax, 0);
      ctx.beginPath();
      ctx.moveTo(yBottomX, yBottomY);
      ctx.lineTo(yTopX, yTopY);
      ctx.stroke();
      drawArrowHead(ctx, yBottomX, yBottomY, yTopX, yTopY, '#0f172a');

      ctx.font = '11px Times New Roman';
      const firstTickY = Math.ceil((-yzAxisMax * 0.75) / stepYZ) * stepYZ;
      for (let ty = firstTickY; ty <= yzAxisMax - stepYZ * 0.22; ty += stepYZ) {
        if (Math.abs(ty) < 1e-6) continue;
        const [px, py] = projectOxyz(0, ty, 0);
        ctx.beginPath();
        ctx.moveTo(px - 3.5, py);
        ctx.lineTo(px + 3.5, py);
        ctx.stroke();
        ctx.fillText(Number(ty.toFixed(1)).toString(), px - 22, py + 4);
      }
      ctx.font = 'italic bold 14px Times New Roman';
      ctx.fillText('y', yTopX - 14, yTopY + 4);

      const zMaxLen = yzAxisMax * 1.15;
      const [zBackX, zBackY] = projectOxyz(0, 0, -zMaxLen * 0.35);
      const [zFrontX, zFrontY] = projectOxyz(0, 0, zMaxLen);
      ctx.beginPath();
      ctx.moveTo(zBackX, zBackY);
      ctx.lineTo(zFrontX, zFrontY);
      ctx.stroke();
      drawArrowHead(ctx, zBackX, zBackY, zFrontX, zFrontY, '#0f172a');

      ctx.font = '11px Times New Roman';
      for (let tz = stepYZ; tz <= zMaxLen - stepYZ * 0.22; tz += stepYZ) {
        const [px, py] = projectOxyz(0, 0, tz);
        ctx.beginPath();
        ctx.moveTo(px - 3, py - 3);
        ctx.lineTo(px + 3, py + 3);
        ctx.stroke();
        ctx.fillText(Number(tz.toFixed(1)).toString(), px - 18, py + 12);
      }
      ctx.font = 'italic bold 14px Times New Roman';
      ctx.fillText('z', zFrontX - 14, zFrontY + 8);
      ctx.fillText('O', originX - 15, originY - 5);

      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const x = boundA + (i / 80) * (boundB - boundA);
        const y = evalMathExpr(config.fExpr, x, false) || 0;
        const [px, py] = projectOxyz(x, y, 0);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  }, [config, boundA, boundB, angleDeg, equalAspect]);

  const metricVal = computeNumericalMetric();
  const minSlider = config.minBound ?? Math.floor(config.defaultA - 1);
  const maxSlider = config.maxBound ?? Math.ceil(config.defaultB + 1);
  const fLatex = exprToLatex(config.fExpr);
  const gLatex =
    config.gExpr && config.gExpr !== '0' ? exprToLatex(config.gExpr) : null;

  return (
    <div className="bg-slate-50 border border-indigo-200 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase shrink-0">
            Mô phỏng{' '}
            {config.mode === '3d' ? 'Hệ trục Oxyz (3D)' : 'Hệ trục Oxy (2D)'}
          </span>
          <LatexRenderer
            content={formatTitleLatex(config.title)}
            className="font-bold text-slate-900"
          />
        </div>

        {config.mode === '2d' && (
          <button
            type="button"
            onClick={() => setEqualAspect(!equalAspect)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
              equalAspect
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5 inline mr-1" />
            {equalAspect ? 'Tỉ lệ trục 1:1 (Chuẩn)' : 'Tự co giãn trục'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-2 flex justify-center relative">
        <canvas
          ref={canvasRef}
          width={540}
          height={310}
          className="w-full max-w-[540px] h-auto"
        />
        {config.mode === '3d' && (
          <button
            type="button"
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow"
          >
            {isAutoRotate ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3" />
            )}
            {isAutoRotate ? 'Dừng quay' : 'Quay 360° quanh Ox'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-2.5 text-xs">
        <div className="flex items-center justify-between text-slate-700">
          <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <LatexRenderer
              content="Điều chỉnh cận tích phân $[a; b]$ trực quan:"
              className="font-bold"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setBoundA(config.defaultA);
              setBoundB(config.defaultB);
            }}
            className="text-indigo-600 hover:underline flex items-center gap-1 font-bold"
          >
            <RotateCcw className="w-3 h-3" /> Đặt lại cận đề bài
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="mb-1">
              <LatexRenderer
                content={`Cận dưới: $a = ${boundA.toFixed(2)}$`}
                className="font-bold text-rose-700"
              />
            </div>
            <input
              type="range"
              min={minSlider}
              max={maxSlider}
              step={0.05}
              value={boundA}
              onChange={(e) => {
                const val = Math.min(Number(e.target.value), boundB - 0.05);
                setBoundA(val);
              }}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="mb-1">
              <LatexRenderer
                content={`Cận trên: $b = ${boundB.toFixed(2)}$`}
                className="font-bold text-indigo-700"
              />
            </div>
            <input
              type="range"
              min={minSlider}
              max={maxSlider}
              step={0.05}
              value={boundB}
              onChange={(e) => {
                const val = Math.max(Number(e.target.value), boundA + 0.05);
                setBoundB(val);
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {config.mode === '3d' && (
          <div>
            <div className="mb-1">
              <LatexRenderer
                content={`Góc quay quanh trục $Ox$: $\\alpha = ${angleDeg}^\\circ / 360^\\circ$`}
                className="font-bold text-amber-700"
              />
            </div>
            <input
              type="range"
              min={15}
              max={360}
              value={angleDeg}
              onChange={(e) => {
                setIsAutoRotate(false);
                setAngleDeg(Number(e.target.value));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-1 bg-blue-600 inline-block rounded" />
              <LatexRenderer content={`$y = ${fLatex}$`} />
            </span>
            {gLatex && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-1 bg-teal-600 inline-block rounded" />
                <LatexRenderer content={`$y = ${gLatex}$`} />
              </span>
            )}
          </div>
          <div className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
            <LatexRenderer
              content={
                config.mode === '2d'
                  ? `Diện tích $S(a \\to b) \\approx ${metricVal.toFixed(3)}$`
                  : `Thể tích $V(a \\to b) \\approx ${metricVal.toFixed(3)}$`
              }
              className="font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
