'use client';

import { useState } from 'react';

export default function Home() {
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: description, platform }), 
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.result);
      } else {
        setResult(`Error: ${data.error || 'An error occurred while generating content.'}`);
      }

    } catch (error) {
      console.error("Failed to contact the server:", error);
      setResult('Unable to connect to the server. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 bg-gray-100 text-gray-800">
      
      <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-xl shadow-lg">

        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Social Media Content Generator 📧</h1>
          <p className="text-gray-500">Create engaging captions with the power of AI Llama 3</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Content Topic or Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              rows={4}
              placeholder="Example: End-of-year special promo, 50% discount on all fashion products."
            />
          </div>

          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">Select Platform:</label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            >
              <option value="Instagram">Instagram</option>
              <option value="Twitter">Twitter / X</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Facebook">Facebook</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading || !description.trim()}
          >
            {isLoading ? 'Generating...' : '✨ Generate Content'}
          </button>
        </div>
      </div>

      {(isLoading || result) && (
        <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-xl shadow-lg mt-6">
          <h2 className="text-2xl font-bold mb-4">Generated Result:</h2>
          <div className="bg-gray-50 p-4 rounded-md min-h-[100px] text-gray-700 whitespace-pre-wrap">
            {isLoading ? <span className="animate-pulse">Processing your request...</span> : result}
          </div>
        </div>
      )}

    </main>
  );
}