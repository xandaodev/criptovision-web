type BrandProps = {
  compact?: boolean
}

export function Brand({ compact = false }: BrandProps) {
  return (
    <div className="brand" aria-label="CriptoVision">
      <span className="brand__mark" aria-hidden="true">
        CV
      </span>
      {!compact && (
        <span className="brand__copy">
          <strong>CriptoVision</strong>
          <small>Inteligência para sua carteira</small>
        </span>
      )}
    </div>
  )
}
