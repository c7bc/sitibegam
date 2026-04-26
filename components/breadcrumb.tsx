export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="bg-[#f2f2f2] border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-3">
        <nav className="text-sm text-gray-500">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1
            const label = item.label.length > 60 ? item.label.slice(0, 60) + '…' : item.label
            return (
              <span key={`${idx}-${item.label}`}>
                {idx > 0 && <span className="mx-2">»</span>}
                {item.href && !isLast ? (
                  <a href={item.href} className="hover:text-brand-600 transition">
                    {label}
                  </a>
                ) : (
                  <span className={isLast ? 'text-gray-700' : ''}>{label}</span>
                )}
              </span>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
