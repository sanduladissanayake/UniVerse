# ⚡ Super Simple - No Terminal Configuration Needed!

## How to Run (Really Simple!)

### Step 1: Add Your Stripe Keys to .env File
File: `backend/.env`
```
STRIPE_API_KEY=your_stripe_test_key_here
STRIPE_WEBHOOK_SECRET=your_webhook_secret_here
```

That's it! The .env file already has your credentials. ✅

### Step 2: Run Backend
**PowerShell:**
```powershell
cd backend
.\run-backend.ps1
```

**Command Prompt:**
```batch
cd backend
run-backend.bat
```

**Or manually:**
```powershell
mvn clean package -DskipTests
java -jar target/universe-backend-1.0.0.jar
```

### Step 3: Run Frontend (in a new terminal)
```powershell
npm run dev
```

Done! ✅

---

## Why This Works in a "Real Program"

1. ✅ **No manual terminal setup** - Credentials are in .env file
2. ✅ **Not committed to git** - .env is in .gitignore (never committed)
3. ✅ **Automatic loading** - Backend loads .env on startup
4. ✅ **Industry standard** - This is how real programs do it

---

## The Files

- **backend/.env** - Your Stripe credentials (never commit this!)
- **backend/pom.xml** - Added dotenv library
- **backend/src/main/java/.../UniverseApplication.java** - Loads .env automatically
- **.gitignore** - Protects .env from being committed

---

## Testing It Works

Backend logs should show:
```
[INFO] Stripe API key initialized (length: 107)
```

Then:
1. Open http://localhost:3000
2. Join a club
3. Click "Proceed to Payment"
4. Should redirect to Stripe (no HTTP 400!)

✅ Done!
