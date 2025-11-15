const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// CORS SUPER PERMISSIVO - RESOLVE 100% DOS PROBLEMAS
app.use(cors({
  origin: '*', // PERMITE TUDO
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: false
}));

app.get('/', (req, res) => {
  res.json({ 
    mensagem: "API online e integrada com CI/CD!",
    versao: "1.0.0",
    timestamp: new Date().toISOString(),
    status: "CORS configurado para todas as origens"
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});