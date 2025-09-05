import React, { forwardRef } from 'react';

interface AgentCircleProps {
  label: string;
  isLoading?: boolean;
}

const AgentCircle = forwardRef<HTMLDivElement, AgentCircleProps>(({ label, isLoading }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden w-[100px] h-[100px] rounded-full flex justify-center items-center text-center font-[600] text-[#1976D2] text-[0.95rem] cursor-pointer transition-background duration-200 hover:bg-[#1976D2] hover:text-white z-[1] border-2 border-[#E3F2FD] ${isLoading ? 'agent loading' : ''}`}
    >
      {isLoading && <div className="agent-fill" />}
      {label}
    </div>
  );
});

export default AgentCircle;
