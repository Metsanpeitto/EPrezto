import ExpandingTextarea from "./ExpandingTextarea";
import { SmileyIcon, GifIcon, ClipIcon } from "../assets/Icons";

export const MessageInputBar = (props) => {
  const { handleSubmit, handleChange, input, textareaRef } = props;

  return (
    <div className="message-input-bar">
      <div className="message-input-bar__container">
        <ExpandingTextarea
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          input={input}
          textareaRef={textareaRef}
        />
        <div className="message-input-bar__container__icons">
          <div className="icon">
            <SmileyIcon />
          </div>
          <div className="icon">
            <GifIcon />
          </div>
          <div className="icon">
            <ClipIcon />
          </div>
        </div>
      </div>
    </div>
  );
};
