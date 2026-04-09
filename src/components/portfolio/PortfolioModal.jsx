import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import AwesomeSlider from 'react-awesome-slider';

import CloseImg from "../../../public/assets/img/cancel.svg";

const settings = {
  animation: "fallAnimation",
};

const PortfolioModal = ({ modalCategory, modalProject, setGetModal }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef([]);

  // 🎯 Control video playback
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (i === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0; // optional (restart)
      }
    });
  }, [activeIndex]);

  return (
    <div className="modal_portfolio">
      <div
        className="modal__outside"
        onClick={() => setGetModal(false)}
      ></div>

      <div className="modal__content">
        <div data-aos="fade">
          <h2 className="heading mb-2">{modalProject.product}</h2>

          <div className="modal__details">
            <div className="row open-sans-font">

              {/* Company */}
              <div className="col-12 col-sm-6 mb-2">
                <i className="fa-solid fa-building pr-2"></i>
                Company:{" "}
                <span className="ft-wt-600 uppercase">
                  {modalProject.company}
                </span>
              </div>

              {/* Role */}
              <div className="col-12 col-sm-6 mb-2">
                <i className="fa-solid fa-id-badge pr-2"></i>
                Role:{" "}
                <span className="ft-wt-600 uppercase">
                  {modalProject.role}
                </span>
              </div>

              {/* Industry */}
              <div className="col-12 col-sm-6 mb-2">
                <i className="fa-solid fa-briefcase pr-2"></i>
                Industry:{" "}
                <span className="ft-wt-600 uppercase">
                  {modalProject.industry || "N/A"}
                </span>
              </div>

              {/* Product Type */}
              <div className="col-12 col-sm-6 mb-2">
                <i className="fa-solid fa-layer-group pr-2"></i>
                Type:{" "}
                <span className="ft-wt-600 uppercase">
                  {modalProject.productType || "N/A"}
                </span>
              </div>

              {/* Category */}
              <div className="col-12 col-sm-6 mb-2">
                <i className="fa-solid fa-sitemap pr-2"></i>
                Category:{" "}
                <span className="ft-wt-600 uppercase">
                  {modalCategory}
                </span>
              </div>

              {/* Preview */}
              <div className="col-12 col-sm-6 mb-2">
                <i className="fa fa-arrow-up-right-from-square pr-2"></i>
                Preview:{" "}
                {modalProject.preview?.length ? (
                  modalProject.preview.map((preview, i, origin) => (
                    <span key={i}>
                      <a
                        className="preview-link"
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        href={preview.url}
                      >
                        {preview.platform}
                      </a>
                      {i !== origin.length - 1 && " · "}
                    </span>
                  ))
                ) : (
                  "N/A"
                )}
              </div>
            </div>
          </div>

          {/* Screenshots */}
          <figure className="modal__img">
            <AwesomeSlider
              {...settings}
              onTransitionEnd={({ currentIndex }) => {
                setActiveIndex(currentIndex);
              }}
            >
              {modalProject.media.map((media, i) => (
                <div key={i}>
                  {media.type === "image" ? (
                    <Image src={media.url} alt="portfolio project" />
                  ) : (
                    <video
                      ref={(el) => (videoRefs.current[i] = el)}
                      playsInline
                      loop
                    >
                      <source src={media.url} type="video/mp4" />
                    </video>
                  )}
                </div>
              ))}
            </AwesomeSlider>
          </figure>

          {/* Description */}
          <div className="modal__description">
            {modalProject.description.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioModal;