"use client";

import { useState, FormEvent } from "react";
import SignaturePad from "@/components/signature-pad";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Máscara de telefone (XX) XXXXX-XXXX
const formatTelefone = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 15);
};

// Máscara de CPF XXX.XXX.XXX-XX
const formatCPF = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .substring(0, 14);
};

interface SindicalizacaoFormProps {
  siteId: string;
}

export default function SindicalizacaoForm({ siteId }: SindicalizacaoFormProps) {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    cpf: "",
    email: "",
    celular: "",
    dataNascimento: "",
    empresaVeiculo: "",
    cargoFuncao: "",
  });
  const [signature, setSignature] = useState<string | null>(null);
  const [declaracaoLida, setDeclaracaoLida] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'celular') {
      setFormData({ ...formData, [name]: formatTelefone(value) });
    } else if (name === 'cpf') {
      setFormData({ ...formData, [name]: formatCPF(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!signature) {
      setError("Por favor, assine o formulário antes de enviar.");
      return;
    }

    if (!declaracaoLida) {
      setError("Você precisa aceitar os termos para se sindicalizar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/sindicalize-submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nomeCompleto: formData.nomeCompleto,
          cpf: formData.cpf,
          email: formData.email,
          celular: formData.celular,
          dataNascimento: formData.dataNascimento,
          empresaVeiculo: formData.empresaVeiculo,
          cargoFuncao: formData.cargoFuncao,
          assinaturaDigital: signature,
          declaracaoLida: true,
          site: Number(siteId),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.message || 'Erro ao enviar solicitação');
      }

      setSuccess(true);
      setFormData({
        nomeCompleto: "",
        cpf: "",
        email: "",
        celular: "",
        dataNascimento: "",
        empresaVeiculo: "",
        cargoFuncao: "",
      });
      setSignature(null);
      setDeclaracaoLida(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar solicitação');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto bg-primary rounded-xl shadow-xs-skeumorphic p-8 md:p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-success-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-display-sm font-bold text-primary mb-4">Solicitação enviada!</h2>
          <p className="text-md text-secondary mb-6">
            Recebemos sua solicitação de sindicalização. Em breve entraremos em contato.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-brand-solid text-white py-3 px-6 rounded-lg font-semibold hover:bg-brand-solid_hover transition duration-100 ease-linear"
          >
            Fazer nova solicitação
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-display-md md:text-display-lg font-bold text-primary mb-4">
          Faça parte do Sindicato
        </h1>
        <p className="text-lg md:text-xl text-secondary">
          Una-se aos trabalhadores da indústria de bebidas que já contam com a força e proteção do sindicato.
          Juntos somos mais fortes na defesa dos nossos direitos.
        </p>
      </div>

      {/* Formulário de Sindicalização */}
      <div className="max-w-2xl mx-auto bg-primary rounded-xl shadow-xs-skeumorphic p-8 md:p-12">
        <h2 className="text-display-sm font-bold text-primary mb-2">
          Formulário de Sindicalização
        </h2>
        <p className="text-md text-secondary mb-8">
          Preencha os dados abaixo para iniciar seu processo de sindicalização.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome Completo */}
          <div>
            <label htmlFor="nomeCompleto" className="block text-sm font-medium text-secondary mb-2">
              Nome Completo <span className="text-error-600">*</span>
            </label>
            <input
              type="text"
              id="nomeCompleto"
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-focus-ring focus:border-brand-600 transition"
              placeholder="Seu nome completo"
            />
          </div>

          {/* CPF */}
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-secondary mb-2">
              CPF <span className="text-error-600">*</span>
            </label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-focus-ring focus:border-brand-600 transition"
              placeholder="000.000.000-00"
              pattern="\d{3}\.?\d{3}\.?\d{3}-?\d{2}"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
              E-mail <span className="text-error-600">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-focus-ring focus:border-brand-600 transition"
              placeholder="seu@email.com"
            />
          </div>

          {/* Celular */}
          <div>
            <label htmlFor="celular" className="block text-sm font-medium text-secondary mb-2">
              Celular <span className="text-error-600">*</span>
            </label>
            <input
              type="tel"
              id="celular"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-focus-ring focus:border-brand-600 transition"
              placeholder="(00) 00000-0000"
            />
          </div>

          {/* Data de Nascimento */}
          <div>
            <label htmlFor="dataNascimento" className="block text-sm font-medium text-secondary mb-2">
              Data de Nascimento <span className="text-error-600">*</span>
            </label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-focus-ring focus:border-brand-600 transition"
            />
          </div>

          {/* Empresa/Veículo */}
          <div>
            <label htmlFor="empresaVeiculo" className="block text-sm font-medium text-secondary mb-2">
              Empresa/Indústria onde trabalha
            </label>
            <input
              type="text"
              id="empresaVeiculo"
              name="empresaVeiculo"
              value={formData.empresaVeiculo}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-focus-ring focus:border-brand-600 transition"
              placeholder="Nome da empresa ou indústria de bebidas"
            />
          </div>

          {/* Cargo/Função */}
          <div>
            <label htmlFor="cargoFuncao" className="block text-sm font-medium text-secondary mb-2">
              Cargo/Função
            </label>
            <input
              type="text"
              id="cargoFuncao"
              name="cargoFuncao"
              value={formData.cargoFuncao}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-focus-ring focus:border-brand-600 transition"
              placeholder="Ex: Operador, Auxiliar de Produção, Motorista"
            />
          </div>

          {/* Assinatura Digital */}
          <SignaturePad onSignatureChange={setSignature} />

          {/* Termos */}
          <div className="flex items-start gap-3 pt-4">
            <input
              type="checkbox"
              id="declaracaoLida"
              checked={declaracaoLida}
              onChange={(e) => setDeclaracaoLida(e.target.checked)}
              required
              className="mt-1 h-4 w-4 text-brand-600 border-primary rounded focus:ring-brand-600"
            />
            <label htmlFor="declaracaoLida" className="text-sm text-secondary">
              Declaro que li e aceito os termos de sindicalização e autorizo o desconto da contribuição
              sindical conforme estabelecido em convenção coletiva. <span className="text-error-600">*</span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-sm text-error-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !signature}
            className="w-full bg-brand-solid text-white py-4 px-6 rounded-lg font-semibold
                     hover:bg-brand-solid_hover disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition duration-100 ease-linear shadow-xs"
          >
            {isSubmitting ? "Enviando..." : "Confirmar Sindicalização"}
          </button>
        </form>
      </div>
    </section>
  );
}
