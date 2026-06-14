import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const BlogDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // All blog posts with full content
  const blogPosts = [
    {
      id: 1,
      title: "Best Areas to Live in Nairobi in 2026",
      category: "Market News",
      date: "Feb 15, 2026",
      image:
        "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=1600",
      content: `
        <p class="mb-6">Nairobi has many distinct neighborhoods. Based on recent trends, here are the top areas to consider in 2026:</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">Kasarani</h3>
        <p class="mb-4">A middle-income suburb off Thika Highway. It's relatively affordable – one-bedroom rents start around KSh 14,000/month. Major landmarks include Moi International Sports Centre (Kasarani Stadium) and the Thika Road Mall. The improved roads (Thika Superhighway) and new shopping areas make Kasarani popular for its value. In short, Kasarani offers affordable rents and good roads.</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">Ruiru</h3>
        <p class="mb-4">A rapidly growing town north of Nairobi along Thika Superhighway. One-bedroom apartments here rent roughly KSh 10,000–18,000 – much cheaper than central estates. Ruiru hosts the new Tatu City development (a Special Economic Zone) and has its own malls and amenities. Recent bypass and highway projects have cut commute times (about 30–40 minutes to town), making Ruiru the next big thing on Nairobi's outskirts.</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">Kilimani</h3>
        <p class="mb-4">A well-established, upscale area. Kilimani is highly connected and walkable, with many cafés, gyms, shops and entertainment options. It's popular with young professionals and expats and even hosts several embassies. Because of its central location and amenities, Kilimani is relatively expensive – one-bedroom rents are around KSh 50,000/month. In simple terms, it's for those who want urban conveniences right at their doorstep.</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">Donholm</h3>
        <p class="mb-4">Located in the Eastlands (east Nairobi), Donholm is an older estate now serving mainly middle-income families. It's about 8 km east of the CBD, making it reasonably close to Industrial Area and Eastern Nairobi jobs. Donholm is quieter and more affordable than city-center neighborhoods, suitable for families and people working in Eastlands.</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">Kitengela</h3>
        <p class="mb-4">Although outside Nairobi city limits (in Kajiado County), Kitengela is a fast-growing suburb south of Nairobi. It offers more space and fresh air – many larger plots and new housing developments are available. Infrastructure improvements (like the Nairobi Expressway) have cut the drive to Nairobi to under an hour. Rental demand in Kitengela has been rising (about +11% in recent years). It's still relatively affordable compared to city estates, ideal for those seeking room and a quick commute.</p>
        
        <div class="bg-gray-50 p-6 rounded-lg mt-8">
          <p class="font-semibold text-lg mb-2">Bottom line:</p>
          <p>Each area has trade-offs. Central areas like Kilimani cost more but have amenities close by, while satellite suburbs like Kasarani, Ruiru, and Kitengela offer lower rents. Consider your budget and work location: Nairobi's traffic is heavy (one-way commutes often exceed an hour), so living near your job can save time and money.</p>
        </div>
      `,
    },
    {
      id: 2,
      title: "Step-by-Step Guide to Buying Property in Kenya",
      category: "Guides",
      date: "Feb 12, 2026",
      image: "/wambui-ESmWYVFII9I-unsplash.jpg",
      content: `
        <p class="mb-6">Buying a home in Kenya involves legal checks and payments. Here is a simple roadmap:</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">1. Research Properties</h3>
        <p class="mb-4">Look at different areas and compare prices. Visit properties on-site (ideally on weekends when sellers are home). Talk to neighbors or agents and check what comparable homes go for. This due diligence is crucial to avoid fraud.</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">2. Verify Title Deed</h3>
        <p class="mb-4">Before paying anything, confirm that the seller truly owns the land. Conduct an official land search (through the Lands Ministry or the online Ardhi Sasa portal). This search (fee ~KSh 500) will reveal the registered owner and any existing loans or caveats on the title. Only proceed if the seller's name matches and there are no encumbrances.</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">3. Hire a Lawyer</h3>
        <p class="mb-4">Engage a reputable real estate lawyer. An advocate will review all documents, ensure the title is clean, and handle contracts. Legal fees are typically around 1–3% of the property value (for a KSh 5M house, that's ~KSh 50K–150K) plus disbursements. Skipping a lawyer is risky – a good lawyer protects you from scams and errors.</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">4. Sign Sale Agreement & Pay Deposit</h3>
        <p class="mb-4">Once the seller confirms the title, your lawyer prepares a sale agreement. Sign it with all parties and witnesses. As a rule, you pay a deposit of about 10% of the purchase price at this time. For example, a KSh 2M land might require a KSh 200K deposit. The deposit shows your commitment (and is held by your lawyer or in escrow). The agreement should stipulate how and when the balance will be paid.</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">5. Transfer & Pay Remaining Fees</h3>
        <p class="mb-4">After signing, pay the remaining 90% (often financed by mortgage or personal funds). Simultaneously, handle government fees: most importantly, stamp duty. For urban properties (like Nairobi houses), stamp duty is 4% of the property value. For example, a KSh 5M house incurs KSh 200,000 in stamp duty. Also pay any mortgage or bank processing fees (usually ~0.1% of loan) and ensure the seller settles any outstanding land rates.</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">6. Register New Title</h3>
        <p class="mb-4">Finally, submit the signed sale agreement, proof of stamp duty payment, and other documents to the Lands Registry. The new title deed will be issued in your name. In practice, this whole transfer and registration process typically takes 6–12 weeks. Once complete, you will receive the title deed bearing your name, officially making you the owner.</p>
        
        <div class="bg-yellow-50 p-6 rounded-lg mt-8">
          <p class="font-semibold text-lg mb-2">Pro Tip:</p>
          <p>Always pay using bank transfers or banker's cheques (not cash), and keep receipts for every payment. Never finalize anything without written documentation.</p>
        </div>
      `,
    },
    {
      id: 3,
      title: "How to Avoid Rental Scams in Kenya",
      category: "Renting",
      date: "Feb 10, 2026",
      image: "/amani-nation-LTh5pGyvKAM-unsplash.jpg",
      content: `
        <p class="mb-6">Rental fraud is common. Protect yourself with these warnings and tips:</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">Watch for "Too Good To Be True" Offers</h3>
        <p class="mb-4">If a listing's price is far below market (e.g. a 3-bedroom flat in Kilimani for KSh 15,000), be suspicious. Scammers lure victims with unrealistically low rents. Always compare with local rental rates (a 4M house generally rents for about KSh 20K–40K/month).</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">Beware of Remote Landlords</h3>
        <p class="mb-4">If someone claiming to be the landlord never meets you in person or says they're always "out of town", that's a major red flag. A genuine landlord will gladly show you the property. If the "landlord" only communicates by phone or email and pressures you to pay without meeting, stop the deal.</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">Insist on Viewing the Property</h3>
        <p class="mb-4">Always visit the house or apartment before any payment. Do a thorough walkthrough, inside and out, to confirm it exists and matches the listing. If you can't go yourself, send a trusted friend or family member. Never pay for a viewing or any service before seeing the place; scammers might create fake listings or even give you a tour of an empty unit that isn't theirs.</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">Never Pay Before Signing a Lease</h3>
        <p class="mb-4">Legitimate landlords will have a written lease. Do not send any money (deposit or rent) until you've signed a proper rental agreement. Get a receipt for every payment. Scammers often ask for cash upfront to "hold" the house. In contrast, a real landlord will require signing a lease first and only then accept payment.</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">✅ Verify the Owner</h3>
        <p class="mb-4">Ask to see the landlord's ID and the title deed (or be present at the Lands Registry search). You can also casually speak to neighbors to confirm the landlord's identity. If you're dealing through an agent, ensure they're registered with the Estate Agents Registration Board.</p>
        
        <div class="bg-red-50 p-6 rounded-lg mt-8">
          <p class="font-semibold text-lg mb-2">Summary:</p>
          <p>Always be cautious, visit first, document everything, and don't rush. A trustworthy property transaction lets you inspect first, shows a lease, and provides receipts. If something feels off, move on.</p>
        </div>
      `,
    },
    {
      id: 4,
      title: "Renting vs Buying – What Makes Sense in 2026?",
      category: "Investing",
      date: "Feb 8, 2026",
      image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=1600",
      content: `
        <p class="mb-6">Deciding whether to rent or buy depends on your situation and the market:</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">Buy if:</h3>
        <ul class="list-disc pl-6 mb-6">
          <li class="mb-2">You have steady income and savings, and can afford a down payment (typically 10–20% of price)</li>
          <li class="mb-2">You plan to stay in one place at least 5 years</li>
          <li class="mb-2">You want to build wealth: owning means you earn any appreciation (Kenyan property values have grown ~5–15% annually in good areas)</li>
          <li class="mb-2">You're tired of yearly moves and want stability</li>
        </ul>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">Rent if:</h3>
        <ul class="list-disc pl-6 mb-6">
          <li class="mb-2">Your job may relocate you soon</li>
          <li class="mb-2">You lack the sizable deposit or don't have cash for closing costs (~30% total of the home price)</li>
          <li class="mb-2">You need flexibility or aren't ready for maintenance responsibilities</li>
          <li class="mb-2">Renting lets you live somewhere without the large upfront costs or long-term commitment</li>
        </ul>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">Quick Math Example:</h3>
        <p class="mb-2">Suppose a house costs KSh 4,000,000.</p>
        <p class="mb-2">• A 20% deposit is KSh 800,000</p>
        <p class="mb-2">• A 15-year mortgage on the balance might run ~KSh 40–50K per month</p>
        <p class="mb-4">• A similar home might rent for ~KSh 20–40K per month</p>
        <p>Over time, buying means after 15 years you own the house (and any increase in value), whereas renting means you've paid KSh 25K×180 = KSh 4.5M in rent and own nothing.</p>
        
        <div class="bg-blue-50 p-6 rounded-lg mt-8">
          <p class="font-semibold text-lg mb-2">2026 Take:</p>
          <p>If you can afford it and plan to stay long-term, buying can be advantageous (rents tend to rise each year, but your mortgage is fixed). If not, renting offers short-term freedom and lower initial costs. Use calculators or consult a financial advisor to compare your own numbers (deposits, interest rates, projected rent increases) to make an informed choice.</p>
        </div>
      `,
    },
    {
      id: 5,
      title: "How Much Do You Need to Buy a House in Nairobi?",
      category: "Buying",
      date: "Feb 5, 2026",
      image: "/Karen.jpeg",
      content: `
        <p class="mb-6">Aside from the sale price, factor in these costs (for a KSh 5,000,000 house as example):</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">Deposit</h3>
        <p class="mb-4">Banks usually require 10–20% down. For a KSh 5M house, that's KSh 500,000–1,000,000. Some lenders (e.g. SACCOs or government programs) may accept as low as 10%.</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">⚖️ Legal Fees</h3>
        <p class="mb-4">Lawyer's conveyancing fees are typically 1–3% of price (~KSh 50–150K), plus disbursements.</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">Stamp Duty</h3>
        <p class="mb-4">4% of the property's value in urban areas. On 5M that's ~KSh 200,000. (In rural areas it's 2%.)</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">Valuation Fee</h3>
        <p class="mb-4">Banks often require a valuation. This is usually around KSh 10,000–15,000.</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">Land Search and Registration</h3>
        <p class="mb-4">A land search costs about KSh 500. Stamping the sale agreement adds a small fee (about KSh 200–500). Land registration can add another ~KSh 20,000 (for processes like writing new title).</p>
        
        <h3 class="text-2xl font-bold mt-8 mb-3">➕ Other Costs</h3>
        <p class="mb-4">Save for 10% VAT on legal fees (currently 16%), stamp duty forms KSh ~5,000, etc.</p>
        
        <div class="bg-green-50 p-6 rounded-lg mt-8">
          <p class="font-semibold text-xl mb-3">Estimated Total (for a KSh 5M house):</p>
          <p class="text-3xl font-bold text-green-700 mb-3">KSh 1.35M – 1.9M</p>
          <p class="mb-2">Add up deposit (1.0–1.5M), legal & statutory fees (~KSh 350K), valuations/search (~20K), etc.</p>
          <p class="font-semibold">This is what you need before even taking a loan. In short, budget at least 25–30% of the property price to cover all upfront costs (deposit + fees). It's wise to also have an extra KSh ~200K for unexpected expenses and moving costs.</p>
        </div>
        
        <p class="mt-6">With thorough preparation and budgeting, you can avoid surprises. Remember to pay all fees through official channels (keep receipts) and confirm payments when registering the title.</p>
      `,
    },
  ];

  // Find the post
  const post = blogPosts.find(p => p.id === Number(id));

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <button
            onClick={() => navigate('/blog')}
            className="bg-[#FF8C00] text-white px-6 py-3 rounded-lg hover:bg-[#e67e00]"
          >
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center text-gray-600 hover:text-[#FF8C00] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to all articles
        </button>
      </div>

      {/* Featured image */}
      <div className="relative h-[400px] w-full mt-4">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Article content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Category badge */}
        <span className="bg-[#FF8C00] text-white px-4 py-2 text-sm font-bold rounded-full inline-block mb-6">
          {post.category}
        </span>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {post.title}
        </h1>

        {/* Date */}
        <div className="flex items-center text-gray-500 mb-8 pb-8 border-b">
          <Calendar className="w-5 h-5 mr-2" />
          <span>{post.date}</span>
        </div>

        {/* Main content */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

     </article>
    </div>
  );
};

export default BlogDetails;
