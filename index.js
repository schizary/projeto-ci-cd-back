const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE CORS - SUPER PERMISSIVO
app.use(cors({
    origin: true,  // Permite QUALQUER origem
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware para logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
});

// Rota principal
app.get('/', (req, res) => {
    console.log('✅ Rota / acessada');
    res.json({
        mensagem: "API online e integrada com CI/CD!",
        versao: "2.0.0",
        timestamp: new Date().toISOString(),
        cors: "Configurado para TODAS as origens",
        status: "FUNCIONANDO"
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        cors: 'enabled'
    });
});

// Rota específica para debug CORS
app.options('*', cors()); // Enable pre-flight for all routes

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`✅ CORS configurado para TODAS as origens`);
    console.log(`🌐 URL: http://0.0.0.0:${PORT}`);
});