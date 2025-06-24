// Kamus kata positif/negatif dalam Bahasa Indonesia
const positiveWords = [
  'bagus', 'mantap', 'suka', 'keren', 'recommend', 'puas', 'senang', 
  'memuaskan', 'terbaik', 'fantastis', 'luar biasa', 'wow', 'top', 'oke'
];

const negativeWords = [
  'jelek', 'buruk', 'gak suka', 'menipu', 'rugi', 'kecewa', 'gagal',
  'sampah', 'menyesal', 'tidak puas', 'mengecewakan', 'parah', 'lemot'
];

// Fungsi utama analisis sentimen
function analyzeSentiment(text) {
  if (!text || typeof text !== 'string') return 'neutral';

  const cleanText = text.toLowerCase()
    .replace(/[^\w\s]/g, '') // Hapus simbol
    .replace(/\s+/g, ' ');

  let score = 0;
  const words = cleanText.split(' ');

  // Analisis kata per kata
  words.forEach(word => {
    if (positiveWords.includes(word)) score++;
    if (negativeWords.includes(word)) score--;
  });

  // Deteksi negasi (contoh: "tidak bagus")
  if (text.includes('tidak') || text.includes('ga ') || text.includes('gak ')) {
    score = -Math.abs(score); // Ubah ke negatif
  }

  // Deteksi penguatan (contoh: "sangat bagus")
  if (text.includes('sangat') || text.includes('banget')) {
    score *= 1.5;
  }

  // Klasifikasi akhir
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}

// Fungsi untuk analisis batch komentar
function analyzeComments(comments) {
  const results = comments.map(comment => ({
    text: comment,
    sentiment: analyzeSentiment(comment)
  }));

  const stats = {
    positive: results.filter(r => r.sentiment === 'positive').length,
    negative: results.filter(r => r.sentiment === 'negative').length,
    neutral: results.filter(r => r.sentiment === 'neutral').length,
    total: results.length
  };

  return { results, stats };
}

module.exports = { analyzeSentiment, analyzeComments };