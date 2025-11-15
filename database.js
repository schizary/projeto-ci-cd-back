const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_FILE = path.join(__dirname, 'data.json');

// Inicializar arquivo de dados se não existir
async function initDatabase() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify({
            users: [],
            scores: []
        }, null, 2));
    }
}

// Ler dados
async function readData() {
    await initDatabase();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

// Escrever dados
async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Funções de usuário
async function createUser(username, password) {
    const data = await readData();
    
    // Verificar se usuário já existe
    if (data.users.find(u => u.username === username)) {
        throw new Error('Usuário já existe');
    }
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
        id: Date.now().toString(),
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };
    
    data.users.push(user);
    await writeData(data);
    
    return { id: user.id, username: user.username };
}

async function authenticateUser(username, password) {
    const data = await readData();
    const user = data.users.find(u => u.username === username);
    
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('Senha incorreta');
    }
    
    return { id: user.id, username: user.username };
}

// Funções de pontuação
async function saveScore(userId, username, score) {
    const data = await readData();
    
    const scoreEntry = {
        id: Date.now().toString(),
        userId,
        username,
        score,
        date: new Date().toISOString()
    };
    
    data.scores.push(scoreEntry);
    await writeData(data);
    
    return scoreEntry;
}

async function getLeaderboard(limit = 10) {
    const data = await readData();
    
    // Ordenar por pontuação (maior primeiro) e pegar os top N
    const sorted = data.scores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((entry, index) => ({
            rank: index + 1,
            username: entry.username,
            score: entry.score,
            date: entry.date
        }));
    
    return sorted;
}

async function getUserBestScore(userId) {
    const data = await readData();
    const userScores = data.scores
        .filter(s => s.userId === userId)
        .sort((a, b) => b.score - a.score);
    
    return userScores.length > 0 ? userScores[0] : null;
}

module.exports = {
    createUser,
    authenticateUser,
    saveScore,
    getLeaderboard,
    getUserBestScore
};

