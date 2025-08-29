import React from 'react';
import ReactMarkdown from 'react-markdown';

interface AccordionProps {
  title: string;
  content: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Accordion({ title, content, isOpen, onToggle }: AccordionProps) {
  return (
    <div className="mb-2 sm:mb-4 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-white/10 backdrop-blur-md transition-all duration-300 border border-[#90caf9]/30">
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 sm:px-6 py-3 sm:py-4 font-semibold text-white text-base sm:text-lg focus:outline-none transition-all duration-200
          hover:bg-white/20 hover:backdrop-blur-lg"
        onClick={onToggle}
        style={{ letterSpacing: 0.5 }}
      >
        <span>{title}</span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M6 10l6 6 6-6" stroke="#90caf9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      <div
        className={`px-4 sm:px-6 pb-3 sm:pb-4 text-white text-sm sm:text-base transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
        style={{
          background: 'rgba(30,42,70,0.18)',
          backdropFilter: 'blur(8px)',
          maxHeight: isOpen ? 400 : 0,
          overflowY: isOpen ? 'auto' : 'hidden'
        }}
      >
        {isOpen && (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
