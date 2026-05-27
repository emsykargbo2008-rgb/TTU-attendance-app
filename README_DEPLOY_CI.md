CI Deploy (GitHub Actions)

This project includes a GitHub Actions workflow to automatically deploy to Firebase Hosting when you push to the `main` branch.

Steps to enable CI deploy:

1. Install Firebase Tools locally (one-time):

```bash
npm install -g firebase-tools
```

2. Create a CI token locally (copy the token):

```bash
npx firebase login:ci
```

This will open a browser and return a token string. Keep this token secret.

3. Add the token to your GitHub repository secrets:
- In GitHub, go to your repository → Settings → Secrets and variables → Actions → New repository secret
- Name it `FIREBASE_TOKEN` and paste the token value

4. Push your code to the `main` branch. The workflow `.github/workflows/firebase-hosting-deploy.yml` will run and deploy the site to the Firebase project `attendance-system-11184`.

Notes:
- Ensure the Firebase project ID in `.firebaserc` is correct. If you want to use a different project, update `.firebaserc` or run `firebase use --add` locally.
- The workflow uses the `FIREBASE_TOKEN` secret and the `firebase deploy` CLI to publish your site.

If you want, I can generate the GitHub Actions workflow now (already added) and guide you through creating the token and setting the secret so the site deploys automatically.