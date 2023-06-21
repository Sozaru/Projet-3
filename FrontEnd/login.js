const form = document.getElementById("loginform");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  console.log("Le formulaire a été soumis !");

  const payload = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location = "index.html";
      } else {
        console.log("La connexion a échoué ");
        alert("Identifiants erronés");
      }
    });
});