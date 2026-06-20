/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BiographyChapter {
  id: number;
  titleHindi: string;
  titleEnglish: string;
  period?: string;
  hasQuote?: boolean;
  quote?: {
    text: string;
    englishText?: string;
  };
  highlights: string[];
  content: string[]; // List of paragraphs in Hindi
}

export type BookCategory = 'darshan' | 'vada' | 'shastra' | 'samvidhan';

export interface BookItem {
  id: number;
  titleHindi: string;
  titleEnglish: string;
  translationEnglish: string;
  category: BookCategory;
  pages?: number;
  descriptionHindi: string;
  descriptionEnglish: string;
}
