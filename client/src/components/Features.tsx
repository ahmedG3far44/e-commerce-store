import { useState } from "react";

import { FaShippingFast } from "react-icons/fa";
import { MdPolicy } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";

function Features() {
  const [feature] = useState([
    {
      id: 1,
      name: "Free Shipping",
      description: "your able to get a free shipping in your first order",
      icons: <FaShippingFast size={50} />,
    },
    {
      id: 2,
      name: "Change Sizes",
      description: "your able to get a free shipping in your first order",
      icons: <AiFillProduct size={50} />,
    },
    {
      id: 3,
      name: "Product Quality",
      description: "your able to get a free shipping in your first order",
      icons: <AiFillProduct size={50} />,
    },
    {
      id: 4,
      name: "Returns Policy",
      description: "your able to get a free shipping in your first order",
      icons: <MdPolicy size={50} />,
    },
  ]);
  return (
    <div className="p-4 flex justify-around items-center max-sm:flex-wrap max-md:flex-wrap gap-4 my-10">
      {feature.map((feature) => {
        return (
          <div
            key={feature.id}
            className={
              "flex justify-center items-center gap-4 max-sm:flex-col max-md:flex-col"
            }
          >
            <span className="text-zinc-500">{feature.icons}</span>
            <div className="flex flex-col items-start max-sm:items-center max-md:items-center gap-1">
              <h3 className="text-2xl font-semibold">{feature.name}</h3>
              <p className="text-sm text-zinc-500">{feature.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Features;
