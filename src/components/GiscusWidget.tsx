import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const config = {
  repo: import.meta.env.VITE_GISCUS_REPO ?? '',
  repoId: import.meta.env.VITE_GISCUS_REPO_ID ?? '',
  category: import.meta.env.VITE_GISCUS_CATEGORY ?? '',
  categoryId: import.meta.env.VITE_GISCUS_CATEGORY_ID ?? '',
}

type GiscusWidgetProps = { language: 'en' | 'fr' }

export function GiscusWidget({ language }: GiscusWidgetProps) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const configured = Object.values(config).every((value) => Boolean(value?.trim()))

  useEffect(() => {
    const container = containerRef.current
    if (!container || !configured) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.dataset.repo = config.repo
    script.dataset.repoId = config.repoId
    script.dataset.category = config.category
    script.dataset.categoryId = config.categoryId
    script.dataset.mapping = 'specific'
    script.dataset.term = 'Portfolio guestbook'
    script.dataset.strict = '0'
    script.dataset.reactionsEnabled = '1'
    script.dataset.emitMetadata = '0'
    script.dataset.inputPosition = 'top'
    script.dataset.theme = 'light'
    script.dataset.lang = language

    container.replaceChildren(script)
    return () => container.replaceChildren()
  }, [configured, language])

  if (!configured) {
    return <p className="service-message">{t('contact.giscusSetup')}</p>
  }

  return <div className="giscus-embed giscus" ref={containerRef} aria-label={t('contact.giscusLabel')} />
}
