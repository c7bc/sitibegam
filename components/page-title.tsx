interface PageTitleProps {
  title: string
  description?: string
}

export default function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div className="border-b-2 border-brand-600 mb-6">
      <h1 className="text-2xl md:text-3xl font-medium text-gray-800 pb-2 tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-gray-500 pb-3">{description}</p>
      )}
    </div>
  )
}
