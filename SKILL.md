---
name: product-demo-video
description: 把一个 web 产品的真实页面做成高质感的竖版/方版/横版产品演示片（用 Remotion）。当用户要「给产品做演示视频 / 宣传片 / product demo / 功能演示动画」、「把某页面做成视频」、「产品片配音/配乐」时触发。封装完整流程：启动项目→登录→截真实页面→截不到的页按真实组件代码 1:1 重建→浏览器窗口 mockup 场景编排→统一调性（字幕/logo/配色/缓动/节奏）→TTS 旁白或免版权 BGM→渲染输出。不用于纯前端开发、纯图片生成、或不涉及真实产品页面的抽象动画。
metadata:
  tags: remotion, video, product-demo, screenshot, tts, bgm, browser-mockup
  requires: remotion-best-practices, agent-browser
---

# Product Demo Video（产品演示片）

把一个真实 web 产品做成**有调性**的演示片：真实页面截图 + 代码重建的界面，组装进浏览器窗口 mockup，配字幕、logo、音乐，渲染成竖屏/方屏短视频。

**前置 skill**：本 skill 依赖 [`remotion-best-practices`]（视频框架）和 [`agent-browser`]（截图）。处理 Remotion 代码前先加载 remotion-best-practices 拿领域知识。

## 何时用

用户要把一个跑得起来的 web 产品（自己的项目 / 给定目录）做成产品演示 / 宣传短视频。典型："给我们的 jobs 页面做个演示视频"、"把这个产品做成竖屏宣传片"。

## 产物形态

一个 Remotion 项目，渲染出 mp4：
- **画布**：竖版 1280×1706（3:4，默认，适合社媒）/ 方版 1080×1080 / 横版 1920×1080
- **结构**：N 个场景，每个场景 = 一张产品页面（真实截图或代码重建）放进**浏览器窗口 mockup**，配底部字幕；场景间 crossfade + 整窗缓慢 Ken Burns；收尾落到品牌 logo + slogan
- **声音**：免版权 BGM（默认）或 TTS 旁白（可选）

## 完整流程（5 阶段）

### 阶段 1 — 摸清产品 & 规划叙事
1. 读项目 `CLAUDE.md` / `README.md` / `DESIGN.md`，搞清：产品是什么、有哪些核心页面/功能、**调性规范**（配色/字体/禁忌——见 reference/tone.md，必须遵守项目自己的 DESIGN.md）。
2. 列出页面路由（`find app -name page.tsx`），规划一条「用户旅程」叙事线（如：选岗位→简历→面试→报告）。
3. 跟用户确认：画布比例、纳入哪些环节、节奏、声音方案。**截不到真实图的页面要提前标注风险**（实时/需特殊数据的页面）。

### 阶段 2 — 截真实页面（能截的优先）
用 `agent-browser`。详见 [scripts/capture-pages.md](scripts/capture-pages.md)。要点：
- 启动目标项目前后端（后台），等就绪。
- **设标准视口** `agent-browser set viewport 1440 900 2`（@2x retina，16:10 正常浏览器比例，截图清晰）。
- **处理登录**：多数 `(app)` 页面要登录。从 dev.db 找测试账号；密码是 hash，**经用户授权**后用项目自己的 hash 函数临时重置（截完**必须还原**，见教训）。
- **去掉 dev 角标**：`agent-browser eval "document.querySelectorAll('nextjs-portal').forEach(e=>e.remove())"`。
- 每个目标页面截一张干净图，存进 Remotion 项目 `public/<brand>/`。

### 阶段 3 — 代码重建截不到的页面（关键质量点）
有些页面截不到真实图（实时语音面试间 headless 无麦克风、报告页依赖后端生成、数据缺失）。**不要凭想象画**——
1. **去读真实组件代码**（`components/.../XxxLayout.tsx` 等），看清真实的布局/元素/数据结构。
2. 按真实结构在 Remotion 里 1:1 重建成一个 React 组件，渲染进窗口内容区（尺寸 = 窗口内容区 W×H）。
3. 范例见 [templates/screens/InterviewScreen.tsx](templates/screens/InterviewScreen.tsx)（实时面试间）、[templates/screens/ReportScreen.tsx](templates/screens/ReportScreen.tsx)（评估报告）——它们是「照真实代码重建」的样板，换产品时照搬手法、重写内容。

