"use client";

import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Avatar,
  Paper,
  IconButton,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: 2, sm: 3, md: 4 },
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\')',
          pointerEvents: "none",
        },
      }}
    >
      {/* Floating elements for visual appeal */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          animation: "pulse 3s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />

      <Paper
        elevation={24}
        sx={{
          width: { xs: "100%", sm: 600, md: 700 },
          maxWidth: "100%",
          height: { xs: "90vh", sm: 700, md: 800 },
          maxHeight: "90vh",
          borderRadius: 4,
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          flexDirection: "column",
          animation: "fadeInUp 0.6s ease-out",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Avatar
            sx={{
              background: "rgba(255, 255, 255, 0.2)",
              width: 48,
              height: 48,
            }}
          >
            <SmartToyIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="600">
              Headstarter AI Support
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Your intelligent assistant is here to help
            </Typography>
          </Box>
        </Box>

        {/* Messages Container */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            padding: 3,
            background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
          }}
        >
          <Stack spacing={2}>
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.role === "assistant" ? "flex-start" : "flex-end",
                  alignItems: "flex-end",
                  gap: 1,
                  animation:
                    message.role === "assistant"
                      ? "slideIn 0.3s ease-out"
                      : "slideInRight 0.3s ease-out",
                }}
              >
                {message.role === "assistant" && (
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      fontSize: "0.875rem",
                    }}
                  >
                    <SmartToyIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                )}

                <Box
                  sx={{
                    maxWidth: "70%",
                    padding: 2,
                    borderRadius: 3,
                    background:
                      message.role === "assistant"
                        ? "white"
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color:
                      message.role === "assistant" ? "text.primary" : "white",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    border:
                      message.role === "assistant"
                        ? "1px solid rgba(0,0,0,0.05)"
                        : "none",
                    position: "relative",
                    "&::before":
                      message.role === "assistant"
                        ? {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: -8,
                            width: 0,
                            height: 0,
                            borderLeft: "8px solid transparent",
                            borderRight: "8px solid white",
                            borderBottom: "8px solid white",
                          }
                        : {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            right: -8,
                            width: 0,
                            height: 0,
                            borderLeft: "8px solid #667eea",
                            borderRight: "8px solid transparent",
                            borderBottom: "8px solid #667eea",
                          },
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.6,
                      wordBreak: "break-word",
                    }}
                  >
                    {message.content ||
                      (isLoading && index === messages.length - 1 && (
                        <span className="loading-dots">Thinking</span>
                      ))}
                  </Typography>
                </Box>

                {message.role === "user" && (
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      background:
                        "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      fontSize: "0.875rem",
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                )}
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            padding: 3,
            background: "white",
            borderTop: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-end">
            <TextField
              multiline
              maxRows={4}
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  background: "#f8fafc",
                  "&:hover": {
                    background: "#f1f5f9",
                  },
                  "&.Mui-focused": {
                    background: "white",
                    boxShadow: "0 0 0 2px rgba(102, 126, 234, 0.2)",
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid rgba(0,0,0,0.1)",
                },
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "rgba(102, 126, 234, 0.5)",
                  },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#667eea",
                  },
              }}
            />
            <IconButton
              onClick={sendMessage}
              disabled={isLoading || !message.trim()}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                width: 48,
                height: 48,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                },
                "&:disabled": {
                  background: "#e0e0e0",
                  color: "#9e9e9e",
                  transform: "none",
                  boxShadow: "none",
                },
                transition: "all 0.3s ease",
              }}
            >
              <SendIcon />
            </IconButton>
          </Stack>

          {isLoading && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                marginTop: 1,
                color: "text.secondary",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            >
              AI is thinking...
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
