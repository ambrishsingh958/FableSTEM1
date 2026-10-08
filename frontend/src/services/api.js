const API_BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.detail || data?.message || "Something went wrong. Please try again.";
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
      throw new Error("Unable to reach backend server. Please make sure the backend is running.");
    }
    throw err;
  }
}

export async function checkHealth() {
  return request("/health");
}

export async function getStory({ topic, age_group, language = "English", length = "medium" }) {
  return request("/api/story", {
    method: "POST",
    body: JSON.stringify({ topic, age_group, language, length }),
  });
}

export async function getQuiz({ story, age_group = "8-10", language = "English" }) {
  return request("/api/quiz", {
    method: "POST",
    body: JSON.stringify({ story, age_group, language }),
  });
}

export async function evaluateQuiz({ story, questions, user_answers, age_group = "8-10", language = "English" }) {
  return request("/api/evaluate", {
    method: "POST",
    body: JSON.stringify({ story, questions, user_answers, age_group, language }),
  });
}

export async function getPresets() {
  return request("/api/presets");
}

export async function chatWithCharacter({ story, character_name, question, age_group, language = "English" }) {
  return request("/api/chat-character", {
    method: "POST",
    body: JSON.stringify({ story, character_name, question, age_group, language }),
  });
}

export async function compareAges({ topic, language = "English" }) {
  return request("/api/compare-ages", {
    method: "POST",
    body: JSON.stringify({ topic, language }),
  });
}

export async function loginUser({ username, password = "", role = "student", avatar = "🦉", grade_or_class = "" }) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password, role, avatar, grade_or_class }),
  });
}

export async function registerUser({ username, password = "", role = "student", avatar = "🦉", grade_or_class = "" }) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password, role, avatar, grade_or_class }),
  });
}


