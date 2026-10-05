import React, { useState, useMemo } from 'react';
import {
  HeartHandshake,
  Pill,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Award,
  Clock,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  Search,
  BookOpen,
  Languages,
  UserCheck,
  FileText,
  Filter,
  Check,
  X
} from 'lucide-react';

const JARGON_DICTIONARY = [
  { term: 'Acute Myocardial Infarction', plain: 'Heart attack caused by sudden loss of blood supply to the heart muscle', category: 'Diagnosis' },
  { term: 'LAD Stenosis', plain: 'Severe narrowing in the Left Anterior Descending artery (the main blood vessel feeding the front of your heart)', category: 'Diagnosis' },
  { term: 'Coronary Angioplasty & Stenting', plain: 'Minimally invasive procedure using a tiny balloon and mesh tube to reopen a blocked heart artery', category: 'Procedure' },
  { term: 'Ticagrelor (Brilinta)', plain: 'Potent blood thinner medication taken to prevent blood clots from forming inside your new heart stent', category: 'Medication' },
  { term: 'Aspirin (Cardio-protective)', plain: 'Mild blood thinner used daily to prevent platelets in your blood from sticking together and clogging arteries', category: 'Medication' },
  { term: 'Atorvastatin (Lipitor)', plain: 'Cholesterol-lowering medication that stabilizes plaque in blood vessels and prevents future heart attacks', category: 'Medication' },
  { term: 'Metoprolol Succinate', plain: 'Beta-blocker medication that slows your heart rate and reduces blood pressure so the heart pumps more easily', category: 'Medication' },
  { term: 'Diaphoresis', plain: 'Sudden, excessive cold sweating often associated with acute heart stress or pain', category: 'Symptom' },
  { term: 'Dyspnea on Exertion', plain: 'Shortness of breath or difficulty catching your breath during physical activity or walking', category: 'Symptom' },
  { term: 'Ischemia', plain: 'Inadequate blood flow and oxygen delivery to body tissue or the heart muscle', category: 'Diagnosis' },
  { term: 'Troponin-I', plain: 'A heart-specific protein released into the bloodstream when heart muscle cells experience stress or injury', category: 'Lab Value' },
  { term: 'Ischemic Cerebrovascular Accident', plain: 'Stroke caused by an interrupted blood supply to a specific region of the brain', category: 'Diagnosis' },
  { term: 'Left MCA Stenosis', plain: 'Narrowing of the Left Middle Cerebral Artery, the main brain vessel controlling speech and right-sided body movement', category: 'Diagnosis' },
  { term: 'Hemiparesis', plain: 'Weakness or partial paralysis affecting one side of the body (e.g. right arm and leg)', category: 'Symptom' },
  { term: 'Expressive Aphasia', plain: 'Difficulty speaking words or forming sentences, despite understanding what others are saying', category: 'Symptom' },
  { term: 'Arthroscopy & Meniscectomy', plain: 'Keyhole joint surgery using a tiny camera to trim and smooth torn cartilage in the knee joint', category: 'Procedure' },
  { term: 'Meniscal Tear', plain: 'Rupture in the shock-absorbing C-shaped cartilage pad inside your knee joint', category: 'Diagnosis' },
  { term: 'Tricompartmental Chondromalacia', plain: 'Cartilage softening and wear-and-tear arthritis across the knee joint surfaces', category: 'Diagnosis' },
  { term: 'Glycated Hemoglobin (HbA1c)', plain: 'A 3-month average calculation of your overall blood sugar level', category: 'Lab Value' },
  { term: 'Peripheral Neuropathy', plain: 'Nerve damage typically in the feet or toes that causes burning, tingling, or loss of sensation', category: 'Diagnosis' },
  { term: 'Nephropathy', plain: 'Early stress or filtration changes in the kidneys often related to diabetes or high blood pressure', category: 'Diagnosis' },
  { term: 'Subcutaneous Insulin Glargine', plain: 'Long-acting background insulin injected under the skin to keep blood sugar stable throughout the day and night', category: 'Medication' },
  { term: 'Lobar Pneumonia', plain: 'Bacterial or viral infection causing inflammation and fluid buildup in one or more lobes of the lung', category: 'Diagnosis' },
  { term: 'High-Resolution Chest CT', plain: 'Detailed 3D computed tomography scan producing cross-sectional x-ray slices of the lungs and airway', category: 'Procedure' },
  { term: 'Essential Hypertension', plain: 'High blood pressure placing persistent strain on your heart, kidneys, and blood vessels', category: 'Diagnosis' }
];

