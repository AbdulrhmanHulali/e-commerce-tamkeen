import { Collapse, Form, Button } from "react-bootstrap";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useSearchParams } from "react-router";

const FilterCollapse = ({ title, isOpen, onToggle, children }) => (
  <div className="filter-section">
    <div
      className="d-flex justify-content-between align-items-center mb-3 cursor-pointer"
      onClick={onToggle}
    >
      <h6 className="filter-title fw-bold mb-0">{title}</h6>
      {isOpen ? (
        <FaChevronUp className="text-muted-theme" size={12} />
      ) : (
        <FaChevronDown className="text-muted-theme" size={12} />
      )}
    </div>
    <Collapse in={isOpen}>
      <div>{children}</div>
    </Collapse>
  </div>
);

export default function FilterSidebar({ pageState }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategoryId = searchParams.get("category_id");

  const {
    categoriesList,
    openFilters,
    priceRange,
    setPriceRange,
    minPercent,
    maxPercent,
    maxLimit,
    applyPriceFilter,
    handleMinPriceChange,
    handleMaxPriceChange,
    toggleFilterSection,
  } = pageState;

  const handleCategorySelect = (catId) => {
    if (Number(currentCategoryId) === catId) return;

    const newParams = new URLSearchParams(searchParams);

    if (catId) {
      newParams.set("category_id", catId);
    } else {
      newParams.delete("category_id");
    }

    setSearchParams(newParams);
  };

  return (
    <div className="filter-sidebar text-start">

      <FilterCollapse
        title="Category"
        isOpen={openFilters.category}
        onToggle={() => toggleFilterSection("category")}
      >
        <ul className="list-unstyled mb-0 filter-list">
          <li
            className={`mb-2 cursor-pointer filter-category-item ${!currentCategoryId ? "fw-bold text-accent" : ""}`}
            onClick={() => handleCategorySelect(null)}
            style={{ transition: "0.3s" }}
            onMouseOver={(e) => {
              if (currentCategoryId)
                e.target.style.color = "var(--accent-color)";
            }}
            onMouseOut={(e) => {
              if (currentCategoryId) e.target.style.color = "";
            }}
          >
            All Categories
          </li>

          {categoriesList && categoriesList.length > 0 ? (
            categoriesList.map((cat) => (
              <li
                key={cat.id}
                className={`mb-2 cursor-pointer filter-category-item ${Number(currentCategoryId) === cat.id ? "fw-bold text-accent" : ""}`}
                onClick={() => handleCategorySelect(cat.id)}
                style={{ transition: "0.3s" }}
                onMouseOver={(e) => {
                  if (Number(currentCategoryId) !== cat.id)
                    e.target.style.color = "var(--accent-color)";
                }}
                onMouseOut={(e) => {
                  if (Number(currentCategoryId) !== cat.id)
                    e.target.style.color = "";
                }}
              >
                {cat.name}
              </li>
            ))
          ) : (
            <li className="text-muted small">Loading categories...</li>
          )}
        </ul>
      </FilterCollapse>

      <FilterCollapse
        title="Price range"
        isOpen={openFilters.price}
        onToggle={() => toggleFilterSection("price")}
      >
        <div className="range-slider-wrapper mb-4 px-1 mt-2">
          <div className="range-slider position-relative">
            <div
              className="progress"
              style={{
                insetInlineStart: `${minPercent}%`,
                insetInlineEnd: `${100 - maxPercent}%`,
                width: "auto",
              }}
            ></div>
            <input
              type="range"
              min="0"
              max={maxLimit}
              value={priceRange[0]}
              onChange={handleMinPriceChange}
              className="custom-range-input"
            />
            <input
              type="range"
              min="0"
              max={maxLimit}
              value={priceRange[1]}
              onChange={handleMaxPriceChange}
              className="custom-range-input"
            />
          </div>
        </div>
        <div className="d-flex align-items-end gap-2 mb-3">
          <div className="w-50">
            <label className="price-input-label d-block mb-1">Min</label>
            <Form.Control
              type="number"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              className="price-input shadow-none"
            />
          </div>
          <div className="w-50">
            <label className="price-input-label d-block mb-1">Max</label>
            <Form.Control
              type="number"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="price-input shadow-none"
            />
          </div>
        </div>
        <Button
          className="w-100 fw-bold apply-btn shadow-none"
          onClick={applyPriceFilter}
        >
          Apply
        </Button>
      </FilterCollapse>
    </div>
  );
}
