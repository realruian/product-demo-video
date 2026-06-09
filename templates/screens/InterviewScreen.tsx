import React from "react";
import { interpolate, Easing } from "remotion";

// 面试间界面：严格还原真实 InterviewLayout 结构
// （顶栏状态 chip + 主区「AI 字幕卡 / 用户视频卡」+ 底栏控制条），在窗口内容区内渲染
const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const FONT = `"PingFang SC", "Heiti SC", sans-serif`;

// 设计 token（对齐项目 DESIGN.md 的语义色）
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

// 顶栏状态 chip
const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: C.chip,
      borderRadius: 7,
      padding: "5px 10px",
      fontSize: 13,
      color: C.muted,
    }}
  >
    {children}
  </span>
);

// 底栏图标按钮（图标占位 + 标签）
const BarBtn: React.FC<{ label: string; icon: React.ReactNode; active?: boolean }> = ({
  label,
  icon,
  active,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 7,
      height: 38,
      padding: "0 13px",
      borderRadius: 10,
      background: active ? C.chip : "transparent",
      color: active ? C.strong : C.muted,
      fontSize: 13.5,
    }}
  >
    {icon}
    <span>{label}</span>
  </div>
);

export const InterviewScreen: React.FC<{
  localFrame: number;
  fps: number;
  w: number;
  h: number;
}> = ({ localFrame, fps, w, h }) => {
  // 录制红点 / 打字点：用 sin 驱动（确定性，可渲染）
  const t = localFrame / fps;
  const recDot = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 4));
  const dot = (i: number) => 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 6 - i * 0.9));

  // 当前 AI 流式提问淡入
  const aiIn = interpolate(localFrame, [4, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  return (
    <div
      style={{
        width: w,
        height: h,
        background: C.bg,
        fontFamily: FONT,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── 顶栏 ── */}
      <div
        style={{
          height: 48,
          flexShrink: 0,
          background: C.card,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 22px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: C.strong }}>
            AI 产品经理（TOC方向）
          </span>
          <span style={{ color: C.subtle }}>·</span>
          <span style={{ fontSize: 15, color: C.muted, marginRight: 4 }}>腾讯</span>
          <Chip>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 6,
                background: C.error,
                opacity: recDot,
              }}
            />
            <span style={{ fontVariantNumeric: "tabular-nums" }}>12:08</span>
          </Chip>
          <Chip>
            <span style={{ width: 6, height: 6, borderRadius: 6, background: C.strong }} />
            网络正常
          </Chip>
          <Chip>
            好感度
            <span style={{ fontWeight: 600, color: C.strong }}>86</span>
          </Chip>
          <Chip>
            跑题
            <span style={{ fontWeight: 600, color: C.strong }}>0/3</span>
          </Chip>
        </div>
        {/* 右：布局切换图标 */}
        <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", color: C.subtle }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="7" rx="1.5" />
            <rect x="3" y="13" width="18" height="7" rx="1.5" />
          </svg>
        </div>
      </div>
      <div style={{ height: 1, background: C.border, margin: "0 22px", flexShrink: 0 }} />

      {/* ── 主区：AI 字幕卡（上）+ 用户视频卡（下），居中 820 ── */}
      <div style={{ flex: 1, minHeight: 0, padding: "14px 24px", display: "flex" }}>
        <div
          style={{
            margin: "0 auto",
            width: "100%",
            maxWidth: 820,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            minHeight: 0,
          }}
        >
          {/* AI 字幕卡 */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              position: "relative",
              borderRadius: 20,
              border: `1px solid ${C.border}`,
              background: C.card,
              padding: "22px 26px 34px",
              display: "flex",
              flexDirection: "column",
              gap: 22,
              overflow: "hidden",
            }}
          >
            {/* AI 提问（已完成，左对齐纯文本）*/}
            <div style={{ fontSize: 16, lineHeight: "30px", color: C.strong }}>
              你好，欢迎参加本次面试。先请你做个简短的自我介绍吧。
            </div>
            {/* 用户回答（右对齐浅灰气泡）*/}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  maxWidth: "75%",
                  borderRadius: 20,
                  background: C.userBubble,
                  padding: "10px 22px",
                  fontSize: 16,
                  lineHeight: "30px",
                  color: C.strong,
                }}
              >
                面试官好，我是张明，5 年 AI 产品经验，主导过 LLM 应用从 0 到 1 的落地。
              </div>
            </div>
            {/* 当前 AI 流式提问 + 打字三点 */}
            <div
              style={{
                fontSize: 16,
                lineHeight: "30px",
                color: C.strong,
                opacity: aiIn,
                transform: `translateY(${interpolate(aiIn, [0, 1], [8, 0])}px)`,
              }}
            >
              听起来不错。能具体讲讲你最有成就感的一个 AI 项目，以及你在其中的核心贡献吗？
              <span style={{ display: "inline-flex", gap: 4, marginLeft: 8, verticalAlign: "middle" }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 6,
                      background: C.subtle,
                      opacity: dot(i),
                    }}
                  />
                ))}
              </span>
            </div>
            {/* 左下角标签 */}
            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: 12,
                background: C.chip,
                borderRadius: 6,
                padding: "3px 8px",
                fontSize: 12,
                color: C.muted,
              }}
            >
              AI 对话字幕
            </div>
          </div>

          {/* 用户摄像头视频卡 */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              position: "relative",
              borderRadius: 20,
              background: C.video,
              border: `1px solid ${C.border}`,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* 摄像头画面占位：居中头像 */}
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 96,
                background: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                fontWeight: 500,
              }}
            >
              张
            </div>
            {/* 左下 nameplate */}
            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: 12,
                background: "rgba(0,0,0,0.5)",
                borderRadius: 6,
                padding: "3px 9px",
                fontSize: 12,
                color: "#FFFFFF",
              }}
            >
              张明
            </div>
          </div>
        </div>
      </div>

      {/* ── 底栏控制条 ── */}
      <div style={{ height: 1, background: C.border, margin: "0 16px", flexShrink: 0 }} />
      <div
        style={{
          height: 60,
          flexShrink: 0,
          background: C.card,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        {/* 左：岗位信息 */}
        <BarBtn
          label="岗位信息"
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
              <path d="M14 3v5h5M9 13h6M9 17h6" />
            </svg>
          }
        />
        {/* 中：核心控制 */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* 手动 / 自动 分段 */}
          <div style={{ display: "flex", gap: 2, background: C.chip, borderRadius: 12, padding: 4 }}>
            <div style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13.5, color: C.muted }}>手动</div>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 13.5,
                fontWeight: 500,
                color: C.strong,
                background: C.card,
                boxShadow: "0 1px 2px rgba(25,25,25,0.06)",
              }}
            >
              自动
            </div>
          </div>
          <div style={{ width: 1, height: 24, background: C.border, margin: "0 4px" }} />
          {/* 麦克风 */}
          <BarBtn
            label="麦克风"
            active
            icon={
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M6 11a6 6 0 0 0 12 0M12 17v3" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            }
          />
          {/* 画面 */}
          <BarBtn
            label="画面"
            active
            icon={
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="6" width="13" height="12" rx="2" />
                <path d="M15 10l6-3v10l-6-3z" />
              </svg>
            }
          />
          {/* 暂停 */}
          <BarBtn
            label="暂停"
            icon={
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            }
          />
          {/* 结束面试（红） */}
          <div
            style={{
              marginLeft: 4,
              width: 40,
              height: 40,
              borderRadius: 10,
              background: C.error,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 15.5c-1.2 0-2.4-.2-3.5-.6a1 1 0 0 0-1 .2l-2 2a15 15 0 0 1-6.6-6.6l2-2a1 1 0 0 0 .2-1A11 11 0 0 1 9.5 4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z" transform="rotate(135 12 12)" />
            </svg>
          </div>
        </div>
        {/* 右：字幕 + 全屏 */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <BarBtn
            label="字幕"
            active
            icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M7 11h4M7 15h7M15 11h2" />
              </svg>
            }
          />
          <BarBtn
            label="全屏"
            icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};
