const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

dotenv.config();

const app = express();
const port = 3000;

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Public')));

async function sendToDiscord(webhookUrl, content) {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  if (!response.ok) {
    throw new Error(`Discord Webhook Error: ${response.status} ${response.statusText}`);
  }
}

let isSubmitting = false;

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    
    // 이미 전송 중이면 무시
    if (isSubmitting) return;
    
    isSubmitting = true;
    sendMessage();
    
    // 300ms 후에 다시 전송 가능하도록 설정
    setTimeout(() => {
      isSubmitting = false;
    }, 300);
  }
});

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    await sendToDiscord(DISCORD_WEBHOOK_URL, message);
    console.log('디스코드로 전송된 메시지:', message);
    return res.status(200).json({ success: true, msg: '메시지 전송 성공' });
  } catch (error) {
    console.error('디스코드 전송 에러:', error);
    return res.status(500).json({ success: false, error: '디스코드 메시지 전송 실패' });
  }
});
  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(__dirname);
  console.log(process.cwd());
});