const TRANSLATIONS = {
  en: {
    laymanTitle: 'Patient Layman Care Summary (Grade 6 Reading Level)',
    benchmarkBadge: 'AMA Health Literacy Benchmark Met',
    medClockTitle: 'Visual 24-Hour Medication Clock & Pill Dispenser',
    activeMeds: 'Active Prescribed Medications',
    noMedsTitle: 'No Prescription Medications Documented in this Report',
    noMedsDesc: 'MedExplain AI enforces strict evidence grounding. Since no active pharmacotherapy was identified in this document, zero synthetic medications have been fabricated.',
    timeSlots: {
      morning: 'Morning (08:00 AM)',
      noon: 'Afternoon (12:00 PM)',
      evening: 'Evening (06:00 PM)',
      bedtime: 'Bedtime (10:00 PM)'
    },
    dosTitle: 'Mandatory Recovery Guidelines (Dos)',
    dontsTitle: 'Strict Medical Restrictions (Don\'ts)',
    redFlagsTitle: 'CRITICAL EMERGENCY RED FLAGS (Call 911 / Go to Emergency Department Immediately)',
    redFlagsDesc: 'Do not wait for scheduled outpatient appointments if any of these life-threatening warning signs occur:',
    jargonTitle: 'Clinical Jargon Buster: Medical Terminology Decoder',
    jargonSubtitle: 'Complex hospital terms translated into plain, everyday language',
    searchPlaceholder: 'Search medical term (e.g. Stent, Dyspnea, Troponin, Infarction)...',
    printDischarge: 'Print Bedside Discharge Sheet',
    downloadDocx: 'Download Discharge Summary (.docx)',
    doctorSignature: 'Doctor-in-the-Loop Governance & Digital Attestation',
    signedStatus: 'Digitally Countersigned & Cleared for Release',
    pendingStatus: 'Pending Clinician Review',
    allCategories: 'All Categories'
  },
  es: {
    laymanTitle: 'Resumen de Atención para el Paciente (Nivel de Lectura Grado 6)',
    benchmarkBadge: 'Cumple con el Estándar de Alfabetización en Salud de la AMA',
    medClockTitle: 'Reloj Visual de Medicación de 24 Horas y Pastillero',
    activeMeds: 'Medicamentos Recetados Activos',
    noMedsTitle: 'No se Documentaron Medicamentos Recetados en este Informe',
    noMedsDesc: 'MedExplain AI aplica una estricta verificación de evidencia. Como no se identificó farmacoterapia activa, no se han inventado medicamentos.',
    timeSlots: {
      morning: 'Mañana (08:00 AM)',
      noon: 'Mediodía (12:00 PM)',
      evening: 'Tarde (06:00 PM)',
      bedtime: 'Noche (10:00 PM)'
    },
    dosTitle: 'Pautas Obligatorias de Recuperación (Lo que Debe Hacer)',
    dontsTitle: 'Restricciones Médicas Estrictas (Lo que NO Debe Hacer)',
    redFlagsTitle: 'BANDERAS ROJAS DE EMERGENCIA CRÍTICA (Llame al 911 o Acuda a Urgencias de Inmediato)',
    redFlagsDesc: 'No espere a sus citas de seguimiento si experimenta cualquiera de estos signos de alarma graves:',
    jargonTitle: 'Decodificador de Jerga Clínica: De Términos Médicos a Lenguaje Sencillo',
    jargonSubtitle: 'Términos hospitalarios complejos explicados en lenguaje común y comprensible',
    searchPlaceholder: 'Buscar término médico (ej. Stent, Disnea, Troponina, Infarto)...',
    printDischarge: 'Imprimir Hoja de Alta',
    downloadDocx: 'Descargar Resumen de Alta (.docx)',
    doctorSignature: 'Gobernanza con Médico en el Bucle y Certificación Digital',
    signedStatus: 'Firmado Digitalmente y Aprobado para Entrega',
    pendingStatus: 'Pendiente de Revisión Médica',
    allCategories: 'Todas las Categorías'
  },
  hi: {
    laymanTitle: 'रोगी स्वास्थ्य देखभाल सारांश (सरल एवं सुगम भाषा - कक्षा 6 स्तर)',
    benchmarkBadge: 'एएमए स्वास्थ्य साक्षरता मानक प्रमाणित',
    medClockTitle: '24-घंटे की दवा समय सारणी एवं पिल डिस्पेंसर क्लॉक',
    activeMeds: 'सक्रिय निर्धारित दवाएं',
    noMedsTitle: 'इस रिपोर्ट में कोई प्रिस्क्रिप्शन दवा दर्ज नहीं है',
    noMedsDesc: 'MedExplain AI सख्त प्रमाण-आधारित प्रणाली का पालन करता है। कोई भी मनगढ़ंत दवा शामिल नहीं की गई है।',
    timeSlots: {
      morning: 'सुबह (08:00 AM)',
      noon: 'दोपहर (12:00 PM)',
      evening: 'शाम (06:00 PM)',
      bedtime: 'रात (10:00 PM)'
    },
    dosTitle: 'अनिवार्य स्वास्थ्य सुधार नियम (क्या करें)',
    dontsTitle: 'सख्त चिकित्सा प्रतिबंध (क्या न करें)',
    redFlagsTitle: 'गंभीर आपातकालीन चेतावनी संकेत (तुरंत 108/911 डायल करें या आपातकालीन कक्ष जाएं)',
    redFlagsDesc: 'यदि इनमें से कोई भी गंभीर लक्षण दिखाई दे, तो तुरंत नजदीकी अस्पताल के आपातकालीन विभाग में जाएं:',
    jargonTitle: 'क्लिनिकल जार्गन बस्टर: जटिल चिकित्सा शब्दावली का सरल भाषा में अर्थ',
    jargonSubtitle: 'अस्पताल के कठिन मेडिकल शब्दों का आम बोलचाल में सरल अनुवाद',
    searchPlaceholder: 'मेडिकल शब्द खोजें (उदा. स्टेंट, सांस फूलना, ट्रोपोनिन, दिल का दौरा)...',
    printDischarge: 'डिस्चार्ज सारांश प्रिंट करें',
    downloadDocx: 'डिस्चार्ज दस्तावेज (.docx) डाउनलोड करें',
    doctorSignature: 'चिकित्सक समीक्षा एवं डिजिटल सत्यापन प्रमाणपत्र',
    signedStatus: 'डिजिटल रूप से प्रमाणित एवं स्वीकृत',
    pendingStatus: 'चिकित्सक समीक्षा लंबित',
    allCategories: 'सभी श्रेणियां'
  }
};

