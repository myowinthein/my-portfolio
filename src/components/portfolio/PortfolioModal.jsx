import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import AwesomeSlider from 'react-awesome-slider';

import CloseImg from "../../../public/assets/img/cancel.svg";
import useBodyScrollLock from '../../Hooks/useBodyScrollLock';

const FOCUSABLE = 'button, [href], input, [tabindex]:not([tabindex="-1"])';

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
  const modalContentRef = useRef(null);

  useBodyScrollLock();
  const handleClose = () => setGetModal(false);

  // Escape key + focus trap
  useEffect(() => {
    const modal = modalContentRef.current;
    if (!modal) return;
    const focusables = [...modal.querySelectorAll(FOCUSABLE)];
    if (focusables.length) focusables[0].focus();
    const onKeyDown = (e) => {
      if (e.key === 'Escape') { setGetModal(false); return; }
      if (e.key !== 'Tab') return;
      const els = [...modal.querySelectorAll(FOCUSABLE)];
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [setGetModal]);

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
    <div
      className="modal_portfolio"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-modal-title"
    >
      <div
        className="modal__outside"
        role="button"
        tabIndex={0}
        aria-label="Close modal"
        onClick={handleClose}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClose(); }}
      ></div>

      <div className="modal__content" ref={modalContentRef}>
        <button className="close-modal" onClick={handleClose}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CloseImg.src} alt="close icon" />
        </button>
        <div className="modal__body">
        <div>
          <h2 id="portfolio-modal-title" className="heading mb-2">{modalProject.product}</h2>

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
                    <span key={preview.url}>
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
                <div key={media.url}>
                  {media.type === "image" ? (
                    <Image src={media.url} alt={modalProject.product} sizes="(max-width: 576px) 100vw, 700px" loading={i === 0 ? undefined : "lazy"} />
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