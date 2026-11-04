"use strict";

// ======================================
// EDU VERSE - REAL HSC CHAPTER LIBRARY
// BANGLA 1ST PAPER
// ======================================

const pageNames = [
  "home",
  "subjects",
  "practice",
  "saved",
  "profile",
  "chapter"
];

// ======================================
// BANGLA 1ST PAPER - GADYA (18)
// ======================================

const bangla1Gadya = [
  { title: "অপরিচিতা", author: "রবীন্দ্রনাথ ঠাকুর" },
  { title: "বিলাসী", author: "শরৎচন্দ্র চট্টোপাধ্যায়" },
  { title: "আহ্বান", author: "বিভূতিভূষণ বন্দ্যোপাধ্যায়" },
  { title: "মাসি-পিসি", author: "মানিক বন্দ্যোপাধ্যায়" },
  { title: "একটি তুলসী গাছের কাহিনী", author: "সৈয়দ ওয়ালীউল্লাহ্" },
  { title: "রেইনকোট", author: "আখতারুজ্জামান ইলিয়াস" },
  { title: "নেকলেস", author: "গী দ্য মোপাসাঁ" },
  { title: "আত্মচরিত", author: "ঈশ্বরচন্দ্র বিদ্যাসাগর" },
  { title: "বাঙ্গালার নব্য লেখকদিগের প্রতি নিবেদন", author: "বঙ্কিমচন্দ্র চট্টোপাধ্যায়" },
  { title: "কারবালা-প্রান্তর", author: "মীর মশাররফ হোসেন" },
  { title: "সাহিত্যে খেলা", author: "প্রমথ চৌধুরী" },
  { title: "অর্ধাঙ্গী", author: "রোকেয়া সাখাওয়াত হোসেন" },
  { title: "শিক্ষাচিন্তা", author: "কাজী আবদুল ওদুদ" },
  { title: "ভুলের মূল্য", author: "কাজী মোতাহার হোসেন" },
  { title: "যৌবনের গান", author: "কাজী নজরুল ইসলাম" },
  { title: "জীবন ও বৃক্ষ", author: "মোতাহার হোসেন চৌধুরী" },
  { title: "মানব-কল্যাণ", author: "আবুল ফজল" },
  { title: "জাদুঘরে কেন যাব", author: "আনিসুজ্জামান" }
];

// ======================================
// BANGLA 1ST PAPER - KOBITA (28)
// ======================================

const bangla1Kobita = [
  { title: "ফুল্লরার বারোমাস্যা", author: "মুকুন্দরাম চক্রবর্তী" },
  { title: "ঋতু বর্ণনা", author: "আলাওল" },
  { title: "স্বদেশ", author: "ঈশ্বরচন্দ্র গুপ্ত" },
  { title: "বিভীষণের প্রতি মেঘনাদ", author: "মাইকেল মধুসূদন দত্ত" },
  { title: "সুখ", author: "কায়কোবাদ" },
  { title: "মানব-বন্দনা", author: "অক্ষয়কুমার বড়াল" },
  { title: "সোনার তরী", author: "রবীন্দ্রনাথ ঠাকুর" },
  { title: "ঐকতান", author: "রবীন্দ্রনাথ ঠাকুর" },
  { title: "নবান্ন", author: "যতীন্দ্রনাথ সেনগুপ্ত" },
  { title: "বিদ্রোহী", author: "কাজী নজরুল ইসলাম" },
  { title: "সাম্যবাদী", author: "কাজী নজরুল ইসলাম" },
  { title: "সুচেতনা", author: "জীবনানন্দ দাশ" },
  { title: "প্রতিদান", author: "জসীমউদ্দীন" },
  { title: "তাহারই পড়ে মনে", author: "সুফিয়া কামাল" },
  { title: "আগে কী সুন্দর দিন কাটাইতাম", author: "শাহ আব্দুল করিম" },
  { title: "সেই অস্ত্র", author: "আহসান হাবীব" },
  { title: "পদ্মা", author: "ফররুখ আহমদ" },
  { title: "আলো চাই", author: "সিকান্দার আবু জাফর" },
  { title: "আঠারো বছর বয়স", author: "সুকান্ত ভট্টাচার্য" },
  { title: "ফেব্রুয়ারি ১৯৬৯", author: "শামসুর রাহমান" },
  { title: "হাড়", author: "আলাউদ্দিন আল আজাদ" },
  { title: "তোমার আপন পতাকা", author: "হাসান হাফিজুর রহমান" },
  { title: "আমি কিংবদন্তির কথা বলছি", author: "আবু জাফর ওবায়দুল্লাহ" },
  { title: "নূরলদীনের কথা মনে পড়ে যায়", author: "সৈয়দ শামসুল হক" },
  { title: "ছবি", author: "আবু হেনা মোস্তফা কামাল" },
  { title: "প্রত্যাবর্তনের লজ্জা", author: "আল মাহমুদ" },
  { title: "ভূমিহীন কৃষিজীবী ইচ্ছে তার", author: "মোহাম্মদ মনিরুজ্জামান" },
  { title: "ব্ল্যাক-আউটের পূর্ণিমায়", author: "শহীদ কাদরী" }
];

