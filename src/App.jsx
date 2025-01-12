import { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { FiCopy } from "react-icons/fi";

function App() {
  const [inputText, setInputText] = useState("");
  const [slangText, setSlangText] = useState("");
  const [loading, setLoading] = useState(false);

  const convertToSlang = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.cohere.ai/v1/chat", 
        {
          message: `Please provide the Gen Z version of the statement: ${inputText}`
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_COHERE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data); 

      const generatedText = response.data?.text;  
      if (generatedText) {
        setSlangText(generatedText);
      } else {
        throw new Error("Failed to generate slang. Try again.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "An error occurred";
      toast.error(errorMessage);
      setSlangText(""); 
    } finally {
      setLoading(false);
    }
  };


  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(slangText);
      toast.success("Copied to clipboard!", {
        duration: 2000,
        position: "bottom-center",
        style: {
          background: "#4F46E5",
          color: "#fff",
        },
      });
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Toaster />
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mb-2">
            Slang Converter
          </h1>
          <p className="text-gray-400">Transform your boring text into Gen Z slang!</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 resize-none"
            />
          </div>

          <button
            onClick={convertToSlang}
            disabled={loading || !inputText}
            className="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Converting..." : "Convert to Slang"}
          </button>

          {slangText && (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700 relative group">
              <div className="flex justify-between items-start">
                <h2 className="text-sm font-semibold text-gray-400 mb-2">Slang Version:</h2>
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
                  title="Copy to clipboard"
                >
                  <FiCopy className="w-5 h-5" />
                </button>
              </div>
              <p className="text-lg">{slangText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
