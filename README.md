# product-demo-video

> A [Claude Code](https://claude.com/claude-code) skill that turns a real web product into a polished, on-brand demo video — powered by [Remotion](https://remotion.dev).
>
> 一个 Claude Code 技能：把真实 web 产品的页面，做成有调性的产品演示短片。

<p align="center">
  <img src="assets/demo.gif" width="300" alt="demo" />
</p>

## 这是什么

安装后，对任意**能跑起来**的 web 产品说一句「给我的产品做个演示视频」，Claude 就会自动：

1. 启动项目、处理登录，用浏览器**截真实页面**
2. 截不到的页面（实时交互 / 依赖特殊数据）→ **读真实组件代码 1:1 重建**，不靠想象
3. 组装成浏览器窗口 mockup 的竖屏短片：场景转场 + Ken Burns 运镜 + 字幕 + 真实 logo
4. 配免版权 BGM，或真人级 TTS 旁白
5. 渲染输出

全程遵守一套**固化的设计调性**，产出不像模板、有质感的片子。

## 效果

下面是用它给 AI 模拟面试产品 **Lollipop** 生成的演示片画面：

|  选岗位 · 真实截图  |  简历教练 · 真实截图  |
| :---: | :---: |
| <img src="assets/scene-jobs.png" width="360" /> | <img src="assets/scene-resume.png" width="360" /> |
|  **面试中 · 代码重建**  |  **评估报告 · 代码重建**  |
| <img src="assets/scene-interview.png" width="360" /> | <img src="assets/scene-report.png" width="360" /> |

完整视频：[`assets/demo.mp4`](assets/demo.mp4)（1280×1706 · 12s · 含背景音乐）

> 「真实截图」直接来自产品页面；「代码重建」是因为实时面试间（无麦克风）和报告页（依赖后端）截不到真实图，于是**读真实组件代码 1:1 还原**——两者在同一套浏览器 mockup 里无缝衔接。

## 特性

- **真实页面 → 视频**：用 [agent-browser](https://github.com/agent-browser/agent-browser) 自动截图，不用假数据
- **截不到就照代码重建**：读真实组件，1:1 还原界面，杜绝凭想象画
- **固化调性**：配色 / 字体 / 缓动 / 节奏 / 字幕写成规范 + 反面清单，稳定复现质感
- **配音可选**：Mixkit 免版权 BGM，或 AiHubMix·OpenAI 真人级 TTS 旁白
- **多比例**：竖版 1280×1706 / 方版 1080×1080 / 横版 1920×1080
- **沉淀踩坑**：headless 无麦克风、本地 DB schema 漂移、改库必还原…都写进了 SKILL

## 安装

把仓库克隆进 Claude Code 的 skills 目录：

```bash
git clone https://github.com/realruian/product-demo-video.git ~/.claude/skills/product-demo-video
```

重启 Claude Code，它会自动出现在技能列表里。

### 依赖

- **remotion-best-practices**（视频框架）：`npx skills add remotion-dev/skills`
- **agent-browser**（截图）：`npm i -g agent-browser && agent-browser install`
- 渲染机建议 **macOS**（字体用 PingFang）
- 可选：TTS 需要 OpenAI 兼容的 API key（AiHubMix / OpenAI 等）

## 使用

对 Claude Code 说，例如：

> 给我们的 jobs 页面做个竖屏产品演示视频

Claude 会加载本 skill 的流程，先跟你确认 **画布比例 / 纳入哪些页面 / 节奏 / 声音方案**，再端到端做出来。换产品时主要改 `templates/PromoVideo.tsx` 顶部的 `BRAND` 与 `SCENES`。

## 结构

```
SKILL.md              主说明书（流程 + 调性 + 踩坑教训）
reference/tone.md     调性规范详述（配色 / 字体 / 缓动 / 节奏 / 反面清单）
templates/
  PromoVideo.tsx      浏览器 mockup + 场景编排 + 字幕 + Outro + 音频
  PromoRoot.tsx       Remotion composition 注册
  screens/            「照真实代码重建界面」范例（面试间 / 报告页）
scripts/
  capture-pages.md    agent-browser 登录截图全流程
  gen-tts.sh          真人 TTS 旁白生成
  get-bgm.sh          Mixkit 免版权 BGM 下载试听
```

## 调性（灵魂所在）

这套调性是「高质感、不像 AI」的关键，详见 [`reference/tone.md`](reference/tone.md)：白底黑白灰、PingFang、灰点浏览器 mockup、统一缓动与节奏、真实矢量 logo、无 emoji，以及一份「出现即降级为 AI 味」的反面清单。优先遵守目标项目自己的 `DESIGN.md`。

## License

[MIT](LICENSE) © realruian

演示素材（Lollipop 产品界面）版权归 Lollipop 团队所有，仅用于展示本 skill 的效果。