### 阶段 4 — 组装演示片
用 [templates/PromoVideo.tsx](templates/PromoVideo.tsx) 作骨架（浏览器 mockup + 场景 crossfade + Ken Burns + 字幕 + Outro + 音频），[templates/PromoRoot.tsx](templates/PromoRoot.tsx) 注册 composition。
- 每个场景配置 `{ type: 'image'|'<custom>', src?, addr, title, sub }`。
- 地址栏随场景变（提升真实感）。
- 顶部 + 收尾用**项目真实 logo**（找 `public/icons/logo.svg` 之类的矢量字标，别用纯文字）。
- 严格遵守**调性规范**（见下）。

### 阶段 5 — 声音 & 渲染
- **BGM（默认）**：Mixkit 免版权可商用音乐，[scripts/get-bgm.sh](scripts/get-bgm.sh) 下载+试听让用户选。整片铺底，首尾淡入淡出。
- **TTS 旁白（可选）**：[scripts/gen-tts.sh](scripts/gen-tts.sh)，走 AiHubMix/OpenAI 兼容 `/audio/speech`（gpt-4o-mini-tts 真人级，需用户 key）。每句对齐场景，场景时长按旁白长度。**别用 macOS `say`**（机械音，用户嫌弃过）。
- 渲染：`npx remotion render <id> out/<name>.mp4`，验证含 audio 轨 + 时长，拷到 `~/Desktop/`。

## Tone — 调性规范（这是「terminal」质感的关键，详见 reference/tone.md）

**默认调性 = 克制、专业、真实**。除非项目 DESIGN.md 另有要求：
- **配色**：白底（`#F4F4F6` 画布 / `#FFF` 窗口）+ 黑白灰文字（`#141414` / `#8A8A90`），**不引彩色**；功能性红点（录制/连接）等照真实保留。
- **字体**：中英文统一 PingFang（`"PingFang SC","Heiti SC",sans-serif`），渲染机为 macOS 直接可用；不引 Inter 等（中文 fallback 不一致）。
- **浏览器 mockup**：圆角 18 白窗 + 顶部 chrome bar（三个**灰色**圆点，不用红绿灯彩色 + 地址栏 pill），柔和投影。
- **运镜**：缓动统一 `Easing.bezier(0.16,1,0.3,1)`；窗口浮入用 spring；整窗缓慢 Ken Burns scale 1→1.03（**作用在窗口不是内部图片，否则裁内容**）。
- **节奏**：场景统一时长（默认每段 60 帧/2s @30fps），整齐；想卡点可测 BGM 的 BPM 对齐小节。
- **字幕**：底部居中，标题 PingFang Semibold 大字 + 副标题灰色小字，crossfade。
- **无 emoji**。

**反面清单（别做）**：彩色乱用、红绿灯彩点、Inter 配中文、objectFit cover 放大裁掉页面内容、凭想象画截不到的页面、机械音 TTS、节奏忽快忽慢、纯文字假 logo。

## 踩坑教训（来自首次实战，必看）

- **headless 浏览器没有麦克风/摄像头**：实时语音类页面（面试间）会卡在「准备/麦克风不可用」，截不到——直接走代码重建，别死磕。
- **本地 dev.db schema 漂移**：代码加了 migration 但本地库没跑，会 500（如 `no such column: candidates.updated_at`）。为截图/填数据，可 `ALTER TABLE ADD COLUMN` 补**缺失的列**（安全，不删数据），但要说明。
- **改 dev.db 必须还原**：重置的测试密码、临时填充的示例数据，截完一律还原原值（先备份原 hash/JSON）。补的列可保留（本就是代码期望的）。
- **objectFit 别裁内容**：截图放进窗口用 `objectFit:"contain"` 完整显示；Ken Burns 放大要作用在外层窗口，不是图片，否则页面底部被裁。
- **真实页面字段名要去代码确认**：填充示例数据（如简历）时，字段名（`work_experience` 不是 `work`、`self_introduction` 不是 `highlights`）必须读前端渲染代码确认，别猜。
- **中文文案含 ASCII 双引号 → 整个 string 用 backtick**（全局 CLAUDE.md 规则）。
- **Bash cwd 跨调用持久**：用绝对路径，别重复 `cd 子目录`。

## 快速校验

改完 Remotion 代码：`npx tsc --noEmit`；渲染关键帧 `npx remotion still <id> out/check.png --frame=N --scale=0.5` 自检视觉；终渲染后 `ffprobe` 确认音轨+时长。
