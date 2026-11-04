# MELA CARE (መላ ኬር) — MASTER CUSTOMIZATION SPREADSHEET
*Copy and paste this table directly into Google Sheets or Microsoft Excel (TSV/CSV supported).*

---

## TABLE 1: EMERGENCY HOTLINES & CONTACT NUMBERS
| ID / Service Key | Current Number | Target Authority / Service | File Path | Notes / How to Update |
| :--- | :--- | :--- | :--- | :--- |
| `ambulance_907` | `907` | Ethiopian National Free Ambulance Dispatch | `src/data/clinics.ts`, `server.ts`, `src/components/BirthKitChecklist.tsx`, `src/components/MedicalBeacon.tsx` | Standard nationwide toll-free. Can be localized per city/woreda ambulance dispatch. |
| `health_hotline_952` | `952` | Federal Ministry of Health Information Line | `src/data/clinics.ts`, `src/components/MedicalBeacon.tsx` | Federal MoH toll-free advice center. |
| `marie_stopes_8335` | `8335` | Marie Stopes Ethiopia Reproductive Hotline | `src/data/clinics.ts` | Confidential youth & family planning hotline (8am–8pm). |
| `women_safety_6055` | `6055` | National Women & Youth Safety / Crisis Line | `src/data/clinics.ts` | Gender-based crisis & protection hotline. |

---

## TABLE 2: MATERNAL HOSPITALS & REFERRAL CENTERS
| Hospital ID | English Name | Amharic Name | Afaan Oromoo Name | Harari Name (Customizable) | Region / City | Phone Number | File Path |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `fac-1` | Tikur Anbessa Specialized Hospital | ጥቁር አንበሳ ስፔሻላይዝድ ሆስፒታል | Hospitaala Gurraacha Abbayyaa | ጥቁር አንበሳ ሆስፒታል | Addis Ababa | `+251 11 551 1211` | `server.ts` |
| `fac-2` | Gandhi Memorial Women’s Hospital | ጋንዲ መታሰቢያ የእናቶች ሆስፒታል | Hospitaala Haadholii Gaandii | ጋንዲ የእናቶች ሆስፒታል | Addis Ababa | `+251 11 551 8185` | `server.ts`, `src/data/clinics.ts` |
| `fac-3` | Adama General Hospital & Medical College | አዳማ ጠቅላላ ሆስፒታል | Hospitaala Waliigalaa Adaamaa | አዳማ ሆስፒታል | Oromia (Adama) | `+251 22 111 4000` | `server.ts`, `src/data/clinics.ts` |
| `fac-4` | Jimma University Medical Center | ጅማ ዩኒቨርሲቲ ስፔሻላይዝድ ሆስፒታል | Hospitaala Yuunivarsiitii Jimmaa | ጅማ ዩኒቨርሲቲ ሆስፒታል | Oromia (Jimma) | `+251 47 111 1458` | `server.ts` |
| `fac-5` | Hiwot Fana Specialized University Hospital | ህይወት ፋና ስፔሻላይዝድ ሆስፒታል | Hospitaala Hiwoot Faanaa | ሕይወት ፋና ሆስፒታል (ሐረር) | Harari (Harar) | `+251 25 666 1700` | `server.ts`, `src/data/clinics.ts` |
| `fac-6` | Felege Hiwot Specialized Hospital | ፈлеге ህይወት አጠቃላይ ስፔሻላይዝድ ሆስፒታል | Hospitaala Felege Hiwoot | ፈлеге ህይወት ሆስፒታል | Amhara (Bahir Dar) | `+251 58 220 0216` | `server.ts` |
| `fac-7` | Hawassa Comprehensive Specialized Hospital | ሐዋሳ አጠቃላይ ስፔሻላይዝድ ሆስፒታል | Hospitaala Hawaasaa | ሐዋሳ ሆስፒታል | Sidama (Hawassa) | `+251 46 220 6822` | `server.ts` |
| `fac-8` | Dil Chora Referral Hospital | ድል ጮራ ሪፈራል ሆስፒታል | Hospitaala Dilcooraa | ድል ጮራ ሆስፒታል | Dire Dawa | `+251 25 111 2444` | `server.ts` |
| `jugal_hospital` | Jugal General Hospital | ጁገል አጠቃላይ ሆስፒታል (ሐረር ጁጎል) | Hospitaala Waligalaa Jugal | ጁገል ሆስፒታል | Harari (Jugal) | `+251 25 666 0122` | `src/data/clinics.ts` |

