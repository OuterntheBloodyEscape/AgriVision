import React, { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import "./AI_Assistant.css";
import AIlogo from "./assets/Agribuddy-logo.png";
import image from "./assets/image.png";
import newChat from "./assets/new-chat.png";
import searchLogo from "./assets/search-logo.png";
import sidebar from "./assets/sidebar.png";
import voicesearch from "./assets/voice.png";
import deepresearch from "./assets/Deep_research.png";
import deepresearchwhite from "./assets/Deep_research-recolored.png";
import attachfile from "./assets/attach-file.png";

/*
  ⚠️ SECURITY NOTE
  --------------------------------------------------------------
  Never hardcode API keys in frontend source. Anything shipped to
  the browser is visible to every visitor via devtools/network tab.

  1. Put your key in a `.env` file at the project root (never commit it):
       VITE_GEMINI_API_KEY=your_new_key_here
  2. Add `.env` to your .gitignore.
  3. For a real production app, proxy these calls through your own
     backend so the key never reaches the browser at all.

  If you previously pasted a key anywhere public (chat, GitHub, etc.),
  treat it as compromised and generate a new one in Google AI Studio.
*/
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const TEXT_MODEL = "gemini-2.5-flash";
const MAX_ATTACHMENTS = 6;
const MAX_RETRIES = 3;

// Small helper: turn a File into a base64 string + mime type Gemini can read
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Wraps a Gemini call with retry + backoff, and turns quota errors into a
// friendly message instead of a raw stack trace.
async function callGeminiWithRetry(requestFn) {
  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await requestFn();
    } catch (err) {
      lastError = err;
      const message = err?.message || "";
      const is429 = message.includes("429") || message.includes("RESOURCE_EXHAUSTED");

      if (is429) {
        // Try to read the server-suggested retry delay, otherwise back off.
        const retryMatch = message.match(/"retryDelay":"(\d+)s"/);
        const waitSeconds = retryMatch ? parseInt(retryMatch[1], 10) : (attempt + 1) * 3;

        if (attempt < MAX_RETRIES) {
          await sleep(waitSeconds * 1000);
          continue;
        }
        throw new Error(
          "QUOTA_EXCEEDED: You've hit today's free-tier request limit for this model. " +
          "This isn't a bug — Google's free tier caps requests per day. Wait for the quota " +
          "to reset, or enable billing on your Google AI Studio project for higher limits."
        );
      }

      // Non-quota errors: don't retry, surface immediately.
      throw err;
    }
  }
  throw lastError;
}

