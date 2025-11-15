const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS com TODAS as URLs possíveis da Vercel
app.use(cors({
  origin: [
    'https://projeto-ci-cd-front.vercel.app',
    'https://projeto-ci-cd-front-git-main-gustavos-projects-0e4368fd.vercel.app',
    'https://projeto-ci-cd-front-g3nyc19o3-gustavos-projects-0e4368fd.vercel.app',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
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