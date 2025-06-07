import { useState, useEffect, useRef } from "react";
import { Heart, Sun, Moon } from "lucide-react";
import { useMemo } from "react";

const App = () => {
  const [selectTag, setSelectTag] = useState("Love");
  const url = `https://quote-generator-react-app.onrender.com/api/quote${selectTag ? `?tag=${encodeURIComponent(selectTag)}` : ""}`;
  const [quotes, setQuotes] = useState(null);
  const [fav, setFav] = useState(false);
  const [dark, setDark] = useState(false);
  const [tags, setTags] = useState([]);
  const [favoriteQuotes, setFavoriteQuotes] = useState([]);
  const firstrender = useRef(true);
  function displayFav() {
    if (firstrender.current) {
      firstrender.current = false;
      return;
    }
    if (favoriteQuotes.length === 0) {
      alert("No favorites yet!");
      return;
    }
    const favList = favoriteQuotes.map((quote, index) => `${index + 1}. "${quote.content}" - ${quote.author}`).join("\n");
    alert(`Your Favorite Quotes:\n\n${favList}`);
  }
  // Helper to get 5 random tags
  function getRandomTags(tagsArr) {
    if (!tagsArr || tagsArr.length === 0) return [];
    const shuffled = [...tagsArr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }
  const randomTags = useMemo(() => getRandomTags(tags), [tags]);

  // Fetch Quotes from API
  const getQuote = () => {
    try {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // If backend returns .results (for tag), pick random from results
          if (data.results && Array.isArray(data.results) && data.results.length > 0) {
            const newQuote = data.results[Math.floor(Math.random() * data.results.length)];
            setQuotes(newQuote);
            // Check if this quote is already in favorites
            setFav(favoriteQuotes.some(favQuote => favQuote._id === newQuote._id));
          } else if (data.content) {
            // If backend returns a single quote object
            setQuotes(data);
            setFav(favoriteQuotes.some(favQuote => favQuote._id === data._id));
          } else {
            setQuotes(null);
            setFav(false);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getQuote();
    try {
      fetch("https://quote-generator-react-app.onrender.com/api/tags")
        .then((response) => response.json())
        .then((data) => { setTags(data); });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Fetch new quote when tag changes
  useEffect(() => {
    getQuote();
    // eslint-disable-next-line
  }, [selectTag]);

  function handlefav() {
    if (!quotes) return;
    
    if (fav) {
      // Remove from favorites
      const updatedFavorites = favoriteQuotes.filter(favQuote => favQuote._id !== quotes._id);
      setFavoriteQuotes(updatedFavorites);
      setFav(false);
    } else {
      // Add to favorites
      const updatedFavorites = [...favoriteQuotes, quotes];
      setFavoriteQuotes(updatedFavorites);
      setFav(true);
    }
  }

  function shareOnTwitter() {
    const navUrl =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(`"${quotes?.content || ""}" - ${quotes?.author || "Unknown"}`);
    window.open(navUrl, "_blank");
  }

  const toggleDarkMode = () => {
    setDark(!dark);
  };

  return (
    <div className={`min-h-screen flex justify-center items-center transition-all duration-500 font-poppins ${
      dark
        ? "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
        : "bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100"
    }`}>
      {/* Enhanced Dark Mode Toggle */}
      <div className="absolute right-6 top-6 z-10">
        <button
          onClick={toggleDarkMode}
          className={`relative inline-flex items-center justify-center w-16 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
            dark
              ? "bg-gradient-to-r from-purple-600 to-blue-600 focus:ring-purple-400"
              : "bg-gradient-to-r from-yellow-400 to-orange-400 focus:ring-yellow-300"
          } shadow-lg hover:shadow-xl transform hover:scale-105`}
        >
          {/* Toggle Circle */}
          <span
            className={`absolute w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center ${
              dark
                ? "bg-white transform translate-x-4 shadow-lg"
                : "bg-white transform -translate-x-4 shadow-lg"
            }`}
          >
            {dark ? (
              <Moon size={14} className="text-purple-600" />
            ) : (
              <Sun size={14} className="text-yellow-500" />
            )}
          </span>
          
          {/* Background Icons */}
          <div className="absolute inset-0 flex items-center justify-between px-2">
            <Sun 
              size={12} 
              className={`transition-opacity duration-300 ${
                dark ? "opacity-30 text-white" : "opacity-0"
              }`} 
            />
            <Moon 
              size={12} 
              className={`transition-opacity duration-300 ${
                dark ? "opacity-0" : "opacity-30 text-white"
              }`} 
            />
          </div>
        </button>
        
        {/* Mode Label */}
        <div className="text-center mt-2">
          <span className={`text-xs font-medium transition-colors duration-300 ${
            dark ? "text-gray-300" : "text-gray-600"
          }`}>
            {dark ? "Dark" : "Light"}
          </span>
        </div>
      </div>

      <div className={`w-full max-w-lg mx-auto my-8 p-8 rounded-3xl backdrop-blur-xl border shadow-2xl flex flex-col items-center transition-all duration-500 ${
        dark
          ? "bg-gray-800/30 border-gray-700/50 text-white shadow-purple-500/20"
          : "bg-white/40 border-white/60 text-gray-800 shadow-blue-500/20"
      }`}>
        <h1 className={`font-serif text-3xl md:text-4xl text-center pb-6 tracking-wide transition-all duration-300 ${
          dark
            ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 drop-shadow-[0_0_20px_rgba(147,51,234,0.5)]"
            : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-lg"
        }`}>
          Quote Generator
        </h1>
        
        {/* Tags Dropdown */}
        <div className="w-full flex justify-center items-center mb-6">
          <label className={`text-lg font-medium mr-3 transition-colors duration-300 ${
            dark ? "text-gray-300" : "text-gray-700"
          }`}>
            Category:
          </label>
          <select
            className={`rounded-xl px-4 py-2 font-semibold shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 transition-all duration-300 ${
              dark
                ? "bg-gray-700/80 text-white border-gray-600 focus:ring-purple-400"
                : "bg-white/90 text-gray-800 border-gray-200 focus:ring-blue-400"
            }`}
            value={selectTag}
            onChange={e => setSelectTag(e.target.value)}
          >
            {randomTags.map(tag => (
              <option key={tag._id} value={tag.name}>{tag.name}</option>
            ))}
          </select>
        </div>
        
        {/* Quote Display */}
        <div className="w-full flex flex-col justify-center items-center mb-6">
          <div className={`min-h-[120px] p-6 rounded-2xl transition-all duration-500 ${
            dark
              ? "bg-gray-700/40 border border-gray-600/50"
              : "bg-white/60 border border-white/80"
          } backdrop-blur-sm shadow-lg w-full`}>
            <p className={`text-center text-lg md:text-xl leading-relaxed font-medium transition-all duration-300 ${
              dark ? "text-gray-100" : "text-gray-800"
            }`}>
              {quotes ? (
                <span className="italic transition-all animate-fadein">"{quotes.content}"</span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <span className={`w-6 h-6 animation-fadein border-4 border-t-transparent rounded-full animate-spin ${
                    dark ? "border-purple-400" : "border-blue-400"
                  }`}></span>
                  Loading inspiration...
                </span>
              )}
            </p>
          </div>
        </div>
        
        {/* Author */}
        <div className="w-full flex flex-col items-center mb-8">
          <h5 className={`font-serif text-xl md:text-2xl text-center  animation-fadein tracking-wide transition-colors duration-300 ${
            dark ? "text-purple-300" : "text-blue-600"
          }`}>
            {quotes ? `— ${quotes.author}` : ""}
          </h5>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-row justify-center items-center gap-4 w-full">
          <button
            className={`flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold transform hover:scale-105 ${
              dark
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
            }`}
            onClick={shareOnTwitter}
            disabled={!quotes}
          >
            Share on X
          </button>
          
          <button
            onClick={getQuote}
            className={`px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold transform hover:scale-105 ${
              dark
                ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:from-orange-600 hover:to-pink-700"
                : "bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:from-orange-500 hover:to-pink-600"
            }`}
          >
            New Quote
          </button>
          
          <button
            onClick={handlefav}
            disabled={!quotes}
            className={`rounded-full p-3 border-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 ${
              fav
                ? dark
                  ? "border-pink-400 bg-pink-500/20 backdrop-blur-sm"
                  : "border-pink-400 bg-pink-100/80"
                : dark
                ? "border-gray-500 bg-gray-700/40 backdrop-blur-sm hover:border-pink-400"
                : "border-gray-300 bg-white/60 hover:border-pink-400"
            }`}
            title={fav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`transition-all duration-200 ${
                fav 
                  ? "text-pink-500 fill-pink-500" 
                  : dark 
                    ? "text-gray-300 hover:text-pink-400" 
                    : "text-gray-600 hover:text-pink-500"
              }`} 
              size={24} 
            />
          </button>
        </div>
        
        {/* Favorites Counter */}
        {favoriteQuotes.length > 0 && (
          <div onClick={displayFav} className={`mt-4 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            dark
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
              : "bg-blue-100 text-blue-700 border border-blue-200"
          }`}>
            💝 {favoriteQuotes.length} favorite{favoriteQuotes.length !== 1 ? 's' : ''}
          </div>
        )}
        
        <footer className="w-full mt-8 flex justify-center">
          <a
            href="https://github.com/rock-das-codes?tab=repositories"
            className={`no-underline text-base opacity-70 hover:opacity-100 transition-all duration-300 ${
              dark ? "text-gray-300" : "text-gray-600"
            }`}
            target="_blank" 
            rel="noopener noreferrer"
          >
            &copy; 2025 das
          </a>
        </footer>
      </div>
    </div>
  );
};

export default App;