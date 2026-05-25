interface PageHeaderProps {
  title: string
  subtitle: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header>
      <h1>{title}</h1>
      <p className="lead">{subtitle}</p>
    </header>
  )
}
