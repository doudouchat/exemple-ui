export type Type = 'info' | 'success' | 'warning' | 'error';

export interface Message {
  type?: Type;
  title?: string;
  detail?: string;
}
