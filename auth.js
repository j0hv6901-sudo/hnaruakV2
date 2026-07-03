// ===============================
// HNARUAK Authentication
// ===============================

// Supabase Configuration
const SUPABASE_URL = "https://zczpacrouktnwpbapbon.supabase.co";
const SUPABASE_KEY = "sb_publishable_mjYJ2AcAaoTIdzaIDHxTvQ_NgOHy4C6";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ===============================
// SIGN UP
// ===============================

async function signUp(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const { error } = await supabase.auth.signUp({

        email,
        password,

        options: {
            data: {
                full_name: name
            }
        }

    });

    if (error) {
        alert(error.message);
        return;
    }

    alert("Account created successfully! Please check your email to verify your account.");

    window.location.href = "login.html";

}

// ===============================
// LOGIN
// ===============================

async function login(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const { error } = await supabase.auth.signInWithPassword({

        email,
        password

    });

    if (error) {
        alert(error.message);
        return;
    }

    // Redirect Admin
    if (email === "hnaruakinpui@gmail.com") {

        window.location.href = "admin-dashboard.html";

    } else {

        window.location.href = "dashboard.html";

    }

}

// ===============================
// CHECK STUDENT
// ===============================

async function checkUser() {

    const { data } = await supabase.auth.getUser();

    if (!data.user) {

        window.location.href = "login.html";
        return;

    }

    const studentName = document.getElementById("studentName");

    if (studentName) {

        studentName.textContent =
            data.user.user_metadata.full_name || "Student";

    }

}

// ===============================
// CHECK ADMIN
// ===============================

async function checkAdmin() {

    const { data } = await supabase.auth.getUser();

    if (!data.user) {

        window.location.href = "login.html";
        return;

    }

    if (data.user.email !== "hnaruakinpui@gmail.com") {

        alert("Access denied.");

        window.location.href = "dashboard.html";

        return;

    }

    const studentName = document.getElementById("studentName");

    if (studentName) {

        studentName.textContent =
            data.user.user_metadata.full_name || "Administrator";

    }

}

// ===============================
// LOGOUT
// ===============================

async function logout() {

    await supabase.auth.signOut();

    window.location.href = "index.html";

}

// ===============================
// PASSWORD RESET
// ===============================

async function resetPassword() {

    const email = prompt("Enter your registered email:");

    if (!email) return;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {

        redirectTo: window.location.origin + "/login.html"

    });

    if (error) {

        alert(error.message);

    } else {

        alert("Password reset email has been sent.");

    }

}
