import React from "react";
import { interpolate, Easing } from "remotion";

/**
 * 「报告 / 仪表盘型界面」重建样板（如结果页 / 分析报告 / 数据概览等截不到的页面）。
 *
 * 这是一个**范例**：演示「照你产品的真实组件代码 1:1 重建界面」的手法——
 * 顶栏标题 + 操作按钮 + 左侧锚点 + KPI 卡 + 总结 + 明细列表。
 * 换产品时：去读你那个页面的真实组件，按真实结构重写指标、文案、卡片。
 * 内容全部是中性占位，不绑定任何具体产品。
 */
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

// 明细数据（占位）
const ITEMS = [
  { label: "第一项", score: 6, q: "这一项的关键问题或维度是什么？", a: "对应的回答 / 数据摘要写在这里。", note: "优点：要点清晰；可提升：补充量化。" },
  { label: "第二项", score: 4, q: "第二个维度的问题或指标？", a: "对应的回答 / 数据摘要写在这里。", note: "优点：结构完整；可提升：再深入。" },
];

const H2: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <h2 style={{ fontSize: 20, fontWeight: 600, color: C.strong, margin: 0, ...style }}>{children}</h2>
);

export const ReportScreen: React.FC<{
  localFrame: number;
  w: number;
  h: number;
}> = ({ localFrame, w, h }) => {
  const score = Math.round(interpolate(localFrame, [4, 28], [0, 86], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE }));

  return (
    <div style={{ width: w, height: h, background: C.card, fontFamily: FONT, display: "flex", flexDirection: "column" }}>
      {/* 顶栏：标题 + 操作（按你产品真实页面替换）*/}
      <div style={{ flexShrink: 0, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 16, padding: "20px 36px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 21, fontWeight: 600, color: C.strong }}>分析报告</div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 5 }}>示例对象 · 概览信息 · 生成时间</div>
        </div>
        <div style={{ flexShrink: 0, background: C.bg, borderRadius: 10, padding: "9px 16px", fontSize: 14, fontWeight: 500, color: C.strong }}>导出</div>
        <div style={{ flexShrink: 0, background: C.strong, borderRadius: 10, padding: "9px 16px", fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>再来一次</div>
        <div style={{ flexShrink: 0, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
        {/* 左侧锚点 */}
        <aside style={{ width: 200, flexShrink: 0, padding: "30px 16px 0 32px" }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: C.strong, padding: "6px 8px" }}>一、总体概览</div>
          <div style={{ height: 12 }} />
          <div style={{ fontSize: 14, fontWeight: 500, color: C.strong, padding: "6px 8px" }}>二、逐项明细</div>
          {ITEMS.map((q) => (<div key={q.label} style={{ fontSize: 14, color: C.muted, padding: "6px 8px 6px 24px" }}>{q.label}</div>))}
        </aside>

        {/* 右侧内容 */}
        <main style={{ flex: 1, minWidth: 0, padding: "30px 40px", overflow: "hidden" }}>
          <H2 style={{ marginBottom: 18 }}>一、总体概览</H2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 22 }}>
            <Kpi label="结果" value="通过" valueColor={C.success} appear={localFrame} delay={4} />
            <Kpi label="综合评分" value={String(score)} appear={localFrame} delay={7} />
            <Kpi label="项目数" value="5" appear={localFrame} delay={10} />
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: C.primary, margin: 0, opacity: interpolate(localFrame, [14, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            整体表现良好。各项指标结构清晰、重点突出；建议在关键环节补充更多量化依据，并对薄弱项做针对性优化。
          </p>

          <H2 style={{ marginTop: 30, marginBottom: 16 }}>二、逐项明细</H2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {ITEMS.map((q, i) => (<ItemCard key={q.label} q={q} index={i} localFrame={localFrame} delay={20 + i * 5} />))}
          </div>
        </main>
      </div>
    </div>
  );
};

const Kpi: React.FC<{ label: string; value: string; valueColor?: string; appear: number; delay: number }> = ({ label, value, valueColor, appear, delay }) => {
  const o = interpolate(appear, [delay, delay + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return (
    <div style={{ background: C.bg, borderRadius: 12, padding: "16px 20px", opacity: o, transform: `translateY(${interpolate(o, [0, 1], [10, 0])}px)` }}>
      <div style={{ fontSize: 12, color: C.subtle }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: valueColor ?? C.strong, marginTop: 5 }}>{value}</div>
    </div>
  );
};

const ItemCard: React.FC<{ q: (typeof ITEMS)[number]; index: number; localFrame: number; delay: number }> = ({ q, index, localFrame, delay }) => {
  const o = interpolate(localFrame, [delay, delay + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return (
    <div style={{ background: C.bg, borderRadius: 12, padding: "20px 24px", opacity: o, transform: `translateY(${interpolate(o, [0, 1], [12, 0])}px)` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ minWidth: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: C.card, borderRadius: 6, fontSize: 12, fontWeight: 600, color: C.strong }}>{index + 1}</span>
          <span style={{ fontSize: 14, fontWeight: 500, color: C.strong }}>{q.label}</span>
        </div>
        <span style={{ fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>评分<span style={{ fontWeight: 600, color: C.success }}>+{q.score}</span></span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <SubBlock label="问题" text={q.q} />
        <SubBlock label="回答" text={q.a} />
        <SubBlock label="点评" text={q.note} />
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
