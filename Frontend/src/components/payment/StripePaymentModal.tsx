import { useState } from "react";
import { X, AlertCircle, Loader } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "./CheckoutForm";
import { paymentAPI } from "../../services/api";

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  clubId: number;
  clubName: string;
  membershipFee: number | undefined;
  onPaymentSuccess?: (paymentData?: any) => void;
  autoCreateMembership?: boolean; // If true, creates membership after payment. If false, just verifies payment.
}

// Initialize Stripe (use public key from env)
const stripePromise = loadStripe(
  (import.meta.env.VITE_STRIPE_PUBLIC_KEY as string) ||
    "pk_test_placeholder" // Replace with your public key
);

/**
 * Stripe Payment Modal Component
 * Handles the entire payment flow for club membership
 * Integrates Stripe checkout and membership creation
 */
export function StripePaymentModal({
  isOpen,
  onClose,
  userId,
  clubId,
  clubName,
  membershipFee,
  onPaymentSuccess,
}: StripePaymentModalProps) {
  const [step, setStep] = useState<"confirm" | "payment" | "processing">("confirm");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  if (membershipFee === undefined || membershipFee === null) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold">Join Club</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 text-teal-600 bg-teal-50 p-4 rounded-lg border-2 border-teal-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-semibold">
                Club information is not available. Please try again later.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleConfirmPayment = async () => {
    setError(null);
    setStep("processing");

    try {
      // Create Stripe checkout session for LKR payment
      console.log("🔄 Creating Stripe Checkout Session:", { userId, clubId, amount: `LKR ${membershipFee.toFixed(2)}`, currency: "LKR" });
      
      const response = await paymentAPI.createCheckoutSession(
        userId,
        clubId,
        membershipFee,
        "LKR"
      );

      console.log("✅ Stripe session created successfully:", {
        sessionId: response?.sessionId,
        paymentId: response?.paymentId,
      });

      // Validate response has redirect URL
      if (!response || !response.sessionUrl) {
        const errorMsg = response?.message || "Failed to create checkout session";
        console.error("❌ No session URL in response. Full response:", response);
        throw new Error(errorMsg);
      }

      console.log("🔗 Redirecting to Stripe Checkout portal...");
      // Redirect to Stripe hosted checkout
      window.location.href = response.sessionUrl;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to process payment";
      console.error("❌ Payment error:", errorMessage);
      console.error("Full error object:", err);
      setError(errorMessage);
      setStep("confirm");
    }
  };

  const handlePaymentFormSuccess = async () => {
    setStep("processing");
    try {
      // Note: In real implementation, payment is processed through Stripe
      // This is just for form validation
      onPaymentSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || "Payment failed");
      setStep("payment");
    }
  };

  const handlePaymentFormError = (error: string) => {
    setError(error);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-teal-600 to-teal-500">
          <h2 className="text-xl font-bold text-white">Join {clubName}</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-teal-700 rounded-full p-1 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Confirmation Step */}
          {step === "confirm" && (
            <div className="space-y-4">
              <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4">
                <p className="text-sm text-teal-900 font-bold mb-2">
                  Membership Details
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-teal-700">Club:</span>
                    <span className="font-bold text-teal-900">{clubName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-teal-700">Membership Fee:</span>
                    <span className="font-bold text-teal-900">
                      LKR {membershipFee.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border-2 border-red-300 text-sm font-semibold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <p className="text-sm text-gray-600">
                You will be redirected to Stripe's secure checkout page to complete your payment.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleConfirmPayment}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-teal-900 font-bold py-3 rounded-lg transition-colors"
                >
                  Proceed to Payment
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <Loader className="w-8 h-8 text-teal-600 animate-spin" />
              <p className="text-gray-600 text-center">
                Processing your payment...
              </p>
              <p className="text-xs text-gray-500 text-center">
                Do not close this window
              </p>
            </div>
          )}

          {/* Payment Step (if using embedded form instead of hosted checkout) */}
          {step === "payment" && (
            <div>
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  amount={membershipFee}
                  currency="LKR"
                  clubName={clubName}
                  onSuccess={handlePaymentFormSuccess}
                  onError={handlePaymentFormError}
                  isProcessing={false}
                />
              </Elements>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
