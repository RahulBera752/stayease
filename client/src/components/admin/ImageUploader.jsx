import { useRef, useState } from "react";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const ImageUploader = ({
  images = [],
  setImages,
}) => {
  const inputRef = useRef(null);

  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  //-----------------------------------------
  // Upload Images to Cloudinary
  //-----------------------------------------

  const uploadFiles = async (files) => {
    if (!files.length) return;

    try {
      setUploading(true);

      const uploaded = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }

        const formData = new FormData();
        formData.append("image", file);

        const response = await api.post("/upload", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

console.log("FULL RESPONSE");
console.log(response);

console.log("DATA");
console.log(response.data);

uploaded.push({
  public_id: response.data.public_id,
  url: response.data.url,
  name: file.name,
});

console.log("IMAGE PUSHED");
console.log(uploaded);
      }

      setImages((prev) => [...prev, ...uploaded]);

      toast.success("Images uploaded successfully");
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Image upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  //-----------------------------------------
  // Input
  //-----------------------------------------

  const handleInput = (e) => {
    uploadFiles(Array.from(e.target.files));
  };

  //-----------------------------------------
  // Drag Drop
  //-----------------------------------------

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    uploadFiles(Array.from(e.dataTransfer.files));
  };

  //-----------------------------------------
  // Remove
  //-----------------------------------------

  const removeImage = (index) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">

      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-12 cursor-pointer transition text-center

        ${
          dragging
            ? "border-indigo-600 bg-indigo-50"
            : "border-gray-300"
        }`}
      >

        {uploading ? (
          <Loader2
            size={55}
            className="mx-auto animate-spin text-indigo-600"
          />
        ) : (
          <Upload
            size={55}
            className="mx-auto text-indigo-600"
          />
        )}

        <h3 className="text-xl font-bold mt-4">
          Upload Hotel Images
        </h3>

        <p className="text-gray-500 mt-2">
          Click or Drag & Drop Images
        </p>

        <input
          ref={inputRef}
          hidden
          multiple
          type="file"
          accept="image/*"
          onChange={handleInput}
        />

      </div>

      {images.length > 0 && (

        <div className="grid md:grid-cols-4 gap-5">

          {images.map((image, index) => (

            <div
              key={index}
              className="relative rounded-2xl overflow-hidden shadow border"
            >

              <img
                src={image.url}
                alt="Hotel"
                className="w-full h-48 object-cover"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-3 right-3 bg-red-500 rounded-full p-2 text-white hover:bg-red-600"
              >
                <Trash2 size={18} />
              </button>

              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                {image.name}
              </div>

            </div>

          ))}

        </div>

      )}

      {!uploading && images.length === 0 && (

        <div className="text-center py-10 text-gray-500">

          <ImageIcon
            size={40}
            className="mx-auto mb-3"
          />

          No images uploaded

        </div>

      )}

    </div>
  );
};

export default ImageUploader;