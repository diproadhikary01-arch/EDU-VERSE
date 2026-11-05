
"use strict";

/* =========================================
   EDU VERSE — COMPLETE LEARNING ENGINE
========================================= */

const pageNames = [
  "home", "subjects", "practice", "saved",
  "profile", "chapter", "chapterDetails", "quiz"
];

const STORAGE = {
  saved: "eduVerseSaved",
  completed: "eduVerseCompleted",
  quiz: "eduVerseQuizCount",
  score: "eduVerseQuizScore"
};

const subjects = [
  "বাংলা ১ম পত্র", "বাংলা ২য় পত্র",
  "ইংরেজি ১ম পত্র", "ইংরেজি ২য় পত্র",
  "তথ্য ও যোগাযোগ প্রযুক্তি",
  "পৌরনীতি ১ম পত্র", "পৌরনীতি ২য় পত্র",
  "অর্থনীতি ১ম পত্র", "অর্থনীতি ২য় পত্র",
  "ইতিহাস ১ম পত্র", "ইতিহাস ২য় পত্র",
  "ইসলামের ইতিহাস ১ম পত্র", "ইসলামের ইতিহাস ২য় পত্র",
  "সমাজবিজ্ঞান ১ম পত্র", "সমাজবিজ্ঞান ২য় পত্র",
  "যুক্তিবিদ্যা ১ম পত্র", "যুক্তিবিদ্যা ২য় পত্র",
  "ভূগোল ১ম পত্র", "ভূগোল ২য় পত্র"
];

const chapterDatabase = window.EDU_VERSE_CHAPTERS || {};

let currentChapter = null;
let currentPractice = "mcq";
let currentQuestions = [];
let currentQuestion = 0;
let currentScore = 0;
let quizAnswered = false;
let quizTimer = null;
let remainingTime = 60;
let quizFinished = false;

function readStorage(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function formatText(value) {
  return escapeHTML(value).replace(/\n/g, "<br>");
}

function showPage(name, button) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active", "page-slide-next", "page-slide-prev");
  });

  const target = document.getElementById(name + "Page");
  if (!target) return;

  target.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(nav => {
    nav.classList.remove("active");
  });

  const navButton = button ||
    document.querySelector(`.nav-item[data-page="${name}"]`);

  if (navButton) navButton.classList.add("active");

  if (name === "saved") renderSaved();
  if (name === "profile") updateProgress();
}

function renderSubjects(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = subjects.map(subject => `
    <button class="subject-card" onclick="openPaper('${escapeHTML(subject)}')">
      <span class="subject-icon">📘</span>
      <span>${escapeHTML(subject)}</span>
      <span class="subject-arrow">→</span>
    </button>
  `).join("");
}

function openPaper(name) {
  currentChapter = null;

  document.getElementById("paperTitle").textContent = name;

  const list = document.getElementById("chapterList");

  if (name === "বাংলা ১ম পত্র" && chapterDatabase["অপরিচিতা"]) {
    const chapter = chapterDatabase["অপরিচিতা"];

    list.innerHTML = `
      <button class="chapter-item" onclick="openChapterDetails('অপরিচিতা')">
        <div class="chapter-number">01</div>
        <div class="chapter-info">
          <h3>অপরিচিতা</h3>
          <p>রবীন্দ্রনাথ ঠাকুর · ছোটগল্প</p>
          <span class="content-status">সম্পূর্ণ অধ্যায় প্যাক</span>
        </div>
        <span>→</span>
      </button>
    `;

    list.insertAdjacentHTML("beforeend", `
      <div class="coming-soon">
        <h3>আরও অধ্যায় আসছে</h3>
        <p>বিলাসীসহ বাংলা ১ম পত্রের বাকি অধ্যায়গুলো পর্যায়ক্রমে যুক্ত করা হবে।</p>
      </div>
    `);
  } else {
    list.innerHTML = `
      <div class="coming-soon">
        <h3>অধ্যায় প্রস্তুত হচ্ছে</h3>
        <p>এই বিষয়ের বিস্তারিত অধ্যায় ও প্রশ্নব্যাংক শীঘ্রই যুক্ত হবে।</p>
      </div>
    `;
  }

  showPage("chapter");
}

