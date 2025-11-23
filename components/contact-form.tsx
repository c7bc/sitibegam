"use client";

import { useState, FormEvent } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Máscara de telefone (XX) XXXXX-XXXX
const formatTelefone = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 15);
};

interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
}

interface ContactFormProps {
  contactInfo?: ContactInfo;
  siteId: string;
}

export default function ContactForm({ contactInfo, siteId }: ContactFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'telefone') {
      setFormData({ ...formData, [name]: formatTelefone(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/contact-submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          site: Number(siteId),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.message || 'Erro ao enviar mensagem');
      }

      setSuccess(true);
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        assunto: "",
        mensagem: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem');
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
          <h2 className="text-display-sm font-bold text-primary mb-4">Mensagem enviada!</h2>
          <p className="text-md text-secondary mb-6">
            Recebemos sua mensagem e entraremos em contato em breve.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-brand-solid text-white py-3 px-6 rounded-lg font-semibold hover:bg-brand-solid_hover transition duration-100 ease-linear"
          >
            Enviar nova mensagem
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-display-md md:text-display-lg font-bold text-primary mb-4">
          Entre em Contato
        </h1>
        <p className="text-lg md:text-xl text-secondary">
          Estamos aqui para ajudar. Envie sua mensagem e nossa equipe retornará o mais breve possível.
        </p>
      </div>

      {/* Formulário de Contato */}
      <div className="max-w-2xl mx-auto bg-primary rounded-xl shadow-xs-skeumorphic p-8 md:p-12">
        <h2 className="text-display-sm font-bold text-primary mb-2">
          Envie sua Mensagem
        </h2>
        <p className="text-md text-secondary mb-8">
          Preencha o formulário abaixo com suas informações e dúvidas.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-secondary mb-2"
            >
              Nome <span className="text-error-600">*</span>
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-focus-ring focus:border-brand-600 transition"
              placeholder="Seu nome"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-secondary mb-2"
            >
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

          {/* Telefone */}
          <div>
            <label
              htmlFor="telefone"
              className="block text-sm font-medium text-secondary mb-2"
            >
              Telefone <span className="text-error-600">*</span>
            </label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-focus-ring focus:border-brand-600 transition"
              placeholder="(00) 00000-0000"
            />
          </div>

          {/* Assunto */}
          <div>
            <label
              htmlFor="assunto"
              className="block text-sm font-medium text-secondary mb-2"
            >
              Assunto <span className="text-error-600">*</span>
            </label>
            <input
              type="text"
              id="assunto"
              name="assunto"
              value={formData.assunto}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-focus-ring focus:border-brand-600 transition"
              placeholder="Sobre o que deseja falar?"
            />
          </div>

          {/* Mensagem */}
          <div>
            <label
              htmlFor="mensagem"
              className="block text-sm font-medium text-secondary mb-2"
            >
              Mensagem <span className="text-error-600">*</span>
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              value={formData.mensagem}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-focus-ring focus:border-brand-600 transition resize-none"
              placeholder="Escreva sua mensagem aqui..."
            />
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
            disabled={isSubmitting}
            className="w-full bg-brand-solid text-white py-4 px-6 rounded-lg font-semibold
                     hover:bg-brand-solid_hover disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition duration-100 ease-linear shadow-xs"
          >
            {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
          </button>
        </form>
      </div>

      {/* Informações de Contato */}
      <div className="max-w-2xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 mx-auto mb-4 bg-brand-600 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-primary mb-2">Telefone</h3>
          <p className="text-sm text-secondary">{contactInfo?.phone || "(91) 3231-3059"}</p>
        </div>

        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 mx-auto mb-4 bg-brand-600 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-primary mb-2">E-mail</h3>
          <p className="text-sm text-secondary">{contactInfo?.email || "contato@sindicato.org.br"}</p>
        </div>

        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 mx-auto mb-4 bg-brand-600 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-primary mb-2">Endereço</h3>
          <p className="text-sm text-secondary">
            {contactInfo?.address || "Rua dos Radialistas, 123\nBelém - PA"}
          </p>
        </div>
      </div>
    </section>
  );
}
