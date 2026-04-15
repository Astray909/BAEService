require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const { version } = require('../package.json');
const cors = require('cors');

admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
});
const db = admin.firestore();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'BAE Service is running', version });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.post('/datePlanSubmit', async (req, res) => {
  const { dateTimeUtc, title, body } = req.body;

  if (!dateTimeUtc || !title || !body) {
    return res.status(400).json({ error: 'dateTimeUtc, title, and body are required' });
  }

  try {
    const docRef = await db.collection('datePlans').add({
      dateTimeUtc,
      title,
      body,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ id: docRef.id });
  } catch (err) {
    console.error('Firestore error:', err);
    res.status(500).json({ error: 'Failed to save date plan', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
