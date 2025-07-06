import ImageGrid from "@/Components/imageGrid.jsx";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/ui/pagination";

const sanitizeQuery = (query) =>
  encodeURIComponent(query?.trim() || "red roses");

export default async function SearchPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q?.trim();
  const page = parseInt(resolvedSearchParams?.page) || 1;
  const perPage = 20;

  // Redirect if no query
  if (!query || query.length < 3) {
    return (
      <div className="p-4">
        <p>Please enter a search term with at least 3 characters.</p>
      </div>
    );
  }

  const sanitizedQuery = sanitizeQuery(query);
  let images = [];
  let totalHits = 0;
  let errorMessage = null;

  try {
    const res = await fetch(
      `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${sanitizedQuery}&image_type=photo&page=${page}&per_page=${perPage}`,
      { next: { revalidate: 3600 } } // Revalidate every hour
    );
    if (res.status === 429) {
      errorMessage = "Rate limit exceeded. Please try again later.";
    } else if (!res.ok) {
      throw new Error(`Pixabay API error: ${res.status}`);
    }
    const data = await res.json();
    console.log("Pixabay API response:", data); // Debug
    images = Array.isArray(data.hits)
      ? data.hits.filter((image) => image.webformatURL && typeof image.webformatURL === "string")
      : [];
    totalHits = data.totalHits || 0;
  } catch (error) {
    console.error("Failed to fetch images:", error.message);
    errorMessage = error.message;
  }

  const totalPages = Math.ceil(totalHits / perPage);
  const maxPagesToShow = 5;
  const startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  const pageRange = [...Array(endPage - startPage + 1)].map((_, i) => startPage + i);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Results for "{query}"</h2>
      {errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : images.length > 0 ? (
        <ImageGrid images={images} />
      ) : (
        <p>No images found for "{query}". Try a different search term.</p>
      )}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={page > 1 ? `/search?q=${sanitizedQuery}&page=${page - 1}` : "#"}
                aria-disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {pageRange.map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href={`/search?q=${sanitizedQuery}&page=${pageNum}`}
                  isActive={pageNum === page}
                  className={pageNum === page ? "text-blue-500" : ""}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={pageNum === page ? "page" : undefined}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={
                  page < totalPages
                    ? `/search?q=${sanitizedQuery}&page=${page + 1}`
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