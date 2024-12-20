import { useState } from "react";

const usePut = () => {
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);

  const putData = async (url, body = {}, options = {}) => {
    setIsPosting(true);
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(body),
        ...options,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setIsPosting(false);
      return result;
    } catch (err) {
      setError(err);
      setIsPosting(false);
      throw err;
    }
  };

  return { isPosting, error, putData };
};

export default usePut;