---

## TABLE 3: VISUAL ASSETS (IMAGES & LOGO)
| Asset Key | Current File Name | File Path | Current Aspect / Theme | How to Replace with Your Custom Image / Logo |
| :--- | :--- | :--- | :--- | :--- |
| `App Logo Icon` | Integrated Mela mark | `public/mela-mark.png`, `src/App.tsx` | Transparent burgundy heart-and-person brand mark | Replace `public/mela-mark.png` or update the `/mela-mark.png` reference in `src/App.tsx`. |
| `Hero Sanctuary Banner` | `ethiopian_maternal_hero_1793061211046.jpg` | `src/assets/images/` | Ethiopian mother holding healthy newborn with Habesha dress | Replace file with your preferred hospital/NGO hero photograph. |
| `Body Silhouette Triage Map` | `maternal_silhouette_map_1793061212776.jpg` | `src/assets/images/` | Anatomical female silhouette with red glowing touch targets | Replace file with custom clinical illustration of pregnant anatomy. |
| `Safe Delivery Kit Art` | `ethiopian_birth_delivery_kit_1793105802113.jpg` | `src/assets/images/` | 7 items inside delivery basket (razor, cord tie, soap, towels, ANC card) | Replace with real photo of Ethiopian Health Extension birth kit. |
| `Midwife Counseling Photo` | `ethiopian_midwife_care_1793061212461.jpg` | `src/assets/images/` | Midwife advising young mother in clinic | Replace with your clinic’s nurse or community health worker photo. |
| `Hemorrhage Beacon Visual` | `maternal_hemorrhage_urgent_1793105783358.jpg` | `src/assets/images/` | Medical triage warning image for bleeding emergencies | Replace with chosen warning card image. |
| `Preeclampsia Beacon Visual`| `maternal_preeclampsia_guide_1793105782753.jpg` | `src/assets/images/` | Visual depiction of severe headache & blurred vision alert | Replace with chosen clinic warning card image. |
| `Contraception Horizon Photo`| `contraceptive_counseling_1793105801588.jpg` | `src/assets/images/` | Doctor explaining family planning methods | Replace with local family planning counseling image. |

---

