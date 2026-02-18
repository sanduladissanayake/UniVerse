# ⚡ Quick Setup - HTTP 400 Payment Error Fix

## The Issue
You're getting **"HTTP 400"** error when clicking "Proceed to Payment"

## The Fix (30 seconds)

### Step 1: Get Your Stripe Credentials
- Go to: https://dashboard.stripe.com/apikeys
- Copy your **Secret Key** (the one starting with `sk_test_`)
- Go to: https://dashboard.stripe.com/webhooks  
- Copy the **Signing Secret** (starts with `whsec_`)

### Step 2: Set Environment Variables
**With PowerShell (Windows):**
```powershell
$env:STRIPE_API_KEY = "paste_your_secret_key_here"
$env:STRIPE_WEBHOOK_SECRET = "paste_your_signing_secret_here"
```

**With Command Prompt (Windows):**
```batch
set STRIPE_API_KEY=paste_your_secret_key_here
set STRIPE_WEBHOOK_SECRET=paste_your_signing_secret_here
```

### Step 3: Start Backend
```powershell
cd backend
.\run-backend.ps1
```

Done! ✅ No more HTTP 400 errors!

---

## What Happened?
The backend needs Stripe credentials to process payments. Without them, it returns HTTP 400. 

The environment variables tell the Java application where to find those credentials.

## Need More Help?
See [STRIPE_SETUP_ENV_FIX.md](./STRIPE_SETUP_ENV_FIX.md) for detailed troubleshooting.
