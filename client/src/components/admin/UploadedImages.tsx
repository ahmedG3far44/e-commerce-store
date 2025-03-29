
// import { File } from "./AdminProducts";

function UploadedImages({
  uploaded,
}: {
  uploaded: File[] | undefined;
  setUploaded: () => void;
}) {


  // for (const file of files) {
  //   const url = URL.createObjectURL(file);
  //   setUploadedList([...url]);
  // }

  return (
    <div className="flex w-full justify-start items-start flex-wrap gap-2 gap-y-0">
      {uploaded && (
        <>
          {uploaded.map((img, index) => {
            const url = URL.createObjectURL(img);
            return (
              <div
                key={index}
                className="w-20 h-20 shadow-md overflow-hidden rounded-3xl my-8"
              >
                <img className="w-full h-full object-cover " src={url} alt="" />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default UploadedImages;
