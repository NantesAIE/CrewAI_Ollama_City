import React, { useRef } from 'react';

interface LeftPanelProps {
  onImageSelect: (file: File, url: string) => void;
  onImageRemove: () => void;
  selectedImage: string | null;
  isImageSelected: boolean;
  isLoading: boolean;
  onRunAnalysis: () => void;
}

export default function LeftPanel({
  onImageSelect,
  onImageRemove,
  selectedImage,
  isImageSelected,
  isLoading,
  onRunAnalysis,
}: LeftPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const predefinedImages = [
    { name: 'inondation', url: '/inondation.jpg' },
    { name: 'incendie', url: '/incendie.jpg' },
    { name: 'eboulement', url: '/eboulement.jpg' },
    { name: 'batiments', url: '/batiments.jpg' },
    { name: 'Lac', url: '/Lac.jpg' },
    { name: 'RuePassante', url: '/RuePassante.jpg' },
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isImageSelected) return;
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'image/jpeg') {
      const url = URL.createObjectURL(file);
      onImageSelect(file, url);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'image/jpeg') {
      const url = URL.createObjectURL(file);
      onImageSelect(file, url);
    }
  };

  const handlePredefinedClick = (img: { name: string; url: string }) => {
    if (isImageSelected) return;
    fetch(img.url)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `${img.name}.jpg`, { type: 'image/jpeg' });
        onImageSelect(file, img.url);
      });
  };

  return (
    <section className="flex-1 min-w-0 flex flex-col gap-4 sm:gap-6 rounded-[16px] p-2 sm:p-4 md:p-6 items-center w-full bg-transparent">
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className={`relative w-full min-h-[160px] sm:min-h-[180px] md:min-h-[220px] rounded-[14px] sm:rounded-[18px] flex justify-center items-center bg-white/20 backdrop-blur-md cursor-pointer group transition-all duration-300 border-2 ${!isImageSelected ? 'border-dashed border-[#ffffff]' : 'border-transparent'}`}
        onClick={() => !isImageSelected && fileInputRef.current?.click()}
        style={{ boxShadow: '0 4px 32px 0 rgba(80,80,255,0.10)' }}
      >
        {isImageSelected ? (
          <div className="relative w-full h-[160px] sm:h-[180px] md:h-[220px] group">
            <img
              src={selectedImage!}
              alt="Sélectionnée"
              className="block w-full h-full rounded-[14px] sm:rounded-[18px] object-cover shadow-lg"
              style={{ filter: 'brightness(0.98) contrast(1.05)' }}
            />
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onImageRemove();
              }}
              className="absolute top-2 right-2 bg-[#1976D2] hover:bg-[#cb201a] text-white rounded-full w-8 h-8 flex items-center justify-center z-10 transition-all duration-200 focus:outline-none opacity-0 group-hover:opacity-100 shadow-lg"
              aria-label="Supprimer l'image"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="none"/>
                <path d="M6 6l8 8M14 6l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        ) : (
          <p className="text-[#ffffff] text-base sm:text-[1.1rem] text-center m-0 font-semibold tracking-wide select-none">
            Déposez ou sélectionnez une image
          </p>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg"
          className="hidden"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 justify-center w-full">
        {predefinedImages.map(img => (
          <img
            key={img.name}
            src={img.url}
            alt={img.name}
            className={`w-full h-20 sm:h-28 rounded-[8px] sm:rounded-[10px] object-cover cursor-pointer border-2 border-transparent
              hover:border-[#90caf9] hover:scale-105 hover:shadow-[0_0_16px_0_rgba(144,202,249,0.18)]
              transition-all duration-200 shadow-md
              ${isImageSelected ? 'pointer-events-none grayscale-[0.7] brightness-90' : ''}`}
            onClick={() => handlePredefinedClick(img)}
            tabIndex={0}
            style={{ background: '#2223', boxShadow: '0 2px 12px 0 rgba(80,80,255,0.10)' }}
          />
        ))}
      </div>
      <button
        onClick={onRunAnalysis}
        disabled={!isImageSelected || isLoading}
        className="w-full sm:w-auto py-3 px-4 sm:px-[32px] bg-gradient-to-r from-[#1976D2] to-[#6f0dd2] text-white border-none rounded-[8px] sm:rounded-[10px] text-base sm:text-[1.15rem] font-bold cursor-pointer shadow-lg transition-all duration-200 hover:from-[#1565C0] hover:to-[#953cef] disabled:opacity-50 mt-2"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Analyse en cours...
          </span>
        ) : "Analyser"}
      </button>
    </section>
  );

}
