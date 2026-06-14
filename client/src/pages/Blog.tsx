import { Search, Calendar } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const blogPosts = [
    {
      id: 1,
      title: "Best Areas to Live in Nairobi in 2026",
      category: "Market News",
      excerpt: "Discover the most desirable neighborhoods in Nairobi for 2026, from family-friendly suburbs to vibrant urban centers.",
      date: "Feb 15, 2026",
      image: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800",
    },
    {
      id: 2,
      title: "Step-by-Step Guide to Buying Property in Kenya",
      category: "Guides",
      excerpt: "Navigate the Kenyan property market with confidence. Learn about the legal process, financing options, and key considerations.",
      date: "Feb 12, 2026",
      image: "/wambui-ESmWYVFII9I-unsplash.jpg",
    },
    {
      id: 3,
      title: "How to Avoid Rental Scams in Kenya",
      category: "Renting",
      excerpt: "Protect yourself from fraudulent landlords and fake listings. Essential tips for verifying properties and safe transactions.",
      date: "Feb 10, 2026",
      image: "/amani-nation-LTh5pGyvKAM-unsplash.jpg",
    },
    {
      id: 4,
      title: "Renting vs Buying – What Makes Sense in 2026?",
      category: "Investing",
      excerpt: "Analyze the current market trends to make an informed decision. Compare long-term costs, flexibility, and investment potential.",
      date: "Feb 8, 2026",
      image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800",
    },
    {
      id: 5,
      title: "How Much Do You Need to Buy a House in Nairobi?",
      category: "Buying",
      excerpt: "Breakdown of actual costs including deposit, legal fees, stamp duty, and hidden expenses. Realistic budgets for different neighborhoods.",
      date: "Feb 5, 2026",
      image: "/Karen.jpeg",
    }
  ];

  const categories = ["All", "Buying", "Renting", "Investing", "Market News", "Guides"];

  // Filter posts
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* ================= TOP SECTION ================= */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Big heading */}
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Maskani Insights
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-300 max-w-2xl mb-10">
            Real estate tips, market updates & property guides.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-12 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#FF8C00] outline-none"
              />
              <Search className="absolute right-4 top-4 text-gray-400 w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORY FILTERS ================= */}
      <section className="sticky top-0 bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 py-4 no-scrollbar">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full border transition-colors whitespace-nowrap font-medium ${
                  selectedCategory === category
                    ? "bg-[#FF8C00] text-white border-[#FF8C00]"
                    : "border-gray-200 hover:border-[#FF8C00] hover:text-[#FF8C00]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BLOG CARDS ================= */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => navigate(`/blog/${post.id}`)}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Category badge */}
                  <span className="absolute top-4 left-4 bg-[#FF8C00] text-white px-3 py-1 text-sm font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Date */}
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{post.date}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#FF8C00] transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Read more link */}
                  <div className="text-[#FF8C00] font-semibold hover:underline">
                    Read More →
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          // No results
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any articles matching your search.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="bg-[#FF8C00] hover:bg-[#e67e00] text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;