function section(title, content, icon = "✦") {
  if (!content) return "";

  return `
    <article class="study-section">
      <h3>${icon} ${escapeHTML(title)}</h3>
      <div class="section-content">${formatText(content)}</div>
    </article>
  `;
}

function openChapterDetails(title) {
  const chapter = chapterDatabase[title];
  if (!chapter) return;

  currentChapter = chapter;

  const details = document.getElementById("chapterDetails");
  const saved = readStorage(STORAGE.saved);
  const completed = readStorage(STORAGE.completed);

  const isSaved = saved.includes(chapter.id);
  const isCompleted = completed.includes(chapter.id);

  const discussions = Array.isArray(chapter.discussion)
    ? chapter.discussion.map((item, index) => `
      <article class="discussion-item">
        <h4>${index + 1}. ${escapeHTML(item.heading || "")}</h4>
        <p>${formatText(item.details || "")}</p>
      </article>
    `).join("")
    : section("আলোচনা", chapter.discussion);

  const characters = (chapter.characters || []).map(person => `
    <article class="character-item">
      <h4>${escapeHTML(person.name)}</h4>
      <p>${formatText(person.description)}</p>
    </article>
  `).join("");

  const vocabulary = (chapter.vocabulary || chapter.words || []).map(word => `
    <div class="vocabulary-item">
      <strong>${escapeHTML(word.word || "")}</strong>
      <span>${formatText(word.meaning || "")}</span>
    </div>
  `).join("");

  const explanations = (chapter.explanations || []).map(item => `
    <article class="discussion-item">
      <h4>${escapeHTML(item.heading || "")}</h4>
      <p>${formatText(item.details || "")}</p>
    </article>
  `).join("");

  const cqs = (chapter.cq || []).map((item, index) => `
    <article class="cq-card">
      <h4>সৃজনশীল প্রশ্ন ${index + 1}</h4>
      <p class="stimulus">${formatText(item.stimulus || "")}</p>
      <p>${formatText(item.question || "")}</p>
      <div class="cq-subquestions">
        ${Object.entries(item.subQuestions || {}).map(([key, value]) => `
          <p><strong>${escapeHTML(key)}.</strong> ${formatText(value)}</p>
        `).join("")}
      </div>
      <details>
        <summary>উত্তর লেখার নির্দেশনা দেখুন</summary>
        ${(item.guidance || []).map((guide, i) => `
          <p>${i + 1}. ${formatText(guide)}</p>
        `).join("")}
      </details>
    </article>
  `).join("");

  const revisions = (chapter.revision || []).map((item, index) => `
    <details class="revision-item">
      <summary>${index + 1}. ${escapeHTML(item.question || "")}</summary>
      <p>${formatText(item.answer || "")}</p>
    </details>
  `).join("");

  const tips = (chapter.studyTips || []).map(tip =>
    `<li>${formatText(tip)}</li>`
  ).join("");

  details.innerHTML = `
    <button class="back-button" onclick="showPage('chapter')">← Back to Chapters</button>

    <div class="chapter-hero">
      <span class="eyebrow">${escapeHTML(chapter.paper || "HSC")}</span>
      <h2>${escapeHTML(chapter.title)}</h2>
      <p>${escapeHTML(chapter.author || "")} · ${escapeHTML(chapter.type || "")}</p>

      <div class="chapter-actions">
        <button class="secondary-button" onclick="toggleSaveCurrent()">
          ${isSaved ? "♥ Saved" : "♡ Save Chapter"}
        </button>
        <button class="secondary-button" onclick="toggleCompletedCurrent()">
          ${isCompleted ? "✓ Completed" : "Mark Completed"}
        </button>
        <button class="primary-button" onclick="startChapterPractice()">
          Practice MCQ →
        </button>
      </div>
    </div>

    ${section("পাঠ পরিচিতি", chapter.introduction || chapter.intro, "📖")}
    ${section("লেখক পরিচিতি", chapter.authorInfo, "✍️")}
    ${section("কাহিনির সারসংক্ষেপ", chapter.summary, "📚")}
    ${section("মূলভাব ও বিষয়বস্তু", chapter.theme, "💡")}

    ${characters ? `
      <section class="study-section">
        <h3>👥 চরিত্র পরিচিতি</h3>
        ${characters}
      </section>` : ""}

    <section class="study-section">
      <h3>📝 বিস্তারিত আলোচনা</h3>
      ${discussions}
    </section>

    ${vocabulary ? `
      <section class="study-section">
        <h3>📕 শব্দার্থ</h3>
        <div class="vocabulary-list">${vocabulary}</div>
      </section>` : ""}

    ${explanations ? `
      <section class="study-section">
        <h3>🔍 গুরুত্বপূর্ণ ব্যাখ্যা</h3>
        ${explanations}
      </section>` : ""}

    <section class="study-section">
      <h3>🎯 MCQ প্রশ্নব্যাংক (${(chapter.mcq || []).length}টি)</h3>
      <p>প্রশ্নগুলো অনুশীলনের জন্য MCQ Practice শুরু করো।</p>
      <button class="primary-button" onclick="startChapterPractice()">সব MCQ অনুশীলন করো →</button>
    </section>

    ${cqs ? `
      <section class="study-section">
        <h3>✍️ সৃজনশীল প্রশ্ন (CQ)</h3>
        ${cqs}
      </section>` : ""}

    ${revisions ? `
      <section class="study-section">
        <h3>🔄 দ্রুত রিভিশন</h3>
        ${revisions}
      </section>` : ""}

    ${tips ? `
      <section class="study-section">
        <h3>⭐ পরীক্ষার প্রস্তুতি টিপস</h3>
        <ul class="tips-list">${tips}</ul>
      </section>` : ""}

    ${chapter.sourceInfo ? `
      <section class="study-section">
        <h3>📚 উৎস ও পাঠ্যক্রম</h3>
        ${formatText(chapter.sourceInfo.note || "")}
        ${formatText(chapter.sourceInfo.syllabusNote || "")}
        ${(chapter.sourceInfo.references || []).map(ref => `<p>• ${formatText(ref)}</p>`).join("")}
      </section>` : ""}
  `;

  showPage("chapterDetails");
}

