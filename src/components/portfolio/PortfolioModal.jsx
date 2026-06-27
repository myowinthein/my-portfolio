import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import AwesomeSlider from 'react-awesome-slider';

import CloseImg from "../../../public/assets/img/cancel.svg";

const settings = {
  animation: "fallAnimation",
};

const DetailField = ({ iconClass, label, children }) => (
  <div className="col-12 col-sm-4 mb-3">
    <span className="detail-label">
      <i className={`${iconClass} pr-1`}></i>{" "}{label}
    </span>
    <span className="ft-wt-600 d-block">{children}</span>
  </div>
);

const PortfolioModal = ({ modalCategory, modalProject, setGetModal }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i !== activeIndex) {
        video.pause();
        video.currentTime = 0;
      }
    });

    const video = videoRefs.current[activeIndex];
    if (!video) return;

    video.play().catch(() => {});

    if (isFirstRender.current) {
      isFirstRender.current = false;
      // On initial open, AwesomeSlider's fallAnimation entrance is still running
      // when this effect fires. iOS Safari won't play a video whose container is
      // mid-animation; retry after the animation settles (~600ms).
      const timer = setTimeout(() => video.play().catch(() => {}), 600);
      return () => clearTimeout(timer);
    }
  }, [activeIndex]);

  return createPortal(
    <div className="modal_portfolio">
      <div
        className="modal__outside"
        onClick={() => setGetModal(false)}
      ></div>

      <div className="modal__content">
        <button className="close-modal" onClick={() => setGetModal(false)}>
          <Image src={CloseImg} alt="close icon" />
        </button>
        <div className="modal__body">
        <div>
          <h2 className="heading mb-2">{modalProject.product}</h2>

          <div className="modal__details">
            <div className="row open-sans-font">
              <DetailField iconClass="fa-solid fa-building" label="Company">
                {modalProject.company}
              </DetailField>
              <DetailField iconClass="fa-solid fa-briefcase" label="Industry">
                {modalProject.industry || "N/A"}
              </DetailField>
              <DetailField iconClass="fa-solid fa-id-badge" label="Role">
                {modalProject.role}
              </DetailField>
              <DetailField iconClass="fa-solid fa-layer-group" label="Type">
                {modalProject.productType || "N/A"}
              </DetailField>
              <DetailField iconClass="fa-solid fa-sitemap" label="Category">
                {modalCategory}
              </DetailField>
              <DetailField iconClass="fa fa-arrow-up-right-from-square" label="Preview">
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
              </DetailField>
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
                    <Image src={media.url} alt={modalProject.product} sizes="(max-width: 576px) 100vw, 700px" />
                  ) : (
                    <video
                      ref={(el) => (videoRefs.current[i] = el)}
                      playsInline
                      muted
                      loop
                      preload="metadata"
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
        </div>{/* end modal__body */}
      </div>
    </div>,
    document.body
  );
};

export default PortfolioModal;