import { useContext } from "react";
import { BlogContext } from "../Context/ContextProvider";

const useData = () => {
  return useContext(BlogContext);
};

export default useData;
