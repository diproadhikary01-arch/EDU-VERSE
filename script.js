
"use strict";

// EDU VERSE - Page Navigation

const pageNames = [
  "home",
  "subjects",
  "practice",
  "saved",
  "profile",
  "chapter"
];

function showPage(name, button) {
  // Hide all pages
  pageNames.forEach(page => {
    const element = document.getElementById(page + "Page");

    if (element) {
      element.classList.remove("active");
    }
  });

  // Show selected page
  const target = document.getElementById(name + "Page");

  if (target) {
    target.classList.add("active");
  }

  // Update bottom navigation
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach(item => {
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

    if (index !== -1 && navItems[index]) {
      navItems[index].classList.add("active");
    }
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// Open Subject Paper

function openPaper(name) {
  const title = document.getElementById("paperTitle");
  const chapterList = document.getElementById("chapterList");

  if (!title || !chapterList) return;

  title.textContent = name;
  chapterList.innerHTML = "";

  // Temporary demo chapters
  for (let i = 1; i <= 10; i++) {
    const item = document.createElement("div");

    item.className = "chapter";
    item.textContent = "অধ্যায় " + i + " — " + name;

    chapterList.appendChild(item);
  }

  showPage("chapter");
}


// Subject Search

function filterSubjects() {
  const searchInput = document.getElementById("searchInput");
  const emptyMessage = document.getElementById("empty");

  if (!searchInput || !emptyMessage) return;

  const query = searchInput.value.trim().toLowerCase();

  let visible = 0;

  // Search individual papers
  document.querySelectorAll("#subjectList .paper").forEach(item => {
    const dataName = item.dataset.name || "";
    const text = (dataName + " " + item.innerText).toLowerCase();

    const match = text.includes(query);

    item.style.display = match ? "flex" : "none";

    if (match) {
      visible++;
    }
  });

  // Hide empty subject groups
  document.querySelectorAll("#subjectList .subject-group").forEach(group => {
    const papers = group.querySelectorAll(".paper");

    const hasMatch = Array.from(papers).some(
      item => item.style.display !== "none"
    );

    group.style.display = hasMatch ? "block" : "none";
  });

  // Show empty message when no result
  emptyMessage.style.display = visible > 0 ? "none" : "block";
}
