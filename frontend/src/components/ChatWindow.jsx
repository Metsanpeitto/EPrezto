export const ChatWindow = (props) => {
  const { messages, chatWindowRef } = props;
  return (
    <div className="chat-window" ref={chatWindowRef}>
      <div className="header__container__subheader">
        <div className="header__container__subheader__agents">
          <div className="avatar avatar1">
            <img src={`/assets/images/girl.jpeg`} alt="avatar-girl" />
          </div>
          <div className="avatar">
            <img src={`/assets/images/guy.jpg`} alt="avatar-guy" />
          </div>
        </div>
        <div className="header__container__subheader__text">
          <p>¿Tienes alguna pregunta? Aquí estamos para lo que necesites.</p>{" "}
        </div>
      </div>
      {messages.map((msg, idx) => (
        <div className="chat-window__message-wrapper" key={idx}>
          {msg.user !== "You" ? (
            <div className="chat-window__message-wrapper__container">
              <div className="chat-window__message-wrapper__container__bot-bubble">
                <div className="chat-window__message-wrapper__container__bot-bubble__icon bot">
                  <img src={`/assets/images/bot.png`} alt="avatar-bot" />
                </div>
                <div className="chat-window__message-wrapper__container__bot-bubble__text">
                  {msg.text}
                </div>
              </div>
            </div>
          ) : (
            <div className="chat-window__message-wrapper__container">
              <div className="chat-window__message-wrapper__container__user-bubble">
                <div className="chat-window__message-wrapper__container__user-bubble__text">
                  {msg.text}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
