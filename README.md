# BAEService

`https://bae-service-329144938182.us-central1.run.app/`

## Deployment (Google Cloud Run)

### Prerequisites

- [gcloud CLI](https://cloud.google.com/sdk) installed

### Service Account
```bash
gcloud projects add-iam-policy-binding best-app-ever-492518 \
    --member=serviceAccount:329144938182-compute@developer.gserviceaccount.com \
    --role=roles/run.builder
```

```bash
gcloud projects add-iam-policy-binding yet-another-project-9fe57 \
    --member=serviceAccount:329144938182-compute@developer.gserviceaccount.com \
    --role="roles/datastore.user"
```

```bash
gcloud run deploy --source .
```

```bash
gcloud auth print-identity-token
```

```bash
gcloud run services delete baeservice
```
