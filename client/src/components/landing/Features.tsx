import { TbBuildingCog } from "react-icons/tb";
import { GiSilverBullet } from "react-icons/gi";
import { AiTwotoneThunderbolt } from "react-icons/ai";
import { LiaShippingFastSolid } from "react-icons/lia";
function Features() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center p-6">
            <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-500">
              <span>
                <TbBuildingCog size={30} />
              </span>
            </div>
            <h3 className="font-bold text-lg mb-2">Locally Manufactured</h3>
            <p className="text-gray-600">
              Handcrafted in our local workshop with attention to detail
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-500">
              <GiSilverBullet size={30} />
            </div>
            <h3 className="font-bold text-lg mb-2">Premium Materials</h3>
            <p className="text-gray-600">
              Using only high-quality materials for optimal performance
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-500">
              <span>
                <AiTwotoneThunderbolt size={30} />
              </span>
            </div>
            <h3 className="font-bold text-lg mb-2">Designed for Performance</h3>
            <p className="text-gray-600">
              Engineered for speed, precision, and comfort
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-500">
              <span>
                <LiaShippingFastSolid size={30} />
              </span>
            </div>
            <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
            <p className="text-gray-600">On all orders over $50 nationwide</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
