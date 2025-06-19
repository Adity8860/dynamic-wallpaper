// app/search/page.jsx
import ImageGrid from "@/Components/imageGrid.jsx";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/ui/pagination";

// Utility to sanitize query
const sanitizeQuery = (query) =>
  encodeURIComponent(query?.trim() || "red roses");

export default async function SearchPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = sanitizeQuery(resolvedSearchParams?.q);
  const page = parseInt(resolvedSearchParams?.page) || 1;
  const perPage = 20; // Number of images per page

  // Fetch data based on query and page
  let images = [];
  let totalHits = 0;
  try {
    const res = await fetch(
      `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${query}&image_type=photo&page=${page}&per_page=${perPage}`,
      { cache: "force-cache" } // Cache to reduce API calls
    );
    if (!res.ok) throw new Error(`Pixabay API error: ${res.status}`);
    const data = await res.json();
    images = Array.isArray(data.hits) ? data.hits : [];
    totalHits = data.totalHits || 0;
  } catch (error) {
    console.error("Failed to fetch images:", error.message);
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalHits / perPage);

  return (
    <div className="p-4">
      {/* <h2 className="text-2xl mb-4">Results for "{query}"</h2> */}
      {images.length > 0 ? (
        <ImageGrid images={images} />
      ) : (
        <p>No images found for "{query}". Try a different search term.</p>
      )}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={page > 1 ? `/search?q=${query}&page=${page - 1}` : "#"}
                aria-disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href={`/search?q=${query}&page=${pageNum}`}
                    isActive={pageNum === page}
                    className={pageNum === page ? "text-blue-500" : ""}
                    aria-current={pageNum === page ? "page" : undefined}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                href={
                  page < totalPages
                    ? `/search?q=${query}&page=${page + 1}`
                    : "#"
                }
                aria-disabled={page >= totalPages}
                className={
                  page >= totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
 