function AI_Assistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("Thinking...");

  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageTab, setImageTab] = useState("generated");

  const [isDeepResearch, setIsDeepResearch] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState([]); // images attached to the message being composed

  const chatBottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setActiveModal(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const nowLabel = () =>
    new Date().toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const handleToggleSidebar = () => setIsExpanded(!isExpanded);

  const handleNewChat = () => {
    setPromptText("");
    setMessages([]);
    setPendingAttachments([]);
    setActiveModal(null);
  };

  const handleOpenSearch = () => {
    setSearchQuery("");
    setActiveModal("search");
  };

  const handleOpenImages = () => {
    setImageTab("generated");
    setActiveModal("images");
  };

  const handleCloseModal = () => setActiveModal(null);

  // ---------- Image generation (Pollinations.ai — free, no API key needed) ----------
  // Returns a direct image URL for a generated image of the given prompt.
  function buildGeneratedImageUrl(prompt) {
    const seed = Math.floor(Math.random() * 1_000_000);
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=768&seed=${seed}&nologo=true`;
  }

  function detectVisualRequest(text) {
    const lower = text.toLowerCase();
    return (
      lower.includes("picture") ||
      lower.includes("photo") ||
      lower.includes("show me") ||
      lower.includes("image") ||
      lower.includes("draw") ||
      lower.includes("generate a") ||
      lower.includes("generate an") ||
      lower.includes("view of")
    );
  }

  function extractSubject(text) {
    const cleaned = text
      .replace(/show me|pictures? of|photos? of|images? of|draw (a|an|me)?|generate (a|an)?|can you see|give me/gi, "")
      .trim();
    return cleaned || text;
  }

  // ---------- Attach files ----------
  const handleAttachClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // allow re-selecting the same file later

    if (files.length === 0) return;

    const availableSlots = MAX_ATTACHMENTS - pendingAttachments.length;
    if (availableSlots <= 0) {
      alert(`You can attach up to ${MAX_ATTACHMENTS} images per message.`);
      return;
    }

    const filesToUse = files.slice(0, availableSlots);
    const newAttachments = await Promise.all(
      filesToUse.map(async (file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        previewUrl: URL.createObjectURL(file),
        base64: await fileToBase64(file),
        mimeType: file.type || "image/png",
      }))
    );

    setPendingAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removePendingAttachment = (id) => {
    setPendingAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((a) => a.id !== id);
    });
  };

  const removeGalleryImage = (id, type) => {
    if (type === "generated") {
      setGeneratedImages((prev) => prev.filter((img) => img.id !== id));
    } else {
      setUploadedImages((prev) => prev.filter((img) => img.id !== id));
    }
  };

  // ---------- Deep Research ----------
  // Runs a small multi-step research pass: outline subtopics, research each
  // with Google Search grounding enabled, then synthesize a final answer.
  async function runDeepResearch(topic) {
    setLoadingLabel("Planning research...");

    const outlineResp = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: TEXT_MODEL,
        contents: `Break this research topic into 3 focused sub-questions, one per line, no numbering or extra text: "${topic}"`,
      })
    );

    const subQuestions = (outlineResp.text || "")
      .split("\n")
      .map((line) => line.replace(/^[-*\d.]+\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 3);

    const findings = [];
    for (const question of subQuestions.length ? subQuestions : [topic]) {
      setLoadingLabel(`Researching: ${question}`);
      try {
        const resp = await callGeminiWithRetry(() =>
          ai.models.generateContent({
            model: TEXT_MODEL,
            contents: question,
            config: { tools: [{ googleSearch: {} }] }, // grounds the answer in live search results
          })
        );
        findings.push(`### ${question}\n${resp.text || "No information found."}`);
      } catch (err) {
        findings.push(`### ${question}\n_Could not complete this part: ${err.message}_`);
      }
    }

    setLoadingLabel("Writing final report...");
    const synthesisResp = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: TEXT_MODEL,
        contents:
          `Write a clear, well-organized research summary on "${topic}" using the findings below. ` +
          `Use headers and keep it readable, cite key facts.\n\n${findings.join("\n\n")}`,
      })
    );

    return synthesisResp.text || findings.join("\n\n");
  }

  // ---------- Send ----------
  const handleSendPrompt = async () => {
    const trimmedText = promptText.trim();
    if ((trimmedText === "" && pendingAttachments.length === 0) || loading) return;

    if (!ai) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "No API key found. Add `VITE_GEMINI_API_KEY` to your `.env` file and restart the dev server." },
      ]);
      return;
    }

    const currentDate = nowLabel();
    const attachmentsForMessage = pendingAttachments;

    const userMessage = {
      sender: "user",
      text: trimmedText,
      attachments: attachmentsForMessage.map((a) => a.previewUrl),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Save uploads into the permanent "Uploaded Images" gallery
    if (attachmentsForMessage.length > 0) {
      setUploadedImages((prev) => [
        ...attachmentsForMessage.map((a) => ({
          id: a.id,
          title: a.name,
          url: a.previewUrl,
          date: currentDate,
        })),
        ...prev,
      ]);
    }

    setChatHistory((prev) => [{ id: Date.now(), title: trimmedText || "Image message", date: currentDate }, ...prev]);

    setPromptText("");
    setPendingAttachments([]);
    setLoading(true);
    setLoadingLabel(isDeepResearch ? "Starting deep research..." : "Thinking...");

    try {
      let aiAnswer;

      if (isDeepResearch && trimmedText) {
        aiAnswer = await runDeepResearch(trimmedText);
      } else {
        const parts = [{ text: trimmedText || "Describe this image." }];
        attachmentsForMessage.forEach((a) => {
          parts.push({ inlineData: { mimeType: a.mimeType, data: a.base64 } });
        });

        const response = await callGeminiWithRetry(() =>
          ai.models.generateContent({
            model: TEXT_MODEL,
            contents: [{ role: "user", parts }],
          })
        );
        aiAnswer = response.text || "No response received.";
      }

      // Detect image requests only in non-research mode
      if (!isDeepResearch && trimmedText && detectVisualRequest(trimmedText)) {
        setLoadingLabel("Generating image...");
        const subject = extractSubject(trimmedText);
        const visualUrl = buildGeneratedImageUrl(subject);
        aiAnswer += `\n\n![Generated: ${subject}](${visualUrl})`;

        setGeneratedImages((prev) => [
          { id: Date.now(), title: trimmedText, url: visualUrl, date: currentDate },
          ...prev,
        ]);
      }

      setMessages((prev) => [...prev, { sender: "ai", text: aiAnswer }]);
    } catch (error) {
      console.error("Error communicating with Gemini API:", error);
      const friendly = error.message?.startsWith("QUOTA_EXCEEDED")
        ? error.message.replace("QUOTA_EXCEEDED: ", "")
        : "Something went wrong talking to Gemini. Check your network connection and API key, then try again.";
      setMessages((prev) => [...prev, { sender: "ai", text: friendly }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDownSubmit = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  const filteredHistory = chatHistory.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="AI-Assistant-page-container">
        {/* Sidebar */}
        <div className={`sidebar ${isExpanded ? "expanded" : ""}`}>
          <div className="sidebar-things">
            <button className="sidebar-button" onClick={handleToggleSidebar}>
              <img className="sidebar-logo-size" src={sidebar} alt="Toggle sidebar" />
              {isExpanded && <span className="sidebar-label">Close sidebar</span>}
            </button>

            <button className="sidebar-button" onClick={handleNewChat}>
              <img className="sidebar-logo-size" src={newChat} alt="New chat" />
              {isExpanded && <span className="sidebar-label">New chat</span>}
            </button>

            <button className={`sidebar-button ${activeModal === "search" ? "active-nav" : ""}`} onClick={handleOpenSearch}>
              <img className="sidebar-logo-size" src={searchLogo} alt="Search chats" />
              {isExpanded && <span className="sidebar-label">Search chats</span>}
            </button>

            <button className={`sidebar-button ${activeModal === "images" ? "active-nav" : ""}`} onClick={handleOpenImages}>
              <img className="sidebar-logo-size" src={image} alt="Images" />
              {isExpanded && <span className="sidebar-label">Images</span>}
            </button>
          </div>
        </div>

        {/* Main area */}
        <div className={`aia-search-container ${messages.length === 0 ? "centered" : ""}`}>
          <div className="chat-stream-container">
            {messages.length === 0 ? (
              <div className="empty-state">
                <div className="chatbot-pic">
                  <img className="edit-AI-logo" src={AIlogo} alt="AI-logo" />
                </div>
                <div className="welcome-text">Hello there!</div>
                <div className="how">How can I assist you today?</div>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div key={index} className={`chat-message-row ${msg.sender}`}>
                    <div className={`chat-bubble ${msg.sender}`}>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="message-attachments">
                          {msg.attachments.map((url, i) => (
                            <img key={i} src={url} alt="attachment" />
                          ))}
                        </div>
                      )}
                      {msg.text && <ReactMarkdown>{msg.text}</ReactMarkdown>}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="chat-message-row ai">
                    <div className="chat-bubble ai loading-bubble">
                      <span className="loading-dot" />
                      {loadingLabel}
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Fixed search box */}
          <div className="ai-search-box">
            {pendingAttachments.length > 0 && (
              <div className="pending-attachments-row">
                {pendingAttachments.map((a) => (
                  <div key={a.id} className="pending-attachment">
                    <img src={a.previewUrl} alt={a.name} />
                    <button className="remove-attachment-btn" onClick={() => removePendingAttachment(a.id)}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="search-box-first-line">
              <textarea
                className="edit-textarea"
                placeholder={
                  isDeepResearch
                    ? "Enter a topic for deep research (Press Enter)"
                    : "Ask me about anything (Press Enter)"
                }
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={handleKeyDownSubmit}
                disabled={loading}
              />
              <button className="voice-search-icon-button">
                <img className="edit-voice-search-icon" src={voicesearch} alt="Voice search" />
              </button>
            </div>

            <div className="search-box-last-line">
              <div className="left-actions">
                <button
                  className={`deep-research-button ${isDeepResearch ? "active-toggle" : ""}`}
                  onClick={() => setIsDeepResearch((v) => !v)}
                  title="Toggle deep research mode"
                >
                  <img
                    className="deep-research-icon-edit"
                    src={isDeepResearch ? deepresearchwhite : deepresearch}
                    alt="Deep research"
                  />
                  Deep Research{isDeepResearch ? " " : ""}
                </button>

                <button className="attach-file-button" onClick={handleAttachClick}>
                  <img className="attach-file-icon-edit" src={attachfile} alt="Attach files" />
                  Attach files
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>

              <button className="submit-prompt-button" onClick={handleSendPrompt} disabled={loading}>
                {loading ? "Working..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH CHATS MODAL */}
      {activeModal === "search" && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Search Your Chats</h3>
              <button className="close-modal-btn" onClick={handleCloseModal}>✕</button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="modal-search-input"
                placeholder="Type to filter history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <div className="history-list">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <div key={item.id} className="history-item" onClick={handleCloseModal}>
                      <span className="history-title">💬 {item.title}</span>
                      <span className="history-date">{item.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-results">No chats found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMAGES GALLERY MODAL */}
      {activeModal === "images" && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Media Gallery</h3>
              <button className="close-modal-btn" onClick={handleCloseModal}>✕</button>
            </div>
            <div className="image-modal-tabs">
              <button className={`tab-btn ${imageTab === "generated" ? "active-tab" : ""}`} onClick={() => setImageTab("generated")}>
                Generated Images ({generatedImages.length})
              </button>
              <button className={`tab-btn ${imageTab === "uploaded" ? "active-tab" : ""}`} onClick={() => setImageTab("uploaded")}>
                Uploaded Images ({uploadedImages.length})
              </button>
            </div>
            <div className="modal-body">
              <div className="image-grid">
                {(imageTab === "generated" ? generatedImages : uploadedImages).map((img) => (
                  <div key={img.id} className="image-card">
                    <button
                      className="delete-image-btn"
                      onClick={() => removeGalleryImage(img.id, imageTab)}
                      title="Delete image"
                    >
                      ✕
                    </button>
                    <img src={img.url} alt={img.title} />
                    <span className="img-title">{img.title}</span>
                    <span className="img-date">{img.date}</span>
                  </div>
                ))}
                {(imageTab === "generated" ? generatedImages : uploadedImages).length === 0 && (
                  <p className="no-results full-width">No images yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AI_Assistant;
