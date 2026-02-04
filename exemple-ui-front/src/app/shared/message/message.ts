export type Severity = 'info' | 'success' | 'warning' | 'error';

export interface Message {
  severity?: Severity;
  summary?: string;
  detail?: string;
}
