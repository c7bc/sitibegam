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

interface FormField {
  id: string;
  name: string;
  type: "text" | "email" | "tel" | "textarea";
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

interface FormSectionProps {
  title: string;
  description?: string;
  fields: FormField[];
  checkboxLabel?: string;
  checkboxRequired?: boolean;
  submitButtonText?: string;
  siteId?: string;
  apiEndpoint?: string;
  successMessage?: string;
  onSubmit?: (data: Record<string, string>) => void;
}

export default function FormSection({
  title,
  description,
  fields,
  checkboxLabel,
  checkboxRequired = false,
  submitButtonText = "Enviar",
  siteId,
  apiEndpoint,
  successMessage = "Cadastro realizado com sucesso!",
  onSubmit,
}: FormSectionProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Aplicar máscara para campos de telefone
    if (name === 'celular' || name === 'telefone') {
      setFormData({
        ...formData,
        [name]: formatTelefone(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (onSubmit) {
      await onSubmit(formData);
      setIsSubmitting(false);
      return;
    }

    // Default newsletter submission
    if (apiEndpoint && siteId) {
      try {
        const response = await fetch(`${API_URL}${apiEndpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nomeCompleto: formData.nome,
            email: formData.email,
            celular: formData.celular || '',
            newsletterAccepted: checkboxChecked,
            site: Number(siteId),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.errors?.[0]?.message || 'Erro ao enviar');
        }

        setSuccess(true);
        setFormData({});
        setCheckboxChecked(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao enviar');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <section className="bg-primary py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-success-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-display-sm font-bold text-primary mb-4">{successMessage}</h2>
            <p className="text-md text-secondary mb-6">
              Você receberá nossas novidades em breve.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="bg-brand-solid text-white py-3 px-6 rounded-lg font-semibold hover:bg-brand-solid_hover transition duration-100 ease-linear"
            >
              Fazer novo cadastro
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 md:mb-12">
            <h2 className="text-display-sm font-semibold text-primary md:text-display-md">
              {title}
            </h2>
            {description && (
              <p className="mt-4 text-lg text-tertiary md:text-xl">
                {description}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {fields.map((field) => (
              <div key={field.id} className="flex flex-col gap-1.5">
                <label
                  htmlFor={field.id}
                  className="text-sm font-medium text-secondary"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-error-primary"> *</span>
                  )}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={field.rows || 4}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="bg-primary px-3.5 py-2.5 text-md text-primary shadow-xs ring-1 ring-primary outline-hidden transition duration-100 ease-linear ring-inset placeholder:text-fg-quaternary focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:bg-disabled_subtle disabled:text-disabled resize-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="bg-primary px-3.5 py-2.5 text-md text-primary shadow-xs ring-1 ring-primary outline-hidden transition duration-100 ease-linear ring-inset placeholder:text-fg-quaternary focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:bg-disabled_subtle disabled:text-disabled"
                  />
                )}
              </div>
            ))}

            {checkboxLabel && (
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  required={checkboxRequired}
                  checked={checkboxChecked}
                  onChange={(e) => setCheckboxChecked(e.target.checked)}
                  className="mt-0.5 size-4 shrink-0 cursor-pointer accent-brand-solid"
                />
                <label
                  htmlFor="consent"
                  className="text-sm text-secondary cursor-pointer"
                >
                  {checkboxLabel}
                  {checkboxRequired && (
                    <span className="text-error-primary"> *</span>
                  )}
                </label>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
                <p className="text-sm text-error-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 bg-brand-solid px-5 py-3 text-md font-semibold text-fg-white shadow-xs outline-focus-ring transition duration-100 ease-linear hover:bg-brand-solid_hover focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-disabled disabled:text-fg-disabled disabled:shadow-none"
            >
              {isSubmitting ? "Enviando..." : submitButtonText}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
