import { NextResponse } from "next/server";

const getPdfParse = async () => {
  const { default: PdfParse } = await import('pdf-parse/lib/pdf-parse.js');
  return PdfParse;
};

export const POST = async (req: Request) => {
  try {
    const arrayBuffer = await req.arrayBuffer();

    if (arrayBuffer.byteLength > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    }

    const buffer = Buffer.from(arrayBuffer);

    const PdfParse = await getPdfParse();
    const parsed = await PdfParse(buffer, {
      max: 0,
    });

    if (!parsed.text || parsed.text.trim().length === 0) {
      return NextResponse.json({ error: "No text found in PDF" }, { status: 400 });
    }

    return NextResponse.json({
      text: parsed.text.trim(),
      pages: parsed.numpages,
      info: parsed.info
    });

  } catch (err) {
    console.error("PDF parsing error:", err);
    return NextResponse.json({
      error: err instanceof Error ? err.message : "Failed to parse PDF"
    }, { status: 500 });
  }
};