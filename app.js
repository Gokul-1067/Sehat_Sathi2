/**
 * SEHAT SAATHI (सेहत साथी) — CLIENT APPLICATION CONTROLLER
 * Hackathon H10: Medicine Strip Reader for Low-Literacy Patients
 * 
 * Features:
 * - Real Camera (getUserMedia rear camera + torch constraints)
 * - Fallback Demo Mode for laptop testing & judges
 * - Confidence-Aware Result States (Confident, Unsure, Failed)
 * - Strict Safety: No doses spoken/shown on unsure results; confirmation required before saving
 * - Web Speech API with missing voice fallback detection & speed toggles
 * - Dose Reminders (LocalStorage, in-app alarm modal, time pickers, notification fallback)
 * - PWA Service Worker Registration
 */

import { I18N, formatStrengthSpeech, buildSpeechText } from './i18n.js';
import { scanMedicine, CONFIDENCE_THRESHOLDS, MEDICINE_DATASET } from './mockApi.js';

class SehatSaathiApp {
  constructor() {
    // Application State
    this.currentLang = 'en';
    this.cameraStream = null;
    this.cameraMode = 'real'; // 'real' or 'demo'
    this.isTorchOn = false;
    this.hasTorchSupport = false;
    this.isVoiceEnabled = true;
    this.speechSpeed = 1.0;
    this.isSpeaking = false;
    this.activeSpeechUtterance = null;
    this.activeScanResult = null;
    this.activeScenario = 'confident_paracetamol';
    this.savedMedicines = [];
    this.alarmCheckInterval = null;

    // Cache DOM Elements
    this.dom = {
      langRadios: document.querySelectorAll('input[name="app-lang"]'),
      scenarioSelect: document.getElementById('scenario-select'),
      toggleCameraSourceBtn: document.getElementById('toggle-camera-source-btn'),
      cameraSourceLabel: document.getElementById('camera-source-label'),
      cameraVideo: document.getElementById('camera-video'),
      cameraCanvas: document.getElementById('camera-canvas'),
      captureCanvas: document.getElementById('capture-canvas'),
      cameraStatusText: document.getElementById('camera-status-text'),
      cameraStatusDot: document.getElementById('camera-status-dot'),
      cameraErrorOverlay: document.getElementById('camera-error-overlay'),
      shutterFlash: document.getElementById('shutter-flash'),
      torchBtn: document.getElementById('torch-btn'),
      torchStatusText: document.getElementById('torch-status-text'),
      voiceToggleBtn: document.getElementById('voice-toggle-btn'),
      voiceBanner: document.getElementById('voice-banner'),
      voiceFallbackAlert: document.getElementById('voice-fallback-alert'),
      soundWaveBars: document.querySelectorAll('.sound-wave'),
      scanBtn: document.getElementById('scan-btn'),
      uploadBtn: document.getElementById('upload-btn'),
      galleryInput: document.getElementById('gallery-input'),
      uploadPreviewImg: document.getElementById('upload-preview-img'),
      blisterStripSvg: document.getElementById('blister-strip-svg'),
      a11yAnnouncer: document.getElementById('a11y-announcer'),
      
      // Result Cards
      cardConfident: document.getElementById('card-confident'),
      cardUnsure: document.getElementById('card-unsure'),
      cardFailed: document.getElementById('card-failed'),
      confidentMedName: document.getElementById('confident-med-name'),
      confidentMedStrength: document.getElementById('confident-med-strength'),
      confidentMedPurpose: document.getElementById('confident-med-purpose'),
      confidentScheduleGrid: document.getElementById('confident-schedule-grid'),
      candidatesList: document.getElementById('candidates-list'),
      
      // Audio & Confirmation
      listenBtn: document.getElementById('listen-btn'),
      speedNormalBtn: document.getElementById('speed-normal-btn'),
      speedSlowBtn: document.getElementById('speed-slow-btn'),
      repeatSpeechBtn: document.getElementById('repeat-speech-btn'),
      btnConfirmYes: document.getElementById('btn-confirm-yes'),
      btnConfirmNo: document.getElementById('btn-confirm-no'),
      btnUnsureRetake: document.getElementById('btn-unsure-retake'),
      btnFailedRetake: document.getElementById('btn-failed-retake'),
      
      // Navigation & Tabs
      navBtnScanner: document.getElementById('nav-btn-scanner'),
      navBtnMedicines: document.getElementById('nav-btn-medicines'),
      navBtnHelp: document.getElementById('nav-btn-help'),
      viewScanner: document.getElementById('view-scanner'),
      viewMedicines: document.getElementById('view-medicines'),
      viewHelp: document.getElementById('view-help'),
      savedMedicinesList: document.getElementById('saved-medicines-list'),
      medCountPill: document.getElementById('med-count-pill'),
      
      // In-App Alarm Modal
      alarmModal: document.getElementById('alarm-modal'),
      alarmMedName: document.getElementById('alarm-med-name'),
      alarmMedStrength: document.getElementById('alarm-med-strength'),
      alarmMedInstruction: document.getElementById('alarm-med-instruction'),
      btnAlarmTook: document.getElementById('btn-alarm-took'),
      btnAlarmSnooze: document.getElementById('btn-alarm-snooze')
    };

    this.init();
  }

