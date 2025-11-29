"use client";

export default function CardTreino({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 px-6 py-8 rounded-2xl w-full max-w-xl mx-auto flex flex-col gap-6">
      {children}
    </div>
  );
}
