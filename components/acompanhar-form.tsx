'use client'

import { useState, FormEvent } from 'react'
import type { DenunciaStatus } from '@/types/payload'

const statusLabels: Record<DenunciaStatus, { label: string; color: string }> = {
  'recebida': { label: 'Recebida', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  'em-analise': { label: 'Em análise', color: 'bg-yellow-50 text-yellow-800 border-yellow-300' },
  'encaminhada': { label: 'Encaminhada', color: 'bg-blue-50 text-blue-800 border-blue-300' },
  'resolvida': { label: 'Resolvida', color: 'bg-green-50 text-green-800 border-green-300' },
  'arquivada': { label: 'Arquivada', color: 'bg-gray-100 text-gray-500 border-gray-300' },
}

const statusDescriptions: Record<DenunciaStatus, string> = {
  'recebida': 'Sua denúncia foi recebida e aguarda análise inicial.',
  'em-analise': 'Sua denúncia está sendo analisada pela equipe responsável.',
  'encaminhada': 'Sua denúncia foi encaminhada para as providências cabíveis.',
  'resolvida': 'Sua denúncia foi concluída.',
  'arquivada': 'Sua denúncia foi arquivada.',
}

interface Result {
  protocolo: string
  status: DenunciaStatus
  updatedAt: string
  createdAt: string
}

export default function AcompanharForm() {
  const [protocolo, setProtocolo] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    const proto = protocolo.trim().toUpperCase()
    if (!proto) {
      setError('Informe o número do protocolo.')
      return
    }

    setLoading(true)
    try {
      const resp = await fetch(`/api/denuncias/${encodeURIComponent(proto)}`)
      if (resp.status === 404) {
        setError('Protocolo não encontrado. Verifique se digitou corretamente.')
        return
      }
      if (!resp.ok) {
        throw new Error('Erro ao consultar denúncia')
      }
      const data = await resp.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao consultar denúncia')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="protocolo" className="block text-xs font-semibold uppercase text-gray-600">
          Número do protocolo
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            id="protocolo"
            value={protocolo}
            onChange={(e) => setProtocolo(e.target.value)}
            placeholder="Ex: DEN-2026-0001"
            className="flex-1 h-11 bg-[#f2f2f2] border border-gray-200 px-3 text-sm text-gray-700 outline-none focus:border-brand-600 transition font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-600 text-white text-sm font-semibold uppercase px-6 py-3 hover:bg-brand-700 disabled:opacity-50 transition"
          >
            {loading ? 'Consultando...' : 'Consultar'}
          </button>
        </div>
      </form>

      {error && (
        <div className="border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="border border-gray-200 p-5 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="block text-xs font-semibold uppercase text-gray-500 mb-1">Protocolo</span>
              <span className="font-mono font-semibold text-gray-900">{result.protocolo}</span>
            </div>
            <span className={`inline-block text-xs font-semibold uppercase px-3 py-1 border ${statusLabels[result.status].color}`}>
              {statusLabels[result.status].label}
            </span>
          </div>

          <p className="text-sm text-gray-700">{statusDescriptions[result.status]}</p>

          <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500">
            <div>
              <span className="font-semibold uppercase block">Registrada em</span>
              <span>{new Date(result.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
            <div>
              <span className="font-semibold uppercase block">Última atualização</span>
              <span>{new Date(result.updatedAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
