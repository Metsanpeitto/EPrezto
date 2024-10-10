import authorizedAxios from "../api/axios";
import Cookies from "js-cookie";

const sessionManager = () => {
  window.addEventListener("load", async (e) => {
    e.preventDefault();
    try {
      const response = await authorizedAxios.post("/session", {
        action: "Connect",
      });
      const { message, sessionId } = response.data;
      Cookies.set("sessionCookie", `${sessionId}`, { expires: 7 });
      localStorage.setItem("sessionId", `${sessionId}`);
      console.log("Session started with ID:", sessionId);
      console.log(`${message}`);
    } catch (error) {
      console.error("Error starting session:", error);
    }
  });

  window.addEventListener("beforeunload", async (e) => {
    e.preventDefault();
    try {
      const sessionId = localStorage.getItem("sessionId");
      await api.post("/session", {
        action: "Disconnect",
        sessionId: sessionId,
      });
      Cookies.remove("sessionCookie");
      localStorage.removeItem("sessionId");
      console.log("Session ended.");
    } catch (error) {
      console.error("Error ending session:", error);
    }
  });
};

export default sessionManager;
