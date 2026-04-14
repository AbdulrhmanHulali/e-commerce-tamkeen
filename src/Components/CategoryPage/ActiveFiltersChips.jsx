const FilterChip = ({ label, onRemove }) => (
  <div className="filter-chip active-filter-chip rounded px-2 py-1 d-flex align-items-center shadow-sm bg-light border">
    <span className="text-muted-theme small fw-medium">{label}</span>
    <span
      className="ms-2 cursor-pointer fw-bold text-danger"
      onClick={onRemove}
    >
      &times;
    </span>
  </div>
);

export default function ActiveFiltersChips({ pageState }) {
  const { searchQuery, setSearchQuery, priceRange, maxLimit, clearAllFilters } =
    pageState;

  const hasSearch = searchQuery && searchQuery.trim() !== "";
  const hasPriceFilter = priceRange[0] > 0 || priceRange[1] < maxLimit;

  const hasFilters = hasSearch || hasPriceFilter;

  if (!hasFilters) return null;

  return (
    <div className="active-filters-container d-flex flex-wrap gap-2 mb-3 align-items-center text-start">
      {hasSearch && (
        <FilterChip
          label={`Search: "${searchQuery}"`}
          onRemove={() => setSearchQuery("")}
        />
      )}

      {hasPriceFilter && (
        <FilterChip
          label={`Price: ${priceRange[0]} - ${priceRange[1]}`}
          onRemove={clearAllFilters}
        />
      )}

      <span
        className="clear-all-btn text-accent cursor-pointer fw-medium ms-2 small text-decoration-underline"
        onClick={clearAllFilters}
      >
        Clear all filters
      </span>
    </div>
  );
}
