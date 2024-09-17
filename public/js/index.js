let registeredAccounts =
  JSON.parse(localStorage.getItem("registeredAccounts")) || {}; // Carregar contas salvas do localStorage

// Exibe o menu selecionado
function showMenu(menuId) {
  document.querySelectorAll(".menu").forEach((menu) => {
    menu.classList.remove("active");
  });
  document.getElementById(menuId).classList.add("active");
  if (menuId === "main-menu") {
    document.getElementById(menuId).style.display = "block";
  } else {
    document.getElementById("main-menu").style.display = "none";
  }

  // Limpa os campos de entrada ao exibir o menu de registro
  if (menuId === "register-menu") {
    document.getElementById("register-user").value = "";
    document.getElementById("register-pass").value = "";
  }

  // Limpa os campos de entrada ao exibir o menu de login
  if (menuId === "login-menu") {
    document.getElementById("login-user").value = "";
    document.getElementById("login-pass").value = "";
  }
}

// Função de validação de usuário e senha
function validateUser(user, pass) {
  if (!user || !pass) {
    return "Por favor, preencha todos os campos.";
  }
  if (user.length < 3) {
    return "O nome de usuário deve ter pelo menos 3 caracteres.";
  }
  if (!/^[a-zA-Z0-9]+$/.test(user)) {
    return "O nome de usuário deve conter apenas letras e números.";
  }
  if (pass.length < 6) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }
  if (!/[A-Z]/.test(pass)) {
    return "A senha deve conter pelo menos uma letra maiúscula.";
  }
  if (!/[0-9]/.test(pass)) {
    return "A senha deve conter pelo menos um número.";
  }
  return null; // Tudo validado corretamente
}

// Função de registro
function register() {
  const user = document.getElementById("register-user").value;
  const pass = document.getElementById("register-pass").value;
  const validationError = validateUser(user, pass);

  if (validationError) {
    showNotification(validationError); // Mostrar mensagem de erro de validação
    return;
  }

  if (!registeredAccounts[user]) {
    registeredAccounts[user] = pass;
    localStorage.setItem(
      "registeredAccounts",
      JSON.stringify(registeredAccounts)
    ); // Salvar no localStorage
    showNotification("Registrado com sucesso");

    // Limpa os campos de entrada após o registro
    document.getElementById("register-user").value = "";
    document.getElementById("register-pass").value = "";

    showMenu("main-menu"); // Volta ao menu principal
  } else {
    showNotification("Usuário já existente");
  }
}

// Função de login
function login() {
  const user = document.getElementById("login-user").value;
  const pass = document.getElementById("login-pass").value;

  if (!user || !pass) {
    showNotification("Por favor, preencha todos os campos.");
    return;
  }

  if (registeredAccounts[user] && registeredAccounts[user] === pass) {
    showNotification("Login feito com sucesso");

    // Pergunta se o usuário deseja salvar as credenciais
    if (confirm("Deseja salvar suas credenciais de login?")) {
      localStorage.setItem("savedUsername", user);
      localStorage.setItem("savedPassword", pass);
    }
  } else {
    showNotification("Falha ao fazer login. Verifique o usuário ou senha.");
  }
}

// Exibe a notificação
function showNotification(message) {
  const notification = document.getElementById("notification");
  document.getElementById("notification-text").textContent = message;
  notification.classList.add("active");
  setTimeout(() => {
    notification.classList.remove("active");
  }, 3000); // Oculta a notificação após 3 segundos
}

// Voltar ao menu principal ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  showMenu("main-menu");
});

// Correção da linha 25 e 33
let fix = document.querySelectorAll(".close-btn");
fix.forEach((button) => {
  button.style.color = "black";
});

// Adiciona eventos de clique para os botões de login e registro
document.getElementById("register-button").addEventListener("click", register);
document.getElementById("login-button").addEventListener("click", login);
