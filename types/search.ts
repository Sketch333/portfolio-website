export type SearchRecord = {
  id: string;
  type: 'project' | 'article' | 'experience';
  title: string;
  description: string;
  href: string;
  keywords: string[];
};
