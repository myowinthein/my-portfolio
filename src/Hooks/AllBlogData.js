import { useState, useEffect } from "react";
import { parseISO, format } from 'date-fns';

const AllBlogData = () => {
  const [blogsData, setBlogsData] = useState([])

  useEffect(() => {
    fetch("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@tykebluck/")
      .then(res => res.json())
      .then(
        (data) => {
          const blogsData = []
          let item = ''
          for (let key in data.items) {
            item = data.items[key]

            blogsData.push({
              id: parseInt(key),
              img: item.thumbnail,
              title: item.title,
              commentor: item.author,
              date: format(parseISO(item.pubDate), 'd MMMM yyyy pp'),
              tag: item.categories.join(', '),
              link: item.guid,
              description: item.description // content also available
            })
          }

          setBlogsData(blogsData)
        },
        (error) => {
          // can add some error handling here
        }
      )
  }, [])
  const [singleData, setSingleData] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const handleBlogsData = (id) => {
    const find = blogsData.find((item) => item?.id === id);
    setSingleData(find);
    setIsOpen(true);
  };

  return {
    singleData,
    isOpen,
    setIsOpen,
    blogsData,
    handleBlogsData,
  };
};

export default AllBlogData;
