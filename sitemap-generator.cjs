// sitemap-generator.cjs
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

const hostname = 'https://w-ghtv.com';
const sitemap = new SitemapStream({ hostname });

const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/blog', changefreq: 'daily', priority: 0.9 },
  { url: '/documentaries', changefreq: 'weekly', priority: 0.8 },
  { url: '/news', changefreq: 'daily', priority: 0.8 },
  { url: '/reports', changefreq: 'weekly', priority: 0.8 },
  { url: '/interviews', changefreq: 'weekly', priority: 0.8 },
  { url: '/movies', changefreq: 'weekly', priority: 0.8 },
  { url: '/photojournalism', changefreq: 'weekly', priority: 0.8 },
  { url: '/admin', changefreq: 'monthly', priority: 0.5 }
];

links.forEach(link => sitemap.write(link));
sitemap.end();

streamToPromise(sitemap)
  .then(data => {
    const sitemapPath = path.join(__dirname, 'dist', 'sitemap.xml');
    const writeStream = createWriteStream(sitemapPath);
    writeStream.write(data);
    writeStream.end();
    console.log(`✅ Sitemap successfully generated at ${sitemapPath}`);
  })
  .catch(err => {
    console.error('❌ Failed to generate sitemap:', err);
    process.exit(1);
  });