import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase (only once)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default async function handler(req, res) {
  const { id } = req.query;
  
  // DEFAULT OG (homepage / no post ID)
  if (!id) {
    const defaultImage = '../assets/WISE.svg';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>W-GH TV – Empowering the Next Generation</title>
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://w-ghtv.com" />
  <meta property="og:title" content="W-GH TV – Empowering the Next Generation" />
  <meta property="og:description" content="News, documentaries, interviews and inspiring African stories." />
  <meta property="og:image" content="${defaultImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="W-GH TV" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="W-GH TV – Empowering the Next Generation" />
  <meta name="twitter:description" content="News, documentaries, interviews and inspiring African stories." />
  <meta name="twitter:image" content="${defaultImage}" />
  <meta http-equiv="refresh" content="0;url=/" />
  <link rel="canonical" href="https://w-ghtv.com" />
</head>
<body>
  <h1>W-GH TV – Empowering the Next Generation</h1>
  <p>Loading...</p>
</body>
</html>`);
  }

  // FETCH POST-SPECIFIC DATA
  try {
    const postRef = doc(db, 'posts', id);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      return res.status(404).send('Post not found');
    }
    
    const post = postSnap.data();
    const postImage = post.image || 'https://res.cloudinary.com/dfff3hdrf/image/upload/v1768046400/default-og-image_f5hzm7.png';
    const description = (post.content || '').substring(0, 160).replace(/[<>&"]/g, '');
    const title = (post.title || 'Blog Post').replace(/[<>&"]/g, '');
    const author = (post.author || 'W-GH TV').replace(/[<>&"]/g, '');
    
    // Return HTML with meta tags
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - W-GH TV</title>
  
  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://w-ghtv.com/posts/${id}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description || 'Read this article on W-GH TV'}">
  <meta property="og:image" content="${postImage}">
  <meta property="og:image:secure_url" content="${postImage}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${title}">
  <meta property="og:site_name" content="W-GH TV">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@wghtv">
  <meta name="twitter:creator" content="@wghtv">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description || 'Read this article on W-GH TV'}">
  <meta name="twitter:image" content="${postImage}">
  <meta name="twitter:image:alt" content="${title}">
  
  <!-- Article metadata -->
  <meta property="article:published_time" content="${post.date || new Date().toISOString()}">
  <meta property="article:author" content="${author}">
  ${post.category ? `<meta property="article:section" content="${post.category}">` : ''}
  
  <!-- Redirect to actual page after meta tags are read -->
  <meta http-equiv="refresh" content="0;url=/posts/${id}">
  <link rel="canonical" href="https://w-ghtv.com/posts/${id}">
</head>
<body>
  <h1>${title}</h1>
  <p>Loading post...</p>
  <script>
    // Immediate redirect for regular browsers
    if (!navigator.userAgent.match(/facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot|TelegramBot/i)) {
      window.location.href = "/posts/${id}";
    }
  </script>
</body>
</html>`);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).send('Internal server error: ' + error.message);
  }
}