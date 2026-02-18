import { useState } from "react";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { AlertCircle, CheckCircle } from "lucide-react";

interface CheckoutFormProps {
  amount: number;
  currency: string;
  clubName: string;
  onSuccess?: (paymentId: number) => void;
  onError?: (error: string) => void;
  isProcessing?: boolean;
}

/**
 * Stripe Checkout Form Component
 * Handles payment card input and submission
 * Uses Stripe Elements for secure card handling
 */
export function CheckoutForm({
  amount,
  // currency,
  clubName,
  onSuccess,
  onError,
  isProcessing = false,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe is not loaded");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get card element
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        setError("Card element not found");
        setIsLoading(false);
        return;
      }

      // Create payment method
      const { error: paymentError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

      if (paymentError) {
        setError(paymentError.message || "Payment failed");
        onError?.(paymentError.message || "Payment failed");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      onSuccess?.(0); // Payment ID will be provided by parent component
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount Summary */}
      <div className="bg-gray-50 p-4 rounded-lg border-2 border-teal-200">
        <p className="text-sm text-gray-600">Club</p>
        <p className="text-lg font-semibold text-gray-900">{clubName}</p>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-teal-600">
            LKR {amount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Card Element */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-700">
          Card Details
        </label>
        <div className="border-2 border-teal-200 rounded-lg p-4 bg-white hover:border-teal-400 transition-colors">
          <CardElement options={cardElementOptions} />
        </div>
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm font-semibold">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {/* Test Cards Info */}
      <div className="bg-teal-50 border-2 border-teal-300 rounded-lg p-4">
        <h4 className="font-bold text-teal-900 mb-2">Test Cards (Sandbox Mode)</h4>
        <ul className="text-sm text-teal-700 space-y-1">
          <li>
            <strong>Success:</strong> 4242 4242 4242 4242
          </li>
          <li>
            <strong>Decline:</strong> 4000 0000 0000 0002
          </li>
          <li>
            <strong>Any Future Date:</strong> 12/34
          </li>
          <li>
            <strong>Any 3-Digit CVC:</strong> 123
          </li>
        </ul>
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200">
          <CheckCircle className="w-4 h-4" />
          Payment method created successfully!
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || isProcessing || !stripe}
        className="w-full bg-yellow-400 text-teal-900 font-bold py-3 rounded-lg hover:bg-yellow-300 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
      >
        {isLoading || isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          `Pay LKR ${amount.toFixed(2)}`
        )}
      </button>

      {/* Security Note */}
      <p className="text-xs text-gray-500 text-center">
        Your payment information is secure and encrypted by Stripe.
      </p>
    </form>
  );
}
