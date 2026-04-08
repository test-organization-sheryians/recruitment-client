"use client"

import { useState, useEffect, useCallback } from "react"
import QRCode from "qrcode"

import ShareHeader from "./ShareHeader"
import PublicLinkSection from "./PublicLinkSection"
import SettingsPanel from "./SettingsPanel"
// import QuickShare from "./QuickShare"
import QRCodePanel from "./QRCodePanel"

type ShareSettings = {
  socialSharing: boolean
  passwordProtected: boolean
}

type Props = {
  isOpen: boolean
  onClose: () => void
  jobTitle: string
  jobRef: string
  applicationUrl: string
  onSave?: (settings: ShareSettings) => void
}

export default function ShareJobModal({
  isOpen,
  onClose,
  jobTitle,
  jobRef,
  applicationUrl,
  onSave,
}: Props) {
  const [settings, setSettings] = useState<ShareSettings>({
    socialSharing: true,
    passwordProtected: false,
  })


  const handleToggle = useCallback((key: keyof ShareSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const handleSave = () => {
    onSave?.(settings)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111218]/40 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-[#1a1e2e] w-full max-w-xl rounded-2xl shadow-2xl border border-[#dbdde6] dark:border-gray-700 overflow-hidden">
        <ShareHeader
          title={jobTitle}
          jobRef={jobRef}
          onClose={onClose}
        />

        <div className="px-8 py-6 space-y-8 max-h-[70vh] overflow-y-auto">
          <PublicLinkSection url={applicationUrl} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SettingsPanel
              settings={settings}
              onToggle={handleToggle}
            />

            <QRCodePanel
              applicationUrl={applicationUrl}
              jobTitle={jobTitle}
            />
          </div>
        </div>

        <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800/30 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg bg-[#1D4ED8] text-white text-sm font-bold hover:bg-blue-700 transition shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
