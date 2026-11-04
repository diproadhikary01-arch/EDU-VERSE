
"use strict";

/* =========================================
   EDU VERSE — PREMIUM JAVASCRIPT
========================================= */

const pageNames = [
  "home", "subjects", "practice", "saved", "profile", "chapter"
];

const STORAGE = {
  saved: "eduVerseSaved",
  completed: "eduVerseCompleted",
  quiz: "eduVerseQuizCount",
  score: "eduVerseQuizScore"
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Storage unavailable:", error);
  }
}

/* =========================================
   BANGLA 1ST PAPER — GADYA (18)
========================================= */

const bangla1Gadya = [
  {title:"অপরিচিতা",author:"রবীন্দ্রনাথ ঠাকুর"},
  {title:"বিলাসী",author:"শরৎচন্দ্র চট্টোপাধ্যায়"},
  {title:"আহ্বান",author:"বিভূতিভূষণ বন্দ্যোপাধ্যায়"},
  {title:"মাসি-পিসি",author:"মানিক বন্দ্যোপাধ্যায়"},
  {title:"একটি তুলসী গাছের কাহিনী",author:"সৈয়দ ওয়ালীউল্লাহ্"},
  {title:"রেইনকোট",author:"আখতারুজ্জামান ইলিয়াস"},
  {title:"নেকলেস",author:"গী দ্য মোপাসাঁ"},
  {title:"আত্মচরিত",author:"ঈশ্বরচন্দ্র বিদ্যাসাগর"},
  {title:"বাঙ্গালার নব্য লেখকদিগের প্রতি নিবেদন",author:"বঙ্কিমচন্দ্র চট্টোপাধ্যায়"},
  {title:"কারবালা-প্রান্তর",author:"মীর মশাররফ হোসেন"},
  {title:"সাহিত্যে খেলা",author:"প্রমথ চৌধুরী"},
  {title:"অর্ধাঙ্গী",author:"রোকেয়া সাখাওয়াত হোসেন"},
  {title:"শিক্ষাচিন্তা",author:"কাজী আবদুল ওদুদ"},
  {title:"ভুলের মূল্য",author:"কাজী মোতাহার হোসেন"},
  {title:"যৌবনের গান",author:"কাজী নজরুল ইসলাম"},
  {title:"জীবন ও বৃক্ষ",author:"মোতাহার হোসেন চৌধুরী"},
  {title:"মানব-কল্যাণ",author:"আবুল ফজল"},
  {title:"জাদুঘরে কেন যাব",author:"আনিসুজ্জামান"}
];

/* =========================================
   BANGLA 1ST PAPER — KOBITA (28)
========================================= */

const bangla1Kobita = [
  {title:"ফুল্লরার বারোমাস্যা",author:"মুকুন্দরাম চক্রবর্তী"},
  {title:"ঋতু বর্ণনা",author:"আলাওল"},
  {title:"স্বদেশ",author:"ঈশ্বরচন্দ্র গুপ্ত"},
  {title:"বিভীষণের প্রতি মেঘনাদ",author:"মাইকেল মধুসূদন দত্ত"},
  {title:"সুখ",author:"কায়কোবাদ"},
  {title:"মানব-বন্দনা",author:"অক্ষয়কুমার বড়াল"},
  {title:"সোনার তরী",author:"রবীন্দ্রনাথ ঠাকুর"},
  {title:"ঐকতান",author:"রবীন্দ্রনাথ ঠাকুর"},
  {title:"নবান্ন",author:"যতীন্দ্রনাথ সেনগুপ্ত"},
  {title:"বিদ্রোহী",author:"কাজী নজরুল ইসলাম"},
  {title:"সাম্যবাদী",author:"কাজী নজরুল ইসলাম"},
  {title:"সুচেতনা",author:"জীবনানন্দ দাশ"},
  {title:"প্রতিদান",author:"জসীমউদ্দীন"},
  {title:"তাহারই পড়ে মনে",author:"সুফিয়া কামাল"},
  {title:"আগে কী সুন্দর দিন কাটাইতাম",author:"শাহ আব্দুল করিম"},
  {title:"সেই অস্ত্র",author:"আহসান হাবীব"},
  {title:"পদ্মা",author:"ফররুখ আহমদ"},
  {title:"আলো চাই",author:"সিকান্দার আবু জাফর"},
  {title:"আঠারো বছর বয়স",author:"সুকান্ত ভট্টাচার্য"},
  {title:"ফেব্রুয়ারি ১৯৬৯",author:"শামসুর রাহমান"},
  {title:"হাড়",author:"আলাউদ্দিন আল আজাদ"},
  {title:"তোমার আপন পতাকা",author:"হাসান হাফিজুর রহমান"},
  {title:"আমি কিংবদন্তির কথা বলছি",author:"আবু জাফর ওবায়দুল্লাহ"},
  {title:"নূরলদীনের কথা মনে পড়ে যায়",author:"সৈয়দ শামসুল হক"},
  {title:"ছবি",author:"আবু হেনা মোস্তফা কামাল"},
  {title:"প্রত্যাবর্তনের লজ্জা",author:"আল মাহমুদ"},
  {title:"ভূমিহীন কৃষিজীবী ইচ্ছে তার",author:"মোহাম্মদ মনিরুজ্জামান"},
  {title:"ব্ল্যাক-আউটের পূর্ণিমায়",author:"শহীদ কাদরী"}
];