function toggleSaveCurrent() {
  if (!currentChapter) return;

  let saved = readStorage(STORAGE.saved);
  const id = currentChapter.id;

  saved = saved.includes(id)
    ? saved.filter(item => item !== id)
    : [...saved, id];

  writeStorage(STORAGE.saved, saved);
  updateProgress();
  openChapterDetails(currentChapter.title);
}

function toggleCompletedCurrent() {
  if (!currentChapter) return;

  let completed = readStorage(STORAGE.completed);
  const id = currentChapter.id;

  completed = completed.includes(id)
    ? completed.filter(item => item !== id)
    : [...completed, id];

  writeStorage(STORAGE.completed, completed);
  updateProgress();
  openChapterDetails(currentChapter.title);
}

function renderSaved() {
  const container = document.getElementById("savedList");
  const saved = readStorage(STORAGE.saved);

  if (!saved.length) {
    container.innerHTML = `<div class="empty-state">🔖<h3>কোনো অধ্যায় সংরক্ষিত নেই</h3><p>পছন্দের অধ্যায় Save করলে এখানে দেখতে পাবে।</p></div>`;
    return;
  }

  container.innerHTML = saved.map(id => {
    const chapter = Object.values(chapterDatabase).find(item => item.id === id);
    if (!chapter) return "";

    return `
      <button class="chapter-item" onclick="openChapterDetails('${escapeHTML(chapter.title)}')">
        <div class="chapter-number">📘</div>
        <div class="chapter-info">
          <h3>${escapeHTML(chapter.title)}</h3>
          <p>${escapeHTML(chapter.author || "")}</p>
        </div>
        <span>→</span>
      </button>
    `;
  }).join("");
}

