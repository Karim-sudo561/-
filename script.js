const sequence = [
  "سبحان الله",
  "الحمد لله",
  "لا إله إلا الله",
  "الله أكبر",
  "ولا حول ولا قوة إلا بالله العلي العظيم"
];

const individualDhikr = [
  "سبحان الله وبحمده",
  "سبحان الله العظيم",
  "سبحان الله",
  "الحمد لله"
];

const STORAGE_KEY = "zekr_site_counts_v1";
const defaultState = {
  sequenceStep: 0,
  sequenceCycles: 0,
  istighfar: 0,
  individual: [0, 0, 0, 0]
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return { ...defaultState, individual: [...defaultState.individual] };
    return {
      sequenceStep: Number.isInteger(saved.sequenceStep) && saved.sequenceStep >= 0 && saved.sequenceStep < sequence.length ? saved.sequenceStep : 0,
      sequenceCycles: Math.max(0, Number(saved.sequenceCycles) || 0),
      istighfar: Math.max(0, Number(saved.istighfar) || 0),
      individual: individualDhikr.map((_, i) => Math.max(0, Number(saved.individual?.[i]) || 0))
    };
  } catch {
    return { ...defaultState, individual: [...defaultState.individual] };
  }
}

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  render();
}

function render() {
  document.getElementById("sequenceText").textContent = sequence[state.sequenceStep];
  document.getElementById("sequenceProgress").textContent = `الذكر ${state.sequenceStep + 1} من ${sequence.length}`;
  document.getElementById("sequenceCount").textContent = state.sequenceCycles.toLocaleString("ar-EG");
  document.getElementById("istighfarCount").textContent = state.istighfar.toLocaleString("ar-EG");

  const cards = document.getElementById("individualCards");
  cards.innerHTML = "";

  individualDhikr.forEach((text, index) => {
    const card = document.createElement("article");
    card.className = "zikr-card";

    const title = document.createElement("h3");
    title.textContent = text;

    const count = document.createElement("div");
    count.className = "count";
    count.textContent = state.individual[index].toLocaleString("ar-EG");

    const label = document.createElement("span");
    label.className = "count-label";
    label.textContent = "عدد مرات الذكر";

    const button = document.createElement("button");
    button.className = "small-btn";
    button.textContent = "سبّح الله";
    button.addEventListener("click", () => {
      state.individual[index]++;
      saveState();
    });

    card.append(title, count, label, button);
    cards.appendChild(card);
  });
}

document.getElementById("nextDhikr").addEventListener("click", () => {
  if (state.sequenceStep === sequence.length - 1) {
    state.sequenceStep = 0;
    state.sequenceCycles++;
    document.getElementById("toast").textContent = "تقبّل الله منك، اكتملت دورة وبدأت دورة جديدة.";
  } else {
    state.sequenceStep++;
    document.getElementById("toast").textContent = "";
  }
  saveState();
});

document.getElementById("istighfarButton").addEventListener("click", () => {
  state.istighfar++;
  document.getElementById("toast").textContent = "استغفر الله العظيم.";
  saveState();
});

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(item => item.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(panel => panel.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.target).classList.add("active");
    document.getElementById("toast").textContent = "";
  });
});

document.getElementById("resetAll").addEventListener("click", () => {
  const confirmed = confirm("هل تريد تصفير جميع العدادات والبدء من جديد؟");
  if (!confirmed) return;

  state = {
    sequenceStep: 0,
    sequenceCycles: 0,
    istighfar: 0,
    individual: [0, 0, 0, 0]
  };

  document.getElementById("toast").textContent = "تم تصفير العدادات.";
  saveState();
});

render();
