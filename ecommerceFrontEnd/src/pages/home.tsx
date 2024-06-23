import { Link } from "react-router-dom";
import ProductCart from "../components/product-cart";

const Home = () => {
  const addToCartHander = () => {};
  return (
    <div className="home">
      <section></section>
      <h1>
        {" "}
        Latest Products{" "}
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>
      <main>
        <ProductCart
          productId={"1"}
          photo={"https://m.media-amazon.com/images/I/61xKOBNlu2L._SX679_.jpg"}
          name={"MackBook"}
          price={60000}
          stock={20}
          handler={addToCartHander}
        />
      </main>
    </div>
  );
};

export default Home;
