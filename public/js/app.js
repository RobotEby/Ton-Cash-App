document
  .getElementById("register-button")
  .addEventListener("click", async () => {
    const username = document.getElementById("register-user").value;
    const password = document.getElementById("register-pass").value;

    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    showNotification(result.message);
    if (response.status === 201) {
      showMenu("main-menu");
    } else if (response.status === 200) {
      showMenu("register-menu");
    }
  });

document.getElementById("login-button").addEventListener("click", async () => {
  const username = document.getElementById("login-user").value;
  const password = document.getElementById("login-pass").value;

  const response = await fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();
  showNotification(result.message);
  if (response.status === 200) {
    showMenu("main-menu");
  }
});

async function completarPesquisa(userId, pesquisaId) {
  const response = await fetch(`/api/users/${userId}/pesquisas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pesquisaId }),
  });

  const result = await response.json();
  showNotification(result.message);
}

async function solicitarSaque(userId) {
  const response = await fetch(`/api/users/${userId}/saque`, {
    method: "POST",
  });

  const result = await response.json();
  showNotification(result.message);
}
