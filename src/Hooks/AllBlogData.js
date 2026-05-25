import { useState, useEffect } from "react";
import { parseISO, format } from "date-fns";
import { toast } from "react-toastify";
import { rssAPIKey, toastOptions } from "../config";

const AllBlogData = () => {
  const [blogsData, setBlogsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@myowinthein/&api_key=${rssAPIKey}&count=9`)
      .then(res => res.json())
      .then(
        (data) => {
          const blogsData = []
          let item = ''
          for (let key in data.items) {
            item = data.items[key]
            const desc = item.description.replace(
              /<img[^>]*\bsrc="[^"]*medium\.com\/_\/stat[^"]*"[^>]*>/gi,
              ''
            )
            const plainText = desc.replace(/<[^>]*>/g, '')
            blogsData.push({
              id: parseInt(key),
              img: item.thumbnail ? item.thumbnail : item.description.match(/<img[^>]+src="([^">]+)"/)?.[1],
              title: item.title,
              commentor: item.author,
              date: format(parseISO(item.pubDate), 'd MMMM yyyy, pp'),
              tag: item.categories.join(', '),
              link: item.guid,
              description: desc,
              preview: plainText.slice(0, 200)
            })
          }

          setBlogsData(blogsData)
          setIsLoading(false)
        },
        (error) => {
          toast.error("Failed to fetch blogs!", toastOptions);
          setIsLoading(false)
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
    isLoading,
    handleBlogsData,
  };
};

export default AllBlogData;
