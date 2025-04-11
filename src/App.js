import React, { useState, useEffect, useRef } from "react";
import "./App.css"; // Optional, for any extra styling

// Basic stop words list
const stopWords = new Set([
  "the",
  "and",
  "is",
  "in",
  "of",
  "a",
  "to",
  "it",
  "that",
  "with",
  "for",
  "on",
  "as",
  "at",
  "by",
  "an",
]);

// Theme mapping based on vibes
const themes = {
  haunted: {
    fontFamily: "'Creepster', cursive", // Consider including Google Font 'Creepster' if desired
    color: "rgba(150, 0, 0, 0.8)",
    backgroundColor: "#2e2e2e",
  },
  default: {
    fontFamily: "Arial, sans-serif",
    color: "rgba(0, 0, 0, 0.8)",
    backgroundColor: "#ffffff",
  },
};

// Process the input text to calculate word frequencies
function processText(text) {
  // Split the text on non-word characters, lower-case everything, and filter out stop words
  const words = text
    .split(/\W+/)
    .map((word) => word.toLowerCase())
    .filter((word) => word && !stopWords.has(word));

  // Count occurrences
  const freq = {};
  words.forEach((word) => {
    freq[word] = (freq[word] || 0) + 1;
  });
  // Convert to array of [word, frequency] and sort descending
  const wordArray = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  return wordArray;
}

// Determine the theme by scanning for particular keywords in the frequency list
function determineTheme(wordFrequencies) {
  const keywords = ["haunted", "ghost", "spooky", "phantom"];
  for (let [word] of wordFrequencies) {
    if (keywords.includes(word)) {
      return "haunted";
    }
  }
  return "default";
}

function App() {
  const [query, setQuery] = useState("");
  const [text, setText] = useState("");
  const [wordFrequencies, setWordFrequencies] = useState([]);
  const [themeKey, setThemeKey] = useState("default");
  const canvasRef = useRef(null);

  // Simulated public domain texts mapping
  const texts = {
    Frankenstein:
      "It is on a dreary night of November that I beheld the accomplishment of my toils. The rain pattered dismally against the panes, and in the gloom I detected a shadow—a ghostly figure wandering through the fog—a haunting vision indeed.",
    Dracula:
      "From the evening shadows of Transylvania comes a tale so eerie, yet so compelling; the cursed and haunted castle stands as a beacon to those who dare glimpse a spirit from beyond.",
  };

  // Handle the search button click
  const handleSearch = () => {
    const chosenText =
      texts[query] ||
      "No text found for this query. Try 'Frankenstein' or 'Dracula'.";
    setText(chosenText);
  };

  // When the text state changes, process it and render the word cloud.
  useEffect(() => {
    if (text) {
      const freq = processText(text);
      setWordFrequencies(freq);

      const theme = determineTheme(freq);
      setThemeKey(theme);

      // Prepare list for the word cloud (take top 50 words)
      const list = freq.slice(0, 50);

      // Use the WordCloud2 library to render the word cloud
      if (canvasRef.current && window.WordCloud) {
        window.WordCloud(canvasRef.current, {
          list: list,
          fontFamily: themes[theme].fontFamily,
          color: themes[theme].color,
          backgroundColor: themes[theme].backgroundColor,
          gridSize: 18,
          weightFactor: (size) => Math.sqrt(size) * 10,
          rotateRatio: 0.5,
          rotationSteps: 2,
        });
      }
    }
  }, [text]);

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: themes[themeKey].fontFamily,
        color: themes[themeKey].color,
        backgroundColor: themes[themeKey].backgroundColor,
        minHeight: "100vh",
        transition: "background-color 0.5s, color 0.5s",
      }}
    >
      <h1>Dynamic Public Domain Word Cloud</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter title, e.g., Frankenstein or Dracula"
        style={{ padding: "8px", fontSize: "16px", width: "300px" }}
      />
      <button
        onClick={handleSearch}
        style={{ padding: "8px 12px", marginLeft: "10px", fontSize: "16px" }}
      >
        Load Text
      </button>

      <div style={{ marginTop: "20px" }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{ border: "1px solid #ccc" }}
        />
      </div>
    </div>
  );
}

export default App;
