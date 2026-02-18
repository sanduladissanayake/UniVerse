import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Loader } from "lucide-react";
import { paymentAPI, membershipAPI } from "../services/api";

/**
 * Payment Success Page
 * Displays after successful Stripe payment
 * Confirms payment with backend and shows status
 */
export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("Processing your payment...");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [membershipCreated, setMembershipCreated] = useState(false);
  const [membershipCreationInProgress, setMembershipCreationInProgress] = useState(false);

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        // Get session ID from URL
        const sessionId = searchParams.get("session_id");
        console.log("🔍 Payment Success Page - Session ID:", sessionId);
        
        if (!sessionId) {
          console.error("❌ No session_id in URL");
          setStatus("error");
          setMessage("No payment session found. Please try again.");
          return;
        }

        // Step 1: Get payment details by session ID
        console.log("📝 Fetching payment details for session:", sessionId);
        const paymentResponse = await paymentAPI.getPaymentBySession(sessionId);
        
        if (!paymentResponse.success || !paymentResponse.payment) {
          console.error("❌ Could not find payment");
          setStatus("error");
          setMessage("Payment not found. Please contact support.");
          return;
        }

        let payment = paymentResponse.payment;
        console.log("✓ Payment found:", payment);

        // Step 2: Confirm payment with backend (waits for Stripe to confirm)
        console.log("⏳ Confirming payment with Stripe...");
        const confirmResponse = await paymentAPI.confirmPayment(payment.id);
        
        if (confirmResponse.success && confirmResponse.payment) {
          payment = confirmResponse.payment;
          console.log("✅ Payment confirmed! Status:", payment.status);
          
          setPaymentDetails(payment);
          
          if (payment.status === "SUCCEEDED") {
            setStatus("success");
            setMessage("Payment completed successfully!");
            
            // Step 3: Create membership if form data is available (ONE TIME ONLY)
            if (!membershipCreated && !membershipCreationInProgress) {
              // Set flag immediately to prevent concurrent calls
              setMembershipCreationInProgress(true);
              setMembershipCreated(true);
              
              const membershipFormDataStr = sessionStorage.getItem("membershipFormData");
              if (membershipFormDataStr) {
                try {
                  console.log("📝 Membership form data found in sessionStorage");
                  const membershipFormData = JSON.parse(membershipFormDataStr);
                  console.log("Creating membership with data:", membershipFormData);
                  
                  // Add payment ID to the form data
                  const membershipRequestData = {
                    ...membershipFormData,
                    paymentId: payment.id
                  };
                  
                  console.log("📤 Calling API to create membership...");
                  const membershipResponse = await membershipAPI.joinClubAfterPaymentWithDetails(membershipRequestData);
                  
                  if (membershipResponse.success) {
                    console.log("✅ Membership created successfully:", membershipResponse.membership);
                    setMessage("✅ Payment successful! Your membership has been created.");
                  } else {
                    console.warn("⚠️ Membership creation failed:", membershipResponse.message);
                    setMessage("Payment successful, but there was an issue creating your membership. Please contact support.");
                  }
                  
                  // Clear membership form data immediately to prevent double creation
                  sessionStorage.removeItem("membershipFormData");
                  console.log("🗑️ Cleared membershipFormData from sessionStorage");
                } catch (err: any) {
                  console.error("❌ Error creating membership:", err.message);
                  setMessage("Payment successful, but there was an issue creating your membership. Please contact support.");
                }
              } else {
                console.log("ℹ️ No membership form data found (payment only)");
              }
              
              setMembershipCreationInProgress(false);
            }
            
            // Store complete payment info for reference
            const paymentInfo = {
              clubId: payment.clubId,
              paymentId: payment.id,
              amount: payment.amount,
              status: payment.status,
              userId: payment.userId,
              timestamp: new Date().toISOString()
            };
            console.log("💾 Storing payment info in sessionStorage:", paymentInfo);
            sessionStorage.setItem("paymentCompleted", JSON.stringify(paymentInfo));
            
            // Auto-redirect to club details after 3 seconds
            console.log("🔄 Will redirect to /clubs/" + payment.clubId + " in 3 seconds");
            setTimeout(() => {
              navigate(`/clubs/${payment.clubId}`, { replace: true });
            }, 3000);
          } else if (payment.status === "PENDING") {
            setStatus("success");
            setMessage("Payment is being processed. Your account will be updated shortly.");
            
            // Store payment info for PENDING status
            const paymentInfo = {
              clubId: payment.clubId,
              paymentId: payment.id,
              amount: payment.amount,
              status: payment.status,
              userId: payment.userId,
              timestamp: new Date().toISOString()
            };
            console.log("💾 Storing payment info (PENDING) in sessionStorage:", paymentInfo);
            sessionStorage.setItem("paymentCompleted", JSON.stringify(paymentInfo));
            
            // Redirect after 3 seconds
            setTimeout(() => {
              navigate(`/clubs/${payment.clubId}?openMembershipForm=true`, { replace: true });
            }, 3000);
          } else {
            setStatus("error");
            setMessage(`Payment status: ${payment.status}`);
          }
        } else {
          console.warn("⚠️ Confirmation failed:", confirmResponse.message);
          setStatus("error");
          setMessage(confirmResponse.message || "Failed to confirm payment");
        }
      } catch (error: any) {
        console.error("❌ Error:", error.message);
        setStatus("error");
        setMessage("An error occurred. Please try again or contact support.");
      }
    };

    confirmPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden border-2 border-teal-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-8 text-center">
          <div className="flex justify-center mb-4">
            {status === "processing" && (
              <Loader className="w-12 h-12 text-white animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="w-12 h-12 text-yellow-300" />
            )}
            {status === "error" && (
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                ✕
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white">
            {status === "processing" && "Processing Payment..."}
            {status === "success" && "Payment Successful!"}
            {status === "error" && "Payment Failed"}
          </h1>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-6">
          {/* Message */}
          <p className={`text-center text-lg font-medium ${
            status === "success"
              ? "text-gray-700"
              : status === "error"
              ? "text-red-600"
              : "text-gray-500"
          }`}>
            {message}
          </p>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="font-semibold text-gray-900">
                  LKR {paymentDetails.amount?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`font-semibold ${
                  paymentDetails.status === "SUCCEEDED"
                    ? "text-green-600"
                    : paymentDetails.status === "PENDING"
                    ? "text-orange-600"
                    : "text-red-600"
                }`}>
                  {paymentDetails.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Transaction ID:</span>
                <span className="font-mono text-xs text-gray-700">
                  {(paymentDetails.stripeSessionId || paymentDetails.stripe_session_id)?.substring(0, 12) || "N/A"}...
                </span>
              </div>
            </div>
          )}

          {/* Loading Info */}
          {status === "processing" && (
            <p className="text-center text-sm text-gray-500">
              Please don't close this window...
            </p>
          )}

          {/* Auto Redirect Message */}
          {status === "success" && (
            <p className="text-center text-sm text-gray-500">
              Redirecting to your clubs page...
            </p>
          )}

          {/* Error Action */}
          {status === "error" && (
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-lg font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
