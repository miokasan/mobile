require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const sequelize = require('./db'); // Tambahkan ini
const { Product, Analysis } = require('./models'); // Pastikan path benar

const app = express();
// ... kode lainnya tetap sama
app.use(cors());
app.use(express.json());

// Fungsi Analisis Sentimen
const analyzeSentiment = (text) => {
  const positiveWords = ['bagus', 'mantap', 'recommended', 'suka', 'keren'];
  const negativeWords = ['jelek', 'buruk', 'gak suka', 'rugi', 'menipu'];
  
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, '');
  let score = 0;

  positiveWords.forEach(word => cleanText.includes(word) && score++);
  negativeWords.forEach(word => cleanText.includes(word) && score--);

  return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
};

// Endpoint Produk
app.post('/api/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint Analisis
app.post('/api/analyze', async (req, res) => {
  try {
    const { keyword, maxVideos = 3, maxComments = 50 } = req.body;
    
    // Search Videos
    const searchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: keyword,
        type: 'video',
        maxResults: maxVideos,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    // Process Videos
    const videos = await Promise.all(searchRes.data.items.map(async (item) => {
      const commentsRes = await axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
        params: {
          part: 'snippet',
          videoId: item.id.videoId,
          maxResults: maxComments,
          key: process.env.YOUTUBE_API_KEY
        }
      });

      const comments = commentsRes.data.items.map(c => c.snippet.topLevelComment.snippet.textDisplay);
      const sentiments = comments.map(analyzeSentiment);
      
      const stats = {
        positive: sentiments.filter(s => s === 'positive').length,
        negative: sentiments.filter(s => s === 'negative').length,
        neutral: sentiments.filter(s => s === 'neutral').length
      };

      return {
        videoId: item.id.videoId,
        title: item.snippet.title,
        stats,
        comments: comments.slice(0, 3) // Sample comments
      };
    }));

    res.json({ keyword, videos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const { analyzeComments } = require('./utils/sentimentAnalysis');

// Di endpoint /api/analyze
app.post('/api/analyze', async (req, res) => {
  try {
    const { keyword, maxVideos = 3, maxComments = 50 } = req.body;

    // [Kode pencarian video tetap sama...]

    const videos = await Promise.all(searchRes.data.items.map(async (item) => {
      // [Kode ambil komentar tetap sama...]

      // Analisis sentimen
      const { results, stats } = analyzeComments(
        commentsRes.data.items.map(c => c.snippet.topLevelComment.snippet.textDisplay)
      );

      // Simpan ke database (jika perlu)
      await Analysis.create({
        product_id: product?.id, // Jika terkait produk
        video_id: item.id.videoId,
        positive: stats.positive,
        negative: stats.negative,
        neutral: stats.neutral,
        comment_sample: JSON.stringify(results.slice(0, 3)) // Simpan 3 contoh komentar
      });

      return {
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        stats,
        comments: results.slice(0, 5) // Ambil 5 komentar untuk ditampilkan
      };
    }));
    
    res.json({ keyword, videos });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync DB dan Start Server
sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});