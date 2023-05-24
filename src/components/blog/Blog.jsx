import React, { useEffect } from "react";
import Modal from "react-modal";
// import cancelImg from "../../../public/assets/img/cancel.svg";
import { mediumURL } from "../../config";
import UseData from "../../Hooks/UseData";
import Image from "next/image";


const Blog = () => {
  const { singleData, isOpen, setIsOpen, blogsData, handleBlogsData } = UseData();
  const handleModle = (id) => {
    handleBlogsData(id);
  };
  useEffect(() => {
    Modal.setAppElement("#modal");
  },[])
  return (
    <>
      <h4 class="info-title">
        Explore more articles on&nbsp;
        <a
          className="preview-link"
          target="_blank" 
          rel="noopener noreferrer nofollow"
          href={mediumURL}
        >
          Medium.
        </a>
      </h4>
      <div className="row" id="modal">
        {blogsData.map((item) => (
          <div
            key={item.id}
            className="col-12 col-md-6 col-lg-6 col-xl-4 mb-30"
          >
            <article
              className="post-container"
              onClick={() => handleModle(item?.id)}
            >
              <div className="post-thumb">
                <div className="d-block position-relative overflow-hidden">
                  <Image
                    loader={({ src }) => {
                      return `${src}`
                    }}
                    src={item?.img}
                    width={500}
                    height={500}
                    alt="item.title"
                  />
                </div>
              </div>
              {/* End .thumb */}
              <div className="post-content">
                <div className="entry-header">
                  <h3>{item?.title}</h3>
                </div>
                <div className="entry-content open-sans-font">
                  <p dangerouslySetInnerHTML={{ __html: item?.description.slice(0, 200) }} />
                </div>
              </div>
              {/* End .post-content */}
            </article>

            {/* Start ModalOneBlogContent */}
            <Modal
              isOpen={isOpen}
              onRequestClose={() => setIsOpen(false)}
              contentLabel="My dialog"
              className="custom-modal dark"
              overlayClassName="custom-overlay dark"
              closeTimeoutMS={500}
            >
              <div>
                {/* <button
                  className="close-modal"
                  onClick={() => setIsOpen(false)}
                >
                  <Image src={cancelImg} alt="close icon" />
                </button> */}
                {/* End close icon */}

                <div className="box_inner blog-post">
                  {/* Article Starts */}
                  <article>
                    <div className="title-section text-start text-sm-center">
                      <h1>
                        Post <span>Details</span>
                      </h1>
                      <span className="title-bg">posts</span>
                    </div>
                    {/* Meta Starts */}

                    <div className="meta open-sans-font">
                      <span>
                        <i className="fa fa-user"></i> {singleData.commentor}
                      </span>
                      <span className="date">
                        <i className="fa fa-calendar"></i> {singleData.date}
                      </span>
                      <span>
                        <i className="fa fa-tags"></i> {singleData.tag}
                      </span>
                    </div>
                    {/* Meta Ends */}
                    {/* Article Content Starts */}

                    <h1>{singleData?.title}</h1>
                    <div className="blog-excerpt open-sans-font pb-5">
                      <p dangerouslySetInnerHTML={{ __html: singleData?.description }} />
                    </div>
                    {/* Article Content Ends */}
                  </article>
                  {/* Article Ends */}
                </div>
              </div>
            </Modal>
            {/* End  ModalOneBlogContent */}
          </div>
        ))}
      </div>
    </>
  );
};

export default Blog;
