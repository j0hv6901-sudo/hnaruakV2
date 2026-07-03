// Supabase Configuration
const SUPABASE_URL = "https://zczpacrouktnwpbapbon.supabase.co";
const SUPABASE_KEY = "sb_publishable_mjYJ2AcAaoTIdzaIDHxTvQ_NgOHy4C6";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ---------- SIGN UP ----------
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

  alert("Account created! Please check your email to verify your account.");
  window.location.href = "login.html";
}

// ---------- LOGIN ----------
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

  window.location.href = "dashboard.html";
}

// ---------- CHECK LOGIN ----------
async function checkUser() {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    window.location.href = "login.html";
    return;
  }

  const name = data.user.user_metadata.full_name || "Student";

  const el = document.getElementById("studentName");
  if (el) {
    el.textContent = name;
  }
}

// ---------- LOGOUT ----------
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}
