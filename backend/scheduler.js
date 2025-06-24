const cron = require('node-cron');
const axios = require('axios');
const { Product, Analysis } = require('./models');
require('dotenv').config();

// Jadwal tiap hari jam 10 pagi
cron.schedule('0 10 * * *', async () => {
  console.log('Running scheduled analysis...');
  
  try {
    const products = await Product.findAll();
    
    for (const product of products) {
      const searchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: product.keyword,
          type: 'video',
          maxResults: 3,
          key: process.env.YOUTUBE_API_KEY
        }
      });

      for (const item of searchRes.data.items) {
        const commentsRes = await axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
          params: {
            part: 'snippet',
            videoId: item.id.videoId,
            maxResults: 50,
            key: process.env.YOUTUBE_API_KEY
          }
        });

        const comments = commentsRes.data.items.map(c => c.snippet.topLevelComment.snippet.textDisplay);
        const sentiments = comments.map(analyzeSentiment);

        await Analysis.create({
          product_id: product.id,
          video_id: item.id.videoId,
          positive: sentiments.filter(s => s === 'positive').length,
          negative: sentiments.filter(s => s === 'negative').length,
          neutral: sentiments.filter(s => s === 'neutral').length,
          comment_sample: JSON.stringify(comments.slice(0, 3))
        });
      }
    }
  } catch (error) {
    console.error('Scheduler error:', error);
  }
});

function analyzeSentiment(text) {
  // Sama seperti di server.js
}