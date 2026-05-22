export interface WishItem {
  id: string;
  title: string;
  urdu: string;
  roman: string;
  english: string;
  category: 'dua' | 'brotherhood' | 'future' | 'gratitude';
}

export interface VirtualWish {
  id: string;
  text: string;
  timestamp: string;
  color: string;
}

export type AppStage = 'envelope' | 'celebration';
