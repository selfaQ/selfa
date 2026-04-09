// Toast notification — slides down from top, auto-hides after 2.5s

import { useEffect, useState } from "react";

export default function Toast({ message, visible }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible && message) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 2500);
      return () => clearTimeout(t);
    }
  }, [visible, message]);

  return (
    <div style={{
      position: "fixed",
      top: show ? 24 : -80,
      left: "50%",
      transform: "translateX(-50%)",
      background: "#18171C",
      color: "#fff",
      padding: "12px 24px",
      borderRadius: 14,
      fontSize: 14,
      fontWeight: 600,
      fontFamily: "Cairo, sans-serif",
      zIndex: 9999,
      transition: "top 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      whiteSpace: "nowrap",
      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      maxWidth: "90vw",
    }}>
      {message}
    </div>
  );
}
