type ApiErrorAlertProps = {
  message: string
}

export function ApiErrorAlert({ message }: ApiErrorAlertProps) {
  return (
    <div className="alert alert--error" role="alert">
      <strong>Não foi possível continuar</strong>
      <span>{message}</span>
    </div>
  )
}