function updateProgress() {
  const saved = readStorage(STORAGE.saved);
  const completed = readStorage(STORAGE.completed);
  const quizCount = Number(localStorage.getItem(STORAGE.quiz) || 0);

  const values = {
    completedCount: completed.length,
    quizCount,
    savedCount: saved.length,
    completedCountHome: completed.length,
    quizCountHome: quizCount
  };

  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
}

/* =========================================
   QUIZ ENGINE
========================================= */

function shuffle(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function getQuestionBank() {
  if (currentChapter && currentChapter.mcq?.length) {
    return currentChapter.mcq;
  }

  return Object.values(chapterDatabase)
    .flatMap(chapter => chapter.mcq || []);
}

function startChapterPractice() {
  if (!currentChapter) return;
  startPractice("mcq", currentChapter);
}

function startPractice(mode, chapter = null) {
  clearInterval(quizTimer);

  currentPractice = mode;
  currentChapter = chapter || currentChapter;

  const bank = chapter
    ? chapter.mcq || []
    : getQuestionBank();

  if (!bank.length) {
    alert("এখনো কোনো MCQ প্রশ্ন যুক্ত করা হয়নি।");
    return;
  }

  if (mode === "quick") {
    currentQuestions = shuffle(bank).slice(0, 5);
  } else if (mode === "timer") {
    currentQuestions = shuffle(bank).slice(0, 10);
  } else {
    currentQuestions = [...bank];
  }

  currentQuestion = 0;
  currentScore = 0;
  quizAnswered = false;
  quizFinished = false;
  remainingTime = 60;

  if (mode === "timer") {
    startTimer();
  }

  renderQuestion();
  showPage("quiz");
}

function startTimer() {
  updateTimerDisplay();

  quizTimer = setInterval(() => {
    remainingTime--;
    updateTimerDisplay();

    if (remainingTime <= 0) {
      clearInterval(quizTimer);
      finishQuiz(true);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timer = document.getElementById("timerDisplay");
  if (timer) timer.textContent = remainingTime + "s";
}

function renderQuestion() {
  const question = currentQuestions[currentQuestion];
  if (!question) return finishQuiz();

  quizAnswered = false;

  const progress = ((currentQuestion + 1) / currentQuestions.length) * 100;
  const timerHTML = currentPractice === "timer"
    ? `<span class="timer-display" id="timerDisplay">${remainingTime}s</span>`
    : "";

  document.getElementById("quizContent").innerHTML = `
    <button class="back-button" onclick="closeQuiz()">← Exit Quiz</button>

    <div class="quiz-card">
      <div class="quiz-top">
        <span>${currentPractice.toUpperCase()} MODE</span>
        ${timerHTML}
      </div>

      <div class="quiz-progress">
        <div style="width:${progress}%"></div>
      </div>

      <p class="question-count">Question ${currentQuestion + 1} of ${currentQuestions.length}</p>
      <h2 class="question-title">${formatText(question.question)}</h2>

      <div class="option-list">
        ${(question.options || []).map((option, index) => `
          <button class="quiz-option" onclick="checkAnswer(${index})">
            <span>${String.fromCharCode(65 + index)}</span>
            ${formatText(option)}
          </button>
        `).join("")}
      </div>

      <div id="answerFeedback"></div>

      <button id="nextQuestionButton" class="primary-button next-button"
        onclick="nextQuestion()" disabled>
        Next Question →
      </button>
    </div>
  `;
}

function checkAnswer(selected) {
  if (quizAnswered || quizFinished) return;

  quizAnswered = true;

  const question = currentQuestions[currentQuestion];
  const correct = Number(question.answer);
  const options = document.querySelectorAll(".quiz-option");

  options.forEach((option, index) => {
    option.disabled = true;

    if (index === correct) option.classList.add("correct");
    if (index === selected && index !== correct) {
      option.classList.add("wrong");
    }
  });

  const isCorrect = selected === correct;
  if (isCorrect) currentScore++;

  const feedback = document.getElementById("answerFeedback");
  feedback.innerHTML = `
    <div class="answer-feedback ${isCorrect ? "success" : "error"}">
      <strong>${isCorrect ? "✓ সঠিক উত্তর!" : "✕ ভুল উত্তর!"}</strong>
      <p>${formatText(question.explanation || "এই প্রশ্নের অতিরিক্ত ব্যাখ্যা দেওয়া হয়নি।")}</p>
    </div>
  `;

  document.getElementById("nextQuestionButton").disabled = false;
}

function nextQuestion() {
  if (!quizAnswered) return;

  currentQuestion++;

  if (currentQuestion >= currentQuestions.length) {
    finishQuiz();
  } else {
    renderQuestion();
  }
}

function finishQuiz(timeout = false) {
  if (quizFinished) return;

  quizFinished = true;
  clearInterval(quizTimer);

  const oldCount = Number(localStorage.getItem(STORAGE.quiz) || 0);
  const oldScore = Number(localStorage.getItem(STORAGE.score) || 0);

  localStorage.setItem(STORAGE.quiz, oldCount + 1);
  localStorage.setItem(STORAGE.score, oldScore + currentScore);

  const total = currentQuestions.length;
  const percentage = total ? Math.round(currentScore / total * 100) : 0;

  document.getElementById("quizContent").innerHTML = `
    <div class="result-card">
      <span class="result-icon">${percentage >= 80 ? "🏆" : percentage >= 50 ? "🎯" : "📚"}</span>
      <h2>${timeout ? "সময় শেষ!" : "Quiz Completed!"}</h2>
      <div class="result-score">${currentScore}/${total}</div>
      <h3>${percentage}% Score</h3>
      <p>${percentage >= 80 ? "অসাধারণ! তোমার প্রস্তুতি ভালো হচ্ছে।" : percentage >= 50 ? "ভালো চেষ্টা! আরও অনুশীলন করো।" : "চিন্তা নেই, আবার পড়ো এবং চেষ্টা করো।"}</p>
      <button class="primary-button" onclick="showPage('practice')">Practice Again</button>
      <button class="secondary-button" onclick="closeQuiz()">Back to Learning</button>
    </div>
  `;

  updateProgress();
}

function closeQuiz() {
  clearInterval(quizTimer);
  showPage(currentChapter ? "chapterDetails" : "practice");
}

function resetProgress() {
  if (!confirm("তোমার সব Progress ও Saved Chapters মুছে ফেলতে চাও?")) return;

  Object.values(STORAGE).forEach(key => localStorage.removeItem(key));
  updateProgress();
  renderSaved();
  alert("Progress reset হয়েছে।");
}

/* =========================================
   SEARCH + INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderSubjects("subjectList");
  renderSubjects("allSubjectList");
  updateProgress();
  renderSaved();

  const search = document.getElementById("searchInput");

  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();

    document.querySelectorAll("#subjectList .subject-card").forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(query)
        ? "flex"
        : "none";
    });
  });
});

/* =========================================
   SWIPE NAVIGATION
========================================= */

(() => {
  const mainPages = ["home", "subjects", "practice", "saved", "profile"];
  let startX = 0;
  let startY = 0;

  document.addEventListener("touchstart", event => {
    const target = event.target;

    if (target.closest("button, input, textarea, select, a, details")) {
      startX = 0;
      return;
    }

    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  }, { passive: true });

  document.addEventListener("touchend", event => {
    if (!startX) return;

    const dx = event.changedTouches[0].clientX - startX;
    const dy = event.changedTouches[0].clientY - startY;

    startX = 0;

    if (Math.abs(dx) < 90 || Math.abs(dx) < Math.abs(dy) * 1.3) return;

    const active = document.querySelector(".page.active");
    if (!active) return;

    const current = mainPages.indexOf(active.id.replace("Page", ""));
    if (current === -1) return;

    const next = dx < 0 ? current + 1 : current - 1;
    if (next < 0 || next >= mainPages.length) return;

    showPage(mainPages[next]);
  }, { passive: true });
})();
