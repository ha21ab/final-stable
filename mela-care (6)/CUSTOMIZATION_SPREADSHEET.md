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
| `App Logo Icon` | Inlined Heart Icon | `src/App.tsx` (lines 107–109) | Glowing rose heart glyph | Replace with an `<img>` tag pointing to `src/assets/images/your_logo.png`. |
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