let currentChapter = null;
let currentPractice = [];
let currentQuestion = 0;
let currentScore = 0;
let currentMode = "mcq";
let currentPaper = "";

/* =========================================
   NAVIGATION
========================================= */

function showPage(name, button) {
  pageNames.forEach(page => {
    const element = document.getElementById(page + "Page");
    if (element) element.classList.remove("active");
  });

  const target = document.getElementById(name + "Page");

  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
  });

  if (button) {
    button.classList.add("active");
  } else {
    const index = ["home","subjects","practice","saved","profile"].indexOf(name);
    const nav = document.querySelectorAll(".nav-item");
    if (index !== -1 && nav[index]) nav[index].classList.add("active");
  }

  if (name === "saved") renderSaved();
  if (name === "profile") updateProgress();

  window.scrollTo({top:0,behavior:"smooth"});
}

/* =========================================
   SUBJECT SEARCH
========================================= */

function filterSubjects() {
  const input = document.getElementById("searchInput");
  const empty = document.getElementById("empty");

  if (!input) return;

  const query = input.value.trim().toLowerCase();
  let visible = 0;

  document.querySelectorAll("#subjectList .paper").forEach(item => {
    const name = (item.dataset.name || "") + " " + item.innerText;
    const match = name.toLowerCase().includes(query);

    item.style.display = match ? "flex" : "none";
    if (match) visible++;
  });

  document.querySelectorAll("#subjectList .subject-group").forEach(group => {
    const papers = group.querySelectorAll(".paper");
    const hasMatch = Array.from(papers).some(
      item => item.style.display !== "none"
    );
    group.style.display = hasMatch ? "block" : "none";
  });

  if (empty) empty.style.display = visible ? "none" : "block";
}

/* =========================================
   OPEN PAPER
========================================= */

function openPaper(name) {
  currentPaper = name;

  const title = document.getElementById("paperTitle");
  const list = document.getElementById("chapterList");

  if (!title || !list) return;

  title.textContent = name;
  list.innerHTML = "";

  const normalized = name.toLowerCase();

  const isBanglaFirst =
    normalized.includes("বাংলা") &&
    (normalized.includes("১ম") ||
     normalized.includes("প্রথম") ||
     normalized.includes("1st"));

  if (isBanglaFirst) {
    renderChapterSection(list,"গদ্য",bangla1Gadya);
    renderChapterSection(list,"কবিতা",bangla1Kobita);
  } else {
    const message = document.createElement("div");
    message.className = "chapter";
    message.textContent =
      "এই পত্রের অধ্যায় তালিকা পর্যায়ক্রমে যুক্ত করা হবে।";
    list.appendChild(message);
  }

  showPage("chapter");
}

/* =========================================
   RENDER CHAPTERS
========================================= */

function renderChapterSection(container, section, chapters) {
  const heading = document.createElement("h3");
  heading.textContent = section + " (" + chapters.length + ")";
  heading.style.margin = "22px 0 12px";
  container.appendChild(heading);

  chapters.forEach((chapter,index) => {
    const item = document.createElement("div");
    item.className = "chapter";

    const info = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = (index + 1) + ". " + chapter.title;

    const author = document.createElement("small");
    author.textContent =
      (section === "গদ্য" ? "লেখক: " : "কবি: ") + chapter.author;

    info.append(title,author);

    const arrow = document.createElement("span");
    arrow.textContent = "›";

    item.append(info,arrow);

    item.addEventListener("click",() => {
      openChapterDetails(chapter,section);
    });

    container.appendChild(item);
  });
}

