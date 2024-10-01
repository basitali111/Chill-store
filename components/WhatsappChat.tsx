"use client"
import React, { useState, useEffect } from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import "./WhatsappChat.css"; // Import the CSS file

const WhatsappChat = () => {
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Set a timer to show the WhatsApp chat button after 5 seconds
    const timer = setTimeout(() => {
      setShowChat(true);
    }, 3000); // 5000ms = 5 seconds

    // Cleanup timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {showChat && (
        <FloatingWhatsApp
          phoneNumber="+923194028899"
          accountName="Kensin Store"
          statusMessage={"We're here to help! Expect a reply within the hour."}
          avatar={`/images/kensin.png`}
          chatMessage="Hi! 😊 We love helping out! What can we do for you today?"
          darkMode={true}
          className="custom-whatsapp-chat" // Apply custom class name
        />
      )}
    </div>
  );
};

export default WhatsappChat;
