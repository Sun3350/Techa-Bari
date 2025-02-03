import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux"; // If you're using Redux for state management

const Verification = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your account...");
  const [isVerified, setIsVerified] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);
  const dispatch = useDispatch(); // Redux dispatch
  const navigate = useNavigate(); // To redirect user after verification
  const email = searchParams.get("email"); // Extract email from URL search params
  const token = searchParams.get("token");

  useEffect(() => {
    if (!email) {
      setMessage("Invalid verification request.");
      return;
    }
  
    const pollVerification = async () => {
      let isPolling = true; // Add a flag to control polling
  
      const interval = setInterval(async () => {
        if (!isPolling) return; // Prevent further requests if polling is stopped
  
        try {
          const response = await axios.get("http://localhost:5000/api/userPost/verify", {
            params: { email, token },
          });
  
          if (response.data.isVerified) {
            isPolling = false; // Stop polling once verified
            console.log("verified");
            dispatch({ type: "SUBSCRIBE_USER" });
            setMessage("Email verified successfully! You now have access.");
            setIsVerified(true);
            clearInterval(interval); // Stop the interval
  
            // After successful verification, handle redirect logic
            const redirectUrl = localStorage.getItem("redirectAfterVerification");
            if (redirectUrl) {
              window.location.href = redirectUrl; // Redirect to the stored page
              localStorage.removeItem("redirectAfterVerification"); // Clean up stored redirect URL
            } else {
              navigate("/"); // Redirect to home if no redirect URL is found
            }
          }
        } catch (error) {
          console.error("Verification check failed:", error);
        }
      }, process.env.REACT_APP_POLL_INTERVAL || 3000); // Poll every 3 seconds
  
      // Store the interval for cleanup
      setPollingInterval(interval);
  
      // Clean up on component unmount
      return () => {
        isPolling = false; // Stop polling on unmount
        clearInterval(interval);
      };
    };
  
    pollVerification();
  
    // Cleanup polling interval on component unmount
    return () => clearInterval(pollingInterval);
  }, [email, token, dispatch, navigate]);
  

  return (
    <div>
      <h2>{message}</h2>
      {isVerified && <p>You will be redirected now.</p>}
    </div>
  );
};

export default Verification;