## TABLE 4: HARARI (ጌይ ሲናን) LANGUAGE PLACEHOLDERS NEEDING TRANSLATION
*All Harari text currently defaults gracefully to Amharic if left blank.*
| System Component | Field / Key | English Reference | Amharic Reference | Current Harari Value (To Translate) | File Path |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **App Header** | `app_title` | Mela Care | መላ ኬር | መላ ኬር *(or native Harari script)* | `src/App.tsx` |
| **Welcome Greeting**| `welcomeSpokenText` | Welcome sister to Mela Care... | እንኳን ወደ መላ ኬር በደህና መጡ እህቴ... | እንኳን ደህና መጡ እህቴ *(To be voiced in Gey Sinan)* | `src/components/MaternalHome.tsx` |
| **Emergency SOS Beacon**| `beacon_title` | Emergency Clinical Flashcard | የአስቸኳይ ጊዜ ህክምና ካርድ | የአስቸኳይ ጊዜ ህክምና ካርድ | `src/components/MedicalBeacon.tsx` |
| **Emergency Beacon**| `beacon_request` | Please transport me to hospital | እባክዎ አሁኑኑ ወደ ሆስፒታል ውሰዱኝ | እባክዎ አሁኑኑ ወደ ሆስፒታል ውሰዱኝ | `src/components/MedicalBeacon.tsx` |
| **Danger Sign 1** | `vaginal_bleeding` | Vaginal Bleeding | የማህፀን ደም መፍሰስ | የማህፀን ደም መፍሰስ | `src/data/maternalData.ts` (L16) |
| **Danger Sign 2** | `convulsions_fits` | Convulsions / Fits / Eclampsia | መንቀጥቀጥ ወይም ራስን መሳት | መንቀጥቀጥ ወይም ራስን መሳት | `src/data/maternalData.ts` (L53) |
| **Danger Sign 3** | `severe_headache` | Severe Headache & Vision Blur | ከባድ ራስ ምታት እና አይን ብዥ ማለት | ከባድ ራስ ምታት እና አይን ብዥ ማለት | `src/data/maternalData.ts` (L88) |
| **Danger Sign 4** | `high_fever_chills`| High Fever & Foul Discharge | ከፍተኛ ትኩሳት እና መጥፎ ጠረን ያለው ፈሳሽ | ከፍተኛ ትኩሳት እና ፈሳሽ | `src/data/maternalData.ts` (L125) |
| **Danger Sign 5** | `reduced_kicks` | Reduced Fetal Movement | የህፃኑ እንቅስቃሴ መቀነስ ወይም ማቆም | የልጁ እንቅስቃሴ መቀነስ | `src/data/maternalData.ts` (L162) |
| **Danger Sign 6** | `leaking_amniotic` | Premature Water Breaking | የማህፀን ውሃ መፍሰስ | የውሃ መፍሰስ | `src/data/maternalData.ts` (L199) |
| **Danger Sign 7** | `chest_pain_breath`| Severe Chest Pain & Breathlessness| የደረት ህመም እና የትንፋሽ ማጠር | የደረት ህመም | `src/data/maternalData.ts` (L236) |
| **Danger Sign 8** | `facial_swelling` | Puffy Face & Hand Swelling | የፊት እና የእጅ እብጠት | የፊት እና የእጅ እብጠት | `src/data/maternalData.ts` (L273) |
| **Birth Kit Item 1** | `cord_blade_tie` | Razor Blade & Sterile Cord Tie | አዲስ ምላጭ እና የጸዳ እትብት ማሰሪያ ክር | አዲስ ምላጭ እና ንጹህ ክር | `src/components/BirthKitChecklist.tsx` |
| **Birth Kit Item 2** | `swaddle_clothes` | Warm Blanket & Baby Clothes | ሞቅ ያለ የአራስ አንሶላ እና ንጹህ ልብሶች | ሞቅ ያለ አንሶላ እና ንጹህ ልብስ | `src/components/BirthKitChecklist.tsx` |
| **Birth Kit Item 3** | `soap_water_towel`| Personal Soap & Clean Towels | የገላ ሳሙና እና ንጹህ ፎጣዎች | ሳሙና እና ንጹህ ፎጣ | `src/components/BirthKitChecklist.tsx` |
| **Birth Kit Item 4** | `emergency_cash` | Emergency Transport Cash Fund | የአደጋ ጊዜ የትራንስፖርት ገንዘብ | የትራንስፖርት ገንዘብ | `src/components/BirthKitChecklist.tsx` |
| **Birth Kit Item 5** | `blood_donors` | 2 Designated Blood Donors | 2 አስቀድመው የተመረጡ የደም ለጋሾች | አብሮ የሚሄድ ሰው እና የደም ለጋሾች | `src/components/BirthKitChecklist.tsx` |
| **Birth Kit Item 6** | `phone_ambulance` | Charged Phone & 907 Number | የተሞላ ሞባይል እና 907 ቁጥር | ስልክ እና የአምቡላንስ ቁጥር | `src/components/BirthKitChecklist.tsx` |
| **Birth Kit Item 7** | `anc_yellow_card` | Antenatal Mother Card (ANC Yellow) | የእርግዝና ክትትል ካርድ (የእናቶች ቢጫ ካርድ)| የክትትል ካርድ | `src/components/BirthKitChecklist.tsx` |

---

## TABLE 5: AFAAN OROMOO & AMHARIC CLINICAL PHRASES TO VERIFY WITH LOCAL MIDWIVES
| Medical Concept | Current Amharic Phrase | Current Afaan Oromoo Phrase | Dialect / Nuance to Confirm | Location in Code |
| :--- | :--- | :--- | :--- | :--- |
| **Preeclampsia** | ፕሪኤክላምፕሲያ (ከፍተኛ የደም ግፊት በእርግዝና) | Dhiibbaa Dhiigaa Cimaa Ulfaa | Confirm if mothers in Harar/Bale/Jimma prefer *"Dhiibbaa dhiigaa"* or *"Dhukkuba eeklaampsiiya"*. | `src/data/maternalData.ts` |
| **Water Breaking**| ሽንተ-ውሃ መፍሰስ / አምኒዮቲክ ፈሳሽ | Bishaan Ciniinsuu Dhangala’uu | Some rural areas use *"Bishaan dhangala’uu"* vs *"Dhangala’aa gadameessaa"*. | `src/data/maternalData.ts` |
| **Edema Test** | የቁርጭምጭሚት እብጠት መፈተሻ (የ5 ሰከንድ ጫና) | Qormaata Dhiita Miilaa (Sekondii 5) | Confirm clinical wording used by Health Extension Workers (HEWs). | `src/components/DangerSignsSystem.tsx` |
| **Fetal Movement** | የህፃኑ እንቅስቃሴ ቆጣሪ | Lakkooftuu Sochii Mucaa | Check whether *"Sochii daa'imaa"* or *"Sochii mucaa"* is standard on ANC cards. | `src/components/KickTapper.tsx` |
| **Discreet Mask** | የሚስጥር መሸፈኛ (የካልኩሌተር እና ኖት ገጽታ) | Haguuggi Iccitii | Disguises the screen from abusive partners or family. Verify phrase clarity. | `src/components/DiscreetMask.tsx` |
| **Implants / Jadelle** | የክንድ ውስጥ መከላከያ (ኢምፕላንት - ለ3 ወይም 5 ዓመታት) | Waraantoo Irree (Waggaa 3-5) | Confirm whether mothers refer to it colloquially as *"Norplant"*, *"Jadelle"*, or *"Waraantoo"*. | `src/data/maternalData.ts` |
| **Injectable (Depo)**| የ3 ወር መርፌ (ዴፖ ፕሮቬራ) | Lilmoo Ji’a 3 (Sayikiloon) | In some regions known simply as *"Lilmoo"* or *"Qodaa ji'a sadii"*. | `src/data/maternalData.ts` |
| **IUD / Copper Loop**| የማህፀን ሉፕ (ኮይል - ለ10 ዓመታት) | Luuppii Gadameessaa (Waggaa 10) | Confirm whether women call it *"Loop"* or *"Qaxxaamura"*. | `src/data/maternalData.ts` |

