/**
 * SEHAT SAATHI (सेहत साथी) — INTERNATIONALIZATION & SPEECH SYSTEM
 * Languages: English (en), हिन्दी (hi), ਪੰਜਾਬੀ (pa)
 * Specialist focus: Low-literacy patients, icon-first semantics, natural spoken Hindi/Punjabi
 */

export const I18N = {
  en: {
    appName: "Sehat Saathi",
    appSubtitle: "Medicine Strip Reader",
    languageName: "English",
    
    // Top Bar & Demo
    demoScenario: "Demo Scenario:",
    scenarioConfident: "Confident (Paracetamol 500mg)",
    scenarioMetformin: "Confident (Metformin 500mg)",
    scenarioAmlodipine: "Confident (Amlodipine 5mg)",
    scenarioPantoprazole: "Confident (Pantoprazole 40mg)",
    scenarioAzithromycin: "Confident (Azithromycin 500mg)",
    scenarioUnsure: "Unsure (Shiny / Curved Strip)",
    scenarioFailed: "Failed (Blurry / Torn)",
    cameraLive: "Camera Live",
    cameraDemo: "Demo Mode Active",
    
    // Viewport Guidance
    alignStrip: "Align medicine strip inside frame",
    holdSteady: "Hold steady with good lighting",
    torchOn: "Torch ON",
    torchOff: "Torch OFF",
    torchNotSupported: "Torch not available",
    cameraPermissionDenied: "Camera access was denied. Please allow camera permissions or upload a photo from your gallery.",
    
    // Primary Actions
    scanButton: "SCAN MEDICINE NOW",
    scanSubtext: "Tap to photograph medicine strip",
    scanningProgress: "Reading strip carefully...",
    uploadButton: "Upload from Photo Gallery",
    uploadSubtext: "Select a photo already on phone",
    
    // Confidence & Safety
    confidentTitle: "Medicine Identified",
    unsureTitle: "Not Sure — Needs Verification",
    unsureWarning: "The strip is curved, shiny, or text is unclear. We cannot safely guarantee this medicine. Please ask your pharmacist or doctor.",
    unsureCandidatesTitle: "Did you mean one of these?",
    failedTitle: "Could Not Read Strip",
    failedTipsTitle: "Tips for a clear scan:",
    tipFlatten: "Flatten curved or twisted strips with your fingers",
    tipGlare: "Avoid direct reflections or light glare on foil",
    tipTorch: "Turn on torch in dim lighting",
    tipTorn: "Ensure medicine name and strength are not torn away",
    retakeButton: "Take New Photo",
    
    // Confidence Badges
    confidenceHigh: "High Certainty",
    confidenceMedium: "Low Certainty",
    confidenceLow: "Unreadable",
    
    // Confirmation Dialog
    confirmPrompt: "Is this the medicine prescribed to you?",
    confirmYes: "Yes, Save & Set Reminder",
    confirmNo: "No, Scan Again",
    
    // Medication Card
    doseLabel: "Dose",
    purposeLabel: "For",
    scheduleLabel: "When to take",
    doctorDisclaimer: "Always follow the prescription written by your doctor.",
    
    // Timing / Meal Icons
    timingMorning: "Morning",
    timingAfternoon: "Afternoon",
    timingNight: "Night",
    mealAfterFood: "After food",
    mealBeforeFood: "Before food",
    mealWithWater: "with lukewarm water",
    
    // Audio & Speech
    listenButton: "Listen to Instructions",
    listeningActive: "Playing instructions...",
    speechSpeed: "Speed",
    speedNormal: "Normal",
    speedSlow: "Slow",
    repeatButton: "Repeat",
    noVoiceNotice: "Hindi/Punjabi voice pack not found on this phone. Playing English audio fallback.",
    caregiverAdvice: "Have a family member verify before taking.",
    
    // My Medicines & Reminders
    myMedicinesTitle: "My Medicines",
    noSavedMedicines: "No saved medicines yet. Scan your medicine strip to add it.",
    reminderDueTitle: "Time to Take Your Medicine!",
    buttonTookIt: "✓ I Took It",
    buttonSnooze: "⏰ Remind in 10 mins",
    deleteMedicine: "Remove",
    
    // Separation: Demo vs Actual
    demoResultBadge: "Demo / Sample Strip",
    actualResultBadge: "Live Scan Result",
    demoResultSubtext: "Demonstration data for judge & test review • Not an actual scan",
    actualResultSubtext: "Recognized from camera / photo upload",
    medTagDemo: "Demo Sample",
    medTagActual: "Actual Prescription",
    filterAll: "All",
    filterActual: "Actual Scans",
    filterDemo: "Demo Samples",
    clearDemoMedicines: "Clear Demo Data",
    
    // Bottom Navigation
    navScanner: "Scanner",
    navMyMedicines: "My Medicines",
    navHelp: "Safety Guide"
  },

  hi: {
    appName: "सेहत साथी",
    appSubtitle: "दवा पत्ता स्कैनर",
    languageName: "हिन्दी",
    
    // Top Bar & Demo
    demoScenario: "जांच परिदृश्य (डेमो):",
    scenarioConfident: "सटीक (पैरासिटामोल 500mg)",
    scenarioMetformin: "सटीक (मेटफॉर्मिन 500mg)",
    scenarioAmlodipine: "सटीक (एम्लोडिपिन 5mg)",
    scenarioPantoprazole: "सटीक (पैंटोप्राजोल 40mg)",
    scenarioAzithromycin: "सटीक (एज़िथ्रोमाइसिन 500mg)",
    scenarioUnsure: "संदेह (मुड़ा/चमकदार पत्ता)",
    scenarioFailed: "विफल (धुंधला/फटा पत्ता)",
    cameraLive: "कैमरा चालू है",
    cameraDemo: "डेमो मोड सक्रिय",
    
    // Viewport Guidance
    alignStrip: "दवा का पत्ता इस चौकोर बक्से में रखें",
    holdSteady: "हाथ स्थिर रखें और रोशनी अच्छी रखें",
    torchOn: "टॉर्च चालू",
    torchOff: "टॉर्च बंद",
    torchNotSupported: "टॉर्च उपलब्ध नहीं है",
    cameraPermissionDenied: "कैमरा अनुमति नहीं मिली। कृपया सेटिंग्स में कैमरा चालू करें या गैलरी से फोटो चुनें।",
    
    // Primary Actions
    scanButton: "दवा अभी स्कैन करें",
    scanSubtext: "पत्ते की फोटो खींचने के लिए दबाएं",
    scanningProgress: "दवा की ध्यान से जांच हो रही है...",
    uploadButton: "गैलरी से फोटो चुनें",
    uploadSubtext: "फोन में पहले से मौजूद फोटो लें",
    
    // Confidence & Safety
    confidentTitle: "दवा की पहचान पूरी हुई",
    unsureTitle: "पूरी तरह पक्का नहीं है",
    unsureWarning: "दवा का पत्ता मुड़ा हुआ या चमकदार है, जिससे अक्षर साफ नहीं दिखे। गलत दवा लेना जोखिम भरा हो सकता है। कृपया अपने डॉक्टर या दवा विक्रेता (फार्मासिस्ट) से पूछें।",
    unsureCandidatesTitle: "क्या इनमें से आपकी दवा है?",
    failedTitle: "दवा पहचानी नहीं जा सकी",
    failedTipsTitle: "साफ फोटो लेने के जरूरी सुझाव:",
    tipFlatten: "पत्ता मुड़ा हो तो उंगलियों से सीधा करें",
    tipGlare: "पन्नी पर सीधी चमक या चकाचौंध से बचें",
    tipTorch: "कम रोशनी में टॉर्च चालू करें",
    tipTorn: "ध्यान दें कि दवा का नाम और मिलीग्राम फटा हुआ न हो",
    retakeButton: "दोबारा फोटो खींचें",
    
    // Confidence Badges
    confidenceHigh: "विश्वसनीय पहचान",
    confidenceMedium: "कम भरोसा (संदेह)",
    confidenceLow: "पहचाना नहीं जा सका",
    
    // Confirmation Dialog
    confirmPrompt: "क्या यही दवा आपके डॉक्टर ने लिखी है?",
    confirmYes: "हाँ, सहेजें और याद दिलाएं",
    confirmNo: "नहीं, दोबारा जांचें",
    
    // Medication Card
    doseLabel: "खुराक",
    purposeLabel: "काम",
    scheduleLabel: "लेने का समय",
    doctorDisclaimer: "हमेशा अपने डॉक्टर के पर्चे के अनुसार ही दवा लें।",
    
    // Timing / Meal Icons
    timingMorning: "सुबह",
    timingAfternoon: "दोपहर",
    timingNight: "रात",
    mealAfterFood: "भोजन के बाद",
    mealBeforeFood: "भोजन से पहले (खाली पेट)",
    mealWithWater: "सादे या गुनगुने पानी के साथ",
    
    // Audio & Speech
    listenButton: "पूरी जानकारी आवाज़ में सुनें",
    listeningActive: "जानकारी बोली जा रही है...",
    speechSpeed: "आवाज़ की गति",
    speedNormal: "सामान्य",
    speedSlow: "धीमी",
    repeatButton: "दोबारा सुनें",
    noVoiceNotice: "इस फोन में हिन्दी आवाज़ पैक नहीं मिला। अंग्रेजी में बोलकर बताया जा रहा है।",
    caregiverAdvice: "घर के किसी सदस्य को दिखाकर ही दवा लें।",
    
    // My Medicines & Reminders
    myMedicinesTitle: "मेरी दवाइयां",
    noSavedMedicines: "अभी कोई दवा नहीं जोड़ी गई है। दवा का पत्ता स्कैन करके जोड़ें।",
    reminderDueTitle: "दवा लेने का समय हो गया है!",
    buttonTookIt: "✓ मैंने दवा ले ली",
    buttonSnooze: "⏰ 10 मिनट बाद याद दिलाएं",
    deleteMedicine: "हटाएं",
    
    // Separation: Demo vs Actual
    demoResultBadge: "डेमो / नमूना पत्ता",
    actualResultBadge: "सत्यापित लाइव स्कैन",
    demoResultSubtext: "परीक्षण और जांच के लिए तैयार किया गया नमूना • यह असली स्कैन नहीं है",
    actualResultSubtext: "कैमरा / गैलरी फोटो से पहचानी गई दवा",
    medTagDemo: "डेमो नमूना",
    medTagActual: "असली पर्चा",
    filterAll: "सभी",
    filterActual: "असली स्कैन",
    filterDemo: "डेमो नमूने",
    clearDemoMedicines: "डेमो डाटा हटाएं",
    
    // Bottom Navigation
    navScanner: "स्कैनर",
    navMyMedicines: "मेरी दवाइयां",
    navHelp: "सुरक्षा निर्देश"
  },

  pa: {
    appName: "ਸੇਹਤ ਸਾਥੀ",
    appSubtitle: "ਦਵਾਈ ਪੱਤਾ ਸਕੈਨਰ",
    languageName: "ਪੰਜਾਬੀ",
    
    // Top Bar & Demo
    demoScenario: "ਜਾਂਚ ਸਥਿਤੀ (ਡੈਮੋ):",
    scenarioConfident: "ਸਹੀ (ਪੈਰਾਸਿਟਾਮੋਲ 500mg)",
    scenarioMetformin: "ਸਹੀ (ਮੈਟਫਾਰਮਿਨ 500mg)",
    scenarioAmlodipine: "ਸਹੀ (ਐਮਲੋਡੀਪੀਨ 5mg)",
    scenarioPantoprazole: "ਸਹੀ (ਪੈਂਟੋਪ੍ਰਾਜ਼ੋਲ 40mg)",
    scenarioAzithromycin: "ਸਹੀ (ਐਜ਼ੀਥ੍ਰੋਮਾਈਸਿਨ 500mg)",
    scenarioUnsure: "ਸ਼ੱਕੀ (ਮੁੜਿਆ/ਚਮਕਦਾਰ ਪੱਤਾ)",
    scenarioFailed: "ਅਸਫ਼ਲ (ਧੁੰਦਲਾ/ਪਾਟਿਆ ਪੱਤਾ)",
    cameraLive: "ਕੈਮਰਾ ਚਾਲੂ ਹੈ",
    cameraDemo: "ਡੈਮੋ ਮੋਡ ਚਾਲੂ",
    
    // Viewport Guidance
    alignStrip: "ਦਵਾਈ ਦਾ ਪੱਤਾ ਇਸ ਚੌਖਟੇ ਵਿੱਚ ਰੱਖੋ",
    holdSteady: "ਹੱਥ ਸਥਿਰ ਰੱਖੋ ਅਤੇ ਚੰਗੀ ਰੋਸ਼ਨੀ ਰੱਖੋ",
    torchOn: "ਟਾਰਚ ਚਾਲੂ",
    torchOff: "ਟਾਰਚ ਬੰਦ",
    torchNotSupported: "ਟਾਰਚ ਮੌਜੂਦ ਨਹੀਂ ਹੈ",
    cameraPermissionDenied: "ਕੈਮਰੇ ਦੀ ਇਜਾਜ਼ਤ ਨਹੀਂ ਮਿਲੀ। ਕਿਰਪਾ ਕਰਕੇ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਕੈਮਰਾ ਖੋਲ੍ਹੋ ਜਾਂ ਗੈਲਰੀ ਵਿੱਚੋਂ ਫੋਟੋ ਚੁਣੋ।",
    
    // Primary Actions
    scanButton: "ਦਵਾਈ ਹੁਣੇ ਸਕੈਨ ਕਰੋ",
    scanSubtext: "ਪੱਤੇ ਦੀ ਫੋਟੋ ਖਿੱਚਣ ਲਈ ਦਬਾਓ",
    scanningProgress: "ਦਵਾਈ ਦੀ ਧਿਆਨ ਨਾਲ ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ...",
    uploadButton: "ਗੈਲਰੀ ਵਿੱਚੋਂ ਫੋਟੋ ਚੁਣੋ",
    uploadSubtext: "ਫੋਨ ਵਿੱਚ ਪਹਿਲਾਂ ਤੋਂ ਮੌਜੂਦ ਫੋਟੋ ਲਓ",
    
    // Confidence & Safety
    confidentTitle: "ਦਵਾਈ ਦੀ ਪਛਾਣ ਹੋ ਗਈ ਹੈ",
    unsureTitle: "ਪੂਰਾ ਭਰੋਸਾ ਨਹੀਂ ਹੈ",
    unsureWarning: "ਦਵਾਈ ਦਾ ਪੱਤਾ ਮੁੜਿਆ ਜਾਂ ਚਮਕਦਾਰ ਹੈ, ਜਿਸ ਕਾਰਨ ਅੱਖਰ ਸਾਫ਼ ਨਹੀਂ ਦਿਖੇ। ਗਲਤ ਦਵਾਈ ਲੈਣਾ ਖ਼ਤਰਨਾਕ ਹੋ ਸਕਦਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਡਾਕਟਰ ਜਾਂ ਫਾਰਮਾਸਿਸਟ ਨੂੰ ਪੁੱਛੋ।",
    unsureCandidatesTitle: "ਕੀ ਇਹਨਾਂ ਵਿੱਚੋਂ ਕੋਈ ਦਵਾਈ ਤੁਹਾਡੀ ਹੈ?",
    failedTitle: "ਦਵਾਈ ਪਛਾਣੀ ਨਹੀਂ ਜਾ ਸਕੀ",
    failedTipsTitle: "ਸਾਫ਼ ਫੋਟੋ ਲਈ ਜ਼ਰੂਰੀ ਸੁਝਾਅ:",
    tipFlatten: "ਪੱਤਾ ਮੁੜਿਆ ਹੋਵੇ ਤਾਂ ਉਂਗਲਾਂ ਨਾਲ ਸਿੱਧਾ ਕਰੋ",
    tipGlare: "ਪੱਤੇ 'ਤੇ ਸਿੱਧੀ ਚਮਕ ਤੋਂ ਬਚੋ",
    tipTorch: "ਘੱਟ ਰੋਸ਼ਨੀ ਵਿੱਚ ਟਾਰਚ ਚਾਲੂ ਕਰੋ",
    tipTorn: "ਧਿਆਨ ਰੱਖੋ ਕਿ ਦਵਾਈ ਦਾ ਨਾਮ ਅਤੇ ਤਾਕਤ ਪਾਟੀ ਨਾ ਹੋਵੇ",
    retakeButton: "ਦੁਬਾਰਾ ਫੋਟੋ ਖਿੱਚੋ",
    
    // Confidence Badges
    confidenceHigh: "ਭਰੋਸੇਯੋਗ ਪਛਾਣ",
    confidenceMedium: "ਘੱਟ ਭਰੋਸਾ (ਸ਼ੱਕੀ)",
    confidenceLow: "ਪੜ੍ਹਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ",
    
    // Confirmation Dialog
    confirmPrompt: "ਕੀ ਇਹ ਉਹੀ ਦਵਾਈ ਹੈ ਜੋ ਤੁਹਾਡੇ ਡਾਕਟਰ ਨੇ ਲਿਖੀ ਹੈ?",
    confirmYes: "ਹਾਂ, ਸਾਂਭੋ ਅਤੇ ਚੇਤੇ ਕਰਵਾਓ",
    confirmNo: "ਨਹੀਂ, ਦੁਬਾਰਾ ਜਾਂਚ ਕਰੋ",
    
    // Medication Card
    doseLabel: "ਖੁਰਾਕ",
    purposeLabel: "ਕੰਮ",
    scheduleLabel: "ਲੈਣ ਦਾ ਸਮਾਂ",
    doctorDisclaimer: "ਹਮੇਸ਼ਾ ਆਪਣੇ ਡਾਕਟਰ ਦੀ ਪਰਚੀ ਅਨੁਸਾਰ ਹੀ ਦਵਾਈ ਲਓ।",
    
    // Timing / Meal Icons
    timingMorning: "ਸਵੇਰੇ",
    timingAfternoon: "ਦੁਪਹਿਰੇ",
    timingNight: "ਰਾਤੀਂ",
    mealAfterFood: "ਰੋਟੀ ਖਾਣ ਤੋਂ ਬਾਅਦ",
    mealBeforeFood: "ਰੋਟੀ ਖਾਣ ਤੋਂ ਪਹਿਲਾਂ (ਖਾਲੀ ਢਿੱਡ)",
    mealWithWater: "ਤਾਜ਼ੇ ਜਾਂ ਕੋਸੇ ਪਾਣੀ ਨਾਲ",
    
    // Audio & Speech
    listenButton: "ਪੂਰੀ ਜਾਣਕਾਰੀ ਆਵਾਜ਼ ਵਿੱਚ ਸੁਣੋ",
    listeningActive: "ਜਾਣਕਾਰੀ ਬੋਲੀ ਜਾ ਰਹੀ ਹੈ...",
    speechSpeed: "ਆਵਾਜ਼ ਦੀ ਰਫ਼ਤਾਰ",
    speedNormal: "ਆਮ",
    speedSlow: "ਹੌਲੀ",
    repeatButton: "ਦੁਬਾਰਾ ਸੁਣੋ",
    noVoiceNotice: "ਇਸ ਫੋਨ ਵਿੱਚ ਪੰਜਾਬੀ ਆਵਾਜ਼ ਪੈਕ ਨਹੀਂ ਮਿਲਿਆ। ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਸੁਣਾਇਆ ਜਾ ਰਿਹਾ ਹੈ।",
    caregiverAdvice: "ਘਰ ਦੇ ਕਿਸੇ ਮੈਂਬਰ ਨੂੰ ਦਿਖਾ ਕੇ ਹੀ ਦਵਾਈ ਲਓ।",
    
    // My Medicines & Reminders
    myMedicinesTitle: "ਮੇਰੀਆਂ ਦਵਾਈਆਂ",
    noSavedMedicines: "ਅਜੇ ਕੋਈ ਦਵਾਈ ਨਹੀਂ ਜੋੜੀ ਗਈ। ਦਵਾਈ ਦਾ ਪੱਤਾ ਸਕੈਨ ਕਰਕੇ ਜੋੜੋ।",
    reminderDueTitle: "ਦਵਾਈ ਲੈਣ ਦਾ ਸਮਾਂ ਹੋ ਗਿਆ ਹੈ!",
    buttonTookIt: "✓ ਮੈਂ ਦਵਾਈ ਲੈ ਲਈ",
    buttonSnooze: "⏰ 10 ਮਿੰਟ ਬਾਅਦ ਚੇਤੇ ਕਰਵਾਓ",
    deleteMedicine: "ਹਟਾਓ",
    
    // Separation: Demo vs Actual
    demoResultBadge: "ਡੈਮੋ / ਨਮੂਨਾ ਪੱਤਾ",
    actualResultBadge: "ਅਸਲ ਲਾਈਵ ਸਕੈਨ",
    demoResultSubtext: "ਜਾਂਚ ਅਤੇ ਪਰਖ ਲਈ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਨਮੂਨਾ • ਇਹ ਅਸਲ ਸਕੈਨ ਨਹੀਂ ਹੈ",
    actualResultSubtext: "ਕੈਮਰਾ / ਗੈਲਰੀ ਫੋਟੋ ਤੋਂ ਪਛਾਣੀ ਗਈ ਦਵਾਈ",
    medTagDemo: "ਡੈਮੋ ਨਮੂਨਾ",
    medTagActual: "ਅਸਲ ਨੁਸਖ਼ਾ",
    filterAll: "ਸਾਰੇ",
    filterActual: "ਅਸਲ ਸਕੈਨ",
    filterDemo: "ਡੈਮੋ ਨਮੂਨੇ",
    clearDemoMedicines: "ਡੈਮੋ ਡਾਟਾ ਹਟਾਓ",
    
    // Bottom Navigation
    navScanner: "ਸਕੈਨਰ",
    navMyMedicines: "ਮੇਰੀਆਂ ਦਵਾਈਆਂ",
    navHelp: "ਸੁਰੱਖਿਆ ਨਿਯਮ"
  }
};

