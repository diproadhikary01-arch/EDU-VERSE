
"use strict";

/* =========================================
   EDU VERSE — PREMIUM LEARNING SYSTEM
   BANGLA 1ST PAPER + QUIZ SYSTEM
========================================= */

const pageNames = [
  "home", "subjects", "practice",
  "saved", "profile", "chapter"
];

const STORAGE = {
  saved: "eduVerseSaved",
  completed: "eduVerseCompleted",
  quiz: "eduVerseQuizCount",
  score: "eduVerseQuizScore"
};

let currentChapter = null;
let currentPractice = [];
let currentQuestion = 0;
let currentScore = 0;
let quizAnswered = false;

let currentMode = "mcq";
let quizTimer = null;
let timeLeft = 60;
let quizResultSaved = false;

/* =========================================
   STORAGE & HELPERS
========================================= */

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

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

/* =========================================
   BANGLA 1ST PAPER — GADYA
========================================= */

const bangla1Gadya = [
  {
    title: "অপরিচিতা",
    author: "রবীন্দ্রনাথ ঠাকুর",
    intro: "রবীন্দ্রনাথ ঠাকুরের একটি উল্লেখযোগ্য ছোটগল্প। গল্পে বিবাহ, আত্মমর্যাদা, সামাজিক মর্যাদাবোধ ও ব্যক্তিত্বের সংঘাত ফুটে উঠেছে।",
    authorInfo: "রবীন্দ্রনাথ ঠাকুর বাংলা সাহিত্যের বিশ্বখ্যাত কবি, কথাসাহিত্যিক, নাট্যকার ও প্রাবন্ধিক। ১৯১৩ সালে গীতাঞ্জলির জন্য সাহিত্যে নোবেল পুরস্কার লাভ করেন।",
    theme: "মানুষের প্রকৃত মর্যাদা অর্থ-সম্পদে নয়, বরং ব্যক্তিত্ব, আত্মসম্মান ও মানবিক মূল্যবোধে।",
    discussion: "গল্পটিতে বিবাহকে কেন্দ্র করে সামাজিক অহংকার, যৌতুকপ্রথা ও আত্মমর্যাদার প্রশ্ন সামনে এসেছে। চরিত্রগুলোর সিদ্ধান্তের মধ্য দিয়ে ব্যক্তিত্বের দৃঢ়তা ও সামাজিক সংকীর্ণতার পার্থক্য প্রকাশিত হয়েছে।",
    words: [
      ["অপরিচিতা", "যাকে আগে থেকে চেনা যায়নি"],
      ["আত্মমর্যাদা", "নিজের সম্মানবোধ"],
      ["অহংকার", "নিজেকে অন্যের চেয়ে বড় মনে করা"]
    ],
    mcq: [
      {
        question: "অপরিচিতা গল্পের রচয়িতা কে?",
        options: ["শরৎচন্দ্র চট্টোপাধ্যায়", "রবীন্দ্রনাথ ঠাকুর", "বঙ্কিমচন্দ্র চট্টোপাধ্যায়", "মানিক বন্দ্যোপাধ্যায়"],
        answer: 1,
        explanation: "অপরিচিতা গল্পটি রবীন্দ্রনাথ ঠাকুরের রচনা।"
      },
      {
        question: "গল্পটির অন্যতম প্রধান বিষয় কোনটি?",
        options: ["প্রকৃতিপ্রেম", "আত্মমর্যাদা", "যুদ্ধ", "কৃষিজীবন"],
        answer: 1,
        explanation: "গল্পে আত্মমর্যাদা ও সামাজিক অহংকারের বিষয়টি বিশেষভাবে উঠে এসেছে।"
      }
    ],
    cq: [
      {
        question: "অপরিচিতা গল্পে আত্মমর্যাদার গুরুত্ব আলোচনা করো।",
        hint: "চরিত্রের সিদ্ধান্ত, সামাজিক অহংকার ও ব্যক্তিত্বের দৃঢ়তার আলোকে উত্তর তৈরি করো।"
      }
    ]
  },
  {
    title: "বিলাসী",
    author: "শরৎচন্দ্র চট্টোপাধ্যায়",
    intro: "বিলাসী একটি মানবিক ছোটগল্প। এতে প্রেম, জাতিভেদ, কুসংস্কার ও মানুষের প্রতি মানুষের দায়িত্ববোধের পরিচয় পাওয়া যায়।",
    authorInfo: "শরৎচন্দ্র চট্টোপাধ্যায় বাংলা সাহিত্যের জনপ্রিয় কথাসাহিত্যিক। তাঁর রচনায় সমাজের অবহেলিত মানুষ, মানবিক সম্পর্ক ও সামাজিক অসংগতি গুরুত্ব পেয়েছে।",
    theme: "মানুষের পরিচয় তার মানবিকতায়; জাতি ও সামাজিক পরিচয়ের ভিত্তিতে মানুষকে বিচার করা উচিত নয়।",
    discussion: "গল্পে বিলাসী ও মৃত্যুঞ্জয়ের জীবনঘনিষ্ঠ সম্পর্কের মাধ্যমে সমাজের জাতিভেদ ও কুসংস্কারের নির্মমতা প্রকাশিত হয়েছে। মানবিক ভালোবাসা ও সামাজিক বাধার সংঘাত গল্পটির গুরুত্বপূর্ণ দিক।",
    words: [
      ["বিলাসী", "গল্পের প্রধান নারী চরিত্রের নাম"],
      ["কুসংস্কার", "অযৌক্তিক প্রচলিত বিশ্বাস"],
      ["জাতিভেদ", "জাতির ভিত্তিতে মানুষের মধ্যে বিভাজন"]
    ],
    mcq: [
      {
        question: "বিলাসী গল্পের লেখক কে?",
        options: ["রবীন্দ্রনাথ ঠাকুর", "শরৎচন্দ্র চট্টোপাধ্যায়", "বিভূতিভূষণ বন্দ্যোপাধ্যায়", "প্রমথ চৌধুরী"],
        answer: 1,
        explanation: "বিলাসী গল্পের রচয়িতা শরৎচন্দ্র চট্টোপাধ্যায়।"
      },
      {
        question: "গল্পটির অন্যতম প্রধান বিষয় কী?",
        options: ["জাতিভেদ ও মানবিকতা", "রাজনীতি", "প্রকৃতির সৌন্দর্য", "শিল্পবিপ্লব"],
        answer: 0,
        explanation: "গল্পে জাতিভেদ, কুসংস্কার ও মানবিক সম্পর্কের সংঘাত ফুটে উঠেছে।"
      }
    ],
    cq: [
      {
        question: "বিলাসী গল্পে মানবিকতার পরিচয় ব্যাখ্যা করো।",
        hint: "বিলাসীর আচরণ, ভালোবাসা ও সামাজিক বাধার বিষয়গুলো উল্লেখ করো।"
      }
    ]
  },
  {
    title: "আহ্বান",
    author: "বিভূতিভূষণ বন্দ্যোপাধ্যায়",
    intro: "আহ্বান গল্পে মানবিক সম্পর্ক, মমত্ববোধ ও মানুষের অন্তর্গত অনুভূতির পরিচয় পাওয়া যায়।",
    authorInfo: "বিভূতিভূষণ বন্দ্যোপাধ্যায় বাংলা কথাসাহিত্যের অন্যতম প্রধান লেখক। প্রকৃতি, গ্রামীণ জীবন ও সাধারণ মানুষের অনুভূতি তাঁর সাহিত্যের উল্লেখযোগ্য বৈশিষ্ট্য।",
    theme: "মানুষের প্রতি আন্তরিকতা, মমতা ও হৃদয়ের টান সামাজিক দূরত্ব অতিক্রম করতে পারে।",
    discussion: "গল্পটির পাঠে মানুষের আবেগ, সম্পর্ক ও মমত্ববোধের দিকগুলো গুরুত্ব পায়। নির্দিষ্ট ঘটনা ও চরিত্রের ব্যাখ্যা মূল পাঠের সঙ্গে মিলিয়ে পড়তে হবে।",
    words: [
      ["আহ্বান", "ডাক বা আমন্ত্রণ"],
      ["মমত্ব", "স্নেহ ও ভালোবাসার অনুভূতি"],
      ["আন্তরিকতা", "হৃদয় থেকে আসা নিষ্ঠা"]
    ],
    mcq: [
      {
        question: "আহ্বান গল্পের লেখক কে?",
        options: ["বিভূতিভূষণ বন্দ্যোপাধ্যায়", "শরৎচন্দ্র চট্টোপাধ্যায়", "মানিক বন্দ্যোপাধ্যায়", "আবুল ফজল"],
        answer: 0,
        explanation: "আহ্বান গল্পের লেখক বিভূতিভূষণ বন্দ্যোপাধ্যায়।"
      }
    ],
    cq: [
      {
        question: "আহ্বান গল্পের মানবিক আবেদন ব্যাখ্যা করো।",
        hint: "গল্পের মূল ঘটনা ও চরিত্রের আচরণের আলোকে উত্তর দাও।"
      }
    ]
  },
  {
    title: "মাসি-পিসি",
    author: "মানিক বন্দ্যোপাধ্যায়",
    intro: "মাসি-পিসি গল্পে নারীর জীবনসংগ্রাম, পারিবারিক দায়িত্ব ও প্রতিকূলতার বিরুদ্ধে টিকে থাকার বিষয়টি উঠে এসেছে।",
    authorInfo: "মানিক বন্দ্যোপাধ্যায় বাংলা সাহিত্যের গুরুত্বপূর্ণ কথাসাহিত্যিক। তাঁর রচনায় সমাজবাস্তবতা, মানুষের মনস্তত্ত্ব ও অর্থনৈতিক সংকটের প্রতিফলন দেখা যায়।",
    theme: "প্রতিকূল পরিস্থিতিতেও সাহস, দায়িত্ববোধ ও সংগ্রামী মনোভাব মানুষের বেঁচে থাকার শক্তি জোগায়।",
    discussion: "গল্পে নারী চরিত্রের সংগ্রাম ও পারিবারিক দায়িত্বের বিষয়টি গুরুত্বপূর্ণ। চরিত্রগুলোর জীবনযাপন ও সিদ্ধান্তের মধ্য দিয়ে সমাজবাস্তবতার পরিচয় পাওয়া যায়।",
    words: [
      ["প্রতিকূলতা", "বিরূপ বা বাধাপূর্ণ অবস্থা"],
      ["সংগ্রাম", "বাধার বিরুদ্ধে লড়াই"],
      ["দায়িত্ববোধ", "নিজের কর্তব্য সম্পর্কে সচেতনতা"]
    ],
    mcq: [
      {
        question: "মাসি-পিসি গল্পের লেখক কে?",
        options: ["মানিক বন্দ্যোপাধ্যায়", "রবীন্দ্রনাথ ঠাকুর", "আখতারুজ্জামান ইলিয়াস", "আনিসুজ্জামান"],
        answer: 0,
        explanation: "মাসি-পিসি গল্পটি মানিক বন্দ্যোপাধ্যায়ের রচনা।"
      }
    ],
    cq: [
      {
        question: "মাসি-পিসি গল্পে নারীজীবনের সংগ্রাম আলোচনা করো।",
        hint: "নারী চরিত্রগুলোর দায়িত্ব, প্রতিকূলতা ও সাহসের দিকগুলো ব্যাখ্যা করো।"
      }
    ]
  },
  {
    title: "একটি তুলসী গাছের কাহিনী",
    author: "সৈয়দ ওয়ালীউল্লাহ্",
    intro: "গল্পটিতে দেশভাগ, বাস্তুচ্যুতি, স্মৃতি ও মানুষের শিকড়ের প্রতি টানের বিষয়টি আলোচিত হয়েছে।",
    authorInfo: "সৈয়দ ওয়ালীউল্লাহ্ বাংলা সাহিত্যের বিশিষ্ট কথাসাহিত্যিক ও নাট্যকার। তাঁর রচনায় সমাজ, মানুষের মনোজগৎ ও অস্তিত্বের সংকট গুরুত্ব পেয়েছে।",
    theme: "বাস্তুচ্যুতি মানুষের শুধু বাসস্থান নয়, স্মৃতি, পরিচয় ও মানসিক আশ্রয়কেও বিপর্যস্ত করে।",
    discussion: "তুলসী গাছকে কেন্দ্র করে গল্পে স্মৃতি, আপন ভূমি ও হারানো জীবনের অনুভূতি প্রকাশিত হয়েছে। দেশভাগের মানবিক অভিঘাত গল্পটির গুরুত্বপূর্ণ দিক।",
    words: [
      ["বাস্তুচ্যুতি", "নিজের বাসস্থান থেকে উৎখাত হওয়া"],
      ["শিকড়", "নিজস্ব ভূমি ও ঐতিহ্যের সঙ্গে সম্পর্ক"],
      ["স্মৃতি", "অতীতের মনে থাকা অভিজ্ঞতা"]
    ],
    mcq: [
      {
        question: "একটি তুলসী গাছের কাহিনী গল্পের লেখক কে?",
        options: ["সৈয়দ ওয়ালীউল্লাহ্", "আবুল ফজল", "কাজী আবদুল ওদুদ", "প্রমথ চৌধুরী"],
        answer: 0,
        explanation: "গল্পটির লেখক সৈয়দ ওয়ালীউল্লাহ্।"
      }
    ],
    cq: [
      {
        question: "একটি তুলসী গাছের কাহিনী গল্পে দেশভাগের মানবিক প্রভাব ব্যাখ্যা করো।",
        hint: "বাস্তুচ্যুতি, স্মৃতি ও আপন ভূমির প্রতি মানুষের টানের বিষয়গুলো লেখো।"
      }
    ]
  },
  {
    title: "রেইনকোট",
    author: "আখতারুজ্জামান ইলিয়াস",
    intro: "রেইনকোট গল্পে মুক্তিযুদ্ধের সময়কার রাজনৈতিক বাস্তবতা, ভয়, প্রতিরোধ ও মানুষের মানসিক পরিবর্তনের চিত্র পাওয়া যায়।",
    authorInfo: "আখতারুজ্জামান ইলিয়াস বাংলাদেশের বিশিষ্ট কথাসাহিত্যিক। তাঁর লেখায় সমাজবাস্তবতা, রাজনৈতিক চেতনা ও মানুষের জটিল মনস্তত্ত্ব প্রকাশ পেয়েছে।",
    theme: "ভয় ও অনিশ্চয়তার মধ্যেও মানুষের মধ্যে সাহস, দেশপ্রেম ও প্রতিবাদী চেতনা জেগে উঠতে পারে।",
    discussion: "গল্পে মুক্তিযুদ্ধকালীন পরিস্থিতি ও সাধারণ মানুষের মানসিক অবস্থার পরিবর্তন ফুটে উঠেছে। রেইনকোট একটি প্রতীকী উপাদান হিসেবে গল্পের তাৎপর্য বহন করে।",
    words: [
      ["প্রতিরোধ", "অন্যায়ের বিরুদ্ধে বাধা দেওয়া"],
      ["অনিশ্চয়তা", "নিশ্চিত নয় এমন অবস্থা"],
      ["প্রতীক", "অন্য কোনো ভাব বা বিষয় বোঝানোর চিহ্ন"]
    ],
    mcq: [
      {
        question: "রেইনকোট গল্পের লেখক কে?",
        options: ["আখতারুজ্জামান ইলিয়াস", "সৈয়দ শামসুল হক", "আবুল ফজল", "আনিসুজ্জামান"],
        answer: 0,
        explanation: "রেইনকোট গল্পের লেখক আখতারুজ্জামান ইলিয়াস।"
      }
    ],
    cq: [
      {
        question: "রেইনকোট গল্পে মুক্তিযুদ্ধের চেতনার প্রকাশ আলোচনা করো।",
        hint: "ভয়, সাহস, প্রতিরোধ ও মানসিক পরিবর্তনের বিষয়গুলো ব্যাখ্যা করো।"
      }
    ]
  },
  {
    title: "নেকলেস",
    author: "গী দ্য মোপাসাঁ",
    intro: "নেকলেস একটি বিখ্যাত ফরাসি ছোটগল্পের বাংলা পাঠ। এতে সামাজিক মর্যাদার আকাঙ্ক্ষা, অহংকার ও জীবনের অনাকাঙ্ক্ষিত পরিণতি তুলে ধরা হয়েছে।",
    authorInfo: "গী দ্য মোপাসাঁ ফরাসি সাহিত্যের বিখ্যাত ছোটগল্পকার। সংক্ষিপ্ত অথচ তাৎপর্যপূর্ণ কাহিনি ও আকস্মিক পরিণতির জন্য তিনি পরিচিত।",
    theme: "অতিরিক্ত সামাজিক উচ্চাকাঙ্ক্ষা, বাহ্যিক আভিজাত্যের মোহ ও সত্য গোপনের পরিণতি মানুষের জীবনকে দুর্বিষহ করতে পারে।",
    discussion: "গল্পের কেন্দ্রীয় চরিত্রের সামাজিক মর্যাদার আকাঙ্ক্ষা ও একটি নেকলেসকে ঘিরে ঘটনাপ্রবাহ তৈরি হয়েছে। কাহিনির পরিণতি বাহ্যিক চাকচিক্যের অসারতা তুলে ধরে।",
    words: [
      ["নেকলেস", "গলায় পরার অলংকার"],
      ["আভিজাত্য", "উচ্চ সামাজিক মর্যাদার পরিচয়"],
      ["উচ্চাকাঙ্ক্ষা", "বড় কিছু অর্জনের প্রবল ইচ্ছা"]
    ],
    mcq: [
      {
        question: "নেকলেস গল্পের মূল রচয়িতা কে?",
        options: ["ভিক্টর হুগো", "গী দ্য মোপাসাঁ", "আলবেয়ার কামু", "শরৎচন্দ্র"],
        answer: 1,
        explanation: "নেকলেস গল্পের মূল লেখক ফরাসি সাহিত্যিক গী দ্য মোপাসাঁ।"
      }
    ],
    cq: [
      {
        question: "নেকলেস গল্পে বাহ্যিক আভিজাত্যের মোহের পরিণতি ব্যাখ্যা করো।",
        hint: "চরিত্রের আকাঙ্ক্ষা, নেকলেসের ঘটনা ও শেষ পরিণতি আলোচনা করো।"
      }
    ]
  },
  {
    title: "আত্মচরিত",
    author: "ঈশ্বরচন্দ্র বিদ্যাসাগর",
    intro: "আত্মচরিত একটি আত্মজীবনীমূলক রচনা। এতে লেখকের জীবন, শৈশব, শিক্ষা ও অভিজ্ঞতার পরিচয় পাওয়া যায়।",
    authorInfo: "ঈশ্বরচন্দ্র বিদ্যাসাগর ছিলেন উনিশ শতকের বিশিষ্ট শিক্ষাবিদ, সমাজসংস্কারক ও গদ্যকার। বাংলা গদ্যের বিকাশ এবং নারীশিক্ষায় তাঁর অবদান স্মরণীয়।",
    theme: "অধ্যবসায়, শিক্ষার প্রতি আগ্রহ ও পরিশ্রম মানুষের জীবনে গুরুত্বপূর্ণ ভূমিকা রাখে।",
    discussion: "আত্মজীবনীমূলক বর্ণনার মাধ্যমে লেখক নিজের জীবনের অভিজ্ঞতা তুলে ধরেছেন। তাঁর শৈশব, শিক্ষা ও জীবনগঠনের বিভিন্ন দিক এই পাঠে গুরুত্ব পায়।",
    words: [
      ["আত্মচরিত", "নিজের জীবনের বিবরণ"],
      ["অধ্যবসায়", "লক্ষ্য অর্জনে নিয়মিত চেষ্টা"],
      ["সমাজসংস্কার", "সমাজের ক্ষতিকর প্রথা পরিবর্তনের উদ্যোগ"]
    ],
    mcq: [
      {
        question: "আত্মচরিতের রচয়িতা কে?",
        options: ["ঈশ্বরচন্দ্র বিদ্যাসাগর", "বঙ্কিমচন্দ্র", "রবীন্দ্রনাথ", "মীর মশাররফ হোসেন"],
        answer: 0,
        explanation: "আত্মচরিত ঈশ্বরচন্দ্র বিদ্যাসাগরের আত্মজীবনীমূলক রচনা।"
      }
    ],
    cq: [
      {
        question: "আত্মচরিত পাঠে বিদ্যাসাগরের অধ্যবসায়ের পরিচয় দাও।",
        hint: "লেখকের জীবন ও শিক্ষাসংক্রান্ত অভিজ্ঞতা থেকে উদাহরণ দাও।"
      }
    ]
  },
  {
    title: "বাঙ্গালার নব্য লেখকদিগের প্রতি নিবেদন",
    author: "বঙ্কিমচন্দ্র চট্টোপাধ্যায়",
    intro: "এটি নবীন লেখকদের উদ্দেশে সাহিত্যচর্চা, লেখার উদ্দেশ্য ও সাহিত্যিক দায়িত্ব সম্পর্কে গুরুত্বপূর্ণ পরামর্শমূলক রচনা।",
    authorInfo: "বঙ্কিমচন্দ্র চট্টোপাধ্যায় বাংলা উপন্যাসের বিকাশে অগ্রগণ্য সাহিত্যিক। তিনি ঔপন্যাসিক, প্রাবন্ধিক ও সাহিত্যসম্পাদক ছিলেন।",
    theme: "সাহিত্যচর্চার উদ্দেশ্য হওয়া উচিত সত্য, সৌন্দর্য ও কল্যাণের প্রকাশ; কেবল খ্যাতি বা অর্থ অর্জন নয়।",
    discussion: "লেখক নবীন সাহিত্যিকদের উদ্দেশে লেখার মান, সততা, অনুশীলন ও দায়িত্বশীলতার কথা বলেছেন। সাহিত্যিকের আত্মসমালোচনা ও সত্যনিষ্ঠা এখানে গুরুত্বপূর্ণ।",
    words: [
      ["নিবেদন", "বিনীত অনুরোধ বা বক্তব্য"],
      ["নব্য", "নতুন"],
      ["সাহিত্যচর্চা", "সাহিত্য রচনা ও অধ্যয়নের অনুশীলন"]
    ],
    mcq: [
      {
        question: "রচনাটির লেখক কে?",
        options: ["বঙ্কিমচন্দ্র চট্টোপাধ্যায়", "প্রমথ চৌধুরী", "কাজী নজরুল ইসলাম", "বিদ্যাসাগর"],
        answer: 0,
        explanation: "রচনাটি বঙ্কিমচন্দ্র চট্টোপাধ্যায়ের।"
      }
    ],
    cq: [
      {
        question: "নবীন লেখকদের প্রতি বঙ্কিমচন্দ্রের পরামর্শের তাৎপর্য আলোচনা করো।",
        hint: "সাহিত্যিক সততা, অনুশীলন ও লেখার উদ্দেশ্য তুলে ধরো।"
      }
    ]
  },
  {
    title: "কারবালা-প্রান্তর",
    author: "মীর মশাররফ হোসেন",
    intro: "কারবালার ঐতিহাসিক ও ধর্মীয় ঘটনাকে কেন্দ্র করে রচিত সাহিত্যকর্মের পাঠ।",
    authorInfo: "মীর মশাররফ হোসেন বাংলা সাহিত্যের বিশিষ্ট মুসলিম সাহিত্যিক। তাঁর সাহিত্যকর্মে ইতিহাস, ধর্মীয় আবেগ ও মানবিক অনুভূতির প্রকাশ ঘটেছে।",
    theme: "ত্যাগ, সত্যের প্রতি অবিচলতা, ন্যায়বোধ ও আত্মত্যাগের তাৎপর্য এই পাঠের গুরুত্বপূর্ণ দিক।",
    discussion: "কারবালার ঘটনা ইসলামের ইতিহাসে গভীর তাৎপর্য বহন করে। এই পাঠে ঐতিহাসিক ঘটনার আবেগ, আত্মত্যাগ ও নৈতিক আদর্শের দিকগুলো গুরুত্ব পায়।",
    words: [
      ["প্রান্তর", "বিস্তৃত খোলা ভূমি"],
      ["ত্যাগ", "বৃহত্তর আদর্শের জন্য কিছু বিসর্জন"],
      ["অবিচল", "দৃঢ়ভাবে স্থির"]
    ],
    mcq: [
      {
        question: "কারবালা-প্রান্তর রচনার লেখক কে?",
        options: ["মীর মশাররফ হোসেন", "কায়কোবাদ", "আবুল ফজল", "আনিসুজ্জামান"],
        answer: 0,
        explanation: "কারবালা-প্রান্তর রচনার সঙ্গে মীর মশাররফ হোসেনের নাম যুক্ত।"
      }
    ],
    cq: [
      {
        question: "কারবালা-প্রান্তর পাঠে ত্যাগ ও আদর্শের পরিচয় ব্যাখ্যা করো।",
        hint: "কারবালার ঐতিহাসিক প্রেক্ষাপট ও নৈতিক তাৎপর্য উল্লেখ করো।"
      }
    ]
  },
  {
    title: "সাহিত্যে খেলা",
    author: "প্রমথ চৌধুরী",
    intro: "সাহিত্য ও সৃজনশীলতার প্রকৃতি নিয়ে রচিত একটি প্রবন্ধ।",
    authorInfo: "প্রমথ চৌধুরী বাংলা গদ্যসাহিত্যের বিশিষ্ট প্রাবন্ধিক। চলিত ভাষার প্রতিষ্ঠা ও রচনাশৈলীতে তাঁর বিশেষ অবদান রয়েছে।",
    theme: "সাহিত্য সৃষ্টিতে আনন্দ, স্বাধীনতা, কল্পনা ও সৃজনশীলতার গুরুত্ব রয়েছে।",
    discussion: "সাহিত্যকে কেবল নিয়মের মধ্যে সীমাবদ্ধ না রেখে তার আনন্দময় ও সৃজনশীল দিক উপলব্ধি করার প্রয়োজনীয়তা এই পাঠের আলোচ্য।",
    words: [
      ["সৃজনশীলতা", "নতুন কিছু সৃষ্টি করার ক্ষমতা"],
      ["কল্পনা", "মনের সৃষ্টিশীল ভাবনা"],
      ["চলিত ভাষা", "প্রচলিত কথ্যরীতির কাছাকাছি ভাষা"]
    ],
    mcq: [
      {
        question: "সাহিত্যে খেলা প্রবন্ধের লেখক কে?",
        options: ["প্রমথ চৌধুরী", "বঙ্কিমচন্দ্র", "আবুল ফজল", "কাজী আবদুল ওদুদ"],
        answer: 0,
        explanation: "সাহিত্যে খেলা প্রবন্ধটি প্রমথ চৌধুরীর লেখা।"
      }
    ],
    cq: [
      {
        question: "সাহিত্য সৃষ্টিতে আনন্দ ও সৃজনশীলতার গুরুত্ব ব্যাখ্যা করো।",
        hint: "প্রবন্ধের বক্তব্য অনুসারে সাহিত্যচর্চার স্বাধীনতা ও আনন্দ আলোচনা করো।"
      }
    ]
  },
  {
    title: "অর্ধাঙ্গী",
    author: "রোকেয়া সাখাওয়াত হোসেন",
    intro: "নারীর অধিকার, মর্যাদা ও সমাজে নারী-পুরুষের সমান অংশগ্রহণের বিষয়টি এই রচনায় গুরুত্ব পেয়েছে।",
    authorInfo: "বেগম রোকেয়া সাখাওয়াত হোসেন ছিলেন বিশিষ্ট লেখিকা, শিক্ষাবিদ ও নারীজাগরণের অগ্রদূত। নারীশিক্ষা ও নারীস্বাধীনতার প্রসারে তাঁর অবদান স্মরণীয়।",
    theme: "নারী ও পুরুষ পরস্পরের পরিপূরক; সমাজের উন্নয়নে উভয়ের সমান মর্যাদা ও সহযোগিতা প্রয়োজন।",
    discussion: "রচনায় নারীর সামাজিক অবস্থান, অধিকার ও মর্যাদার প্রশ্ন উত্থাপিত হয়েছে। নারীকে অবহেলা করে সমাজের সামগ্রিক উন্নয়ন সম্ভব নয়—এমন চিন্তা এখানে গুরুত্বপূর্ণ।",
    words: [
      ["অর্ধাঙ্গী", "জীবনসঙ্গিনী বা সমান অংশীদার"],
      ["মর্যাদা", "সম্মানজনক অবস্থান"],
      ["পরিপূরক", "একে অন্যের ঘাটতি পূরণ করে এমন"]
    ],
    mcq: [
      {
        question: "অর্ধাঙ্গী রচনার লেখক কে?",
        options: ["রোকেয়া সাখাওয়াত হোসেন", "সুফিয়া কামাল", "আশাপূর্ণা দেবী", "লীলাবতী নাগ"],
        answer: 0,
        explanation: "অর্ধাঙ্গী রচনার লেখক বেগম রোকেয়া সাখাওয়াত হোসেন।"
      }
    ],
    cq: [
      {
        question: "অর্ধাঙ্গী রচনায় নারী-পুরুষের সমমর্যাদার ধারণা ব্যাখ্যা করো।",
        hint: "নারীর অধিকার, সহযোগিতা ও সমাজের উন্নয়নের বিষয়গুলো আলোচনা করো।"
      }
    ]
  },
  {
    title: "শিক্ষাচিন্তা",
    author: "কাজী আবদুল ওদুদ",
    intro: "শিক্ষার উদ্দেশ্য, মানবিক বিকাশ ও চিন্তার স্বাধীনতা নিয়ে আলোচনা করা হয়েছে।",
    authorInfo: "কাজী আবদুল ওদুদ ছিলেন বিশিষ্ট প্রাবন্ধিক, চিন্তাবিদ ও সাহিত্যসমালোচক। যুক্তিবাদ, মানবতাবাদ ও মুক্তচিন্তার চর্চায় তাঁর অবদান রয়েছে।",
    theme: "শিক্ষার উদ্দেশ্য শুধু তথ্য অর্জন নয়; মানুষের চিন্তা, বিচারবোধ ও মানবিক গুণের বিকাশ ঘটানো।",
    discussion: "শিক্ষার প্রকৃত লক্ষ্য ও মানুষের জীবন গঠনে শিক্ষার ভূমিকা এই পাঠের কেন্দ্রীয় বিষয়। মুক্তচিন্তা, যুক্তিবোধ ও মানবিকতার বিকাশের ওপর গুরুত্ব দেওয়া হয়েছে।",
    words: [
      ["শিক্ষাচিন্তা", "শিক্ষা সম্পর্কে ভাবনা"],
      ["যুক্তিবোধ", "যুক্তি দিয়ে বিচার করার ক্ষমতা"],
      ["মানবতাবাদ", "মানুষের মর্যাদা ও কল্যাণকে গুরুত্ব দেওয়া"]
    ],
    mcq: [
      {
        question: "শিক্ষাচিন্তা রচনার লেখক কে?",
        options: ["কাজী আবদুল ওদুদ", "কাজী মোতাহার হোসেন", "আবুল ফজল", "প্রমথ চৌধুরী"],
        answer: 0,
        explanation: "শিক্ষাচিন্তা রচনাটি কাজী আবদুল ওদুদের।"
      }
    ],
    cq: [
      {
        question: "প্রকৃত শিক্ষা মানুষের জীবনে কী ভূমিকা রাখে?",
        hint: "চিন্তা, বিচারবোধ, মানবিকতা ও ব্যক্তিত্ব গঠনের বিষয়গুলো ব্যাখ্যা করো।"
      }
    ]
  },
  {
    title: "ভুলের মূল্য",
    author: "কাজী মোতাহার হোসেন",
    intro: "ভুল, অভিজ্ঞতা ও জ্ঞান অর্জনের সম্পর্ক নিয়ে আলোচনামূলক পাঠ।",
    authorInfo: "কাজী মোতাহার হোসেন ছিলেন বিশিষ্ট বিজ্ঞানী, শিক্ষাবিদ ও প্রাবন্ধিক। বিজ্ঞানমনস্কতা ও যুক্তিবাদী চিন্তায় তাঁর বিশেষ অবদান রয়েছে।",
    theme: "ভুল থেকে শিক্ষা গ্রহণ করলে তা জ্ঞান ও অভিজ্ঞতা অর্জনের সহায়ক হতে পারে।",
    discussion: "মানুষের চিন্তা ও কাজের ক্ষেত্রে ভুল হওয়া স্বাভাবিক। ভুলকে স্বীকার করে বিশ্লেষণ ও সংশোধনের মাধ্যমে মানুষ উন্নতি করতে পারে—এই দৃষ্টিভঙ্গি পাঠটির গুরুত্বপূর্ণ শিক্ষা।",
    words: [
      ["মূল্য", "গুরুত্ব বা বিনিময়"],
      ["সংশোধন", "ভুল ঠিক করা"],
      ["অভিজ্ঞতা", "কাজ বা ঘটনার মাধ্যমে অর্জিত জ্ঞান"]
    ],
    mcq: [
      {
        question: "ভুলের মূল্য রচনার লেখক কে?",
        options: ["কাজী মোতাহার হোসেন", "কাজী আবদুল ওদুদ", "আবুল ফজল", "আনিসুজ্জামান"],
        answer: 0,
        explanation: "ভুলের মূল্য রচনাটি কাজী মোতাহার হোসেনের।"
      }
    ],
    cq: [
      {
        question: "ভুল থেকে শিক্ষা গ্রহণের প্রয়োজনীয়তা ব্যাখ্যা করো।",
        hint: "ভুল স্বীকার, বিশ্লেষণ ও সংশোধনের গুরুত্ব তুলে ধরো।"
      }
    ]
  },
  {
    title: "যৌবনের গান",
    author: "কাজী নজরুল ইসলাম",
    intro: "যৌবনের শক্তি, সাহস, উদ্যম ও পরিবর্তনের আকাঙ্ক্ষা নিয়ে রচিত একটি প্রেরণামূলক গদ্য।",
    authorInfo: "কাজী নজরুল ইসলাম বাংলাদেশের জাতীয় কবি। তাঁর সাহিত্যকর্মে সাম্য, মানবতা, স্বাধীনতা ও বিদ্রোহী চেতনা বিশেষভাবে প্রকাশ পেয়েছে।",
    theme: "যৌবন হলো সাহস, কর্মশক্তি, সৃজনশীলতা ও অন্যায়ের বিরুদ্ধে দাঁড়ানোর সময়।",
    discussion: "যৌবনের প্রাণশক্তি ও কর্মপ্রেরণাকে সমাজ পরিবর্তনের শক্তি হিসেবে তুলে ধরা হয়েছে। তরুণদের নিষ্ক্রিয়তা পরিহার করে সাহসী ও দায়িত্বশীল হওয়ার আহ্বান রয়েছে।",
    words: [
      ["উদ্যম", "কাজ করার আগ্রহ ও শক্তি"],
      ["জড়তা", "নিষ্ক্রিয় অবস্থা"],
      ["বিদ্রোহ", "অন্যায়ের বিরুদ্ধে প্রতিবাদ"]
    ],
    mcq: [
      {
        question: "যৌবনের গান রচনার লেখক কে?",
        options: ["কাজী নজরুল ইসলাম", "সুকান্ত ভট্টাচার্য", "রবীন্দ্রনাথ ঠাকুর", "জসীমউদ্দীন"],
        answer: 0,
        explanation: "যৌবনের গান রচনাটি কাজী নজরুল ইসলামের।"
      }
    ],
    cq: [
      {
        question: "যৌবনের শক্তিকে সমাজ পরিবর্তনের হাতিয়ার বলা যায় কেন?",
        hint: "সাহস, উদ্যম, কর্মশক্তি ও অন্যায়ের বিরুদ্ধে প্রতিবাদের বিষয়গুলো আলোচনা করো।"
      }
    ]
  },
  {
    title: "জীবন ও বৃক্ষ",
    author: "মোতাহার হোসেন চৌধুরী",
    intro: "জীবন ও প্রকৃতির সম্পর্ককে কেন্দ্র করে রচিত চিন্তামূলক প্রবন্ধ।",
    authorInfo: "মোতাহার হোসেন চৌধুরী ছিলেন বিশিষ্ট প্রাবন্ধিক ও চিন্তাবিদ। তাঁর রচনায় মননশীলতা, মানবিকতা ও জীবনদর্শনের পরিচয় পাওয়া যায়।",
    theme: "বৃক্ষের জীবনপ্রবাহ ও মানুষের জীবনবোধের মধ্যে ভাবগত সম্পর্ক রয়েছে; প্রকৃতি মানুষের অস্তিত্বের গুরুত্বপূর্ণ অংশ।",
    discussion: "বৃক্ষের বৃদ্ধি, জীবনধারণ ও প্রকৃতির সঙ্গে মানুষের সম্পর্কের মাধ্যমে জীবনের নানা তাৎপর্য বোঝানো হয়েছে।",
    words: [
      ["বৃক্ষ", "গাছ"],
      ["জীবনবোধ", "জীবন সম্পর্কে উপলব্ধি"],
      ["প্রকৃতি", "মানুষের চারপাশের প্রাকৃতিক জগৎ"]
    ],
    mcq: [
      {
        question: "জীবন ও বৃক্ষ রচনার লেখক কে?",
        options: ["মোতাহার হোসেন চৌধুরী", "কাজী মোতাহার হোসেন", "আবুল ফজল", "আনিসুজ্জামান"],
        answer: 0,
        explanation: "জীবন ও বৃক্ষ রচনাটি মোতাহার হোসেন চৌধুরীর।"
      }
    ],
    cq: [
      {
        question: "জীবন ও বৃক্ষ পাঠে প্রকৃতি ও জীবনের সম্পর্ক ব্যাখ্যা করো।",
        hint: "বৃক্ষের জীবনপ্রবাহ ও মানুষের জীবনবোধের তুলনামূলক আলোচনা করো।"
      }
    ]
  },
  {
    title: "মানব-কল্যাণ",
    author: "আবুল ফজল",
    intro: "মানুষের কল্যাণ, মানবিক মূল্যবোধ ও সমাজের প্রতি দায়িত্ববোধ নিয়ে রচিত প্রবন্ধ।",
    authorInfo: "আবুল ফজল ছিলেন বিশিষ্ট কথাসাহিত্যিক, প্রাবন্ধিক ও শিক্ষাবিদ। তাঁর রচনায় মানবতাবাদ, মুক্তচিন্তা ও সামাজিক সচেতনতা প্রকাশ পেয়েছে।",
    theme: "মানুষের প্রকৃত উন্নতি ও সমাজের অগ্রগতির মূল লক্ষ্য হওয়া উচিত মানবকল্যাণ।",
    discussion: "মানুষের প্রতি সহমর্মিতা, দায়িত্বশীলতা ও কল্যাণমুখী চিন্তার প্রয়োজনীয়তা এই পাঠের আলোচ্য বিষয়।",
    words: [
      ["কল্যাণ", "মঙ্গল বা উপকার"],
      ["সহমর্মিতা", "অন্যের অনুভূতি উপলব্ধি করার ক্ষমতা"],
      ["মূল্যবোধ", "জীবনের নৈতিক আদর্শ"]
    ],
    mcq: [
      {
        question: "মানব-কল্যাণ রচনার লেখক কে?",
        options: ["আবুল ফজল", "আনিসুজ্জামান", "কাজী আবদুল ওদুদ", "প্রমথ চৌধুরী"],
        answer: 0,
        explanation: "মানব-কল্যাণ রচনাটি আবুল ফজলের লেখা।"
      }
    ],
    cq: [
      {
        question: "মানবকল্যাণে মানুষের দায়িত্ব ও কর্তব্য আলোচনা করো।",
        hint: "সহমর্মিতা, নৈতিকতা ও সমাজের প্রতি দায়িত্বের বিষয়গুলো তুলে ধরো।"
      }
    ]
  },
  {
    title: "জাদুঘরে কেন যাব",
    author: "আনিসুজ্জামান",
    intro: "জাদুঘরের প্রয়োজনীয়তা, ইতিহাস-ঐতিহ্য সংরক্ষণ ও অতীতকে জানার গুরুত্ব নিয়ে রচিত প্রবন্ধ।",
    authorInfo: "আনিসুজ্জামান ছিলেন বিশিষ্ট শিক্ষাবিদ, গবেষক ও প্রাবন্ধিক। বাংলা ভাষা, সাহিত্য, ইতিহাস ও সংস্কৃতি বিষয়ে তাঁর অবদান গুরুত্বপূর্ণ।",
    theme: "জাদুঘর জাতির ইতিহাস, ঐতিহ্য ও সাংস্কৃতিক পরিচয় সংরক্ষণ করে এবং নতুন প্রজন্মকে অতীত সম্পর্কে জানতে সাহায্য করে।",
    discussion: "জাদুঘরে সংরক্ষিত বস্তু ও নিদর্শনের মাধ্যমে অতীতের জীবন, সংস্কৃতি ও ইতিহাস সম্পর্কে জানা যায়। জাতীয় পরিচয় ও ঐতিহ্য রক্ষায় জাদুঘরের ভূমিকা গুরুত্বপূর্ণ।",
    words: [
      ["জাদুঘর", "ঐতিহাসিক ও সাংস্কৃতিক নিদর্শন সংরক্ষণের স্থান"],
      ["নিদর্শন", "কোনো সময় বা ঘটনার প্রমাণস্বরূপ বস্তু"],
      ["ঐতিহ্য", "প্রজন্ম থেকে প্রজন্মে পাওয়া সাংস্কৃতিক সম্পদ"]
    ],
    mcq: [
      {
        question: "জাদুঘরে কেন যাব রচনার লেখক কে?",
        options: ["আনিসুজ্জামান", "আবুল ফজল", "সৈয়দ ওয়ালীউল্লাহ্", "মীর মশাররফ হোসেন"],
        answer: 0,
        explanation: "জাদুঘরে কেন যাব রচনাটি আনিসুজ্জামানের।"
      }
    ],
    cq: [
      {
        question: "জাতির ইতিহাস ও ঐতিহ্য সংরক্ষণে জাদুঘরের ভূমিকা ব্যাখ্যা করো।",
        hint: "ঐতিহাসিক নিদর্শন, সংস্কৃতি ও নতুন প্রজন্মের শিক্ষার বিষয়গুলো লেখো।"
      }
    ]
  }
];

