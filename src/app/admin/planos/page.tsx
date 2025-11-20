'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';

export default function PlanosPage() {
  const [planos, setPlanos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);
  const [novoPlano, setNovoPlano] = useState({
    nome: '',
    descricao: '',
    valorMensal: '',
    duracaoMeses: '1',
    beneficios: [''],
  });

  useEffect(() => {
    carregarPlanos();
  }, []);

  async function carregarPlanos() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/planos');
      const data = await res.json();
      setPlanos(data);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function criarPlano() {
    if (!novoPlano.nome || !novoPlano.valorMensal) {
      alert('Preencha nome e valor');
      return;
    }

    try {
      await fetch('/api/admin/planos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: novoPlano.nome,
          descricao: novoPlano.descricao,
          valorMensal: parseFloat(novoPlano.valorMensal),
          duracaoMeses: parseInt(novoPlano.duracaoMeses),
          beneficios: novoPlano.beneficios.filter(b => b.trim()),
        }),
      });

      setNovoPlano({
        nome: '',
        descricao: '',
        valorMensal: '',
        duracaoMeses: '1',
        beneficios: [''],
      });
      carregarPlanos();
    } catch (error) {
      console.error('Erro ao criar plano:', error);
      alert('Erro ao criar plano');
    }
  }

  async function atualizarPlano(id: string, updates: any) {
    try {
      await fetch(`/api/admin/planos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      carregarPlanos();
      setEditando(null);
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      alert('Erro ao atualizar plano');
    }
  }

  async function desativarPlano(id: string) {
    if (!confirm('Desativar este plano?')) return;

    try {
      await fetch(`/api/admin/planos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: false }),
      });
      carregarPlanos();
    } catch (error) {
      console.error('Erro ao desativar plano:', error);
    }
  }

  function adicionarBeneficio() {
    setNovoPlano({
      ...novoPlano,
      beneficios: [...novoPlano.beneficios, ''],
    });
  }

  function removerBeneficio(index: number) {
    setNovoPlano({
      ...novoPlano,
      beneficios: novoPlano.beneficios.filter((_, i) => i !== index),
    });
  }

  function atualizarBeneficio(index: number, valor: string) {
    const novos = [...novoPlano.beneficios];
    novos[index] = valor;
    setNovoPlano({ ...novoPlano, beneficios: novos });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Gerenciar Planos
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Crie e edite planos de assinatura
        </p>
      </div>

      {/* Criar Novo Plano */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Plus className="w-6 h-6" />
          Criar Novo Plano
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nome do plano"
            value={novoPlano.nome}
            onChange={(e) => setNovoPlano({ ...novoPlano, nome: e.target.value })}
            className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Valor mensal (R$)"
            value={novoPlano.valorMensal}
            onChange={(e) => setNovoPlano({ ...novoPlano, valorMensal: e.target.value })}
            className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Duração (meses)"
            value={novoPlano.duracaoMeses}
            onChange={(e) => setNovoPlano({ ...novoPlano, duracaoMeses: e.target.value })}
            className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Descrição"
            value={novoPlano.descricao}
            onChange={(e) => setNovoPlano({ ...novoPlano, descricao: e.target.value })}
            className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2 mb-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Benefícios
          </label>
          {novoPlano.beneficios.map((beneficio, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Digite um benefício"
                value={beneficio}
                onChange={(e) => atualizarBeneficio(index, e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {novoPlano.beneficios.length > 1 && (
                <button
                  onClick={() => removerBeneficio(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={adicionarBeneficio}
            className="text-sm text-blue-500 hover:text-blue-600 font-medium"
          >
            + Adicionar benefício
          </button>
        </div>

        <button
          onClick={criarPlano}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          Criar Plano
        </button>
      </div>

      {/* Lista de Planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-slate-600 dark:text-slate-400">Carregando...</p>
          </div>
        ) : (
          planos.map((plano) => (
            <div
              key={plano.id}
              className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 ${
                !plano.ativo ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {plano.nome}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {plano.descricao}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  plano.ativo
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {plano.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  R$ {Number(plano.valor_mensal).toFixed(2)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  por {plano.duracao_meses} mês(es)
                </p>
              </div>

              {plano.beneficios && Array.isArray(plano.beneficios) && plano.beneficios.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Benefícios:
                  </p>
                  <ul className="space-y-1">
                    {plano.beneficios.map((beneficio: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Check className="w-4 h-4 text-green-500" />
                        {beneficio}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setEditando(plano.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                {plano.ativo && (
                  <button
                    onClick={() => desativarPlano(plano.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