/* =========================================
   CHAPTER DETAILS
========================================= */

function openChapterDetails(chapter,section) {
  currentChapter = {...chapter,section};

  let page = document.getElementById("chapterDetailsPage");

  if (!page) {
    page = document.createElement("section");
    page.id = "chapterDetailsPage";
    page.className = "page";
    document.body.appendChild(page);
  }

  const writer = section === "গদ্য" ? "লেখক" : "কবি";
  const saved = readStorage(STORAGE.saved,[]);
  const isSaved = saved.some(item => item.title === chapter.title);

  page.innerHTML = `
    <div class="container">
      <button class="back" onclick="closeChapterDetails()">← ফিরে যাও</button>

      <div class="chapter-detail-card">
        <span class="detail-tag">${escapeHTML(section)}</span>
        <h2>${escapeHTML(chapter.title)}</h2>
        <p>${writer}: ${escapeHTML(chapter.author)}</p>
        <button class="primary-btn" onclick="toggleSaveCurrent()">
          ${isSaved ? "★ Saved" : "☆ Save Chapter"}
        </button>
      </div>

      <div class="detail-topic">
        <h3>📖 পাঠ পরিচিতি</h3>
        <p>এই পাঠের পরিচিতি ও প্রেক্ষাপট সম্পর্কে জানার জন্য মূল পাঠের ঐতিহাসিক, সাহিত্যিক এবং সামাজিক প্রেক্ষাপট বিবেচনা করতে হবে।</p>
      </div>

      <div class="detail-topic">
        <h3>✍️ ${writer} পরিচিতি</h3>
        <p>${escapeHTML(chapter.author)} বাংলা সাহিত্যজগতের একজন গুরুত্বপূর্ণ সাহিত্যিক। তাঁর সাহিত্যকর্ম ও সৃষ্টিশীল অবদান এই পাঠের আলোচনায় প্রাসঙ্গিক।</p>
      </div>

      <div class="detail-topic">
        <h3>💡 মূলভাব</h3>
        <p>এই অংশে পাঠটির কেন্দ্রীয় বক্তব্য, প্রধান বিষয়, মানবিক দৃষ্টিভঙ্গি এবং লেখকের উদ্দেশ্য বুঝে পড়তে হবে। নির্ভুল পাঠভিত্তিক মূলভাব পরবর্তী কনটেন্ট সংস্করণে যুক্ত হবে।</p>
      </div>

      <div class="detail-topic">
        <h3>📚 বিস্তারিত আলোচনা</h3>
        <p>পাঠের ঘটনাপ্রবাহ, চরিত্র, বক্তব্য, ভাষাশৈলী ও প্রাসঙ্গিক দিকগুলো বিশ্লেষণ করে পড়ো। এই জায়গায় এখনো অধ্যায়ভিত্তিক পূর্ণাঙ্গ আলোচনা যুক্ত হয়নি।</p>
      </div>

      <div class="detail-topic">
        <h3>🔤 গুরুত্বপূর্ণ শব্দার্থ</h3>
        <p>মূল পাঠ থেকে গুরুত্বপূর্ণ শব্দ নির্বাচন করে অর্থ, প্রয়োগ ও প্রসঙ্গসহ অনুশীলন করো। যাচাই করা শব্দার্থ এখানে পরে যুক্ত হবে।</p>
      </div>

      <div class="detail-topic">
        <h3>📝 MCQ অনুশীলন</h3>
        <p>এই অধ্যায়ের MCQ অনুশীলনের জন্য Practice পেজ ব্যবহার করো।</p>
        <button class="primary-btn" onclick="startPractice('mcq')">Start MCQ →</button>
      </div>

      <div class="detail-topic">
        <h3>✏️ CQ প্রস্তুতি</h3>
        <p>উদ্দীপক বিশ্লেষণ, জ্ঞান, অনুধাবন, প্রয়োগ ও উচ্চতর দক্ষতার প্রশ্নের উত্তর অনুশীলন করো। যাচাইকৃত মডেল CQ পরে যুক্ত হবে।</p>
      </div>

      <p class="muted">
        শিক্ষাসামগ্রী পর্যায়ক্রমে যাচাই করে যুক্ত করা হবে।
        এখানে মূল বইয়ের হুবহু কপি দেওয়া হচ্ছে না।
      </p>
    </div>
  `;

  pageNames.forEach(name => {
    const el = document.getElementById(name + "Page");
    if (el) el.classList.remove("active");
  });

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
  });

  page.classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}

