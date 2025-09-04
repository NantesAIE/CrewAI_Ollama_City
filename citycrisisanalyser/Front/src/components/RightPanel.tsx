import React, { useState } from 'react';
import Accordion from './Accordion';
import ExportPDFButton from './EportPDFButton';


interface RightPanelProps {
  responses: Record<string, string>;
}

const ACCORDION_KEYS = [
  'vision',
  'situation',
  'protocol',
  'intervention',
];

export default function RightPanel({ responses }: RightPanelProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const accordions = [
    { title: "Vision Analyst", content: responses.vision || '' },
    { title: "Situation Interpreter", content: responses.situation || '' },
    { title: "Protocol Mapper", content: responses.protocol || '' },
    { title: "Intervention Planner", content: responses.intervention || '' },
  ];

  return (
    <section className="flex-1 min-w-0 flex flex-col gap-4 sm:gap-6 rounded-[16px] p-2 sm:p-4 md:p-6 items-center w-full bg-transparent">
      <div className="divide-y divide-[#90caf9]/30 flex-1 min-h-0 w-full h-full overflow-y-auto">
        {accordions.map((acc, idx) => (
          <Accordion
            key={acc.title}
            title={acc.title}
            content={acc.content}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </div>
      <ExportPDFButton responses={responses} />
    </section>
  );
}
