
"use strict";

/* =========================================
   EDU VERSE — PREMIUM APPLICATION
   Profile • Theme • Language • Study • Quiz
========================================= */

(() => {

  const STORAGE = {
    saved: "eduVerseSaved",
    completed: "eduVerseCompleted",
    quiz: "eduVerseQuizCount",
    score: "eduVerseQuizScore",
    profile: "eduVerseStudentProfile",
    theme: "eduVerseTheme",
    language: "eduVerseLanguage"
  };

  const DEFAULT_AVATAR =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='50' fill='%23173529'/%3E%3Ctext x='50' y='65' font-size='48' text-anchor='middle' fill='%23e6bd65'%3E%E2%98%BA%3C/text%3E%3C/svg%3E";

  const subjects = [
    "বাংলা ১ম পত্র",
    "বাংলা ২য় পত্র",
    "ইংরেজি ১ম পত্র",
    "ইংরেজি ২য় পত্র",
    "তথ্য ও যোগাযোগ প্রযুক্তি",
    "পৌরনীতি ১ম পত্র",
    "পৌরনীতি ২য় পত্র",
    "অর্থনীতি ১ম পত্র",
    "অর্থনীতি ২য় পত্র",
    "ইতিহাস ১ম পত্র",
    "ইতিহাস ২য় পত্র",
    "ইসলামের ইতিহাস ১ম পত্র",
    "ইসলামের ইতিহাস ২য় পত্র",
    "সমাজবিজ্ঞান ১ম পত্র",
    "সমাজবিজ্ঞান ২য় পত্র",
    "যুক্তিবিদ্যা ১ম পত্র",
    "যুক্তিবিদ্যা ২য় পত্র",
    "ভূগোল ১ম পত্র",
    "ভূগোল ২য় পত্র"
  ];

  const icons = ["📘", "📗", "📙", "📕"];

  let currentChapter = null;
  let currentPractice = "mcq";
  let questions = [];
  let questionIndex = 0;
  let score = 0;
  let answered = false;
  let timerInterval = null;
  let remainingTime = 60;
  let quizFinished = false;

  let language = "bn";

  /* STORAGE */

  function readStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn("Storage unavailable:", error);
      return false;
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  function getSaved() {
    return readStorage(STORAGE.saved, []);
  }

  function getCompleted() {
    return readStorage(STORAGE.completed, []);
  }

  function getQuizCount() {
    return Number(readStorage(STORAGE.quiz, 0)) || 0;
  }

  function getChapterDatabase() {
    return window.EDU_VERSE_CHAPTERS || {};
  }

  function getBanglaChapter() {
    return getChapterDatabase()["অপরিচিতা"] || null;
  }

  function getChapterKey(chapter) {
    return chapter?.id || chapter?.title || "unknown";
  }

  function getQuestionBank() {
    const chapter = getBanglaChapter();
    return Array.isArray(chapter?.mcq) ? chapter.mcq : [];
  }

  /* PAGE NAVIGATION */

  function updateNavigation(pageName) {
    document.querySelectorAll(".nav-item").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.page === pageName
      );
    });
  }

  function showPage(pageName) {
    document.querySelectorAll(".container > .page")
      .forEach(page => page.classList.remove("active"));

    const target = document.getElementById(pageName + "Page");

    if (target) target.classList.add("active");

    const navPage = [
      "home", "subjects", "practice", "saved", "profile"
    ].includes(pageName) ? pageName : null;

    if (navPage) updateNavigation(navPage);

    if (pageName === "saved") renderSaved();

    if (pageName === "profile") {
      loadProfile();
      updateProgress();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* SUBJECTS */

  function createSubjectCard(subject, index) {
    return `
      <button class="subject-card"
        onclick="openPaper('${escapeHTML(subject)}')">
        <span class="subject-icon">${icons[index % icons.length]}</span>
        <span>${escapeHTML(subject)}</span>
        <span class="subject-arrow">→</span>
      </button>
    `;
  }

  function renderSubjects() {
    const allList = document.getElementById("allSubjectList");
    if (!allList) return;

    allList.innerHTML = subjects
      .map(createSubjectCard)
      .join("");
  }

  function openPaper(name) {
    currentChapter = null;

    const title = document.getElementById("paperTitle");
    const list = document.getElementById("chapterList");

    if (title) title.textContent = name;

    const isBanglaFirst =
      name.includes("বাংলা") &&
      (name.includes("১ম") || name.includes("প্রথম"));

    if (isBanglaFirst) {
      const chapter = getBanglaChapter();

      if (chapter) {
        list.innerHTML = `
          <button class="chapter-item"
            onclick="openChapterDetails('অপরিচিতা')">
            <span class="chapter-number">01</span>
            <span class="chapter-info">
              <h3>${escapeHTML(chapter.title)}</h3>
              <p>${escapeHTML(chapter.author)} · ${escapeHTML(chapter.type || "গদ্য")}</p>
              <span class="content-status">✓ Complete Study Pack</span>
            </span>
            <span class="subject-arrow">→</span>
          </button>

          <div class="coming-soon">
            <h3>আরও অধ্যায় আসছে</h3>
            <p>বাংলা ১ম পত্রের পরবর্তী অধ্যায়গুলো পর্যায়ক্রমে যুক্ত করা হবে।</p>
          </div>
        `;
      } else {
        list.innerHTML = `
          <div class="empty-state">
            <h3>অধ্যায়ের ডেটা পাওয়া যায়নি</h3>
            <p>chapters/bangla-1st.js ফাইলটি সঠিকভাবে লোড হয়েছে কি না দেখো।</p>
          </div>
        `;
      }
    } else {
      list.innerHTML = `
        <div class="coming-soon">
          <h3>এই বিষয়ের অধ্যায় প্রস্তুত হচ্ছে</h3>
          <p>এই বিষয়ের বিস্তারিত অধ্যায় ও অনুশীলন শীঘ্রই যুক্ত হবে।</p>
        </div>
      `;
    }

    showPage("chapter");
  }

  /* CHAPTER CONTENT */

  function textBlock(title, content) {
    if (!content) return "";

    return `
      <section class="study-section">
        <h3>${escapeHTML(title)}</h3>
        <div class="section-content">${escapeHTML(content)}</div>
      </section>
    `;
  }

  function renderArrayItems(items, type) {
    if (!Array.isArray(items) || !items.length) return "";

    if (type === "discussion" || type === "explanations") {
      return items.map(item => `
        <div class="discussion-item">
          <h4>${escapeHTML(item.heading || "")}</h4>
          <p>${escapeHTML(item.details || item.description || "")}</p>
        </div>
      `).join("");
    }

    if (type === "characters") {
      return items.map(item => `
        <div class="character-item">
          <h4>${escapeHTML(item.name || "")}</h4>
          <p>${escapeHTML(item.description || "")}</p>
        </div>
      `).join("");
    }

    if (type === "vocabulary") {
      return items.map(item => `
        <div class="vocabulary-item">
          <strong>${escapeHTML(item.word || "")}</strong>
          <span>${escapeHTML(item.meaning || "")}</span>
        </div>
      `).join("");
    }

    return "";
  }

  function renderCQ(items) {
    if (!Array.isArray(items)) return "";

    return items.map((item, index) => {
      const sub = item.subQuestions || {};

      return `
        <article class="cq-card">
          <h4>সৃজনশীল প্রশ্ন ${index + 1}</h4>

          <div class="stimulus">
            <strong>উদ্দীপক:</strong>
            <p>${escapeHTML(item.stimulus || "")}</p>
          </div>

          <p>${escapeHTML(item.question || "")}</p>

          <div class="cq-subquestions">
            <p><b>ক.</b> ${escapeHTML(sub.a || "")}</p>
            <p><b>খ.</b> ${escapeHTML(sub.b || "")}</p>
            <p><b>গ.</b> ${escapeHTML(sub.c || "")}</p>
            <p><b>ঘ.</b> ${escapeHTML(sub.d || "")}</p>
          </div>

          ${
            Array.isArray(item.guidance)
              ? `<details>
                  <summary>উত্তর লেখার নির্দেশনা দেখো</summary>
                  ${item.guidance.map((tip, i) =>
                    `<p>${i + 1}. ${escapeHTML(tip)}</p>`
                  ).join("")}
                </details>`
              : ""
          }
        </article>
      `;
    }).join("");
  }

  function renderRevision(items) {
    if (!Array.isArray(items)) return "";

    return items.map((item, index) => `
      <details class="revision-item">
        <summary>${index + 1}. ${escapeHTML(item.question || "")}</summary>
        <p>${escapeHTML(item.answer || "")}</p>
      </details>
    `).join("");
  }

  function openChapterDetails(title) {
    const chapter = getChapterDatabase()[title];

    if (!chapter) {
      alert("এই অধ্যায়ের তথ্য পাওয়া যায়নি।");
      return;
    }

    currentChapter = chapter;

    const key = getChapterKey(chapter);
    const saved = getSaved().includes(key);
    const completed = getCompleted().includes(key);

    const discussion = Array.isArray(chapter.discussion)
      ? renderArrayItems(chapter.discussion, "discussion")
      : escapeHTML(chapter.discussion || "");

    const words = chapter.vocabulary || chapter.words || [];

    const details = document.getElementById("chapterDetails");

    details.innerHTML = `
      <button class="back-button" onclick="showPage('chapter')">
        ← Back to Chapters
      </button>

      <div class="chapter-hero">
        <span class="eyebrow">${escapeHTML(chapter.paper || "বাংলা ১ম পত্র")}</span>
        <h2>${escapeHTML(chapter.title)}</h2>
        <p>${escapeHTML(chapter.author || "")} · ${escapeHTML(chapter.type || "অধ্যায়")}</p>

        <div class="chapter-actions">
          <button class="secondary-button" onclick="toggleSaveCurrent()">
            ${saved ? "🔖 Saved" : "＋ Save Chapter"}
          </button>
          <button class="secondary-button" onclick="toggleCompletedCurrent()">
            ${completed ? "✓ Completed" : "Mark Completed"}
          </button>
          <button class="primary-button" onclick="startChapterPractice()">
            🎯 Practice MCQ
          </button>
        </div>
      </div>

      ${textBlock("পাঠ পরিচিতি", chapter.introduction || chapter.intro)}
      ${textBlock("লেখক পরিচিতি", chapter.authorInfo)}
      ${textBlock("মূলভাব ও সারসংক্ষেপ", chapter.summary)}
      ${textBlock("মূলভাব / বিষয়বস্তু", chapter.theme)}

      ${
        chapter.characters?.length
          ? `<section class="study-section">
              <h3>চরিত্র পরিচিতি</h3>
              ${renderArrayItems(chapter.characters, "characters")}
            </section>`
          : ""
      }

      ${
        discussion
          ? `<section class="study-section">
              <h3>বিস্তারিত আলোচনা</h3>
              ${discussion}
            </section>`
          : ""
      }

      ${
        words.length
          ? `<section class="study-section">
              <h3>শব্দার্থ</h3>
              <div class="vocabulary-list">
                ${renderArrayItems(words, "vocabulary")}
              </div>
            </section>`
          : ""
      }

      ${
        chapter.explanations?.length
          ? `<section class="study-section">
              <h3>গুরুত্বপূর্ণ ব্যাখ্যা</h3>
              ${renderArrayItems(chapter.explanations, "explanations")}
            </section>`
          : ""
      }

      ${
        chapter.mcq?.length
          ? `<section class="study-section">
              <h3>MCQ প্রশ্নব্যাংক (${chapter.mcq.length}টি)</h3>
              <p class="section-content">সব প্রশ্নের অনুশীলনের জন্য MCQ Practice শুরু করো।</p>
              <button class="primary-button" onclick="startChapterPractice()">
                Start ${chapter.mcq.length} MCQ →
              </button>
            </section>`
          : ""
      }

      ${
        chapter.cq?.length
          ? `<section class="study-section">
              <h3>সৃজনশীল প্রশ্ন (${chapter.cq.length}টি)</h3>
              ${renderCQ(chapter.cq)}
            </section>`
          : ""
      }

      ${
        chapter.revision?.length
          ? `<section class="study-section">
              <h3>Revision — নিজেকে যাচাই করো</h3>
              ${renderRevision(chapter.revision)}
            </section>`
          : ""
      }

      ${
        chapter.studyTips?.length
          ? `<section class="study-section">
              <h3>পরীক্ষার প্রস্তুতি টিপস</h3>
              <ul class="tips-list">
                ${chapter.studyTips.map(tip =>
                  `<li>${escapeHTML(tip)}</li>`
                ).join("")}
              </ul>
            </section>`
          : ""
      }

      ${
        chapter.sourceInfo
          ? `<section class="study-section">
              <h3>তথ্যসূত্র ও নোট</h3>
              <p class="section-content">${escapeHTML(chapter.sourceInfo.note || "")}</p>
              <p class="section-content">${escapeHTML(chapter.sourceInfo.syllabusNote || "")}</p>
            </section>`
          : ""
      }
    `;

    showPage("chapterDetails");
  }

  /* SAVE AND COMPLETED */

  function toggleSaveCurrent() {
    if (!currentChapter) return;

    const key = getChapterKey(currentChapter);
    let saved = getSaved();

    saved = saved.includes(key)
      ? saved.filter(item => item !== key)
      : [...saved, key];

    writeStorage(STORAGE.saved, saved);

    openChapterDetails(currentChapter.title);
    updateProgress();
  }

  function toggleCompletedCurrent() {
    if (!currentChapter) return;

    const key = getChapterKey(currentChapter);
    let completed = getCompleted();

    completed = completed.includes(key)
      ? completed.filter(item => item !== key)
      : [...completed, key];

    writeStorage(STORAGE.completed, completed);

    openChapterDetails(currentChapter.title);
    updateProgress();
  }

  function renderSaved() {
    const list = document.getElementById("savedList");
    if (!list) return;

    const saved = getSaved();

    const chapters = Object.values(getChapterDatabase()).filter(chapter =>
      saved.includes(getChapterKey(chapter))
    );

    if (!chapters.length) {
      list.innerHTML = `
        <div class="empty-state">
          <h3>এখনো কিছু Save করা হয়নি</h3>
          <p>অধ্যায় থেকে Save Chapter চাপলে এখানে পাবে।</p>
        </div>
      `;
      return;
    }

    list.innerHTML = chapters.map(chapter => `
      <button class="chapter-item"
        onclick="openChapterDetails('${escapeHTML(chapter.title)}')">
        <span class="chapter-number">📘</span>
        <span class="chapter-info">
          <h3>${escapeHTML(chapter.title)}</h3>
          <p>${escapeHTML(chapter.author || "")}</p>
          <span class="content-status">Saved Chapter</span>
        </span>
        <span class="subject-arrow">→</span>
      </button>
    `).join("");
  }

  /* PROFILE SYSTEM */

  function getProfile() {
    return readStorage(STORAGE.profile, {});
  }

  function loadProfile() {
    const profile = getProfile();

    const fields = {
      studentName: "name",
      studentUsername: "username",
      studentAbout: "about",
      studentBatch: "batch",
      studentCollege: "college",
      studentBoard: "board",
      studentGroup: "group",
      studentSession: "session"
    };

    Object.entries(fields).forEach(([id, key]) => {
      const element = document.getElementById(id);
      if (element) element.value = profile[key] || "";
    });

    const photo = profile.photo || DEFAULT_AVATAR;

    const preview = document.getElementById("profilePreview");
    if (preview) preview.src = photo;

    updateHeaderProfile(profile);
  }

  function updateHeaderProfile(profile = getProfile()) {
    const name = profile.name || "Your Name";
    const batch = profile.batch
      ? `HSC Batch ${profile.batch}`
      : "HSC Student";

    const headerName = document.getElementById("headerUserName");
    const subtitle = document.getElementById("headerUserSubtitle");

    const headerImage = document.getElementById("headerProfileImage");
    const preview = document.getElementById("profilePreview");

    if (headerName) headerName.textContent = name;
    if (subtitle) subtitle.textContent = batch;

    const photo = profile.photo || DEFAULT_AVATAR;

    if (headerImage) headerImage.src = photo;
    if (preview) preview.src = photo;

    const displayName = document.getElementById("profileDisplayName");
    const displayBatch = document.getElementById("profileDisplayBatch");

    if (displayName) displayName.textContent = name;
    if (displayBatch) displayBatch.textContent = batch;
  }

  function saveProfile(event) {
    event.preventDefault();

    const profile = getProfile();

    profile.name = document.getElementById("studentName").value.trim();
    profile.username = document.getElementById("studentUsername").value.trim();
    profile.about = document.getElementById("studentAbout").value.trim();
    profile.batch = document.getElementById("studentBatch").value.trim();
    profile.college = document.getElementById("studentCollege").value.trim();
    profile.board = document.getElementById("studentBoard").value;
    profile.group = document.getElementById("studentGroup").value;
    profile.session = document.getElementById("studentSession").value.trim();

    if (!writeStorage(STORAGE.profile, profile)) {
      alert("Profile Save করা যায়নি। Browser storage পূর্ণ হতে পারে।");
      return;
    }

    updateHeaderProfile(profile);
    alert("তোমার Profile সফলভাবে Save হয়েছে! ❤️");
  }

  function setupProfileImage() {
    const input = document.getElementById("profileImageInput");
    if (!input) return;

    input.addEventListener("change", event => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("একটি ছবি নির্বাচন করো।");
        return;
      }

      if (file.size > 8 * 1024 * 1024) {
        alert("ছবির সাইজ 8 MB-এর কম রাখো।");
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();

        image.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSize = 500;

          const ratio = Math.min(
            maxSize / image.width,
            maxSize / image.height,
            1
          );

          canvas.width = Math.round(image.width * ratio);
          canvas.height = Math.round(image.height * ratio);

          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          const photo = canvas.toDataURL("image/jpeg", 0.82);
          const profile = getProfile();

          profile.photo = photo;

          if (!writeStorage(STORAGE.profile, profile)) {
            alert("ছবিটি Save করা যায়নি। ছোট সাইজের ছবি চেষ্টা করো।");
            return;
          }

          updateHeaderProfile(profile);
          alert("Profile Picture Update হয়েছে! ❤️");
        };

        image.onerror = () => alert("ছবিটি খোলা যায়নি। অন্য ছবি চেষ্টা করো।");
        image.src = reader.result;
      };

      reader.readAsDataURL(file);
    });
  }

  /* DARK AND LIGHT MODE */

  function applyTheme(theme) {
    document.body.classList.toggle("light-mode", theme === "light");

    const button = document.getElementById("themeToggle");

    if (button) {
      button.textContent = theme === "light" ? "☀️" : "🌙";
    }

    const meta = document.querySelector('meta[name="theme-color"]');

    if (meta) {
      meta.content = theme === "light" ? "#f4f7f5" : "#071512";
    }

    writeStorage(STORAGE.theme, theme);
  }

  function toggleTheme() {
    const current = readStorage(STORAGE.theme, "dark");
    applyTheme(current === "dark" ? "light" : "dark");
  }

  function addThemeStyles() {
    if (document.getElementById("eduVerseThemeStyles")) return;

    const style = document.createElement("style");
    style.id = "eduVerseThemeStyles";

    style.textContent = `
      body.light-mode {
        background: #f2f6f3 !important;
        color: #183329 !important;
        color-scheme: light;
      }

      body.light-mode .header,
      body.light-mode .bottom-nav {
        background: rgba(245,250,247,.94) !important;
        border-color: rgba(20,70,45,.15) !important;
      }

      body.light-mode .hero,
      body.light-mode .stat-card,
      body.light-mode .quick-card,
      body.light-mode .subject-card,
      body.light-mode .practice-card,
      body.light-mode .profile-card,
      body.light-mode .study-section,
      body.light-mode .chapter-item,
      body.light-mode .quiz-card,
      body.light-mode .coming-soon {
        background: rgba(255,255,255,.92) !important;
        color: #183329 !important;
        border-color: rgba(20,70,45,.15) !important;
      }

      body.light-mode h1,
      body.light-mode h2,
      body.light-mode h3,
      body.light-mode h4,
      body.light-mode p,
      body.light-mode strong,
      body.light-mode label,
      body.light-mode .nav-item {
        color: #183329;
      }

      body.light-mode input,
      body.light-mode textarea,
      body.light-mode select {
        background: #fff !important;
        color: #183329 !important;
        border-color: #cbd9d0 !important;
      }

      body.light-mode .aurora-background {
        opacity: .16;
      }

      body.light-mode .section-content,
      body.light-mode .discussion-item,
      body.light-mode .character-item,
      body.light-mode .vocabulary-item,
      body.light-mode .cq-card {
        color: #263d32;
      }

      body.light-mode .quiz-option {
        background: #f3f7f4;
        color: #183329;
        border-color: #cbd9d0;
      }
    `;

    document.head.appendChild(style);
  }

  /* LANGUAGE SYSTEM */

  const translations = {
    "WELCOME TO": "স্বাগতম",
    "Quick Access": "দ্রুত প্রবেশ",
    "EXPLORE": "ঘুরে দেখো",
    "Subjects": "বিষয়সমূহ",
    "Practice": "অনুশীলন",
    "MCQ Practice": "MCQ অনুশীলন",
    "Saved Notes": "সংরক্ষিত নোট",
    "All Subjects": "সকল বিষয়",
    "YOUR STUDY LIBRARY": "তোমার পড়াশোনার লাইব্রেরি",
    "YOUR LEARNING JOURNEY": "তোমার শিক্ষাযাত্রা",
    "CHAPTER LIBRARY": "অধ্যায়ের লাইব্রেরি",
    "Practice Zone": "অনুশীলন কেন্দ্র",
    "TEST YOUR KNOWLEDGE": "নিজের জ্ঞান যাচাই করো",
    "Saved Chapters": "সংরক্ষিত অধ্যায়",
    "YOUR COLLECTION": "তোমার সংগ্রহ",
    "My Profile": "আমার প্রোফাইল",
    "PERSONAL STUDENT ACCOUNT": "শিক্ষার্থীর ব্যক্তিগত অ্যাকাউন্ট",
    "Personal Information": "ব্যক্তিগত তথ্য",
    "Education Information": "শিক্ষাগত তথ্য",
    "Full Name": "সম্পূর্ণ নাম",
    "Username": "ইউজারনেম",
    "About Me": "আমার সম্পর্কে",
    "HSC Batch": "এইচএসসি ব্যাচ",
    "College Name": "কলেজের নাম",
    "Education Board": "শিক্ষা বোর্ড",
    "Academic Group": "বিভাগ",
    "HSC Session": "এইচএসসি সেশন",
    "Save Profile": "প্রোফাইল সংরক্ষণ",
    "My Learning Progress": "আমার পড়াশোনার অগ্রগতি",
    "Completed": "সম্পন্ন",
    "Quizzes": "কুইজ",
    "Saved": "সংরক্ষিত",
    "Home": "হোম",
    "Saved Chapters": "সংরক্ষিত অধ্যায়",
    "Start Learning": "পড়াশোনা শুরু",
    "Timer Quiz": "সময়ভিত্তিক কুইজ",
    "Quick Quiz": "দ্রুত কুইজ"
  };

  const originalText = new WeakMap();

  function translatePage() {
    const button = document.getElementById("languageToggle");

    if (button) {
      button.textContent = language === "bn" ? "বাংলা" : "English";
    }

    document.documentElement.lang = language === "bn" ? "bn" : "en";

    document.querySelectorAll(
      ".header, .bottom-nav, .container"
    ).forEach(container => {
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT
      );

      const nodes = [];

      while (walker.nextNode()) {
        nodes.push(walker.currentNode);
      }

      nodes.forEach(node => {
        if (!originalText.has(node)) {
          originalText.set(node, node.nodeValue);
        }

        const original = originalText.get(node).trim();

        if (!original) return;

        if (language === "bn") {
          node.nodeValue = originalText.get(node);
          return;
        }

        const translated = translations[original];

        if (translated) {
          node.nodeValue = node.nodeValue.replace(original, translated);
        }
      });
    });

    document.querySelectorAll("[placeholder]").forEach(element => {
      if (!element.dataset.originalPlaceholder) {
        element.dataset.originalPlaceholder = element.placeholder;
      }

      if (language === "bn") {
        element.placeholder = element.dataset.originalPlaceholder;
      } else {
        const map = {
          "তোমার সম্পূর্ণ নাম": "Your full name",
          "তোমার Username": "Your username",
          "নিজের সম্পর্কে কিছু লিখো...": "Write something about yourself...",
          "যেমন: 2027": "Example: 2027",
          "তোমার কলেজের নাম": "Your college name",
          "বোর্ড নির্বাচন করো": "Select your board",
          "গ্রুপ নির্বাচন করো": "Select your group",
          "যেমন: 2025-2026": "Example: 2025-2026"
        };

        element.placeholder =
          map[element.dataset.originalPlaceholder] ||
          element.dataset.originalPlaceholder;
      }
    });
  }

  function toggleLanguage() {
    language = language === "bn" ? "en" : "bn";

    writeStorage(STORAGE.language, language);
    translatePage();
  }

  /* QUIZ HELPERS */

  function shuffle(array) {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  function normalizeQuestion(question) {
    return {
      question: question.question || "",
      options: Array.isArray(question.options) ? question.options : [],
      answer: Number(question.answer),
      explanation: question.explanation ||
        "এই প্রশ্নের অতিরিক্ত ব্যাখ্যা দেওয়া হয়নি।"
    };
  }

  function startPractice(mode = "mcq") {
    const bank = getQuestionBank();

    if (!bank.length) {
      alert("এখনো কোনো অধ্যায়ের MCQ পাওয়া যায়নি।");
      return;
    }

    currentPractice = mode;
    quizFinished = false;
    questionIndex = 0;
    score = 0;
    answered = false;

    const shuffled = shuffle(bank).map(normalizeQuestion);

    if (mode === "quick") {
      questions = shuffled.slice(0, 5);
    } else if (mode === "timer") {
      questions = shuffled.slice(0, 15);
      remainingTime = 60;
    } else {
      questions = shuffled;
    }

    if (!questions.length) {
      alert("প্রশ্ন পাওয়া যায়নি।");
      return;
    }

    clearInterval(timerInterval);
    showPage("quiz");
    renderQuestion();

    if (mode === "timer") startTimer();
  }

  function startChapterPractice() {
    startPractice("mcq");
  }

  /* TIMER */

  function startTimer() {
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      if (quizFinished) {
        clearInterval(timerInterval);
        return;
      }

      remainingTime--;
      updateTimerDisplay();

      if (remainingTime <= 0) finishQuiz(true);
    }, 1000);
  }

  function updateTimerDisplay() {
    const timer = document.getElementById("timerDisplay");
    if (!timer) return;

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    timer.textContent =
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  /* QUIZ RENDERING */

  function renderQuestion() {
    const question = questions[questionIndex];
    const content = document.getElementById("quizContent");

    if (!question || !content) return;

    answered = false;

    const progress = ((questionIndex + 1) / questions.length) * 100;

    content.innerHTML = `
      <button class="back-button" onclick="closeQuiz()">← Exit Quiz</button>

      <div class="quiz-card">
        <div class="quiz-top">
          <span>${currentPractice.toUpperCase()} MODE</span>
          ${
            currentPractice === "timer"
              ? `<span class="timer-display" id="timerDisplay">01:00</span>`
              : `<span>Score: ${score}</span>`
          }
        </div>

        <div class="quiz-progress">
          <div style="width:${progress}%"></div>
        </div>

        <p class="question-count">
          Question ${questionIndex + 1} of ${questions.length}
        </p>

        <h3 class="question-title">${escapeHTML(question.question)}</h3>

        <div class="option-list">
          ${question.options.map((option, index) => `
            <button class="quiz-option" onclick="checkAnswer(${index})">
              <span>${String.fromCharCode(65 + index)}</span>
              ${escapeHTML(option)}
            </button>
          `).join("")}
        </div>

        <div id="answerFeedback"></div>

        <button
          id="nextQuestionButton"
          class="primary-button next-button"
          onclick="nextQuestion()"
          disabled>
          ${questionIndex === questions.length - 1
            ? "See Result →"
            : "Next Question →"}
        </button>
      </div>
    `;

    updateTimerDisplay();
  }

  function checkAnswer(selected) {
    if (answered || quizFinished) return;

    const question = questions[questionIndex];
    if (!question) return;

    answered = true;

    const correct = selected === question.answer;

    if (correct) score++;

    document.querySelectorAll(".quiz-option").forEach((button, index) => {
      button.disabled = true;

      if (index === question.answer) {
        button.classList.add("correct");
      }

      if (index === selected && !correct) {
        button.classList.add("wrong");
      }
    });

    const feedback = document.getElementById("answerFeedback");

    feedback.innerHTML = `
      <div class="answer-feedback ${correct ? "success" : "error"}">
        <strong>${correct ? "✓ সঠিক উত্তর!" : "✕ ভুল উত্তর!"}</strong>
        <p><b>সঠিক উত্তর:</b> ${escapeHTML(question.options[question.answer] ?? "")}</p>
        <p><b>ব্যাখ্যা:</b> ${escapeHTML(question.explanation)}</p>
      </div>
    `;

    const nextButton = document.getElementById("nextQuestionButton");
    if (nextButton) nextButton.disabled = false;
  }

  function nextQuestion() {
    if (!answered || quizFinished) return;

    questionIndex++;

    if (questionIndex >= questions.length) {
      finishQuiz(false);
    } else {
      renderQuestion();
    }
  }

  function finishQuiz(timeUp = false) {
    if (quizFinished) return;

    quizFinished = true;
    clearInterval(timerInterval);

    writeStorage(STORAGE.quiz, getQuizCount() + 1);

    const totalScore =
      Number(readStorage(STORAGE.score, 0)) + score;

    writeStorage(STORAGE.score, totalScore);

    const content = document.getElementById("quizContent");
    const percentage = Math.round((score / questions.length) * 100);

    content.innerHTML = `
      <div class="result-card">
        <div class="result-icon">${percentage >= 70 ? "🏆" : "📚"}</div>
        <h2>${timeUp ? "সময় শেষ!" : "Quiz Completed!"}</h2>
        <div class="result-score">${score}/${questions.length}</div>
        <h3>${percentage}% Correct</h3>
        <p>
          ${
            percentage >= 80
              ? "অসাধারণ! তোমার প্রস্তুতি খুব ভালো।"
              : percentage >= 50
                ? "ভালো চেষ্টা! আরও অনুশীলন করো।"
                : "হাল ছেড়ো না। অধ্যায়টি আবার পড়ো এবং চেষ্টা করো।"
          }
        </p>

        <button class="primary-button" onclick="startPractice('${currentPractice}')">
          Try Again →
        </button>

        <button class="secondary-button" onclick="showPage('practice')">
          Practice Zone
        </button>

        <button class="secondary-button" onclick="showPage('home')">
          Home
        </button>
      </div>
    `;

    updateProgress();
  }

  function closeQuiz() {
    clearInterval(timerInterval);
    quizFinished = true;
    showPage("practice");
  }

  /* PROGRESS */

  function updateProgress() {
    const values = {
      completedCount: getCompleted().length,
      completedCountHome: getCompleted().length,
      savedCount: getSaved().length,
      quizCount: getQuizCount(),
      quizCountHome: getQuizCount()
    };

    Object.entries(values).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });
  }

  function resetProgress() {
    if (!confirm("তুমি কি সত্যিই সব Learning Progress Reset করতে চাও?")) {
      return;
    }

    localStorage.removeItem(STORAGE.saved);
    localStorage.removeItem(STORAGE.completed);
    localStorage.removeItem(STORAGE.quiz);
    localStorage.removeItem(STORAGE.score);

    renderSaved();
    updateProgress();

    alert("Learning Progress Reset হয়েছে।");
  }

  /* SWIPE NAVIGATION */

  function setupSwipe() {
    const pages = ["home", "subjects", "practice", "saved", "profile"];

    let startX = 0;
    let startY = 0;

    document.addEventListener("touchstart", event => {
      const touch = event.changedTouches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    }, { passive: true });

    document.addEventListener("touchend", event => {
      const target = event.target;

      if (target.closest("button,input,textarea,select,a,details,label")) {
        return;
      }

      if (
        document.getElementById("chapterDetailsPage").classList.contains("active") ||
        document.getElementById("quizPage").classList.contains("active")
      ) return;

      const dx = event.changedTouches[0].clientX - startX;
      const dy = event.changedTouches[0].clientY - startY;

      if (Math.abs(dx) < 90 || Math.abs(dx) < Math.abs(dy)) return;

      const active = document.querySelector(".nav-item.active");
      const current = active?.dataset.page || "home";
      const index = pages.indexOf(current);

      if (dx < 0 && index < pages.length - 1) {
        showPage(pages[index + 1]);
      } else if (dx > 0 && index > 0) {
        showPage(pages[index - 1]);
      }
    }, { passive: true });
  }

  /* INITIALIZATION */

  function init() {
    addThemeStyles();

    renderSubjects();
    loadProfile();
    updateProgress();
    renderSaved();

    const savedTheme = readStorage(STORAGE.theme, "dark");
    applyTheme(savedTheme);

    language = readStorage(STORAGE.language, "bn");
    translatePage();

    const profileForm = document.getElementById("studentProfileForm");

    if (profileForm) {
      profileForm.addEventListener("submit", saveProfile);
    }

    setupProfileImage();
    setupSwipe();

    if (!getBanglaChapter()) {
      console.error("অপরিচিতা অধ্যায়ের ডেটা পাওয়া যায়নি।");
    }
  }

  /* GLOBAL FUNCTIONS */

  window.showPage = showPage;
  window.openPaper = openPaper;
  window.openChapterDetails = openChapterDetails;

  window.startPractice = startPractice;
  window.startChapterPractice = startChapterPractice;

  window.toggleSaveCurrent = toggleSaveCurrent;
  window.toggleCompletedCurrent = toggleCompletedCurrent;

  window.checkAnswer = checkAnswer;
  window.nextQuestion = nextQuestion;
  window.closeQuiz = closeQuiz;

  window.resetProgress = resetProgress;

  window.toggleTheme = toggleTheme;
  window.toggleLanguage = toggleLanguage;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
