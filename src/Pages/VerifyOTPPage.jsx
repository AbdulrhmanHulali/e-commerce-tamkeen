import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router";
import { FiCheckCircle } from "react-icons/fi";
import { api_config } from "../../Config/API"; 
import { AppContext } from "../Contexts/AppContext";
import "../styles/register.css";

export default function VerifyOTPPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useContext(AppContext);

  const phoneToVerify = location.state?.phone || "";

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    if (!phoneToVerify) {
      navigate("/login");
    }
  }, [phoneToVerify, navigate]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setIsLoading(true);

    const verifyPayload = {
      phone: phoneToVerify,
      otp: otp,
    };
    console.log("Sending Verify Payload:", verifyPayload);

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.VERIFY}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Accept-Language": "en",
      },
      body: JSON.stringify(verifyPayload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((serverError) => {
            throw new Error(serverError.message || "Invalid OTP!");
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Verify Success:", data);

        login(data.data || data);

        navigate("/");
      })
      .catch((err) => {
        console.error("Verify Error:", err);
        alert(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleResend = () => {
    if (resendTimer > 0) return;

    console.log("Sending Resend Payload:", { phone: phoneToVerify });

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.RESEND}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Accept-Language": "en",
      },
      body: JSON.stringify({ phone: phoneToVerify }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((serverError) => {
            throw new Error(serverError.message || "Failed to resend code");
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Resend Success:", data);
        alert("Verification code sent successfully!");
        setResendTimer(60);
      })
      .catch((err) => {
        console.error("Resend Error:", err);
        alert(err.message);
      });
  };

  return (
    <div className="split-auth-wrapper">
      <Row className="g-0 min-vh-100">
        <Col
          lg={6}
          className=" d-flex auth-text-side align-items-center justify-content-center p-5"
        >
          <div className="text-content-wrapper w-100 text-center auth-max-w-450">
            <FiCheckCircle className="text-white mb-4" size={80} />
            <h1 className="fw-bold auth-text-white mb-3 display-5">
              Almost There!
            </h1>
            <p className="auth-text-opacity fs-5">
              We've sent a verification code to your phone. Please enter it to
              continue.
            </p>
          </div>
        </Col>

        <Col lg={6} className="auth-form-side">
          <Container className="auth-form-container d-flex flex-column justify-content-center min-vh-100">
            <div className="w-100 mx-auto auth-max-w-450">
              <h2 className="fw-bold auth-main-title mb-1">
                Verify Your Account
              </h2>
              <p className="auth-muted-text small mb-4">
                Enter the OTP sent to{" "}
                <span className="fw-bold text-main-theme" dir="ltr">
                  {phoneToVerify}
                </span>
              </p>

              <Form onSubmit={handleVerify} className="auth-form">
                <Form.Group className="mb-4">
                  <Form.Control
                    type="text"
                    placeholder="Enter OTP"
                    className="auth-input shadow-none text-center"
                    maxLength="5"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="auth-submit-btn w-100 fw-bold mb-4 shadow-none"
                  disabled={otp.length < 4 || isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>

                <div className="text-center mt-3">
                  <p className="auth-muted-text small m-0">
                    Didn't receive the code? <br />
                    {resendTimer > 0 ? (
                      <span className="auth-muted-text">
                        Resend code in {resendTimer}s
                      </span>
                    ) : (
                      <span
                        className="auth-link fw-bold cursor-pointer"
                        onClick={handleResend}
                      >
                        Resend OTP
                      </span>
                    )}
                  </p>
                </div>
              </Form>
            </div>
          </Container>
        </Col>
      </Row>
    </div>
  );
}
