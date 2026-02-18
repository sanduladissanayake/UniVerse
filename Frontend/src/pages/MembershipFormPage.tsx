import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MembershipForm } from "../components/clubs/MembershipForm";
import { useAuth } from "../context/AuthContext";

/**
 * Membership Form Page
 * Displays membership form after payment completion
 * Auto-opens the form with payment details pre-filled
 */
export function MembershipFormPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clubId, setClubId] = useState<number | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [clubName] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState(true);

  useEffect(() => {
    // Get clubId and paymentId from URL params
    const clubIdParam = searchParams.get("clubId");
    const paymentIdParam = searchParams.get("paymentId");

    console.log("📋 Membership Form Page loaded:");
    console.log("   Club ID:", clubIdParam);
    console.log("   Payment ID:", paymentIdParam);
    console.log("   User authenticated:", !!user);

    if (!clubIdParam) {
      console.error("❌ No clubId found in URL");
      navigate("/clubs", { replace: true });
      return;
    }

    setClubId(Number(clubIdParam));
    setPaymentId(paymentIdParam);
  }, [searchParams, navigate, user]);

  const handleFormClose = () => {
    console.log("❌ Form closed by user");
    setIsFormOpen(false);
    navigate("/clubs", { replace: true });
  };

  const handleFormSuccess = () => {
    console.log("✅ Membership form submitted successfully");
    setIsFormOpen(false);
    navigate("/clubs", { replace: true });
  };

  if (!clubId || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <MembershipForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        clubId={clubId}
        clubName={clubName || `Club ${clubId}`}
        onSuccess={handleFormSuccess}
        paymentAlreadyCompleted={paymentId ? true : false}
      />
    </div>
  );
}
