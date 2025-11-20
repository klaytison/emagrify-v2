'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar } from 'lucide-react';

interface Content {
  id: string;
  title: string;
  type: 'post' | 'page' | 'video';
  visibility: 'public' | 'subscribers' | 'premium';
  status: 'published' | 'draft' | 'scheduled';
  author: string;
  date: string;
  scheduledDate?: string;
}

const MOCK_CONTENT: Content[] = [
  {
    id: '1',
    title: 'Como perder peso de forma saudável',
    type: 'post',
    visibility: 'public',
    status: 'published',
    author: 'Admin',
    date: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Treino HIIT para iniciantes',
    type: 'video',
    visibility: 'subscribers',
    status: 'published',
    author: 'Admin',
    date: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Guia completo de nutrição',
    type: 'page',
    visibility: 'premium',
    status: 'draft',
    author: 'Admin',
    date: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default function ContentPage() {
  const [content] = useState<Content[]>(MOCK_CONTENT);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      post: 'Post',
      page: 'Página',
      video: 'Vídeo',
    };
    return labels[type] || type;
  };

  const getVisibilityLabel = (visibility: string) => {
    const labels: Record<string, string> = {
      public: 'Público',
      subscribers: 'Assinantes',
      premium: 'Premium',
    };
    return labels[visibility] || visibility;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      published: 'Publicado',
      draft: 'Rascunho',
      scheduled: 'Agendado',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Conteúdo</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gerencie posts, páginas e vídeos
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white rounded-xl hover:shadow-lg transition-all">
          <Plus className="w-5 h-5" />
          <span>Novo Conteúdo</span>
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6">
        {content.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    {getTypeLabel(item.type)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <span>Por {item.author}</span>
                  <span>•</span>
                  <span>{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.visibility === 'public'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : item.visibility === 'subscribers'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                  }`}>
                    {getVisibilityLabel(item.visibility)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'published'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : item.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {getStatusLabel(item.status)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-[#7BE4B7] dark:hover:text-[#7BE4B7] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-[#7BE4B7] dark:hover:text-[#7BE4B7] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                  <Edit className="w-5 h-5" />
                </button>
                {item.status === 'draft' && (
                  <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-[#6ECBF5] dark:hover:text-[#6ECBF5] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                    <Calendar className="w-5 h-5" />
                  </button>
                )}
                <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
