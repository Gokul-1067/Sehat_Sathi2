# सेहत साथी (Sehat Saathi) — Hackathon Problem H10
## Medicine Strip Reader & Spoken Dose Assistant for Low-Literacy Patients

**Sehat Saathi (सेहत साथी)** is an accessible, icon-first medicine strip reader and voice reminder web application designed specifically for elderly and low-literacy patients in India.

---

## 1. Quick Start / How to Run

Because the application uses ES modules, the `getUserMedia` camera API, and a PWA Service Worker, it must be served over `http://localhost` or `https://`:

### Option A: Python (Built-in)
```bash
# In the project root directory:
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in Chrome (preferably on mobile or via Chrome DevTools device mode).

### Option B: Node.js (npx)
```bash
npx serve .
```

### Option C: VS Code
Right-click `index.html` and click **"Open with Live Server"**.

---

## 2. Judge Demo Guide: How to Switch Scenarios

To allow hackathon judges to verify all required confidence states instantly (even on laptops without rear cameras):

### Method 1: The In-App Demo Bar
Use the top dropdown labeled **"Demo Scenario:"** to select any of the 7 scenarios:
1. **Confident (Paracetamol 500mg)** — Score: 0.96 (High certainty, speaks schedule, triggers confirmation)
2. **Confident (Metformin 500mg)** — Score: 0.92 (Type 2 Diabetes, morning & night with meals)
3. **Confident (Amlodipine 5mg)** — Score: 0.94 (Blood pressure, morning empty stomach)
4. **Confident (Pantoprazole 40mg)** — Score: 0.91 (Acidity relief, morning before breakfast)
5. **Confident (Azithromycin 500mg)** — Score: 0.89 (Bacterial infection, once daily)
6. **Unsure (Shiny / Curved Strip)** — Score: 0.68 (Amber alert, never speaks dose, top 3 clickable candidates)
7. **Failed (Blurry / Torn Strip)** — Score: 0.28 (Red alert, shows 4 recovery tips with icons)

### Method 2: Direct URL Query Parameters
Append `?scenario=<name>` to the URL to automate any test:
* [http://localhost:8000/?scenario=confident_paracetamol](http://localhost:8000/?scenario=confident_paracetamol)
* [http://localhost:8000/?scenario=confident_metformin](http://localhost:8000/?scenario=confident_metformin)
* [http://localhost:8000/?scenario=unsure_curved_shiny](http://localhost:8000/?scenario=unsure_curved_shiny)
* [http://localhost:8000/?scenario=failed_blurry_torn](http://localhost:8000/?scenario=failed_blurry_torn)

### Method 3: "Switch to Demo Strip" Toggle
Click the button in the top demo bar to toggle between the live webcam feed and the realistic simulated foil blister pack SVG.

---

## 3. Backend API Contract (`mockApi.js` Replacement)

The frontend is strictly decoupled from the OCR and ML pipeline. To connect a live backend, replace `scanMedicine()` inside `mockApi.js` with an HTTP fetch to your microservice:

### Endpoint Specification
* **Route:** `POST /api/v1/scan`
* **Content-Type:** `multipart/form-data`
* **Request Payload:**
  * `image`: Binary Blob / JPEG file

### Response JSON Schema

#### A. Confident Result (Confidence >= 0.85)
```json
{
  "status": "confident",
  "confidence": 0.96,
  "medicine": {
    "id": "paracetamol_500",
    "name": "Paracetamol",
    "strength": "500mg",
    "genericName": "Paracetamol IP 500mg",
    "purpose": {
      "en": "Fever and mild to moderate pain relief",
      "hi": "बुखार, बदन दर्द और सिरदर्द में राहत",
      "pa": "ਬੁਖਾਰ, ਸਰੀਰ ਦਰਦ ਅਤੇ ਸਿਰਦਰਦ ਤੋਂ ਰਾਹਤ"
    },
    "schedule": [
      {
        "timeOfDay": "afternoon",
        "defaultTime": "13:30",
        "withFood": true,
        "doseCount": 1
      },
      {
        "timeOfDay": "night",
        "defaultTime": "21:00",
        "withFood": true,
        "doseCount": 1
      }
    ]
  },
  "reasons": ["clear_brand_text", "matching_batch_pattern"]
}
```

#### B. Unsure Result (0.50 <= Confidence < 0.85)
*Crucial Safety Rule: `medicine` must be `null` and `candidateOptions` must provide 2-3 matches.*
```json
{
  "status": "unsure",
  "confidence": 0.68,
  "medicine": null,
  "candidateOptions": [
    {
      "id": "paracetamol_500",
      "name": "Paracetamol",
      "strength": "500mg",
      "confidence": 0.68
    },
    {
      "id": "pantoprazole_40",
      "name": "Pantoprazole",
      "strength": "40mg",
      "confidence": 0.54
    },
    {
      "id": "metformin_500",
      "name": "Metformin",
      "strength": "500mg",
      "confidence": 0.51
    }
  ],
  "reasons": ["glare_reflection_on_foil", "curved_surface_distortion"]
}
```

#### C. Failed Result (Confidence < 0.50)
```json
{
  "status": "failed",
  "confidence": 0.28,
  "medicine": null,
  "candidateOptions": [],
  "reasons": [
    "text_severely_torn",
    "high_motion_blur",
    "insufficient_ambient_light"
  ]
}
```

---

## 4. What is Real vs. What is Mocked

| Feature | Status | Implementation Details |
| :--- | :--- | :--- |
| **Rear Camera Stream** | **Real** | Uses `navigator.mediaDevices.getUserMedia` with `facingMode: { ideal: "environment" }`. |
| **Camera Frame Capture** | **Real** | Renders live frame to hidden `<canvas>` and produces binary JPEG Blob. |
| **Hardware Torch Control** | **Real** | Uses `track.applyConstraints({ advanced: [{ torch: true }] })` when supported by device. |
| **Gallery Upload** | **Real** | Uses native `<input type="file" accept="image/*">` and FileReader preview. |
| **Text-to-Speech (TTS)** | **Real** | Uses `window.speechSynthesis` with natural strength pronunciation ("पाँच सौ मिलीग्राम"). |
| **Missing Voice Detection** | **Real** | Inspects available speech synthesis voices for `hi-IN` and `pa-IN`, displaying an alert and English fallback if missing. |
| **Dose Storage ("My Medicines")** | **Real** | Persisted in `localStorage` with editable big `<input type="time">` pickers. |
| **In-App Dose Alarm** | **Real** | Background daemon checks due times every 25s, triggers full-screen modal, speaks audio alarm, and allows 10-minute snooze. |
| **Browser Notifications** | **Real** | Uses HTML5 `Notification API` as a background fallback. |
| **PWA & Offline Caching** | **Real** | Registers `sw.js` and `manifest.json`. |
| **Multilingual Engine** | **Real** | Dynamically switches between English, हिन्दी, and ਪੰਜਾਬੀ. |
| **OCR & Computer Vision** | **Mocked** | Decoupled behind `scanMedicine()` in `mockApi.js`. Simulates latency and confidence scores. |

---

## 5. Known Limitations & Edge Cases

1. **Background Alarms in Web Browsers**:
   * A web page cannot wake up a locked Android device like a native Java/Kotlin Android app with `AlarmManager`. When the user is outside the app, standard Web Push or `Notification` notifications fire if permission is granted, and the in-app full-screen alarm activates immediately upon opening or refocusing the tab.
2. **Speech Synthesis Voice Pack Variation**:
   * Low-end Android devices with modified vendor ROMs may not bundle offline Hindi or Punjabi TTS packs. The app detects this via `speechSynthesis.getVoices()` and shows an immediate visual notice while falling back to an English accent or advising caregiver review.
3. **Camera Security Context**:
   * Browsers strictly require `localhost` or `https://` to access `getUserMedia`. When opened via raw `file://`, the app automatically activates the **Demo Camera Mode**.