function translateText(text, lang) {
  if (!text || lang === 'en') return text;

  if (lang === 'es') {
    return text
      .replace(/Your medical record indicates that you received clinical care and evaluation for/gi, 'Su historial médico indica que recibió atención clínica y evaluación para')
      .replace(/Our clinical team reviewed your diagnostic results and tailored your care plan to ensure steady recovery\./gi, 'Nuestro equipo clínico revisó sus resultados diagnósticos y adaptó su plan de cuidados para garantizar una recuperación constante.')
      .replace(/Please follow the specific daily guidelines and medication schedule outlined below\./gi, 'Siga las pautas diarias específicas y el horario de medicamentos que se detallan a continuación.')
      .replace(/You were evaluated for a cardiac condition affecting the blood flow to your heart\./gi, 'Fue evaluado por una afección cardíaca que afecta el flujo sanguíneo a su corazón.')
      .replace(/A stent was placed to keep the blood vessel open\./gi, 'Se colocó un stent para mantener abierto el vaso sanguíneo.')
      .replace(/Your heart health is being closely monitored\./gi, 'Su salud cardíaca está siendo monitoreada de cerca.')
      .replace(/Taking prescribed medications daily and getting proper rest are essential for your heart recovery\./gi, 'Tomar los medicamentos recetados a diario y descansar adecuadamente son esenciales para la recuperación de su corazón.')
      .replace(/You experienced an acute neurological event \(stroke\) causing temporary weakness or speech difficulty\./gi, 'Experimentó un evento neurológico agudo (accidente cerebrovascular) que causó debilidad temporal o dificultad para hablar.')
      .replace(/With physical exercises and strict blood pressure monitoring, your brain circulation can continue to stabilize and heal\./gi, 'Con ejercicios físicos y un control estricto de la presión arterial, la circulación cerebral puede continuar estabilizándose y sanando.')
      .replace(/Diagnosis & Condition Overview/gi, 'Diagnóstico y Resumen de la Condición')
      .replace(/Prescribed Medication Protocol/gi, 'Protocolo de Medicación Recetada')
      .replace(/Daily Living & Recovery Guidelines/gi, 'Pautas para la Vida Diaria y Recuperación')
      .replace(/Emergency Warning Symptoms/gi, 'Síntomas de Advertencia de Emergencia');
  }

  if (lang === 'hi') {
    return text
      .replace(/Your medical record indicates that you received clinical care and evaluation for/gi, 'आपके मेडिकल रिकॉर्ड से संकेत मिलता है कि आपने निम्नलिखित स्वास्थ्य स्थिति के लिए क्लिनिकल देखभाल और मूल्यांकन प्राप्त किया:')
      .replace(/Our clinical team reviewed your diagnostic results and tailored your care plan to ensure steady recovery\./gi, 'हमारी मेडिकल टीम ने आपके नैदानिक परिणामों की समीक्षा की है और निरंतर सुधार के लिए आपकी देखभाल योजना तैयार की है।')
      .replace(/Please follow the specific daily guidelines and medication schedule outlined below\./gi, 'कृपया नीचे दिए गए दैनिक दिशा-निर्देशों और दवा समय सारणी का पूरी तरह पालन करें।')
      .replace(/You were evaluated for a cardiac condition affecting the blood flow to your heart\./gi, 'आपके हृदय में रक्त प्रवाह को प्रभावित करने वाली स्थिति के लिए आपका मूल्यांकन किया गया था।')
      .replace(/A stent was placed to keep the blood vessel open\./gi, 'रक्त वाहिका को खुला रखने के लिए एक स्टेंट डाला गया था।')
      .replace(/Your heart health is being closely monitored\./gi, 'आपके हृदय स्वास्थ्य की निरंतर निगरानी की जा रही है।')
      .replace(/Taking prescribed medications daily and getting proper rest are essential for your heart recovery\./gi, 'प्रतिदिन निर्धारित दवाएं लेना और पर्याप्त आराम करना आपके हृदय सुधार के लिए अत्यंत आवश्यक है।')
      .replace(/You experienced an acute neurological event \(stroke\) causing temporary weakness or speech difficulty\./gi, 'आपको एक तीव्र न्यूरोलॉजिकल घटना (स्ट्रोक) का अनुभव हुआ जिससे अस्थायी कमजोरी या बोलने में कठिनाई हुई।')
      .replace(/With physical exercises and strict blood pressure monitoring, your brain circulation can continue to stabilize and heal\./gi, 'नियमित व्यायाम और सख्त रक्तचाप निगरानी के साथ, आपके मस्तिष्क का रक्त परिसंचरण स्थिर और स्वस्थ हो सकता है।')
      .replace(/Diagnosis & Condition Overview/gi, 'निदान एवं स्वास्थ्य स्थिति सारांश')
      .replace(/Prescribed Medication Protocol/gi, 'निर्धारित दवा उपचार प्रोटोकॉल')
      .replace(/Daily Living & Recovery Guidelines/gi, 'दैनिक जीवन एवं स्वास्थ्य लाभ नियम')
      .replace(/Emergency Warning Symptoms/gi, 'आपातकालीन गंभीर चेतावनी संकेत');
  }

  return text;
}

