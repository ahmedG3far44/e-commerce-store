import { OrderItemProps } from "../utils/types";

function OrderItems({ items }: { items: OrderItemProps[] }) {
  return (
    <div>
      {items.length > 0 ? (
        <div className="ml-8 pl-4 border-l-2 rounded-3xl border-l-zinc-300 flex flex-col justify-start items-start gap-2">
          {items.map((item) => {
            return (
              <div
                className="flex justify-start items-center gap-4"
                key={item._id}
              >
                <div className="w-14 h-14 rounded-xl  overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={item?.productImages}
                    alt={item?.productTitle}
                  />
                </div>
                <h1>{item?.productTitle}</h1>
                <span>Quantity: {item.quantity}</span>
                <span className="font-semibold">
                  {item.productPrice}
                  <span className="ml-1 text-[10px] text-gray-600 font-bold">
                    EGP
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p>there is no items info provided!!</p>
      )}
    </div>
  );
}

export default OrderItems;
