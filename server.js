const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const usersFilePath = path.join(__dirname, "data", "users.json");
const pesquisasFilePath = path.join(__dirname, "data", "pesquisas.json");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

function readJSONFile(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

function writeJSONFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.post("/api/users/register", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Obrigatório preencher todos os campos." });
  }
  if (username.length < 3) {
    return res.status(400).json({
      message: "O nome de usuário deve conter pelo menos 3 caracteres",
    });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "A senha deve conter no mínimo 8 caracteres" });
  }
  if (!/[A-Z]/.test(password)) {
    return res
      .status(400)
      .json({ message: "A senha deve conter pelo menos uma letra maiúscula." });
  }
  if (!/[0-9]/.test(password)) {
    return res
      .status(400)
      .json({ message: "A senha deve conter pelo menos um número." });
  }

  let users = readJSONFile(usersFilePath);
  console.log(users);
  if (users[username]) {
    return res.status(200).json({ message: "Usuário já registrado." });
  }

  users[username] = { password, points: 0, payments: 0 };
  writeJSONFile(usersFilePath, users);

  return res.status(201).json({ message: "Usuário registrado com sucesso!" });
});

app.post("/api/users/login", (req, res) => {
  const { username, password } = req.body;
  let users = readJSONFile(usersFilePath);
  if (users[username] && users[username].password === password) {
    return res.status(200).json({ message: "Login bem-sucedido!" });
  }
  if (!users || !password) {
    return res
      .status(400)
      .json({ message: "Por favor, Preencha todos os campos" });
  } else {
    return res.status(401).json({ message: "Usuário ou senha incorretos" });
  }
});

app.post("/api/pesquisas", (req, res) => {
  const { id, descricao, pontos } = req.body;
  let pesquisas = readJSONFile(pesquisasFilePath);
  pesquisas.push({ id, descricao, pontos });
  writeJSONFile(pesquisasFilePath, pesquisas);
  return res.status(201).json({ message: "Pesquisa registrada com sucesso!" });
});

app.get("/api/pesquisas", (req, res) => {
  let pesquisas = readJSONFile(pesquisasFilePath);
  return res.json(pesquisas);
});

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

app.post("/api/users/:id/saque", (req, res) => {
  const { id } = req.params;
  let users = readJSONFile(usersFilePath);
  if (users[id] && users[id].points >= 2500) {
    users[id].points -= 2500;
    users[id].payments += 50;
    writeJSONFile(usersFilePath, users);
    return res.json({ message: "Saque de $50 realizado com sucesso!" });
  }
  return res.status(400).json({ message: "Pontos insuficientes para saque." });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
