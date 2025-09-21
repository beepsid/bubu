// Content Loader Service
// This service loads diary entries and poems from external text files

import { addDiaryEntry, addPoem, getDiaryEntries, getPoems } from './database';

// For React Native, we need to manually import the content files
// In a real app, you could use a file system API or fetch from a server

// For now, let's use inline content instead of file imports
// This avoids React Native import issues with .txt files

const diaryContent = {
  '2024-01-15': `The Day I Met You 💕
Today I want to tell you about the first time I saw you. Your smile lit up the entire room, and I knew in that moment that my life was about to change forever. You were wearing that beautiful dress, and when you laughed, it was like music to my ears. I was so nervous to talk to you, but somehow you made everything feel so natural and easy. That was the beginning of our beautiful story together.`,
  
  '2024-02-14': `Valentine's Day Magic ❤️
Today is our first Valentine's Day together, and I can't believe how lucky I am. Every moment with you feels like a dream come true. The way you look at me, the way you laugh at my silly jokes, the way you make even the simplest moments feel extraordinary. I love how we can talk for hours about everything and nothing. You make my heart skip a beat every single day.`,
};

const poemContent = {
  'my-hearts-song': `My Heart's Song
Love
In your eyes I see the stars,
In your smile, the morning sun,
Every moment that we share,
Shows me how our hearts are one.

Your laughter fills the empty spaces,
Your touch heals every scar,
In this world of endless faces,
You're my wish upon a star.

Forever yours, forever true,
My heart beats just for you.`,

  'beautiful-you': `Beautiful You
Beauty
Beautiful in the morning light,
Beautiful when you sleep at night,
Beautiful when you're laughing loud,
Beautiful in any crowd.

Beautiful when you're being silly,
Beautiful when the day is chilly,
Beautiful in your favorite dress,
Beautiful in your sweet caress.

Every day I fall anew,
For beautiful, wonderful you.`,
};

// Parse diary entry from text content
const parseDiaryEntry = (content, date) => {
  const lines = content.split('\n');
  const title = lines[0].trim();
  const body = lines.slice(1).join('\n').trim();
  
  return {
    title,
    content: body,
    date,
  };
};

// Parse poem from text content
const parsePoem = (content) => {
  const lines = content.split('\n');
  const title = lines[0].trim();
  const category = lines[1].trim();
  const body = lines.slice(2).join('\n').trim();
  
  return {
    title,
    category,
    content: body,
  };
};

// Load all diary entries from content
export const loadDiaryFromFiles = async () => {
  try {

    
    for (const [dateKey, content] of Object.entries(diaryContent)) {
      const entry = parseDiaryEntry(content, dateKey);
      
      // Check if entry already exists
      const existingEntries = await getDiaryEntries();
      const exists = existingEntries.some(e => e.date === entry.date && e.title === entry.title);
      
      if (!exists) {
        await addDiaryEntry(entry.title, entry.content, entry.date);

      }
    }
    

  } catch (error) {
    console.error('Error loading diary entries:', error);
  }
};

// Load all poems from content
export const loadPoemsFromFiles = async () => {
  try {

    
    for (const [poemKey, content] of Object.entries(poemContent)) {
      const poem = parsePoem(content);
      
      // Check if poem already exists
      const existingPoems = await getPoems();
      const exists = existingPoems.some(p => p.title === poem.title);
      
      if (!exists) {
        await addPoem(poem.title, poem.content, poem.category);

      }
    }
    

  } catch (error) {
    console.error('Error loading poems:', error);
  }
};

// Refresh content from files (call this when you add new files)
export const refreshContentFromFiles = async () => {
  await loadDiaryFromFiles();
  await loadPoemsFromFiles();
};

// Instructions for adding new content
export const getContentInstructions = () => {
  return `
📝 HOW TO ADD NEW CONTENT:

🔹 DIARY ENTRIES:
1. Create a new file in content/diary/
2. Name it: YYYY-MM-DD.txt (e.g., 2024-03-15.txt)
3. First line: Title
4. Rest: Your diary entry content

🔹 POEMS:
1. Create a new file in content/poems/
2. Name it: poem-name.txt (e.g., love-letter.txt)
3. First line: Poem title
4. Second line: Category (Love, Beauty, etc.)
5. Rest: Your poem content

🔹 AFTER ADDING FILES:
1. Update the imports in src/services/contentLoader.js
2. Add the new file to diaryFiles or poemFiles object
3. Restart the app to load new content

🔹 EXAMPLE:
// In contentLoader.js, add:
const diaryFiles = {
  '2024-01-15': require('../../content/diary/2024-01-15.txt'),
  '2024-03-15': require('../../content/diary/2024-03-15.txt'), // NEW
};
  `;
};