function closeChapterDetails() {
  const page = document.getElementById("chapterDetailsPage");
  if (page) page.classList.remove("active");
  showPage("chapter");
}

/* =========================================
   SAVE CHAPTER
========================================= */

function toggleSaveCurrent() {
  if (!currentChapter) return;

  let saved = readStorage(STORAGE.saved,[]);
  const index = saved.findIndex(
    item => item.title === currentChapter.title
  );

  if (index >= 0) {
    saved.splice(index,1);
  } else {
    saved.push(currentChapter);
  }

  writeStorage(STORAGE.saved,saved);

  openChapterDetails(currentChapter,currentChapter.section);
  updateProgress();
}

function renderSaved() {
  const container = document.getElementById("savedList");
  if (!container) return;

  const saved = readStorage(STORAGE.saved,[]);
  container.innerHTML = "";

  if (!saved.length) {
    container.textContent = "এখনো কোনো পাঠ সংরক্ষণ করা হয়নি।";
    return;
  }

  saved.forEach(chapter => {
    const item = document.createElement("div");
    item.className = "paper";

    const info = document.createElement("div");
    const title = document.createElement("div");
    title.className = "paper-name";
    title.textContent = chapter.title;

    const author = document.createElement("small");
    author.textContent = chapter.author;

    info.append(title,author);

    const remove = document.createElement("button");
    remove.textContent = "✕";
    remove.className = "remove-save";
    remove.addEventListener("click",event => {
      event.stopPropagation();
      const updated = readStorage(STORAGE.saved,[])
        .filter(item => item.title !== chapter.title);
      writeStorage(STORAGE.saved,updated);
      renderSaved();
      updateProgress();
    });

    item.append(info,remove);
    item.addEventListener("click",() => {
      openChapterDetails(chapter,chapter.section);
    });

    container.appendChild(item);
  });
}

/* =========================================
   COMPLETED CHAPTERS
========================================= */

function markChapterCompleted(title) {
  const completed = readStorage(STORAGE.completed,[]);

  if (!completed.includes(title)) {
    completed.push(title);
    writeStorage(STORAGE.completed,completed);
  }

  updateProgress();
}

/* =========================================
   MCQ QUESTION BANK
   Sample questions — verified content
   should be added chapter by chapter.
========================================= */

const sampleQuestions = [
  {
    question:"বাংলা সাহিত্যের প্রথম সার্থক উপন্যাস কোনটি?",
    options:["দুর্গেশনন্দিনী","কপালকুণ্ডলা","আলালের ঘরের দুলাল","বিষবৃক্ষ"],
    answer:0,
    explanation:"বঙ্কিমচন্দ্র চট্টোপাধ্যায়ের দুর্গেশনন্দিনী বাংলা সাহিত্যের প্রথম সার্থক উপন্যাস হিসেবে স্বীকৃত।"
  },
  {
    question:"রবীন্দ্রনাথ ঠাকুর কোন সালে নোবেল পুরস্কার পান?",
    options:["১৯০৫","১৯১১","১৯১৩","১৯২১"],
    answer:2,
    explanation:"গীতাঞ্জলি কাব্যের ইংরেজি অনুবাদের জন্য ১৯১৩ সালে তিনি সাহিত্যে নোবেল পুরস্কার পান।"
  },
  {
    question:"কাজী নজরুল ইসলামকে কী নামে অভিহিত করা হয়?",
    options:["বিশ্বকবি","বিদ্রোহী কবি","পল্লীকবি","স্বভাবকবি"],
    answer:1,
    explanation:"তাঁর বিদ্রোহী চেতনা ও কবিতার জন্য তাঁকে বিদ্রোহী কবি বলা হয়।"
  }
];

function startPractice(mode = "mcq") {
  currentMode = mode;
  currentQuestion = 0;
  currentScore = 0;

  currentPractice = [...sampleQuestions];

  let page = document.getElementById("quizPage");

  if (!page) {
    page = document.createElement("section");
    page.id = "quizPage";
    page.className = "page";
    document.body.appendChild(page);
  }

  page.classList.add("active");

  pageNames.forEach(name => {
    const el = document.getElementById(name + "Page");
    if (el) el.classList.remove("active");
  });

  renderQuestion();
  window.scrollTo({top:0,behavior:"smooth"});
}

