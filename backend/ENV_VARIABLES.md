# Backend Environment Variables Template

# These environment variables are used for Stripe configuration

#

# To set these on your system:

#

# Windows (Command Prompt):

# set STRIPE*API_KEY=sk_test*...

# set STRIPE*WEBHOOK_SECRET=whsec*...

#

# Windows (PowerShell):

# $env:STRIPE*API_KEY="sk_test*..."

# $env:STRIPE*WEBHOOK_SECRET="whsec*..."

#

# Linux/Mac:

# export STRIPE*API_KEY=sk_test*...

# export STRIPE*WEBHOOK_SECRET=whsec*...

#

# IntelliJ IDEA:

# Right-click project -> Run -> Edit Configurations

# Environment variables: STRIPE*API_KEY=sk_test*...;STRIPE*WEBHOOK_SECRET=whsec*...

# Stripe Secret API Key

# Get from: https://dashboard.stripe.com/apikeys

# Test key: sk*test*...

# Live key: sk*live*...

STRIPE_API_KEY=sk_test_YOUR_SECRET_KEY_HERE

# Stripe Webhook Signing Secret

# Get from: https://dashboard.stripe.com/webhooks

# Configure webhook endpoint: http://your-domain.com/api/payments/webhook

# Test secret: whsec*test*...

# Live secret: whsec\_...

STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Optional: Frontend URL for payment redirects

# Used in PaymentService to build redirect URLs

# Default: http://localhost:3000

# APP_FRONTEND_URL=http://localhost:3000
