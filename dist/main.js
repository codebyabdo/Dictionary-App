var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const form = document.getElementById("search-form");
const input = document.getElementById("word-input");
const historyContainer = document.getElementById("history");
const resultContainer = document.getElementById("result-container");
let arrHistory = JSON.parse(localStorage.getItem("history") || "[]");
const themeToggleBtn = document.getElementById("theme-toggle");
themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
        themeToggleBtn.innerHTML = `<i class="fa-regular fa-lightbulb"></i>`;
    }
    else {
        themeToggleBtn.innerHTML = `<i class="fa-solid fa-lightbulb"></i>`;
    }
    saveTasks();
});
const updateHistory = (history) => {
    const limitedHistory = history.slice(0, 5);
    localStorage.setItem("history", JSON.stringify(limitedHistory));
    historyContainer.innerHTML = `<ul>
    ${history
        .map((word) => `<li class="history-item" style="cursor: pointer;">${word}</li>`)
        .join("")}
  </ul>`;
    const items = document.querySelectorAll(".history-item");
    items.forEach((item) => {
        item.addEventListener("click", () => {
            const word = item.textContent;
            if (word) {
                input.value = word;
                form.dispatchEvent(new Event("submit"));
            }
        });
    });
};
window.onload = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeToggleBtn.innerHTML = `<i class="fa-regular fa-lightbulb"></i>`;
    }
    else {
        document.body.classList.remove("dark-theme");
        themeToggleBtn.innerHTML = `<i class="fa-solid fa-lightbulb"></i>`;
    }
    updateHistory(arrHistory);
};
const saveTasks = () => {
    if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
    }
    else {
        localStorage.setItem("theme", "light");
    }
};
form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    event.preventDefault();
    const word = input.value.trim();
    if (!word)
        return;
    arrHistory = arrHistory.filter((w) => w !== word);
    arrHistory.unshift(word);
    updateHistory(arrHistory);
    resultContainer.innerHTML = "<p>⏳ Loading...</p>";
    try {
        const response = yield fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            arrHistory.splice(arrHistory.indexOf(word), 1);
            throw new Error("Word not found");
        }
        const data = yield response.json();
        const entry = data[0];
        resultContainer.innerHTML = `<ul>
    <li class="Word" >${((_b = (_a = entry.phonetics) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.audio)
            ? `<i class="fa-solid fa-volume-high"></i>`
            : ""} ${entry.word}</li>
      <li><strong>Phonetic:</strong> ${entry.phonetic || "N/A"}</li>
      <li><strong>Definition:</strong> ${entry.meanings[0].definitions[0].definition}</li>
      ${entry.meanings[0].definitions[0].example
            ? `<li><strong>Example:</strong> "${entry.meanings[0].definitions[0].example}"</li>`
            : ""}
      ${((_d = (_c = entry.phonetics) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.audio)
            ? `<li>
              <audio id="word-audio" controls src="${((_f = (_e = entry.phonetics) === null || _e === void 0 ? void 0 : _e[1]) === null || _f === void 0 ? void 0 : _f.audio)
                ? (_h = (_g = entry.phonetics) === null || _g === void 0 ? void 0 : _g[1]) === null || _h === void 0 ? void 0 : _h.audio
                : (_k = (_j = entry.phonetics) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.audio}"></audio>
          </li>`
            : ""}
    </ul>
    `;
        const icon = document.querySelector(".fa-volume-high");
        const audio = document.querySelector("#word-audio");
        icon === null || icon === void 0 ? void 0 : icon.addEventListener("click", () => {
            audio === null || audio === void 0 ? void 0 : audio.play();
        });
    }
    catch (err) {
        resultContainer.innerHTML = `<p style="color: red;">❌ Word not found or error fetching data.</p>`;
    }
}));
export {};
//# sourceMappingURL=main.js.map