/* =========================================
   BANGLA 1ST PAPER — KOBITA
========================================= */

const bangla1Kobita = [
  {title:"ফুল্লরার বারোমাস্যা",author:"মুকুন্দরাম চক্রবর্তী"},
  {title:"ঋতু বর্ণনা",author:"আলাওল"},
  {title:"স্বদেশ",author:"ঈশ্বরচন্দ্র গুপ্ত"},
  {title:"বিভীষণের প্রতি মেঘনাদ",author:"মাইকেল মধুসূদন দত্ত"},
  {title:"সুখ",author:"কায়কোবাদ"},
  {title:"মানব-বন্দনা",author:"অক্ষয়কুমার বড়াল"},
  {title:"সোনার তরী",author:"রবীন্দ্রনাথ ঠাকুর"},
  {title:"ঐকতান",author:"রবীন্দ্রনাথ ঠাকুর"},
  {title:"নবান্ন",author:"যতীন্দ্রনাথ সেনগুপ্ত"},
  {title:"বিদ্রোহী",author:"কাজী নজরুল ইসলাম"},
  {title:"সাম্যবাদী",author:"কাজী নজরুল ইসলাম"},
  {title:"সুচেতনা",author:"জীবনানন্দ দাশ"},
  {title:"প্রতিদান",author:"জসীমউদ্দীন"},
  {title:"তাহারই পড়ে মনে",author:"সুফিয়া কামাল"},
  {title:"আগে কী সুন্দর দিন কাটাইতাম",author:"শাহ আব্দুল করিম"},
  {title:"সেই অস্ত্র",author:"আহসান হাবীব"},
  {title:"পদ্মা",author:"ফররুখ আহমদ"},
  {title:"আলো চাই",author:"সিকান্দার আবু জাফর"},
  {title:"আঠারো বছর বয়স",author:"সুকান্ত ভট্টাচার্য"},
  {title:"ফেব্রুয়ারি ১৯৬৯",author:"শামসুর রাহমান"},
  {title:"হাড়",author:"আলাউদ্দিন আল আজাদ"},
  {title:"তোমার আপন পতাকা",author:"হাসান হাফিজুর রহমান"},
  {title:"আমি কিংবদন্তির কথা বলছি",author:"আবু জাফর ওবায়দুল্লাহ"},
  {title:"নূরলদীনের কথা মনে পড়ে যায়",author:"সৈয়দ শামসুল হক"},
  {title:"ছবি",author:"আবু হেনা মোস্তফা কামাল"},
  {title:"প্রত্যাবর্তনের লজ্জা",author:"আল মাহমুদ"},
  {title:"ভূমিহীন কৃষিজীবী ইচ্ছে তার",author:"মোহাম্মদ মনিরুজ্জামান"},
  {title:"ব্ল্যাক-আউটের পূর্ণিমায়",author:"শহীদ কাদরী"}
];