---

## TABLE 6: BRAND, TITLE, METADATA & PWA SETTINGS
| Item | Current Value | File Path | Notes |
| :--- | :--- | :--- | :--- |
| App name | `Mela Care · መላ ኬር` | `vite.config.ts` | Name shown in the installable PWA manifest. |
| Short app name | `Mela Care` | `vite.config.ts` | Home-screen and launcher label. |
| Browser title | `Mela Care — Pregnancy, Family Planning & Emergency Support` | `index.html` | Update search/social metadata together. |
| Theme color | `#881337` | `index.html`, `vite.config.ts`, `src/index.css` | Burgundy theme color; update matching UI values together. |
| Background color | `#FFF5F7` | `vite.config.ts`, `src/index.css` | Used by the PWA splash/background surface. |
| Header mark | `public/mela-mark.png` | `src/App.tsx` | Primary compact brand mark. |
| Lockup | `public/mela-lockup.png` | Brand asset directory | Use on spacious splash, about, or sharing surfaces. |
| PWA icons | `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/pwa-maskable-512x512.png` | `vite.config.ts`, `index.html` | Rebuild from the source brand tile after logo changes. |
| Apple touch icon | `public/apple-touch-icon.png` | `index.html` | Square icon without transparency around important content. |
| Favicon | `public/pwa-192x192.png` | `index.html` | Replace or add a dedicated small favicon if needed. |
| Brand preparation script | `scripts/prepare_brand_assets.py` | Project scripts | Reprocess the transparent mark and regenerate icon sizes. |

---

## TABLE 7: VOICE RECORDINGS, AUDIO & SPOKEN TEXT
| Voice / Audio Item | Current Implementation | File / Data Location | Manual Input Needed Later |
| :--- | :--- | :--- | :--- |
| Browser spoken output | Web Speech API with language selection | `src/utils/audio.ts` | Add approved recordings only if browser speech synthesis is unacceptable. |
| Amharic / Oromo / English text | Central localized text objects | `src/data/maternalData.ts`, `src/data/clinics.ts`, `src/components/*.tsx` | Add matching medically approved recordings and audio fields. |
| Harari spoken welcome | Placeholder/fallback wording | `src/components/MaternalHome.tsx`, `src/utils/compass.ts` | Add a native voice recording and matching Harari text. |
| Danger-sign readout | `spokenAudio` fields | `src/data/maternalData.ts` | Add separate approved recordings if browser synthesis is not acceptable. |
| Family-planning readout | `spokenAudio` fields | `src/data/maternalData.ts` | Add approved local-language recordings. |
| Kick confirmation chime | Generated Web Audio tone | `src/components/KickTapper.tsx` | Optional replacement; no external file is currently required. |
| Contraction breathing guide | Generated browser audio guidance | `src/components/ContractionTimer.tsx` | Optional recording using calm, non-prescriptive copy. |

---