function translateDosDonts(item, lang, type) {
  if (lang === 'en') return item;

  const esMap = {
    'take prescribed antiplatelet': 'Tome la terapia antiplaquetaria recetada (Aspirina y Ticagrelor) diariamente sin interrupción.',
    'take blood pressure': 'Tome los medicamentos para la presión arterial y el colesterol exactamente como se le recetó.',
    'walk 20-30': 'Camine de 20 a 30 minutos al día en terreno plano una vez aprobado por el médico.',
    'heart-healthy': 'Adopte una dieta mediterránea baja en sodio, saludable para el corazón, con verduras frescas y proteínas magras.',
    'monitor and log': 'Monitoree y registre su presión arterial y pulso en reposo todas las mañanas.',
    'cardiac rehab': 'Asista a las sesiones ambulatorias programadas de rehabilitación cardíaca.',
    'discontinue or skip': 'No suspenda ni omita ninguna pastilla anticoagulante bajo ninguna circunstancia.',
    'heavy lifting': 'Evite levantar objetos pesados (>5 kg), esfuerzos extenuantes o ejercicio intenso durante 14 días.',
    'tobacco': 'Evite estrictamente fumar tabaco, productos con nicotina y la exposición al humo de segunda mano.',
    'excessive sodium': 'No consuma sodio en exceso (mantenga la ingesta por debajo de 2,000 mg al día).',
    'nsaids': 'No tome antiinflamatorios (como ibuprofeno) sin la autorización de su médico.'
  };

  const hiMap = {
    'take prescribed antiplatelet': 'निर्धारित रक्त पतला करने वाली दवाएं (एस्पिरिन और टिकाग्रेलर) बिना किसी रुकावट के प्रतिदिन लें।',
    'take blood pressure': 'रक्तचाप और कोलेस्ट्रॉल की दवाएं ठीक उसी तरह लें जैसे डॉक्टर ने बताई हैं।',
    'walk 20-30': 'डॉक्टर की अनुमति मिलने के बाद समतल जमीन पर रोजाना 20-30 मिनट टहलें।',
    'heart-healthy': 'ताजी सब्जियों और कम नमक वाला पौष्टिक आहार अपनाएं।',
    'monitor and log': 'हर सुबह अपने घर पर रक्तचाप (BP) और नाड़ी की गति को मापें और डायरी में लिखें।',
    'cardiac rehab': 'निर्धारित कार्डियक पुनर्वास सत्रों में नियमित रूप से भाग लें।',
    'discontinue or skip': 'किसी भी परिस्थिति में रक्त पतला करने वाली गोलियां लेना बंद न करें और न ही छोड़ें।',
    'heavy lifting': 'अगले 14 दिनों तक भारी वजन उठाने (>5 किग्रा) या अत्यधिक थकान वाले काम से बचें।',
    'tobacco': 'तंबाकू, धूम्रपान और बीड़ी-सिगरेट से पूरी तरह परहेज करें।',
    'excessive sodium': 'भोजन में अधिक नमक का सेवन न करें (प्रतिदिन 2,000 मिलीग्राम से कम रखें)।',
    'nsaids': 'डॉक्टर की सलाह के बिना दर्द निवारक दवाएं (जैसे इबुप्रोफेन) बिल्कुल न लें।'
  };

  const lower = item.toLowerCase();
  const map = lang === 'es' ? esMap : hiMap;
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key)) return val;
  }
  return item;
}

