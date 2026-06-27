import React, { useEffect, useRef } from "react";
import Modal from "react-modal";
import cancelImg from "../../../public/assets/img/cancel.svg";
import { mediumURL } from "../../config";
import UseData from "../../Hooks/UseData";
import Image from "next/image";


const Blog = () => {
  const { singleData, isOpen, setIsOpen, blogsData, isLoading, handleBlogsData } = UseData();
  const excerptRef = useRef(null);

  useEffect(() => {
    Modal.setAppElement("#__next");
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !excerptRef.current) return;
    excerptRef.current.querySelectorAll('img').forEach(img => {
      const remove = () => (img.closest('figure') || img).remove();
      if (img.src.includes('medium.com/_/stat')) { remove(); return; }
      if (img.complete && img.naturalWidth === 0) { remove(); return; }
      img.addEventListener('error', remove, { once: true });
    });
  }, [isOpen, singleData]);
  return (
    <>
      <h4 className="info-title">
        Explore more posts on&nbsp;
        <a
          className="preview-link"
          target="_blank"
          rel="noopener noreferrer nofollow"
          href={mediumURL}
        >
          Medium
        </a>
        .
      </h4>

      {isLoading ? (
        <div className="blog-loading">
          <span className="blog-spinner"></span>
        </div>
      ) : (
        <div className="row">
          {blogsData.map((item) => (
            <div
              key={item.id}
              className="col-12 col-md-6 col-lg-6 col-xl-4 mb-30"
            >
              <article
                className="post-container"
                onClick={() => handleBlogsData(item?.id)}
              >
                <div className="post-thumb">
                  <div className="d-block position-relative overflow-hidden">
                    <Image
                      loader={({ src }) => src}
                      src={item?.img}
                      width={500}
                      height={500}
                      alt={item?.title}
                    />
                  </div>
                </div>
                <div className="post-content">
                  <div className="entry-header">
                    <h3>{item?.title}</h3>
                  </div>
                  <div className="entry-content open-sans-font">
                    <p>{item?.preview}</p>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="My dialog"
        className="custom-modal dark"
        overlayClassName="custom-overlay dark"
        closeTimeoutMS={300}
      >
        <div>
          <button
            className="close-modal"
            onClick={() => setIsOpen(false)}
          >
            <Image src={cancelImg} alt="close icon" />
          </button>
          {/* End close icon */}

          <div className="box_inner blog-post">
            {/* Article Starts */}
            <article>
              <h1>{singleData?.title}</h1>
              <div className="blog-excerpt open-sans-font" ref={excerptRef}>
                <p dangerouslySetInnerHTML={{ __html: singleData?.description }} />
              </div>

              <div className="meta open-sans-font">
                <div>
                  <i className="fa fa-user"></i> {singleData.commentor}
                </div>
                <div>
                  <i className="fa fa-calendar"></i> {singleData.date}
                </div>
                <div>
                  <i className="fa fa-tags"></i> {singleData.tag}
                </div>
              </div>

              <h4 className="info-title">
                Continue reading on&nbsp;
                <a
                  className="preview-link"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  href={singleData.link}
                >
                  Medium
                </a>
                .
              </h4>
            </article>
            {/* Article Ends */}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Blog;
