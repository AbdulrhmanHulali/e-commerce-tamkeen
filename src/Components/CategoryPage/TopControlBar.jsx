import { Form, Button, Collapse, Dropdown } from "react-bootstrap";
import { FaThLarge, FaList, FaSort, FaFilter } from "react-icons/fa";
import FilterSidebar from "./FilterSidebar";
import { useSearchParams } from "react-router";

export default function TopControlBar({ pageState }) {
  const {
    pagination,
    viewMode,
    setViewMode,
    showMobileFilter,
    setShowMobileFilter,
    sortConfig,
    setSortConfig,
    categoriesList,
  } = pageState;

  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category_id");

  const totalItems = pagination ? pagination.total : 0;
  const categoryName = categoryId
    ? categoriesList?.find((c) => c.id === Number(categoryId))?.name || "Category"
    : "All Categories";

  const handleSortChange = (e) => {
    const value = e.target ? e.target.value : e;

    switch (value) {
      case "Price: Low to High":
        setSortConfig({ orderBy: "price", order: "asc" });
        break;
      case "Price: High to Low":
        setSortConfig({ orderBy: "price", order: "desc" });
        break;
      case "Most Purchased":
        setSortConfig({ orderBy: "most_purchased", order: "desc" });
        break;
      default:
        setSortConfig({ orderBy: "created_at", order: "desc" });
    }
  };

  const getCurrentSortLabel = () => {
    if (sortConfig.orderBy === "price" && sortConfig.order === "asc")
      return "Price: Low to High";
    if (sortConfig.orderBy === "price" && sortConfig.order === "desc")
      return "Price: High to Low";
    if (sortConfig.orderBy === "most_purchased") return "Most Purchased";
    return " ";
  };

  return (
    <>
      <div className="top-control-bar mb-3">
        <div className="d-none d-md-flex justify-content-between align-items-center">
          <div className="text-start">
            {totalItems} items in{" "}
            <span className="fw-bold">{categoryName}</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* تم إزالة مربع البحث من هنا */}

            <Form.Select
              className="price-input shadow-none w-auto py-1"
              value={getCurrentSortLabel()}
              onChange={handleSortChange}
            >
              <option value="Most Purchased">Most Purchased</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
            </Form.Select>

            <div className="btn-group">
              <Button
                className={`view-btn shadow-none px-3 py-1 d-flex align-items-center ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <FaThLarge />
              </Button>
              <Button
                className={`view-btn shadow-none px-3 py-1 d-flex align-items-center ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <FaList />
              </Button>
            </div>
          </div>
        </div>

        <div className="d-block d-md-none mobile-specific-layout">
          <div className="mobile-filter-sort-bar d-flex justify-content-between align-items-center mt-2">
            <div className="d-flex gap-2 flex-grow-1">
              <Dropdown onSelect={handleSortChange}>
                <Dropdown.Toggle
                  variant="custom"
                  className="btn mobile-fs-btn shadow-none d-flex align-items-center m-0"
                >
                  <span className="text-muted-theme me-1">Sort:</span>{" "}
                  {getCurrentSortLabel()} <FaSort size={12} className="ms-1" />
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-sm mt-2">
                  <Dropdown.Item eventKey="Most Purchased">
                    Most Purchased
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Price: Low to High">
                    Price: Low to High
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Price: High to Low">
                    Price: High to Low
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <button
                type="button"
                className="btn mobile-fs-btn shadow-none"
                onClick={() => setShowMobileFilter(!showMobileFilter)}
              >
                Filter <FaFilter size={10} className="ms-1" />
              </button>
            </div>

            <div className="d-flex gap-1 ms-2">
              <button
                type="button"
                className={`btn view-toggle-btn shadow-none ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <FaThLarge size={14} />
              </button>

              <button
                type="button"
                className={`btn view-toggle-btn shadow-none ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <FaList size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Collapse in={showMobileFilter}>
        <div className="d-lg-none mobile-filters-collapse-wrapper text-start shadow-sm mb-4">
          <FilterSidebar pageState={pageState} prefix="mobile" />
        </div>
      </Collapse>
    </>
  );
}