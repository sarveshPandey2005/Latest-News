const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection URL
const mongoURI = 'mongodb://localhost:27017/news'; // Make sure MongoDB is running on localhost:27017

// Define the News schema (adjust fields as per your database structure)
const newsSchema = new mongoose.Schema({
  source: String,
  author: String,
  title: String,
  description: String,
  url: String,
  image_url: String,  // This should be the URL to the image
  publishedAt: Date,
  content: String,
});

// Create a model from the schema
const News = mongoose.model('News', newsSchema);

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Fetch and return random 10 news from the MongoDB database
app.get('/api/fetch-news', async (req, res) => {
  try {
    // Fetch random 10 news articles from MongoDB
    const news = await News.aggregate([{ $sample: { size: 10 } }]);

    // Check if we have any news articles
    if (!news || news.length === 0) {
      return res.status(404).json({ error: 'No news articles found' });
    }

    // Base URL for images, ensure that this matches where your images are hosted
    const baseUrl = 'https://yourdomain.com'; // Change this to your actual domain

    // Map and return the news with the required structure
    const formattedNews = news.map(article => ({
      source: article.source,
      author: article.author || 'Unknown',
      title: article.title,
      description: article.description,
      url: article.url,
      // Ensure the image URL is complete by prepending the base URL
      image_url: article.image_url && !article.image_url.startsWith('http')
        ? `${baseUrl}${article.image_url}`
        : article.image_url, 
      publishedAt: article.publishedAt,
      content: article.content,
    }));

    // Return the news articles as JSON
    res.status(200).json(formattedNews);
  } catch (err) {
    console.error('Error fetching news from MongoDB:', err);
    const fallbackNews = [{
      title: 'Failed to fetch news',
      description: 'There was an issue fetching the news from the database. Please try again later.',
      url: '#',
      image_url: '',
      publishedAt: new Date().toISOString(),
      content: 'There was an issue fetching the news from the database.',
    }];
    res.status(500).json(fallbackNews);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server is running on port ${PORT}`);
});
