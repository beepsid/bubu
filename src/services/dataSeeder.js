import { addDiaryEntry, addPoem, addPeriodData, getSetting, setSetting } from './database';
import { loadDiaryFromFiles, loadPoemsFromFiles } from './contentLoader';

// Sample diary entries
const sampleDiaryEntries = [
  {
    title: "The Day I Met You 💕",
    content: "Today I want to tell you about the first time I saw you. Your smile lit up the entire room, and I knew in that moment that my life was about to change forever. You were wearing that beautiful dress, and when you laughed, it was like music to my ears. I was so nervous to talk to you, but somehow you made everything feel so natural and easy. That was the beginning of our beautiful story together.",
    date: "2024-01-15"
  },
  {
    title: "Your Beautiful Laugh 😊",
    content: "I love the way you laugh - it's infectious and pure joy. When you throw your head back and laugh with your whole heart, the world becomes a brighter place. Your laughter is my favorite sound in the universe. It makes even the hardest days feel lighter. I find myself trying to be funnier just to hear that wonderful sound more often.",
    date: "2024-02-03"
  },
  {
    title: "Morning Coffee Together ☕",
    content: "Our morning coffee ritual has become my favorite part of every day. The way you curl up next to me, still sleepy and beautiful, while we share our dreams from the night before. These quiet moments together, before the world wakes up, are pure magic. You make even the simplest moments feel extraordinary.",
    date: "2024-02-14"
  },
  {
    title: "Your Kindness 🌸",
    content: "Today I watched you help a stranger who looked lost, and my heart swelled with pride. Your kindness is one of the things I love most about you. You have this incredible ability to see the good in everyone and make them feel valued. You make me want to be a better person every single day.",
    date: "2024-02-28"
  },
  {
    title: "Dancing in the Kitchen 💃",
    content: "Remember when we were cooking dinner and our song came on? You grabbed my hand and we started dancing right there in the kitchen. Flour in your hair, sauce on my shirt, and the biggest smiles on our faces. Those spontaneous moments of joy are what make our love so special. I love how you turn ordinary moments into magical memories.",
    date: "2024-03-10"
  }
];

// Sample poems
const samplePoems = [
  {
    title: "My Heart's Song",
    content: `In your eyes I see the stars,
In your smile, the morning sun,
Every moment that we share,
Shows me how our hearts are one.

Your laughter fills the empty spaces,
Your touch heals every scar,
In this world of endless faces,
You're my wish upon a star.

Forever yours, forever true,
My heart beats just for you.`,
    category: "Love"
  },
  {
    title: "Beautiful You",
    content: `Beautiful in the morning light,
Beautiful when you sleep at night,
Beautiful when you're laughing loud,
Beautiful in any crowd.

Beautiful when you're being silly,
Beautiful when the day is chilly,
Beautiful in your favorite dress,
Beautiful in your sweet caress.

Every day I fall anew,
For beautiful, wonderful you.`,
    category: "Beauty"
  },
  {
    title: "Our Forever",
    content: `Hand in hand we'll walk this path,
Through joy and tears, through love and wrath,
Together we can face it all,
Together we will never fall.

Your dreams become my dreams too,
Your happiness, my morning dew,
In your arms I've found my home,
With you, I'll never be alone.

This love we share will never end,
My lover, partner, dearest friend.`,
    category: "Forever"
  },
  {
    title: "Simple Moments",
    content: `It's not the grand gestures that I treasure most,
But quiet mornings with coffee and toast,
The way you hum while doing your hair,
The gentle touch when you know I care.

Your sleepy voice when you wake up,
The way you hold your favorite cup,
These simple moments, sweet and true,
Are all the magic I need from you.`,
    category: "Daily Life"
  }
];

// Her actual period data
const generateActualPeriodData = () => {
  const data = [];
  
  // Her actual cycle data
  const actualCycles = [
    { periodStart: '2024-01-07', fertileStart: '2024-01-24', fertileEnd: '2024-01-30' },
    { periodStart: '2024-02-12', fertileStart: '2024-02-25', fertileEnd: '2024-03-03' },
    { periodStart: '2024-03-16', fertileStart: '2024-03-22', fertileEnd: '2024-03-28' },
    { periodStart: '2024-04-10', fertileStart: '2024-04-23', fertileEnd: '2024-04-29' },
    { periodStart: '2024-05-12', fertileStart: '2024-05-25', fertileEnd: '2024-05-31' },
    { periodStart: '2024-06-13', fertileStart: '2024-07-01', fertileEnd: '2024-07-07' },
    { periodStart: '2024-07-20', fertileStart: '2024-08-04', fertileEnd: '2024-08-10' },
    { periodStart: '2024-08-23', fertileStart: '2024-09-04', fertileEnd: '2024-09-10' }
  ];
  
  actualCycles.forEach(cycle => {
    const periodStart = new Date(cycle.periodStart);
    const fertileStart = new Date(cycle.fertileStart);
    const fertileEnd = new Date(cycle.fertileEnd);
    
    // Add 5 period days
    for (let i = 0; i < 5; i++) {
      const periodDate = new Date(periodStart);
      periodDate.setDate(periodStart.getDate() + i);
      data.push({
        date: periodDate.toISOString().split('T')[0],
        type: 'period',
        notes: `Period day ${i + 1}`
      });
    }
    
    // Add fertile window days
    const fertileStartTime = fertileStart.getTime();
    const fertileEndTime = fertileEnd.getTime();
    const dayMs = 24 * 60 * 60 * 1000;
    
    for (let time = fertileStartTime; time <= fertileEndTime; time += dayMs) {
      const fertileDate = new Date(time);
      const dateStr = fertileDate.toISOString().split('T')[0];
      
      // Check if this is the 2nd last day (ovulation)
      const daysFromEnd = Math.floor((fertileEndTime - time) / dayMs);
      const isOvulation = daysFromEnd === 1; // 2nd last day
      
      data.push({
        date: dateStr,
        type: isOvulation ? 'ovulation' : 'fertile',
        notes: isOvulation ? 'Ovulation day - most fertile' : 'Fertile window'
      });
    }
  });
  
  return data;
};

export const seedInitialData = async () => {
  try {
    // Check if data has already been seeded
    const isSeeded = await getSetting('data_seeded');

    if (isSeeded === 'true') {
      return;
    }

    // Use sample data for now (external loading disabled temporarily)
    for (const entry of sampleDiaryEntries) {
      await addDiaryEntry(entry.title, entry.content, entry.date);
    }


    for (const poem of samplePoems) {
      await addPoem(poem.title, poem.content, poem.category);
    }


    // Seed actual period data
    const periodData = generateActualPeriodData();
    for (const data of periodData) {
      await addPeriodData(data.date, data.type, data.notes);
    }


    // Mark as seeded
    await setSetting('data_seeded', 'true');
    await setSetting('app_version', '1.0.0');


  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};

// Function to add more diary entries (for boyfriend to use)
export const addCustomDiaryEntry = async (title, content, date = null) => {
  const entryDate = date || new Date().toISOString().split('T')[0];
  return await addDiaryEntry(title, content, entryDate);
};

// Function to add more poems (for boyfriend to use)
export const addCustomPoem = async (title, content, category = 'Love') => {
  return await addPoem(title, content, category);
};

// Reset all data (for development/testing)
export const resetAllData = async () => {
  try {
    // This would require dropping and recreating tables
    // For now, just mark as not seeded so it re-seeds
    await setSetting('data_seeded', 'false');

  } catch (error) {
    console.error('Error resetting data:', error);
  }
};