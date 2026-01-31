import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import { toastOptions } from "../config";

const SERVICE_ID = "service_ymrfc1k";
const TEMPLATE_ID = "template_vnchh1m";
const PUBLIC_KEY = "qf-Hdel_0um8Wj7YK";

// Put your reCAPTCHA v2 *site key* here
const RECAPTCHA_SITE_KEY = "6LcUUFwsAAAAAKgz_JIK4HkIh-Z9SLy52-rd7gUw";

const Contact = () => {
  const form = useRef(null);
  const widgetIdRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // Render invisible reCAPTCHA when grecaptcha is available
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.grecaptcha && widgetIdRef.current === null) {
        try {
          widgetIdRef.current = window.grecaptcha.render("recaptcha-container", {
            sitekey: RECAPTCHA_SITE_KEY,
            size: "invisible",
            callback: onRecaptchaSuccess,
            "error-callback": onRecaptchaError,
            "expired-callback": onRecaptchaExpired,
          });

          setRecaptchaReady(true);
          clearInterval(interval);
        } catch (err) {
          // If render fails for some reason, keep retrying a bit
          // but don't crash the page.
          console.error("reCAPTCHA render error:", err);
        }
      }
    }, 150);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureRecaptchaHiddenField = () => {
    if (!form.current) return;

    let input = form.current.querySelector('input[name="g-recaptcha-response"]');
    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = "g-recaptcha-response";
      form.current.appendChild(input);
    }
    return input;
  };

  const resetForm = () => {
    const el = document.getElementById("myForm");
    if (el) el.reset();
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
      const hidden = ensureRecaptchaHiddenField();
      if (hidden) hidden.value = token;

      emailjs
        .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
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
          // Reset captcha so next submit works
          try {
            window.grecaptcha.reset(widgetIdRef.current);
          } catch (_) {}
        });
    } catch (err) {
      console.error("Send flow error:", err);
      setIsLoading(false);
      toast.error("Failed to send message!", toastOptions);
      try {
        window.grecaptcha.reset(widgetIdRef.current);
      } catch (_) {}
    }
  };

  const onRecaptchaError = () => {
    setIsLoading(false);
    toast.error("reCAPTCHA failed. Please try again.", toastOptions);
  };

  const onRecaptchaExpired = () => {
    setIsLoading(false);
    toast.error("reCAPTCHA expired. Please try again.", toastOptions);
  };

  return (
    <>
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

          <div className="col-12 col-md-12">
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
          </div>

          {/* Invisible reCAPTCHA mount point */}
          <div id="recaptcha-container" />
        </div>
      </form>
    </>
  );
};

export default Contact;