import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect
} from 'react';
import { toPng } from 'html-to-image';
import './App.css';

export default function App() {
  // CONTENT
  const [label, setLabel]   = useState('yourcoworker asked');
  const [text, setText]     = useState('The quick brown fox jumps over the lazy dog.');

  // APPEARANCE
  const [bgColor, setBgColor]           = useState('#ffffff');
  const [textColor, setTextColor]       = useState('#000000');
  const [labelTextColor, setLabelTextColor] = useState('#7a7d85');
  const [borderRadius, setBorderRadius] = useState(32);
  const [padding, setPadding]           = useState(35);
  const [borderWidth, setBorderWidth]   = useState(0);
  const [borderColor, setBorderColor]   = useState('#ffffff');

  // TYPOGRAPHY
  const [fontFamily, setFontFamily]         = useState('Inter, sans-serif');
  const [labelFontSize, setLabelFontSize]   = useState(27);
  const [textFontSize, setTextFontSize]     = useState(48);
  const [labelFontWeight, setLabelFontWeight] = useState('400');
  const [textFontWeight, setTextFontWeight]   = useState('600');
  const [labelTracking, setLabelTracking]   = useState(0.0015);
  const [textTracking, setTextTracking]     = useState(0);

  // AVATAR
  const [avatar, setAvatar]           = useState('/default-avatar.png');
  const [avatarSize, setAvatarSize]   = useState(80);
  const [avatarSpacing, setAvatarSpacing] = useState(27);

  // WRAPPING
  const [wordsPerLine, setWordsPerLine] = useState(4);

  // TAIL POSITION
  const [tailOffset, setTailOffset] = useState(0);  // 0 = flush left, 1 = flush right

  // REFS & SIZING
  const bubbleContentRef = useRef();
  const previewRef       = useRef();
  const [bubbleSize, setBubbleSize] = useState({ w: 0, h: 0 });
  const tailSize = padding;

  // split into lines
  const words = text.trim().split(/\s+/);
  const lines = [];
  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(' '));
  }

  // COMPUTE TEXT & LABEL POSITIONS
  const textX = padding + (avatar ? avatarSize + avatarSpacing : 0);
  const lineHeight = 1.5;
  const labelMarginBottom = 20;
  const labelY = padding; // top padding
  const messageStartY = padding + labelFontSize + labelMarginBottom;
  
  // SVG dimensions
  const strokePad = borderWidth
  const svgWidth  = bubbleSize.w + strokePad * 2
  const svgHeight = bubbleSize.h + tailSize + strokePad * 2

  // measure bubble HTML
  useLayoutEffect(() => {
    if (bubbleContentRef.current) {
      const r = bubbleContentRef.current.getBoundingClientRect();
      setBubbleSize({ w: Math.ceil(r.width), h: Math.ceil(r.height) });
    }
  }, [
    label,
    lines.join('\n'),
    fontFamily,
    labelFontSize,
    textFontSize,
    avatarSize,
    avatarSpacing,
    padding,
    borderWidth,
    borderRadius
  ]);

  // compute tail tip X
  const tailX = borderRadius + tailOffset * (bubbleSize.w - 2 * borderRadius);

  // favicon
  useEffect(() => {
    document.title = 'Chat Bubble Generator';
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.font = '48px serif';
    ctx.fillText('💬', 8, 50);
    link.href = canvas.toDataURL();
  }, []);

  // avatar upload
  const handleImageUpload = e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = evt => setAvatar(evt.target.result);
    r.readAsDataURL(f);
  };

  // download
  const handleDownload = () => {
    document.fonts.ready.then(() => {
      toPng(previewRef.current, { cacheBust: true, backgroundColor: null })
        .then(dataUrl => {
          const a = document.createElement('a');
          a.download = 'chat-bubble.png';
          a.href = dataUrl;
          a.click();
        })
        .catch(console.error);
    });
  };

  return (
    <div className="app-container">
      {/* PREVIEW */}
      <div className="preview">
        {/* Hidden HTML bubble for measurement */}
        <div
          ref={bubbleContentRef}
          style={{ position: 'absolute', visibility: 'hidden', top: 0, left: 0 }}
        >
          {/* (unchanged hidden HTML for sizing) */}
          <div
            style={{
              backgroundColor: bgColor,
              color: textColor,
              borderRadius: `${borderRadius}px`,
              padding: `${padding}px`,
              fontFamily,
              fontSize: `${textFontSize}px`,
              fontWeight: textFontWeight,
              letterSpacing: `${textTracking}em`,
              lineHeight: 1.4,
              border: `${borderWidth}px solid ${borderColor}`,
              boxSizing: 'border-box',
              display: 'inline-block'
            }}
          >
            <div
              style={{
                fontFamily,
                fontSize: `${labelFontSize}px`,
                fontWeight: labelFontWeight,
                letterSpacing: `${labelTracking}em`,
                color: labelTextColor,
                marginBottom: labelMarginBottom,
                marginLeft: avatar ? avatarSize + avatarSpacing : 0
              }}
            >
              {label}
            </div>
            <div style={{ display: 'flex', gap: avatarSpacing, alignItems: 'flex-start' }}>
              <img
                src={avatar}
                alt=""
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: '50%'
                }}
              />
              <div>
                {lines.map((ln, i) => (
                  <p key={i} style={{ margin: 0 }}>{ln}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* The SVG bubble + tail */}
        {bubbleSize.w > 0 && (
          <svg
            ref={previewRef}
            width={svgWidth}
            height={svgHeight}
            viewBox={`-${strokePad} -${strokePad} ${svgWidth} ${svgHeight}`}
            style={{ overflow: 'visible' }}
          >
            {/* 1) STROKE PATH */}
            <path
              d={`
                M 0 ${borderRadius}
                A ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} 0
                H ${bubbleSize.w - borderRadius}
                A ${borderRadius} ${borderRadius} 0 0 1 ${bubbleSize.w} ${borderRadius}
                V ${bubbleSize.h - borderRadius}
                A ${borderRadius} ${borderRadius} 0 0 1 ${bubbleSize.w - borderRadius} ${bubbleSize.h}
                H ${tailX}
                L ${tailX + tailSize},${bubbleSize.h}
                L ${tailX},${bubbleSize.h + tailSize}
                L ${tailX},${bubbleSize.h}
                H ${borderRadius}
                A ${borderRadius} ${borderRadius} 0 0 1 0 ${bubbleSize.h - borderRadius}
                Z
              `}
              fill="none"
              stroke={borderColor}
              strokeWidth={borderWidth * 2}
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
            />

            {/* 2) FILL PATH */}
            <path
              d={`
                M 0 ${borderRadius}
                A ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} 0
                H ${bubbleSize.w - borderRadius}
                A ${borderRadius} ${borderRadius} 0 0 1 ${bubbleSize.w} ${borderRadius}
                V ${bubbleSize.h - borderRadius}
                A ${borderRadius} ${borderRadius} 0 0 1 ${bubbleSize.w - borderRadius} ${bubbleSize.h}
                H ${tailX}
                L ${tailX + tailSize},${bubbleSize.h}
                L ${tailX},${bubbleSize.h + tailSize}
                L ${tailX},${bubbleSize.h}
                H ${borderRadius}
                A ${borderRadius} ${borderRadius} 0 0 1 0 ${bubbleSize.h - borderRadius}
                Z
              `}
              fill={bgColor}
            />

            {/* 3) CONTENT as pure SVG */}
            {/* Label Text */}
            <text
              x={textX}
              y={labelY}
              fill={labelTextColor}
              fontFamily={fontFamily}
              fontSize={labelFontSize}
              fontWeight={labelFontWeight}
              letterSpacing={`${labelTracking}em`}
              dominantBaseline="text-before-edge"
            >
              {label}
            </text>

            {/* Avatar via foreignObject */}
            {avatar && (
              <foreignObject
                x={padding}
                y={messageStartY}
                width={avatarSize}
                height={avatarSize}
              >
                <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: avatarSize, height: avatarSize }}>
                  <img
                    src={avatar}
                    alt=""
                    style={{
                      width: avatarSize,
                      height: avatarSize,
                      borderRadius: '50%',
                      flexShrink: 0
                    }}
                  />
                </div>
              </foreignObject>
            )}

            {/* Message Text */}
            <text
              x={textX}
              y={messageStartY}
              fill={textColor}
              fontFamily={fontFamily}
              fontSize={textFontSize}
              fontWeight={textFontWeight}
              letterSpacing={`${textTracking}em`}
              dominantBaseline="text-before-edge"
            >
              {lines.map((line, i) => (
                <tspan key={i} x={textX} dy={i === 0 ? 0 : `${lineHeight}em`}>
                  {line}
                </tspan>
              ))}
            </text>
          </svg>
        )}
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
          <label>Label Text Color</label>
          <input
            type="color"
            value={labelTextColor}
            onChange={e => setLabelTextColor(e.target.value)}
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
            min="0"
            max="64"
            value={padding}
            onChange={e => setPadding(+e.target.value)}
          />
          {/* New Border Controls */}
          <label>Border Width ({borderWidth}px)</label>
          <input
            type="range"
            min="0"
            max="20"
            value={borderWidth}
            onChange={e => setBorderWidth(+e.target.value)}
          />
          <label>Border Color</label>
          <input
            type="color"
            value={borderColor}
            onChange={e => setBorderColor(e.target.value)}
          />
          <label>Tail Position ({Math.round(tailOffset*100)}%)</label>
          <input
            type="range"
            min="0"
            max="25"
            value={tailOffset*100}
            onChange={e => setTailOffset(e.target.value/100)}
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
            min="-0.015"
            max="0.1"
            value={textTracking}
            onChange={e => setTextTracking(+e.target.value)}
          />
        </div>
        {/* Wrapping */}
        <div className="control-group">
          <h3>Wrapping</h3>
          <label>Words per Line ({wordsPerLine})</label>
          <input
            type="range"
            min="1"
            max="10"
            value={wordsPerLine}
            onChange={e => setWordsPerLine(+e.target.value)}
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
