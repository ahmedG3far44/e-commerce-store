import { LuX } from "react-icons/lu";

function UploadedImages({
  uploaded,
  removeFiles,
  uploadStatus,
}: {
  uploaded: File[] | null;
  removeFiles: (file: File) => void;
  uploadStatus: boolean;
}) {
  return (
    <div className="flex w-full justify-start items-start flex-wrap gap-2 gap-y-0">
      {uploaded && (
        <>
          {uploaded.map((img, index) => {
            const url = URL.createObjectURL(img);
            return (
              <div
                key={index}
                className="w-20 h-20 shadow-md  rounded-3xl my-8 relative border-2 border-zinc-300 p-1"
              >
                {!uploadStatus && (
                  <button
                    onClick={() => {
                      if (uploaded) {
                        removeFiles(img);
                      }
                    }}
                    className="p-2 cursor-pointer hover:bg-red-800 duration-300 bg-red-600 text-white shadow-2xl rounded-2xl absolute  -top-2 -right-2 z-50"
                  >
                    <LuX size={20} />
                  </button>
                )}
                <img
                  className="w-full h-full rounded-3xl object-cover "
                  src={url}
                  alt=""
                />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default UploadedImages;
