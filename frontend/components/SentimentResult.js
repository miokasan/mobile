import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import { 
  SentimentSatisfiedAlt as PositiveIcon,
  SentimentDissatisfied as NegativeIcon,
  SentimentNeutral as NeutralIcon 
} from '@mui/icons-material';

const SentimentResult = ({ data }) => {
  if (!data) return null;

  const chartData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [{
      data: [data.stats.positive, data.stats.negative, data.stats.neutral],
      backgroundColor: ['#4CAF50', '#F44336', '#FFC107']
    }]
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Sentiment Analysis Results
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {/* Pie Chart */}
        <Box sx={{ width: 300, height: 300 }}>
          <Pie data={chartData} />
        </Box>

        {/* Statistik */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Distribution
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip 
              icon={<PositiveIcon />} 
              label={`Positive: ${data.stats.positive} (${Math.round(data.stats.positive / data.stats.total * 100)}%)`} 
              color="success" 
            />
            <Chip 
              icon={<NegativeIcon />} 
              label={`Negative: ${data.stats.negative} (${Math.round(data.stats.negative / data.stats.total * 100)}%)`} 
              color="error" 
            />
            <Chip 
              icon={<NeutralIcon />} 
              label={`Neutral: ${data.stats.neutral} (${Math.round(data.stats.neutral / data.stats.total * 100)}%)`} 
              color="warning" 
            />
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Total Comments Analyzed: {data.stats.total}
          </Typography>
        </Box>
      </Box>

      {/* Contoh Komentar */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="subtitle1" gutterBottom>
        Sample Comments
      </Typography>
      <List dense>
        {data.comments.map((comment, index) => (
          <ListItem 
            key={index}
            sx={{ 
              mb: 1,
              borderLeft: `4px solid ${
                comment.sentiment === 'positive' ? '#4CAF50' :
                comment.sentiment === 'negative' ? '#F44336' : '#FFC107'
              }`
            }}
          >
            <ListItemText
              primary={comment.text}
              secondary={
                <>
                  <Chip 
                    label={comment.sentiment} 
                    size="small"
                    sx={{ 
                      mr: 1,
                      backgroundColor: 
                        comment.sentiment === 'positive' ? '#E8F5E9' :
                        comment.sentiment === 'negative' ? '#FFEBEE' : '#FFF8E1'
                    }}
                  />
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SentimentResult;