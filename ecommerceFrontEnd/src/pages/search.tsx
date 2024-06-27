import { useState } from "react";
import ProductCart from "../components/product-cart";

const Search = () => {
  const [search, SetSearch] = useState<string>("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const addToCartHander = () => {};
  const isNextPage = page < 4;
  const isPrevPage = page > 1;
  return (
    <div className="product-search-page">
      <aside>
        <h2>Filter</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>
        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            value={maxPrice}
            type={"range"}
            min={100}
            max={100000}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="sample1">Sample1</option>
            <option value="sample2">Sample2</option>
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => SetSearch(e.target.value)}
        />
        <div className="search-product-list">
          <ProductCart
            productId={"1"}
            photo={
              "https://m.media-amazon.com/images/I/61xKOBNlu2L._SX679_.jpg"
            }
            name={"MackBook"}
            price={60000}
            stock={20}
            handler={addToCartHander}
          />
        </div>
        <article>
          <button
            disabled={!isPrevPage}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>
            {page} of {4}
          </span>
          <button
            disabled={!isNextPage}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </article>
      </main>
    </div>
  );
};

export default Search;
