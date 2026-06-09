import React from "react";
import { interpolate, Easing } from "remotion";

// 面试评估报告界面：严格还原真实 ReportModal 结构
// （顶栏 + 左侧锚点 + 「一、本场表现」3 KPI + 总结 + 「二、逐题拆解」题卡）
const EASE = Easing.bezier(0.16, 1, 0.3, 1);
const FONT = `"PingFang SC", "Heiti SC", sans-serif`;

const C = {
  card: "#FFFFFF",
  border: "rgba(25,25,25,0.08)",
  bg: "#F2F2F2",
  strong: "#191919",
  primary: "#2A2A2A",
  muted: "#6B6B6B",
  subtle: "#9A9AA0",
  success: "#2E9E5B",
};

// 逐题拆解数据
const QA = [
  {
    label: "自我介绍",
    fav: 6,
    question: "先请你做个简短的自我介绍吧。",
    answer:
      "我是张明，5 年 AI 产品经验，主导过 LLM 应用从 0 到 1 的落地，会话采纳率从 50% 提升至 58%。",
    review: "优点：信息密度高、量化清晰；不足：可再点出与目标岗位的匹配点。",
  },
  {
    label: "项目深挖",
    fav: 4,
    question: "讲讲你最有成就感的一个 AI 项目，以及你在其中的核心贡献。",
    answer:
      "我负责对话式简历优化助手，基于 RAG + LLM 把润色准确率提升了 35%，并推动跨团队落地。",
    review: "优点：结果导向、有量化指标；不足：对失败案例的复盘可以再深入。",
  },
];

// 主内容小标题
const H2: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <h2 style={{ fontSize: 20, fontWeight: 600, color: C.strong, margin: 0, ...style }}>
    {children}
  </h2>
);

export const ReportScreen: React.FC<{
  localFrame: number;
  w: number;
  h: number;
}> = ({ localFrame, w, h }) => {
  // 好感度 count-up
  const fav = Math.round(
    interpolate(localFrame, [4, 28], [0, 86], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    }),
  );

  return (
    <div
      style={{
        width: w,
        height: h,
        background: C.card,
        fontFamily: FONT,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── 顶栏 ── */}
      <div
        style={{
          flexShrink: 0,
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "20px 36px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 21, fontWeight: 600, color: C.strong }}>
            腾讯｜AI 产品经理（TOC方向）
          </div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 5 }}>
            正岗 · 20-30K · 本科 · 5-10年工作经验 · 资深面试官
          </div>
        </div>
        <div
          style={{
            flexShrink: 0,
            background: C.bg,
            borderRadius: 10,
            padding: "9px 16px",
            fontSize: 14,
            fontWeight: 500,
            color: C.strong,
          }}
        >
          导出面试记录
        </div>
        <div
          style={{
            flexShrink: 0,
            background: C.strong,
            borderRadius: 10,
            padding: "9px 16px",
            fontSize: 14,
            fontWeight: 600,
            color: "#FFFFFF",
          }}
        >
          重新面试
        </div>
        <div
          style={{
            flexShrink: 0,
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.muted,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>

      {/* ── 主体：左锚点 + 右内容 ── */}
      <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
        {/* 左侧锚点 */}
        <aside style={{ width: 200, flexShrink: 0, padding: "30px 16px 0 32px" }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: C.strong, padding: "6px 8px" }}>
            一、本场表现
          </div>
          <div style={{ height: 12 }} />
          <div style={{ fontSize: 14, fontWeight: 500, color: C.strong, padding: "6px 8px" }}>
            二、逐题拆解
          </div>
          {QA.map((q) => (
            <div
              key={q.label}
              style={{ fontSize: 14, color: C.muted, padding: "6px 8px 6px 24px" }}
            >
              {q.label}
            </div>
          ))}
        </aside>

        {/* 右侧内容 */}
        <main style={{ flex: 1, minWidth: 0, padding: "30px 40px", overflow: "hidden" }}>
          {/* 一、本场表现 */}
          <H2 style={{ marginBottom: 18 }}>一、本场表现</H2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 22 }}>
            <Kpi label="面试结果" value="通过" valueColor={C.success} appear={localFrame} delay={4} />
            <Kpi label="本场好感度" value={String(fav)} appear={localFrame} delay={7} />
            <Kpi label="提问轮次" value="5" appear={localFrame} delay={10} />
          </div>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: C.primary,
              margin: 0,
              opacity: interpolate(localFrame, [14, 26], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            整体表现良好。项目经历量化清晰、结果导向强，对 LLM 应用落地有体系化理解；建议在回答中更聚焦核心结论，并加强对失败案例的复盘深度。
          </p>

          {/* 二、逐题拆解 */}
          <H2 style={{ marginTop: 30, marginBottom: 16 }}>二、逐题拆解</H2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {QA.map((q, i) => (
              <QaCard key={q.label} q={q} index={i} localFrame={localFrame} delay={20 + i * 5} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

// KPI 卡
const Kpi: React.FC<{
  label: string;
  value: string;
  valueColor?: string;
  appear: number;
  delay: number;
}> = ({ label, value, valueColor, appear, delay }) => {
  const o = interpolate(appear, [delay, delay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return (
    <div
      style={{
        background: C.bg,
        borderRadius: 12,
        padding: "16px 20px",
        opacity: o,
        transform: `translateY(${interpolate(o, [0, 1], [10, 0])}px)`,
      }}
    >
      <div style={{ fontSize: 12, color: C.subtle }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: valueColor ?? C.strong, marginTop: 5 }}>
        {value}
      </div>
    </div>
  );
};

// 逐题拆解卡
const QaCard: React.FC<{
  q: (typeof QA)[number];
  index: number;
  localFrame: number;
  delay: number;
}> = ({ q, index, localFrame, delay }) => {
  const o = interpolate(localFrame, [delay, delay + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return (
    <div
      style={{
        background: C.bg,
        borderRadius: 12,
        padding: "20px 24px",
        opacity: o,
        transform: `translateY(${interpolate(o, [0, 1], [12, 0])}px)`,
      }}
    >
      {/* header：序号 + 标签 + 好感度 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              minWidth: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: C.card,
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              color: C.strong,
            }}
          >
            {index + 1}
          </span>
          <span style={{ fontSize: 14, fontWeight: 500, color: C.strong }}>{q.label}</span>
        </div>
        <span style={{ fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>
          好感度
          <span style={{ fontWeight: 600, color: C.success }}>+{q.fav}</span>
        </span>
      </div>
      {/* 三块 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <SubBlock label="面试官提问" text={q.question} />
        <SubBlock label="我的回答" text={q.answer} />
        <SubBlock label="本轮拆解" text={q.review} />
      </div>
    </div>
  );
};

const SubBlock: React.FC<{ label: string; text: string }> = ({ label, text }) => (
  <div style={{ background: C.card, borderRadius: 8, padding: "11px 16px" }}>
    <div style={{ fontSize: 12, fontWeight: 500, color: C.strong, marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 14, lineHeight: 1.7, color: C.primary }}>{text}</div>
  </div>
);
