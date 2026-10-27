/**
 * Central Metric Definitions & Glossary Registry for Maha-Command Center (MCC)
 * Authoritative source driving:
 * 1. <MetricTip> (Hover and keyboard-focus explanations on every figure across all screens)
 * 2. <TermInfo> (? info icons beside labels and terms)
 * 3. /glossary page and Header/Sidebar Glossary Drawer
 *
 * Each metric features an English ('en') and Marathi ('mr') entry defining:
 * - What the number/term means
 * - The mathematical formula or operational logic
 * - The official data source
 * - Sample data indicator if mock/simulation
 * - Time window, rounding, inputs, weights, and realistic example
 */

export interface MetricDefinition {
  key: string;
  category: 'cpi' | 'media' | 'crisis' | 'administration' | 'hoardings' | 'attendance';
  categoryLabel: {
    en: string;
    mr: string;
  };
  name: {
    en: string;
    mr: string;
  };
  shortDescription: {
    en: string;
    mr: string;
  };
  detailedMeaning: {
    en: string;
    mr: string;
  };
  formula: {
    en: string;
    mr: string;
  };
  inputs: {
    en: string[];
    mr: string[];
  };
  weights?: Record<string, number>;
  timeWindow: {
    en: string;
    mr: string;
  };
  rounding: {
    en: string;
    mr: string;
  };
  source: {
    en: string;
    mr: string;
  };
  isSampleData: boolean;
  example: {
    en: string;
    mr: string;
  };
}

