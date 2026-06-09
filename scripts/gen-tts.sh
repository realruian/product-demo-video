#!/usr/bin/env bash
# 真人级 TTS 旁白生成（AiHubMix / OpenAI 兼容 /audio/speech）。
# 用法：
#   1) 提供 key（不入对话）：  printf %s 'YOUR_KEY' > /tmp/tts_key
#   2) 编辑下面的 VO 数组（每句对应一个场景）与 OUT_DIR
#   3) bash gen-tts.sh
#   4) 按打印的时长设 PromoVideo 的 SCENE_FRAMES = round((dur+0.4)*30)，
#      每句加 <Sequence from={STARTS[i]+2}><Audio src=.../></Sequence>
# 注意：别用 macOS `say`（机械音，被嫌弃过）。gpt-4o-mini-tts 真人级且能 prompt 控语气。
set -e
KEY=$(cat /tmp/tts_key)
BASE="https://aihubmix.com/v1/audio/speech"   # OpenAI 官方: https://api.openai.com/v1/audio/speech
MODEL="gpt-4o-mini-tts"                         # 备选 tts-1-hd
VOICE="coral"                                   # 女声: coral/nova/shimmer/sage  男声: ash/echo/onyx
INSTR="温暖亲和的中文女声，像产品讲解，语速自然偏快、干练利落，吐字清晰，不要拖沓不要机械"
OUT_DIR="public/lollipop/vo"                    # ← 改成你的 brand 目录
SPEEDUP="1.15"                                  # gpt-4o 偏慢，轻微提速（atempo 不变调）；不需要设 1.0

VO=(
"一句话，定制你的专属模拟面试"
"海量真实岗位，对口直接开练"
"简历不会写？AI 教练帮你逐段打磨"
"真人级实时语音面试，开口就练"
"面试结束，深度评估报告即时生成"
"Lollipop，你的 AI 面试官，全天候在线"
)

mkdir -p "$OUT_DIR"
for i in "${!VO[@]}"; do
  n=$((i+1))
  curl -s "$BASE" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
    -d "{\"model\":\"$MODEL\",\"input\":\"${VO[$i]}\",\"voice\":\"$VOICE\",\"instructions\":\"$INSTR\",\"response_format\":\"mp3\"}" \
    -o "/tmp/vo$n.mp3"
  # 校验不是错误 json
  if file "/tmp/vo$n.mp3" | grep -qi json; then echo "vo$n 失败："; head -c 200 "/tmp/vo$n.mp3"; echo; continue; fi
  ffmpeg -y -loglevel error -i "/tmp/vo$n.mp3" -filter:a "atempo=$SPEEDUP" "$OUT_DIR/vo$n.m4a"
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT_DIR/vo$n.m4a")
  printf "vo%s: %.2fs  「%s」\n" "$n" "$dur" "${VO[$i]}"
  rm -f "/tmp/vo$n.mp3"
done
echo "完成。把各 dur 代入 SCENE_FRAMES = round((dur+0.4)*30)。"
