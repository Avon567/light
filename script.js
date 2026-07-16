const appShell = document.getElementById("appShell");
const flashBtn = document.getElementById("flashBtn");
const lockBtn = document.getElementById("lockBtn");
const statusPill = document.getElementById("statusPill");
const hintText = document.getElementById("hintText");
const beamLayer = document.getElementById("beamLayer");
const brightnessSlider = document.getElementById("brightnessSlider");
const brightnessLabel = document.getElementById("brightnessLabel");
const sheetBackdrop = document.getElementById("sheetBackdrop");
const offModal = document.getElementById("offModal");
const paymentModal = document.getElementById("paymentModal");
const upgradeBtn = document.getElementById("upgradeBtn");
const cancelBtn = document.getElementById("cancelBtn");
const waitBtn = document.getElementById("waitBtn");
const countdownWrap = document.getElementById("countdownWrap");
const countdownValue = document.getElementById("countdownValue");
const paymentOkBtn = document.getElementById("paymentOkBtn");
const paymentPanel = document.getElementById("paymentPanel");
const paymentPanelTitle = document.getElementById("paymentPanelTitle");
const paymentPanelBody = document.getElementById("paymentPanelBody");
const paymentActionBtn = document.getElementById("paymentActionBtn");
const paymentFields = document.getElementById("paymentFields");
const paymentMethods = document.querySelectorAll(".payment-method");
const paymentModeLabel = document.getElementById("paymentModeLabel");
const modePills = document.querySelectorAll(".mode-pill");
const modeLabel = document.getElementById("modeLabel");
const toast = document.getElementById("toast");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const beamSweep = document.getElementById("beamSweep");

let isOn = false;
let isLocked = false;
let isCounting = false;
let countdown = 10;
let timer = null;
let audioCtx = null;
let selectedPayment = "upi";
let currentMode = "beam";
let sosTimer = null;
let isLightTheme = false;

function initAudio() {
  if (typeof window === "undefined") return;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      audioCtx = null;
    }
  }

  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
}

function playTone(type) {
  initAudio();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const tones = {
    tap: { freq: [520, 760], dur: 0.06, type: "triangle", amp: 0.03 },
    on: { freq: [680, 980], dur: 0.14, type: "sine", amp: 0.07 },
    off: { freq: [520, 340], dur: 0.16, type: "sine", amp: 0.06 },
    success: { freq: [880, 1320], dur: 0.18, type: "sine", amp: 0.08 },
  };
  const tone = tones[type];
  if (!tone) return;

  osc.type = tone.type;
  osc.frequency.setValueAtTime(tone.freq[0], now);
  osc.frequency.exponentialRampToValueAtTime(tone.freq[1], now + tone.dur);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(tone.amp, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.dur);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + tone.dur + 0.02);
}

function getBrightnessValue() {
  return Math.max(0.3, Math.min(1, Number(brightnessSlider.value) / 100));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.add("hidden"), 1800);
}

function triggerHaptic(pattern = 8) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

function setPressedState(el, pressed) {
  if (!el) return;
  el.classList.toggle("pressed", pressed);
}

function attachFeedback(el) {
  if (!el) return;
  el.addEventListener("pointerdown", () => {
    setPressedState(el, true);
    triggerHaptic(8);
  });
  const clear = () => setPressedState(el, false);
  el.addEventListener("pointerup", clear);
  el.addEventListener("pointerleave", clear);
  el.addEventListener("pointercancel", clear);
}

function applyTheme() {
  document.body.classList.toggle("light-theme", isLightTheme);
  appShell.classList.toggle("light-theme", isLightTheme);
  themeToggleBtn.textContent = isLightTheme ? "☀️" : "🌙";
  themeToggleBtn.title = isLightTheme ? "Switch to dark theme" : "Switch to light theme";
}

