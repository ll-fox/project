## 环境
### node + npm 环境
1. node 推荐使用v14.21.3
2. npm 推荐使用v6.14.18


## 配置项说明
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| apiKey | string | 是 | - | API密钥 |
| socketUrl | string | 否 | http://localhost:3000 | WebSocket服务器地址 |
| botAppKey | string | 否 | jLKUTKgP | 机器人应用密钥 |
| visitorBizId | string | 否 | test | 访客业务ID |
| sessionId | string | 否 | test | 会话ID |
| routeWhitelist | string[] | 否 | [] | 路由白名单，支持字符串和正则表达式 |
| theme.primaryColor | string | 否 | #3b82f6 | 主色调 |
| theme.secondaryColor | string | 否 | #e5e7eb | 次要色调 |
| theme.bubbleRadius | number | 否 | 8 | 气泡圆角半径 |
| localization.headerTitle | string | 否 | "智能问答" | 对话框标题 |
| localization.placeholder | string | 否 | "Type your message..." | 输入框占位文本 |
| localization.sendButton | string | 否 | "Send" | 发送按钮文本 |
| localization.typingIndicator | string | 否 | "AI is typing..." | 输入指示器文本 |
| position.bottom | number | 20 | 距离底部距离（px） |
| position.right | number | 20 | 距离右侧距离（px） |
| zIndex | number | 9999 | 组件z-index值 |

## 新增功能

### 销毁组件


