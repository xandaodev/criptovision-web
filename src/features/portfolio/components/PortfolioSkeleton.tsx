export function PortfolioSkeleton() {
  return (
    <div className="portfolio-skeleton" role="status" aria-label="Carregando dashboard">
      <div className="portfolio-skeleton__metrics">
        {Array.from({ length: 4 }, (_, index) => (
          <span className="skeleton-block" key={index} />
        ))}
      </div>
      <div className="portfolio-skeleton__panels">
        <span className="skeleton-block" />
        <span className="skeleton-block" />
      </div>
    </div>
  )
}
