// types/pdf-parse.d.ts   (save this file in your project root or types folder)

declare module 'pdf-parse' {
  // Proper PDF info/metadata structure (most common fields)
  interface PDFInfo {
    PDFFormatVersion?: string;
    IsAcroFormPresent?: boolean;
    IsXFAPresent?: boolean;
    Creator?: string;
    Producer?: string;
    CreationDate?: string;
    ModDate?: string;
    Title?: string;
    Author?: string;
    Subject?: string;
    Keywords?: string;
    [key: string]: unknown;
  }

  interface PDFMetadata {
    [key: string]: unknown;
  }

  // Page data passed to custom pagerender
  interface PageData {
    pageIndex: number;
    pageNumber: number;
    getTextContent: () => Promise<{
      items: Array<{
        str: string;
        dir: string;
        width: number;
        height: number;
        transform: number[];
        fontName: string;
      }>;
      styles: Record<string, unknown>;
    }>;
    getViewport: (options: { scale: number }) => { width: number; height: number };
    // Add more if you use them
  }

  // Return type
  export interface PdfParseResult {
    numpages: number;
    numrender: number;
    info: PDFInfo;
    metadata: PDFMetadata | null;
    text: string;
    version: string;
  }

  // Options
  export interface PdfParseOptions {
    pagerender?: (pageData: PageData) => Promise<string> | string;
    max?: number; // max pages to parse (default: 0 = all)
    version?: 'default' | 'v1_9_426' | 'v1_10_100' | 'v2_0_550'; // PDF.js version
  }

  // Main function
  function pdfParse(
    dataBuffer: Buffer | Uint8Array | ArrayBuffer,
    options?: PdfParseOptions
  ): Promise<PdfParseResult>;

  export = pdfParse;
}

// Also support the internal path some bundlers use
declare module 'pdf-parse/lib/pdf.js/src/pdf' {
  import pdfParse from 'pdf-parse';
  export = pdfParse;
}