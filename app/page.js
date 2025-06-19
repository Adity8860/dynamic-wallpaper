// app/page.jsx
// app/page.js
import HeroSection from "@/Components/Herosection";

export default async function HomePage() {
  // Define a broader or related keyword for fetching images
  const keywords = ["space", "stars", "galaxy", "night"];
  const relatedKeyword = keywords[Math.floor(Math.random() * keywords.length)];

  const res = await fetch(
    `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${relatedKeyword}&image_type=photo`,
    { cache: "no-store" } // Optional: Disable caching for fresh data
  );

  const data = await res.json();

  return (
    <div>
      <HeroSection images={data.hits} />
    </div>
  );
}