/* =========================================
   RENDER MCQ
========================================= */

function renderQuestion() {
  const page = document.getElementById("quizPage");
  if (!page) return;

  if (currentQuestion >= currentPractice.length) {
    showQuizResult();
    return;
  }

  const q = currentPractice[currentQuestion];

  page.innerHTML = `
    <div class="container">
      <button class="back" onclick="closeQuiz()">← Practice</button>
      <div class="quiz-card">
        <p class="muted">QUESTION ${currentQuestion + 1} / ${currentPractice.length}</p>
        <h2>${escapeHTML(q.question)}</h2>
        <div id="quizOptions"></div>
        <div id="quizFeedback"></div>
        <button id="nextQuestion" class="primary-btn" style="display:none" onclick="nextQuestion()">পরের প্রশ্ন →</button>
      </div>
    </div>
  `;

  const options = page.querySelector("#quizOptions");

  q.options.forEach((option,index) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.textContent = String.fromCharCode(65 + index) + ". " + option;

    button.addEventListener("click",() => checkAnswer(index));
    options.appendChild(button);
  });
}

function checkAnswer(selected) {
  const q = currentPractice[currentQuestion];
  const buttons = document.querySelectorAll(".quiz-option");

  if (Array.from(buttons).some(btn => btn.disabled)) return;

  buttons.forEach((btn,index) => {
    btn.disabled = true;

    if (index === q.answer) btn.classList.add("correct");
    if (index === selected && selected !== q.answer) {
      btn.classList.add("wrong");
    }
  });

  const correct = selected === q.answer;

  if (correct) currentScore++;

  const feedback = document.getElementById("quizFeedback");
  feedback.textContent =
    (correct ? "সঠিক উত্তর! " : "ভুল উত্তর। ") + q.explanation;

  feedback.className = correct ? "quiz-correct" : "quiz-wrong";

  document.getElementById("nextQuestion").style.display = "block";
}

function nextQuestion() {
  currentQuestion++;
  renderQuestion();
}

function showQuizResult() {
  const page = document.getElementById("quizPage");
  const total = currentPractice.length;
  const percent = Math.round(currentScore / total * 100);

  const attempts = Number(readStorage(STORAGE.quiz,0)) + 1;
  const totalScore = Number(readStorage(STORAGE.score,0)) + currentScore;

  writeStorage(STORAGE.quiz,attempts);
  writeStorage(STORAGE.score,totalScore);

  page.innerHTML = `
    <div class="container">
      <div class="quiz-card">
        <h2>🎉 Quiz Completed!</h2>
        <h1>${currentScore} / ${total}</h1>
        <p>তোমার ফলাফল: ${percent}%</p>
        <button class="primary-btn" onclick="startPractice('mcq')">Try Again</button>
        <button class="back" onclick="closeQuiz()">Back to Practice</button>
      </div>
    </div>
  `;

  updateProgress();
}

function closeQuiz() {
  const page = document.getElementById("quizPage");
  if (page) page.classList.remove("active");
  showPage("practice");
}

/* =========================================
   PROFILE PROGRESS
========================================= */

function updateProgress() {
  const completed = readStorage(STORAGE.completed,[]);
  const saved = readStorage(STORAGE.saved,[]);
  const quiz = readStorage(STORAGE.quiz,0);

  const completedEl = document.getElementById("completedCount");
  const quizEl = document.getElementById("quizCount");
  const savedEl = document.getElementById("savedCount");

  if (completedEl) completedEl.textContent = completed.length;
  if (quizEl) quizEl.textContent = quiz;
  if (savedEl) savedEl.textContent = saved.length;
}

/* =========================================
   ABOUT APP
========================================= */

function showAppInfo() {
  alert(
    "EDU VERSE\nYour Personal HSC Learning World\n\n" +
    "বাংলাদেশের HSC শিক্ষার্থীদের জন্য একটি ব্যক্তিগত শিক্ষাসহায়ক অ্যাপ।"
  );
}

/* =========================================
   SAFE HTML
========================================= */

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g,char => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  })[char]);
}

/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded",() => {
  updateProgress();
  renderSaved();
});
