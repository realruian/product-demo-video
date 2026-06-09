/**
 * 产品演示片通用骨架。下面的占位内容（BRAND / SCENES 文案 / SLOGAN / 地址栏）
 * 都由 Claude **读你的项目和组件代码后自动生成、自动填充**——它会：
 *   - 读 CLAUDE.md / README / 路由，理解每个页面是干什么的
 *   - 据此为每个场景自动写 title / sub 字幕文案 与 地址栏
 *   - 自动在 public 里定位你项目的真实矢量 logo
 * 这里留的是空骨架 + 一份中性占位示例，方便你照着改 / 让 Claude 自动覆盖。
 *
 * 手动改时的位置都标了「← 改这里」。调性规范见 SKILL.md「Tone」与 reference/tone.md。
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
// 截不到的页面 → 照真实代码重建的界面组件（范例，按需替换/增删）
import { InterviewScreen } from "./screens/InterviewScreen";
import { ReportScreen } from "./screens/ReportScreen";

// ── 全局调性（默认极简，遵守目标项目 DESIGN.md）──────────────
const FONT = `"PingFang SC", "Heiti SC", sans-serif`; // 中英统一 PingFang
const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const BRAND = "app"; // ← public 下的素材子目录名（Claude 按你的项目自动定）
const LOGO = `${BRAND}/logo.svg`; // ← 你项目的真实矢量 logo（Claude 自动定位）
const BGM = `${BRAND}/bgm.mp3`; // ← 免版权背景音乐
const SLOGAN = "你的产品 · 一句话价值主张"; // ← 收尾 slogan（Claude 据产品自动生成）

// ── 画布（竖版 1280×1706 默认；方版 1080×1080；横版 1920×1080）──
const CANVAS = { w: 1280, h: 1706 };

// ── 自定义界面组件登记表：场景 type → 组件 ────────────────────
// 截图场景用 'image'；代码重建的界面在这里登记
const SCREEN_REGISTRY: Record<
  string,
  React.FC<{ localFrame: number; fps: number; w: number; h: number }>
> = {
  interview: InterviewScreen,
  report: ReportScreen,
};

// ── 场景配置（← 核心：每段画面 + 字幕 + 地址栏）────────────────
type Scene = {
  type: "image" | keyof typeof SCREEN_REGISTRY | string;
  src?: string; // type==='image' 时的截图路径
  addr: string; // 地址栏文案
  title: string; // 底部大字标题
  sub: string; // 底部副标题
};
// 占位示例：每段画面 + 字幕 + 地址栏。title/sub 由 Claude 读懂该页面后自动生成。
// type:'image' 用真实截图；其余 type 在 SCREEN_REGISTRY 登记的代码重建界面。
const SCENES: Scene[] = [
  { type: "image", src: `${BRAND}/screen-1.png`, addr: "yourapp.com/page-1", title: "第一个核心功能", sub: "一句话说清它解决什么问题" },
  { type: "image", src: `${BRAND}/screen-2.png`, addr: "yourapp.com/page-2", title: "第二个核心功能", sub: "再补一句价值点" },
  { type: "image", src: `${BRAND}/screen-3.png`, addr: "yourapp.com/page-3", title: "第三个核心功能", sub: "继续往下推进叙事" },
  { type: "interview", addr: "yourapp.com/live", title: "会话型页面（代码重建）", sub: "截不到的实时页面，照真实组件重建" },
  { type: "report", addr: "yourapp.com/report", title: "报告型页面（代码重建）", sub: "依赖后端的结果页，照真实组件重建" },
];

// ── 节奏：每段帧数（默认统一 60=2s；按内容可不等长）────────────
const SCENE_FRAMES = SCENES.map(() => 60);
const STARTS = SCENE_FRAMES.reduce<number[]>((a, _, i) => {
  a.push(i === 0 ? 0 : a[i - 1] + SCENE_FRAMES[i - 1]);
  return a;
}, []);
const OUTRO = SCENE_FRAMES.reduce((a, b) => a + b, 0);
const OUTRO_FRAMES = 60;
export const TOTAL = OUTRO + OUTRO_FRAMES; // PromoRoot 的 durationInFrames

// ── 浏览器窗口几何（按画布自动算，内容区 16:10）────────────────
const FRAME_X = Math.round(CANVAS.w * 0.04);
const FRAME_W = CANVAS.w - FRAME_X * 2;
const BAR_H = 46;
const IMG_W = FRAME_W;
const IMG_H = Math.round((900 * IMG_W) / 1440); // 1440×900 等比
const FRAME_H = BAR_H + IMG_H;
const FRAME_Y = Math.round(CANVAS.h * 0.175); // 顶部留白放 logo
const CAPTION_Y = FRAME_Y + FRAME_H + Math.round(CANVAS.h * 0.06);

export const PromoVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const winIn = spring({ frame, fps, config: { damping: 200, mass: 0.8 } });
  const winInY = interpolate(winIn, [0, 1], [64, 0]);
  const winOutOpacity = interpolate(frame, [OUTRO, OUTRO + 16], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const winOutScale = interpolate(frame, [OUTRO, OUTRO + 16], [1, 0.94], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const winOpacity = winIn * winOutOpacity;
  const ken = interpolate(frame, [0, OUTRO], [1, 1.03], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let sceneIdx = 0;
  for (let i = 0; i < STARTS.length; i++) if (frame >= STARTS[i]) sceneIdx = i;
  const addr = SCENES[sceneIdx].addr;

  return (
    <AbsoluteFill style={{ backgroundColor: "#F4F4F6", fontFamily: FONT, backgroundImage: "radial-gradient(110% 90% at 50% 0%, rgba(255,255,255,0.9), rgba(244,244,246,0) 60%)" }}>
      {/* 背景音乐：整片铺底，首尾淡入淡出。要 TTS 旁白改用 scripts/gen-tts.sh + 每句 <Sequence> */}
      <Audio src={staticFile(BGM)} volume={(f) => interpolate(f, [0, 15, TOTAL - 36, TOTAL], [0, 0.85, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />

      {/* 顶部品牌 logo */}
      <div style={{ position: "absolute", top: Math.round(CANVAS.h * 0.065), left: 0, right: 0, display: "flex", justifyContent: "center", opacity: winOpacity }}>
        <Img src={staticFile(LOGO)} style={{ width: Math.round(CANVAS.w * 0.16), height: "auto" }} />
      </div>

      {/* 浏览器窗口 */}
      <div style={{ position: "absolute", left: FRAME_X, top: FRAME_Y, width: FRAME_W, height: FRAME_H, opacity: winOpacity, transform: `translateY(${winInY}px) scale(${ken * winOutScale})`, borderRadius: 18, overflow: "hidden", backgroundColor: "#FFF", boxShadow: "0 24px 60px rgba(20,20,20,0.12), 0 4px 14px rgba(20,20,20,0.06)", border: "1px solid rgba(20,20,20,0.06)" }}>
        {/* chrome bar：灰色三点 + 地址栏（不用红绿灯彩色）*/}
        <div style={{ height: BAR_H, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", backgroundColor: "#FBFBFC", borderBottom: "1px solid rgba(20,20,20,0.05)" }}>
          {[0, 1, 2].map((i) => (<div key={i} style={{ width: 11, height: 11, borderRadius: 11, backgroundColor: "#DCDCE1" }} />))}
          <div style={{ marginLeft: 14, flex: 1, height: 26, borderRadius: 8, backgroundColor: "#F0F0F2", display: "flex", alignItems: "center", paddingLeft: 14, color: "#9A9AA0", fontSize: 13, fontWeight: 500 }}>{addr}</div>
        </div>
        {/* 内容区：场景 crossfade（图片 contain 不裁；Ken Burns 在外层窗口）*/}
        <div style={{ position: "relative", width: IMG_W, height: IMG_H }}>
          {SCENES.map((scene, i) => {
            const start = STARTS[i], end = start + SCENE_FRAMES[i];
            const opacity = interpolate(frame, [start - 6, start + 6, end - 6, end + 6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const Screen = scene.type !== "image" ? SCREEN_REGISTRY[scene.type] : null;
            return (
              <div key={i} style={{ position: "absolute", inset: 0, width: IMG_W, height: IMG_H, opacity }}>
                {Screen ? <Screen localFrame={frame - start} fps={fps} w={IMG_W} h={IMG_H} /> : <Img src={staticFile(scene.src!)} style={{ width: IMG_W, height: IMG_H, objectFit: "contain" }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* 底部字幕 */}
      {SCENES.map((scene, i) => {
        const start = STARTS[i], end = start + SCENE_FRAMES[i];
        const opacity = interpolate(frame, [start, start + 8, end - 8, end], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const ty = interpolate(frame, [start, start + 8], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
        return (
          <div key={scene.title} style={{ position: "absolute", left: 0, right: 0, top: CAPTION_Y, textAlign: "center", opacity, transform: `translateY(${ty}px)` }}>
            <div style={{ color: "#141414", fontSize: 62, fontWeight: 600, letterSpacing: -1 }}>{scene.title}</div>
            <div style={{ marginTop: 22, color: "#8A8A90", fontSize: 31, fontWeight: 400 }}>{scene.sub}</div>
          </div>
        );
      })}

      {/* 收尾：logo + slogan */}
      {frame >= OUTRO && (() => {
        const appear = interpolate(frame, [OUTRO + 4, OUTRO + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
        return (
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", opacity: appear, transform: `translateY(${interpolate(appear, [0, 1], [14, 0])}px)` }}>
            <Img src={staticFile(LOGO)} style={{ width: Math.round(CANVAS.w * 0.4), height: "auto" }} />
            <div style={{ marginTop: 36, color: "#8A8A90", fontSize: 33, fontWeight: 400, letterSpacing: 1 }}>{SLOGAN}</div>
          </AbsoluteFill>
        );
      })()}
    </AbsoluteFill>
  );
};

export const PROMO_CANVAS = CANVAS;