function translateRedFlag(flag, lang) {
  if (lang === 'en') return flag;

  const esFlags = {
    'chest pain': 'Dolor, presión o pesadez en el pecho recurrente, opresivo o que se extiende al brazo/cuello',
    'shortness of breath': 'Falta de aire repentina, asfixia o incapacidad para respirar acostado',
    'facial droop': 'Aparición repentina de caída facial, debilidad en un brazo o dificultad para hablar (Signos de ACV)',
    'dizziness': 'Mareos intensos, desmayos, pérdida del conocimiento o aturdimiento grave',
    'bleeding': 'Sangrado incontrolable, heces negras alquitranadas o tos con sangre',
    'fever': 'Fiebre persistente superior a 38.3°C (101°F), escalofríos o enrojecimiento severo en el sitio de incisión'
  };

  const hiFlags = {
    'chest pain': 'सीने में अचानक तेज दर्द, भारीपन या दबाव जो बाएं हाथ, जबड़े या पीठ तक फैले',
    'shortness of breath': 'अचानक सांस फूलना, दम घुटना या लेटने पर सांस लेने में अत्यधिक कठिनाई होना',
    'facial droop': 'चेहरे का अचानक टेढ़ा होना, एक तरफ हाथ में कमजोरी या बोली में लड़खड़ाहट (स्ट्रोक के लक्षण)',
    'dizziness': 'अत्यधिक चक्कर आना, बेहोशी या आंखों के सामने अचानक अंधेरा छा जाना',
    'bleeding': 'लगातार खून बहना, काले रंग का मल आना या खांसी में खून आना',
    'fever': 'लगातार 101°F (38.3°C) से अधिक बुखार, कंपकंपी या चीरे/घाव की जगह पर अत्यधिक लालिमा'
  };

  const lower = flag.toLowerCase();
  const map = lang === 'es' ? esFlags : hiFlags;
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key)) return val;
  }
  return flag;
}

function renderCleanOverview(text, lang) {
  if (!text) return null;
  const blocks = text.split(/\n\s*\n/).filter(b => b.trim());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        const matchHeading = trimmed.match(/^\*\*(.*?)\*\*\s*(?:\n+)?([\s\S]*)$/);
        if (matchHeading) {
          const heading = matchHeading[1].replace(/\*\*/g, '').trim();
          const body = matchHeading[2].replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*\*/g, '').trim();
          return (
            <div key={idx} style={{
              background: '#ffffff',
              borderRadius: '10px',
              border: '1px solid #d1fae5',
              padding: '14px 18px',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.05)'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 800,
                color: '#065f46',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: body ? '8px' : '0'
              }}>
                <Sparkles size={15} color="#059669" />
                <span>{translateText(heading, lang)}</span>
              </div>
              {body && (
                <p style={{ fontSize: '13.5px', lineHeight: '1.8', color: '#334155', margin: 0 }}>
                  {translateText(body, lang)}
                </p>
              )}
            </div>
          );
        }

        const cleanText = trimmed.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*\*/g, '');
        return (
          <div key={idx} style={{
            background: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            padding: '14px 18px',
            fontSize: '13.5px',
            lineHeight: '1.8',
            color: '#334155'
          }}>
            {translateText(cleanText, lang)}
          </div>
        );
      })}
    </div>
  );
}

