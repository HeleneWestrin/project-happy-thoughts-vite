import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import "./HappyThought.css";
import HeartOutlinePath from "../assets/icons/heart-outline.svg";
import HeartFilledPath from "../assets/icons/heart-filled.svg";
import { IconLoading } from "../assets/icons/IconLoading";

const HeartOutline = () => {
  return (
    <img
      alt=""
      src={HeartOutlinePath}
    />
  );
};

const HeartFilled = () => {
  return (
    <img
      alt=""
      src={HeartFilledPath}
    />
  );
};

export const HappyThought = ({
  id,
  message,
  likes,
  timestamp,
  isLoading,
  onLike,
  isProcessing,
  isAlreadyLiked,
}) => {
  return (
    <article className="happy-thought">
      <h2 className="happy-thought__title">
        {isLoading ? <Skeleton /> : message}
      </h2>
      <footer className="happy-thought__footer">
        <div className="happy-thought__likes">
          {isLoading ? (
            <Skeleton width={50} />
          ) : (
            <>
              <div
                aria-live="polite"
                className="sr-only"
                lang="en"
              >
                <span
                  id={`likeButtonText-${id}`}
                  lang="en"
                >
                  {isAlreadyLiked
                    ? "You like this happy thought. Click again to remove like."
                    : "Like this happy thought"}
                </span>
              </div>
              <button
                aria-labelledby={`likeButtonText-${id}`}
                onClick={onLike}
                aria-disabled={isProcessing || isLoading}
                className="happy-thought__like-btn"
              >
                {isProcessing ? (
                  <IconLoading color="black" />
                ) : isAlreadyLiked ? (
                  <HeartFilled />
                ) : (
                  <HeartOutline />
                )}
              </button>
              <p>
                <span aria-hidden="true">x</span> {likes}{" "}
                <span className="sr-only">
                  &nbsp; {likes === 1 ? "like" : "likes"}
                </span>
              </p>
            </>
          )}
        </div>
        <div
          lang="en"
          className="happy-thought__timestamp"
        >
          {isLoading ? (
            <Skeleton
              width={100}
              containerClassName="skeleton-align-right"
            />
          ) : (
            timestamp && moment(timestamp).fromNow()
          )}
        </div>
      </footer>
    </article>
  );
};