/* =========================================
   NAVIGATION
========================================= */

function hideAllPages() {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });
}

function setActiveNav(name, button) {
  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
  });

  if (button) {
    button.classList.add("active");
    return;
  }

  const index = ["home", "subjects", "practice", "saved", "profile"].indexOf(name);
  const items = document.querySelectorAll(".nav-item");

  if (index >= 0 && items[index]) {
    items[index].classList.add("active");
  }
}

function scrollTop() {
  window.scrollTo({top:0, behavior:"smooth"});
}

function showPage(name, button) {
  const target = document.getElementById(name + "Page");
  if (!target) return;

  hideAllPages();
  target.classList.add("active");
  setActiveNav(name, button);

  if (name === "saved") renderSaved();
  if (name === "profile") updateProgress();

  scrollTop();
}

/* =========================================
   SEARCH
========================================= */

function filterSubjects() {
  const input = document.getElementById("searchInput");
  const empty = document.getElementById("empty");

  if (!input) return;

  const query = input.value.trim().toLowerCase();
  let visible = 0;

  document.querySelectorAll("#subjectList .paper").forEach(item => {
    const text = (item.dataset.name || "") + " " + item.innerText;
    const match = text.toLowerCase().includes(query);

    item.style.display = match ? "flex" : "none";
    if (match) visible++;
  });

  document.querySelectorAll("#subjectList .subject-group").forEach(group => {
    const papers = group.querySelectorAll(".paper");
    group.style.display = [...papers].some(p => p.style.display !== "none")
      ? "block" : "none";
  });

  if (empty) empty.style.display = visible ? "none" : "block";
}

