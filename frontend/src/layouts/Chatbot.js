import React, { useState, useEffect, useRef, useContext } from "react";
import { Form, InputGroup, Card } from "react-bootstrap";
import UserContext from "../context/UserContext";

const ChatBot = () => {
  const { user } = useContext(UserContext);

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào! Bạn cần tôi hỗ trợ gì không?" },
  ]);
  const [input, setInput] = useState("");
  const [visible, setVisible] = useState(false);
  const [rotate, setRotate] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const sendMessage = async () => {
  if (!input.trim()) return;

  const messageToSend = input.trim();

  setMessages((prev) => [...prev, { sender: "user", text: messageToSend }]);
  setInput(""); // xóa input ngay khi gửi

  // Kiểm tra nếu tin nhắn có từ khóa cần hỗ trợ
  const lowerMsg = messageToSend.toLowerCase();
  if (
    lowerMsg.includes("hỗ trợ") || 
    lowerMsg.includes("cần giúp") || 
    lowerMsg.includes("giúp đỡ") || 
    lowerMsg.includes("cần support")
  ) {
    // Hiển thị thông tin hỗ trợ hoặc yêu cầu để lại lời nhắn
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text:
          "Bạn cần hỗ trợ? Vui lòng để lại lời nhắn chúng tôi sẽ sớm liên lạc với bạn hoặc liên hệ số hotline: 0987654321!",
      },
    ]);
    return; // Không gọi API nữa
  }

  // Nếu không phải từ khóa hỗ trợ thì gọi API
  try {
    const response = await fetch("http://localhost:8900/api/deepseek", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messageToSend, user }),
    });
    const data = await response.json();
    setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Có lỗi xảy ra, vui lòng thử lại." },
    ]);
  }
};


const handleKeyPress = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
};

  return (
    <>
      {/* Hiệu ứng chatbox xuất hiện */}
      <div
        style={{
          transition: "all 0.4s ease",
          transform: visible ? "translateY(0)" : "translateY(100px)",
          opacity: visible ? 1 : 0,
          position: "fixed",
          bottom: "70px",
          right: "20px",
          zIndex: 1000,
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        <Card
          style={{
            width: "350px",
            height: "500px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 0 15px rgba(0,0,0,0.2)",
          }}
        >
          <Card.Header
            style={{
              backgroundColor: "#ff6600",
              color: "white",
              fontWeight: "600",
              fontSize: "1.2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Veya Shop
          </Card.Header>
          <Card.Body
            style={{
              overflowY: "auto",
              flexGrow: 1,
              backgroundColor: "#fff3e6",
              padding: "1rem",
            }}
          >
            <div style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`d-flex ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
                  style={{ marginBottom: "0.5rem" }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "0.5rem 1rem",
                      borderRadius: "15px",
                      backgroundColor: msg.sender === "user" ? "#ff6600" : "#ffe6cc",
                      color: msg.sender === "user" ? "white" : "#663300",
                      whiteSpace: "pre-wrap",
                      fontSize: "0.95rem",
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </Card.Body>
          <Card.Footer className="p-2" style={{ backgroundColor: "white" }}>
            <InputGroup>
              <Form.Control
                placeholder="Nhập tin nhắn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                style={{ fontSize: "1rem" }}
              />
              <button
                onClick={sendMessage}
                style={{
                  backgroundColor: "#ff6600",
                  color: "white",
                  border: "none",
                  fontWeight: "600",
                  padding: "0 1rem",
                  cursor: "pointer",
                }}
              >
                Gửi
              </button>
            </InputGroup>
          </Card.Footer>
        </Card>
      </div>

      {/* Nút ảnh bật/tắt */}
      <img
        src={
          visible
            ? require("../assets/images/logo3_close.jpg")
            : require("../assets/images/logo3.jpg")
        }
        alt={visible ? "Đóng Chatbot" : "Mở Chatbot"}
        onClick={() => {
          setRotate(true);
          setVisible((v) => !v);
          setTimeout(() => setRotate(false), 100);
        }}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          cursor: "pointer",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          zIndex: 1100,
          objectFit: "cover",
          transform: rotate ? "rotate(360deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease",
          animation: !visible ? "pulse 1.5s infinite" : "none",
        }}
      />

      {/* CSS cho hiệu ứng nhấp nháy */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 rgba(255, 102, 0, 0.6); }
            50% { transform: scale(1.1); box-shadow: 0 0 10px rgba(255, 102, 0, 0.7); }
            100% { transform: scale(1); box-shadow: 0 0 0 rgba(255, 102, 0, 0.6); }
          }
        `}
      </style>
    </>
  );
};

export default ChatBot;
