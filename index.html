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

let isOn = false;
let isLocked = false;
let isCounting = false;
let countdown = 10;
let timer = null;
let audioCtx = null;
let selectedPayment = "upi";

function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function playTone(type) {
  initAudio();
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

function updateVisuals() {
  const sliderValue = Number(brightnessSlider.value);
  const brightness = getBrightnessValue();

  brightnessLabel.textContent = `${sliderValue}%`;
  appShell.style.setProperty("--beamBrightness", brightness);
  appShell.style.setProperty("--torchOpacity", isOn ? brightness : 0);
  appShell.style.setProperty("--glowOpacity", isOn ? Math.max(0.14, brightness * 0.6) : 0);
  appShell.style.setProperty("--haloOpacity", isOn ? Math.max(0.1, brightness * 0.4) : 0);

  beamLayer.style.opacity = isOn ? String(brightness) : "0";
  beamLayer.style.filter = isOn
    ? `brightness(${1 + brightness}) saturate(${0.95 + brightness * 0.35})`
    : "brightness(0)";

  appShell.classList.toggle("on", isOn);

  statusPill.textContent = isOn ? "Torch On" : "Torch Off";
  hintText.textContent = isOn ? "Tap the torch to turn it off" : "Tap the torch to turn it on";
  lockBtn.setAttribute("aria-label", isLocked ? "Unlock torch controls" : "Lock torch controls");
  lockBtn.title = isLocked ? "Unlock" : "Lock";
  flashBtn.style.pointerEvents = isLocked ? "none" : "auto";
  flashBtn.style.opacity = isLocked ? "0.7" : "1";
}

function setTorch(state) {
  isOn = state;
  if (isOn) playTone("on");
  updateVisuals();
  if (!isOn) playTone("off");
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

function resetCountdown() {
  clearInterval(timer);
  timer = null;
  countdown = 10;
  isCounting = false;
  countdownWrap.classList.add("hidden");
  waitBtn.disabled = false;
  waitBtn.querySelector("span").textContent = "Wait 10 Seconds";
}

function startCountdown() {
  if (isCounting) return;
  isCounting = true;
  countdown = 10;
  countdownWrap.classList.remove("hidden");
  waitBtn.disabled = true;
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
  selectedPayment = method;
  paymentModeLabel.textContent = {
    upi: "UPI checkout selected",
    card: "Card checkout selected",
    wallet: "Wallet checkout selected",
    qr: "QR checkout selected",
    netbanking: "Net banking selected",
    redeem: "Redeem code selected",
  }[method];

  paymentMethods.forEach((btn) => btn.classList.toggle("active", btn.dataset.method === method));

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

  const item = details[method];
  paymentPanel.classList.remove("hidden");
  paymentPanelTitle.textContent = item.title;
  paymentPanelBody.textContent = item.body;
  paymentFields.innerHTML = item.fields;
  paymentActionBtn.querySelector("span").textContent = item.action;
  paymentActionBtn.querySelector("small").textContent = "Complete checkout";
}

flashBtn.addEventListener("click", () => {
  if (isLocked) return;
  playTone("tap");
  if (!isOn) {
    setTorch(true);
    return;
  }
  openModal(offModal);
});

lockBtn.addEventListener("click", () => {
  playTone("tap");
  isLocked = !isLocked;
  appShell.classList.toggle("locked", isLocked);
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
    setPaymentMethod(btn.dataset.method);
  });
});

paymentActionBtn.addEventListener("click", () => {
  playTone("success");
  alert(`${paymentPanelTitle.textContent} completed successfully.`);
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

brightnessSlider.value = "100";
setPaymentMethod("upi");
updateVisuals();
resetCountdown();
