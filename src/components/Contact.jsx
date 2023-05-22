import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import { toastOptions } from "../config";

const Contact = () => {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true)

    emailjs
      .sendForm(
        "service_92m7j8n",
        "template_kdskmjp",
        form.current,
        "7Pz4ReA5NV5WLLnqi"
      )
      .then(
        (result) => {
          toast.success("Message Sent Successfully!", toastOptions);
          document.getElementById("myForm").reset();
        },
        (error) => {
          toast.error("Failed to send message!", toastOptions);
        }
      )
      .finally(() => {
        setIsLoading(false)
      });
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
          {/* End .col */}

          <div className="col-12 col-md-6">
            <div className="form-group">
              <input
                type="email"
                name="user_email"
                placeholder="YOUR EMAIL"
                required
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-12 col-md-12">
            <div className="form-group">
              <input
                type="text"
                name="subject"
                placeholder="YOUR SUBJECT"
                required
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-12">
            <div className="form-group">
              <textarea
                name="message"
                placeholder="YOUR MESSAGE"
                required
              ></textarea>
            </div>
          </div>
          {/* End .col */}

          <div className="col-12">
            <button type="submit" className="button" disabled={isLoading}>
              <span className="button-text">
                {isLoading ? "Sending..." : "Send Message"}
              </span>
              <span className="button-icon fa fa-paper-plane"></span>
            </button>
          </div>
          {/* End .col */}
        </div>
      </form>
    </>
  );
};

export default Contact;
