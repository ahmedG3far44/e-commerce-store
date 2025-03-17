import { useState } from "react";

function Banner() {
  const [bannerImagesList] = useState<string[]>([
    "https://t4.ftcdn.net/jpg/03/06/69/49/360_F_306694930_S3Z8H9Qk1MN79ZUe7bEWqTFuonRZdemw.jpg",
    "https://thumbs.dreamstime.com/b/concept-online-shopping-social-media-app-d-smartphone-shopping-bag-chat-message-delivery-hours-like-icon-185285947.jpg",
    "https://c8.alamy.com/comp/2C94609/online-shopping-web-banner-template-design-flat-design-style-online-shopping-web-banner-vector-illustration-design-2C94609.jpg",
  ]);
  // const [banner, setBanner] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);
  // const changeBannerImage = (bannerImagesList: string[]) => {
  //   let counter = 0;
  //   setBanner(bannerImagesList[counter]);
  //   counter++;
  // };
  setTimeout(
    () => setCounter(bannerImagesList.length - 1 > counter ? counter + 1 : 0),
    6000
  );
  return (
    <div className="w-full  h-auto ">
      {bannerImagesList.length > 0 && (
        <div className="flex flex-col justify-center items-center gap-4 w-full h-[600px]  rounded-3xl">
          <div className="w-full h-full object-contain">
            <img
              className="w-full h-full rounded-3xl"
              src={bannerImagesList[counter]}
              alt=""
            />
          </div>

          <div className="flex items-center gap-2">
            {bannerImagesList.map((banner, index) => {
              return (
                <span
                  className={`w-2 h-2 rounded-full ${
                    index === counter ? "bg-blue-300" : "bg-blue-100"
                  }`}
                ></span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Banner;
