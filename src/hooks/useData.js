import { useContext } from "react";
import { BlogContext } from "../context/ContextProvider";

const useData = () => {
  return useContext(BlogContext);
};

export default useData;
