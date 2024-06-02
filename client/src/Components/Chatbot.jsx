import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css"; // Import your CSS file for styling

import axios from "axios";

import {
  IoIosArrowDropup,
  IoIosArrowDropdown,
  IoIosSend,
} from "react-icons/io";
import { IoMicSharp, IoStopSharp, IoArrowDown } from "react-icons/io5";

const API_URL =
  // "https://api-inference.huggingface.co/models/openai/whisper-large-v3";
  "https://api-inference.huggingface.co/models/openai/whisper-base";

const HEADERS = {
  Authorization: "Bearer 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",
};

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState(null);

  // const [context, setContext] = useState("");
  const [transcription, setTranscription] = useState("");

  const [loading, setLoading] = useState(false);
  const messageContainerRef = useRef(null);
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  


  const context=`Welcome to the Support Chatbot!

  Im here to help you with any issues or concerns you might have. Please provide a brief description of the problem you're experiencing, and I will guide you through the process to get it resolved by the right department.
  
  User: I need to report a malfunctioning streetlight on Oak Street.
  
  Bot: Thank you for reporting this. Can you specify the exact location on Oak Street and when you noticed the malfunction?
  
  User: The streetlight near 45 Oak Street has been out for three days.
  
  Bot: This issue will be forwarded to the electrical department. Your reference number is E234567. They will address the problem within 24 hours.
  
  User: The streetlight is still not fixed. It’s been over a day.
  
  Bot: We apologize for the inconvenience. The repair team has been dispatched and the issue should be resolved by the end of today.
  
  User: It's been two days now, and the streetlight is still not fixed.
  
  Bot: I'm really sorry to hear that. I will escalate this issue to the supervisor in the electrical department. Your updated reference number is E234567-2. They will prioritize this issue and ensure it is fixed as soon as possible.
  
  User: Thank you. I'll wait for the update.
  
  Bot: You're welcome. We appreciate your patience. Please let us know if the streetlight is not fixed by tomorrow, and we will take further action.
  
  User: The streetlight has finally been fixed. Thank you for your assistance.
  
  Bot: I'm glad to hear that the issue has been resolved. If you have any other concerns, feel free to reach out. Have a great day!
  
  Another Example:
  
  User: The water pressure in my apartment is very low.
  
  Bot: I’m sorry to hear about the issue. Can you provide your apartment number and how long you’ve been experiencing this problem?
  
  User: I live in apartment 12B, and the water pressure has been low for the past week.
  
  Bot: Thank you for the details. This issue will be forwarded to the plumbing department. Your reference number is P345678. They will inspect and fix the issue within 48 hours.
  
  User: It's been three days, and the water pressure issue still persists.
  
  Bot: We apologize for the delay. The plumbing team has been notified again and they will visit your apartment today.
  
  User: Thank you for your prompt response.
  
  Bot: You’re welcome. Please let us know if the issue is not resolved by the end of the day.
  
  User: The plumber came and fixed the issue. Thanks for your help!
  
  Bot: I’m glad to hear that. If you need any further assistance, feel free to reach out. Have a great day!
  
  Another Example:
  
  User: There is a broken bench in the park near my house.
  
  Bot: Thank you for letting us know. Can you specify the exact location of the bench in the park and when you noticed it was broken?
  
  User: The bench is near the playground in Maple Park, and it's been broken for about a week.
  
  Bot: This issue will be forwarded to the parks department. Your reference number is P567890. They will repair or replace the bench within 72 hours.
  
  User: It's been four days, and the bench is still broken.
  
  Bot: We apologize for the delay. The parks department has been notified again and they will prioritize the repair. It should be fixed by tomorrow.
  
  User: Thank you. I appreciate the follow-up.
  
  Bot: You’re welcome. Please let us know if the bench is not fixed by the end of tomorrow.
  
  User: The bench has been fixed. Thank you for your assistance.
  
  Bot: I’m glad to hear that. If you need any further help, feel free to contact us. Have a great day!
  
  `
  const getAnswerLLM = async (data) => {
    // const BASE_URL="http://localhost:5000/api/v1"
  const BASE_URL="https://ai-based-grievance-portal.onrender.com/api/v1"

    try {
      const token=localStorage.getItem("token");
      // Send message to the server
      const response = await fetch(
        `${BASE_URL}/chat/message`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: data }),
        }
      );

      const res = await response.json();
      return { answer: res.reply };
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  };

  function removeAsterisks(message) {
    return message.replace(/\*/g, ""); // This regex replaces all occurrences of '*' with an empty string
  }

  const handleMessageSend = async () => {
    let response;
    setLoading(true);
    if (audioData) {
      setAudioData(null);
    }

    if (transcription.trim() !== "") {
      // Prepare payload for query
      const payload = {
        inputs: {
          question: `from provided context, answer under what section the following crime comes : ${transcription} ?`,
          context: context,
          wait_for_model: true,
        },
      };

      const responseByBot = await getAnswerLLM(
        `from provided context ${context} , reply according to that and ask follow up questions if need and resolve user query. here is query or question ${transcription}`
      );
      console.log(responseByBot);
      setMessages([
        ...messages,
        { type: "text", data: +"🧑 " + transcription, sender: "user" },
        {
          type: "text",
          data: "🤖 " + removeAsterisks(responseByBot.answer),
          sender: "bot",
        },
      ]);
      setTranscription("");
      setInputValue("");
      setLoading(false);
    } else if (inputValue.trim() !== "") {
      const payload = {
        inputs: {
          question: `from provided context, answer under what section the following crime comes : ${inputValue} ?`,
          context: context,
          wait_for_model: true,
        },
      };

      const responseByBot = await getAnswerLLM(
        `from provided context ${context} , reply according to that and ask follow up questions if needed and resolve your query. here is query or question ${inputValue}`
      );

      setMessages([
        ...messages,
        { type: "text", data: "🧑 " + inputValue, sender: "user" },
        {
          type: "text",
          data: "🤖 " + removeAsterisks(responseByBot.answer),
          sender: "bot",
        },
      ]);
      setInputValue("");
      setTranscription("");
      setLoading(false);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleMessageSend();
    }
  };

  const toggleChatbot = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const handleAudioToText = async (audioBlob) => {
    setLoading(true); // Set loading to true when data is being sent
    const audioFile = audioBlob;
    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/transcribe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // withCredentials: true  // Include this line to send cookies and credentials
        }
      );

      setInputValue(response.data.transcription); //show in input box also
    } catch (error) {
      console.error("Error transcribing audio:", error);
    } finally {
      setLoading(false); // Set loading to false when data is received (whether successful or error)
    }
  };
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };
      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(recordedBlob);
        setAudioData(url);
        chunks.current = [];
        handleAudioToText(recordedBlob);
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    setLoading(true);
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }

    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
    setIsRecording(false);
    setLoading(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chatbot">
      {!isExpanded && (
        <button className="toggle-button" onClick={toggleChatbot}>
          <span className="robot-icon">🤖</span>
          <span>Chat</span>
        </button>
      )}
      {isExpanded && (
        <>
          <div className="collapse-icon" onClick={toggleChatbot}>
            <span>
              <IoIosArrowDropdown />
            </span>
          </div>
          <div className="chatbot-expanded">
            <div
              className="message-container scrollBar"
              ref={messageContainerRef}
            >
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <div key={index} className={`message ${message.sender}`}>
                    {message.type === "text" && <span>{message.data}</span>}
                    {message.type === "audio" && (
                      <audio controls src={message.data} />
                    )}
                    {message.type === "video" && (
                      <video controls src={message.data} />
                    )}
                    {message.type === "image" && (
                      <img src={message.data} alt="image" />
                    )}
                  </div>
                ))
              ) : (
                <p>Type here or tap the mic to start chatting!</p>
              )}
            </div>

            <div className="input-container">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              {loading && (
                <button>
                  <span className="loader"></span>
                </button>
              )}
              {isRecording && (
                <button onClick={toggleRecording}>
                  <IoStopSharp />
                </button>
              )}
              {inputValue.trim() !== "" && !isRecording && !loading && (
                <button onClick={handleMessageSend}>
                  <IoIosSend />
                </button>
              )}
              {inputValue.trim() === "" && !isRecording && !loading && (
                <button onClick={toggleRecording}>
                  <IoMicSharp />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Chatbot;