// ======================================
// PAGE NAVIGATION
// ======================================

function showPage(name, button) {
  pageNames.forEach(page => {
    const element = document.getElementById(page + "Page");

    if (element) {
      element.classList.remove("active");
    }
  });

  const target = document.getElementById(name + "Page");

  if (target) {
    target.classList.add("active");
  }

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
  });

  if (button) {
    button.classList.add("active");
  } else {
    const index = [
      "home",
      "subjects",
      "practice",
      "saved",
      "profile"
    ].indexOf(name);

    const navItems = document.querySelectorAll(".nav-item");

    if (index !== -1 && navItems[index]) {
      navItems[index].classList.add("active");
    }
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// ======================================
// OPEN PAPER
// ======================================

function openPaper(name) {
  const title = document.getElementById("paperTitle");
  const chapterList = document.getElementById("chapterList");

  if (!title || !chapterList) return;

  title.textContent = name;
  chapterList.innerHTML = "";

  const normalizedName = name
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  const isBanglaFirst =
    normalizedName.includes("বাংলা") &&
    (
      normalizedName.includes("১ম") ||
      normalizedName.includes("প্রথম") ||
      normalizedName.includes("1st")
    );

  if (isBanglaFirst) {
    renderChapterSection(chapterList, "গদ্য", bangla1Gadya);
    renderChapterSection(chapterList, "কবিতা", bangla1Kobita);
  } else {
    const message = document.createElement("div");
    message.className = "chapter";
    message.textContent =
      "এই পত্রের অধ্যায় তালিকা পর্যায়ক্রমে যুক্ত করা হবে।";

    chapterList.appendChild(message);
  }

  showPage("chapter");
}

// ======================================
// RENDER CHAPTERS
// ======================================

function renderChapterSection(container, sectionTitle, chapters) {
  const heading = document.createElement("h3");

  heading.textContent =
    sectionTitle + " (" + chapters.length + ")";

  heading.style.margin = "20px 0 12px";

  container.appendChild(heading);

  chapters.forEach((chapter, index) => {
    const item = document.createElement("div");

    item.className = "chapter";

    item.innerHTML = `
      <div>
        <strong>${index + 1}. ${escapeHTML(chapter.title)}</strong>
        <small style="display:block;opacity:.7;margin-top:5px">
          ${sectionTitle === "গদ্য" ? "লেখক" : "কবি"}:
          ${escapeHTML(chapter.author)}
        </small>
      </div>
      <span>›</span>
    `;

    item.addEventListener("click", () => {
      openChapterDetails(chapter, sectionTitle);
    });

    container.appendChild(item);
  });
}

// ======================================
// CHAPTER DETAILS
// ======================================

function openChapterDetails(chapter, section) {
  let detailPage = document.getElementById("chapterDetailsPage");

  if (!detailPage) {
    detailPage = document.createElement("section");
    detailPage.id = "chapterDetailsPage";
    detailPage.className = "page";

    document.body.appendChild(detailPage);
  }

  const writer = section === "গদ্য" ? "লেখক" : "কবি";

  const topics = [
    "পাঠ পরিচিতি",
    writer + " পরিচিতি",
    "মূলভাব",
    "বিস্তারিত আলোচনা",
    "গুরুত্বপূর্ণ শব্দার্থ",
    "MCQ অনুশীলন",
    "CQ প্রস্তুতি"
  ];

  detailPage.innerHTML = `
    <div style="
      padding:18px;
      min-height:100vh;
      background:var(--bg,#071512);
      color:var(--text,#ffffff);
    ">

      <button onclick="closeChapterDetails()" style="
        padding:10px 16px;
        border:0;
        border-radius:10px;
        margin-bottom:20px;
        cursor:pointer;
      ">← ফিরে যাও</button>

      <div style="
        padding:20px;
        border-radius:16px;
        background:var(--card,#10241f);
        margin-bottom:20px;
      ">
        <small>${escapeHTML(section)}</small>
        <h2 style="margin:10px 0">
          ${escapeHTML(chapter.title)}
        </h2>
        <p>${writer}: ${escapeHTML(chapter.author)}</p>
      </div>

      <div id="chapterTopicList"></div>

      <p style="
        opacity:.7;
        font-size:13px;
        margin-top:20px;
        line-height:1.7;
      ">
        এই পাঠের নির্ভুল ও বিস্তারিত শিক্ষাসামগ্রী
        পর্যায়ক্রমে যুক্ত করা হবে। এখানে মূল বইয়ের
        হুবহু কপি নয়, নিজস্ব ব্যাখ্যা, সারাংশ,
        শব্দার্থ, অনুশীলনী MCQ ও CQ থাকবে।
      </p>

    </div>
  `;

  const topicList = detailPage.querySelector("#chapterTopicList");

  topics.forEach(topic => {
    const box = document.createElement("div");

    box.style.cssText = `
      padding:16px;
      margin-bottom:10px;
      border-radius:12px;
      background:var(--card,#10241f);
      border:1px solid rgba(255,255,255,.07);
    `;

    box.innerHTML = `
      <strong>${escapeHTML(topic)}</strong>
      <p style="opacity:.65;font-size:13px;margin-top:7px">
        বিস্তারিত কনটেন্ট প্রস্তুত করা হচ্ছে।
      </p>
    `;

    topicList.appendChild(box);
  });

  pageNames.forEach(page => {
    const element = document.getElementById(page + "Page");

    if (element) {
      element.classList.remove("active");
    }
  });

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
  });

  detailPage.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// ======================================
// CLOSE CHAPTER DETAILS
// ======================================

function closeChapterDetails() {
  const detailPage = document.getElementById("chapterDetailsPage");

  if (detailPage) {
    detailPage.classList.remove("active");
  }

  showPage("chapter");
}

// ======================================
// SAFE TEXT
// ======================================

function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, character => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character];
  });
}

// ======================================
// SUBJECT SEARCH
// ======================================

function filterSubjects() {
  const searchInput = document.getElementById("searchInput");
  const emptyMessage = document.getElementById("empty");

  if (!searchInput || !emptyMessage) return;

  const query = searchInput.value.trim().toLowerCase();

  let visible = 0;

  document.querySelectorAll("#subjectList .paper").forEach(item => {
    const dataName = item.dataset.name || "";
    const text = (dataName + " " + item.innerText).toLowerCase();

    const match = text.includes(query);

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

  emptyMessage.style.display = visible > 0 ? "none" : "block";
}
