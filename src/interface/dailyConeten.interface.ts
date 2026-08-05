export interface IDailySpiritualContent {
  type: "quran" | "hadith" | "reflection" | "article";
  title: string;
  content: string;
  source?: string;
  language?: string;
  active?: boolean;
}

export interface IUpdateDailySpiritualContent {
  type?: "quran" | "hadith" | "reflection" | "article";
  title?: string;
  content?: string;
  source?: string;
  language?: string;
  active?: boolean;
}