  init() {
    this.loadSettings();
    this.bindEvents();
    this.initCamera();
    this.startReminderDaemon();
    this.renderSavedMedicines();
    this.registerPWA();
    this.checkSpeechVoices();
  }

  // ---------------------------------------------------------------------------
  // 1. Settings & Persistence
  // ---------------------------------------------------------------------------
  loadSettings() {
    // Language
    const savedLang = localStorage.getItem('sehat_saathi_lang') || 'en';
    if (['en', 'hi', 'pa'].includes(savedLang)) {
      this.currentLang = savedLang;
      const radio = document.getElementById(`lang-${savedLang}`);
      if (radio) radio.checked = true;
    }

    // Medicines List
    try {
      const stored = localStorage.getItem('sehat_saathi_medicines');
      this.savedMedicines = stored ? JSON.parse(stored) : [];
    } catch (e) {
      this.savedMedicines = [];
    }
    this.updateMedCountBadge();

    // Query Parameter Scenario (?scenario=...)
    const params = new URLSearchParams(window.location.search);
    const queryScenario = params.get('scenario');
    if (queryScenario && this.dom.scenarioSelect) {
      this.activeScenario = queryScenario;
      this.dom.scenarioSelect.value = queryScenario;
    } else if (this.dom.scenarioSelect) {
      this.activeScenario = this.dom.scenarioSelect.value;
    }
  }

