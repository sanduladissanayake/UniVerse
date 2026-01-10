import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";

/**
 * Payment Cancelled Page
 * Displays when user cancels payment on Stripe checkout page
 */
export function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden border-2 border-red-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-8 text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Payment Cancelled</h1>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-6">
          {/* Message */}
          <div className="space-y-3 text-center">
            <p className="text-lg font-medium text-gray-700">
              Your payment was not completed.
            </p>
            <p className="text-gray-600">
              You have exited the Stripe payment process. No charges have been made to your account.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <h3 className="font-bold text-red-900 mb-2">What Happened?</h3>
            <ul className="text-sm text-red-800 space-y-2">
              <li className="flex gap-2">
                <span>•</span>
                <span>You closed the payment page before completing the transaction</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>You chose to cancel the payment</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>An error occurred during processing</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full py-3 rounded-lg font-bold bg-yellow-400 hover:bg-yellow-300 text-teal-900 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Try Again
            </button>

            <button
              onClick={() => navigate("/clubs")}
              className="w-full py-3 rounded-lg font-bold bg-teal-600 hover:bg-teal-700 text-white transition-colors"
            >
              Browse Clubs
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-lg font-bold bg-gray-200 hover:bg-gray-300 text-gray-900 transition-colors"
            >
              Return Home
            </button>
          </div>

          {/* Support Info */}
          <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4">
            <p className="text-sm text-teal-900 font-bold mb-2">Need Help?</p>
            <p className="text-sm text-teal-800">
              If you have any questions about joining a club or the payment process, 
              please don't hesitate to contact our support team.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t-2 border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Your payment information was not saved. You can try again whenever you're ready.
          </p>
        </div>
      </div>
    </div>
  );
}
