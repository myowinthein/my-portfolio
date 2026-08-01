import React, { createContext } from "react";
import useAllBlogData from "../hooks/AllBlogData";

export const BlogContext = createContext();

const ContextProvider = ({ children }) => {
  const value = useAllBlogData();
  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};

export default ContextProvider;
