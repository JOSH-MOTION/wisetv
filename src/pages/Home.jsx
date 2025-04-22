import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import WiseTvCarousel from '../components/Carousel';

// Import local images for mock posts
import pic1 from '../assets/pic1.jpg';
import pic2 from '../assets/pic2.jpg';
import pic3 from '../assets/pic3.jpg';
import pic4 from '../assets/pic4.jpg';
import pic5 from '../assets/pic5.jpg';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts: ' + error.message);
      setPosts([]); // Fallback to mockPosts if Firestore fails
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const mockPosts = [
    {
      id: 1,
      title: 'The Future of Renewable Energy',
      content: 'Exploring the latest innovations in solar and wind energy that could power the world sustainably.',
      date: '2025-04-10T10:00:00',
      category: 'documentaries',
      image: pic1,
    },
    {
      id: 2,
      title: 'Breaking News: Global Climate Summit 2025',
      content: 'World leaders gather to discuss urgent climate action in the 2025 Global Climate Summit.',
      date: '2025-04-09T15:30:00',
      category: 'news',
      image: pic2,
    },
    {
      id: 3,
      title: 'Investigative Report: Urban Farming Revolution',
      content: 'How urban farming is transforming cities and promoting sustainable living.',
      date: '2025-04-08T12:00:00',
      category: 'reports',
      image: pic3,
    },
    {
      id: 4,
      title: 'Interview with a Tech Innovator',
      content: 'A candid conversation with a tech innovator shaping the future of AI.',
      date: '2025-04-07T09:00:00',
      category: 'interviews',
      image: pic4,
    },
    {
      id: 5,
      title: 'Movie Premiere: "Echoes of Tomorrow"',
      content: 'A futuristic drama exploring the impact of technology on human relationships.',
      date: '2025-04-06T14:00:00',
      category: 'movies',
      image: pic5,
    },
    {
      id: 6,
      title: 'Photojournalism: Faces of Resilience',
      content: 'A powerful photo series capturing the resilience of communities facing adversity.',
      date: '2025-04-05T11:00:00',
      category: 'photojournalism',
      image: pic1,
    },
    {
      id: 7,
      title: 'Documentary: Oceans in Crisis',
      content: 'A deep dive into the challenges facing our oceans and what we can do to save them.',
      date: '2025-04-04T10:00:00',
      category: 'documentaries',
      image: pic2,
    },
    {
      id: 8,
      title: 'News Update: AI Breakthrough in Healthcare',
      content: 'A new AI technology promises to revolutionize healthcare diagnostics.',
      date: '2025-04-03T15:00:00',
      category: 'news',
      image: pic3,
    },
    {
      id: 9,
      title: 'Report: The Rise of Remote Work',
      content: 'An in-depth look at how remote work is reshaping the global workforce.',
      date: '2025-04-02T12:00:00',
      category: 'reports',
      image: pic4,
    },
    {
      id: 10,
      title: 'Interview: Climate Activist Speaks Out',
      content: 'A young climate activist shares their vision for a sustainable future.',
      date: '2025-04-01T09:00:00',
      category: 'interviews',
      image: pic5,
    },
    {
      id: 11,
      title: 'Movie: "The Last Frontier"',
      content: 'An epic adventure set in the uncharted wilderness of the future.',
      date: '2025-03-31T14:00:00',
      category: 'movies',
      image: pic1,
    },
    {
      id: 12,
      title: 'Photojournalism: Urban Life in 2025',
      content: 'A photo essay capturing the vibrancy of city life in the modern age.',
      date: '2025-03-30T11:00:00',
      category: 'photojournalism',
      image: pic2,
    },
  ];

  const categories = [
    'documentaries',
    'news',
    'reports',
    'interviews',
    'movies',
    'photojournalism',
    'environment',
    'sports',
    'politics',
    'technology',
    'education',
    'world',
  ];

  const displayPosts = posts.length > 0 ? posts : mockPosts;

  return (
    <div className="pt-20 bg-gray-50">
      {/* Error Display */}
      {error && <p className="text-red-600 text-center py-4">{error}</p>}

      {/* Hero Section with Carousel */}
      <WiseTvCarousel />

      {/* About WISE TV Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6 border-b-2 border-red-600 inline-block">
          About WISE TV
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          WISE TV is a pioneering online media platform dedicated to empowering the next generation
          and amplifying the voices of the masses. Our mission is to become a leading TV station that
          drives positive growth and impacts society through informative, inspiring, and engaging
          content. By providing a platform for diverse perspectives and stories, we aim to educate,
          motivate, and empower our audience to create a better future.
        </p>
      </section>

      {/* Featured Content Section with YouTube Embed */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6 border-b-2 border-red-600 inline-block">
          Featured Content
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
              src="https://www.youtube.com/embed/8hP9D6kZseM"
              title="Featured Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center border-b-2 border-red-600 inline-block">
          Latest Updates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPosts.slice(0, 6).map(post => (
            <Link
              key={post.id}
              to={`/${post.category}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  console.log(`Failed to load post image: ${post.title}`);
                  e.target.src = 'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=Image+Not+Found';
                }}
              />
              <div className="p-4">
                <span className="inline-block bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
                  {post.category.toUpperCase()}
                </span>
                <h4 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h4>
                <p className="text-gray-600 line-clamp-2">{post.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(post.date).toLocaleDateString()}
                </p>
                <span className="text-red-600 text-sm mt-2 block font-semibold hover:underline">
                  Read More
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categorized Sections */}
      {categories.map(category => (
        <section key={category} className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold capitalize border-b-2 border-red-600 inline-block">
              {category}
            </h3>
            <Link to={`/${category}`} className="text-red-600 hover:underline font-semibold">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPosts
              .filter(post => post.category === category)
              .slice(0, 3)
              .map(post => (
                <Link
                  key={post.id}
                  to={`/${category}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      console.log(`Failed to load post image: ${post.title}`);
                      e.target.src = 'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=Image+Not+Found';
                    }}
                  />
                  <div className="p-4">
                    <span className="inline-block bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
                      {category.toUpperCase()}
                    </span>
                    <h4 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h4>
                    <p className="text-gray-600 line-clamp-2">{post.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(post.date).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            {displayPosts.filter(post => post.category === category).length === 0 && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={`https://via.placeholder.com/300x200?text=${category}`}
                  alt={category}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <span className="inline-block bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded mb-2">
                    {category.toUpperCase()}
                  </span>
                  <h4 className="text-xl font-bold mb-2">
                    {`Latest in ${category.charAt(0).toUpperCase() + category.slice(1)}`}
                  </h4>
                  <p className="text-gray-600">Exciting {category} coming soon!</p>
                  <Link
                    to={`/${category}`}
                    className="text-red-600 text-sm mt-2 block font-semibold hover:underline"
                  >
                    View More
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;