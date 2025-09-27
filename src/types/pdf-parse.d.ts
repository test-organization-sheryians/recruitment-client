declare module 'pdf-parse' {
  interface ParsedPDF {
    numpages: number;
    numrender: number;
    info: {
      [key: string]: any;
    };
    metadata: {
      [key: string]: any;
    };
    text: string;
    version: string;
  }

  interface ParseOptions {
    max?: number;
    version?: string;
    pagerender?: (pageData: any) => string;
  }

  function PDFParse(
    buffer: Buffer | Uint8Array,
    options?: ParseOptions
  ): Promise<ParsedPDF>;

  export = PDFParse;
}

declare module 'pdf-parse/lib/pdf-parse.js' {
  import PDFParse from 'pdf-parse';
  export = PDFParse;
}