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

  const ENGLISH_SUBJECTS = {
    "বাংলা ১ম পত্র": "Bangla 1st Paper",
    "বাংলা ২য় পত্র": "Bangla 2nd Paper",
    "ইংরেজি ১ম পত্র": "English 1st Paper",
    "ইংরেজি ২য় পত্র": "English 2nd Paper",
    "তথ্য ও যোগাযোগ প্রযুক্তি": "Information and Communication Technology",
    "পৌরনীতি ১ম পত্র": "Civics 1st Paper",
    "পৌরনীতি ২য় পত্র": "Civics 2nd Paper",
    "অর্থনীতি ১ম পত্র": "Economics 1st Paper",
    "অর্থনীতি ২য় পত্র": "Economics 2nd Paper",
    "ইতিহাস ১ম পত্র": "History 1st Paper",
    "ইতিহাস ২য় পত্র": "History 2nd Paper",
    "ইসলামের ইতিহাস ১ম পত্র": "Islamic History 1st Paper",
    "ইসলামের ইতিহাস ২য় পত্র": "Islamic History 2nd Paper",
    "সমাজবিজ্ঞান ১ম পত্র": "Sociology 1st Paper",
    "সমাজবিজ্ঞান ২য় পত্র": "Sociology 2nd Paper",
    "যুক্তিবিদ্যা ১ম পত্র": "Logic 1st Paper",
    "যুক্তিবিদ্যা ২য় পত্র": "Logic 2nd Paper",
    "ভূগোল ১ম পত্র": "Geography 1st Paper",
    "ভূগোল ২য় পত্র": "Geography 2nd Paper"
  };

  const subjects = Object.keys(ENGLISH_SUBJECTS);
  const icons = ["📘", "📗", "📙", "📕"];

  const PASS_PERCENT = 70;
  const SECONDS_PER_QUESTION = 40;

  let currentChapter = null;
  let currentPractice = "mcq";
  let practiceChapterKey = null;
  let questions = [];
  let questionIndex = 0;
  let score = 0;
  let answered = false;
  let timerInterval = null;
  let remainingTime = 60;
  let quizFinished = true;
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

  function getChapterKey(chapter) {
    return chapter?.id || chapter?.title || "unknown";
  }

  /* All chapters whose "paper" matches a subject name */
  function getChaptersForPaper(paperName) {
    return Object.values(getChapterDatabase())
      .filter(chapter => chapter && chapter.paper === paperName)
      .sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
  }

  /* Question bank: one chapter, or every chapter */
  function getQuestionBank(chapterKey = null) {
    const bank = [];

    Object.values(getChapterDatabase()).forEach(chapter => {
      if (!chapter || !Array.isArray(chapter.mcq)) return;

      const key = getChapterKey(chapter);
      if (chapterKey && key !== chapterKey) return;

      chapter.mcq.forEach(item => bank.push({ ...item, _chapterKey: key }));
    });

    return bank;
  }

  /* LANGUAGE DICTIONARY */

  const translations = {
    "WELCOME TO": "স্বাগতম",
    "Quick Access": "দ্রুত প্রবেশ",
    "EXPLORE": "ঘুরে দেখো",
    "Subjects": "বিষয়সমূহ",
    "Practice": "অনুশীলন",
    "MCQ Practice": "MCQ অনুশীলন",
    "Saved Notes": "সংরক্ষিত নোট",
    "All Subjects": "সকল বিষয়",
    "YOUR STUDY LIBRARY": "তোমার পড়াশোনার লাইব্রেরি",
    "YOUR LEARNING JOURNEY": "তোমার শিক্ষাযাত্রা",
    "CHAPTER LIBRARY": "অধ্যায়ের লাইব্রেরি",
    "Practice Zone": "অনুশীলন কেন্দ্র",
    "TEST YOUR KNOWLEDGE": "নিজের জ্ঞান যাচাই করো",
    "Saved Chapters": "সংরক্ষিত অধ্যায়",
    "YOUR COLLECTION": "তোমার সংগ্রহ",
    "Profile": "প্রোফাইল",
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
    "My Learning Progress": "আমার পড়াশোনার অগ্রগতি",
    "Completed": "সম্পন্ন",
    "Quizzes": "কুইজ",
    "Saved": "সংরক্ষিত",
    "Home": "হোম",
    "Start Learning": "পড়াশোনা শুরু",
    "Timer Quiz": "সময়ভিত্তিক কুইজ",
    "Quick Quiz": "দ্রুত কুইজ",
    "Back to Subjects": "বিষয়ে ফিরে যাও",
    "Back to Chapters": "অধ্যায়ে ফিরে যাও",
    "Chapters": "অধ্যায়সমূহ",
    "Start Practice": "অনুশীলন শুরু",
    "Start Quiz": "কুইজ শুরু",
    "Start Quick Quiz": "দ্রুত কুইজ শুরু",
    "Saved Chapter": "সংরক্ষিত অধ্যায়",
    "Save Chapter": "অধ্যায় সংরক্ষণ",
    "Mark Completed": "সম্পন্ন হিসেবে চিহ্নিত করো",
    "Practice MCQ": "MCQ অনুশীলন",
    "Exit Quiz": "কুইজ থেকে বের হও",
    "Next Question": "পরবর্তী প্রশ্ন",
    "See Result": "ফলাফল দেখো",
    "Quiz Completed!": "কুইজ সম্পন্ন!",
    "Try Again": "আবার চেষ্টা করো",
    "Reset Learning Progress": "পড়াশোনার অগ্রগতি রিসেট",
    "Change Photo": "ছবি পরিবর্তন",
    "HSC Student": "এইচএসসি শিক্ষার্থী",
    "Your Name": "তোমার নাম",
    "Select your board": "বোর্ড নির্বাচন করো",
    "Select your group": "বিভাগ নির্বাচন করো",
    ...ENGLISH_SUBJECTS_REVERSED()
  };

  function ENGLISH_SUBJECTS_REVERSED() {
    return Object.fromEntries(
      Object.entries(ENGLISH_SUBJECTS).map(([bn, en]) => [en, bn])
    );
  }

  const reverseTranslations = Object.fromEntries(
    Object.entries(translations).map(([english, bangla]) => [
      bangla,
      english
    ])
  );

  const originalText = new WeakMap();

  const placeholderTranslations = {
    "তোমার সম্পূর্ণ নাম": "Your full name",
    "তোমার Username": "Your username",
    "নিজের সম্পর্কে কিছু লিখো...": "Write something about yourself...",
    "যেমন: 2027": "Example: 2027",
    "তোমার কলেজের নাম": "Your college name",
    "বোর্ড নির্বাচন করো": "Select your board",
    "গ্রুপ নির্বাচন করো": "Select your group",
    "যেমন: 2025-2026": "Example: 2025-2026",
    "বিষয় খুঁজো...": "Search subjects..."
  };

  function translateValue(value) {
    const trimmed = value.trim();

    if (!trimmed) return value;

    let translated = trimmed;

    if (language === "bn") {
      translated = translations[trimmed] || trimmed;
    } else {
      translated = reverseTranslations[trimmed] || trimmed;
    }

    return value.replace(trimmed, translated);
  }

  function subjectLabel(name) {
    return language === "en" ? (ENGLISH_SUBJECTS[name] || name) : name;
  }

  function translatePage() {
    document.documentElement.lang = language;

    const button = document.getElementById("languageToggle");

    if (button) {
      button.textContent = language === "bn" ? "EN" : "BN";
      button.setAttribute(
        "aria-label",
        language === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন"
      );
    }

    /* Chapter study content and quiz content stay in their original language. */

    const excludedSelectors = [
      "#chapterDetails",
      "#quizContent",
      ".section-content",
      ".discussion-item",
      ".character-item",
      ".vocabulary-item",
      ".cq-card",
      ".revision-item",
      ".stimulus",
      ".tips-list",
      ".question-title",
      ".option-list",
      ".answer-feedback"
    ];

    function isExcluded(node) {
      let element = node.parentElement;

      while (element) {
        if (excludedSelectors.some(selector => element.matches(selector))) {
          return true;
        }
        element = element.parentElement;
      }

      return false;
    }

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
        if (isExcluded(node)) return;

        if (!originalText.has(node)) {
          originalText.set(node, node.nodeValue);
        }

        node.nodeValue = translateValue(originalText.get(node));
      });
    });

    /* Placeholders */

    document.querySelectorAll("[placeholder]").forEach(element => {
      if (!element.dataset.originalPlaceholder) {
        element.dataset.originalPlaceholder = element.placeholder;
      }

      const original = element.dataset.originalPlaceholder;

      if (language === "en") {
        element.placeholder =
          placeholderTranslations[original] || original;
      } else {
        element.placeholder = original;
      }
    });

    /* Profile subtitle */

    const subtitle = document.getElementById("headerUserSubtitle");

    if (subtitle) {
      const profile = getProfile();

      subtitle.textContent = profile.batch
        ? language === "bn"
          ? `এইচএসসি ব্যাচ ${profile.batch}`
          : `HSC Batch ${profile.batch}`
        : language === "bn"
          ? "এইচএসসি শিক্ষার্থী"
          : "HSC Student";
    }
  }

  function toggleLanguage() {
    language = language === "bn" ? "en" : "bn";

    writeStorage(STORAGE.language, language);

    /* Refresh dynamic interface sections. */
    renderSubjects();
    renderSaved();

    const paperTitle = document.getElementById("paperTitle");
    if (paperTitle && paperTitle.dataset.paper) {
      paperTitle.textContent = subjectLabel(paperTitle.dataset.paper);
    }

    if (document.getElementById("chapterPage")?.classList.contains("active") && paperTitle?.dataset.paper) {
      renderChapterList(paperTitle.dataset.paper);
    }

    if (currentChapter && document.getElementById("chapterDetailsPage")?.classList.contains("active")) {
      openChapterDetails(currentChapter.title);
    }

    if (document.getElementById("quizPage")?.classList.contains("active") && !quizFinished) {
      renderQuestion();
    }

    translatePage();
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

  function stopRunningQuiz() {
    clearInterval(timerInterval);
    timerInterval = null;
    quizFinished = true;
  }

  function showPage(pageName) {
    /* Leaving an unfinished quiz stops its timer. */
    if (pageName !== "quiz" && !quizFinished) {
      stopRunningQuiz();
    }

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
    translatePage();
  }

  /* SUBJECTS */

  const SUBJECT_ICONS = [
    ["ইসলামের ইতিহাস", "🕌"],
    ["বাংলা", "📖"],
    ["ইংরেজি", "🔤"],
    ["তথ্য ও যোগাযোগ", "💻"],
    ["পৌরনীতি", "⚖️"],
    ["অর্থনীতি", "📈"],
    ["ইতিহাস", "🏛️"],
    ["সমাজবিজ্ঞান", "👥"],
    ["যুক্তিবিদ্যা", "🧩"],
    ["ভূগোল", "🌍"]
  ];

  function subjectIcon(base) {
    const match = SUBJECT_ICONS.find(([word]) => base.startsWith(word));
    return match ? match[1] : "📘";
  }

  /* Groups "বাংলা ১ম পত্র" + "বাংলা ২য় পত্র" under one card. */
  function groupSubjects() {
    const groups = [];

    subjects.forEach(full => {
      const match = full.match(/^(.*?)\s*([১২]ম পত্র)$/);
      const base = match ? match[1] : full;
      const paper = match ? match[2] : null;

      let group = groups.find(item => item.base === base);

      if (!group) {
        group = { base, items: [] };
        groups.push(group);
      }

      group.items.push({ full, paper });
    });

    return groups;
  }

  function englishBase(base, items) {
    const english = ENGLISH_SUBJECTS[items[0].full] || base;
    return english.replace(/\s*(1st|2nd) Paper$/, "");
  }

  function createSubjectGroup(group) {
    const enBase = englishBase(group.base, group.items);
    const title = language === "en" ? enBase : group.base;
    const search = `${group.base} ${enBase}`.toLowerCase();

    const buttons = group.items.map(({ full, paper }) => {
      const count = getChaptersForPaper(full).length;

      const paperLabel = paper
        ? (language === "en" ? (paper.startsWith("১") ? "1st Paper" : "2nd Paper") : paper)
        : (language === "en" ? "Open" : "খুলুন");

      const status = count
        ? (language === "en" ? `${count} chapter${count > 1 ? "s" : ""}` : `${count}টি অধ্যায়`)
        : (language === "en" ? "Soon" : "শীঘ্রই");

      return `
        <button class="paper-btn ${count ? "ready" : ""}"
          data-paper="${escapeHTML(full)}"
          onclick="openPaper(this.dataset.paper)">
          <span class="paper-name">${escapeHTML(paperLabel)}</span>
          <small class="paper-status">${escapeHTML(status)}</small>
        </button>
      `;
    }).join("");

    return `
      <article class="subject-group" data-search="${escapeHTML(search)}">
        <div class="subject-group-head">
          <span class="subject-badge">${subjectIcon(group.base)}</span>
          <h3>${escapeHTML(title)}</h3>
        </div>
        <div class="paper-row">${buttons}</div>
      </article>
    `;
  }

  function filterSubjects() {
    const input = document.getElementById("subjectSearch");
    const query = (input?.value || "").trim().toLowerCase();
    let visible = 0;

    document.querySelectorAll("#allSubjectList .subject-group").forEach(card => {
      const show = !query || card.dataset.search.includes(query);
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });

    const empty = document.getElementById("subjectEmpty");
    if (empty) empty.style.display = visible ? "none" : "block";
  }

  function renderSubjects() {
    const allList = document.getElementById("allSubjectList");
    if (!allList) return;

    allList.innerHTML = groupSubjects().map(createSubjectGroup).join("") + `
      <div id="subjectEmpty" class="empty-state" style="display:none">
        <h3>${language === "bn" ? "কোনো বিষয় পাওয়া যায়নি" : "No subject found"}</h3>
      </div>
    `;

    filterSubjects();
  }

  function chapterButton(chapter, index) {
    const number = String(chapter.chapterNumber || index + 1).padStart(2, "0");

    return `
      <button class="chapter-item"
        data-chapter="${escapeHTML(chapter.title)}"
        onclick="openChapterDetails(this.dataset.chapter)">
        <span class="chapter-number">${number}</span>
        <span class="chapter-info">
          <h3>${escapeHTML(chapter.title)}</h3>
          <p>${escapeHTML(chapter.author || "")} · ${escapeHTML(chapter.type || "")}</p>
          <span class="content-status">✓ ${language === "bn" ? "সম্পূর্ণ স্টাডি প্যাক" : "Complete Study Pack"}</span>
        </span>
        <span class="subject-arrow">→</span>
      </button>
    `;
  }

  function renderChapterList(name) {
    const list = document.getElementById("chapterList");
    if (!list) return;

    const chapters = getChaptersForPaper(name);

    if (chapters.length) {
      list.innerHTML = `
        ${chapters.map(chapterButton).join("")}

        <div class="coming-soon">
          <h3>${language === "bn" ? "আরও অধ্যায় আসছে" : "More Chapters Coming Soon"}</h3>
          <p>${language === "bn"
            ? "এই বিষয়ের পরবর্তী অধ্যায়গুলো পর্যায়ক্রমে যুক্ত করা হবে।"
            : "More chapters of this subject will be added gradually."}</p>
        </div>
      `;
    } else {
      list.innerHTML = `
        <div class="coming-soon">
          <h3>${language === "bn" ? "এই বিষয়ের অধ্যায় প্রস্তুত হচ্ছে" : "Chapters Are Being Prepared"}</h3>
          <p>${language === "bn"
            ? "এই বিষয়ের বিস্তারিত অধ্যায় ও অনুশীলন শীঘ্রই যুক্ত হবে।"
            : "Detailed chapters and practice for this subject will be added soon."}</p>
        </div>
      `;
    }
  }

  function openPaper(name) {
    currentChapter = null;

    const title = document.getElementById("paperTitle");

    if (title) {
      title.dataset.paper = name;
      title.textContent = subjectLabel(name);
    }

    renderChapterList(name);
    showPage("chapter");
  }

  /* CHAPTER CONTENT */

  /* Turns raw multi-line text into clean paragraphs.
     - blank line  = new paragraph
     - single line breaks inside a paragraph are joined with a space
     - "Label:" lines become small gold tags */
  function formatRichText(text) {
    const clean = String(text ?? "").replace(/\r/g, "").trim();
    if (!clean) return "";

    const isLabel = line => /:$/.test(line) && line.length <= 40;

    return clean.split(/\n\s*\n/).map(block => {
      const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
      if (!lines.length) return "";

      if (lines.length === 1 && isLabel(lines[0])) {
        return `<h5 class="rich-label">${escapeHTML(lines[0].replace(/:$/, ""))}</h5>`;
      }

      if (lines.length >= 2 && isLabel(lines[0])) {
        return `
          <div class="rich-group">
            <span class="rich-tag">${escapeHTML(lines[0].replace(/:$/, ""))}</span>
            <p>${escapeHTML(lines.slice(1).join(" "))}</p>
          </div>`;
      }

      return `<p>${escapeHTML(lines.join(" "))}</p>`;
    }).join("");
  }

  function textBlock(title, content) {
    if (!content) return "";

    return `
      <section class="study-section">
        <h3>${escapeHTML(title)}</h3>
        <div class="rich-text">${formatRichText(content)}</div>
      </section>
    `;
  }

  /* Adds icons, a quick-jump bar and stat chips after the chapter renders. */
  function enhanceChapterDetails(chapter) {
    const root = document.getElementById("chapterDetails");
    if (!root) return;

    const iconMap = [
      ["পাঠ পরিচিতি", "📖", "intro"],
      ["লেখক পরিচিতি", "✍️", "author"],
      ["সারসংক্ষেপ", "🧭", "summary"],
      ["বিষয়বস্তু", "💡", "theme"],
      ["চরিত্র", "👥", "characters"],
      ["বিস্তারিত আলোচনা", "🗂️", "discussion"],
      ["শব্দার্থ", "🔤", "words"],
      ["ব্যাখ্যা", "🧠", "explain"],
      ["MCQ", "🎯", "mcq"],
      ["সৃজনশীল", "📝", "cq"],
      ["Revision", "🔁", "revision"],
      ["টিপস", "⭐", "tips"],
      ["তথ্যসূত্র", "🔗", "source"]
    ];

    const jumpItems = [];

    root.querySelectorAll(".study-section").forEach(section => {
      const heading = section.querySelector(":scope > h3");
      if (!heading) return;

      const text = heading.textContent.trim();
      const match = iconMap.find(([word]) => text.includes(word));
      const icon = match ? match[1] : "✦";
      const id = "sec-" + (match ? match[2] : jumpItems.length);

      section.id = id;
      heading.innerHTML = `<span class="section-icon">${icon}</span><span>${escapeHTML(text)}</span>`;

      const shortLabel = text.replace(/\(.*?\)/g, "").split("—")[0].trim();
      jumpItems.push({ id, icon, label: shortLabel });
    });

    const hero = root.querySelector(".chapter-hero");
    if (!hero) return;

    const stats = [];
    if (chapter.mcq?.length) stats.push(`🎯 ${chapter.mcq.length} MCQ`);
    if (chapter.cq?.length) stats.push(`📝 ${chapter.cq.length} CQ`);
    if ((chapter.vocabulary || []).length) stats.push(`🔤 ${chapter.vocabulary.length} শব্দ`);
    if (chapter.characters?.length) stats.push(`👥 ${chapter.characters.length} চরিত্র`);

    if (stats.length) {
      const chips = document.createElement("div");
      chips.className = "hero-chips";
      chips.innerHTML = stats.map(s => `<span>${escapeHTML(s)}</span>`).join("");
      hero.insertBefore(chips, hero.querySelector(".chapter-actions"));
    }

    if (jumpItems.length > 1) {
      const nav = document.createElement("div");
      nav.className = "jump-bar";
      nav.innerHTML = jumpItems.map(item => `
        <button type="button" data-target="${item.id}">
          ${item.icon} ${escapeHTML(item.label)}
        </button>
      `).join("");

      nav.addEventListener("click", event => {
        const button = event.target.closest("button[data-target]");
        if (!button) return;

        document.getElementById(button.dataset.target)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      hero.insertAdjacentElement("afterend", nav);
    }
  }

  function renderArrayItems(items, type) {
    if (!Array.isArray(items) || !items.length) return "";

    if (type === "discussion" || type === "explanations") {
      return items.map(item => `
        <div class="discussion-item">
          <h4>${escapeHTML(item.heading || "")}</h4>
          <div class="rich-text">${formatRichText(item.details || item.description || "")}</div>
        </div>
      `).join("");
    }

    if (type === "characters") {
      return items.map(item => `
        <div class="character-item">
          <span class="character-avatar">${escapeHTML(String(item.name || "?").trim().charAt(0))}</span>
          <div class="character-body">
            <h4>${escapeHTML(item.name || "")}</h4>
            <div class="rich-text">${formatRichText(item.description || "")}</div>
          </div>
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
      alert(language === "bn"
        ? "এই অধ্যায়ের তথ্য পাওয়া যায়নি।"
        : "Chapter data not found.");
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
        ← ${language === "bn" ? "অধ্যায়ে ফিরে যাও" : "Back to Chapters"}
      </button>

      <div class="chapter-hero">
        <span class="eyebrow">${escapeHTML(chapter.paper || "")}</span>
        <h2>${escapeHTML(chapter.title)}</h2>
        <p>${escapeHTML(chapter.author || "")} · ${escapeHTML(chapter.type || "অধ্যায়")}</p>

        <div class="chapter-actions">
          <button class="secondary-button" onclick="toggleSaveCurrent()">
            ${saved
              ? (language === "bn" ? "🔖 সংরক্ষিত" : "🔖 Saved")
              : (language === "bn" ? "＋ অধ্যায় সংরক্ষণ" : "＋ Save Chapter")}
          </button>
          <button class="secondary-button" onclick="toggleCompletedCurrent()">
            ${completed
              ? (language === "bn" ? "✓ সম্পন্ন" : "✓ Completed")
              : (language === "bn" ? "সম্পন্ন হিসেবে চিহ্নিত করো" : "Mark Completed")}
          </button>
          <button class="primary-button" onclick="startChapterPractice()">
            🎯 ${language === "bn" ? "MCQ অনুশীলন" : "Practice MCQ"}
          </button>
        </div>
      </div>

      ${textBlock("পাঠ পরিচিতি", chapter.introduction || chapter.intro)}
      ${textBlock("লেখক পরিচিতি", chapter.authorInfo)}
      ${textBlock("মূলভাব ও সারসংক্ষেপ", chapter.summary)}
      ${textBlock("মূলভাব / বিষয়বস্তু", chapter.theme)}

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
              <p class="section-content">সব প্রশ্নের অনুশীলনের জন্য MCQ Practice শুরু করো। ${PASS_PERCENT}% বা তার বেশি পেলে অধ্যায়টি নিজে থেকে "সম্পন্ন" হয়ে যাবে।</p>
              <button class="primary-button" onclick="startChapterPractice()">
                ${language === "bn"
                  ? `${chapter.mcq.length}টি MCQ শুরু করো`
                  : `Start ${chapter.mcq.length} MCQ`} →
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

    enhanceChapterDetails(chapter);
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
          <h3>${language === "bn" ? "এখনো কিছু সংরক্ষণ করা হয়নি" : "Nothing Saved Yet"}</h3>
          <p>${language === "bn"
            ? "অধ্যায় থেকে Save Chapter চাপলে এখানে পাবে।"
            : "Save a chapter to see it here."}</p>
        </div>
      `;
      return;
    }

    list.innerHTML = chapters.map(chapter => `
      <button class="chapter-item"
        data-chapter="${escapeHTML(chapter.title)}"
        onclick="openChapterDetails(this.dataset.chapter)">
        <span class="chapter-number">📘</span>
        <span class="chapter-info">
          <h3>${escapeHTML(chapter.title)}</h3>
          <p>${escapeHTML(chapter.author || "")}</p>
          <span class="content-status">${language === "bn" ? "সংরক্ষিত অধ্যায়" : "Saved Chapter"}</span>
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

    updateHeaderProfile(profile);
  }

  function updateHeaderProfile(profile = getProfile()) {
    const name = profile.name || (language === "bn" ? "তোমার নাম" : "Your Name");

    const batch = profile.batch
      ? language === "bn"
        ? `এইচএসসি ব্যাচ ${profile.batch}`
        : `HSC Batch ${profile.batch}`
      : language === "bn"
        ? "এইচএসসি শিক্ষার্থী"
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
      alert(language === "bn"
        ? "Profile Save করা যায়নি। Browser storage পূর্ণ হতে পারে।"
        : "Could not save the profile. Browser storage may be full.");
      return;
    }

    updateHeaderProfile(profile);
    alert(language === "bn"
      ? "তোমার Profile সফলভাবে Save হয়েছে! ❤️"
      : "Your profile has been saved successfully! ❤️");
  }

  function setupProfileImage() {
    const input = document.getElementById("profileImageInput");
    if (!input) return;

    input.addEventListener("change", event => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert(language === "bn" ? "একটি ছবি নির্বাচন করো।" : "Please select an image.");
        return;
      }

      if (file.size > 8 * 1024 * 1024) {
        alert(language === "bn"
          ? "ছবির সাইজ 8 MB-এর কম রাখো।"
          : "Please keep the image under 8 MB.");
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
            alert(language === "bn"
              ? "ছবিটি Save করা যায়নি। ছোট সাইজের ছবি চেষ্টা করো।"
              : "Could not save the image. Try a smaller image.");
            return;
          }

          updateHeaderProfile(profile);
          alert(language === "bn"
            ? "Profile Picture Update হয়েছে! ❤️"
            : "Profile picture updated! ❤️");
        };

        image.onerror = () => alert(
          language === "bn"
            ? "ছবিটি খোলা যায়নি। অন্য ছবি চেষ্টা করো।"
            : "Could not open the image. Try another one."
        );

        image.src = reader.result;
      };

      reader.readAsDataURL(file);
    });
  }

  /* DARK AND LIGHT MODE */

  function applyTheme(theme) {
    const selectedTheme = theme === "light" ? "light" : "dark";

    document.body.classList.toggle(
      "light-mode",
      selectedTheme === "light"
    );

    const button = document.getElementById("themeToggle");

    if (button) {
      button.textContent = selectedTheme === "light" ? "☀️" : "🌙";
      button.setAttribute(
        "aria-label",
        selectedTheme === "light" ? "Switch to dark mode" : "Switch to light mode"
      );
    }

    const meta = document.querySelector('meta[name="theme-color"]');

    if (meta) {
      meta.content = selectedTheme === "light"
        ? "#f4f7f5"
        : "#071512";
    }

    writeStorage(STORAGE.theme, selectedTheme);
  }

  function toggleTheme() {
    const isLight = document.body.classList.contains("light-mode");
    applyTheme(isLight ? "dark" : "light");
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
        "এই প্রশ্নের অতিরিক্ত ব্যাখ্যা দেওয়া হয়নি।",
      chapterKey: question._chapterKey || null
    };
  }

  function startPractice(mode = "mcq", chapterKey = null) {
    /* Practice started from Home / Practice page uses every chapter. */
    practiceChapterKey = chapterKey;

    const bank = getQuestionBank(chapterKey);

    if (!bank.length) {
      alert(language === "bn"
        ? "এখনো কোনো অধ্যায়ের MCQ পাওয়া যায়নি।"
        : "No chapter MCQs are available yet.");
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
    } else {
      questions = shuffled;
    }

    if (!questions.length) {
      alert(language === "bn" ? "প্রশ্ন পাওয়া যায়নি।" : "No questions found.");
      quizFinished = true;
      return;
    }

    /* 40 seconds per question */
    remainingTime = questions.length * SECONDS_PER_QUESTION;

    clearInterval(timerInterval);
    timerInterval = null;

    showPage("quiz");
    renderQuestion();

    if (mode === "timer") startTimer();
  }

  function startChapterPractice() {
    startPractice(
      "mcq",
      currentChapter ? getChapterKey(currentChapter) : null
    );
  }

  /* TIMER */

  function startTimer() {
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      if (quizFinished) {
        clearInterval(timerInterval);
        timerInterval = null;
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

    const safeTime = Math.max(remainingTime, 0);
    const minutes = Math.floor(safeTime / 60);
    const seconds = safeTime % 60;

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
      <button class="back-button" onclick="closeQuiz()">← ${language === "bn" ? "কুইজ থেকে বের হও" : "Exit Quiz"}</button>

      <div class="quiz-card">
        <div class="quiz-top">
          <span>${currentPractice.toUpperCase()} ${language === "bn" ? "মোড" : "MODE"}</span>
          ${
            currentPractice === "timer"
              ? `<span class="timer-display" id="timerDisplay">00:00</span>`
              : `<span>${language === "bn" ? "স্কোর" : "Score"}: ${score}</span>`
          }
        </div>

        <div class="quiz-progress">
          <div style="width:${progress}%"></div>
        </div>

        <p class="question-count">
          ${language === "bn" ? "প্রশ্ন" : "Question"} ${questionIndex + 1}
          ${language === "bn" ? "এর মধ্যে" : "of"} ${questions.length}
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
            ? (language === "bn" ? "ফলাফল দেখো →" : "See Result →")
            : (language === "bn" ? "পরবর্তী প্রশ্ন →" : "Next Question →")}
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
        <strong>${correct
          ? (language === "bn" ? "✓ সঠিক উত্তর!" : "✓ Correct Answer!")
          : (language === "bn" ? "✕ ভুল উত্তর!" : "✕ Wrong Answer!")}</strong>
        <p><b>${language === "bn" ? "সঠিক উত্তর:" : "Correct Answer:"}</b> ${escapeHTML(question.options[question.answer] ?? "")}</p>
        <p><b>${language === "bn" ? "ব্যাখ্যা:" : "Explanation:"}</b> ${escapeHTML(question.explanation)}</p>
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

  /* Mark the chapter completed when the quiz was for one chapter and score is high enough. */
  function autoCompleteChapter(percentage) {
    if (percentage < PASS_PERCENT) return false;
    if (questions.length < 5) return false;

    const keys = [...new Set(questions.map(q => q.chapterKey).filter(Boolean))];

    if (keys.length !== 1) return false;

    const key = keys[0];
    const completed = getCompleted();

    if (completed.includes(key)) return false;

    writeStorage(STORAGE.completed, [...completed, key]);
    return true;
  }

  function finishQuiz(timeUp = false) {
    if (quizFinished) return;

    quizFinished = true;
    clearInterval(timerInterval);
    timerInterval = null;

    writeStorage(STORAGE.quiz, getQuizCount() + 1);

    const totalScore =
      Number(readStorage(STORAGE.score, 0)) + score;

    writeStorage(STORAGE.score, totalScore);

    const content = document.getElementById("quizContent");
    const percentage = Math.round((score / questions.length) * 100);

    const justCompleted = autoCompleteChapter(percentage);

    content.innerHTML = `
      <div class="result-card">
        <div class="result-icon">${percentage >= PASS_PERCENT ? "🏆" : "📚"}</div>
        <h2>${timeUp
          ? (language === "bn" ? "সময় শেষ!" : "Time's Up!")
          : (language === "bn" ? "কুইজ সম্পন্ন!" : "Quiz Completed!")}</h2>
        <div class="result-score">${score}/${questions.length}</div>
        <h3>${percentage}% ${language === "bn" ? "সঠিক" : "Correct"}</h3>
        <p>
          ${
            percentage >= 80
              ? (language === "bn"
                  ? "অসাধারণ! তোমার প্রস্তুতি খুব ভালো।"
                  : "Excellent! Your preparation is very good.")
              : percentage >= 50
                ? (language === "bn"
                    ? "ভালো চেষ্টা! আরও অনুশীলন করো।"
                    : "Good effort! Keep practising.")
                : (language === "bn"
                    ? "হাল ছেড়ো না। অধ্যায়টি আবার পড়ো এবং চেষ্টা করো।"
                    : "Don't give up. Review the chapter and try again.")
          }
        </p>

        ${
          justCompleted
            ? `<p>✓ ${language === "bn"
                ? "অধ্যায়টি সম্পন্ন হিসেবে চিহ্নিত হয়েছে!"
                : "Chapter marked as completed!"}</p>`
            : ""
        }

        <button class="primary-button"
          onclick="startPractice('${currentPractice}', ${practiceChapterKey ? "'" + String(practiceChapterKey).replace(/'/g, "\\'") + "'" : "null"})">
          ${language === "bn" ? "আবার চেষ্টা করো" : "Try Again"} →
        </button>

        <button class="secondary-button" onclick="showPage('practice')">
          ${language === "bn" ? "অনুশীলন কেন্দ্র" : "Practice Zone"}
        </button>

        <button class="secondary-button" onclick="showPage('home')">
          ${language === "bn" ? "হোম" : "Home"}
        </button>
      </div>
    `;

    updateProgress();
  }

  function closeQuiz() {
    stopRunningQuiz();
    showPage("practice");
  }

  /* PROGRESS */

  function updateProgress() {
    const completedCount = getCompleted().length;
    const quizCount = getQuizCount();

    const values = {
      completedCount: completedCount,
      completedCountHome: completedCount,
      savedCount: getSaved().length,
      quizCount: quizCount,
      quizCountHome: quizCount
    };

    Object.entries(values).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });
  }

  function resetProgress() {
    if (!confirm(language === "bn"
      ? "তুমি কি সত্যিই সব Learning Progress Reset করতে চাও?"
      : "Are you sure you want to reset all learning progress?")) {
      return;
    }

    localStorage.removeItem(STORAGE.saved);
    localStorage.removeItem(STORAGE.completed);
    localStorage.removeItem(STORAGE.quiz);
    localStorage.removeItem(STORAGE.score);

    renderSaved();
    updateProgress();

    alert(language === "bn"
      ? "Learning Progress Reset হয়েছে।"
      : "Learning progress has been reset.");
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

      const detailsPage = document.getElementById("chapterDetailsPage");
      const quizPage = document.getElementById("quizPage");

      if (
        detailsPage?.classList.contains("active") ||
        quizPage?.classList.contains("active")
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
    language = readStorage(STORAGE.language, "bn");

    renderSubjects();
    loadProfile();
    updateProgress();
    renderSaved();

    const savedTheme = readStorage(STORAGE.theme, "dark");
    applyTheme(savedTheme);

    const profileForm = document.getElementById("studentProfileForm");

    if (profileForm) {
      profileForm.addEventListener("submit", saveProfile);
    }

    document.getElementById("subjectSearch")
      ?.addEventListener("input", filterSubjects);

    setupProfileImage();
    setupSwipe();

    if (!Object.keys(getChapterDatabase()).length) {
      console.error("কোনো অধ্যায়ের ডেটা পাওয়া যায়নি।");
    }

    translatePage();
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