/* =========================================
   PAPER LIBRARY
========================================= */

function openPaper(name) {
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
     normalized.includes("1st") ||
     normalized.includes("first"));

  if (isBanglaFirst) {
    renderChapterSection(list, "গদ্য", bangla1Gadya);
    renderChapterSection(list, "কবিতা", bangla1Kobita);
  } else {
    const message = document.createElement("div");
    message.className = "chapter";
    message.textContent = "এই পত্রের অধ্যায় তালিকা পর্যায়ক্রমে যুক্ত করা হবে।";
    list.appendChild(message);
  }

  showPage("chapter");
}

function renderChapterSection(container, section, chapters) {
  const heading = document.createElement("h3");
  heading.textContent = section + " (" + chapters.length + ")";
  heading.style.margin = "22px 0 12px";
  heading.style.color = "var(--gold)";
  container.appendChild(heading);

  const completed = readStorage(STORAGE.completed, []);

  chapters.forEach((chapter, index) => {
    const item = document.createElement("div");
    item.className = "chapter";

    const info = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = `${index + 1}. ${chapter.title}`;

    const author = document.createElement("small");
    author.textContent = (section === "গদ্য" ? "লেখক: " : "কবি: ") + chapter.author;
    author.style.display = "block";
    author.style.color = "var(--muted)";

    info.append(title, author);

    const status = document.createElement("span");
    status.textContent = completed.includes(chapter.title) ? "✓" : "›";
    status.style.color = completed.includes(chapter.title) ? "var(--green)" : "var(--gold)";

    item.append(info, status);
    item.addEventListener("click", () => openChapterDetails(chapter, section));
    container.appendChild(item);
  });
}

