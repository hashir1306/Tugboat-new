import fitz  # PyMuPDF
import sys

def convert_pdf_to_png(pdf_path, output_png):
    try:
        doc = fitz.open(pdf_path)
        page = doc.load_page(0)  # first page
        # Get a high resolution image by scaling
        zoom = 4    # zoom factor
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat, alpha=True)
        pix.save(output_png)
        print("Conversion successful.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    convert_pdf_to_png("TUGBOAT LOGO FINAL.pdf", "assets/logo.png")