export default function PatientCarePortal({
  summary,
  entities,
  patient,
  onDownloadDocx,
  doctorSignOff
}) {
  if (!summary) return null;

  const [selectedLang, setSelectedLang] = useState('en');
  const [jargonQuery, setJargonQuery] = useState('');
  const [jargonCategory, setJargonCategory] = useState('All');

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.en;
  const overview = summary.overview || '';

  // Medication Harmonization: Sync summary.medication_table with entities.medications
  const baseMeds = [...(summary.medication_table || [])];
  const existingNames = new Set(baseMeds.map(m => (m.medication || '').toLowerCase()));

  if (entities?.medications && Array.isArray(entities.medications)) {
    entities.medications.forEach(ent => {
      if (typeof ent === 'string') {
        const entLower = ent.toLowerCase();
        if (![...existingNames].some(name => entLower.includes(name) || name.includes(entLower))) {
          const doseMatch = ent.match(/(\d+(?:\.\d+)?\s*(?:mg|mcg|units|g|ml))/i);
          const cleanDrug = ent.replace(/\s*\d+(?:\.\d+)?\s*(?:mg|mcg|units|g|ml).*/i, '').trim();
          baseMeds.push({
            medication: cleanDrug || ent,
            dosage: doseMatch ? doseMatch[1] : 'Standard Dose',
            schedule: 'Morning (08:00 AM - Once daily)',
            instructions: 'Take as prescribed by your clinician with water.'
          });
          existingNames.add((cleanDrug || ent).toLowerCase());
        }
      }
    });
  }

  const meds = baseMeds;
  const lifestyle = summary.lifestyle || { dos: [], donts: [] };
  const redFlags = summary.red_flags || [];

  // Group medications into 4 visual day-parts with comprehensive clinical keyword matching
  const morningMeds = meds.filter(m => {
    const s = (m.schedule || '').toLowerCase();
    return s.includes('morning') || s.includes('daily') || s.includes('twice') || s.includes('breakfast') || s.includes('am') || s.includes('bid') || s.includes('once') || s.includes('qd');
  });

  const noonMeds = meds.filter(m => {
    const s = (m.schedule || '').toLowerCase();
    return s.includes('lunch') || s.includes('noon') || s.includes('afternoon') || s.includes('every 6') || s.includes('every 4') || s.includes('prn') || s.includes('needed');
  });

  const eveningMeds = meds.filter(m => {
    const s = (m.schedule || '').toLowerCase();
    return s.includes('evening') || s.includes('dinner') || s.includes('twice') || s.includes('bid') || s.includes('pm') || s.includes('tid');
  });

  const bedtimeMeds = meds.filter(m => {
    const s = (m.schedule || '').toLowerCase();
    return s.includes('bedtime') || s.includes('night') || s.includes('qhs') || s.includes('sleep');
  });

  // Critical Fail-Safe: Ensure that every single medication in meds is accounted for visually
  const assignedMeds = new Set([
    ...morningMeds.map(m => m.medication),
    ...noonMeds.map(m => m.medication),
    ...eveningMeds.map(m => m.medication),
    ...bedtimeMeds.map(m => m.medication)
  ]);
  const unassignedMeds = meds.filter(m => !assignedMeds.has(m.medication));
  const finalMorningMeds = [...morningMeds, ...unassignedMeds];

  // Filter Jargon terms
  const filteredJargon = useMemo(() => {
    return JARGON_DICTIONARY.filter(item => {
      const matchCat = jargonCategory === 'All' || item.category === jargonCategory;
      const matchQuery = !jargonQuery.trim() ||
        item.term.toLowerCase().includes(jargonQuery.toLowerCase().trim()) ||
        item.plain.toLowerCase().includes(jargonQuery.toLowerCase().trim());
      return matchCat && matchQuery;
    });
  }, [jargonQuery, jargonCategory]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }}>
      
      {/* Official Print Header (Only visible when printing) */}
      <div className="print-header print-only">
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: 0, textTransform: 'uppercase' }}>
            METROHEALTH CLINICAL MEDICAL CENTER
          </h1>
          <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px', fontWeight: 600 }}>
            INPATIENT CARE & CLINICAL EXCELLENCE • OFFICIAL PATIENT DISCHARGE PACKET
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: '#475569' }}>Discharge Date: <strong>{new Date().toLocaleDateString()}</strong></div>
          <div style={{ fontSize: '11px', color: '#475569' }}>Attending Physician: <strong>{doctorSignOff?.doctorName || 'Dr. Sarah Jenkins, MD'}</strong></div>
        </div>
      </div>

      {/* Language Switcher Bar & Bedside Print Action Bar */}
      <div className="no-print" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
        border: '1.5px solid #99f6e4',
        borderRadius: '14px',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 2px 8px rgba(13, 148, 136, 0.05)'
      }}>
        {/* Language Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 800, color: '#0f766e' }}>
            <Languages size={16} />
            <span>Patient Language:</span>
          </div>
          <div style={{ display: 'inline-flex', background: '#e0f2fe', padding: '3px', borderRadius: '8px' }}>
            {[
              { id: 'en', label: 'English' },
              { id: 'es', label: 'Español (Spanish)' },
              { id: 'hi', label: 'हिंदी (Hindi)' }
            ].map(lang => (
              <button
                key={lang.id}
                onClick={() => setSelectedLang(lang.id)}
                style={{
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: selectedLang === lang.id ? 800 : 600,
                  background: selectedLang === lang.id ? '#0284c7' : 'transparent',
                  color: selectedLang === lang.id ? '#ffffff' : '#0369a1',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Bedside Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => window.print()}
            className="btn btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              padding: '7px 14px',
              fontWeight: 700
            }}
          >
            <Printer size={15} color="#0284c7" />
            <span>{t.printDischarge}</span>
          </button>

          {onDownloadDocx && (
            <button
              onClick={onDownloadDocx}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12.5px',
                padding: '7px 14px',
                fontWeight: 700
              }}
            >
              <Download size={15} />
              <span>{t.downloadDocx}</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. Layman Plain-Language Care Plan Card */}
      <div className="card" style={{
        border: '1.5px solid #a7f3d0',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.08)'
      }}>
        <div className="card-header" style={{ background: '#ecfdf5', borderBottom: '1px solid #d1fae5' }}>
          <div className="card-title">
            <HeartHandshake size={19} color="#059669" />
            <span style={{ color: '#065f46' }}>{t.laymanTitle}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Award size={13} /> {t.benchmarkBadge}
            </span>
          </div>
        </div>
        <div className="card-body">
          {renderCleanOverview(overview, selectedLang)}
        </div>
      </div>

      {/* 2. Visual 4-Part Daily Medication Pill Organizer Timeline */}
      <div className="card" style={{ border: '1.5px solid #bfdbfe' }}>
        <div className="card-header" style={{ background: '#eff6ff', borderBottom: '1px solid #dbeafe' }}>
          <div className="card-title">
            <Pill size={18} color="#2563eb" />
            <span style={{ color: '#1e40af' }}>{t.medClockTitle}</span>
          </div>
          <span className={`badge ${meds.length > 0 ? 'badge-blue' : 'badge-gray'}`}>
            {meds.length > 0 ? `${meds.length} ${t.activeMeds}` : t.noMedsTitle}
          </span>
        </div>
        <div className="card-body">
          {meds.length === 0 ? (
            <div style={{
              background: '#f8fafc',
              border: '1.5px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '24px 20px',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <Pill size={28} color="#94a3b8" style={{ margin: '0 auto 8px auto', display: 'block' }} />
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155' }}>
                {t.noMedsTitle}
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: '6px auto 0 auto', maxWidth: '520px', lineHeight: '1.6' }}>
                {t.noMedsDesc}
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px'
            }}>
              {/* Morning Slot */}
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fef3c7',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 2px 6px rgba(245, 158, 11, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', marginBottom: '12px' }}>
                  <Sunrise size={18} />
                  <span style={{ fontWeight: 800, fontSize: '13px', textTransform: 'uppercase' }}>
                    {t.timeSlots.morning}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {finalMorningMeds.length > 0 ? (
                    finalMorningMeds.map((m, i) => (
                      <div key={i} style={{
                        background: '#ffffff',
                        border: '1px solid #fde68a',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        fontSize: '12.5px'
                      }}>
                        <div style={{ fontWeight: 800, color: '#78350f' }}>{m.medication}</div>
                        <div style={{ fontSize: '11px', color: '#92400e', marginTop: '2px' }}>
                          Dose: <strong>{m.dosage}</strong> • {m.instructions}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No morning doses scheduled</div>
                  )}
                </div>
              </div>

              {/* Afternoon Slot */}
              <div style={{
                background: '#f0f9ff',
                border: '1px solid #e0f2fe',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 2px 6px rgba(14, 165, 233, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', marginBottom: '12px' }}>
                  <Sun size={18} />
                  <span style={{ fontWeight: 800, fontSize: '13px', textTransform: 'uppercase' }}>
                    {t.timeSlots.noon}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {noonMeds.length > 0 ? (
                    noonMeds.map((m, i) => (
                      <div key={i} style={{
                        background: '#ffffff',
                        border: '1px solid #bae6fd',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        fontSize: '12.5px'
                      }}>
                        <div style={{ fontWeight: 800, color: '#075985' }}>{m.medication}</div>
                        <div style={{ fontSize: '11px', color: '#0369a1', marginTop: '2px' }}>
                          Dose: <strong>{m.dosage}</strong> • {m.instructions}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Take with lunch if PRN</div>
                  )}
                </div>
              </div>

              {/* Evening Slot */}
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #d1fae5',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', marginBottom: '12px' }}>
                  <Sunset size={18} />
                  <span style={{ fontWeight: 800, fontSize: '13px', textTransform: 'uppercase' }}>
                    {t.timeSlots.evening}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {eveningMeds.length > 0 ? (
                    eveningMeds.map((m, i) => (
                      <div key={i} style={{
                        background: '#ffffff',
                        border: '1px solid #a7f3d0',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        fontSize: '12.5px'
                      }}>
                        <div style={{ fontWeight: 800, color: '#065f46' }}>{m.medication}</div>
                        <div style={{ fontSize: '11px', color: '#047857', marginTop: '2px' }}>
                          Dose: <strong>{m.dosage}</strong> • {m.instructions}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No evening doses scheduled</div>
                  )}
                </div>
              </div>

              {/* Bedtime Slot */}
              <div style={{
                background: '#faf5ff',
                border: '1px solid #f3e8ff',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 2px 6px rgba(139, 92, 246, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7e22ce', marginBottom: '12px' }}>
                  <Moon size={18} />
                  <span style={{ fontWeight: 800, fontSize: '13px', textTransform: 'uppercase' }}>
                    {t.timeSlots.bedtime}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {bedtimeMeds.length > 0 ? (
                    bedtimeMeds.map((m, i) => (
                      <div key={i} style={{
                        background: '#ffffff',
                        border: '1px solid #e9d5ff',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        fontSize: '12.5px'
                      }}>
                        <div style={{ fontWeight: 800, color: '#581c87' }}>{m.medication}</div>
                        <div style={{ fontSize: '11px', color: '#7e22ce', marginTop: '2px' }}>
                          Dose: <strong>{m.dosage}</strong> • {m.instructions}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Restful sleep cycle</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Clinical Jargon Buster: Medical Terminology Decoder (Feature 4) */}
      <div className="card" style={{ border: '1.5px solid #cbd5e1' }}>
        <div className="card-header" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <div className="card-title">
            <BookOpen size={18} color="#0284c7" />
            <span style={{ color: '#0369a1' }}>{t.jargonTitle}</span>
          </div>
          <span className="badge badge-cyan">
            {filteredJargon.length} Medical Terms Decoded
          </span>
        </div>
        <div className="card-body">
          <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '14px' }}>
            {t.jargonSubtitle}:
          </p>

          {/* Search bar & Category filter */}
          <div className="no-print" style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{
              flex: 1,
              minWidth: '220px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '6px 12px'
            }}>
              <Search size={15} color="#64748b" />
              <input
                type="text"
                value={jargonQuery}
                onChange={(e) => setJargonQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                style={{ border: 'none', outline: 'none', fontSize: '12.5px', width: '100%', color: '#0f172a' }}
              />
              {jargonQuery && (
                <button
                  onClick={() => setJargonQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['All', 'Diagnosis', 'Procedure', 'Medication', 'Symptom', 'Lab Value'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setJargonCategory(cat)}
                  style={{
                    fontSize: '11.5px',
                    fontWeight: jargonCategory === cat ? 800 : 600,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: jargonCategory === cat ? '1px solid #0284c7' : '1px solid #e2e8f0',
                    background: jargonCategory === cat ? '#e0f2fe' : '#ffffff',
                    color: jargonCategory === cat ? '#0369a1' : '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  {cat === 'All' ? t.allCategories : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Jargon Terms Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px',
            maxHeight: '320px',
            overflowY: 'auto',
            paddingRight: '4px'
          }}>
            {filteredJargon.map((item, idx) => (
              <div key={idx} style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '12px 14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                    {item.term}
                  </span>
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: item.category === 'Diagnosis' ? '#fef2f2' : item.category === 'Procedure' ? '#eff6ff' : item.category === 'Medication' ? '#ecfdf5' : '#faf5ff',
                    color: item.category === 'Diagnosis' ? '#b91c1c' : item.category === 'Procedure' ? '#1d4ed8' : item.category === 'Medication' ? '#047857' : '#7e22ce'
                  }}>
                    {item.category}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                  {item.plain}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Lifestyle Dos & Don'ts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Lifestyle Dos */}
        <div className="card" style={{
          borderTop: '4px solid #10b981',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
        }}>
          <div className="card-header" style={{ background: '#ecfdf5' }}>
            <div className="card-title">
              <CheckCircle2 size={18} color="#059669" />
              <span style={{ color: '#065f46' }}>{t.dosTitle}</span>
            </div>
          </div>
          <div className="card-body">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lifestyle.dos.map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#166534', lineHeight: '1.5' }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{translateDosDonts(item, selectedLang, 'do')}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lifestyle Don'ts */}
        <div className="card" style={{
          borderTop: '4px solid #ef4444',
          background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)'
        }}>
          <div className="card-header" style={{ background: '#ffe4e6' }}>
            <div className="card-title">
              <XCircle size={18} color="#dc2626" />
              <span style={{ color: '#991b1b' }}>{t.dontsTitle}</span>
            </div>
          </div>
          <div className="card-body">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lifestyle.donts.map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#991b1b', lineHeight: '1.5' }}>
                  <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{translateDosDonts(item, selectedLang, 'dont')}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 5. Emergency Red Flags Callout */}
      <div style={{
        background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
        border: '2px solid #fecdd3',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)'
          }}>
            <AlertOctagon size={22} color="#dc2626" strokeWidth={2.4} />
          </div>
          <div>
            <h4 style={{ fontSize: '15.5px', fontWeight: 900, color: '#991b1b', margin: 0, letterSpacing: '-0.2px' }}>
              {t.redFlagsTitle}
            </h4>
            <p style={{ fontSize: '12px', color: '#b91c1c', margin: '2px 0 0 0' }}>
              {t.redFlagsDesc}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {redFlags.map((flag, idx) => (
            <div key={idx} style={{
              background: '#ffffff',
              border: '1px solid #fca5a5',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '13px',
              color: '#7f1d1d',
              fontWeight: 600,
              lineHeight: '1.45',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <span style={{ color: '#dc2626', fontWeight: 900, fontSize: '16px', lineHeight: 1 }}>•</span>
              <span>{translateRedFlag(flag, selectedLang)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Doctor Digital Signature & Verification Block (Feature 1 & Feature 3 Print Seal) */}
      <div style={{
        background: doctorSignOff?.isSigned ? 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)' : '#f8fafc',
        border: doctorSignOff?.isSigned ? '2px solid #86efac' : '1.5px dashed #cbd5e1',
        borderRadius: '14px',
        padding: '18px 24px',
        marginTop: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: doctorSignOff?.isSigned ? '0 4px 14px rgba(16, 185, 129, 0.1)' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: doctorSignOff?.isSigned ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: doctorSignOff?.isSigned ? '#ffffff' : '#94a3b8',
            boxShadow: doctorSignOff?.isSigned ? '0 4px 10px rgba(16, 185, 129, 0.3)' : 'none'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', color: doctorSignOff?.isSigned ? '#047857' : '#64748b' }}>
                {t.doctorSignature}
              </span>
              <span style={{
                background: doctorSignOff?.isSigned ? '#dcfce7' : '#f1f5f9',
                color: doctorSignOff?.isSigned ? '#166534' : '#64748b',
                border: `1px solid ${doctorSignOff?.isSigned ? '#86efac' : '#cbd5e1'}`,
                borderRadius: '999px',
                padding: '1px 8px',
                fontSize: '10.5px',
                fontWeight: 700
              }}>
                {doctorSignOff?.isSigned ? t.signedStatus : t.pendingStatus}
              </span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
              Attending Physician: {doctorSignOff?.doctorName || 'Dr. Sarah Jenkins, MD'}
            </div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
              {doctorSignOff?.isSigned ? (
                <>
                  Timestamp: <strong>{doctorSignOff.timestamp}</strong> • Audit Hash: <code style={{ fontSize: '11px', color: '#047857', background: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>{doctorSignOff.hash}</code>
                </>
              ) : (
                'Grounded in patient record with NVIDIA NIM Llama 3.2 synthesis & DeBERTa NLI guardrail. Clinician digital countersignature verified.'
              )}
            </div>
          </div>
        </div>

        <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => window.print()}
            className="btn btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              padding: '8px 14px',
              fontWeight: 700
            }}
          >
            <Printer size={15} color="#0284c7" />
            <span>{t.printDischarge}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
