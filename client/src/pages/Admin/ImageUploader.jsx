import { useRef, useState } from "react";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const ImageUploader = ({
  images = [],
  setImages,
  removeImage,
  setThumbnail,
}) => {
  const inputRef = useRef(null);

  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  //-----------------------------------------
  // Upload Images
  //-----------------------------------------

  const uploadFiles = async (files) => {
    if (!files.length) return;

    try {
      setUploading(true);

      const uploadedImages = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }

        const formData = new FormData();
        formData.append("image", file);

        const { data } = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        uploadedImages.push({
          public_id: data.public_id,
          url: data.url,
        });
      }

      setImages([...images, ...uploadedImages]);

      toast.success("Images uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Upload failed");
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
  // Drop
  //-----------------------------------------

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    uploadFiles(Array.from(e.dataTransfer.files));
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
        className={`border-2 border-dashed rounded-3xl p-12 cursor-pointer transition text-center ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-gray-300"
        }`}
      >
        <Upload
          size={50}
          className="mx-auto text-primary mb-4"
        />

        <h3 className="text-xl font-bold">
          {uploading
            ? "Uploading..."
            : "Upload Hotel Images"}
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

      {images.length > 0 ? (
        <div className="grid md:grid-cols-4 gap-5">
          {images.map((image, index) => (
            <div
              key={image.public_id || index}
              className="relative rounded-2xl overflow-hidden shadow"
            >
              <img
                src={image.url}
                alt=""
                className="w-full h-48 object-cover"
              />

              <div className="absolute top-3 right-3 flex gap-2">

                {setThumbnail && (
                  <button
                    type="button"
                    onClick={() => setThumbnail(index)}
                    className="bg-white rounded-full p-2 shadow"
                  >
                    <Star
                      size={18}
                      className="text-yellow-500"
                    />
                  </button>
                )}

                {removeImage && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="bg-red-500 rounded-full p-2 text-white"
                  >
                    <Trash2 size={18} />
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
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