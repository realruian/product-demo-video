#!/usr/bin/env bash
# 从 Mixkit 拉免版权可商用 BGM 候选并试听，让用户选。
# 用法：bash get-bgm.sh [mood]        mood: uplifting(默认) / energetic / happy / ...
# 版权：Mixkit & Pixabay 免版权、可商用、免署名（勿用于 CD/DVD/游戏/电视广播）。
set -e
MOOD="${1:-uplifting}"
curl -s -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" \
  "https://mixkit.co/free-stock-music/mood/$MOOD/" -o /tmp/mixkit.html

echo "=== $MOOD 曲目（时长 / 曲风 / 名字 / 链接）==="
python3 -c "
import re
html=open('/tmp/mixkit.html').read()
items=re.findall(r'\"@type\":\"MusicRecording\",\"name\":\"([^\"]+)\",\"genre\":\"([^\"]+)\",\"byArtist\":\"[^\"]+\",\"duration\":\"([^\"]+)\",\"url\":\"(https://assets.mixkit.co/music/\d+/\d+.mp3)\"',html)
# 极简产品片优先 电子/企业/流行/Chill，避开 Rock/Metal
pref=('Electronic','House','Corporate','Pop','Chill','Ambient','Lo-Fi','Funk','Dance')
picked=[x for x in items if any(p.lower() in x[1].lower() for p in pref)] or items
for n,g,d,u in picked[:18]: print(f'{d:8} {g:16} {n[:30]:30} {u}')
"

# 下载 + 试听某首（把 ID 换成上面链接里的数字）：
#   curl -A Mozilla/5.0 https://assets.mixkit.co/music/<ID>/<ID>.mp3 -o /tmp/bgm.mp3
#   afplay -t 10 /tmp/bgm.mp3                       # 试听前 10 秒
# 选定后放进项目：
#   cp /tmp/bgm.mp3 public/<brand>/bgm.mp3
# PromoVideo 已用 <Audio src bgm> 整片铺底 + 首尾淡入淡出。