function updateVisuals() {
  const sliderValue = Number(brightnessSlider.value);
  const brightness = getBrightnessValue();
  const isActive = isOn && !isLocked;

  brightnessLabel.textContent = `${sliderValue}%`;
  appShell.style.setProperty("--beamBrightness", brightness);
  appShell.style.setProperty("--torchOpacity", isActive ? brightness : 0);
  appShell.style.setProperty("--glowOpacity", isActive ? Math.max(0.14, brightness * 0.6) : 0);
  appShell.style.setProperty("--haloOpacity", isActive ? Math.max(0.1, brightness * 0.4) : 0);

  beamLayer.style.opacity = isActive ? String(brightness) : "0";
  beamLayer.style.filter = isActive
    ? `brightness(${1 + brightness}) saturate(${0.95 + brightness * 0.35})`
    : "brightness(0)";
  beamSweep.style.opacity = isActive ? String(Math.max(0.2, brightness * 0.55)) : "0";
  beamSweep.style.setProperty("--beamSweepBrightness", String(1 + brightness * 0.2));
  beamSweep.style.setProperty("--beamSweepOpacity", String(Math.max(0.2, brightness * 0.55)));

  appShell.classList.toggle("on", isActive);
  appShell.classList.toggle("locked", isLocked);
  appShell.classList.toggle("pulse-mode", isActive && currentMode === "pulse");
  appShell.classList.toggle("sos-mode", isActive && currentMode === "sos");

  statusPill.textContent = isActive ? (currentMode === "sos" ? "SOS Mode" : currentMode === "pulse" ? "Pulse Mode" : "Torch On") : "Torch Off";
  hintText.textContent = isActive ? "Tap again to adjust or turn off" : "Tap the torch to turn it on";
  lockBtn.setAttribute("aria-label", isLocked ? "Unlock torch controls" : "Lock torch controls");
  lockBtn.title = isLocked ? "Unlock" : "Lock";
  lockBtn.textContent = isLocked ? "🔓" : "🔒";
  flashBtn.style.pointerEvents = isLocked ? "none" : "auto";
  flashBtn.style.opacity = isLocked ? "0.7" : "1";
}

function stopSos() {
  if (sosTimer) {
    clearInterval(sosTimer);
    sosTimer = null;
  }
}

function startSos() {
  stopSos();
  let blink = true;
  sosTimer = setInterval(() => {
    setTorch(blink);
    blink = !blink;
  }, 360);
}

function setTorch(state) {
  isOn = state;
  if (!state) {
    stopSos();
    resetCountdown();
  }
  if (isOn) {
    playTone("on");
  } else {
    playTone("off");
  }
  updateVisuals();
}

function openModal(modal) {
  sheetBackdrop.classList.remove("hidden");
  modal.classList.remove("modal-hidden");
  modal.setAttribute("aria-hidden", "false");
  modal.style.animation = "sheetIn 0.28s ease";
}

function closeModal(modal) {
  modal.classList.add("modal-hidden");
  modal.setAttribute("aria-hidden", "true");
  if (document.querySelectorAll(".modal:not(.modal-hidden)").length === 0) {
    sheetBackdrop.classList.add("hidden");
  }
}

function updateWaitButton(label, smallText) {
  const labelEl = waitBtn.querySelector("span");
  const smallEl = waitBtn.querySelector("small");
  if (labelEl) labelEl.textContent = label;
  if (smallEl) smallEl.textContent = smallText;
}

function resetCountdown() {
  clearInterval(timer);
  timer = null;
  countdown = 10;
  isCounting = false;
  countdownWrap.classList.add("hidden");
  waitBtn.disabled = false;
  updateWaitButton("Wait 10 Seconds", "Start a timed shutdown");
}

function setMode(mode) {
  currentMode = mode;
  modeLabel.textContent = mode === "pulse" ? "Pulse" : mode === "sos" ? "SOS" : "Beam";
  modePills.forEach((pill) => pill.classList.toggle("active", pill.dataset.mode === mode));

  if (isOn && mode === "sos") {
    startSos();
  } else {
    stopSos();
  }

  updateVisuals();
  showToast(mode === "pulse" ? "Pulse mode enabled" : mode === "sos" ? "SOS mode enabled" : "Beam mode enabled");
}

function startCountdown() {
  if (isCounting) return;
  isCounting = true;
  countdown = 10;
  countdownWrap.classList.remove("hidden");
  waitBtn.disabled = true;
  updateWaitButton("Auto-off active", "Shutting down soon");
  countdownValue.textContent = countdown;

  timer = setInterval(() => {
    countdown -= 1;
    countdownValue.textContent = countdown;
    countdownValue.style.animation = "none";
    void countdownValue.offsetWidth;
    countdownValue.style.animation = "pop 0.4s ease";
    if (countdown <= 0) {
      clearInterval(timer);
      timer = null;
      playTone("off");
      closeModal(offModal);
      resetCountdown();
      setTorch(false);
    }
  }, 1000);
}

function openPaymentSheet() {
  openModal(paymentModal);
  setPaymentMethod(selectedPayment);
}

