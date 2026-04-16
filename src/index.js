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

app.get('/datePlans', async (req, res) => {
  try {
    const snapshot = await db.collection('datePlans').orderBy('dateTimeUtc', 'asc').get();
    const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(plans);
  } catch (err) {
    console.error('Firestore error:', err);
    res.status(500).json({ error: 'Failed to fetch date plans', details: err.message });
  }
});

app.delete('/datePlans/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('datePlans').doc(id).delete();
    res.status(204).send();
  } catch (err) {
    console.error('Firestore error:', err);
    res.status(500).json({ error: 'Failed to delete date plan', details: err.message });
  }
});

app.put('/datePlans/:id', async (req, res) => {
  const { id } = req.params;
  const { dateTimeUtc, title, body = null } = req.body;
  
  if (!dateTimeUtc || !title) {
    return res.status(400).json({ error: 'dateTimeUtc and title are required' });
  }

  try {
    await db.collection('datePlans').doc(id).update({ dateTimeUtc, title, body });
    res.status(200).json({ id });
  } catch (err) {
    console.error('Firestore error:', err);
    res.status(500).json({ error: 'Failed to update date plan', details: err.message });
  }
});

app.post('/datePlanSubmit', async (req, res) => {
  const { dateTimeUtc, title, body = null } = req.body;

  if (!dateTimeUtc || !title) {
    return res.status(400).json({ error: 'dateTimeUtc and title are required' });
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
