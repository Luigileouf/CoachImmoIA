import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import workerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

type PdfKnowledge = {
  pageCount: number;
  fullText: string;
  summary: string;
  chunks: string[];
  notes: string[];
};

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").replace(/\u0000/g, "").trim();
}

function buildChunks(text: string, maxLength = 1200, overlap = 180) {
  const chunks: string[] = [];
  const cleanText = normalizeText(text);

  if (!cleanText) {
    return chunks;
  }

  let cursor = 0;

  while (cursor < cleanText.length) {
    const sliceEnd = Math.min(cleanText.length, cursor + maxLength);
    let nextBreak = cleanText.lastIndexOf(". ", sliceEnd);

    if (nextBreak <= cursor + Math.floor(maxLength * 0.5)) {
      nextBreak = cleanText.lastIndexOf(" ", sliceEnd);
    }

    const end = nextBreak > cursor ? nextBreak + 1 : sliceEnd;
    const chunk = cleanText.slice(cursor, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end >= cleanText.length) {
      break;
    }

    cursor = Math.max(end - overlap, cursor + 1);
  }

  return chunks;
}

export async function extractPdfKnowledge(file: File): Promise<PdfKnowledge> {
  const data = new Uint8Array(await file.arrayBuffer());
  const document = await pdfjs.getDocument({ data }).promise;
  const pageTexts: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = normalizeText(
      textContent.items
        .map((item) => ("str" in item && typeof item.str === "string" ? item.str : ""))
        .join(" "),
    );

    if (pageText) {
      pageTexts.push(pageText);
    }
  }

  const fullText = pageTexts.join("\n\n").trim();

  if (!fullText) {
    throw new Error(
      "Le PDF a ete televerse, mais aucun texte exploitable n'a pu etre extrait. Il s'agit peut-etre d'un scan image ou d'un PDF non textuel.",
    );
  }

  const chunks = buildChunks(fullText);
  const notes = [
    `PDF extrait automatiquement · ${document.numPages} page(s)`,
    ...pageTexts.slice(0, 2).map((pageText, index) => `Apercu page ${index + 1} : ${pageText.slice(0, 180)}`),
  ];

  return {
    pageCount: document.numPages,
    fullText,
    summary: fullText.slice(0, 280),
    chunks,
    notes,
  };
}
