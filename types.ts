export enum ViolationType {
  HATE_SPEECH = 'خطاب كراهية',
  HARASSMENT = 'مضايقة وتنمر',
  VIOLENCE = 'عنف أو نشاط خطير',
  NUDITY = 'عرى أو محتوى جنسي',
  COPYRIGHT = 'انتهاك حقوق الملكية الفكرية',
  SCAM = 'احتيال أو تضليل',
  OTHER = 'أخرى'
}

export interface ReportFormData {
  username: string;
  violationType: ViolationType;
  details: string;
  timestamp?: string;
}

export interface ReportResult {
  arabicReport: string;
  englishReport: string;
  advice: string;
  communityAlert: string;
}