  updateMedCountBadge() {
    if (this.dom.medCountPill) {
      const count = this.savedMedicines.length;
      this.dom.medCountPill.textContent = count;
      this.dom.medCountPill.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  }

  saveMedicinesList() {
    localStorage.setItem('sehat_saathi_medicines', JSON.stringify(this.savedMedicines));
    this.updateMedCountBadge();
    this.renderSavedMedicines();
  }

  // ---------------------------------------------------------------------------
  // 2. Real Camera Engine (getUserMedia + Torch + Demo Fallback)
  // ---------------------------------------------------------------------------
  async initCamera() {
    // If user previously toggled to demo mode or browser has no mediaDevices
    if (this.cameraMode === 'demo' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.enableDemoCameraMode();
      return;
    }

    try {
      // Clean up existing stream if any
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach(track => track.stop());
      }

      // Request rear camera with fallback
      const constraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      this.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.dom.cameraVideo.srcObject = this.cameraStream;
      this.dom.cameraVideo.classList.add('is-streaming');
      this.dom.blisterStripSvg.style.display = 'none';
      this.dom.cameraErrorOverlay.style.display = 'none';

      // Inspect torch capabilities
      const track = this.cameraStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      this.hasTorchSupport = Boolean(capabilities.torch);

      if (this.dom.torchBtn) {
        this.dom.torchBtn.disabled = !this.hasTorchSupport;
        if (!this.hasTorchSupport) {
          this.dom.torchStatusText.textContent = "N/A";
          this.dom.torchBtn.title = I18N[this.currentLang].torchNotSupported;
        } else {
          this.dom.torchStatusText.textContent = "OFF";
        }
      }

      this.updateCameraStatusText('ready');
      if (this.dom.cameraSourceLabel) this.dom.cameraSourceLabel.textContent = "Switch to Demo Strip";

    } catch (err) {
      console.warn("Real camera unavailable or permission denied. Falling back to Demo mode:", err);
      this.enableDemoCameraMode();
      // Show permission notice if explicitly denied
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        if (this.dom.cameraErrorOverlay) this.dom.cameraErrorOverlay.style.display = 'flex';
      }
    }
  }

  enableDemoCameraMode() {
    this.cameraMode = 'demo';
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
    this.dom.cameraVideo.classList.remove('is-streaming');
    this.dom.blisterStripSvg.style.display = 'block';
    if (this.dom.cameraSourceLabel) this.dom.cameraSourceLabel.textContent = "Switch to Real Camera";
    if (this.dom.torchBtn) {
      this.dom.torchBtn.disabled = false;
      this.hasTorchSupport = true;
      this.dom.torchStatusText.textContent = this.isTorchOn ? "ON" : "OFF";
    }
    this.updateCameraStatusText('ready');
  }

  toggleCameraSource() {
    if (this.cameraMode === 'real') {
      this.enableDemoCameraMode();
    } else {
      this.cameraMode = 'real';
      this.initCamera();
    }
  }

  async toggleTorch() {
    this.isTorchOn = !this.isTorchOn;

    // Apply real camera track constraint if available
    if (this.cameraStream && this.hasTorchSupport) {
      try {
        const track = this.cameraStream.getVideoTracks()[0];
        await track.applyConstraints({
          advanced: [{ torch: this.isTorchOn }]
        });
      } catch (err) {
        console.warn("Failed to toggle hardware torch:", err);
      }
    }

    // Toggle visual illumination beam on UI
    this.dom.cameraCanvas.classList.toggle('torch-active', this.isTorchOn);
    this.dom.torchBtn.classList.toggle('tool-btn--active', this.isTorchOn);
    if (this.dom.torchStatusText) {
      this.dom.torchStatusText.textContent = this.isTorchOn ? "ON" : "OFF";
    }
  }

  captureFrameBlob() {
    return new Promise((resolve) => {
      const canvas = this.dom.captureCanvas;
      const ctx = canvas.getContext('2d');
      const video = this.dom.cameraVideo;

      if (this.cameraMode === 'real' && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      } else {
        // Fallback dummy canvas frame for demo mode
        canvas.width = 640;
        canvas.height = 480;
        ctx.fillStyle = "#1b2721";
        ctx.fillRect(0, 0, 640, 480);
        ctx.fillStyle = "#ffffff";
        ctx.font = "24px sans-serif";
        ctx.fillText("SEHAT SAATHI DEMO SCAN", 160, 240);
      }

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.85);
    });
  }

  // ---------------------------------------------------------------------------
  // 3. Scan & Confidence Pipeline
  // ---------------------------------------------------------------------------
  async handleScan() {
    if (this.dom.scanBtn.disabled) return;
    this.dom.scanBtn.disabled = true;

    // 1. Shutter Flash Animation
    this.dom.shutterFlash.classList.add('flash-active');
    setTimeout(() => this.dom.shutterFlash.classList.remove('flash-active'), 250);

    // 2. Viewfinder Laser Sweep & Status Update
    this.updateCameraStatusText('scanning');
    this.dom.cameraCanvas.classList.add('camera-scanning');

    // 3. Haptic feedback on Android devices
    if ('vibrate' in navigator) {
      try { navigator.vibrate([40, 60, 40]); } catch (e) {}
    }

    // 4. Capture Frame & Call Mock API
    const imageBlob = await this.captureFrameBlob();
    const result = await scanMedicine(imageBlob, { scenarioOverride: this.activeScenario });

    this.dom.cameraCanvas.classList.remove('camera-scanning');
    this.dom.scanBtn.disabled = false;
    this.activeScanResult = result;

    // 5. Route to appropriate confidence screen
    this.displayScanResult(result);
  }

  displayScanResult(result) {
    // Hide all result cards first
    this.dom.cardConfident.style.display = 'none';
    this.dom.cardUnsure.style.display = 'none';
    this.dom.cardFailed.style.display = 'none';

    if (result.status === 'confident') {
      this.renderConfidentScreen(result);
    } else if (result.status === 'unsure') {
      this.renderUnsureScreen(result);
    } else {
      this.renderFailedScreen(result);
    }

    // Scroll results into comfortable view
    setTimeout(() => {
      document.getElementById('results-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  // SCREEN A: CONFIDENT RESULT
  renderConfidentScreen(result) {
    const med = result.medicine;
    this.dom.confidentMedName.textContent = med.name;
    this.dom.confidentMedStrength.textContent = med.strength;
    this.dom.confidentMedPurpose.textContent = med.purpose[this.currentLang] || med.purpose.en;

    // Populate Icon-First Schedule Cards
    const grid = this.dom.confidentScheduleGrid;
    grid.innerHTML = '';

    med.schedule.forEach(item => {
      const card = document.createElement('div');
      card.className = 'schedule-card';

      const timingIcon = item.timeOfDay === 'morning' ? '🌅' : item.timeOfDay === 'afternoon' ? '🍲' : '🌙';
      const timingName = I18N[this.currentLang][item.timeOfDay === 'morning' ? 'timingMorning' : item.timeOfDay === 'afternoon' ? 'timingAfternoon' : 'timingNight'];
      const foodText = item.withFood ? I18N[this.currentLang].mealAfterFood : I18N[this.currentLang].mealBeforeFood;
      const waterText = I18N[this.currentLang].mealWithWater;

      card.innerHTML = `
        <div class="schedule-card__left">
          <span class="timing-big-icon" aria-hidden="true">${timingIcon}</span>
          <div class="timing-meta">
            <span class="timing-name">${timingName} (${item.defaultTime})</span>
            <span class="timing-food">${foodText} • ${waterText}</span>
          </div>
        </div>
        <div class="timing-dose-badge">
          ${item.doseCount} ${this.currentLang === 'hi' ? 'गोली' : this.currentLang === 'pa' ? 'ਗੋਲੀ' : 'Tablet'}
        </div>
      `;
      grid.appendChild(card);
    });

    this.dom.cardConfident.style.display = 'flex';
    this.updateCameraStatusText('success');
    this.announceA11y(`${I18N[this.currentLang].confidentTitle}: ${med.name} ${med.strength}`);

    // If voice is enabled, speak dosage automatically
    if (this.isVoiceEnabled) {
      this.speakActiveMedicine();
    }
  }

  // SCREEN B: UNSURE RESULT (STRICT SAFETY: NO DOSES SPOKEN OR SHOWN)
  renderUnsureScreen(result) {
    this.stopSpeech();
    const list = this.dom.candidatesList;
    list.innerHTML = '';

    if (result.candidateOptions && result.candidateOptions.length > 0) {
      result.candidateOptions.forEach(cand => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'candidate-pill-btn';
        btn.innerHTML = `
          <div class="candidate-pill-name">
            <strong>${cand.name}</strong> ${cand.strength}
          </div>
          <span class="candidate-pill-badge">${Math.round(cand.confidence * 100)}% match</span>
        `;
        btn.addEventListener('click', () => {
          this.promoteCandidateToConfident(cand.id);
        });
        list.appendChild(btn);
      });
    }

    this.dom.cardUnsure.style.display = 'flex';
    this.updateCameraStatusText('unsure');
    this.announceA11y(I18N[this.currentLang].unsureTitle);
  }

  promoteCandidateToConfident(medId) {
    const med = MEDICINE_DATASET[medId];
    if (med) {
      this.activeScanResult = {
        status: 'confident',
        medicine: med,
        confidence: 0.88,
        reasons: ['user_selected_candidate']
      };
      this.displayScanResult(this.activeScanResult);
    }
  }

  // SCREEN C: FAILED RESULT
  renderFailedScreen(result) {
    this.stopSpeech();
    this.dom.cardFailed.style.display = 'flex';
    this.updateCameraStatusText('failed');
    this.announceA11y(I18N[this.currentLang].failedTitle);
  }

  // ---------------------------------------------------------------------------
  // 4. Voice Engine & Natural Speech Synthesis
  // ---------------------------------------------------------------------------
  checkSpeechVoices() {
    if (!('speechSynthesis' in window)) return;

    const voices = window.speechSynthesis.getVoices();
    const langCode = this.currentLang === 'hi' ? 'hi' : this.currentLang === 'pa' ? 'pa' : 'en';

    if (langCode !== 'en') {
      const hasVoice = voices.some(v => v.lang.startsWith(langCode));
      if (!hasVoice && voices.length > 0) {
        if (this.dom.voiceFallbackAlert) this.dom.voiceFallbackAlert.style.display = 'flex';
      } else {
        if (this.dom.voiceFallbackAlert) this.dom.voiceFallbackAlert.style.display = 'none';
      }
    } else {
      if (this.dom.voiceFallbackAlert) this.dom.voiceFallbackAlert.style.display = 'none';
    }
  }

  speakActiveMedicine() {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    if (this.isSpeaking) {
      this.stopSpeech();
      return;
    }

    if (!this.activeScanResult || this.activeScanResult.status !== 'confident') {
      return;
    }

    window.speechSynthesis.cancel();

    const spokenText = buildSpeechText(this.activeScanResult, this.currentLang);
    const utterance = new SpeechSynthesisUtterance(spokenText);

    // Pick best matching voice
    const voices = window.speechSynthesis.getVoices();
    const targetLangCode = this.currentLang === 'hi' ? 'hi-IN' : this.currentLang === 'pa' ? 'pa-IN' : 'en-IN';
    const match = voices.find(v => v.lang.startsWith(targetLangCode.slice(0, 2)));

    if (match) {
      utterance.voice = match;
      utterance.lang = targetLangCode;
    } else {
      // English fallback
      utterance.lang = 'en-IN';
    }

    utterance.rate = this.speechSpeed;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.dom.listenBtn.classList.add('is-playing');
      this.setSoundWavesActive(true);
    };

    utterance.onend = () => {
      this.stopSpeech();
    };

    utterance.onerror = () => {
      this.stopSpeech();
    };

    this.activeSpeechUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    if (this.dom.listenBtn) this.dom.listenBtn.classList.remove('is-playing');
    this.setSoundWavesActive(false);
  }

  setSoundWavesActive(active) {
    this.dom.soundWaveBars.forEach(bar => {
      bar.classList.toggle('animating', active);
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Confirmation & Dose Reminder Storage ("My Medicines")
  // ---------------------------------------------------------------------------
  confirmAndSaveMedicine() {
    if (!this.activeScanResult || this.activeScanResult.status !== 'confident') return;

    const med = this.activeScanResult.medicine;
    
    // Check if already in list
    const existingIndex = this.savedMedicines.findIndex(m => m.id === med.id);
    const newEntry = {
      id: med.id,
      name: med.name,
      strength: med.strength,
      purpose: med.purpose,
      schedule: JSON.parse(JSON.stringify(med.schedule)), // deep copy
      addedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      this.savedMedicines[existingIndex] = newEntry;
    } else {
      this.savedMedicines.push(newEntry);
    }

    this.saveMedicinesList();
    this.announceA11y(`${med.name} saved to your medicines list.`);

    // Request notification permission if not yet decided
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Switch to My Medicines tab so user can see saved reminder
    this.switchTab('medicines');
  }

  renderSavedMedicines() {
    const container = this.dom.savedMedicinesList;
    if (!container) return;

    container.innerHTML = '';

    if (this.savedMedicines.length === 0) {
      container.innerHTML = `
        <div class="empty-saved-state">
          <p>${I18N[this.currentLang].noSavedMedicines}</p>
        </div>
      `;
      return;
    }

    this.savedMedicines.forEach((med, medIndex) => {
      const card = document.createElement('div');
      card.className = 'saved-med-card';

      let scheduleHtml = '';
      med.schedule.forEach((sch, schIndex) => {
        const timingIcon = sch.timeOfDay === 'morning' ? '🌅' : sch.timeOfDay === 'afternoon' ? '🍲' : '🌙';
        const timingName = I18N[this.currentLang][sch.timeOfDay === 'morning' ? 'timingMorning' : sch.timeOfDay === 'afternoon' ? 'timingAfternoon' : 'timingNight'];

        scheduleHtml += `
          <div class="saved-schedule-item">
            <span class="timing-name">${timingIcon} ${timingName}</span>
            <input type="time" class="time-picker-input" value="${sch.defaultTime}" 
              data-med-index="${medIndex}" data-sch-index="${schIndex}" aria-label="Change dose time for ${timingName}">
          </div>
        `;
      });

      card.innerHTML = `
        <div class="saved-med-header">
          <div>
            <h3 class="saved-med-title">${med.name} <span class="med-strength">${med.strength}</span></h3>
            <p class="timing-food">${med.purpose[this.currentLang] || med.purpose.en}</p>
          </div>
          <button class="delete-med-btn" data-delete-index="${medIndex}">
            ✕ ${I18N[this.currentLang].deleteMedicine}
          </button>
        </div>
        <div class="saved-schedule-list">
          ${scheduleHtml}
        </div>
      `;

      container.appendChild(card);
    });

    // Bind time picker updates
    container.querySelectorAll('.time-picker-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const medIdx = parseInt(e.target.dataset.medIndex, 10);
        const schIdx = parseInt(e.target.dataset.schIndex, 10);
        if (this.savedMedicines[medIdx] && this.savedMedicines[medIdx].schedule[schIdx]) {
          this.savedMedicines[medIdx].schedule[schIdx].defaultTime = e.target.value;
          this.saveMedicinesList();
        }
      });
    });

    // Bind delete buttons
    container.querySelectorAll('.delete-med-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.deleteIndex, 10);
        this.savedMedicines.splice(idx, 1);
        this.saveMedicinesList();
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 6. Real-Time Alarm Daemon & In-App Alarm Modal
  // ---------------------------------------------------------------------------
  startReminderDaemon() {
    if (this.alarmCheckInterval) clearInterval(this.alarmCheckInterval);

    // Check every 25 seconds for due dose
    this.alarmCheckInterval = setInterval(() => {
      this.checkDoseDue();
    }, 25000);
  }

  checkDoseDue() {
    if (this.savedMedicines.length === 0) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${hours}:${minutes}`;

    for (let med of this.savedMedicines) {
      for (let sch of med.schedule) {
        if (sch.defaultTime === currentTimeStr && !sch.dismissedForToday) {
          sch.dismissedForToday = true;
          this.triggerAlarmModal(med, sch);
          return;
        }
      }
    }
  }

  triggerAlarmModal(med, scheduleItem) {
    this.dom.alarmMedName.textContent = med.name;
    this.dom.alarmMedStrength.textContent = med.strength;
    
    const food = scheduleItem.withFood ? I18N[this.currentLang].mealAfterFood : I18N[this.currentLang].mealBeforeFood;
    const water = I18N[this.currentLang].mealWithWater;
    this.dom.alarmMedInstruction.textContent = `${scheduleItem.doseCount} ${this.currentLang === 'hi' ? 'गोली' : 'Tablet'} (${food} • ${water})`;

    this.dom.alarmModal.style.display = 'flex';

    // Speak alarm out loud
    if ('speechSynthesis' in window && this.isVoiceEnabled) {
      const msg = this.currentLang === 'hi'
        ? `दवा का समय हो गया है। कृपया अपनी ${med.name} ${med.strength} लें।`
        : this.currentLang === 'pa'
        ? `ਦਵਾਈ ਦਾ ਸਮਾਂ ਹੋ ਗਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ${med.name} ${med.strength} ਲਓ।`
        : `It is time to take your medicine: ${med.name} ${med.strength}.`;
      
      const utter = new SpeechSynthesisUtterance(msg);
      utter.rate = this.speechSpeed;
      window.speechSynthesis.speak(utter);
    }

    // Trigger Notification fallback
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification("Sehat Saathi - Dose Reminder", {
          body: `Time for ${med.name} ${med.strength}`,
          icon: 'assets/icon-192.svg'
        });
      } catch (e) {}
    }
  }

  dismissAlarm() {
    this.dom.alarmModal.style.display = 'none';
    this.stopSpeech();
  }

  snoozeAlarm() {
    this.dom.alarmModal.style.display = 'none';
    this.stopSpeech();

    // Snooze for 10 minutes (600,000ms)
    setTimeout(() => {
      if (this.savedMedicines.length > 0) {
        this.triggerAlarmModal(this.savedMedicines[0], this.savedMedicines[0].schedule[0]);
      }
    }, 600000);
  }

  // ---------------------------------------------------------------------------
  // 7. Navigation & Tabs
  // ---------------------------------------------------------------------------
  switchTab(tabName) {
    this.dom.viewScanner.style.display = tabName === 'scanner' ? 'flex' : 'none';
    this.dom.viewMedicines.style.display = tabName === 'medicines' ? 'flex' : 'none';
    this.dom.viewHelp.style.display = tabName === 'help' ? 'flex' : 'none';

    this.dom.navBtnScanner.classList.toggle('is-active', tabName === 'scanner');
    this.dom.navBtnMedicines.classList.toggle('is-active', tabName === 'medicines');
    this.dom.navBtnHelp.classList.toggle('is-active', tabName === 'help');

    if (tabName === 'medicines') {
      this.renderSavedMedicines();
    }
  }

  // ---------------------------------------------------------------------------
  // 8. Event Bindings
  // ---------------------------------------------------------------------------
  bindEvents() {
    // Language Switcher
    this.dom.langRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.currentLang = e.target.id.replace('lang-', '');
        localStorage.setItem('sehat_saathi_lang', this.currentLang);
        this.stopSpeech();
        this.checkSpeechVoices();
        this.updateCameraStatusText('ready');
        this.renderSavedMedicines();
      });
    });

    // Demo Scenario Switcher
    if (this.dom.scenarioSelect) {
      this.dom.scenarioSelect.addEventListener('change', (e) => {
        this.activeScenario = e.target.value;
      });
    }

    // Toggle Camera Source (Real vs Demo)
    if (this.dom.toggleCameraSourceBtn) {
      this.dom.toggleCameraSourceBtn.addEventListener('click', () => {
        this.toggleCameraSource();
      });
    }

    // Torch Toggle
    if (this.dom.torchBtn) {
      this.dom.torchBtn.addEventListener('click', () => {
        this.toggleTorch();
      });
    }

    // Voice Guidance Toggle
    if (this.dom.voiceToggleBtn) {
      this.dom.voiceToggleBtn.addEventListener('click', () => {
        this.isVoiceEnabled = !this.isVoiceEnabled;
        this.dom.voiceToggleBtn.classList.toggle('tool-btn--active', this.isVoiceEnabled);
        this.dom.voiceBanner.style.display = this.isVoiceEnabled ? 'flex' : 'none';
        if (!this.isVoiceEnabled) this.stopSpeech();
      });
    }

    // Scan Button
    if (this.dom.scanBtn) {
      this.dom.scanBtn.addEventListener('click', () => {
        this.handleScan();
      });
    }

    // Gallery Upload
    if (this.dom.uploadBtn && this.dom.galleryInput) {
      this.dom.uploadBtn.addEventListener('click', () => {
        this.dom.galleryInput.click();
      });

      this.dom.galleryInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.dom.uploadPreviewImg.src = event.target.result;
            this.dom.uploadPreviewImg.style.display = 'block';
            this.dom.blisterStripSvg.style.display = 'none';
            this.dom.cameraVideo.classList.remove('is-streaming');
            this.handleScan();
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Audio Play / Pause
    if (this.dom.listenBtn) {
      this.dom.listenBtn.addEventListener('click', () => {
        this.speakActiveMedicine();
      });
    }

    // Speech Speed Toggle
    if (this.dom.speedNormalBtn && this.dom.speedSlowBtn) {
      this.dom.speedNormalBtn.addEventListener('click', () => {
        this.speechSpeed = 1.0;
        this.dom.speedNormalBtn.classList.add('is-active');
        this.dom.speedSlowBtn.classList.remove('is-active');
        if (this.isSpeaking) {
          this.stopSpeech();
          this.speakActiveMedicine();
        }
      });

      this.dom.speedSlowBtn.addEventListener('click', () => {
        this.speechSpeed = 0.8;
        this.dom.speedSlowBtn.classList.add('is-active');
        this.dom.speedNormalBtn.classList.remove('is-active');
        if (this.isSpeaking) {
          this.stopSpeech();
          this.speakActiveMedicine();
        }
      });
    }

    // Repeat Speech Button
    if (this.dom.repeatSpeechBtn) {
      this.dom.repeatSpeechBtn.addEventListener('click', () => {
        this.stopSpeech();
        this.speakActiveMedicine();
      });
    }

    // Confirmation Buttons
    if (this.dom.btnConfirmYes) {
      this.dom.btnConfirmYes.addEventListener('click', () => {
        this.confirmAndSaveMedicine();
      });
    }

    if (this.dom.btnConfirmNo) {
      this.dom.btnConfirmNo.addEventListener('click', () => {
        this.dom.cardConfident.style.display = 'none';
        this.stopSpeech();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Retake Buttons
    if (this.dom.btnUnsureRetake) {
      this.dom.btnUnsureRetake.addEventListener('click', () => {
        this.dom.cardUnsure.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    if (this.dom.btnFailedRetake) {
      this.dom.btnFailedRetake.addEventListener('click', () => {
        this.dom.cardFailed.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Tab Navigation
    if (this.dom.navBtnScanner) {
      this.dom.navBtnScanner.addEventListener('click', () => this.switchTab('scanner'));
    }
    if (this.dom.navBtnMedicines) {
      this.dom.navBtnMedicines.addEventListener('click', () => this.switchTab('medicines'));
    }
    if (this.dom.navBtnHelp) {
      this.dom.navBtnHelp.addEventListener('click', () => this.switchTab('help'));
    }

    // Alarm Modal Buttons
    if (this.dom.btnAlarmTook) {
      this.dom.btnAlarmTook.addEventListener('click', () => this.dismissAlarm());
    }
    if (this.dom.btnAlarmSnooze) {
      this.dom.btnAlarmSnooze.addEventListener('click', () => this.snoozeAlarm());
    }
  }

  updateCameraStatusText(state) {
    const textEl = this.dom.cameraStatusText;
    if (!textEl) return;

    if (state === 'scanning') {
      textEl.textContent = I18N[this.currentLang].scanningProgress;
      this.dom.cameraStatusDot.style.backgroundColor = '#ffd54f';
    } else if (state === 'success') {
      textEl.textContent = `✓ ${I18N[this.currentLang].confidentTitle}`;
      this.dom.cameraStatusDot.style.backgroundColor = '#38e096';
    } else if (state === 'unsure') {
      textEl.textContent = `⚠️ ${I18N[this.currentLang].unsureTitle}`;
      this.dom.cameraStatusDot.style.backgroundColor = '#ffb300';
    } else if (state === 'failed') {
      textEl.textContent = `❌ ${I18N[this.currentLang].failedTitle}`;
      this.dom.cameraStatusDot.style.backgroundColor = '#e53935';
    } else {
      textEl.textContent = this.cameraMode === 'real'
        ? I18N[this.currentLang].cameraLive
        : I18N[this.currentLang].cameraDemo;
      this.dom.cameraStatusDot.style.backgroundColor = '#38e096';
    }
  }

  announceA11y(message) {
    if (this.dom.a11yAnnouncer) {
      this.dom.a11yAnnouncer.textContent = message;
    }
  }

  registerPWA() {
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
      navigator.serviceWorker.register('./sw.js').catch((err) => {
        console.log('ServiceWorker registration skipped:', err);
      });
    }
  }
}

// Instantiate on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.sehatApp = new SehatSaathiApp();
});
