let registeredAccounts =
  JSON.parse(localStorage.getItem("registeredAccounts")) || {};

function showMenu(menuId) {
  console.log(menuId);
  document.querySelectorAll(".menu").forEach((menu) => {
    menu.classList.remove("active");
  });
  document.getElementById(menuId).classList.add("active");
  if (menuId === "main-menu") {
    document.getElementById(menuId).style.display = "block";
  } else {
    document.getElementById("main-menu").style.display = "none";
  }

  if (menuId === "register-menu") {
    document.getElementById("register-user").value = "";
    document.getElementById("register-pass").value = "";
  }

  if (menuId === "login-menu") {
    document.getElementById("login-user").value = "";
    document.getElementById("login-pass").value = "";
  }
}

let notificationTimerId;
function showNotification(message) {
  console.log(notificationTimerId);
  clearTimeout(notificationTimerId);
  const notification = document.getElementById("notification");
  console.log(notification);
  document.getElementById("notification-text").textContent = message;
  notification.classList.add("active");
  console.log(notification.classList.add("active"));

  notificationTimerId = setTimeout(() => {
    notification.classList.remove("active");
  }, 3000);
}

let color = document.querySelectorAll(".close-btn");
color.forEach((button) => {
  button.style.color = "black";
});
