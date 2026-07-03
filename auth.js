// ===============================
// HNARUAK Authentication (Fixed Mobile Version)
// ===============================

// Supabase Configuration
const SUPABASE_URL = "https://zczpacrouktnwpbapbon.supabase.co";
const SUPABASE_KEY = "sb_publishable_mjYJ2AcAaoTIdzaIDHxTvQ_NgOHy4C6";

// Create Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===============================
// SIGN UP (Click-Based, No Form Refresh)
// ===============================
async function signUpMobile() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name
                }
            }
        });

        if (error) {
            alert("Database Error:\n" + error.message);
            return;
        }

        alert("Account created successfully! Redirecting to login...");
        window.location.href = "login.html";

    } catch (err) {
        alert("Unexpected Code Error:\n" + err.message);
    }
}

// ===============================
// LOGIN (Click-Based, No Form Refresh)
// ===============================
async function loginMobile() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert("Login Failed:\n" + error.message);
            return;
        }

        // Optional chaining (?.) prevents crashes if user data is missing
        if (data?.user?.email === "hnaruakinpui@gmail.com") {
            window.location.href = "admin-dashboard.html";
        } else {
            window.location.href = "dashboard.html";
        }

    } catch (err) {
        alert("Unexpected Login Error:\n" + err.message);
    }
}

// ===============================
// CHECK STUDENT / USER
// ===============================
async function checkUser() {
    try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
            window.location.href = "login.html";
            return;
        }

        const studentName = document.getElementById("studentName");
        if (studentName) {
            studentName.textContent = data.user.user_metadata?.full_name || data.user.email;
        }
    } catch (err) {
        window.location.href = "login.html";
    }
}

// ===============================
// CHECK ADMIN
// ===============================
async function checkAdmin() {
    try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
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
            studentName.textContent = "Administrator";
        }
    } catch (err) {
        window.location.href = "login.html";
    }
}

// ===============================
// LOGOUT
// ===============================
async function logout() {
    try {
        await supabase.auth.signOut();
    } catch (err) {
        console.error("Error signing out:", err);
    } finally {
        window.location.href = "index.html";
    }
}

// ===============================
// PASSWORD RESET
// ===============================
async function resetPassword() {
    const email = prompt("Enter your registered email:");
    if (!email) return;

    try {
        const redirectUrl = `${window.location.origin}/login.html`;
        
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: redirectUrl
        });

        if (error) throw error;

        alert("Password reset email sent. Check your inbox.");
    } catch (error) {
        alert(error.message);
    }
}
