/**
 * SEHAT SAATHI (सेहत साथी) — MOCK OCR & MEDICINE RECOGNITION API
 * 
 * BACKEND TEAMMATE CONTRACT:
 * Replace this module with your real ML/OCR microservice endpoint.
 * UI consumes strictly: scanMedicine(imageBlob, options) -> Promise<ScanResult>
 *
 * Types:
 * @typedef {Object} ScheduleItem
 * @property {'morning'|'afternoon'|'night'} timeOfDay
 * @property {string} defaultTime - e.g. "08:30"
 * @property {boolean} withFood - true for after food, false for before food
 * @property {number} doseCount - e.g. 1
 *
 * @typedef {Object} MedicineData
 * @property {string} id
 * @property {string} name
 * @property {string} strength - e.g. "500mg"
 * @property {string} genericName
 * @property {{en: string, hi: string, pa: string}} purpose
 * @property {ScheduleItem[]} schedule
 *
 * @typedef {Object} CandidateOption
 * @property {string} id
 * @property {string} name
 * @property {string} strength
 * @property {number} confidence
 *
 * @typedef {Object} ScanResult
 * @property {'confident'|'unsure'|'failed'} status
 * @property {MedicineData|null} medicine
 * @property {number} confidence - 0.00 to 1.00
 * @property {CandidateOption[]} [candidateOptions] - Top 2-3 choices when status is 'unsure'
 * @property {string[]} [reasons] - Reasons when failed or unsure (e.g. ['shiny_reflection', 'torn_edge'])
 */

// Confidence thresholds defined by clinical & UX safety requirements
export const CONFIDENCE_THRESHOLDS = {
  CONFIDENT_MIN: 0.85,
  UNSURE_MIN: 0.50
};

// Verified Clinical Dataset for Hackathon Problem H10
export const MEDICINE_DATASET = {
  paracetamol_500: {
    id: "paracetamol_500",
    name: "Paracetamol",
    strength: "500mg",
    genericName: "Paracetamol IP 500mg",
    purpose: {
      en: "Fever and mild to moderate pain relief",
      hi: "बुखार, बदन दर्द और सिरदर्द में राहत",
      pa: "ਬੁਖਾਰ, ਸਰੀਰ ਦਰਦ ਅਤੇ ਸਿਰਦਰਦ ਤੋਂ ਰਾਹਤ"
    },
    schedule: [
      { timeOfDay: "afternoon", defaultTime: "13:30", withFood: true, doseCount: 1 },
      { timeOfDay: "night", defaultTime: "21:00", withFood: true, doseCount: 1 }
    ]
  },
  metformin_500: {
    id: "metformin_500",
    name: "Metformin",
    strength: "500mg",
    genericName: "Metformin Hydrochloride 500mg",
    purpose: {
      en: "Blood sugar control (Type 2 Diabetes)",
      hi: "खून में शुगर नियंत्रण (डायबिटीज / मधुमेह)",
      pa: "ਸ਼ੂਗਰ ਕੰਟਰੋਲ (ਡਾਇਬਟੀਜ਼)"
    },
    schedule: [
      { timeOfDay: "morning", defaultTime: "08:30", withFood: true, doseCount: 1 },
      { timeOfDay: "night", defaultTime: "20:30", withFood: true, doseCount: 1 }
    ]
  },
  amlodipine_5: {
    id: "amlodipine_5",
    name: "Amlodipine",
    strength: "5mg",
    genericName: "Amlodipine Besylate 5mg",
    purpose: {
      en: "Blood pressure and heart health",
      hi: "हाई ब्लड प्रेशर (उच्च रक्तचाप) नियंत्रण",
      pa: "ਹਾਈ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਕੰਟਰੋਲ"
    },
    schedule: [
      { timeOfDay: "morning", defaultTime: "09:00", withFood: false, doseCount: 1 }
    ]
  },
  pantoprazole_40: {
    id: "pantoprazole_40",
    name: "Pantoprazole",
    strength: "40mg",
    genericName: "Pantoprazole Sodium 40mg Gastro-resistant",
    purpose: {
      en: "Acidity, heartburn and stomach gas relief",
      hi: "पेट में गैस, एसिडिटी और सीने में जलन से राहत",
      pa: "ਪੇਟ ਵਿੱਚ ਗੈਸ, ਤੇਜ਼ਾਬ ਅਤੇ ਜਲਣ ਤੋਂ ਰਾਹਤ"
    },
    schedule: [
      { timeOfDay: "morning", defaultTime: "07:30", withFood: false, doseCount: 1 } // Before breakfast
    ]
  },
  azithromycin_500: {
    id: "azithromycin_500",
    name: "Azithromycin",
    strength: "500mg",
    genericName: "Azithromycin Tablets IP 500mg",
    purpose: {
      en: "Bacterial throat and chest infections",
      hi: "गले में खराश और छाती के बैक्टीरियल संक्रमण का इलाज",
      pa: "ਗਲੇ ਅਤੇ ਛਾਤੀ ਦੇ ਇਨਫੈਕਸ਼ਨ ਦਾ ਇਲਾਜ"
    },
    schedule: [
      { timeOfDay: "afternoon", defaultTime: "14:00", withFood: false, doseCount: 1 } // 1 hour before meal or 2 hours after
    ]
  }
};

