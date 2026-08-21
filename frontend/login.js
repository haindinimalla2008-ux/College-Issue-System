const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const message = document.getElementById("message");

    if (username === "admin" && password === "College@2026") {

        message.style.color = "green";
        message.textContent = "Login successful!";

        setTimeout(function() {
            window.location.href = "admin.html";
        }, 500);

    } else {

        message.style.color = "red";
        message.textContent = "Invalid username or password.";

    }

});