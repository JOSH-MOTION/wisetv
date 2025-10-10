// sitemap-generator.cjs
// This script runs after the Vite build to generate sitemap.xml in the 'dist' folder.
// Using the .cjs extension allows us to use 'require' syntax when package.json is "type": "module".

const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');
const path = require('path');

// NOTE: Replace this with your actual production domain!
const BASE_URL = 'https://w-ghtv.com/';

// Define the static routes of your application.
// For dynamic routes (like /films/123), you would need to fetch them from a data source.
const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/films', changefreq: 'weekly', priority: 0.8 },
    { url: '/series', changefreq: 'weekly', priority: 0.8 },
    { url: '/about', changefreq: 'monthly', priority: 0.7 },
    { url: '/contact', changefreq: 'monthly', priority: 0.6 },
    { url: '/admin', changefreq: 'daily', priority: 1.0 },
    // Add any other top-level routes here
];

const sitemap = new SitemapStream({ hostname: BASE_URL });
const sitemapPath = path.resolve(__dirname, 'dist', 'sitemap.xml');

// Asynchronously generate the sitemap
streamToPromise(sitemap)
    .then(data => {
        // Write the generated XML data to the file system
        fs.writeFileSync(sitemapPath, data.toString());
        console.log(`✅ Sitemap successfully generated at ${sitemapPath}`);
    })
    .catch(err => {
        console.error('❌ Error generating sitemap:', err);
    });

// Pipe the links to the stream
links.forEach(link => sitemap.write(link));

// End the stream
sitemap.end();