/**
 * Primary Mock Scan Function
 * @param {Blob|null} imageBlob - Image captured from camera or chosen from gallery
 * @param {Object} [options]
 * @param {string} [options.scenarioOverride] - Force specific demo scenario
 * @returns {Promise<ScanResult>}
 */
export async function scanMedicine(imageBlob, options = {}) {
  // Simulate network & on-device OCR latency (750ms - 1300ms)
  const delay = 900 + Math.floor(Math.random() * 400);
  await new Promise(resolve => setTimeout(resolve, delay));

  const scenario = options.scenarioOverride || getScenarioFromUrl() || "confident_paracetamol";

  switch (scenario) {
    case "confident_paracetamol":
      return {
        status: "confident",
        medicine: MEDICINE_DATASET.paracetamol_500,
        confidence: 0.96,
        reasons: ["clear_brand_text", "matching_batch_pattern"]
      };

    case "confident_metformin":
      return {
        status: "confident",
        medicine: MEDICINE_DATASET.metformin_500,
        confidence: 0.92,
        reasons: ["clear_brand_text", "verified_salt_name"]
      };

    case "confident_amlodipine":
      return {
        status: "confident",
        medicine: MEDICINE_DATASET.amlodipine_5,
        confidence: 0.94,
        reasons: ["crisp_dosage_text", "verified_brand"]
      };

    case "confident_pantoprazole":
      return {
        status: "confident",
        medicine: MEDICINE_DATASET.pantoprazole_40,
        confidence: 0.91,
        reasons: ["clear_capsule_imprint", "valid_strength_match"]
      };

    case "confident_azithromycin":
      return {
        status: "confident",
        medicine: MEDICINE_DATASET.azithromycin_500,
        confidence: 0.89,
        reasons: ["full_strip_visible", "verified_strength"]
      };

    case "unsure":
    case "unsure_curved_shiny":
      // Ambiguous: Shiny reflection or curved strip makes distinction between Paracetamol and Pantoprazole uncertain
      return {
        status: "unsure",
        medicine: null, // Strictly null: never assume medicine when unsure
        confidence: 0.68,
        candidateOptions: [
          {
            id: "paracetamol_500",
            name: "Paracetamol",
            strength: "500mg",
            confidence: 0.68
          },
          {
            id: "pantoprazole_40",
            name: "Pantoprazole",
            strength: "40mg",
            confidence: 0.54
          },
          {
            id: "metformin_500",
            name: "Metformin",
            strength: "500mg",
            confidence: 0.51
          }
        ],
        reasons: ["glare_reflection_on_foil", "curved_surface_distortion"]
      };

    case "failed":
    case "failed_blurry_torn":
      // Unreadable: partial strip or extreme blur
      return {
        status: "failed",
        medicine: null,
        confidence: 0.28,
        candidateOptions: [],
        reasons: ["text_severely_torn", "high_motion_blur", "insufficient_ambient_light"]
      };

    default:
      // Default to confident Paracetamol 500mg
      return {
        status: "confident",
        medicine: MEDICINE_DATASET.paracetamol_500,
        confidence: 0.95,
        reasons: ["default_demo_scan"]
      };
  }
}

/**
 * Extracts ?scenario= from URL for judge automation
 */
function getScenarioFromUrl() {
  if (typeof window === "undefined" || !window.location) return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("scenario");
}
