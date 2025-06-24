import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Box, Button, TextField, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import { Add } from '@mui/icons-material';

Chart.register(...registerables);

export default function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', keyword: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  const addProduct = async () => {
    await axios.post('http://localhost:5000/api/products', newProduct);
    setNewProduct({ name: '', keyword: '' });
    fetchProducts();
  };

  const analyzeProduct = async (keyword) => {
    const res = await axios.post('http://localhost:5000/api/analyze', {
      keyword,
      maxVideos: 3,
      maxComments: 50
    });
    setAnalysis(res.data);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        YouTube Product Sentiment Analyzer
      </Typography>

      {/* Add Product Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Add New Product</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            fullWidth
          />
          <TextField
            label="Search Keyword"
            value={newProduct.keyword}
            onChange={(e) => setNewProduct({...newProduct, keyword: e.target.value})}
            fullWidth
          />
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={addProduct}
        >
          Add Product
        </Button>
      </Paper>

      {/* Product List */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Your Products</Typography>
        <List>
          {products.map(product => (
            <ListItem 
              key={product.id}
              button
              onClick={() => {
                setSelectedProduct(product);
                analyzeProduct(product.keyword);
              }}
              sx={{ 
                mb: 1,
                backgroundColor: selectedProduct?.id === product.id ? '#f5f5f5' : 'inherit'
              }}
            >
              <ListItemText 
                primary={product.name} 
                secondary={`Keyword: ${product.keyword}`} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Analysis Results */}
      {analysis && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Analysis for: {analysis.keyword}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {analysis.videos.map((video, index) => (
              <Paper key={index} sx={{ p: 2, width: 300 }}>
                <Typography variant="subtitle1">{video.title}</Typography>
                <Box sx={{ height: 200 }}>
                  <Pie data={{
                    labels: ['Positive', 'Negative', 'Neutral'],
                    datasets: [{
                      data: [video.stats.positive, video.stats.negative, video.stats.neutral],
                      backgroundColor: ['#4CAF50', '#F44336', '#FFC107']
                    }]
                  }} />
                </Box>
                <Typography variant="body2" sx={{ mt: 2 }}>Sample Comments:</Typography>
                <List dense>
                  {video.comments.map((comment, i) => (
                    <ListItem key={i} sx={{ py: 0.5 }}>
                      <ListItemText primary={comment} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}