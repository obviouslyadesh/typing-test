const API_URL = "http://localhost:5000/api";
let token = "";
let timer = false;
let time = 0;
let interval;
let currentSentence = "";
let currentIndex = 0;
let errorCount = 0;
let totalTyped = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === "Backspace") {
    e.preventDefault(); // Disable backspace
  }
});

// === Fetch random sentence ===
async function fetchRandomSentence() {
  try {
    const res = await fetch("https://api.api-ninjas.com/v1/quotes", {
      headers: { "X-Api-Key": "V1AHFuw30r0ifwOioe6jbQ==Ek64YysqJRT2RYNj" } 
    });
    const data = await res.json();
    return data[0].quote;
  } catch {
    return "The quick brown fox jumps over the lazy dog.";
  }
}

// === Register ===
async function register() {
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  if (!username || !password) return alert("Enter both fields.");
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Registered! Please login.");
      showLogin();
    } else {
      alert(data.msg || "Registration failed.");
    }
  } catch {
    alert("Server error");
  }
}

// === Login ===
async function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  if (!username || !password) return alert("Enter both fields.");
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      token = data.token;
      document.getElementById("auth-section").classList.add("d-none");
      document.getElementById("register-section").classList.add("d-none");
      document.getElementById("typing-section").classList.remove("d-none");
      await resetTest();
    } else {
      alert(data.msg || "Login failed.");
    }
  } catch {
    alert("Server error");
  }
}

// === Reset test ===
async function resetTest() {
  clearInterval(interval);
  time = 0;
  timer = false;
  currentIndex = 0;
  errorCount = 0;
  totalTyped = 0;
  currentSentence = await fetchRandomSentence();
  renderSentence();
  document.getElementById("time").innerText = "0";
  document.getElementById("wpm").innerText = "0";
  document.getElementById("accuracy").innerText = "100%";
  document.getElementById("errors").innerText = "0";
  document.getElementById("progress").innerText = "0%";
  document.getElementById("finalResult").style.display = "none";
  document.getElementById("inputChar").value = "";
  document.getElementById("inputChar").focus();
}

// === Render sentence ===
function renderSentence() {
  const sentenceElement = document.getElementById("sentence");
  sentenceElement.innerHTML = "";
  for (let i = 0; i < currentSentence.length; i++) {
    const span = document.createElement("span");
    span.innerText = currentSentence[i];
    if (i === 0) span.classList.add("current");
    sentenceElement.appendChild(span);
  }
}

// === Typing logic ===
function handleTyping() {
  if (!timer) {
    timer = true;
    interval = setInterval(() => {
      time++;
      document.getElementById("time").innerText = time;
    }, 1000);
  }

  const inputChar = document.getElementById("inputChar").value;
  document.getElementById("inputChar").value = ""; // clear input

  const spans = document.querySelectorAll("#sentence span");

  if (!inputChar || currentIndex >= currentSentence.length) return;

  totalTyped++;

  const currentSpan = spans[currentIndex];
  currentSpan.classList.remove("current");

  if (inputChar === currentSentence[currentIndex]) {
    currentSpan.classList.add("correct");
  } else {
    currentSpan.classList.add("incorrect");
    errorCount++;
  }

  currentIndex++;

  if (currentIndex < spans.length) {
    spans[currentIndex].classList.add("current");
  }

  const progress = Math.round((currentIndex / currentSentence.length) * 100);
  const accuracy = Math.round(((totalTyped - errorCount) / totalTyped) * 100);
  const wordsTyped = currentIndex === 0 ? 0 : currentIndex / 5;
  const wpm = time > 0 ? Math.round((wordsTyped / time) * 60) : 0;

  document.getElementById("progress").innerText = `${progress}%`;
  document.getElementById("accuracy").innerText = `${accuracy}%`;
  document.getElementById("errors").innerText = errorCount;
  document.getElementById("wpm").innerText = wpm;

  if (currentIndex === currentSentence.length) {
    finishTest(wpm, accuracy, errorCount);
  }
}

// === Finish ===
async function finishTest(wpm, accuracy, errors) {
  clearInterval(interval);
  document.getElementById("finalResult").style.display = "block";
  document.getElementById("finalResult").innerText = `🎉 Finished! WPM: ${wpm}, Accuracy: ${accuracy}%, Errors: ${errors}`;

  try {
    await fetch(`${API_URL}/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ wpm, accuracy, errors }),
    });
  } catch {
    alert("⚠️ Could not save result.");
  }
}


