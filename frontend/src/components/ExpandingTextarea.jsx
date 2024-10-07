const ExpandingTextarea = (props) => {
  const { handleSubmit, handleChange, input, textareaRef } = props;

  return (
    <textarea
      ref={textareaRef}
      className="message-input-bar__container__textarea"
      value={input}
      onChange={handleChange}
      onKeyDown={handleSubmit}
      placeholder="Escribe un mensaje..."
    />
  );
};

export default ExpandingTextarea;
