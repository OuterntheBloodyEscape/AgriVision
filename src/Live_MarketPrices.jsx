import React, { useEffect, useState } from "react";
import './Live_MarketPrices.css';
import view from './assets/up-recolored.png';
import searchicon from './assets/searchicon.png';
import { useNavigate } from "react-router-dom";

function Live_MarketPrices() {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/check-login', {
          method: 'GET',
          credentials: 'include',
        });
        if (res.status === 401) {
          nav('/login_page', { replace: true });
          return;
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }

      try {
        const productRes = await fetch('http://localhost:5000/api/products');
        const data = await productRes.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [nav]);

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);


  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });


  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="All-containers">
        <div className="Motivation_container">
          <p className="live">Live Agricultural Prices BD</p>
          <p className="know">Know the Market.</p>
          <p className="grow">Grow Smarter.</p>
        </div>

        <div className="Motivation-er-nicher-part">
          <div className="Search_container">
            <p className="pro">Product Name</p>

            <div className="search-bar">
              <input 
                className="search-box" 
                type="text" 
                placeholder="e.g. Tomato, Rice, Beef..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-button">
                <img className="search-icon" src={searchicon} alt="search-icon" />
                Search
              </button>
            </div>

            <p className="filter">Filter by Category</p>

            <div className="all-filter-buttons">
              <button 
                className={`for-all-button ${activeCategory === "All" ? "only-all" : ""}`}
                onClick={() => setActiveCategory("All")}
                style={{ backgroundColor: activeCategory === "All" ? "#106B33" : "transparent", color: activeCategory === "All" ? "white" : "black" }}
              >
                All
              </button>
              <button 
                className={`for-all-button ${activeCategory === "Crops" ? "only-all" : ""}`}
                onClick={() => setActiveCategory("Crops")}
                style={{ backgroundColor: activeCategory === "Crops" ? "#106B33" : "transparent", color: activeCategory === "Crops" ? "white" : "black" }}
              >
                Crops
              </button>
              <button 
                className={`for-all-button ${activeCategory === "Fishery Products" ? "only-all" : ""}`}
                onClick={() => setActiveCategory("Fishery Products")}
                style={{ backgroundColor: activeCategory === "Fishery Products" ? "#106B33" : "transparent", color: activeCategory === "Fishery Products" ? "white" : "black" }}
              >
                Fishery Products
              </button>
              <button 
                className={`for-all-button ${activeCategory === "Poultry" ? "only-all" : ""}`}
                onClick={() => setActiveCategory("Poultry")}
                style={{ backgroundColor: activeCategory === "Poultry" ? "#106B33" : "transparent", color: activeCategory === "Poultry" ? "white" : "black" }}
              >
                Poultry
              </button>
            </div>
          </div>

          <div className="marketprices">
            <p className="market">Market Prices</p>
            <p className="showing">
              Showing {filteredProducts.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
            </p>
          </div>

          <div className="cart-container">
            {loading ? (
              <h3 style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>
                Loading market prices...
              </h3>
            ) : filteredProducts.length === 0 ? (
              <h3 style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>
                No products found matching your search.
              </h3>
            ) : (
              currentItems.map((product) => (
                <div className="cart-details" key={product._id}>
                  <div className="pics-and-fakabox">
                    <img
                      className="all-container-pics"
                      src={product.imageUrl}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80";
                      }}
                    />
                    <div className="fakabox">
                      <img className="view-details-pic" src={view} alt="view-details-pic" />
                      <p className="lm-view-details">View Details</p>
                    </div>
                  </div>

                  <div className="product-details">
                    <p className="product-name">{product.name}</p>
                    <p className="product-price">
                      Taka <sub>{product.price}/{product.unit}</sub>
                    </p>
                  </div>

                  <p className="date">{product.dateUpdated}</p>
                </div>
              ))
            )}
          </div>

          {totalPages > 0 && (
            <>
              <div className="no-of-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <React.Fragment key={number}>
                    <button
                      className="button-set-no"
                      onClick={() => handlePageClick(number)}
                      style={{
                        backgroundColor: currentPage === number ? '#106B33' : 'white',
                        color: currentPage === number ? 'white' : 'black',
                        border: currentPage === number ? 'none' : '1px solid #ccc'
                      }}
                    >
                      {number}
                    </button>
                    {/* Add visual dots if there are many pages (simplified for 4 pages) */}
                    {number === 3 && totalPages > 4 && <div className="dotdot">...</div>}
                  </React.Fragment>
                ))}
              </div>

              <div className="prev-next">
                <button 
                  className="prev-next-button" 
                  onClick={handlePrev} 
                  disabled={currentPage === 1}
                  style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Prev
                </button>
                
                <p className="prev-next-majher-text">Page {currentPage} of {totalPages}</p>
                
                <button 
                  className="prev-next-button" 
                  onClick={handleNext} 
                  disabled={currentPage === totalPages}
                  style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Next
                </button>
              </div>
            </>
          )}

          <div className="border"></div>

          <div className="last-text">
            <p>This is the END!</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Live_MarketPrices;