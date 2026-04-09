# BAEService

`https://bae-service-329144938182.us-central1.run.app/`

## Deployment (Google Cloud Run)

### Prerequisites

- [gcloud CLI](https://cloud.google.com/sdk) installed

### 1. Login & set project

```bash
gcloud auth login
gcloud config set project yet-another-project-9fe57
```

### 2. Enable required APIs (one-time)

```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com
```

### 3. Grant Firestore permissions to the Cloud Run service account (one-time)

```bash
gcloud projects add-iam-policy-binding yet-another-project-9fe57 \
  --member="serviceAccount:$(gcloud iam service-accounts list --filter='displayName:Compute Engine default' --format='value(email)')" \
  --role="roles/datastore.user"
```

### 4. Deploy

```bash
gcloud run deploy bae-service \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars FIREBASE_PROJECT_ID=yet-another-project-9fe57
```
