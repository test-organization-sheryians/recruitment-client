import { SlidersHorizontal, Linkedin, Twitter, Mail } from "lucide-react"
import ToggleRow from "./ToggleRow"
import ShareButton from "./ShareButton"

type ShareSettings = {
  socialSharing: boolean
  passwordProtected: boolean
}

type Props = {
  settings: ShareSettings
  onToggle: (key: keyof ShareSettings) => void
}

export default function SettingsPanel({
  settings,
  onToggle,
}: Props) {
  return (
    <div className="space-y-2 mb-2">
      <h4 className="text-sm font-bold flex items-center gap-2 text-[#111218] dark:text-white">
        <SlidersHorizontal size={14} color="#1D4ED8" />
        Settings
      </h4>

      <div className="space-y-3">
        <ToggleRow
          label="Enable Social Sharing"
          description="Allow job preview on platforms"
          checked={settings.socialSharing}
          onChange={() => onToggle("socialSharing")}
        />

        <ToggleRow
          label="Password Protection"
          description="Require code to view details"
          checked={settings.passwordProtected}
          onChange={() => onToggle("passwordProtected")}
        />
      </div>

      {settings.socialSharing && (
        <div className="pt-4 space-y-3 mt-5">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Quick Share
          </p>

          <div className="flex gap-3">
            <ShareButton
              icon={<Linkedin className="w-5 h-5" />}
              bg="bg-[#0077b5]"
            />
            <ShareButton
              icon={<Twitter className="w-5 h-5" />}
              bg="bg-[#1DA1F2]"
            />
            <ShareButton
              icon={<Mail className="w-5 h-5" />}
              bg="bg-gray-200 dark:bg-gray-800"
              dark
            />
          </div>
        </div>
      )}
    </div>
  )
}