/* =========================================
   CHAPTER DETAIL PAGE
========================================= */

function openChapterDetails(chapter, section) {
  currentChapter = {...chapter, section};

  let page = document.getElementById("chapterDetailsPage");

  if (!page) {
    page = document.createElement("section");
    page.id = "chapterDetailsPage";
    page.className = "page";
    document.body.appendChild(page);
  }

  const saved = readStorage(STORAGE.saved, []);
  const completed = readStorage(STORAGE.completed, []);
  const isSaved = saved.some(item => item.title === chapter.title);
  const isCompleted = completed.includes(chapter.title);
  const writer = section === "গদ্য" ? "লেখক" : "কবি";
  const hasNotes = Boolean(chapter.intro);

  page.innerHTML = `
    <div class="container">

      <button class="back" onclick="closeChapterDetails()">← ফিরে যাও</button>

      <div class="chapter-detail-card">
        <h2>${escapeHTML(chapter.title)}</h2>
        <p>${writer}: ${escapeHTML(chapter.author)}</p>

        <button class="primary-btn" onclick="toggleSaveCurrent()">
          ${isSaved ? "★ Saved" : "☆ Save Chapter"}
        </button>

        <button class="primary-btn" onclick="toggleCompletedCurrent()">
          ${isCompleted ? "✓ Completed" : "Mark as Completed"}
        </button>
      </div>

      ${hasNotes ? `
        <div class="detail-topic">
          <h3>📖 পাঠ পরিচিতি</h3>
          <p>${escapeHTML(chapter.intro)}</p>
        </div>

        <div class="detail-topic">
          <h3>✍️ ${writer} পরিচিতি</h3>
          <p>${escapeHTML(chapter.authorInfo)}</p>
        </div>

        <div class="detail-topic">
          <h3>💡 মূলভাব</h3>
          <p>${escapeHTML(chapter.theme)}</p>
        </div>

        <div class="detail-topic">
          <h3>📚 বিস্তারিত আলোচনা</h3>
          <p>${escapeHTML(chapter.discussion)}</p>
        </div>

        <div class="detail-topic">
          <h3>🔤 গুরুত্বপূর্ণ শব্দার্থ</h3>
          <div class="word-list">
            ${(chapter.words || []).map(word => `
              <p><strong>${escapeHTML(word[0])}:</strong> ${escapeHTML(word[1])}</p>
            `).join("")}
          </div>
        </div>

        <div class="detail-topic">
          <h3>📝 অধ্যায়ভিত্তিক MCQ</h3>
          <p>এই অধ্যায়ের প্রশ্ন দিয়ে অনুশীলন করো।</p>
          <button class="primary-btn" onclick="startChapterPractice()">
            Start Chapter MCQ →
          </button>
        </div>

        <div class="detail-topic">
          <h3>✏️ CQ প্রস্তুতি</h3>
          ${(chapter.cq || []).map((cq, index) => `
            <div class="cq-item">
              <strong>প্রশ্ন ${index + 1}:</strong>
              <p>${escapeHTML(cq.question)}</p>
              <details>
                <summary>উত্তরের নির্দেশনা দেখো</summary>
                <p>${escapeHTML(cq.hint)}</p>
              </details>
            </div>
          `).join("")}
        </div>

      ` : `
        <div class="detail-topic">
          <h3>📖 পাঠ পরিচিতি</h3>
          <p>এই অধ্যায়ের বিস্তারিত নোট পরবর্তী আপডেটে যোগ করা হবে।</p>
        </div>
        <div class="detail-topic">
          <h3>📝 অধ্যায়ভিত্তিক MCQ</h3>
          <p>এই কবিতার MCQ ও ব্যাখ্যা পরবর্তী আপডেটে যোগ করা হবে।</p>
        </div>
      `}

      <p class="muted">
        শিক্ষাসহায়ক নিজস্ব নোট। পরীক্ষার প্রস্তুতির সময় মূল পাঠ্যবইয়ের সঙ্গে মিলিয়ে পড়বে।
      </p>

    </div>
  `;

  hideAllPages();
  page.classList.add("active");
  setActiveNav("chapter");
  scrollTop();
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

  let saved = readStorage(STORAGE.saved, []);
  const index = saved.findIndex(item => item.title === currentChapter.title);

  if (index >= 0) saved.splice(index, 1);
  else saved.push(currentChapter);

  writeStorage(STORAGE.saved, saved);
  openChapterDetails(currentChapter, currentChapter.section);
  updateProgress();
}

