        const loginSection = document.getElementById("loginSection");
        const signUpSection = document.getElementById("signUpSection");
        const toSignUp = document.getElementById("toSignUp");
        const toLogin = document.getElementById("toLogin");
        const loginError = document.getElementById("loginError");
        const loginUserInp = document.getElementById("loginUser");
        const loginPasswordInp = document.getElementById("loginPassword");

        loginUserInp.addEventListener("input", () => { loginError.style.display = "none"; });
        loginPasswordInp.addEventListener("input", () => { loginError.style.display = "none"; });

        toSignUp.addEventListener("click", (e) => {
            e.preventDefault();
            loginError.style.display = "none";
            loginSection.classList.add("hidden");
            signUpSection.classList.remove("hidden");
        });

        toLogin.addEventListener("click", (e) => {
            e.preventDefault();
            signUpSection.classList.add("hidden");
            loginSection.classList.remove("hidden");
        });

        document.getElementById("signUpForm").addEventListener("submit", function(e) {
            e.preventDefault();
            const username = document.getElementById("regUsername").value.trim();
            const email = document.getElementById("regEmail").value.trim();
            const password = document.getElementById("regPassword").value;

            let daftarUser = JSON.parse(localStorage.getItem("usersFinansee")) || [];
            const userExist = daftarUser.find(user => user.username === username || user.email === email);
            if (userExist) {
                alert("Username atau Email sudah terdaftar! Gunakan data lain.");
                return;
            }

            daftarUser.push({ username, email, password });
            localStorage.setItem("usersFinansee", JSON.stringify(daftarUser));
            alert("Akun berhasil dibuat! Silakan Log In.");
            
            document.getElementById("signUpForm").reset();
            signUpSection.classList.add("hidden");
            loginSection.classList.remove("hidden");
            loginUserInp.value = username;
        });

        document.getElementById("loginForm").addEventListener("submit", function(e) {
            e.preventDefault();
            const userInput = loginUserInp.value.trim();
            const passwordInput = loginPasswordInp.value;

            let daftarUser = JSON.parse(localStorage.getItem("usersFinansee")) || [];
            const userValid = daftarUser.find(user => 
                (user.username === userInput || user.email === userInput) && user.password === passwordInput
            );

            if (userValid) {
                loginError.style.display = "none";
                
                localStorage.setItem("userAktif", userValid.username);
                
                window.location.href = "dashboard.html";
            } else {
                loginError.style.display = "block";
            }
        });