## TABLE 8: DEPLOYMENT, TELEGRAM & OPERATIONAL SETTINGS
| Item | Current Value / Behavior | File Path | Action Required |
| :--- | :--- | :--- | :--- |
| Production domain | Not configured | Hosting account / `vercel.json` | Add the final HTTPS domain after deployment. |
| SPA routing | `/index.html` fallback plus `/api/*` rewrite | `vercel.json` | Confirm preview and production routes. |
| Facilities API | Static server data | `server.ts`, `api/index.ts` | Replace with a verified database/CMS or explicitly maintained regional records. |
| Facility verification | Marked as requiring local verification | `server.ts`, `src/components/FacilityDirectory.tsx` | Verify each phone, maternity service, hour, and ambulance claim before launch. |
| Telegram bot | No public bot credential is required in frontend source | Telegram Bot settings / environment variables | Configure the bot and set the Mini App URL to the final HTTPS deployment. |
| Telegram SDK | Feature-detected browser fallback | `src/utils/telegram.ts`, `index.html` | Test inside Telegram, not only in an ordinary browser. |
| Offline cache policy | Facility and app data may be cached by the service worker | `vite.config.ts` | Decide retention/update behavior for maternal and facility information. |
| Environment variables | None documented in this spreadsheet | `.env`, hosting dashboard | Add deployment secrets only outside frontend source. |
| Service worker updates | Automatic update registration | `vite.config.ts` | Test old installed clients and cache updates. |
| Medical review ownership | Not yet assigned | Clinical review/sign-off document | Obtain Ethiopian obstetric and Ministry-approved review before public clinical claims. |

---

## COMPLETENESS NOTE
This spreadsheet is a manual customization checklist, but it is not the sole source for all text changes.

Major localized and clinical content also remains in:

- `src/data/maternalData.ts`
- `src/data/clinics.ts`
- `src/components/*.tsx`
- `src/utils/compass.ts`
- `server.ts`

Before Harari or clinical launch, separately verify every fallback string, `[HARARI_SLOT]`, medical threshold, facility availability, phone number, voice recording, and emergency claim. The spreadsheet should be used together with these source files, not as a substitute for localized source review.

---

## TABLE 9: MANUAL CHANGES COMPLETED IN THIS BUILD

| Area | Implemented Change | Source |
| :--- | :--- | :--- |
| Home-screen structure | Preserved the pregnancy, family-planning, postpartum and quick-tool layout while improving lifecycle filtering and reducing visual redundancy | `src/components/MaternalHome.tsx` |
| Substance-use page | Added alcohol, tobacco and khat check-ins, a calming timer, safer-day checklist, Ethiopia-specific guidance and urgent-warning guidance | `src/components/SubstanceUseSupport.tsx` |
| Substance navigation | Replaced the underused Family Plan bottom navigation item with Substance / Wellbeing support; family planning remains available on the home-screen card | `src/App.tsx` |
| Theme remapping | Replaced weak light-green homepage accents with burgundy/rose-theme accents; substance-use uses the existing green clinical tokens instead of red or burgundy | `src/index.css`, `src/components/MaternalHome.tsx`, `src/components/SubstanceUseSupport.tsx` |
| Persistent action | Replaced the duplicated header SOS action with a persistent health-facility directory button; the bottom-center emergency action remains the only app-wide SOS button | `src/App.tsx`, `src/components/FacilityDirectory.tsx` |
| Responsive navigation | Restored visible page back buttons and standardized inner-header wrap behavior at narrow widths | `src/App.tsx`, `src/index.css` |
| Homepage hover feedback | Added shadow, hue, lift and pressed feedback to language buttons, life-stage buttons, emergency controls, symptom buttons, service cards and quick tools | `src/index.css`, `src/components/MaternalHome.tsx` |
| Postpartum tools | Added feeding timer, daily-care checklist, rest/hydration actions and postpartum warning checks | `src/components/PostpartumCare.tsx` |
| Image containment | Added fixed aspect-ratio treatment and `object-fit: contain` for the danger-sign silhouette and guarded visual cards against narrow-screen overflow | `src/index.css`, `src/components/DangerSignsSystem.tsx` |
| Local images | Added locally bundled counseling, midwife, birth-kit, hemorrhage, preeclampsia and silhouette assets with source documentation | `src/assets/images/ATTRIBUTION.md` |
| Final homepage theme correction | Removed the remaining green family-planning card treatment and restored burgundy/rose service-card styling; confirmed every language, lifecycle, emergency, symptom, service-card and quick-tool control has an explicit hover response | `src/index.css`, `src/components/MaternalHome.tsx` |
| Final local npm verification | Started the app with `npm run dev -- --host 0.0.0.0`, confirmed HTTP 200 on port 3000, and checked narrow-homepage rendering without document-level horizontal overflow | Local browser and npm run |
| Header and bottom navigation exchange | Moved app-wide SOS 907 to the persistent header and moved the health-facility directory into the bottom navigation | `src/App.tsx` |
| About navigation page | Added a right-most About button with usage guidance, privacy/offline information, medical-use notice and developer credit for `ha21ab` | `src/App.tsx`, `src/types.ts` |
| Bottom navigation expansion | Expanded persistent navigation to four compact items: Home, Substance/Wellbeing, Facilities and About; made the navigation available across desktop and mobile breakpoints | `src/App.tsx`, `src/index.css` |
| Language selector alignment | Unified the language selector to a single rounded segmented container with a full-height burgundy selected state instead of a contrasting small floating pill | `src/index.css`, `src/components/MaternalHome.tsx` |
| About brand lockup and Telegram guidance | Replaced the About heading and mark-only treatment with the existing branded lockup, and added direct-contact guidance for the associated Mela Care Telegram bot chat | `src/App.tsx`, `public/mela-lockup.png` |
| Danger-sign silhouette expansion | Increased the anatomical silhouette canvas and corrected the womb hotspot proportion so the interactive symbols align more closely with the medical image | `src/components/DangerSignsSystem.tsx`, `src/index.css` |

