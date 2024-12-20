import { useEffect, useState } from "react";
import useGet from "./hooks/useGet";
import usePut from "./hooks/usePut";
import useLocalStorage from "./hooks/useLocalStorage";
import { renderSkeletonLoader } from "./utils/renderSkeletonLoader";
import { CreateHappyThought } from "./components/CreateHappyThought";
import { HappyThought } from "./components/HappyThought";

export const App = () => {
  const [happyThoughts, setHappyThoughts] = useState([]);
  const [thought, setThought] = useState("");
  const [processingLikes, setProcessingLikes] = useState({});
  const [likedThoughts, setLikedThoughts] = useLocalStorage(
    "likedThoughts",
    []
  );

  const {
    data: happyThoughtsData,
    isLoading,
    error,
  } = useGet("https://project-happy-thoughts-api-kappa.vercel.app/thoughts");

  // Update happyThoughts state when data is fetched
  useEffect(() => {
    if (happyThoughtsData) {
      setHappyThoughts(happyThoughtsData);
    }
  }, [happyThoughtsData]);

  const { putData } = usePut();

  // PUT request when user likes a happy thought
  const handleLike = async (id) => {
    if (processingLikes[id]) return;

    setProcessingLikes((prev) => ({ ...prev, [id]: true }));

    const isAlreadyLiked = likedThoughts.includes(id);
    const action = isAlreadyLiked ? "remove" : "add";

    try {
      await putData(
        `https://project-happy-thoughts-api-kappa.vercel.app/thoughts/${id}/like`,
        { action }
      );

      setHappyThoughts((prevThoughts) =>
        prevThoughts.map((thought) => {
          if (thought._id !== id) return thought;
          // Adjust the hearts count based on the action
          const updatedHearts =
            action === "add"
              ? thought.hearts + 1
              : Math.max(thought.hearts - 1, 0);
          return { ...thought, hearts: updatedHearts };
        })
      );

      // Update likedThoughts based on the action
      setLikedThoughts((prevLiked) => {
        if (action === "add") {
          return [...prevLiked, id];
        } else {
          return prevLiked.filter((likedId) => likedId !== id);
        }
      });
    } catch (err) {
      console.error("Failed to update the happy thought:", err);
    } finally {
      setProcessingLikes((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleLikeClick = (id) => () => handleLike(id);

  if (error) {
    return <main>Error loading thoughts: {error.message}</main>;
  }

  if (isLoading) {
    return (
      <>
        <main>
          {renderSkeletonLoader(CreateHappyThought, 1, { isLoading: true })}
        </main>
        <section aria-label="Latest posted thoughts are loading">
          {renderSkeletonLoader(HappyThought, 20, { isLoading: true })}
        </section>
      </>
    );
  }

  return (
    <>
      <main>
        <CreateHappyThought
          thought={thought}
          setThought={setThought}
          isLoading={false}
          setHappyThoughts={setHappyThoughts}
        />
      </main>
      <section aria-label="Latest posted thoughts">
        {happyThoughts.map((happyThought) => (
          <HappyThought
            key={happyThought._id}
            id={happyThought._id}
            message={happyThought.message}
            likes={happyThought.hearts}
            timestamp={happyThought.createdAt}
            isLoading={false}
            onLike={handleLikeClick(happyThought._id)}
            isProcessing={!!processingLikes[happyThought._id]}
            isAlreadyLiked={likedThoughts.includes(happyThought._id)}
          />
        ))}
      </section>
    </>
  );
};
