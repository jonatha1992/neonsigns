# Environment files and conventions

This repo uses Vite's env file conventions. Follow these rules:

- `.env` - optional defaults (not recommended for secrets). If present, loaded for all modes.
- `.env.local` - local overrides for development, should NOT be committed. Include in `.gitignore`.
- `.env.development`, `.env.production` - environment specific files (do not store secrets in repo if possible).
- `.env.production.local` - production local overrides (for CI or local deploy), not committed.

Recommended workflow:

1. Add `.env.local` to your local machine with real API keys. Never commit it.
2. Commit `.env.example` and `.env.production.example` with placeholder values so others know required keys.
3. For CI/CD or Firebase Hosting use environment variables configured in the hosting platform (or use service account for server side).

If you accidentally committed secrets:

1. Remove the secret file from git history:

```powershell
git rm --cached .env
git commit -m "chore: remove env from repo"
git push
```

2. Rotate any leaked credentials (Firebase API keys, service accounts).