export const METRIC_DEFINITIONS: Record<string, MetricDefinition> = {
  cpi: {
    key: 'cpi',
    category: 'cpi',
    categoryLabel: { en: 'Performance Index', mr: 'कामगिरी निर्देशांक' },
    name: {
      en: 'Communication Performance Index (CPI)',
      mr: 'संवाद कामगिरी निर्देशांक (CPI)',
    },
    shortDescription: {
      en: 'Comprehensive 100-point performance score evaluating district media reach, speed, perception, and crisis response.',
      mr: 'जिल्ह्यातील माध्यम पोहोच, गती, जनभावना आणि संकट निवारणाचे १०० गुणांवर आधारित मूल्यांकन.',
    },
    detailedMeaning: {
      en: 'The Communication Performance Index (CPI) is the apex institutional rating evaluated weekly for all 36 Maharashtra districts by DGIPR to benchmark government outreach, public perception, and operational agility.',
      mr: 'माहिती व जनसंपर्क महासंचालनालयाद्वारे (DGIPR) राज्यातील सर्व ३६ जिल्ह्यांसाठी साप्ताहिक मूल्यांकन केला जाणारा हा सर्वोच्च निर्देशांक आहे, ज्याद्वारे शासकीय योजनांची पोहोच, लोकभावना आणि प्रशासकीय गती मोजली जाते.',
    },
    formula: {
      en: 'CPI = Volume Score (35) + TAT/Speed Score (25) + Sentiment Index (25) + Crisis SLA Resolution Rate (15)',
      mr: 'CPI = प्रसिद्धी खंड (३५) + पूर्तता गती (२५) + लोकभावना निर्देशांक (२५) + संकट एसएलए निवारण दर (१५)',
    },
    inputs: {
      en: [
        'Total Press Releases & Ingested Articles (Volume)',
        'Average Processing Turnaround Time (TAT in mins)',
        'Composite 4-Stream Sentiment Index (%)',
        'Percentage of Rumors/Crises Resolved within 90 mins',
      ],
      mr: [
        'एकूण प्रसिद्धीपत्रके व संकलित वृत्त (प्रसिद्धी खंड)',
        'सरासरी पूर्तता वेळ (TAT मिनिटांमध्ये)',
        '४ प्रवाह संयुक्त लोकभावना निर्देशांक (%)',
        '९० मिनिटांच्या आत निकाली काढलेल्या अफवांची टक्केवारी',
      ],
    },
    weights: { volume: 35, speed: 25, sentiment: 25, crisisResolution: 15 },
    timeWindow: { en: 'Rolling 7 Days (Updated Daily at 06:00 IST)', mr: 'मागील ७ दिवस (दररोज सकाळी ०६:०० वाजता अद्ययावत)' },
    rounding: { en: 'Rounded to 2 decimal places (Max 100.00)', mr: '२ दशांश स्थळांपर्यंत (कमाल १००.००)' },
    source: { en: 'DGIPR Analytics Core & 36 District Feeds', mr: 'माहिती व जनसंपर्क महासंचालनालय व ३६ जिल्हा माहिती कार्यालये' },
    isSampleData: false,
    example: {
      en: 'Thane District: Volume 35.0 + Speed 24.5 + Sentiment 22.25 + Crisis SLA 15.0 = 96.75 CPI (Rank #1)',
      mr: 'ठाणे जिल्हा: प्रसिद्धी ३५.० + गती २४.५ + भावना २२.२५ + संकट निवारण १५.० = ९६.७५ CPI (क्रमांक १)',
    },
  },

  volume_score: {
    key: 'volume_score',
    category: 'cpi',
    categoryLabel: { en: 'Performance Index', mr: 'कामगिरी निर्देशांक' },
    name: {
      en: 'Volume Score (35 pts)',
      mr: 'प्रसिद्धी खंड गुण (३५ गुण)',
    },
    shortDescription: {
      en: 'Evaluates the total number of official press releases, event coverage, and ingested news stories against target.',
      mr: 'शासकीय प्रसिद्धीपत्रके, कार्यक्रम वार्तांकन आणि संकलित बातम्यांच्या संख्येचे उद्दिष्टाशी तुलनात्मक मूल्य.',
    },
    detailedMeaning: {
      en: 'Measures communication breadth. Full 35 points are awarded to districts meeting or exceeding the monthly publication baseline of 300 releases/articles.',
      mr: 'माध्यम प्रसाराचा आवाका मोजतो. दरमहा किमान ३०० प्रसिद्धीपत्रके किंवा बातम्यांचे उद्दिष्ट पूर्ण करणाऱ्या जिल्ह्याला कमाल ३५ पैकी ३५ गुण दिले जातात.',
    },
    formula: {
      en: 'Volume Score = Min(35, (Total Releases / Target Releases) * 35)',
      mr: 'प्रसिद्धी खंड गुण = Min(३५, (एकूण प्रसिद्धी / उद्दिष्ट प्रसिद्धी) * ३५)',
    },
    inputs: {
      en: ['Count of verified press notes published', 'Count of print/broadcast articles indexed'],
      mr: ['प्रसिद्ध केलेल्या अधिकृत प्रसिद्धीपत्रकांची संख्या', 'नोंदवलेल्या वृत्तपत्र व दूरदर्शन बातम्यांची संख्या'],
    },
    timeWindow: { en: 'Current Month / Selected Time Range', mr: 'चालू महिना / निवडलेला कालावधी' },
    rounding: { en: 'Rounded to 2 decimal places', mr: '२ दशांश स्थळांपर्यंत' },
    source: { en: 'DGIPR News Scanning Cell & DIO Records', mr: 'माध्यम स्कॅनिंग कक्ष व जिल्हा माहिती अधिकारी नोंद' },
    isSampleData: false,
    example: {
      en: 'Thane published 342 items against target of 300 -> 35.00 points',
      mr: 'ठाणे जिल्ह्याने ३०० च्या उद्दिष्टाविरुद्ध ३४२ प्रसिद्धी केल्या -> ३५.०० गुण',
    },
  },

  tat_speed_score: {
    key: 'tat_speed_score',
    category: 'cpi',
    categoryLabel: { en: 'Performance Index', mr: 'कामगिरी निर्देशांक' },
    name: {
      en: 'Turnaround Time (TAT) / Speed Score (25 pts)',
      mr: 'पूर्तता गती (TAT) गुण (२५ गुण)',
    },
    shortDescription: {
      en: 'Speed of ministerial event dissemination, cabinet decision publication, and prompt press issuance.',
      mr: 'मंत्रिमंडळ निर्णय आणि शासकीय घडामोडींची बातमी माध्यम कक्षापर्यंत पोहोचवण्याचा सरासरी वेळ.',
    },
    detailedMeaning: {
      en: 'Measures agility in minutes from event conclusion to official press release dispatch. Maximum 25 points awarded for average TAT <= 30 minutes; 0.5 points deducted per minute exceeded.',
      mr: 'घडामोड घडल्यापासून अधिकृत प्रसिद्धीपत्रक जारी होईपर्यंतचा वेळ मिनिटांत मोजला जातो. ३० मिनिटे किंवा त्यापेक्षा कमी वेळेसाठी पूर्ण २५ गुण, त्यानंतर प्रति मिनिट ०.५ गुण वजा केले जातात.',
    },
    formula: {
      en: 'Speed Score = Max(0, 25 - (Max(0, Average TAT - 30) * 0.5))',
      mr: 'गती गुण = Max(०, २५ - (Max(०, सरासरी TAT - ३०) * ०.५))',
    },
    inputs: { en: ['Event timestamp', 'Official press release dispatch timestamp'], mr: ['कार्यक्रमाची वेळ', 'अधिकृत प्रसिद्धीपत्रक वितरणाची वेळ'] },
    timeWindow: { en: 'Selected Time Range (Default: Last 7 Days)', mr: 'निवडलेला कालावधी (डीफॉल्ट: मागील ७ दिवस)' },
    rounding: { en: 'Rounded to 2 decimal places', mr: '२ दशांश स्थळांपर्यंत' },
    source: { en: 'Departmental Dispatch Timestamps & Audit Logs', mr: 'विभागीय प्रसिद्धी वेळ नोंद व प्रणाली ऑडिट लॉग' },
    isSampleData: false,
    example: {
      en: 'Average TAT of 34 mins: 25 - (4 * 0.5) = 23.00 points',
      mr: 'सरासरी ३४ मिनिटे TAT: २५ - (४ * ०.५) = २३.०० गुण',
    },
  },

  sentiment_index: {
    key: 'sentiment_index',
    category: 'media',
    categoryLabel: { en: 'Media Intelligence', mr: 'माध्यम गुप्तवार्ता' },
    name: {
      en: 'Sentiment Index',
      mr: 'लोकभावना निर्देशांक (Sentiment Index)',
    },
    shortDescription: {
      en: 'Weighted public and media perception index computed from Print OCR, Broadcast TV, Social Listening, and Citizen comments.',
      mr: 'वृत्तपत्रे, वृत्तवाहिन्या, सोशल मीडिया आणि नागरिक अभिप्रायावरून काढलेला एकत्रित अनुकूलता निर्देशांक.',
    },
    detailedMeaning: {
      en: 'The definitive institutional metric evaluating how public policies and government initiatives are received across 4 media channels. Used both as a standalone percentage and converted to 25 CPI points.',
      mr: 'शासकीय निर्णय आणि लोककल्याणकारी योजनांचा जनतेवरील आणि माध्यमांमधील सकारात्मक प्रभाव मोजणारा हा मुख्य निर्देशांक आहे. हा स्वतंत्र टक्केवारी तसेच CPI मधील २५ गुणांसाठी वापरला जातो.',
    },
    formula: {
      en: 'Sentiment Index = (Print OCR * 0.35) + (Broadcast TV * 0.25) + (Social Media * 0.25) + (User Comments * 0.15)',
      mr: 'लोकभावना निर्देशांक = (वृत्तपत्रे * ०.३५) + (दूरदर्शन वाहिन्या * ०.२५) + (सोशल मीडिया * ०.२५) + (नागरिक अभिप्राय * ०.१५)',
    },
    inputs: {
      en: [
        'Print OCR Positive/Neutral/Negative Polarity (35%)',
        'TV News Broadcast Tone & Prime-Time Share (25%)',
        'Social Media Mentions Sentiment on X/FB/Insta/YT (25%)',
        'Citizen Direct Comments & Grievance Feedback (15%)',
      ],
      mr: [
        'वृत्तपत्र ओसीआर अनुकूल/तटस्थ/प्रतिकूल विश्लेषण (३५%)',
        'दूरदर्शन वृत्तवाहिन्यांवरील बातमीचा सूर (२५%)',
        'एक्स, फेसबुक, इन्स्टाग्राम, युट्यूबवरील लोकभावना (२५%)',
        'नागरिकांचा थेट अभिप्राय व प्रतिक्रिया (१५%)',
      ],
    },
    weights: { printOcr: 0.35, broadcastTv: 0.25, socialListening: 0.25, userComments: 0.15 },
    timeWindow: { en: 'Dynamically recomputed across 24h, 7d, or 30d window', mr: '२४ तास, ७ दिवस किंवा ३० दिवसांच्या कालावधीनुसार स्वयंचलित रीतीने बदलणारा' },
    rounding: { en: 'Rounded to 1 decimal place (e.g. 78.4%)', mr: '१ दशांश स्थळापर्यंत (उदा. ७८.४%)' },
    source: { en: 'Live News Queue & Indic-BERT NLP Pipeline', mr: 'थेट बातमी प्रवाह व इंडिक-बर्ट कृत्रिम बुद्धिमत्ता इंजिन' },
    isSampleData: false,
    example: {
      en: 'Print: 82% * 0.35 (28.7) + TV: 78% * 0.25 (19.5) + Social: 80% * 0.25 (20.0) + Comments: 72% * 0.15 (10.8) = 79.0% Composite Index',
      mr: 'वृत्तपत्रे: ८२% * ०.३५ (२८.७) + टीव्ही: ७८% * ०.२५ (१९.५) + सोशल: ८०% * ०.२५ (२०.०) + अभिप्राय: ७२% * ०.१५ (१०.८) = ७९.०% एकत्रित निर्देशांक',
    },
  },

  crisis_sla_resolution_rate: {
    key: 'crisis_sla_resolution_rate',
    category: 'crisis',
    categoryLabel: { en: 'Crisis Operations', mr: 'आपत्कालीन ऑपरेशन्स' },
    name: {
      en: 'Crisis SLA Resolution Rate',
      mr: 'संकट एसएलए निवारण दर (Crisis SLA Resolution Rate)',
    },
    shortDescription: {
      en: 'Percentage of high-velocity rumors, viral misinfo, and media alerts resolved with authorized rebuttals within 90 minutes.',
      mr: '९० मिनिटांच्या आत अधिकृत खंडन प्रसिद्ध करून निकाली काढलेल्या अफवा व खोट्या बातम्यांची टक्केवारी.',
    },
    detailedMeaning: {
      en: 'Measures adherence to the mandatory 90-Minute Service Level Agreement (SLA). When a false rumor or misleading video appears in media or social networks, the district or central desk must coordinate fact-checking and issue an authorized rebuttal before the 90-minute countdown expires. Awards up to 15 CPI points.',
      mr: 'अनधिकृत अफवा, चुकीचे दावे व दिशाभूल करणाऱ्या व्हिडीओंवर ९० मिनिटांच्या आत वस्तुस्थितीदर्शक अधिकृत खुलासा प्रसिद्ध करण्याचा हा प्रशासकीय दर आहे. यावरून CPI चे १५ गुण निश्चित होतात.',
    },
    formula: {
      en: 'Crisis SLA Resolution Rate = (Incidents Resolved within 90 mins / Total Actionable Incidents) * 100',
      mr: 'संकट एसएलए निवारण दर = (९० मिनिटांत निकाली काढलेल्या घटना / एकूण संकट घटना) * १००',
    },
    inputs: {
      en: ['Number of misinformation incidents resolved within 90-minute window', 'Total actionable incidents identified in period'],
      mr: ['९० मिनिटांच्या आत निकाली काढलेल्या घटनांची संख्या', 'कालावधीत नोंदवलेल्या एकूण घटनांची संख्या'],
    },
    timeWindow: { en: 'Selected Time Range (24h / 7d / 30d)', mr: 'निवडलेला कालावधी (२४ तास / ७ दिवस / ३० दिवस)' },
    rounding: { en: 'Rounded to 1 decimal place (CPI component: (Rate / 100) * 15)', mr: '१ दशांश स्थळापर्यंत (CPI गुण: (दर / १००) * १५)' },
    source: { en: 'Crisis SLA Command Desk & Maha Fact-Check Registry', mr: 'आपत्कालीन एसएलए नियंत्रण कक्ष व महा फॅक्टचेक नोंद' },
    isSampleData: false,
    example: {
      en: '19 out of 20 rumors refuted in <90 mins = 95.0% resolution rate -> 14.25 CPI points',
      mr: '२० पैकी १९ अफवांचे ९० मिनिटांच्या आत खंडन = ९५.०% निवारण दर -> १४.२५ CPI गुण',
    },
  },

  misinformation_tickets: {
    key: 'misinformation_tickets',
    category: 'crisis',
    categoryLabel: { en: 'Crisis Operations', mr: 'आपत्कालीन ऑपरेशन्स' },
    name: {
      en: 'Misinformation Tickets',
      mr: 'दिशाभूल माहिती व अफवा तिकीटे',
    },
    shortDescription: {
      en: 'Count of active and resolved rumor alerts generated automatically from flagged media items and unverified viral claims.',
      mr: 'सोशल मीडिया व माध्यमांतून पुढे आलेल्या आणि तपासणीसाठी नोंदवलेल्या अफवांची संख्या.',
    },
    detailedMeaning: {
      en: 'Every flagged news clipping, social post, or broadcast anomaly identified as misleading or factually incorrect automatically spawns a tracked ticket linking directly to the source URL and triggering the 90-minute SLA countdown.',
      mr: 'दिशाभूल करणारी बातमी, सोशल पोस्ट किंवा अफवा आढळल्यास तात्काळ तयार होणारे तपासणी तिकीट, ज्याला मूळ बातमीचा संदर्भ आणि ९० मिनिटांचा टायमर जोडलेला असतो.',
    },
    formula: {
      en: 'Count of open, authorized, or dismissed tickets originated from live news queue items',
      mr: 'थेट बातमी प्रवाहातून निर्माण झालेल्या सक्रिय, मंजूर किंवा निकाली काढलेल्या तिकीटांची गणना',
    },
    inputs: { en: ['News queue items marked as Flagged Misinfo', 'Keyword heuristics (rumor, fake, misleading)'], mr: ['अफवा म्हणून चिन्हांकित बातम्या', 'कीवर्ड ट्रिगर (अफवा, बनावट, खोटे)'] },
    timeWindow: { en: 'Real-time live queue snapshot', mr: 'थेट तात्काळ स्थिती' },
    rounding: { en: 'Exact integer count', mr: 'अचूक पूर्णांक संख्या' },
    source: { en: 'Automated Filtration Pipeline & Social Cell', mr: 'स्वयंचलित फिल्ट्रेशन पाइपलाइन व सोशल मीडिया सेल' },
    isSampleData: false,
    example: {
      en: '1 Active in SLA · 10 Resolved today across Konkan Division',
      mr: '१ तिकीट एसएलएमध्ये सक्रिय · कोकण विभागात आज १० तिकीटे निकाली काढली',
    },
  },

  total_releases: {
    key: 'total_releases',
    category: 'administration',
    categoryLabel: { en: 'Administration', mr: 'प्रशासकीय माहिती' },
    name: {
      en: 'Total Press Releases Dispatched',
      mr: 'एकूण वितरित प्रसिद्धीपत्रके',
    },
    shortDescription: {
      en: 'Aggregated bilingual official government statements, ministerial press notes, and photo releases published.',
      mr: 'प्रसिद्ध केलेली एकूण अधिकृत द्वैभाषिक प्रसिद्धीपत्रके, मंत्रिमंडळ निर्णय व छायाचित्र प्रसिद्धी.',
    },
    detailedMeaning: {
      en: 'Total number of authenticated press notes authored by line departments, translated into Marathi/English, signed off by DIOs or Secretary desks, and dispatched to accredited journalists and media houses.',
      mr: 'शासकीय विभागांकडून तयार केलेली, मराठी व इंग्रजी अनुवाद झालेली आणि मान्यताप्राप्त पत्रकारांना वितरित केलेली एकूण अधिकृत प्रसिद्धीपत्रके.',
    },
    formula: { en: 'Sum of all published press releases across 21 departments and 36 districts', mr: '२१ विभाग व ३६ जिल्ह्यांमधील सर्व प्रसिद्ध केलेल्या प्रसिद्धीपत्रकांची बेरीज' },
    inputs: { en: ['Departmental PR dispatch log'], mr: ['विभागीय प्रसिद्धीपत्रक वितरण नोंद'] },
    timeWindow: { en: 'Selected timeframe (Default: 24h / 7d / 30d)', mr: 'निवडलेला कालावधी (२४ तास / ७ दिवस / ३० दिवस)' },
    rounding: { en: 'Integer count', mr: 'पूर्णांक संख्या' },
    source: { en: 'DGIPR News Dispatch Portal', mr: 'माहिती व जनसंपर्क महासंचालनालय बातमी वितरण प्रणाली' },
    isSampleData: false,
    example: {
      en: '1,482 releases published across Maharashtra this week',
      mr: 'या आठवड्यात महाराष्ट्रभरात १,४८२ प्रसिद्धीपत्रके वितरित केली',
    },
  },

  attendance_rate: {
    key: 'attendance_rate',
    category: 'attendance',
    categoryLabel: { en: 'Biometric Attendance', mr: 'बायोमेट्रिक उपस्थिती' },
    name: {
      en: 'Aadhaar BAS Biometric Attendance Rate',
      mr: 'आधार बायोमेट्रिक उपस्थिती टक्केवारी',
    },
    shortDescription: {
      en: 'Daily biometric attendance compliance percentage across 36 District Information Offices and Mantralaya HQ.',
      mr: 'राज्यातील ३६ जिल्हा माहिती कार्यालये व मंत्रालय मुख्यालयातील दैनिक आधार उपस्थिती टक्केवारी.',
    },
    detailedMeaning: {
      en: 'Measures the proportion of staff members who have successfully punched in via Aadhaar-enabled Biometric Attendance Systems (BAS) on the selected date before close of morning operational session.',
      mr: 'निवडलेल्या दिवशी सकाळच्या सत्रात आधार प्रणालीद्वारे वेळेवर अंगठा लावून हजेरी नोंदवणाऱ्या कर्मचाऱ्यांची टक्केवारी दर्शवतो.',
    },
    formula: {
      en: 'Attendance % = (Staff Present Today / Total Sanctioned Staff Strength) * 100',
      mr: 'उपस्थिती % = (आज उपस्थित कर्मचारी / एकूण मंजूर पदे) * १००',
    },
    inputs: { en: ['UIDAI Aadhaar BAS punch log', 'Sanctioned staffing roster from Establishment Wing'], mr: ['आधार बायोमेट्रिक नोंदणी डेटा', 'आस्थापना शाखेची मंजूर पदे'] },
    timeWindow: { en: 'Selected date (Defaults to current calendar date)', mr: 'निवडलेली तारीख (डीफॉल्ट: आजची चालू तारीख)' },
    rounding: { en: 'Rounded to 1 decimal place (e.g. 96.2%)', mr: '१ दशांश स्थळापर्यंत (उदा. ९६.२%)' },
    source: { en: 'National Informatics Centre (NIC) Maharashtra BAS Gateway', mr: 'राष्ट्रीय सूचना विज्ञान केंद्र (NIC) महाराष्ट्र बायोमेट्रिक गेटवे' },
    isSampleData: false,
    example: {
      en: 'Palghar DIO: 14 present out of 15 sanctioned staff = 93.3% attendance',
      mr: 'पालघर जिल्हा माहिती कार्यालय: १५ पैकी १४ कर्मचारी हजर = ९३.३% उपस्थिती',
    },
  },

  punctuality_rate: {
    key: 'punctuality_rate',
    category: 'attendance',
    categoryLabel: { en: 'Biometric Attendance', mr: 'बायोमेट्रिक उपस्थिती' },
    name: {
      en: 'Punctuality Compliance Rate',
      mr: 'वेळेवर उपस्थिती अनुपालन दर',
    },
    shortDescription: {
      en: 'Proportion of present staff members who punched in before 09:45 AM IST.',
      mr: 'सकाळी ०९:४५ पूर्वी हजेरी नोंदवणाऱ्या उपस्थित कर्मचाऱ्यांचे प्रमाण.',
    },
    detailedMeaning: {
      en: 'Monitors prompt reporting at government information offices to guarantee 24x7 media desk readiness and rapid morning news scanning.',
      mr: 'माध्यम स्कॅनिंग आणि वार्तांकनासाठी सर्व माहिती कार्यालये वेळेवर सुरू राहतील याची खात्री करणारा दर.',
    },
    formula: {
      en: 'Punctuality Rate = (Staff Logged in before 09:45 AM / Total Staff Present) * 100',
      mr: 'वेळेवर हजेरी दर = (०९:४५ पूर्वी हजर कर्मचारी / एकूण उपस्थित कर्मचारी) * १००',
    },
    inputs: { en: ['Aadhaar BAS punch timestamp'], mr: ['आधार बायोमेट्रिक पंच वेळेची नोंद'] },
    timeWindow: { en: 'Current work day (09:45 AM cutoff)', mr: 'चालू कार्यालयीन दिवस (०९:४५ ची वेळ)' },
    rounding: { en: 'Rounded to 1 decimal place', mr: '१ दशांश स्थळापर्यंत' },
    source: { en: 'NIC Biometric BAS Server', mr: 'एनआयसी बायोमेट्रिक सर्व्हर' },
    isSampleData: false,
    example: {
      en: '13 logged in before 09:45 AM out of 14 present = 92.9% punctuality',
      mr: '१४ उपस्थित कर्मचाऱ्यांपैकी १३ कर्मचारी ०९:४५ पूर्वी हजर = ९२.९% वेळेवर उपस्थिती',
    },
  },

  hoardings_count: {
    key: 'hoardings_count',
    category: 'hoardings',
    categoryLabel: { en: 'Publicity Hoardings', mr: 'शासकीय फलक (होर्डिंग्स)' },
    name: {
      en: 'Active Government Scheme Hoardings',
      mr: 'सक्रिय शासकीय योजना फलक (होर्डिंग्स)',
    },
    shortDescription: {
      en: 'Count of audited 40x20ft unipole publicity hoardings displaying key state welfare campaigns.',
      mr: 'प्रमुख राज्य योजनांची माहिती देणारे प्रमाणित ४०x२० फूट आकाराचे युनिपोल फलक.',
    },
    detailedMeaning: {
      en: 'Monitors physical outdoor publicity for Mukhyamantri Majhi Ladki Bahin, Namo Shetkari, Maha Metro, and Jalyukta Shivar across prime highway interchanges and municipal locations in all 36 districts. Refreshed nightly at 02:00 IST.',
      mr: 'लाडकी बहीण, नमो शेतकरी, महा मेट्रो, जलयुक्त शिवार यांसारख्या प्रमुख योजनांच्या राज्यभरातील अधिकृत होर्डिंग्सचे जीपीएस प्रमाणित संनियंत्रण. दररोज रात्री ०२:०० वाजता अद्ययावत होते.',
    },
    formula: { en: 'Count of geotagged, physically verified active hoardings across 36 districts', mr: '३६ जिल्ह्यांमधील जिओ-टॅग केलेल्या व प्रत्यक्ष तपासणी झालेल्या फलकांची संख्या' },
    inputs: { en: ['Geotagged inspection photo uploads', 'Contractor maintenance logs'], mr: ['जिओ-टॅग छायाचित्रे व तपासणी अहवाल', 'कंत्राटदार देखभाल नोंद'] },
    timeWindow: { en: 'Refreshed nightly at 02:00 IST (Flagged stale after 36 hours)', mr: 'दररोज रात्री ०२:०० वाजता अद्ययावत (३६ तासांनंतर जुने दर्शवले जाते)' },
    rounding: { en: 'Exact integer count', mr: 'अचूक पूर्णांक संख्या' },
    source: { en: 'DGIPR Outdoor Advertisement Cell & District Feeds', mr: 'माहिती व जनसंपर्क जाहिरात कक्ष व जिल्हा अहवाल' },
    isSampleData: true,
    example: {
      en: '1,280 active verified hoardings statewide; 89% illuminated at night',
      mr: 'राज्यभरात १,२८० सक्रिय फलक; रात्रीच्या वेळी ८९% फलक दिव्यांनी प्रकाशमान',
    },
  },

  active_tv_channels: {
    key: 'active_tv_channels',
    category: 'media',
    categoryLabel: { en: 'Media Intelligence', mr: 'माध्यम गुप्तवार्ता' },
    name: {
      en: 'Broadcast TV Channels Monitored',
      mr: 'थेट संनियंत्रण वृत्तवाहिन्या',
    },
    shortDescription: {
      en: 'Live 24x7 automated broadcast telemetry from accredited regional Marathi news channels.',
      mr: 'मान्यताप्राप्त प्रादेशिक मराठी वृत्तवाहिन्यांचे २४ तास स्वयंचलित थेट संनियंत्रण.',
    },
    detailedMeaning: {
      en: 'Real-time telemetry and audio transcription tracking coverage minutes, prime-time debates, and government announcement airtime across ABP Majha, TV9 Marathi, Zee 24 Taas, Saam TV, News18 Lokmat, and DD Sahyadri.',
      mr: 'एबीपी माझा, टीव्ही९ मराठी, झी २४ तास, साम टीव्ही, न्यूज१८ लोकमत आणि दूरदर्शन सह्याद्री या वाहिन्यांवरील बातम्या व थेट चर्चांचे संनियंत्रण.',
    },
    formula: { en: 'Count of active high-definition low-latency video feed tunnels streaming into Mantralaya', mr: 'मंत्रालय आदेश कक्षाशी जोडलेल्या थेट एचडी फीड्सची संख्या' },
    inputs: { en: ['RF Tuner / IP multicast transport streams'], mr: ['थेट आयपी मल्टीकास्ट प्रवाह'] },
    timeWindow: { en: 'Continuous Real-time 24x7', mr: 'अखंड २४x७ थेट प्रवाह' },
    rounding: { en: 'Integer count', mr: 'पूर्णांक संख्या' },
    source: { en: 'DGIPR Audio-Visual Monitoring Desk', mr: 'माहिती व जनसंपर्क दृकश्राव्य कक्ष' },
    isSampleData: false,
    example: {
      en: '6 Channels Streaming · Average 38% Government Welfare Airtime Share',
      mr: '६ वृत्तवाहिन्या थेट सुरू · सरासरी ३८% शासकीय बातमी वाटा',
    },
  },

  newspaper_clippings_count: {
    key: 'newspaper_clippings_count',
    category: 'media',
    categoryLabel: { en: 'Media Intelligence', mr: 'माध्यम गुप्तवार्ता' },
    name: {
      en: 'Newspaper Clippings Digitized',
      mr: 'डिजिटल वृत्तपत्र कात्रणे (OCR)',
    },
    shortDescription: {
      en: 'Daily digitized newspaper articles across 18 major Marathi dailies and 36 district editions.',
      mr: '१८ प्रमुख मराठी दैनिके आणि ३६ जिल्हा आवृत्त्यांमधून दररोज डिजिटल केलेले लेख.',
    },
    detailedMeaning: {
      en: 'Every morning, district media scanning wings scan local and state editions of Lokmat, Sakal, Maharashtra Times, Loksatta, Pudhari, etc., digitizing them using Devanagari OCR into searchable text and sentiment polarity records.',
      mr: 'दररोज सकाळी राज्यातील १८ वृत्तपत्रांमधील बातम्या देवनागरी ओसीआरद्वारे स्कॅन करून शोधण्यायोग्य मजकूर व जनभावना विश्लेषणासाठी नोंदवल्या जातात.',
    },
    formula: { en: 'Count of verified newspaper clipping records in database', mr: 'डेटाबेसमध्ये नोंदवलेल्या एकूण वृत्त कात्रणांची संख्या' },
    inputs: { en: ['OCR scanner upload batches', 'District DIO clipping index'], mr: ['ओसीआर स्कॅनर अपलोड तुकड्या', 'जिल्हा माहिती अधिकारी कात्रण नोंद'] },
    timeWindow: { en: 'Rolling daily archive (516 clippings indexed)', mr: 'दैनंदिन संग्रह (५१६ कात्रणे नोंदणीकृत)' },
    rounding: { en: 'Exact count', mr: 'अचूक संख्या' },
    source: { en: 'DGIPR Print Media Scanning Wing', mr: 'मुद्रित माध्यम स्कॅनिंग कक्ष' },
    isSampleData: true,
    example: {
      en: '516 Clippings indexed across 36 districts · Reach: 4.8 Million Readers',
      mr: '३६ जिल्ह्यांमधून ५१६ कात्रणे डिजिटल केली · पोहोच: ४८ लाख वाचक'
    },
  },

  // GLOSSARY TERMS
  rebuttal: {
    key: 'rebuttal',
    category: 'crisis',
    categoryLabel: { en: 'Crisis Operations', mr: 'आपत्कालीन ऑपरेशन्स' },
    name: { en: 'Rebuttal', mr: 'अधिकृत खंडन (Rebuttal)' },
    shortDescription: { en: 'Factually verified counter-statement refuting a viral rumor or misleading claim.', mr: 'अफवा किंवा खोट्या बातमीचे तथ्यपूर्ण अधिकृत शासकीय खंडन.' },
    detailedMeaning: {
      en: 'An official, legally vetted press release or digital advisory issued by a District Collector or the Director General of Information to dispel false information before it impacts public peace or welfare distribution.',
      mr: 'जिल्हाधिकारी किंवा महासंचालक यांच्या स्वाक्षरीने प्रसिद्ध केलेला अधिकृत खुलासा, ज्याद्वारे अफवांना पायबंद घालून खरी वस्तुस्थिती जनतेसमोर मांडली जाते.',
    },
    formula: { en: 'Approved counter-statement linking to verified government evidence', mr: 'शासकीय पुराव्यांवर आधारित मंजूर खुलासा' },
    inputs: { en: ['Official department verification', 'Collector authorization'], mr: ['विभागीय तपासणी अहवाल', 'जिल्हाधिकारी मान्यता'] },
    timeWindow: { en: 'Must be issued within 90 minutes of rumor detection', mr: 'अफवा आढळल्यापासून ९० मिनिटांच्या आत जारी करणे अनिवार्य' },
    rounding: { en: 'N/A', mr: 'लागू नाही' },
    source: { en: 'District Magistrate / DGIPR Fact-Check Cell', mr: 'जिल्हाधिकारी / फॅक्टचेक कक्ष' },
    isSampleData: false,
    example: {
      en: 'Official rebuttal refuting false earthquake rumors in Dahanu coastal belt issued at 16:35 IST',
      mr: 'डहाणू किनारपट्टीवरील भूकंपाच्या खोट्या अफवेचे जिल्हा प्रशासनाकडून दुपारी १६:३५ वाजता अधिकृत खंडन',
    },
  },

  dio: {
    key: 'dio',
    category: 'administration',
    categoryLabel: { en: 'Administration', mr: 'प्रशासकीय रचना' },
    name: { en: 'District Information Officer (DIO)', mr: 'जिल्हा माहिती अधिकारी (DIO)' },
    shortDescription: { en: 'Nodal state public relations officer stationed at each district collectorate.', mr: 'प्रत्येक जिल्हाधिकारी कार्यालयातील माध्यम व माहिती संपर्क प्रमुख अधिकारी.' },
    detailedMeaning: {
      en: 'A Class-I gazetted officer of the Directorate General of Information and Public Relations who serves as the official spokesperson for the District Collector and coordinates media intelligence, emergency rebuttals, and local press management.',
      mr: 'माहिती व जनसंपर्क महासंचालनालयाचे वर्ग-१ चे राजपत्रित अधिकारी, जे जिल्हाधिकाऱ्यांचे माध्यम सल्लागार व जिल्हा माहिती कार्यालयाचे प्रमुख म्हणून काम पाहतात.',
    },
    formula: { en: 'Stationed across all 36 district headquarters in Maharashtra', mr: 'महाराष्ट्रातील सर्व ३६ जिल्हा मुख्यालयांमध्ये कार्यरत' },
    inputs: { en: ['District jurisdiction records'], mr: ['जिल्हा कार्यक्षेत्र नोंद'] },
    timeWindow: { en: 'Permanent Administrative Post', mr: 'कायमस्वरूपी प्रशासकीय पद' },
    rounding: { en: 'N/A', mr: 'लागू नाही' },
    source: { en: 'DGIPR Establishment Department', mr: 'माहिती व जनसंपर्क आस्थापना शाखा' },
    isSampleData: false,
    example: {
      en: 'Rudresh Kumar Sawant, DIO Thane (+91 22 2534 4022)',
      mr: 'रुद्रेश कुमार सावंत, जिल्हा माहिती अधिकारी ठाणे (फोन: +९१ २२ २५३४ ४०२२)',
    },
  },

  division: {
    key: 'division',
    category: 'administration',
    categoryLabel: { en: 'Administration', mr: 'प्रशासकीय रचना' },
    name: { en: 'Revenue / Administrative Division', mr: 'प्रशासकीय महसूल विभाग' },
    shortDescription: { en: 'Higher-tier regional grouping coordinating multiple district administrations.', mr: 'अनेक जिल्ह्यांचा समन्वय साधणारा प्रादेशिक प्रशासकीय विभाग.' },
    detailedMeaning: {
      en: 'Maharashtra is divided into 6 administrative revenue divisions (Konkan, Pune, Nashik, Chhatrapati Sambhajinagar, Amravati, Nagpur) and 9 DGIPR information divisions led by Divisional Deputy Directors.',
      mr: 'महाराष्ट्रात ६ महसूल विभाग (कोकण, पुणे, नाशिक, छत्रपती संभाजीनगर, अमरावती, नागपूर) आणि ९ विभागीय माहिती कार्यालये आहेत, ज्यांचे नेतृत्व विभागीय उपसंचालक करतात.',
    },
    formula: { en: 'Constitutes groups of 2 to 7 contiguous districts', mr: '२ ते ७ जिल्ह्यांचा समावेश असलेला प्रशासकीय घटक' },
    inputs: { en: ['Revenue department state gazette'], mr: ['महसूल विभाग शासन राजपत्र'] },
    timeWindow: { en: 'Statutory Administrative Boundaries', mr: 'वैधानिक प्रशासकीय सीमा' },
    rounding: { en: 'N/A', mr: 'लागू नाही' },
    source: { en: 'Government of Maharashtra Administrative Registry', mr: 'महाराष्ट्र शासन प्रशासकीय नोंदवही' },
    isSampleData: false,
    example: {
      en: 'Konkan Division: Palghar, Thane, Mumbai City, Mumbai Suburban, Raigad, Ratnagiri, Sindhudurg',
      mr: 'कोकण विभाग: पालघर, ठाणे, मुंबई शहर, मुंबई उपनगर, रायगड, रत्नागिरी, सिंधुदुर्ग',
    },
  },

  under_review: {
    key: 'under_review',
    category: 'administration',
    categoryLabel: { en: 'Administration', mr: 'प्रशासकीय प्रक्रिया' },
    name: { en: 'Under Review Status', mr: 'पुनरावलोकन स्थिती (Under Review)' },
    shortDescription: { en: 'Press release or incident ticket undergoing multi-stage administrative verification.', mr: 'प्रशासकीय छाननी व तपासणी प्रक्रियेत असलेले प्रसिद्धीपत्रक किंवा तिकीट.' },
    detailedMeaning: {
      en: 'Indicates an item has been drafted or reported but is pending mandatory verification: either department approval, legal fact-checking, or Collector/Secretary sign-off before official publication to accredited media.',
      mr: 'मसुदा तयार झाल्यानंतर अधिकृत वितरणापूर्वी विभागीय मंजुरी, कायदेशीर पडताळणी किंवा जिल्हाधिकारी/सचिव स्वाक्षरीच्या प्रतीक्षेत असलेली स्थिती.',
    },
    formula: { en: 'State transitioning: Draft -> Under Review -> Published / Authorized', mr: 'टप्पे: मसुदा -> पुनरावलोकन -> प्रसिद्ध / अधिकृत' },
    inputs: { en: ['Submission timestamp', 'Pending reviewer role', 'Next mandatory action'], mr: ['सादरीकरणाची वेळ', 'प्रलंबित मंजुरी अधिकारी', 'पुढील आवश्यक कृती'] },
    timeWindow: { en: 'SLA target: maximum 45 minutes review period', mr: 'जास्तीत जास्त ४५ मिनिटांत मंजुरीचे उद्दिष्ट' },
    rounding: { en: 'N/A', mr: 'लागू नाही' },
    source: { en: 'DGIPR Editorial Approval Workflow', mr: 'संपादकीय व मंजुरी कार्यप्रणाली' },
    isSampleData: false,
    example: {
      en: 'Draft PR submitted at 14:10 IST · Pending: Directorate Technical Review · Next: Collector sign-off',
      mr: 'दुपारी १४:१० वाजता सादर · प्रलंबित: तांत्रिक तपासणी · पुढील पायरी: जिल्हाधिकारी स्वाक्षरी',
    },
  },
};

export function getMetricDefinition(key: string): MetricDefinition | null {
  const normKey = (key || '').toLowerCase().trim();
  return METRIC_DEFINITIONS[normKey] || null;
}