function toggleCompletedCurrent() {
  if (!currentChapter) return;

  let completed = readStorage(STORAGE.completed, []);
  const index = completed.indexOf(currentChapter.title);

  if (index >= 0) completed.splice(index, 1);
  else completed.push(currentChapter.title);

  writeStorage(STORAGE.completed, completed);
  openChapterDetails(currentChapter, currentChapter.section);
  updateProgress();
}

/* =========================================
   SAVED CHAPTERS
========================================= */

function renderSaved() {
  const container = document.getElementById("savedList");
  if (!container) return;

  const saved = readStorage(STORAGE.saved, []);
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
    author.style.display = "block";
    author.style.color = "var(--muted)";

    info.append(title, author);

    const remove = document.createElement("button");
    remove.textContent = "✕";
    remove.className = "remove-save";

    remove.addEventListener("click", event => {
      event.stopPropagation();

      writeStorage(
        STORAGE.saved,
        readStorage(STORAGE.saved, []).filter(item => item.title !== chapter.title)
      );

      renderSaved();
      updateProgress();
    });

    item.append(info, remove);
    item.addEventListener("click", () => openChapterDetails(chapter, chapter.section));
    container.appendChild(item);
  });
}

/* =========================================
   GENERAL QUESTION BANK 1 — MCQ
========================================= */

