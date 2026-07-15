import io

from docx import Document as DocxDocument
from pypdf import PdfReader

class TextExtractorError(Exception):
    """Triggered when an error occurs during text extraction"""

def extract_text_from_document(document):
    """
    - Extracts text from Document's model instance based on file type
    - Will support both PDF and DOCX file types
    - TextExtractorError will be raised if the file type is not supported or if an error occurs during extraction
    """
    filename = document.file.name.lower()

    document.file.seek(0)  
    file_bytes = document.file.read()

    if filename.endswith('.pdf'):
        return extract_text_from_pdf(file_bytes)
    elif filename.endswith('.docx'):
        return extract_text_from_docx(file_bytes)
    else:
        raise TextExtractorError(f"Unsupported file type: {filename}, only PDF and DOCX are supported.")
    
def extract_text_from_pdf(file_bytes):
    try:
        pdf_reader = PdfReader(io.BytesIO(file_bytes)) 
        text_parts = [page.extract_text() or '' for page in pdf_reader.pages]
        text = '\n'.join(text_parts).strip()
    except Exception as e:
        raise TextExtractorError(f"Error extracting text from PDF: {str(e)}")

    if not text:
        raise TextExtractorError("No text found in the PDF document.")
    return text

def extract_text_from_docx(file_bytes):
    try:
        doc_reader = DocxDocument(io.BytesIO(file_bytes))
        text = '\n'.join([para.text for para in doc_reader.paragraphs]).strip()
    except Exception as e:
        raise TextExtractorError(f"Error extracting text from DOCX: {str(e)}")

    if not text:
        raise TextExtractorError("No text found in the DOCX document.")
    return text
