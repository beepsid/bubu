import * as SQLite from 'expo-sqlite';

let db = null;

const getDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('bubu.db');
  }
  return db;
};

export const initializeDatabase = async () => {
  try {
    const database = await getDatabase();
    
    // Diary entries table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS diary_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Poems table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS poems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Period tracking table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS period_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // App settings table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);


  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Diary functions
export const getDiaryEntries = async () => {
  try {
    const database = await getDatabase();
    const result = await database.getAllAsync('SELECT * FROM diary_entries ORDER BY date DESC');
    return result;
  } catch (error) {
    console.error('Error getting diary entries:', error);
    throw error;
  }
};

export const addDiaryEntry = async (title, content, date) => {
  try {
    const database = await getDatabase();
    const result = await database.runAsync(
      'INSERT INTO diary_entries (title, content, date) VALUES (?, ?, ?)',
      [title, content, date]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding diary entry:', error);
    throw error;
  }
};

// Poems functions
export const getPoems = async () => {
  try {
    const database = await getDatabase();
    const result = await database.getAllAsync('SELECT * FROM poems ORDER BY created_at DESC');
    return result;
  } catch (error) {
    console.error('Error getting poems:', error);
    throw error;
  }
};

export const addPoem = async (title, content, category = null) => {
  try {
    const database = await getDatabase();
    const result = await database.runAsync(
      'INSERT INTO poems (title, content, category) VALUES (?, ?, ?)',
      [title, content, category]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding poem:', error);
    throw error;
  }
};

// Period tracking functions
export const getPeriodData = async () => {
  try {
    const database = await getDatabase();
    const result = await database.getAllAsync('SELECT * FROM period_data ORDER BY date ASC');
    return result;
  } catch (error) {
    console.error('Error getting period data:', error);
    throw error;
  }
};

export const addPeriodData = async (date, type, notes = null) => {
  try {
    const database = await getDatabase();
    const result = await database.runAsync(
      'INSERT OR REPLACE INTO period_data (date, type, notes) VALUES (?, ?, ?)',
      [date, type, notes]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding period data:', error);
    throw error;
  }
};

// Settings functions
export const getSetting = async (key) => {
  try {
    const database = await getDatabase();
    const result = await database.getFirstAsync(
      'SELECT value FROM app_settings WHERE key = ?',
      [key]
    );
    return result ? result.value : null;
  } catch (error) {
    console.error('Error getting setting:', error);
    throw error;
  }
};

export const setSetting = async (key, value) => {
  try {
    const database = await getDatabase();
    const result = await database.runAsync(
      'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
      [key, value]
    );
    return result;
  } catch (error) {
    console.error('Error setting value:', error);
    throw error;
  }
};