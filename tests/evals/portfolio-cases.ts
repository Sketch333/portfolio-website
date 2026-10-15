// Hand-checked against canonical experience and project records. No provider output
// supplies the expected answers; semantic fixtures below only stand in for Atlas.
export const portfolioCases = [
  { query: 'What is Aon doing now?', ids: ['experience:sprintx'] },
  { query: 'Data Researcher', ids: ['experience:webforest'] },
  { query: 'Teaching Assistant', ids: ['experience:department-of-ai-umt'] },
  { query: 'Which project uses Neo4j?', ids: ['project:multimodal-ai-chatbot'] },
  { query: 'What did Aon personally do on the scheduler?', ids: ['project:university-timetable-system'] },
  { query: 'Has Aon led a billion-dollar acquisition?', ids: [] },
  { query: 'What revenue did Aon generate at SprintX?', ids: [] },
] as const;
