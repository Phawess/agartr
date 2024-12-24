// WebSocket bağlantısı
const ws = new WebSocket('ws://localhost:3000');
let username = '';
let currentChannel = 'genel';

// DOM elementleri
const loginScreen = document.getElementById('login-screen');
const mainScreen = document.getElementById('main-screen');
const usernameInput = document.getElementById('username-input');
const joinBtn = document.getElementById('join-btn');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const messagesContainer = document.getElementById('messages');
const onlineUsers = document.getElementById('online-users');
const startStreamBtn = document.getElementById('start-stream');
const stopStreamBtn = document.getElementById('stop-stream');
const streamVideo = document.getElementById('stream-video');

// Giriş işlemi
joinBtn.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        ws.send(JSON.stringify({
            type: 'join',
            username: username
        }));
        loginScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
    }
});

// Mesaj gönderme
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        ws.send(JSON.stringify({
            type: 'message',
            content: message,
            channel: currentChannel,
            username: username
        }));
        messageInput.value = '';
    }
}

// Kanal değiştirme
document.querySelectorAll('.channel').forEach(channel => {
    channel.addEventListener('click', () => {
        currentChannel = channel.dataset.channel;
        document.querySelectorAll('.channel').forEach(c => c.style.backgroundColor = '');
        channel.style.backgroundColor = '#40444b';
    });
});

// WebSocket mesaj işleme
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch(data.type) {
        case 'message':
            if (data.channel === currentChannel) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message';
                messageDiv.textContent = `${data.username}: ${data.content}`;
                messagesContainer.appendChild(messageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
            break;
            
        case 'userList':
            onlineUsers.innerHTML = '';
            data.users.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.textContent = user;
                onlineUsers.appendChild(userDiv);
            });
            break;
    }
};

// Yayın başlatma
startStreamBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        streamVideo.srcObject = stream;
        startStreamBtn.classList.add('hidden');
        stopStreamBtn.classList.remove('hidden');
        document.querySelector('.stream-container').classList.remove('hidden');
    } catch (err) {
        console.error('Yayın başlatılamadı:', err);
    }
});

// Yayını durdurma
stopStreamBtn.addEventListener('click', () => {
    const stream = streamVideo.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    streamVideo.srcObject = null;
    startStreamBtn.classList.remove('hidden');
    stopStreamBtn.classList.add('hidden');
});

// Hata yönetimi
ws.onerror = (error) => {
    console.error('WebSocket hatası:', error);
};

ws.onclose = () => {
    console.log('WebSocket bağlantısı kapandı');
};
