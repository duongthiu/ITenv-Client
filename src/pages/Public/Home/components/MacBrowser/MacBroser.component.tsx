import { Editor } from '@monaco-editor/react';
import React, { FormEvent, useState } from 'react';
import {
  FiArrowLeft,
  FiArrowRight,
  FiFileText,
  FiGitBranch,
  FiMenu,
  FiPlayCircle,
  FiRefreshCw,
  FiSearch,
  FiSettings,
  FiX
} from 'react-icons/fi';

interface Tab {
  id: number;
  title: string;
  url: string;
}

const MacBrowser: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([{ id: 1, title: 'index.ts', url: '' }]);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [urlInput, setUrlInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestions] = useState<string[]>(['google.com', 'github.com', 'stackoverflow.com']);

  const handleNewTab = () => {
    const newTab: Tab = {
      id: tabs.length + 1,
      title: 'New Tab',
      url: ''
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const handleCloseTab = (tabId: number) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter((tab) => tab.id !== tabId);
      setTabs(newTabs);
      if (activeTab === tabId) {
        setActiveTab(newTabs[newTabs.length - 1].id);
      }
    }
  };

  const handleUrlSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const updatedTabs = tabs.map((tab) => (tab.id === activeTab ? { ...tab, url: urlInput, title: urlInput } : tab));
      setTabs(updatedTabs);
    }, 1500);
  };

  return (
    <div className="flex h-full w-full flex-col rounded-2xl bg-gray-100">
      {/* Browser Header */}
      <div className="flex items-center space-x-2 rounded-t-2xl bg-gray-200 p-4">
        <div className="flex space-x-2">
          <button
            aria-label="Close window"
            className="h-4 w-4 rounded-full bg-red-500 transition-colors hover:bg-red-600"
          />
          <button
            aria-label="Minimize window"
            className="h-4 w-4 rounded-full bg-yellow-500 transition-colors hover:bg-yellow-600"
          />
          <button
            aria-label="Maximize window"
            className="h-4 w-4 rounded-full bg-green-500 transition-colors hover:bg-green-600"
          />
        </div>
      </div>

      {/* Address Bar */}
      <div className="relative flex items-center justify-center bg-gray-200">
        <form onSubmit={handleUrlSubmit} className="relative w-1/2">
          <div className="flex items-center gap-1">
            <button className="mx-2 text-gray-400 hover:text-gray-200">
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <button className="mx-2 text-gray-400 hover:text-gray-200">
              <FiArrowRight className="h-4 w-4" />
            </button>
            <div className="flex flex-1 items-center rounded-lg bg-white shadow-md">
              <button aria-label="Toggle sidebar" onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
                <FiMenu className="h-5 w-5 text-gray-500" />
              </button>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full rounded-lg p-3 text-gray-700 focus:outline-none"
                placeholder="Itenv..."
              />
              <button aria-label="Refresh page" className={`p-2 ${loading ? 'animate-spin' : ''}`}>
                <FiRefreshCw className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {urlInput && (
              <div className="absolute left-0 right-0 top-full mt-2 rounded-lg border border-gray-300 bg-white shadow-lg">
                {suggestions
                  .filter((s) => s.includes(urlInput.toLowerCase()))
                  .map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setUrlInput(suggestion)}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                      {suggestion}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </form>
      </div>
      {/* Tab Navigation */}
      <div className="flex items-center border-b border-gray-300 bg-gray-200">
        <div className="flex flex-1 items-center">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`group relative flex items-center px-4 py-2 ${
                activeTab === tab.id ? 'rounded-t-lg bg-white' : 'hover:bg-gray-100'
              }`}
            >
              <button onClick={() => setActiveTab(tab.id)} className="flex flex-1 items-center">
                <span className="max-w-xs truncate">{tab.title}</span>
              </button>
              <button
                onClick={() => handleCloseTab(tab.id)}
                className="ml-2 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Close tab"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button onClick={handleNewTab} className="rounded-lg p-2 hover:bg-gray-100" aria-label="New tab">
            +
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden rounded-b-2xl">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="flex">
            <div className="flex h-screen w-16 flex-col items-center border-r border-gray-300 bg-gray-100 py-4">
              <button className="mb-6 text-gray-600 hover:text-gray-800">
                <FiFileText className="h-6 w-6" />
              </button>
              <button className="mb-6 text-gray-600 hover:text-gray-800">
                <FiSearch className="h-6 w-6" />
              </button>
              <button className="mb-6 text-gray-600 hover:text-gray-800">
                <FiGitBranch className="h-6 w-6" />
              </button>
              <button className="mb-6 text-gray-600 hover:text-gray-800">
                <FiPlayCircle className="h-6 w-6" />
              </button>
              <button className="mb-6 mt-auto text-gray-600 hover:text-gray-800">
                <FiSettings className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 bg-white p-4">
          <Editor defaultLanguage="javascript" defaultValue="console.log('Hello, world!')" />
        </div>
      </div>
    </div>
  );
};

export default MacBrowser;
