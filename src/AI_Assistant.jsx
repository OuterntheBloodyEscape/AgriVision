import React from "react";
import './AI_Assistant.css'
import AIlogo from './assets/Agribuddy-logo.png'
import image from './assets/image.png'
import newChat from './assets/new-chat.png'
import searchLogo from './assets/search-logo.png'
import sidebar from './assets/sidebar.png'
import voicesearch from './assets/voice.png'
import deepresearch from './assets/Deep_research.png'
import attachfile from './assets/attach-file.png'

function AI_Assistant() {
  return (
    <>
      <div className="AI-Assistant-page-container">
        <div className="sidebar">
          <div className="sidebar-things">
            <button className="sidebar-button">
              <img className="sidebar-logo-size" src={sidebar} alt="AI-Assistant-logo" />
              <span className="AI-Assistant-tooltip">
                Open sidebar
              </span>
            </button>

            <button className="sidebar-button">
              <img className="sidebar-logo-size" src={newChat} alt="new-chat-logo" />
              <span className="AI-Assistant-tooltip">
                New chat
              </span>
            </button>


            <button className="sidebar-button">
              <img className="sidebar-logo-size" src={searchLogo} alt="search-logo" />
              <span className="AI-Assistant-tooltip">
                Search chats
              </span>
            </button>


            <button className="sidebar-button">
              <img className="sidebar-logo-size" src={image} alt="image-logo" />
              <span className="AI-Assistant-tooltip">
                Images
              </span>
            </button>

          </div>

        </div>

        <div className="aia-search-container">
          <div className="chatbot-pic">
            <img className="edit-AI-logo" src={AIlogo} alt="AI-logo" />
          </div>
          <div className="welcome-text">
            Hello there!
          </div>
          <div className="how">
            How can I assist you today?
          </div>
          <div className="ai-search-box">
            <div className="search-box-first-line">
              <textarea className="edit-textarea" type="text" placeholder="Ask me anything..." />
              <button className="voice-search-icon-button">
                 <img className="edit-voice-search-icon" src={voicesearch} alt="search-with-voice" />
                 <span className="vsib-tooltip">
                   Voice search
                 </span>
              </button>
              
            </div>

            <div className="search-box-last-line">
                <button className="deep-research-button">
                  <img className="deep-research-icon-edit" src={deepresearch} alt="deep-research-icon" />
                  Deep Research
                </button>

                <button className="attach-file-button">
                   <img className="attach-file-icon-edit" src={attachfile} alt="attach-file-icon"/>
                   Attach files
                </button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default AI_Assistant
