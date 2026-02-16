"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"
import { Download } from "lucide-react"

type Props = {
  applicationUrl: string
  jobTitle: string
}

export default function QRCodePanel({
  applicationUrl,
  jobTitle,
}: Props) {
  const [qrSvg, setQrSvg] = useState<string>("")
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (!applicationUrl) return

    QRCode.toString(applicationUrl, {
      type: "svg",
      width: 256,
      margin: 2,
      color: {
        dark: "#111827",
        light: "#ffffff",
      },
    }).then(setQrSvg)
  }, [applicationUrl])

  const handleDownloadSVG = () => {
    if (!qrSvg) return

    const blob = new Blob([qrSvg], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${jobTitle.toLowerCase().replace(/\s+/g, "-")}-qr.svg`
    link.click()

    URL.revokeObjectURL(url)
    setShowMenu(false)
  }

  const downloadAsImage = (format: "png" | "jpg") => {
    if (!qrSvg) return

    const svgBlob = new Blob([qrSvg], { type: "image/svg+xml" })
    const url = URL.createObjectURL(svgBlob)
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const size = 512
      canvas.width = size
      canvas.height = size

      const ctx = canvas.getContext("2d")!
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)

      const link = document.createElement("a")
      link.href = canvas.toDataURL(
        format === "png" ? "image/png" : "image/jpeg",
        1
      )
      link.download = `${jobTitle
        .toLowerCase()
        .replace(/\s+/g, "-")}-qr.${format}`

      link.click()
      URL.revokeObjectURL(url)
      setShowMenu(false)
    }

    img.src = url
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#f9fafb] dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
      <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#111218] dark:text-white">
        Application QR Code
      </h4>

      <div className="bg-white p-3 rounded-lg shadow-sm">
        {qrSvg ? (
          <div
            className="qr-wrapper w-32 h-32 flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
        ) : (
          <div className="w-32 h-32 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
            Generating...
          </div>
        )}
      </div>

      <p className="text-[10px] text-gray-500 mt-4 text-center max-w-[150px]">
        Download and print this for offline posters and local hiring.
      </p>

      <div className="relative mt-4">
        <button
          onClick={() => setShowMenu((p) => !p)}
          className="text-[#1D4ED8] text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download
        </button>

        {showMenu && (
          <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-[#1a1e2e] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-28 z-50">
            <button
              onClick={handleDownloadSVG}
              className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              Download SVG
            </button>

            <button
              onClick={() => downloadAsImage("png")}
              className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              Download PNG
            </button>

            <button
              onClick={() => downloadAsImage("jpg")}
              className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              Download JPG
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
