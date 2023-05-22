// external
import Image from 'next/image';
import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// internal
import CloseImg from "../../../public/assets/img/cancel.svg";

const PortfolioModal = ({modalCategory, modalProject, setGetModal}) => {
  let settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,
  };
  return (
    <div className="modal_portfolio">
      <div
        className="modal__outside"
        onClick={() => setGetModal(false)}
      ></div>
      <div className="modal__content">
          <div data-aos="fade">
            <h2 className="heading mb-2">{modalProject.name}</h2>
            <div className="modal__details">
                <div className="row open-sans-font">
                  <div className="col-12 col-sm-6 mb-2">
                    <i class="fa-solid fa-file-lines pr-2"></i>
                    Type:{" "}
                    <span className="ft-wt-600 uppercase">
                      {modalCategory}
                    </span>
                  </div>
                  <div className="col-12 col-sm-6 mb-2">
                    <i className="fa fa-external-link pr-2"></i>
                    Platforms :{" "}
                    {modalProject.platforms.web ? (
                      <a
                        className="preview-link"
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        href={modalProject.platforms.web}
                      >
                        <i class="fa-solid fa-globe"></i>
                      </a>
                    ): null}
                    {modalProject.platforms.android ? (
                      <a
                        className="preview-link"
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        href={modalProject.platforms.android}
                      >
                        <i class="fa-brands fa-android"></i>
                      </a>
                    ): null}
                    {modalProject.platforms.ios ? (
                      <a
                        className="preview-link"
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        href={modalProject.platforms.ios}
                      >
                        <i class="fa-brands fa-apple"></i>
                      </a>
                    ): null}
                  </div>
                  <div className="col-12 col-sm-6 mb-2">
                    <i className="fa fa-code pr-2"></i>
                    Language :{" "}
                    <span className="ft-wt-600 uppercase">
                      {modalProject.languages}
                    </span>
                  </div>
                </div>
            </div>

            <figure className="modal__img">
              <Slider {...settings}>
                {modalProject.media.map((media, i) => (
                  <div key={i}>
                    {media.type == 'image' ? (
                      <div>
                        <Image src={media.url} alt="portfolio project" />
                      </div>
                    ) : (
                      <video autoplay controls>
                        <source src={media.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                ))}
              </Slider>
            </figure>
            <p class="add-description">{modalProject.description}</p>

            <button
              className="close-modal"
              onClick={() => setGetModal(false)}
            >
              <Image src={CloseImg} alt="portfolio project demo" />
            </button>
          </div>
      </div>
    </div>
  );
};

export default PortfolioModal;