/**
 * Firebase Cloud Function for Dynamic Open Graph Tags
 * Deploy this to handle social media sharing with proper images
 * 
 * Setup:
 * 1. npm install firebase-functions firebase-admin
 * 2. Deploy: firebase deploy --only functions
 * 3. Update firebase.json rewrites
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

/**
 * Generate HTML with Open Graph meta tags for social sharing
 */
function generateOGHTML(post, postId) {
  const siteUrl = 'https://w-ghtv.com'; // Replace with your actual domain
  const postUrl = `${siteUrl}/posts/${postId}`;
  
  // Create fallback OG image if none exists
  const createFallbackImage = () => {
    const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#fc561c;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ff8a5b;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#grad)"/>
      <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">W-GH TV</text>
      <text x="50%" y="52%" font-family="Arial, sans-serif" font-size="28" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle" opacity="0.95">${escapeHtml(post.title?.substring(0, 60) || '')}${post.title?.length > 60 ? '...' : ''}</text>
      <text x="50%" y="62%" font-family="Arial, sans-serif" font-size="20" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle" opacity="0.8">${post.category ? post.category.toUpperCase() : 'BLOG POST'}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  };
  
  const escapeHtml = (text) => {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  
  const title = escapeHtml(post.title || 'W-GH TV');
  const description = escapeHtml((post.content?.substring(0, 160) || post.title || 'Read this article on W-GH TV'));
  const image = post.image || createFallbackImage();
  const author = escapeHtml(post.author || 'W-GH TV');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  
  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:site_name" content="W-GH TV">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${postUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:secure_url" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${title}">
  <meta property="og:locale" content="en_US">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@wghtv">
  <meta name="twitter:url" content="${postUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:image:alt" content="${title}">
  
  <!-- Article -->
  <meta property="article:published_time" content="${post.date || new Date().toISOString()}">
  <meta property="article:author" content="${author}">
  ${post.category ? `<meta property="article:section" content="${escapeHtml(post.category)}">` : ''}
  
  <!-- Redirect to actual page after meta tags are read -->
  <meta http-equiv="refresh" content="0;url=${postUrl}">
  <link rel="canonical" href="${postUrl}">
  
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #fc561c, #ff8a5b);
      color: white;
    }
    .loader {
      text-align: center;
    }
    .spinner {
      border: 4px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top: 4px solid white;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="loader">
    <div class="spinner"></div>
    <p>Loading article...</p>
  </div>
  
  <script>
    // Fallback redirect if meta refresh doesn't work
    setTimeout(() => {
      window.location.href = '${postUrl}';
    }, 100);
  </script>
</body>
</html>`;
}

/**
 * Cloud Function to serve dynamic OG tags
 */
exports.generateOGTags = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  
  try {
    // Extract post ID from URL
    const pathParts = req.path.split('/');
    const postId = pathParts[pathParts.length - 1];
    
    if (!postId) {
      return res.redirect(303, 'https://w-ghtv.com');
    }
    
    // Fetch post from Firestore
    const postDoc = await db.collection('posts').doc(postId).get();
    
    if (!postDoc.exists) {
      console.log(`Post not found: ${postId}`);
      return res.redirect(303, 'https://w-ghtv.com');
    }
    
    const post = postDoc.data();
    
    // Generate and send HTML with OG tags
    const html = generateOGHTML(post, postId);
    res.set('Content-Type', 'text/html');
    res.status(200).send(html);
    
  } catch (error) {
    console.error('Error generating OG tags:', error);
    res.redirect(303, 'https://w-ghtv.com');
  }
});

/**
 * Alternative: Generate OG image dynamically using Canvas
 * Requires: npm install canvas
 */
exports.generateOGImage = functions.https.onRequest(async (req, res) => {
  try {
    const postId = req.query.id;
    
    if (!postId) {
      return res.status(400).send('Missing post ID');
    }
    
    const postDoc = await db.collection('posts').doc(postId).get();
    
    if (!postDoc.exists) {
      return res.status(404).send('Post not found');
    }
    
    const post = postDoc.data();
    
    // If post has an image, redirect to it
    if (post.image) {
      return res.redirect(post.image);
    }
    
    // Otherwise, generate a dynamic OG image
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(1200, 630);
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#fc561c');
    gradient.addColorStop(1, '#ff8a5b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);
    
    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('W-GH TV', 600, 250);
    
    // Add post title
    ctx.font = '28px Arial';
    const title = post.title?.substring(0, 60) || 'Blog Post';
    ctx.fillText(title, 600, 320);
    
    // Add category
    ctx.font = '20px Arial';
    ctx.globalAlpha = 0.8;
    const category = post.category ? post.category.toUpperCase() : 'ARTICLE';
    ctx.fillText(category, 600, 380);
    
    // Send image
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=31536000');
    res.send(canvas.toBuffer('image/png'));
    
  } catch (error) {
    console.error('Error generating OG image:', error);
    res.status(500).send('Error generating image');
  }
});