/**
 * Natural number & strength pronunciation helper
 */
export function formatStrengthSpeech(strengthStr, lang) {
  if (!strengthStr) return "";
  const match = strengthStr.match(/^(\d+(?:\.\d+)?)\s*(mg|mcg|g|ml)$/i);
  if (!match) return strengthStr;

  const num = match[1];
  const unit = match[2].toLowerCase();

  const hindiNumbers = {
    "5": "पाँच",
    "40": "चालीस",
    "500": "पाँच सौ",
    "650": "छह सौ पचास"
  };

  const punjabiNumbers = {
    "5": "ਪੰਜ",
    "40": "ਚਾਲੀ",
    "500": "ਪੰਜ ਸੌ",
    "650": "ਛੇ ਸੌ ਪੰਜਾਹ"
  };

  if (lang === 'hi') {
    const spokenNum = hindiNumbers[num] || num;
    const spokenUnit = unit === 'mg' ? 'मिलीग्राम' : unit === 'mcg' ? 'माइक्रोग्राम' : unit === 'g' ? 'ग्राम' : 'मिलीलीटर';
    return `${spokenNum} ${spokenUnit}`;
  }

  if (lang === 'pa') {
    const spokenNum = punjabiNumbers[num] || num;
    const spokenUnit = unit === 'mg' ? 'ਮਿਲੀਗ੍ਰਾਮ' : unit === 'mcg' ? 'ਮਾਈਕ੍ਰੋਗ੍ਰਾਮ' : unit === 'g' ? 'ਗ੍ਰਾਮ' : 'ਮਿਲੀਲੀਟਰ';
    return `${spokenNum} ${spokenUnit}`;
  }

  // English default
  const unitName = unit === 'mg' ? 'milligrams' : unit === 'mcg' ? 'micrograms' : unit === 'g' ? 'grams' : 'milliliters';
  return `${num} ${unitName}`;
}

