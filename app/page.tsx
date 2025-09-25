'use client';

import { useState } from 'react';

const writingStyles = [
  { id: 'Professional', label: 'Professional 👔' },
  { id: 'Casual', label: 'Casual 😎' },
  { id: 'Funny', label: 'Funny 😂' },
  { id: 'Enthusiastic', label: 'Enthusiastic 🔥' },
];

export default function Home() {
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [style, setStyle] = useState('Casual');
  const [language, setLanguage] = useState('English');
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setResults([]);
    setCopiedIndex(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, platform, style, language }),
      });

      const data = await response.json();

      if (response.ok) {
        const alternatives = data.result.split('---').map((item: string) => item.trim());
        setResults(alternatives.filter((item: any) => item));
      } else {
        setResults([`Error: ${data.error || 'An error occurred while generating content.'}`]);
      }

    } catch (error) {
      console.error("Failed to contact the server:", error);
      setResults(['Unable to connect to the server. Please check your internet connection.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <main className="flex flex-col items-center min-h-screen p-4 sm:p-8 bg-gray-100 text-gray-800">
      
      <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-xl shadow-lg">

        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">WordWeaver AI 📧</h1>
          <p className="text-gray-500">Create engaging social media captions with AI</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Content Topic or Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
              rows={4}
              placeholder="Example: End-of-year special promo, 50% discount..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Output Language:</label>
            <div className="flex flex-wrap gap-2">
                <button onClick={() => setLanguage('English')} className={`px-4 py-2 text-sm rounded-full transition ${language === 'English' ? 'bg-green-600 text-white font-semibold shadow' : 'bg-gray-200 hover:bg-gray-300'}`}>English 🇬🇧</button>
                <button onClick={() => setLanguage('Indonesian')} className={`px-4 py-2 text-sm rounded-full transition ${language === 'Indonesian' ? 'bg-red-600 text-white font-semibold shadow' : 'bg-gray-200 hover:bg-gray-300'}`}>Indonesian 🇮🇩</button>
            </div>
          </div>
          
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">Platform:</label>
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
              >
                <option>Instagram</option>
                <option>Twitter</option>
                <option>LinkedIn</option>
                <option>Facebook</option>
              </select>
            </div>
            {/* Pilihan Gaya Penulisan */}
            <div className='flex-1'>
              <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-1">Writing Style:</label>
              <select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
              >
                {writingStyles.map(({ id }) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:bg-gray-400"
            disabled={isLoading || !description.trim()}
          >
            {isLoading ? 'Generating...' : '✨ Generate Content'}
          </button>
        </div>
      </div>

      {isLoading && (
          <div className="w-full max-w-2xl text-center p-6 mt-6">
              <p className="animate-pulse text-gray-600">The AI is weaving the best words for you...</p>
          </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="w-full max-w-2xl mt-6 space-y-4">
          <h2 className="text-2xl font-bold text-center">Here are your alternatives:</h2>
          {results.map((result, index) => (
            <div key={index} className="bg-white p-5 rounded-xl shadow-lg transition hover:shadow-xl">
              <p className="text-gray-800 whitespace-pre-wrap mb-4">{result}</p>
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-xs text-gray-500">{result.length} Characters</span>
                <button
                  onClick={() => handleCopy(result, index)}
                  className="px-3 py-1 text-xs font-semibold rounded-full transition bg-gray-200 hover:bg-blue-200 text-gray-700"
                >
                  {copiedIndex === index ? 'Copied! ✓' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}