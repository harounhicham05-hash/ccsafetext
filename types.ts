export type Tone = 'neutral' | 'academic' | 'marketing';
export type Mode = 'conservative' | 'balanced' | 'minimal';
export type Language = 'English' | 'Arabic';

export interface RewriteOptions {
  tone: Tone;
  mode: Mode;
  language: Language;
}

export interface ChangeLogItem {
  from: string;
  to: string;
  reason: string;
}

export type Severity = 'none' | 'low' | 'medium' | 'high';

export interface RewriteResult {
  accepted: boolean;
  severity: Severity;
  original_text: string;
  safe_text: string;
  mode_used: Mode;
  change_log: ChangeLogItem[];
  reason_summary: string;
  suggested_disclaimer: string;
  flags: string[];
}
