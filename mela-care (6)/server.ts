import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory audit log for triage events (anonymous, zero personal identifiable data)
interface TriageLogEntry {
  id: string;
  timestamp: string;
  bodyZone?: string;
  severity: 'EMERGENCY' | 'URGENT' | 'MONITOR';
  dangerSignId?: string;
  language: string;
}

const triageLogs: TriageLogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    bodyZone: 'pelvis_waters',
    severity: 'EMERGENCY',
    dangerSignId: 'vaginal_bleeding_emergency',
    language: 'am',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    bodyZone: 'head_eyes',
    severity: 'EMERGENCY',
    dangerSignId: 'severe_headache_blurred_vision',
    language: 'om',
  },
];

// Curated Ethiopian Maternal Healthcare Centers Database
const ETHIOPIAN_HEALTH_FACILITIES = [
  {
    id: 'fac-1',
    name: {
      en: 'Tikur Anbessa (Black Lion) Specialized Hospital',
      am: 'ጥቁር አንበሳ ስፔሻላይዝድ ሆስፒታል',
      om: 'Hospitaala Ispeeshaalayizdii Gurraacha Abbayyaa',
      har: 'ጥቁር አንበሳ ሆስፒታል [Slot]',
    },
    region: 'Addis Ababa',
    city: 'Addis Ababa',
    zone: 'Lideta',
    type: 'National Referral Hospital (Maternal ICU)',
    phone: '+251115511211',
    emergencyHotline: '907',
    has24hMaternity: true,
    hasAmbulanceStation: true,
  },
  {
    id: 'fac-2',
    name: {
      en: 'Gandhi Memorial Women’s Hospital',
      am: 'ጋንዲ መታሰቢያ የእናቶች ሆስፒታል',
      om: 'Hospitaala Haadholii Gaandii',
      har: 'ጋንዲ የእናቶች ሆስፒታል [Slot]',
    },
    region: 'Addis Ababa',
    city: 'Addis Ababa',
    zone: 'Kirkos',
    type: 'Specialized Maternity Hospital',
    phone: '+251115518185',
    emergencyHotline: '907',
    has24hMaternity: true,
    hasAmbulanceStation: true,
  },
  {
    id: 'fac-3',
    name: {
      en: 'Adama General Hospital & Medical College',
      am: 'አዳማ ጠቅላላ ሆስፒታል',
      om: 'Hospitaala Waliigalaa Adaamaa',
      har: 'አዳማ ሆስፒታል [Slot]',
    },
    region: 'Oromia',
    city: 'Adama (Nazret)',
    zone: 'East Shewa',
    type: 'Regional Referral Hospital',
    phone: '+251221114000',
    emergencyHotline: '907',
    has24hMaternity: true,
    hasAmbulanceStation: true,
  },
  {
    id: 'fac-4',
    name: {
      en: 'Jimma University Specialized Medical Center',
      am: 'ጅማ ዩኒቨርሲቲ ስፔሻላይዝድ ሆስፒታል',
      om: 'Hospitaala Yuunivarsiitii Jimmaa',
      har: 'ጅማ ዩኒቨርሲቲ ሆስፒታል [Slot]',
    },
    region: 'Oromia',
    city: 'Jimma',
    zone: 'Jimma',
    type: 'Tertiary Maternal Referral Center',
    phone: '+251471111458',
    emergencyHotline: '907',
    has24hMaternity: true,
    hasAmbulanceStation: true,
  },
  {
    id: 'fac-5',
    name: {
      en: 'Hiwot Fana Specialized University Hospital',
      am: 'ህይወት ፋና ስፔሻላይዝድ ሆስፒታል',
      om: 'Hospitaala Hiwoot Faanaa',
      har: 'ሂዎት ፋና ሆስፒታል [Slot]',
    },
    region: 'Harari',
    city: 'Harar',
    zone: 'Harari Region',
    type: 'Regional Referral & Maternity Center',
    phone: '+251256661700',
    emergencyHotline: '907',
    has24hMaternity: true,
    hasAmbulanceStation: true,
  },
  {
    id: 'fac-6',
    name: {
      en: 'Felege Hiwot Comprehensive Specialized Hospital',
      am: 'ፈлеге ህይወት አጠቃላይ ስፔሻላይዝድ ሆስፒታል',
      om: 'Hospitaala Felege Hiwoot',
      har: 'ፈлеге ህይወት ሆስፒታል',
    },
    region: 'Amhara',
    city: 'Bahir Dar',
    zone: 'Bahir Dar',
    type: 'Comprehensive Maternal Center',
    phone: '+251582200216',
    emergencyHotline: '907',
    has24hMaternity: true,
    hasAmbulanceStation: true,
  },
  {
    id: 'fac-7',
    name: {
      en: 'Hawassa Comprehensive Specialized Hospital',
      am: 'ሐዋሳ አጠቃላይ ስፔሻላይዝድ ሆስፒታል',
      om: 'Hospitaala Hawaasaa',
      har: 'ሐዋሳ ሆስፒታል [Slot]',
    },
    region: 'Sidama',
    city: 'Hawassa',
    zone: 'Hawassa',
    type: 'Regional Referral Maternity Hospital',
    phone: '+251462206822',
    emergencyHotline: '907',
    has24hMaternity: true,
    hasAmbulanceStation: true,
  },
  {
    id: 'fac-8',
    name: {
      en: 'Dil Chora Referral Hospital',
      am: 'ድል ጮራ ሪፈራል ሆስፒታል',
      om: 'Hospitaala Dilcooraa',
      har: 'ድል ጮራ ሆስፒታል [Slot]',
    },
    region: 'Dire Dawa',
    city: 'Dire Dawa',
    zone: 'Dire Dawa Administration',
    type: 'Referral Maternity Hospital',
    phone: '+251251112444',
    emergencyHotline: '907',
    has24hMaternity: true,
    hasAmbulanceStation: true,
  },
];

