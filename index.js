const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS - vamos atualizar depois com a URL do front
app.use(cors({
  origin: ['https://seu-frontend.vercel.app', 'http://localhost:3000', '*'],
  credentials: true
}));

app.get('/', (req, res) => {
  res.json({ 
    mensagem: "API online e integrada com CI/CD!",
    versao: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});