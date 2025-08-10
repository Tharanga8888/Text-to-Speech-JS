const speakBtn = document.getElementById("speakBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const cancelBtn = document.getElementById("cancelBtn");
const textInput = document.getElementById("textInput");
const message = document.getElementById("message");
const voiceSelect = document.getElementById("voiceSelect");
const rateInput = document.getElementById("rate");
const pitchInput = document.getElementById("pitch");
const rateValue = document.getElementById("rateValue");
const pitchValue = document.getElementById("pitchValue");

let voices = [];
let utterance;

function populateVoices() {
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = "";
  voices.forEach((voice, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${voice.name} (${voice.lang})${voice.default ? " — Default" : ""}`;
    voiceSelect.appendChild(option);
  });
}

function updateRatePitchLabels() {
  rateValue.textContent = rateInput.value;
  pitchValue.textContent = pitchInput.value;
}

function resetButtons() {
  speakBtn.disabled = false;
  pauseBtn.disabled = true;
  resumeBtn.disabled = true;
  cancelBtn.disabled = true;
}

function speakText() {
  if (!textInput.value.trim()) {
    message.textContent = "Please enter some text to speak.";
    return;
  }
  if (!('speechSynthesis' in window)) {
    message.textContent = "Sorry, your browser does not support Speech Synthesis.";
    return;
  }

  if (speechSynthesis.speaking) {
    message.textContent = "Already speaking. Please wait or cancel.";
    return;
  }

  utterance = new SpeechSynthesisUtterance(textInput.value);
  utterance.voice = voices[voiceSelect.value];
  utterance.rate = parseFloat(rateInput.value);
  utterance.pitch = parseFloat(pitchInput.value);

  utterance.onstart = () => {
    message.textContent = "Speaking...";
    speakBtn.disabled = true;
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
    cancelBtn.disabled = false;
  };
  utterance.onpause = () => {
    message.textContent = "Paused.";
    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
  };
  utterance.onresume = () => {
    message.textContent = "Resumed speaking.";
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
  };
  utterance.onend = () => {
    message.textContent = "Speech ended.";
    resetButtons();
  };
  utterance.onerror = (e) => {
    message.textContent = "An error occurred: " + e.error;
    resetButtons();
  };

  speechSynthesis.speak(utterance);
}

speakBtn.addEventListener("click", speakText);

pauseBtn.addEventListener("click", () => {
  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    speechSynthesis.pause();
  }
});

resumeBtn.addEventListener("click", () => {
  if (speechSynthesis.paused) {
    speechSynthesis.resume();
  }
});

cancelBtn.addEventListener("click", () => {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    message.textContent = "Speech cancelled.";
    resetButtons();
  }
});

rateInput.addEventListener("input", () => {
  updateRatePitchLabels();
});

pitchInput.addEventListener("input", () => {
  updateRatePitchLabels();
});

window.speechSynthesis.onvoiceschanged = populateVoices;

populateVoices();
updateRatePitchLabels();
resetButtons();