// Emergency Hotlines
const EMERGENCY_HOTLINES = [
  {
    code: '907',
    title: {
      en: 'National Ambulance Service (Free Toll-Free)',
      am: 'የነፃ አምቡላንስ ጥሪ አገልግሎት (907)',
      om: 'Tajaajila Ambulaansii Bilisaa Biyyooleessaa (907)',
      har: 'ነፃ የአምቡላንስ ጥሪ 907 [Slot]',
    },
    phone: 'tel:907',
    available24h: true,
    description: {
      en: 'Operated across all Ethiopian regions for obstetric emergencies and rapid maternal transport.',
      am: 'በሁሉም የኢትዮጵያ ክልሎች ለነፍሰጡር እናቶች አስቸኳይ ትራንስፖርት የሚሰራ ነጻ መስመር ነው።',
      om: 'Naannolee hunda keessatti haadholii ulfaaf tajaajila geejjibaa hatattamaa kennu.',
      har: 'ለነፍሰጡር እናቶች ነፃ አምቡላንስ [Slot]',
    },
  },
  {
    code: '952',
    title: {
      en: 'Ministry of Health Emergency Information (952)',
      am: 'የጤና ጥበቃ ሚኒስቴር የመረጃ ማዕከል (952)',
      om: 'Wiirtuu Odeeffannoo Ministeera Fayyaa (952)',
      har: 'የጤና ጥበቃ 952 [Slot]',
    },
    phone: 'tel:952',
    available24h: true,
    description: {
      en: 'Government toll-free health consultation, clinic verification, and health extension support.',
      am: 'የመንግስት የጤና መረጃ፣ የጤና ጣቢያ አድራሻ እና የባለሙያ ድጋፍ መስመር።',
      om: 'Odeeffannoo fayyaa mootummaa bilisaan argachuuf.',
      har: 'የመንግስት ነፃ የጤና መስመር [Slot]',
    },
  },
];

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Mela Care — Maternal & Reproductive Health System',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/facilities', (req: Request, res: Response) => {
  const region = req.query.region as string;
  if (region && region !== 'all') {
    const filtered = ETHIOPIAN_HEALTH_FACILITIES.filter(
      (f) => f.region.toLowerCase() === region.toLowerCase()
    );
    return res.json({ facilities: filtered });
  }
  return res.json({ facilities: ETHIOPIAN_HEALTH_FACILITIES });
});

app.get('/api/emergency-hotlines', (req: Request, res: Response) => {
  res.json({ hotlines: EMERGENCY_HOTLINES });
});

app.post('/api/triage-log', (req: Request, res: Response) => {
  const { bodyZone, severity, dangerSignId, language } = req.body;
  const newEntry: TriageLogEntry = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    bodyZone,
    severity: severity || 'URGENT',
    dangerSignId,
    language: language || 'am',
  };
  triageLogs.unshift(newEntry);
  // Keep last 100 entries only
  if (triageLogs.length > 100) triageLogs.pop();

  res.status(201).json({ success: true, logId: newEntry.id });
});

app.post('/api/dispatch-alert', (req: Request, res: Response) => {
  const { dangerSignTitle, severity, locationName, language } = req.body;

  const alertMessage =
    language === 'am'
      ? `[አስቸኳይ የእርግዝና አደጋ ጥሪ] እናትየው ምልክት፦ ${dangerSignTitle || 'ከፍተኛ አደጋ'}። ቦታ፦ ${locationName || 'አካባቢው'}። በአስቸኳይ 907 አምቡላንስ ይላኩ።`
      : language === 'om'
      ? `[Balaa Hatattamaa Ulfaa] Mallattoo: ${dangerSignTitle || 'Balaa Cimaa'}. Bakka: ${locationName || 'Naannoo'}. Battalumatti 907 bilbilaa.`
      : `[MATERNAL EMERGENCY DISPATCH] Symptom: ${dangerSignTitle || 'Critical Danger Sign'}. Location: ${locationName || 'Unknown'}. Please send 907 transport immediately.`;

  res.json({
    success: true,
    dispatchId: `DISPATCH-${Date.now().toString(36).toUpperCase()}`,
    alertMessage,
    timestamp: new Date().toISOString(),
    ambulanceTollFree: '907',
  });
});

// Fullstack Integration: Vite Dev Middleware or Static Production Serving
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mela Care Fullstack server running on http://0.0.0.0:${PORT} [${isProd ? 'production' : 'development'}]`);
  });
}

startServer();
