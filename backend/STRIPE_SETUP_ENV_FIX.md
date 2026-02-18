# HTTP 400 Payment Error - Complete Fix Guide

## Problem
When attempting to proceed with payment for club membership, users receive an **HTTP 400** error despite all form inputs being valid.

## Root Cause
The Stripe API key environment variable (`STRIPE_API_KEY`) is not properly set when the application starts. Without this, the backend uses a placeholder value, causing payment creation to fail with HTTP 400.

## Solution

### Step 1: Get Your Stripe Credentials

1. **Get API Key:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)
   - ⚠️ Keep this secret! Never commit to git or share publicly

2. **Get Webhook Secret:**
   - Option A: From Stripe Dashboard
     - Go to [Webhooks Section](https://dashboard.stripe.com/webhooks)
     - Create or view an endpoint for `http://localhost:8081/api/payments/webhook`
     - Copy the **Signing Secret** (starts with `whsec_`)
   
   - Option B: From Stripe CLI
     ```bash
     stripe listen --forward-to http://localhost:8081/api/payments/webhook
     ```
     - The output will show the signing secret

### Step 2: Set Environment Variables

#### Option A: Windows Command Prompt
```batch
set STRIPE_API_KEY=sk_test_your_actual_key_here
set STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret_here
```

#### Option B: Windows PowerShell
```powershell
$env:STRIPE_API_KEY = "sk_test_your_actual_key_here"
$env:STRIPE_WEBHOOK_SECRET = "whsec_your_actual_secret_here"
```

#### Option C: Use the Startup Script (Recommended)
**PowerShell:**
```powershell
# Navigate to the backend directory
cd backend

# Run the startup script
.\run-backend.ps1
```

The script will:
- Check if both environment variables are set
- Show clear error message if they're missing
- Automatically build and run the backend

**Batch (CMD):**
```batch
cd backend
run-backend.bat
```

### Step 3: Start the Backend

If using the startup script, it handles everything automatically.

If setting variables manually:

```powershell
cd backend
java -jar target/universe-backend-1.0.0.jar
```

**Expected Output:**
```
Stripe API key initialized (length: 107)
```

If you see this, the configuration is correct! ✅

### Step 4: Verify Payment Works

1. Open the application in browser: `http://localhost:3000`
2. Log in with your account
3. Navigate to a club and click "Join Club"
4. Enter membership details and click "Proceed to Payment"
5. You should now be redirected to Stripe Checkout (no HTTP 400 error)

## Testing with Stripe Test Cards

Use these test cards to verify the payment flow:

| Card Number | Expiry | CVC | Postal Code | Result |
|---|---|---|---|---|
| 4242 4242 4242 4242 | Any future date (e.g., 12/25) | Any 3 digits | Any 5 digits | ✅ Success |
| 4000 0000 0000 0002 | Any future date | Any 3 digits | Any 5 digits | ❌ Decline |
| 5555 5555 5555 4444 | Any future date | Any 3 digits | Any 5 digits | ✅ Success (Mastercard) |

## Troubleshooting

### HTTP 400: "Stripe API key is not properly configured"

**Cause:** Environment variables not set or using placeholder values

**Fix:**
1. Check variables are set:
   ```powershell
   $env:STRIPE_API_KEY
   $env:STRIPE_WEBHOOK_SECRET
   ```
2. If empty, set them again (see Step 2)
3. Restart the backend application
4. Variables are session-specific - if you close PowerShell, you need to set them again

### HTTP 400: "Club not found"

**Cause:** Invalid Club ID

**Fix:**
- Ensure the club ID exists in the database
- Check the club is created in the admin panel

### HTTP 400: "Amount must be greater than 0"

**Cause:** Membership fee not set or invalid

**Fix:**
- Verify the club has a membership fee > 0
- Check the fee format (should be a valid number)

### Stripe Webhook Events Not Processing

**Cause:** Webhook secret incorrect or webhook not being sent

**Fix:**
1. Verify webhook secret is correct:
   ```powershell
   $env:STRIPE_WEBHOOK_SECRET  # Should match dashboard value
   ```
2. Check webhook is enabled in Stripe Dashboard
3. Monitor logs for webhook processing:
   ```
   [INFO] 🔔 Webhook received from Stripe: Type: checkout.session.completed
   [INFO] ✅ Payment marked as SUCCEEDED
   ```

## For Distribution / New Users

When sharing the project with other users:

1. **Create this setup documentation** (already done ✅)

2. **Share these files in the backend directory:**
   - `run-backend.ps1` - PowerShell startup script
   - `run-backend.bat` - Batch startup script
   - `.env.example` - Environment variable template
   - `ENV_SETUP.md` - This documentation

3. **Instructions for new users:**
   
   ```
   1. Get Stripe credentials from https://dashboard.stripe.com/apikeys
   2. Set environment variables:
      $env:STRIPE_API_KEY = "your_key"
      $env:STRIPE_WEBHOOK_SECRET = "your_secret"
   3. Run: .\backend\run-backend.ps1
   4. Backend will start automatically
   ```

4. **Alternative: Create a `.env` file** (if using Spring-supported .env loading)

## Security Notes ⚠️

- **Never** commit `STRIPE_API_KEY` or `STRIPE_WEBHOOK_SECRET` to git
- Use `.gitignore` to exclude `.env` files
- For production, use proper secrets management (AWS Secrets Manager, Azure Key Vault, etc.)
- Test keys (starting with `sk_test_`) should not be used in production
- Production keys (starting with `sk_live_`) should only be used in secure environments

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Environment Variables in Java](https://stackoverflow.com/questions/7054844/how-to-read-environment-variable-in-java)
- [Spring Boot Externalized Configuration](https://spring.io/guides/gs/spring-boot-docker/)

## Success Indicators ✅

- Backend starts without "API key not properly configured" error
- Payment modal appears without HTTP 400 error
- Stripe Checkout page loads when clicking "Proceed to Payment"
- Webhook events are logged as being received
- Payment records are updated in database after successful payment