---

## TABLE 10: CHANGES COMPARED WITH THE PREVIOUS VERSION

| Previous State | Current State | Opportunity Cost / Trade-off |
| :--- | :--- | :--- |
| Light-green family-plan card and quick birth-kit accents competed with the theme | Restyled as burgundy/rose or neutral warm accents while retaining functionality | More coherent branding, but less of the previous green differentiation |
| Family Plan bottom navigation occupied a persistent slot | Persistent Substance support slot added; family planning remains reachable from its homepage card | Improves topical coverage for substance support, but removes family-planning as one-click bottom navigation |
| Header and bottom navigation both exposed SOS | Header now opens the health-facility directory; bottom navigation remains the only app-wide SOS action | Less duplicated emergency promotion, with facility access available on every screen |
| Postpartum support was limited or absent in some lifecycle states | Dedicated postpartum page and tools added | Adds useful support but increases route and maintenance surface |
| Most homepage controls lacked a visible desktop hover state | All language, stage, symptom, service-card and quick-tool controls now have hover and pressed states | Better discoverability; animation is automatically reduced where users prefer reduced motion |
| Risk of translated labels overflowing at 300–360 px | Added wrap and minimum-width safeguards across headers, grids, cards and buttons | Some compact labels may wrap instead of staying on one line |
| Inner back controls were hidden or inconsistent | Back button rules were restored and top-bar back control remains visible | Slightly increased header width; narrow screen CSS protects facility/SOS actions |

---

## TABLE 11: FINAL DEPLOYMENT READINESS

| Check | Status | Notes |
| :--- | :--- | :--- |
| TypeScript validation | Ready | Run `npm run lint` |
| Production build | Ready | Run `npm run build` |
| Utility tests | Ready | Current utility suite passes |
| PWA manifest and service worker | Ready for preview | Icons, scope, manifest and auto-update generation are configured; test an actual HTTPS install |
| Vercel configuration | Structurally ready | `vercel.json`, `api/index.ts` and Express server integration are present; confirm `/api/*` on Vercel preview |
| Vercel/Telegram HTTPS | Pending final domain | Telegram Mini App URL requires an HTTPS deployment and real Telegram in-app testing |
| Facility directory | Needs local verification | Do not claim every listed hospital/24-hour service/ambulance service until phones, hours and maternity services are confirmed |
| Emergency hotline claims | Needs local verification | National/952 availability and user-facing claims should be verified with Ethiopian authorities before public launch |
| Harari localization | Not fully complete | Source fallbacks are present, but native Harari copy and voice review remain required |
| Medical safety review | Not complete | Obtain Ethiopian obstetric, midwife and public-health review before clinical promotion |
| Privacy/security headers | Configured | CSP, CSP compatibility, API validation and basic Express headers should receive a production preview test |
| Image licenses | Partly documented | See `src/assets/images/ATTRIBUTION.md`; review repository asset licenses before commercial distribution |
| Final browser smoke check (2026-11-04) | Passed for the local homepage | npm server responded HTTP 200; lifecycle filtering, language controls, facility action and bottom navigation rendered; tested widths showed no document-level horizontal overflow |
