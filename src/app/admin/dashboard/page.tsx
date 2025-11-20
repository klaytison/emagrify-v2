'use client';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4]">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold text-[#2A2A2A]">
          Olá, Luh 🩵
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Se você está vendo esta mensagem no painel /admin/dashboard,
          significa que o código do GitHub está funcionando e sendo
          publicado corretamente.
        </p>
      </div>
    </div>
  );
}
