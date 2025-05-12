import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import './App.css';

export default function App() {
  const [label, setLabel]                 = useState('yourcoworker asked');
  const [text, setText]                   = useState(
    'What tools or practices have you found most effective for managing feature flagging and production?'
  );

  const [bgColor, setBgColor]             = useState('#ffffff');
  const [textColor, setTextColor]         = useState('#000000');
  const [borderRadius, setBorderRadius]   = useState(32);
  const [padding, setPadding]             = useState(35);

  const [fontFamily, setFontFamily]       = useState('Inter, sans-serif');
  const [labelFontSize, setLabelFontSize] = useState(27);
  const [textFontSize, setTextFontSize]   = useState(48);
  const [labelFontWeight, setLabelFontWeight] = useState('400');
  const [textFontWeight, setTextFontWeight]   = useState('600');

  const [labelTracking, setLabelTracking] = useState(0.015);
  const [textTracking, setTextTracking]   = useState(0);

  const [avatar, setAvatar]               = useState('/default-avatar.png');
  const [avatarSize, setAvatarSize]       = useState(80);
  const [avatarSpacing, setAvatarSpacing] = useState(27);

  const previewRef = useRef();
  const tailSize = padding;

    // --- useEffect Hook to set Title and Favicon ---
    useEffect(() => {
      // 1. Set the document title
      const newTitle = 'Chat Bubble Generator'; // <-- Change your desired title here
      document.title = newTitle;
  
      // 2. Set the favicon
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      // Option A: Use an emoji as a favicon (simple, no external file needed)
      const emojiFavicon = "💬"; // <-- Change your desired emoji here
      const canvas = document.createElement('canvas');
      canvas.height = 64;
      canvas.width = 64;
      const ctx = canvas.getContext('2d');
      ctx.font = '48px serif';
      ctx.fillText(emojiFavicon, 8, 50); // Adjust positioning if needed
      link.href = canvas.toDataURL();
  
      // Option B: Use a URL to your favicon image (replace with your actual URL)
      // const faviconUrl = 'YOUR_FAVICON_URL.png'; // <-- Put your favicon URL here
      // link.href = faviconUrl;
  
    }, []); // Empty dependency array ensures this runs only once on mount

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => setAvatar(evt.target.result);
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    document.fonts.ready.then(() => {
      toPng(previewRef.current, { cacheBust: true, backgroundColor: null })
        .then(dataUrl => {
          const link = document.createElement('a');
          link.download = 'chat-bubble.png';
          link.href = dataUrl;
          link.click();
        })
        .catch(err => console.error('Export failed:', err));
    });
  };

  return (
    <div className="app-container">
      {/* PREVIEW */}
      <div className="preview">
        <div
          className="capture"
          ref={previewRef}
          style={{ paddingBottom: `${tailSize}px` }}
        >
          <div
            className="bubble"
            style={{
              backgroundColor: bgColor,
              color: textColor,
              borderRadius: `${borderRadius}px`,
              padding: `${padding}px`,
              fontFamily,
              fontSize: `${textFontSize}px`,
              fontWeight: textFontWeight,
              letterSpacing: `${textTracking}em`,
              maxWidth: '60vw',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.4,
            }}
          >
            <div
              className="label"
              style={{
                fontFamily,
                fontSize: `${labelFontSize}px`,
                fontWeight: labelFontWeight,
                letterSpacing: `${labelTracking}em`,
                color: '#7a7d85',
                marginBottom: '8px',
                marginLeft: avatar ? `${avatarSize + avatarSpacing}px` : 0,
              }}
            >
              {label}
            </div>

            <div
              className="message-row"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: `${avatarSpacing}px`,
              }}
            >
              <img
                src={avatar}
                alt="avatar"
                className="avatar-img"
                style={{
                  width: `${avatarSize}px`,
                  height: `${avatarSize}px`,
                }}
              />
              <div className="text-content">
                {text.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>

          <svg
            width={tailSize}
            height={tailSize}
            className="speech-tail"
            style={{
              left: `${borderRadius}px`,
            }}
          >
            <polygon
              points={`0,0 ${tailSize},0 0,${tailSize}`}
              fill={bgColor}
            />
          </svg>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="controls-panel">
        <div className="control-group">
          <h3>Content</h3>
          <label>Label</label>
          <input
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
          />
          <label>Message</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </div>

        <div className="control-group">
          <h3>Appearance</h3>
          <label>Bubble Background</label>
          <input
            type="color"
            value={bgColor}
            onChange={e => setBgColor(e.target.value)}
          />
          <label>Message Text Color</label>
          <input
            type="color"
            value={textColor}
            onChange={e => setTextColor(e.target.value)}
          />
          <label>Border Radius ({borderRadius}px)</label>
          <input
            type="range"
            min="0"
            max="64"
            value={borderRadius}
            onChange={e => setBorderRadius(+e.target.value)}
          />
          <label>Padding ({padding}px)</label>
          <input
            type="range"
            min="8"
            max="64"
            value={padding}
            onChange={e => setPadding(+e.target.value)}
          />
        </div>

        <div className="control-group">
          <h3>Typography</h3>
          <label>Font Family</label>
          <select
            value={fontFamily}
            onChange={e => setFontFamily(e.target.value)}
          >
            <option value="Inter, sans-serif">Inter</option>
            <option value="Roboto, sans-serif">Roboto</option>
            <option value="Arial, sans-serif">Arial</option>
          </select>

          <label>Label Font Size ({labelFontSize}px)</label>
          <input
            type="range"
            min="8"
            max="32"
            value={labelFontSize}
            onChange={e => setLabelFontSize(+e.target.value)}
          />
          <label>Label Font Weight</label>
          <select
            value={labelFontWeight}
            onChange={e => setLabelFontWeight(e.target.value)}
          >
            <option value="400">Regular</option>
            <option value="500">Medium</option>
            <option value="600">Semi Bold</option>
            <option value="700">Bold</option>
            <option value="800">Extra Bold</option>
            <option value="900">Black</option>
          </select>
          <label>Label Tracking ({labelTracking}em)</label>
          <input
            type="range"
            step="0.005"
            min="0"
            max="0.1"
            value={labelTracking}
            onChange={e => setLabelTracking(+e.target.value)}
          />

          <label>Message Text Size ({textFontSize}px)</label>
          <input
            type="range"
            min="12"
            max="48"
            value={textFontSize}
            onChange={e => setTextFontSize(+e.target.value)}
          />
          <label>Message Text Weight</label>
          <select
            value={textFontWeight}
            onChange={e => setTextFontWeight(e.target.value)}
          >
            <option value="400">Regular</option>
            <option value="500">Medium</option>
            <option value="600">Semi Bold</option>
            <option value="700">Bold</option>
            <option value="800">Extra Bold</option>
            <option value="900">Black</option>
          </select>
          <label>Message Text Tracking ({textTracking}em)</label>
          <input
            type="range"
            step="0.005"
            min="0"
            max="0.1"
            value={textTracking}
            onChange={e => setTextTracking(+e.target.value)}
          />
        </div>

        <div className="control-group">
          <h3>Avatar</h3>
          <label>Size ({avatarSize}px)</label>
          <input
            type="range"
            min="24"
            max="80"
            value={avatarSize}
            onChange={e => setAvatarSize(+e.target.value)}
          />
          <label>Spacing ({avatarSpacing}px)</label>
          <input
            type="range"
            min="0"
            max="64"
            value={avatarSpacing}
            onChange={e => setAvatarSpacing(+e.target.value)}
          />
          <label>Upload</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        <div className="control-group export-group">
          <button className="download-btn" onClick={handleDownload}>
            Download Bubble
          </button>
        </div>
        <div className="attribution">
          Made with ❤️ by {'Dawood'}
        </div>
      </div>
    </div>
  );
}