const practiceQuestions = [
  {
    question: "বাংলা সাহিত্যের প্রথম সার্থক উপন্যাস কোনটি?",
    options: ["দুর্গেশনন্দিনী", "কপালকুণ্ডলা", "বিষবৃক্ষ", "কৃষ্ণকান্তের উইল"],
    answer: 0,
    explanation: "দুর্গেশনন্দিনী বাংলা সাহিত্যের প্রথম সার্থক উপন্যাস হিসেবে পরিচিত।"
  },
  {
    question: "বাংলা সাহিত্যের চলিত রীতির প্রতিষ্ঠায় কার অবদান বিশেষভাবে উল্লেখযোগ্য?",
    options: ["প্রমথ চৌধুরী", "বঙ্কিমচন্দ্র", "বিদ্যাসাগর", "মাইকেল মধুসূদন"],
    answer: 0,
    explanation: "প্রমথ চৌধুরী বাংলা গদ্যে চলিত রীতির প্রতিষ্ঠায় গুরুত্বপূর্ণ ভূমিকা রাখেন।"
  },
  {
    question: "বাংলাদেশের জাতীয় কবি কে?",
    options: ["রবীন্দ্রনাথ ঠাকুর", "কাজী নজরুল ইসলাম", "জসীমউদ্দীন", "সুকান্ত ভট্টাচার্য"],
    answer: 1,
    explanation: "কাজী নজরুল ইসলাম বাংলাদেশের জাতীয় কবি।"
  },
  {
    question: "গীতাঞ্জলি কাব্যগ্রন্থের রচয়িতা কে?",
    options: ["জীবনানন্দ দাশ", "রবীন্দ্রনাথ ঠাকুর", "কাজী নজরুল ইসলাম", "সুফিয়া কামাল"],
    answer: 1,
    explanation: "গীতাঞ্জলি রবীন্দ্রনাথ ঠাকুরের বিখ্যাত কাব্যগ্রন্থ।"
  },
  {
    question: "পল্লীকবি বলা হয় কাকে?",
    options: ["জসীমউদ্দীন", "আল মাহমুদ", "ফররুখ আহমদ", "শামসুর রাহমান"],
    answer: 0,
    explanation: "জসীমউদ্দীন পল্লীকবি নামে পরিচিত।"
  }
];

/* =========================================
   GENERAL QUESTION BANK 2 — TIMER
========================================= */

const timedQuestions = [
  {
    question: "রবীন্দ্রনাথ ঠাকুর কত সালে নোবেল পুরস্কার পান?",
    options: ["১৯০৫", "১৯১১", "১৯১৩", "১৯২১"],
    answer: 2,
    explanation: "তিনি ১৯১৩ সালে সাহিত্যে নোবেল পুরস্কার লাভ করেন।"
  },
  {
    question: "বিলাসী গল্পের লেখক কে?",
    options: ["শরৎচন্দ্র", "রবীন্দ্রনাথ", "মানিক বন্দ্যোপাধ্যায়", "বিভূতিভূষণ"],
    answer: 0,
    explanation: "বিলাসী গল্পের লেখক শরৎচন্দ্র চট্টোপাধ্যায়।"
  },
  {
    question: "বিদ্রোহী কবিতার রচয়িতা কে?",
    options: ["সুকান্ত", "নজরুল", "জসীমউদ্দীন", "জীবনানন্দ"],
    answer: 1,
    explanation: "বিদ্রোহী কবিতার রচয়িতা কাজী নজরুল ইসলাম।"
  },
  {
    question: "নকশী কাঁথার মাঠ কার রচনা?",
    options: ["রবীন্দ্রনাথ", "জসীমউদ্দীন", "আল মাহমুদ", "ফররুখ আহমদ"],
    answer: 1,
    explanation: "নকশী কাঁথার মাঠ জসীমউদ্দীনের বিখ্যাত কাব্য।"
  },
  {
    question: "আত্মচরিত রচনার লেখক কে?",
    options: ["বিদ্যাসাগর", "বঙ্কিমচন্দ্র", "প্রমথ চৌধুরী", "আবুল ফজল"],
    answer: 0,
    explanation: "আত্মচরিত ঈশ্বরচন্দ্র বিদ্যাসাগরের আত্মজীবনীমূলক রচনা।"
  }
];

/* =========================================
   GENERAL QUESTION BANK 3 — QUICK QUIZ
========================================= */

const quickQuestions = [
  {
    question: "অপরিচিতা গল্পের লেখক কে?",
    options: ["রবীন্দ্রনাথ ঠাকুর", "শরৎচন্দ্র", "মানিক বন্দ্যোপাধ্যায়", "বিভূতিভূষণ"],
    answer: 0,
    explanation: "অপরিচিতা গল্পের লেখক রবীন্দ্রনাথ ঠাকুর।"
  },
  {
    question: "নেকলেস গল্পের মূল লেখক কে?",
    options: ["ভিক্টর হুগো", "গী দ্য মোপাসাঁ", "আলবেয়ার কামু", "শরৎচন্দ্র"],
    answer: 1,
    explanation: "নেকলেস গল্পের মূল লেখক গী দ্য মোপাসাঁ।"
  },
  {
    question: "সোনার তরী কার রচনা?",
    options: ["কাজী নজরুল", "রবীন্দ্রনাথ", "জীবনানন্দ", "সুকান্ত"],
    answer: 1,
    explanation: "সোনার তরী রবীন্দ্রনাথ ঠাকুরের কবিতা।"
  },
  {
    question: "মাসি-পিসি গল্পের লেখক কে?",
    options: ["মানিক বন্দ্যোপাধ্যায়", "শরৎচন্দ্র", "আবুল ফজল", "আনিসুজ্জামান"],
    answer: 0,
    explanation: "মাসি-পিসি গল্পের লেখক মানিক বন্দ্যোপাধ্যায়।"
  },
  {
    question: "সাম্যবাদী কবিতার কবি কে?",
    options: ["জীবনানন্দ দাশ", "কাজী নজরুল ইসলাম", "জসীমউদ্দীন", "সুফিয়া কামাল"],
    answer: 1,
    explanation: "সাম্যবাদী কবিতার কবি কাজী নজরুল ইসলাম।"
  }
];

