import useCart from "../context/cart/CartContext";

function CartPage() {
  const {
    addItemToCart,
    clearAllItemsFromCart,
    deleteOneItemFromCart,
    updateItemInCart,
  } = useCart();
  return (
    <div className="bg-red-50 min-h-[calc(100vh-120px)] flex flex-col justify-center items-center gap-4">
      <button
        className="px-4 py-2 rounded-md bg-amber-100 cursor-pointer"
        onClick={() => addItemToCart({ productId: "8893u49i3", quantity: 3 })}
      >
        {" "}
        addItemToCart{" "}
      </button>
      <button
        className="px-4 py-2 rounded-md bg-amber-100 cursor-pointer"
        onClick={() => clearAllItemsFromCart()}
      >
        {" "}
        clearAllItemsFromCart{" "}
      </button>
      <button
        className="px-4 py-2 rounded-md bg-amber-100 cursor-pointer"
        onClick={() => deleteOneItemFromCart({ productId: "8893u49i3" })}
      >
        {" "}
        deleteOneItemFromCart{" "}
      </button>
      <button
        className="px-4 py-2 rounded-md bg-amber-100 cursor-pointer"
        onClick={() =>
          updateItemInCart({ productId: "8893u49i3", quantity: 3 })
        }
      >
        {" "}
        updateItemInCart{" "}
      </button>
    </div>
  );
}

export default CartPage;
