import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import {
  toastOptions,
  emailjsServiceId,
  emailjsTemplateId,
  emailjsPublicKey,
  recaptchaSiteKey,
} from "../config";

const Contact = () => {
  const form = useRef(null);
  const widgetIdRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // Render invisible reCAPTCHA when grecaptcha is available
  useEffect(() => {
    const POLL_INTERVAL_MS = 150;
    const MAX_WAIT_MS = 15000;
    let elapsed = 0;

    const interval = setInterval(() => {
      if (window.grecaptcha && widgetIdRef.current === null) {
        try {
          widgetIdRef.current = window.grecaptcha.render("recaptcha-container", {
            sitekey: recaptchaSiteKey,
            size: "invisible",
            callback: onRecaptchaSuccess,
            "error-callback": onRecaptchaError,
            "expired-callback": onRecaptchaExpired,
          });

          setRecaptchaReady(true);
          clearInterval(interval);
        } catch (err) {
          console.error("reCAPTCHA render error:", err);
        }
        return;
      }

      elapsed += POLL_INTERVAL_MS;
      if (elapsed >= MAX_WAIT_MS) {
        clearInterval(interval);
        console.error("reCAPTCHA did not become available within", MAX_WAIT_MS, "ms");
        toast.error("reCAPTCHA failed to load. Please refresh the page and try again.", toastOptions);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * reCAPTCHA usually injects its own field named `g-recaptcha-response` (often a textarea).
   * Your previous code created a second field with the same name, which can break verification.
   * This function:
   *  - removes duplicates
   *  - reuses the existing field if present
   *  - only creates one if none exists (rare)
   */
  const ensureSingleRecaptchaField = () => {
    if (!form.current) return null;

    const fields = form.current.querySelectorAll(
      'textarea[name="g-recaptcha-response"], input[name="g-recaptcha-response"]'
    );

    // Remove duplicates (keep the first)
    fields.forEach((el, idx) => {
      if (idx > 0) el.remove();
    });

    // Re-check after removal
    let field =
      form.current.querySelector('textarea[name="g-recaptcha-response"]') ||
      form.current.querySelector('input[name="g-recaptcha-response"]');

    // If reCAPTCHA didn't inject (rare), create one
    if (!field) {
      field = document.createElement("textarea");
      field.name = "g-recaptcha-response";
      field.style.display = "none";
      form.current.appendChild(field);
    }

    return field;
  };

  const resetForm = () => {
    form.current?.reset();
  };

  const safelyResetRecaptcha = () => {
    try {
      if (window.grecaptcha && widgetIdRef.current !== null) {
        window.grecaptcha.reset(widgetIdRef.current);
      }
    } catch (err) {
      console.warn("reCAPTCHA reset failed:", err);
    }
  };

  // Form submit: execute reCAPTCHA first, then EmailJS in callback
  const sendEmail = (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!recaptchaReady || !window.grecaptcha || widgetIdRef.current === null) {
      toast.error("reCAPTCHA is still loading. Please try again.", toastOptions);
      return;
    }

    setIsLoading(true);

    try {
      // Triggers invisible reCAPTCHA; on success -> onRecaptchaSuccess(token)
      window.grecaptcha.execute(widgetIdRef.current);
    } catch (err) {
      console.error("reCAPTCHA execute error:", err);
      setIsLoading(false);
      toast.error("reCAPTCHA failed. Please try again.", toastOptions);
    }
  };

  // Called by reCAPTCHA when token is generated
  const onRecaptchaSuccess = (token) => {
    try {
      const field = ensureSingleRecaptchaField();
      if (field) field.value = token;

      emailjs
        .sendForm(emailjsServiceId, emailjsTemplateId, form.current, emailjsPublicKey)
        .then(
          () => {
            toast.success("Message Sent Successfully!", toastOptions);
            resetForm();
          },
          (error) => {
            console.error("EmailJS error:", error);
            toast.error("Failed to send message!", toastOptions);
          }
        )
        .finally(() => {
          setIsLoading(false);
          safelyResetRecaptcha();
        });
    } catch (err) {
      console.error("Send flow error:", err);
      setIsLoading(false);
      toast.error("Failed to send message!", toastOptions);
      safelyResetRecaptcha();
    }
  };

  const onRecaptchaError = () => {
    setIsLoading(false);
    toast.error("reCAPTCHA failed. Please try again.", toastOptions);
    safelyResetRecaptcha();
  };

  const onRecaptchaExpired = () => {
    setIsLoading(false);
    toast.error("reCAPTCHA expired. Please try again.", toastOptions);
    safelyResetRecaptcha();
  };

  return (
    <form id="myForm" className="contactform" ref={form} onSubmit={sendEmail}>
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <input type="text" name="name" placeholder="YOUR NAME" required />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <input type="email" name="email" placeholder="YOUR EMAIL" required />
            </div>
          </div>

          <div className="col-12">
            <div className="form-group">
              <input type="text" name="subject" placeholder="YOUR SUBJECT" required />
            </div>
          </div>

          <div className="col-12">
            <div className="form-group">
              <textarea name="message" placeholder="YOUR MESSAGE" required />
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="button" disabled={isLoading}>
              <span className="button-text">
                {isLoading ? "Sending..." : "Send Message"}
              </span>
              <span className="button-icon fa fa-paper-plane"></span>
            </button>
            <p className="recaptcha-disclaimer open-sans-font">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer nofollow">Privacy Policy</a>
              {" "}and{" "}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer nofollow">Terms of Service</a>
              {" "}apply.
            </p>
          </div>

          <div id="recaptcha-container" />
        </div>
      </form>
  );
};

export default Contact;