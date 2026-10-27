/**
 * Citizen Services & Grievance Resolution Dataset
 * 
 * Tracks citizen issues across Maharashtra districts with full accountability fields:
 * - City / District name
 * - Issue details
 * - Number of people affected
 * - Date raised
 * - Current status
 * - Responsible office
 * - Time to resolve
 */

export interface CitizenServiceRecord {
  id: string;
  ticketNumber: string;
  district: string;
  districtMr: string;
  city: string;
  cityMr: string;
  issueDetails: string;
  issueDetailsMr: string;
  peopleAffected: number;
  dateRaised: string;
  status: 'Resolved' | 'In Progress' | 'Escalated' | 'Under Investigation';
  statusMr: string;
  responsibleOffice: string;
  responsibleOfficeMr: string;
  timeToResolve: string;
  timeToResolveMr: string;
  category: 'Healthcare' | 'Water Supply' | 'Roads & Transport' | 'Agriculture' | 'Revenue & Land' | 'Education';
  categoryMr: string;
  timeline: Array<{
    timestamp: string;
    action: string;
    actionMr: string;
    actor: string;
  }>;
  resolutionSummary?: string;
  resolutionSummaryMr?: string;
}

export const CITIZEN_SERVICES_DATA: CitizenServiceRecord[] = [
  {
    id: 'CS-2026-101',
    ticketNumber: 'GRV-PAL-2026-4412',
    district: 'Palghar',
    districtMr: 'पालघर',
    city: 'Dahanu',
    cityMr: 'डहाणू',
    issueDetails: 'Essential anti-venom and antibiotic stock shortage reported at Dahanu Taluka PHC following flash monsoon waterlogging.',
    issueDetailsMr: 'अचानक पावसामुळे डहाणू तालुका प्राथमिक आरोग्य केंद्रात सर्पदंश प्रतिबंधक लस व औषधांचा तुटवडा.',
    peopleAffected: 1450,
    dateRaised: '26 Oct 2026, 06:45 IST',
    status: 'In Progress',
    statusMr: 'प्रगतीपथावर',
    responsibleOffice: 'District Health Officer (DHO), Palghar',
    responsibleOfficeMr: 'जिल्हा आरोग्य अधिकारी, पालघर',
    timeToResolve: 'Target: 4 hrs (Remaining: 1h 15m)',
    timeToResolveMr: 'लक्ष्य: ४ तास (शिल्लक: १ तास १५ मि)',
    category: 'Healthcare',
    categoryMr: 'आरोग्य',
    timeline: [
      {
        timestamp: '06:45 IST',
        action: 'Grievance flagged via DIO Field Health Alert Network',
        actionMr: 'डीआयओ आरोग्य नेटवर्कद्वारे तक्रार नोंदवली',
        actor: 'Taluka Field Reporter',
      },
      {
        timestamp: '07:15 IST',
        action: 'Emergency courier dispatched from Manor central medical warehouse',
        actionMr: 'मनोर मध्यवर्ती औषध भांडारातून तातडीने पुरवठा रवाना',
        actor: 'Palghar Civil Surgeon',
      },
      {
        timestamp: '08:30 IST',
        action: 'Ground confirmation: shipment in transit near Charoti naka',
        actionMr: 'औषध पुरवठा चारोटी नाक्याजवळ पोहोचल्याची पुष्टी',
        actor: 'Traffic Liaison Officer',
      },
    ],
    resolutionSummary: 'Emergency medical supplies in transit; replenishment scheduled before 10:00 IST.',
    resolutionSummaryMr: 'तातडीचा औषध पुरवठा मार्गावर असून सकाळी १०:०० पूर्वी पोहोचणे अपेक्षित.',
  },
  {
    id: 'CS-2026-102',
    ticketNumber: 'GRV-THA-2026-3829',
    district: 'Thane',
    districtMr: 'ठाणे',
    city: 'Bhiwandi',
    cityMr: 'भिवंडी',
    issueDetails: 'Drinking water pipeline rupture at Dhamankar Naka causing low water pressure in 4 municipal wards.',
    issueDetailsMr: 'धामणकर नाका येथे पिण्याच्या पाण्याची मुख्य वाहिनी फुटल्याने ४ प्रभागांमध्ये पाणीपुरवठा खंडित.',
    peopleAffected: 6200,
    dateRaised: '26 Oct 2026, 04:30 IST',
    status: 'Resolved',
    statusMr: 'निवारित',
    responsibleOffice: 'Executive Engineer, Bhiwandi-Nizampur Water Supply',
    responsibleOfficeMr: 'कार्यकारी अभियंता, भिवंडी-निजामपूर पाणीपुरवठा',
    timeToResolve: 'Resolved in 2 hrs 40 mins',
    timeToResolveMr: '२ तास ४० मिनिटांत निवारण पूर्ण',
    category: 'Water Supply',
    categoryMr: 'पाणीपुरवठा',
    timeline: [
      {
        timestamp: '04:30 IST',
        action: 'Rupture detected by SCADA pressure drop sensors',
        actionMr: 'स्कॅडा प्रणालीद्वारे दाब घट नोंदवली गेली',
        actor: 'Automated Sensor Desk',
      },
      {
        timestamp: '05:10 IST',
        action: 'Municipal maintenance crew isolated gate valve and initiated welding',
        actionMr: 'पाणीपुरवठा दुरुस्ती पथकाकडून वाहिनी वेल्डिंग सुरू',
        actor: 'Sub-Divisional Engineer',
      },
      {
        timestamp: '07:10 IST',
        action: 'Welding completed, pressure restored to 2.4 bar, DIO issued public notice',
        actionMr: 'दुरुस्ती पूर्ण, पाणीपुरवठा सुरळीत, डीआयओकडून प्रसिद्धीपत्रक',
        actor: 'Thane Municipal Corporation',
      },
    ],
    resolutionSummary: 'Water pipeline successfully welded and tested. Water supply fully restored.',
    resolutionSummaryMr: 'वाहिनी दुरुस्त करून पाणीपुरवठा पूर्ववत करण्यात आला.',
  },
  {
    id: 'CS-2026-103',
    ticketNumber: 'GRV-RAI-2026-2910',
    district: 'Raigad',
    districtMr: 'रायगड',
    city: 'Alibag',
    cityMr: 'अलिबाग',
    issueDetails: 'High-tide sea embankment breach alert near Kihim beach threatening 3 coastal fishing hamlets.',
    issueDetailsMr: 'किहीम किनाऱ्याजवळ भरतीमुळे सुरक्षा भिंतीला तडा, ३ मच्छीमार वस्त्यांना धोका.',
    peopleAffected: 890,
    dateRaised: '25 Oct 2026, 17:15 IST',
    status: 'In Progress',
    statusMr: 'प्रगतीपथावर',
    responsibleOffice: 'Harbour Engineering Division & Sub-Divisional Magistrate, Alibag',
    responsibleOfficeMr: 'पतन अभियांत्रिकी विभाग व उपविभागीय दंडाधिकारी, अलिबाग',
    timeToResolve: 'Target: 8 hrs (Sandbag reinforcement 75% complete)',
    timeToResolveMr: 'लक्ष्य: ८ तास (वाळूची पोती रचण्याचे काम ७५% पूर्ण)',
    category: 'Roads & Transport',
    categoryMr: 'रस्ते व पायाभूत सुविधा',
    timeline: [
      {
        timestamp: '17:15 IST',
        action: 'Fisheries society alerted coastal police and disaster control cell',
        actionMr: 'मच्छीमार संस्थेकडून आपत्ती नियंत्रण कक्षाला सूचना',
        actor: 'Coastal Patrol Guard',
      },
      {
        timestamp: '18:00 IST',
        action: 'Geo-synthetic sandbags and JCB machines mobilized by PWD',
        actionMr: 'सार्वजनिक बांधकाम विभागाकडून पोती व यंत्रसामग्री दाखल',
        actor: 'Raigad Disaster Cell',
      },
    ],
    resolutionSummary: 'Reinforcement bund underway; high tide safely contained with zero casualties.',
    resolutionSummaryMr: 'सुरक्षा बंधारा उभारणी वेगाने सुरू, कोणतीही हानी नाही.',
  },
  {
    id: 'CS-2026-104',
    ticketNumber: 'GRV-RAT-2026-1540',
    district: 'Ratnagiri',
    districtMr: 'रत्नागिरी',
    city: 'Chiplun',
    cityMr: 'चिपळूण',
    issueDetails: 'Vashishti river bridge sensor communication latency exceeding 120s due to optical fiber cut.',
    issueDetailsMr: 'वाशिष्ठी नदी पूल पूर पातळी सेन्सर नेटवर्क केबल तुटल्याने तात्पुरता खंड.',
    peopleAffected: 4500,
    dateRaised: '25 Oct 2026, 14:00 IST',
    status: 'Resolved',
    statusMr: 'निवारित',
    responsibleOffice: 'Irrigation & Telecommunications Cell, Chiplun',
    responsibleOfficeMr: 'पाटबंधारे व दूरसंचार कक्ष, चिपळूण',
    timeToResolve: 'Resolved in 1 hr 15 mins',
    timeToResolveMr: '१ तास १५ मिनिटांत निवारण',
    category: 'Roads & Transport',
    categoryMr: 'रस्ते व पायाभूत सुविधा',
    timeline: [
      {
        timestamp: '14:00 IST',
        action: 'Fallback satellite uplink activated automatically',
        actionMr: 'उपग्रह बॅकअप लिंक आपोआप सुरू झाली',
        actor: 'Telemetry Auto-Failover',
      },
      {
        timestamp: '15:15 IST',
        action: 'Underground fiber splice complete; primary low-latency link restored',
        actionMr: 'ऑप्टिकल फायबर दुरुस्ती पूर्ण, मुख्य लिंक पूर्ववत',
        actor: 'BSNL / State IT Cell',
      },
    ],
    resolutionSummary: 'Telemetry latency normalized to 18ms. Flood sensor streaming live to State Command.',
    resolutionSummaryMr: 'सेन्सर डेटा प्रवाह पुन्हा सामान्य, १८ms लेटन्सीसह थेट प्रक्षेपण.',
  },
  {
    id: 'CS-2026-105',
    ticketNumber: 'GRV-SIN-2026-0922',
    district: 'Sindhudurg',
    districtMr: 'सिंधुदुर्ग',
    city: 'Sawantwadi',
    cityMr: 'सावंतवाडी',
    issueDetails: 'Wild elephant herd encroaching near cashew plantations, village distress calls received.',
    issueDetailsMr: 'काजू बागांजवळ हत्तींच्या कळपाचा शिरकाव, शेतकऱ्यांकडून तातडीची मदत मागणी.',
    peopleAffected: 320,
    dateRaised: '26 Oct 2026, 05:00 IST',
    status: 'In Progress',
    statusMr: 'प्रगतीपथावर',
    responsibleOffice: 'Deputy Conservator of Forests (DCF), Sawantwadi Division',
    responsibleOfficeMr: 'उपवनसंरक्षक, सावंतवाडी वनविभाग',
    timeToResolve: 'Target: 3 hrs (Rapid Response Forest Team on site)',
    timeToResolveMr: 'लक्ष्य: ३ तास (वनविभाग शीघ्र कृती दल घटनास्थळी दाखल)',
    category: 'Agriculture',
    categoryMr: 'शेती व वन',
    timeline: [
      {
        timestamp: '05:00 IST',
        action: 'Toll-free forest helpline 1926 triggered alarm to State War Room',
        actionMr: '१९२६ वन हेल्पलाईनवरून थेट माहिती प्राप्त',
        actor: 'Forest Control Desk',
      },
      {
        timestamp: '05:35 IST',
        action: 'Thermal drone surveillance deployed to track elephant herd movement toward reserve corridor',
        actionMr: 'थर्मल ड्रोनच्या साहाय्याने हत्तींचा मार्ग निश्चित करण्यात आला',
        actor: 'Wildlife Rescue Unit',
      },
    ],
    resolutionSummary: 'Thermal tracking ongoing; herd guided safely toward Dodamarg reserve forest.',
    resolutionSummaryMr: 'हत्तींच्या कळपाला सुरक्षितपणे दोडामार्ग राखीव जंगलाकडे वळवण्यात येत आहे.',
  },
];
