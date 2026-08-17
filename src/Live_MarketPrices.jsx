import React from "react";
import './Live_MarketPrices.css'
import broccoli from './assets/broccoli.jpg'
import rui from './assets/rui-fish.jpg'
import tomato from './assets/Tomato.jpg'

function Live_MarketPrices() {
  return (
    <>
      <div className="All-containers">
        <div className="Motivation_container">

          <p className="live">
            Live Agricultural Prices BD
          </p>
          <p className="know">Know the Market.</p>
          <p className="grow">Grow Smarter.</p>

        </div>

        <div className="Motivation-er-nicher-part">

          <div className="Search_container">

            <p className="pro">
              Product Name
            </p>

            <div className="search-bar">
              <input className="search-box" type="text" placeholder="e.g. Tomato, Rice, Bangus..." />
              <button className="search-button">
                Search
              </button>
            </div>

            <p className="filter">
              Filter by Category
            </p>

            <div>
              <button className="for-all-button">
                All
              </button>
              <button className="for-all-button">
                Crops
              </button>
              <button className="for-all-button">
                Fishery Products
              </button>
              <button className="for-all-button">
                Poultry
              </button>
            </div>

          </div>

          <div className="marketprices">
            <p className="market">
              Market Prices
            </p>
            <p className="showing">
              Showing 1-10 of 180 products
            </p>

          </div>

          <div className="cart-container">

            <div className="cart-details">
              <img className="all-container-pics" src={tomato} />
              <div className="product-details">
                <p className="product-name">
                  Tomato
                </p>
                <p className="product-price">
                  Taka <sub>200/kg</sub>
                </p>
              </div>

              <p className="date">
                August 16, 2026
              </p>

            </div>

            <div className="cart-details">
              <img className="all-container-pics" src={broccoli} />
              <div className="product-details">
                <p className="product-name">
                  Broccoli
                </p>
                <p className="product-price">
                  Taka <sub>300/kg</sub>
                </p>
              </div>

              <p className="date">
                August 16, 2026
              </p>

            </div>

            <div className="cart-details">
              <img className="all-container-pics" src={rui} />
              <div className="product-details">
                <p className="product-name">
                  Rui
                </p>
                <p className="product-price">
                  Taka <sub>380/kg</sub>
                </p>
              </div>

              <p className="date">
                August 15, 2026
              </p>

            </div>


            <div className="cart-details">
              ayon
            </div>

            <div className="cart-details">
              ayon
            </div>

            <div className="cart-details">
              ayon
            </div>

            <div className="cart-details">
              ayon
            </div>

          </div>

          <div className="no-of-pages">
            <button className="button-set-no">1</button>
            <button className="button-set-no">2</button>
            <div className="dotdot">...</div>
            <button className="button-set-no">20</button>
          </div>

          <div className="prev-next">
            <button className="prev-next-button">Prev</button>
            <p className="prev-next-majher-text">Page 1 of 20</p>
            <button className="prev-next-button">Next</button>
          </div>

          <div className="border">

          </div>

          <div className="last-text">
            <p>This is the END!</p>
          </div>
        </div>
      </div>




    </>
  );
}

export default Live_MarketPrices