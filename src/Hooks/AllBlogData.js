import { useState, useEffect } from "react";
import { parseISO, format } from "date-fns";
import { toast } from "react-toastify";
import { rssAPIKey, toastOptions } from "../config";

const useAllBlogData = () => {
  const [blogsData, setBlogsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [singleData, setSingleData] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@myowinthein/&api_key=${rssAPIKey}&count=9`)
      .then(res => res.json())
      .then(
        (data) => {
          const items = data.items.map((item) => {
            const desc = item.description.replace(
              /<img[^>]*\bsrc="[^"]*medium\.com\/_\/stat[^"]*"[^>]*>/gi,
              ''
            );
            const plainText = desc.replace(/<[^>]*>/g, '');
            return {
              id: item.guid,
              img: item.thumbnail ? item.thumbnail : item.description.match(/<img[^>]+src="([^">]+)"/)?.[1],
              title: item.title,
              author: item.author,
              date: format(parseISO(item.pubDate), 'd MMMM yyyy, pp'),
              tag: item.categories.join(', '),
              link: item.guid,
              description: desc,
              preview: plainText.slice(0, 200),
            };
          });
          setBlogsData(items);
          setIsLoading(false);
        },
        (err) => {
          console.error('Blog fetch failed:', err);
          toast.error("Failed to fetch blogs!", toastOptions);
          setIsLoading(false);
        }
      );
  }, []);

  const handleBlogsData = (id) => {
    const find = blogsData.find((item) => item.id === id);
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

export default useAllBlogData;
