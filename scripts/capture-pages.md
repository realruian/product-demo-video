# 截真实页面（agent-browser）

先加载 `agent-browser` skill。目标：把产品的关键页面截成干净高清图，存进 Remotion 项目 `public/<brand>/`。

## 1. 启动目标项目（后台）
```bash
# 后端（按项目实际命令，常见 uvicorn / npm）
cd <proj>/backend && nohup .venv/bin/uvicorn main:app --port 8000 > /tmp/be.log 2>&1 &
# 前端
cd <proj>/frontend && nohup npm run dev > /tmp/fe.log 2>&1 &
# 等就绪（Bash run_in_background + until 循环）
until grep -qE "Ready|Local:|compiled|Error" /tmp/fe.log && curl -s -o /dev/null http://localhost:8000/docs; do sleep 1; done
```

## 2. 设标准视口（@2x retina）
```bash
agent-browser open "http://localhost:3000"
agent-browser set viewport 1440 900 2      # 16:10 正常浏览器比例，截图清晰
```

## 3. 处理登录（多数 (app) 页面要登录）
- 从 dev.db 找测试账号：`sqlite3 dev.db "SELECT email FROM users LIMIT 5;"`
- 密码是 hash。**经用户授权**后用项目自己的 hash 函数临时重置（截完必须还原）：
```bash
# 先备份原 hash！
.venv/bin/python - <<'PY'
import sqlite3, bcrypt, pathlib
db=sqlite3.connect("dev.db"); c=db.cursor()
row=c.execute("SELECT hashed_password FROM users WHERE email=?",("test@x.com",)).fetchone()
pathlib.Path("/tmp/old_hash").write_text(row[0])   # 备份
c.execute("UPDATE users SET hashed_password=?,is_activated=1,is_banned=0 WHERE email=?",
          (bcrypt.hashpw(b"Temp@2026",bcrypt.gensalt(12)).decode(),"test@x.com"))
db.commit()
PY
```
- 填表单登录（注意精确匹配密码框，别匹配到「忘记密码」按钮）：
```bash
agent-browser open "http://localhost:3000/<protected-path>"   # 触发跳登录
SNAP=$(agent-browser snapshot -i)
E=$(echo "$SNAP" | grep 'textbox "邮箱"' | grep -oE 'e[0-9]+' | head -1)
P=$(echo "$SNAP" | grep 'textbox "密码"' | grep -oE 'e[0-9]+' | head -1)
B=$(echo "$SNAP" | grep 'button "登录"' | grep -oE 'e[0-9]+' | head -1)
agent-browser fill @$E "test@x.com"; agent-browser fill @$P "Temp@2026"; agent-browser click @$B
agent-browser wait --load networkidle
```

## 4. 截图（每页一张干净图）
```bash
agent-browser open "http://localhost:3000/<page>"
agent-browser wait --load networkidle
agent-browser eval "document.querySelectorAll('nextjs-portal').forEach(e=>e.remove())"  # 去 Next dev 角标
agent-browser screenshot /tmp/shot.png
cp /tmp/shot.png <remotion>/public/<brand>/<page>.png
```
- 弹窗/详情：滚到可见处 `agent-browser scroll down N`，`snapshot -i` 找元素 ref，`click` 打开，再截。

## 5. 善后（重要）
```bash
agent-browser close
# 还原测试密码 + 任何临时改的 dev.db 数据（用备份）
.venv/bin/python - <<'PY'
import sqlite3, pathlib
db=sqlite3.connect("dev.db"); c=db.cursor()
c.execute("UPDATE users SET hashed_password=? WHERE email=?",(pathlib.Path("/tmp/old_hash").read_text(),"test@x.com"))
db.commit()
PY
pkill -f "next dev"; pkill -f "uvicorn"   # 关服务
```

## 踩坑
- **headless 无麦克风/摄像头** → 实时语音类页面截不到，走代码重建。
- **DB schema 漂移**（`no such column`）→ 可 `ALTER TABLE ADD COLUMN` 补缺失列（安全），其余数据不动。
- 截不到 = 别硬等，读真实组件代码重建（见 SKILL 阶段 3）。
