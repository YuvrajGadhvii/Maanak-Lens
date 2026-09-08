/* js/ocrEngine.js — Tesseract.js wrapper */
const OCREngine = (function() {
  let worker = null;

  async function initWorker(onProgress) {
    if (!worker) {
      onProgress && onProgress({ status: 'Initializing OCR engine...', progress: 0.1 });
      worker = await Tesseract.createWorker({
        logger: m => {
          if (m.status === 'recognizing text' && onProgress) {
            onProgress({ status: 'Reading package text...', progress: m.progress });
          }
        }
      });
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
    }
    return worker;
  }

  async function recognize(imageFile, onProgress) {
    try {
      const w = await initWorker(onProgress);
      onProgress && onProgress({ status: 'Processing image...', progress: 0 });
      
      const { data: { text, confidence, words } } = await w.recognize(imageFile);
      
      return {
        success: true,
        text: text,
        confidence: confidence,
        words: words.map(w => ({ text: w.text, confidence: w.confidence }))
      };
    } catch (err) {
      console.error('OCR Error:', err);
      return { success: false, error: err.message || 'Failed to read text from image.' };
    }
  }

  return { recognize };
})();
