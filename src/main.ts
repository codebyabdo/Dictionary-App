import DictionaryResponse from "./types";

const form = document.getElementById("search-form") as HTMLFormElement;
const input = document.getElementById("word-input") as HTMLInputElement;
const historyContainer = document.getElementById("history") as HTMLDivElement;
const resultContainer = document.getElementById(
  "result-container"
) as HTMLDivElement;

// Initialize history with empty array if not found in localStorage

let arrHistory: Array<string> = JSON.parse(
  localStorage.getItem("history") || "[]"
);

const themeToggleBtn = document.getElementById(
  "theme-toggle"
) as HTMLButtonElement;
// Add an event listener to the theme toggle button
themeToggleBtn.addEventListener("click", () => {
  // Toggle the 'dark-theme' class on the body
  document.body.classList.toggle("dark-theme");
  // Change the button text based on the current theme
  if (document.body.classList.contains("dark-theme")) {
    themeToggleBtn.innerHTML = `<i class="fa-regular fa-lightbulb"></i>`; // Switch to light theme
  } else {
    themeToggleBtn.innerHTML = `<i class="fa-solid fa-lightbulb"></i>`; // Switch to dark theme
  }
  saveTasks();
});

const updateHistory = (history: string[]) => {
  // Limit history to 5 items by taking the first 5
  const limitedHistory = history.slice(0, 5);
  localStorage.setItem("history", JSON.stringify(limitedHistory));

  historyContainer.innerHTML = `<ul>
    ${history
      .map(
        (word) =>
          `<li class="history-item" style="cursor: pointer;">${word}</li>`
      )
      .join("")}
  </ul>`;

  // Add click event to each word in history
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
    themeToggleBtn.innerHTML = `<i class="fa-regular fa-lightbulb"></i>`; // Switch to light theme
  } else {
    document.body.classList.remove("dark-theme");
    themeToggleBtn.innerHTML = `<i class="fa-solid fa-lightbulb"></i>`; // Switch to dark theme
  }
  updateHistory(arrHistory);
};

const saveTasks = () => {
  // add dark theme to localStorage
  if (document.body.classList.contains("dark-theme")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const word = input.value.trim();
  if (!word) return;

  // Update history - add word if not present, or move to front if present
  arrHistory = arrHistory.filter((w) => w !== word); // Remove if already exists
  arrHistory.unshift(word); // Add to beginning
  updateHistory(arrHistory);

  resultContainer.innerHTML = "<p>⏳ Loading...</p>";

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!response.ok) {
      arrHistory.splice(arrHistory.indexOf(word), 1);
      throw new Error("Word not found");
    }

    const data: DictionaryResponse[] = await response.json();
    const entry = data[0];

    // const phoneticWithAudio = entry.phonetics?.find((p) => p.audio);

    resultContainer.innerHTML = `<ul>
    <li class="Word" >${
      entry.phonetics?.[0]?.audio
        ? `<i class="fa-solid fa-volume-high"></i>`
        : ""
    } ${entry.word}</li>
      <li><strong>Phonetic:</strong> ${entry.phonetic || "N/A"}</li>
      <li><strong>Definition:</strong> ${
        entry.meanings[0].definitions[0].definition
      }</li>
      ${
        entry.meanings[0].definitions[0].example
          ? `<li><strong>Example:</strong> "${entry.meanings[0].definitions[0].example}"</li>`
          : ""
      }
      ${
        entry.phonetics?.[0]?.audio
          ? `<li>
              <audio id="word-audio" controls src="${
                entry.phonetics?.[1]?.audio
                  ? entry.phonetics?.[1]?.audio
                  : entry.phonetics?.[0]?.audio
              }"></audio>
          </li>`
          : ""
      }
    </ul>
    `;

    // Add audio playback if available
    const icon = document.querySelector(".fa-volume-high");
    const audio = document.querySelector("#word-audio") as HTMLAudioElement;

    icon?.addEventListener("click", () => {
      audio?.play();
    });
  } catch (err) {
    resultContainer.innerHTML = `<p style="color: red;">❌ Word not found or error fetching data.</p>`;
  }
});
