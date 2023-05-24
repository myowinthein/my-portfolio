// external
import Image from 'next/image';
import React from 'react';
import AwesomeSlider from 'react-awesome-slider';

// internal
import CloseImg from "../../../public/assets/img/cancel.svg";

const settings = {
  animation: "fallAnimation",
}

const PortfolioModal = ({modalCategory, modalProject, setGetModal}) => {
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
                <div className="col-4 mb-2">
                  <i class="fa-solid fa-building pr-2"></i>
                  Industry:{" "}
                  <span className="ft-wt-600 uppercase">
                    {modalCategory}
                  </span>
                </div>
                <div className="col-5 mb-2">
                  <i className="fa fa-external-link pr-2"></i>
                  Preview :{" "}
                  {modalProject.preview.length ? (
                    modalProject.preview.map((preview, i, origin) => (
                      <>
                        <a
                          key={i}
                          className="preview-link"
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          href={preview.url}
                        >
                          <span>{preview.platform}</span>
                        </a>
                        {i === origin.length - 1 ? '' : ', '}
                      </>
                    ))) : 'N/A'
                  }
                </div>
                <div className="col-3 mb-2">
                  {modalProject.status == 1 ?
                    <i class="fa-solid fa-circle-check pr-2"></i> :
                    <i class="fa-solid fa-circle-xmark pr-2"></i>
                  }
                  Status:{" "}
                  <span className="ft-wt-600 uppercase">
                    {modalProject.status == 1 ? (
                      <span class="green">Live</span>
                    ) : (modalProject.status == 2 ? (
                      <span class="red">Retired</span>
                    ) :
                      <span class="red">Cancelled</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <figure className="modal__img">
              <AwesomeSlider {...settings}>
                {modalProject.media.map((media, i) => (
                  <div key={i}>
                    {media.type == 'image' ? (
                      <div>
                        <Image src={media.url} alt="portfolio project" />
                      </div>
                    ) : (
                      <div>
                        <video controls>
                          <source src={media.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                ))}
              </AwesomeSlider>
            </figure>

            <p class="modal__description">{modalProject.description}</p>

            {/* <button
              className="close-modal"
              onClick={() => setGetModal(false)}
            >
              <Image src={CloseImg} alt="portfolio project demo" />
            </button> */}
          </div>
      </div>
    </div>
  );
};

export default PortfolioModal;