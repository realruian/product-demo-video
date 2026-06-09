import React from "react";
import { interpolate, Easing } from "remotion";

/**
 * 「会话型界面」重建样板（如实时语音助手 / 聊天 / 客服等截不到的页面）。
 *
 * 这是一个**范例**：演示「照你产品的真实组件代码 1:1 重建界面」的手法——
 * 顶栏状态 + 对话气泡（AI 左 / 用户右）+ 底部控制条。
 * 换产品时：去读你那个页面的真实组件，按真实结构重写这里的文案、布局、控件。
 * 内容全部是中性占位，不绑定任何具体产品。
 */
const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const FONT = `"PingFang SC", "Heiti SC", sans-serif`;

const C = {
  bg: "#F6F6F6",
  card: "#FFFFFF",
  border: "rgba(25,25,25,0.08)",
  chip: "#F2F2F2",
  strong: "#191919",
  muted: "#6B6B6B",
  subtle: "#9A9AA0",
  error: "#E5484D",
  userBubble: "rgba(25,25,25,0.05)",
  video: "#1C1C1E",
};

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.chip, borderRadius: 7, padding: "5px 10px", fontSize: 13, color: C.muted }}>{children}</span>
);

const BarBtn: React.FC<{ label: string; icon: React.ReactNode; active?: boolean }> = ({ label, icon, active }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 7, height: 38, padding: "0 13px", borderRadius: 10, background: active ? C.chip : "transparent", color: active ? C.strong : C.muted, fontSize: 13.5 }}>{icon}<span>{label}</span></div>
);

export const InterviewScreen: React.FC<{
  localFrame: number;
  fps: number;
  w: number;
  h: number;
}> = ({ localFrame, fps, w, h }) => {
  const t = localFrame / fps;
  const recDot = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 4));
  const dot = (i: number) => 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 6 - i * 0.9));
  const aiIn = interpolate(localFrame, [4, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  return (
    <div style={{ width: w, height: h, background: C.bg, fontFamily: FONT, display: "flex", flexDirection: "column" }}>
      {/* 顶栏：标题 + 状态 chip（按你产品真实页面替换）*/}
      <div style={{ height: 48, flexShrink: 0, background: C.card, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: C.strong }}>实时语音会话</span>
          <Chip>
            <span style={{ width: 6, height: 6, borderRadius: 6, background: C.error, opacity: recDot }} />
            <span style={{ fontVariantNumeric: "tabular-nums" }}>12:08</span>
          </Chip>
          <Chip>
            <span style={{ width: 6, height: 6, borderRadius: 6, background: C.strong }} />
            网络正常
          </Chip>
        </div>
        <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", color: C.subtle }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="7" rx="1.5" /><rect x="3" y="13" width="18" height="7" rx="1.5" /></svg>
        </div>
      </div>
      <div style={{ height: 1, background: C.border, margin: "0 22px", flexShrink: 0 }} />

      {/* 主区：对话字幕卡（上）+ 用户画面卡（下）*/}
      <div style={{ flex: 1, minHeight: 0, padding: "14px 24px", display: "flex" }}>
        <div style={{ margin: "0 auto", width: "100%", maxWidth: 820, display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
          <div style={{ flex: 1, minHeight: 0, position: "relative", borderRadius: 20, border: `1px solid ${C.border}`, background: C.card, padding: "22px 26px 34px", display: "flex", flexDirection: "column", gap: 22, overflow: "hidden" }}>
            <div style={{ fontSize: 16, lineHeight: "30px", color: C.strong }}>你好，很高兴见到你。我们现在开始吧。</div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ maxWidth: "75%", borderRadius: 20, background: C.userBubble, padding: "10px 22px", fontSize: 16, lineHeight: "30px", color: C.strong }}>好的，我准备好了。</div>
            </div>
            <div style={{ fontSize: 16, lineHeight: "30px", color: C.strong, opacity: aiIn, transform: `translateY(${interpolate(aiIn, [0, 1], [8, 0])}px)` }}>
              请先简单介绍一下你自己，以及你今天想了解什么。
              <span style={{ display: "inline-flex", gap: 4, marginLeft: 8, verticalAlign: "middle" }}>
                {[0, 1, 2].map((i) => (<span key={i} style={{ width: 6, height: 6, borderRadius: 6, background: C.subtle, opacity: dot(i) }} />))}
              </span>
            </div>
            <div style={{ position: "absolute", bottom: 12, left: 12, background: C.chip, borderRadius: 6, padding: "3px 8px", fontSize: 12, color: C.muted }}>实时字幕</div>
          </div>

          <div style={{ flex: 1, minHeight: 0, position: "relative", borderRadius: 20, background: C.video, border: `1px solid ${C.border}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 96, height: 96, borderRadius: 96, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
            </div>
            <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(0,0,0,0.5)", borderRadius: 6, padding: "3px 9px", fontSize: 12, color: "#FFFFFF" }}>你</div>
          </div>
        </div>
      </div>

      {/* 底部控制条 */}
      <div style={{ height: 1, background: C.border, margin: "0 16px", flexShrink: 0 }} />
      <div style={{ height: 60, flexShrink: 0, background: C.card, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <BarBtn label="信息" icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 16v-5M12 8h.01" /></svg>} />
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ display: "flex", gap: 2, background: C.chip, borderRadius: 12, padding: 4 }}>
            <div style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13.5, color: C.muted }}>手动</div>
            <div style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13.5, fontWeight: 500, color: C.strong, background: C.card, boxShadow: "0 1px 2px rgba(25,25,25,0.06)" }}>自动</div>
          </div>
          <div style={{ width: 1, height: 24, background: C.border, margin: "0 4px" }} />
          <BarBtn label="麦克风" active icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v3" stroke="currentColor" strokeWidth="2" fill="none" /></svg>} />
          <BarBtn label="画面" active icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="6" width="13" height="12" rx="2" /><path d="M15 10l6-3v10l-6-3z" /></svg>} />
          <BarBtn label="暂停" icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>} />
          <div style={{ marginLeft: 4, width: 40, height: 40, borderRadius: 10, background: C.error, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15.5c-1.2 0-2.4-.2-3.5-.6a1 1 0 0 0-1 .2l-2 2a15 15 0 0 1-6.6-6.6l2-2a1 1 0 0 0 .2-1A11 11 0 0 1 9.5 4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z" transform="rotate(135 12 12)" /></svg>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <BarBtn label="字幕" active icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 11h4M7 15h7M15 11h2" /></svg>} />
          <BarBtn label="全屏" icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" /></svg>} />
        </div>
      </div>
    </div>
  );
};
