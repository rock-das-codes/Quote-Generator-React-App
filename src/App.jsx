import  { useState, useEffect, useRef } from "react";
import { HeartPlus, HeartMinus } from "lucide-react";
import { useMemo } from "react";

const App = () => {
  const [selectTag, setSelectTag] = useState("Love");
  const url = `https://api.quotable.io/quotes?tags=${selectTag}&limit=50`;
  const [quotes, setQuotes] = useState(null);
  const [fav, setFav] = useState(false);
  const [tags, setTags] = useState([]);
  const firstrender = useRef(true);

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
        .then((data) => {setQuotes(data.results[Math.floor(Math.random() * data.results.length)]);});
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getQuote();
    try {
      fetch("https://api.quotable.io/tags")
      .then((response => response.json()))
      .then((data) => {setTags(data);});
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
    setFav(!fav);
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  function shareOnTwitter() {
    const navUrl =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(quotes?.content || "");
    window.open(navUrl, "_blank");
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-radial from-[#051937] via-[#0f1e2f] to-[#1b2127] font-poppins">
      <div className="w-full max-w-md mx-auto my-8 p-8 bg-white/20 rounded-2xl backdrop-blur-lg border border-[#2b2b2b91] shadow-2xl flex flex-col items-center transition-all duration-300">
        <h1 className="font-serif text-3xl md:text-4xl text-white text-center pb-4 tracking-wide drop-shadow-lg">
          <span className="text-[#1DA1F2] drop-shadow-[0_0_10px_#1DA1F2]">Quote Generator</span>
        </h1>
        {/* Dropdown for tags */}
        <div className="w-full flex justify-center mb-6">
          <div className="text-2xl mt-1 pr-2 text-white">tags: </div> <select
            className="bg-white/80 rounded-lg px-4 py-2 text-gray-800 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={selectTag}
            onChange={e => setSelectTag(e.target.value)}
          >
            {randomTags.map(tag => (
              <option key={tag._id} value={tag.name}>{tag.name}</option>
            ))}
          </select>
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <p className="my-4  h-28  text-white text-center text-md md:text-xl tracking-wide font-medium drop-shadow animate-pulse min-h-[72px] overflow-scroll">
            {quotes ? quotes.content : (
              <span className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                Loading...
              </span>
            )}
          </p>
        </div>
        <div className="w-full flex flex-col items-center">
          <h5 className="font-dancing text-[#C4A69D] text-center text-lg md:text-xl tracking-widest uppercase my-2">
            {quotes ? quotes.author : ""}
          </h5>
        </div>
        <div className="flex flex-row justify-center items-center gap-4 mt-6 w-full">
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-5 py-2 rounded-lg shadow hover:scale-105 hover:from-blue-600 hover:to-cyan-500 transition-all duration-200 font-semibold"
            onClick={shareOnTwitter}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99A12.13 12.13 0 0 1 3.15 5.13a4.28 4.28 0 0 0 1.33 5.72c-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.55 1.72 2.16 2.97 4.07 3a8.6 8.6 0 0 1-5.32 1.84c-.34 0-.67-.02-1-.06A12.13 12.13 0 0 0 8.29 21c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.7 8.7 0 0 0 24 4.59a8.47 8.47 0 0 1-2.54.7z"/></svg>
            Share on X
          </button>
          <button
            onClick={getQuote}
            className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-5 py-2 rounded-lg shadow hover:scale-105 hover:from-orange-500 hover:to-pink-600 transition-all duration-200 font-semibold"
          >
            New Quote
          </button>
          <button
            onClick={handlefav}
            className={`rounded-full p-2 border-2 ${fav ? "border-pink-400 bg-pink-100" : "border-gray-300 bg-white/60"} shadow hover:scale-110 transition-all duration-200`}
            title={fav ? "Remove from favorites" : "Add to favorites"}
          >
            {!fav ? <HeartPlus color="red" size={24} /> : <HeartMinus color="#e11d48" size={24} />}
          </button>
        </div>
        <footer className="w-full mt-8 flex justify-center">
          <a
            href="https://github.com/yourprofile"
            className="no-underline text-base text-white opacity-90 hover:opacity-100 transition-all duration-300"
            target="_blank" rel="noopener noreferrer"
          >
            &copy; 2023 SPR Hackz
          </a>
        </footer>
      </div>
    </div>
  );
};

export default App;