/* =========================================
   CHAPTER PRACTICE
========================================= */

function startChapterPractice() {
  if (!currentChapter || !currentChapter.mcq?.length) {
    alert("এই অধ্যায়ের MCQ এখনো যুক্ত করা হয়নি।");
    return;
  }

  currentMode = "chapter";
  currentPractice = currentChapter.mcq.map(q => ({...q}));
  startQuiz();
}

/* =========================================
   START GENERAL QUIZ
========================================= */

function startPractice(mode = "mcq") {
  currentMode = mode;

  if (mode === "timer") {
    currentPractice = [...timedQuestions];
  } else if (mode === "quick") {
    currentPractice = [...quickQuestions];
  } else {
    currentPractice = [...practiceQuestions];
  }

  startQuiz();
}

/* =========================================
   QUIZ INITIALIZATION
========================================= */

function startQuiz() {
  clearInterval(quizTimer);

  currentQuestion = 0;
  currentScore = 0;
  quizAnswered = false;
  quizResultSaved = false;
  timeLeft = 60;

  showQuizPage();

  if (currentMode === "timer") {
    quizTimer = setInterval(() => {
      timeLeft--;

      const timer = document.getElementById("quizTimer");

      if (timer) {
        timer.textContent = "⏱ সময় বাকি: " + timeLeft + " সেকেন্ড";
      }

      if (timeLeft <= 0) {
        clearInterval(quizTimer);
        showQuizResult(true);
      }
    }, 1000);
  }
}

/* =========================================
   QUIZ PAGE
========================================= */

function showQuizPage() {
  let page = document.getElementById("quizPage");

  if (!page) {
    page = document.createElement("section");
    page.id = "quizPage";
    page.className = "page";
    document.body.appendChild(page);
  }

  hideAllPages();
  page.classList.add("active");
  setActiveNav("practice");

  renderQuestion();
  scrollTop();
}

/* =========================================
   RENDER QUESTION
========================================= */

function renderQuestion() {
  const page = document.getElementById("quizPage");
  if (!page) return;

  if (currentQuestion >= currentPractice.length) {
    showQuizResult();
    return;
  }

  quizAnswered = false;

  const q = currentPractice[currentQuestion];

  const modeTitle = {
    mcq: "MCQ PRACTICE",
    timer: "TIMER QUIZ",
    quick: "QUICK QUIZ",
    chapter: "CHAPTER PRACTICE"
  };

  page.innerHTML = `
    <div class="container">
      <button class="back" onclick="closeQuiz()">← ফিরে যাও</button>

      <div class="quiz-card">
        <p class="muted">${modeTitle[currentMode] || "QUIZ"}</p>

        ${currentMode === "timer"
          ? `<h3 id="quizTimer">⏱ সময় বাকি: ${timeLeft} সেকেন্ড</h3>`
          : ""}

        <p class="muted">
          প্রশ্ন ${currentQuestion + 1} / ${currentPractice.length}
        </p>

        <h2>${escapeHTML(q.question)}</h2>

        <div id="quizOptions"></div>
        <div id="quizFeedback"></div>

        <button id="nextQuestion"
          class="primary-btn"
          style="display:none"
          onclick="nextQuestion()">
          পরের প্রশ্ন →
        </button>
      </div>
    </div>
  `;

  const options = page.querySelector("#quizOptions");

  q.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.className = "quiz-option";
    button.textContent =
      String.fromCharCode(65 + index) + ". " + option;

    button.addEventListener("click", () => checkAnswer(index));
    options.appendChild(button);
  });
}

/* =========================================
   CHECK ANSWER
========================================= */

function checkAnswer(selected) {
  if (quizAnswered) return;

  const q = currentPractice[currentQuestion];
  if (!q) return;

  quizAnswered = true;

  document.querySelectorAll(".quiz-option").forEach((button, index) => {
    button.disabled = true;

    if (index === q.answer) {
      button.classList.add("quiz-correct");
    }

    if (index === selected && selected !== q.answer) {
      button.classList.add("quiz-wrong");
    }
  });

  const correct = selected === q.answer;

  if (correct) currentScore++;

  const feedback = document.getElementById("quizFeedback");

  if (feedback) {
    feedback.textContent =
      (correct ? "সঠিক উত্তর! " : "ভুল উত্তর। ") +
      (q.explanation || "ব্যাখ্যা এখনো যোগ করা হয়নি।");

    feedback.className = correct ? "quiz-correct" : "quiz-wrong";
  }

  const next = document.getElementById("nextQuestion");

  if (next) {
    next.style.display = "inline-block";
  }
}

/* =========================================
   NEXT QUESTION
========================================= */

function nextQuestion() {
  if (!quizAnswered) return;

  currentQuestion++;
  renderQuestion();
}

/* =========================================
   QUIZ RESULT
========================================= */

function showQuizResult(timeUp = false) {
  clearInterval(quizTimer);

  if (quizResultSaved) return;
  quizResultSaved = true;

  const page = document.getElementById("quizPage");
  if (!page) return;

  const total = currentPractice.length;

  const percent = total
    ? Math.round((currentScore / total) * 100)
    : 0;

  writeStorage(
    STORAGE.quiz,
    Number(readStorage(STORAGE.quiz, 0)) + 1
  );

  writeStorage(
    STORAGE.score,
    Number(readStorage(STORAGE.score, 0)) + currentScore
  );

  let message = "আরও অনুশীলন করো!";

  if (percent === 100) {
    message = "অসাধারণ! সব উত্তর সঠিক!";
  } else if (percent >= 60) {
    message = "ভালো হয়েছে! আরও উন্নতি করো।";
  }

  page.innerHTML = `
    <div class="container">
      <div class="quiz-card">
        <h2>${timeUp ? "⏰ সময় শেষ!" : "🎉 Quiz Completed!"}</h2>

        <h1>${currentScore} / ${total}</h1>

        <p>তোমার ফলাফল: ${percent}%</p>
        <p class="muted">${message}</p>

        <button class="primary-btn" onclick="retryQuiz()">
          আবার চেষ্টা করো
        </button>

        <button class="back" onclick="closeQuiz()">
          ফিরে যাও
        </button>
      </div>
    </div>
  `;

  updateProgress();
}

/* =========================================
   RETRY QUIZ
========================================= */

function retryQuiz() {
  if (currentMode === "chapter") {
    startChapterPractice();
  } else {
    startPractice(currentMode);
  }
}

/* =========================================
   CLOSE QUIZ
========================================= */

function closeQuiz() {
  clearInterval(quizTimer);

  const page = document.getElementById("quizPage");
  if (page) page.classList.remove("active");

  if (currentMode === "chapter" && currentChapter) {
    openChapterDetails(currentChapter, currentChapter.section);
  } else {
    showPage("practice");
  }
}

/* =========================================
   PROGRESS
========================================= */

function updateProgress() {
  const completed = readStorage(STORAGE.completed, []);
  const saved = readStorage(STORAGE.saved, []);
  const quiz = readStorage(STORAGE.quiz, 0);

  const completedEl = document.getElementById("completedCount");
  const quizEl = document.getElementById("quizCount");
  const savedEl = document.getElementById("savedCount");

  if (completedEl) completedEl.textContent = completed.length;
  if (quizEl) quizEl.textContent = quiz;
  if (savedEl) savedEl.textContent = saved.length;
}

/* =========================================
   APP INFO
========================================= */

function showAppInfo() {
  alert(
    "EDU VERSE\n" +
    "Your Personal HSC Learning World\n\n" +
    "বাংলাদেশের HSC শিক্ষার্থীদের জন্য একটি ব্যক্তিগত শিক্ষাসহায়ক অ্যাপ।"
  );
}

/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  updateProgress();
  renderSaved();

  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", filterSubjects);
  }
});
