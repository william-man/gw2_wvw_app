import axios from "axios";

const fetcher = async (url) => {
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error;
  }
};

export default fetcher;
