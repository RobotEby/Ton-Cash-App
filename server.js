const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

// Caminho para os arquivos JSON
const usersFilePath = path.join(__dirname, "data", "users.json");
const pesquisasFilePath = path.join(__dirname, "data", "pesquisas.json");

// Configura para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Servir o index.html da pasta raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Função para ler o arquivo JSON
function readJSONFile(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (error) {
    return {}; // Retorna um objeto vazio se o arquivo não puder ser lido
  }
}

// Função para escrever no arquivo JSON
function writeJSONFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Rota para registrar um novo usuário
app.post("/api/users/register", (req, res) => {
  const { username, password } = req.body;
  let users = readJSONFile(usersFilePath);
  if (users[username]) {
    return res.status(400).json({ message: "Usuário já registrado." });
  }
  users[username] = { password, points: 0, payments: 0 };
  writeJSONFile(usersFilePath, users);
  return res.status(201).json({ message: "Usuário registrado com sucesso!" });
});

// Rota para login de usuário
app.post("/api/users/login", (req, res) => {
  const { username, password } = req.body;
  let users = readJSONFile(usersFilePath);
  if (users[username] && users[username].password === password) {
    return res.status(200).json({ message: "Login bem-sucedido!" });
  }
  return res.status(401).json({ message: "Credenciais inválidas." });
});

// Rota para registrar uma nova pesquisa
app.post("/api/pesquisas", (req, res) => {
  const { id, descricao, pontos } = req.body;
  let pesquisas = readJSONFile(pesquisasFilePath);
  pesquisas.push({ id, descricao, pontos });
  writeJSONFile(pesquisasFilePath, pesquisas);
  return res.status(201).json({ message: "Pesquisa registrada com sucesso!" });
});

// Rota para listar todas as pesquisas
app.get("/api/pesquisas", (req, res) => {
  let pesquisas = readJSONFile(pesquisasFilePath);
  return res.json(pesquisas);
});

// Rota para registrar a conclusão de uma pesquisa por um usuário
app.post("/api/users/:id/pesquisas", (req, res) => {
  const { id } = req.params;
  const { pesquisaId } = req.body;
  let users = readJSONFile(usersFilePath);
  let pesquisas = readJSONFile(pesquisasFilePath);
  const pesquisa = pesquisas.find((p) => p.id === pesquisaId);
  if (users[id] && pesquisa) {
    users[id].points += pesquisa.pontos;
    writeJSONFile(usersFilePath, users);
    return res.json({ message: "Pesquisa concluída com sucesso!" });
  }
  return res
    .status(404)
    .json({ message: "Usuário ou pesquisa não encontrado." });
});

// Rota para solicitar saque de pontos
app.post("/api/users/:id/saque", (req, res) => {
  const { id } = req.params;
  let users = readJSONFile(usersFilePath);
  if (users[id] && users[id].points >= 2500) {
    users[id].points -= 2500;
    users[id].payments += 50; // Incrementa o valor pago ao usuário
    writeJSONFile(usersFilePath, users);
    return res.json({ message: "Saque de $50 realizado com sucesso!" });
  }
  return res.status(400).json({ message: "Pontos insuficientes para saque." });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