/**
 * Dynamic Speech Generator from ScanResult
 * Strictly conforms to safety rule: never speaks dose unless status is confident
 */
export function buildSpeechText(scanResult, lang) {
  if (!scanResult || scanResult.status !== 'confident') {
    return "";
  }

  const med = scanResult.medicine;
  const strengthSpoken = formatStrengthSpeech(med.strength, lang);
  const purpose = med.purpose[lang] || med.purpose.en;

  if (lang === 'hi') {
    let scheduleSpoken = med.schedule.map(s => {
      const timeWord = s.timeOfDay === 'morning' ? 'सुबह' : s.timeOfDay === 'afternoon' ? 'दोपहर को' : 'रात को';
      const foodWord = s.withFood ? 'खाना खाने के बाद' : 'खाना खाने से पहले';
      return `${timeWord} ${foodWord} ${s.doseCount} गोली गुनगुने पानी से`;
    }).join(", और ");

    return `${med.name}, ${strengthSpoken}। ${purpose} के लिए। लेने का नियम: ${scheduleSpoken} लें। हमेशा डॉक्टर की सलाह मानें।`;
  }

  if (lang === 'pa') {
    let scheduleSpoken = med.schedule.map(s => {
      const timeWord = s.timeOfDay === 'morning' ? 'ਸਵੇਰੇ' : s.timeOfDay === 'afternoon' ? 'ਦੁਪਹਿਰੇ' : 'ਰਾਤੀਂ';
      const foodWord = s.withFood ? 'ਰੋਟੀ ਖਾਣ ਤੋਂ ਬਾਅਦ' : 'ਰੋਟੀ ਖਾਣ ਤੋਂ ਪਹਿਲਾਂ';
      return `${timeWord} ${foodWord} ${s.doseCount} ਗੋਲੀ ਤਾਜ਼ੇ ਜਾਂ ਕੋਸੇ ਪਾਣੀ ਨਾਲ`;
    }).join(", ਅਤੇ ");

    return `${med.name}, ${strengthSpoken}। ${purpose} ਲਈ। ਲੈਣ ਦਾ ਨਿਯਮ: ${scheduleSpoken} ਲਓ। ਹਮੇਸ਼ਾ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਮੰਨੋ।`;
  }

  // English fallback
  let scheduleSpoken = med.schedule.map(s => {
    const foodWord = s.withFood ? 'after meals' : 'before meals on an empty stomach';
    return `${s.doseCount} tablet in the ${s.timeOfDay} ${foodWord}`;
  }).join(", and ");

  return `${med.name}, ${strengthSpoken}. Used for ${purpose}. Schedule: take ${scheduleSpoken} with water. Always follow your doctor's advice.`;
}