function setPaymentMethod(method) {
  const safeMethod = detailsMap[method] ? method : "upi";
  selectedPayment = safeMethod;
  paymentModeLabel.textContent = {
    upi: "UPI checkout selected",
    card: "Card checkout selected",
    wallet: "Wallet checkout selected",
    qr: "QR checkout selected",
    netbanking: "Net banking selected",
    redeem: "Redeem code selected",
  }[safeMethod];

  paymentMethods.forEach((btn) => btn.classList.toggle("active", btn.dataset.method === safeMethod));

  const details = {
    card: {
      title: "Add Card",
      body: "Enter card details to continue with secure checkout.",
      fields: '<input id="paymentInput1" placeholder="Card Number" /><input id="paymentInput2" placeholder="MM / YY / CVV" />',
      action: "Add Card",
    },
    upi: {
      title: "Pay with UPI",
      body: "Enter UPI ID and complete payment instantly.",
      fields: '<input id="paymentInput1" placeholder="UPI ID" /><input id="paymentInput2" placeholder="Mobile Number (optional)" />',
      action: "Pay Now",
    },
    wallet: {
      title: "Wallet",
      body: "Choose a wallet and continue with balance payment.",
      fields: '<input id="paymentInput1" placeholder="Wallet Name" /><input id="paymentInput2" placeholder="Mobile Number" />',
      action: "Continue",
    },
    qr: {
      title: "Pay with QR",
      body: "Scan the QR and complete the payment.",
      fields: '<div class="qr-box">▣</div><input id="paymentInput1" placeholder="Reference Note (optional)" />',
      action: "Scan & Pay",
    },
    netbanking: {
      title: "Net Banking",
      body: "Select bank and user ID to proceed.",
      fields: '<input id="paymentInput1" placeholder="Bank Name" /><input id="paymentInput2" placeholder="User ID" />',
      action: "Continue",
    },
    redeem: {
      title: "Redeem Code",
      body: "Enter your coupon or voucher code.",
      fields: '<input id="paymentInput1" placeholder="Promo Code" /><input id="paymentInput2" placeholder="Mobile Number" />',
      action: "Redeem",
    },
  };

  const item = details[safeMethod];
  paymentPanel.classList.remove("hidden");
  paymentPanelTitle.textContent = item.title;
  paymentPanelBody.textContent = item.body;
  paymentFields.innerHTML = item.fields;
  paymentActionBtn.querySelector("span").textContent = item.action;
  paymentActionBtn.querySelector("small").textContent = "Complete checkout";
}

const detailsMap = {
  upi: true,
  card: true,
  wallet: true,
  qr: true,
  netbanking: true,
  redeem: true,
};

flashBtn.addEventListener("click", () => {
  if (isLocked) return;
  playTone("tap");
  triggerHaptic(12);
  if (!isOn) {
    setTorch(true);
    if (currentMode === "sos") startSos();
    return;
  }
  openModal(offModal);
});

lockBtn.addEventListener("click", () => {
  playTone("tap");
  isLocked = !isLocked;
  updateVisuals();
});

brightnessSlider.addEventListener("input", () => {
  if (isLocked) return;
  updateVisuals();
});

brightnessSlider.addEventListener("change", () => {
  playTone("tap");
  updateVisuals();
});

upgradeBtn.addEventListener("click", () => {
  playTone("tap");
  closeModal(offModal);
  openPaymentSheet();
});

cancelBtn.addEventListener("click", () => {
  playTone("tap");
  closeModal(offModal);
  resetCountdown();
});

waitBtn.addEventListener("click", () => {
  playTone("tap");
  startCountdown();
});

paymentMethods.forEach((btn) => {
  btn.addEventListener("click", () => {
    playTone("tap");
    triggerHaptic(10);
    setPaymentMethod(btn.dataset.method);
  });
});

modePills.forEach((pill) => {
  pill.addEventListener("click", () => {
    playTone("tap");
    triggerHaptic(10);
    setMode(pill.dataset.mode);
  });
});

themeToggleBtn.addEventListener("click", () => {
  playTone("tap");
  triggerHaptic(10);
  isLightTheme = !isLightTheme;
  applyTheme();
  showToast(isLightTheme ? "Light theme enabled" : "Dark theme enabled");
});

paymentActionBtn.addEventListener("click", () => {
  playTone("success");
  window.alert(`${paymentPanelTitle.textContent} completed successfully.`);
});

paymentOkBtn.addEventListener("click", () => {
  playTone("tap");
  closeModal(paymentModal);
});

sheetBackdrop.addEventListener("click", () => {
  if (!paymentModal.classList.contains("modal-hidden")) closeModal(paymentModal);
  if (!offModal.classList.contains("modal-hidden")) closeModal(offModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal(paymentModal);
    closeModal(offModal);
    resetCountdown();
  }
  if ((e.key === " " || e.key === "Enter") && document.activeElement === document.body && !isLocked) {
    e.preventDefault();
    flashBtn.click();
  }
});

document.querySelectorAll("button, .payment-method, .mode-pill").forEach(attachFeedback);
attachFeedback(flashBtn);

brightnessSlider.value = "100";
setPaymentMethod("upi");
setMode("beam");
applyTheme();
updateVisuals();
resetCountdown();
