const express = require('express');
const cors = require('cors');

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

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`✅ CORS configurado para TODAS as origens`);
    console.log(`🌐 URL: http://0.0.0.0:${PORT}`);
});