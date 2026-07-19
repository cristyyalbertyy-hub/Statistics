import { ACCOUNT_URL } from '../lib/firebase'

type ProgressSessionBannerProps = {
  visible: boolean
}

export function ProgressSessionBanner({ visible }: ProgressSessionBannerProps) {
  if (!visible) return null

  return (
    <aside className="progress-session-banner" role="status">
      <p>
        Para guardar o progresso do vídeo, abra esta app pela{' '}
        <a href={ACCOUNT_URL}>Minha Conta</a> (botão Open no pacote Statistics).
      </p>
    </aside>
  )
}
