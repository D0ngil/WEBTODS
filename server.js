const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const DOMPurify = require('isomorphic-dompurify'); // XSS 방어를 위한 라이브러리
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

dotenv.config();

const app = express();

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Public')));

// CORS 설정 (특정 도메인만 허용)
app.use(cors({
  origin: 'https://yourdomain.com',
  methods: ['POST']
}));

// Rate Limiting (1분에 최대 5회 요청)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1분
  max: 5,  // 최대 5회 요청
  message: '1분에 최대 5번만 메시지를 보낼 수 있습니다.'
});
app.use('/api/chat', limiter);

// Discord로 메시지 전송하는 함수
async function sendToDiscord(webhookUrl, content) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // 5초 타임아웃

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
    signal: controller.signal
  });

  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error(`Discord Webhook Error: ${response.status} ${response.statusText}`);
  }
}

// 메시지 전송 API
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // 입력 값 검증 (유효성 검사 및 길이 제한)
    if (!message || message.length > 200) {
      return res.status(400).json({ success: false, error: '메시지가 유효하지 않거나 너무 깁니다.' });
    }

    // XSS 방지를 위한 DOMPurify 적용 (HTML, JS 제거)
    const sanitizedMessage = DOMPurify.sanitize(message);

    // Discord로 전송
    await sendToDiscord(DISCORD_WEBHOOK_URL, sanitizedMessage);
    // console.log('디스코드로 전송된 메시지:', sanitizedMessage);

    return res.status(200).json({ success: true, msg: '메시지 전송 성공' });
  } catch {
    return res.status(500).json({ success: false, error: '디스코드 메시지 전송 실패' });
  } 
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// GitHub Actions에서 실행 후 종료되도록 10초 뒤 서버를 닫음 (테스트용)
if (process.env.NODE_ENV === 'ci') {
  setTimeout(() => {
    server.close(() => {
      console.log('CI build complete, server closed.');
    });
  }, 10000);  // 10초 뒤 종료
}