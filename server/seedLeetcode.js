import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from './models/Problem.js';
import Topic from './models/Topic.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function seedLeetcode() {
  try {
    const rawData = fs.readFileSync('./leetcodeData.json', 'utf8');
    const problemsData = JSON.parse(rawData);
    
    console.log(`Read ${problemsData.length} problems from leetcodeData.json`);

    const existingTopics = await Topic.find({});
    const topicMap = {};
    existingTopics.forEach(t => {
      topicMap[t.name] = t._id;
    });

    const missingTopics = new Set();
    problemsData.forEach(p => {
      if (!topicMap[p.topicName]) {
        missingTopics.add(p.topicName);
      }
    });

    if (missingTopics.size > 0) {
      console.log(`Creating ${missingTopics.size} missing topics...`);
      const newTopicsToInsert = Array.from(missingTopics).map(name => ({
        name,
        notes: `Topic: ${name}\n\nNotes for this topic are empty by default.`
      }));
      const insertedTopics = await Topic.insertMany(newTopicsToInsert);
      insertedTopics.forEach(t => {
        topicMap[t.name] = t._id;
      });
    }

    const problemsWithIds = problemsData.map(p => ({
      ...p,
      topic: topicMap[p.topicName]
    }));

    console.log('Inserting problems...');
    
    try {
      const insertedProblems = await Problem.insertMany(problemsWithIds, { ordered: false });
      console.log(`${insertedProblems.length} problems inserted successfully.`);
    } catch (insertError) {
      if (insertError.code === 11000) {
        console.log(`Skipped duplicate problems. (${insertError.insertedDocs.length} inserted successfully).`);
      } else {
        throw insertError;
      }
    }

  } catch (error) {
    console.error('Error seeding leetcode data:', error);
  } finally {
    mongoose.disconnect();
  }
}

seedLeetcode();
