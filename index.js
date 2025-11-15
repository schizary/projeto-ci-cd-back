const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração CORS explícita
const corsOptions = {
    origin: function (origin, callback) {
        // Permite requisições sem origin (mobile apps, Postman, etc)
        if (!origin) return callback(null, true);
        
        // Lista de origens permitidas
        const allowedOrigins = [
            'https://projeto-ci-cd-front-xi.vercel.app',
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:8080'
        ];
        
        // Permite qualquer origem em desenvolvimento ou se estiver na lista
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(null, true); // Permite todas as origens por enquanto
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

// Aplicar CORS antes de outras rotas
app.use(cors(corsOptions));

// Middleware para parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Origin: ${req.headers.origin || 'N/A'}`);
    next();
});

// Rota OPTIONS para preflight - DEVE vir antes das outras rotas
app.options('*', cors(corsOptions));

// Rota principal
app.get('/', (req, res) => {
    console.log('✅ Rota / acessada');
    console.log('Origin da requisição:', req.headers.origin);
    
    // Garantir que os headers CORS estão presentes
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    res.json({
        mensagem: "API online e integrada com CI/CD!",
        versao: "2.0.0",
        timestamp: new Date().toISOString(),
        cors: "Configurado e funcionando",
        origin: req.headers.origin || 'N/A',
        status: "FUNCIONANDO"
    });
});

// Health check
app.get('/health', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        cors: 'enabled'
    });
});

// ========== SNAKE GAME API ==========

// Registrar novo usuário
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username e senha são obrigatórios' });
        }
        
        if (username.length < 3) {
            return res.status(400).json({ error: 'Username deve ter pelo menos 3 caracteres' });
        }
        
        if (password.length < 4) {
            return res.status(400).json({ error: 'Senha deve ter pelo menos 4 caracteres' });
        }
        
        const user = await db.createUser(username, password);
        res.json({ success: true, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username e senha são obrigatórios' });
        }
        
        const user = await db.authenticateUser(username, password);
        res.json({ success: true, user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Salvar pontuação
app.post('/api/scores', async (req, res) => {
    try {
        const { userId, username, score } = req.body;
        
        if (!userId || !username || score === undefined) {
            return res.status(400).json({ error: 'userId, username e score são obrigatórios' });
        }
        
        if (typeof score !== 'number' || score < 0) {
            return res.status(400).json({ error: 'Score deve ser um número positivo' });
        }
        
        const scoreEntry = await db.saveScore(userId, username, score);
        res.json({ success: true, score: scoreEntry });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obter leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const leaderboard = await db.getLeaderboard(limit);
        res.json({ success: true, leaderboard });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obter melhor pontuação do usuário
app.get('/api/users/:userId/best-score', async (req, res) => {
    try {
        const { userId } = req.params;
        const bestScore = await db.getUserBestScore(userId);
        res.json({ success: true, bestScore });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`✅ CORS configurado para TODAS as origens`);
    console.log(`🌐 URL: http://0.0.0.0:${PORT}`);
});