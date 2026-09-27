import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { X } from "lucide-react";

const ImageUpload = ({ productData, setProductData }) => {
  // File input change handle kar rahe hain
  const imageUpload = (e) => {
    // Selected files ko array me convert kar rahe hain
    const files = Array.from(e.target.files || []);

    // Agar files selected hain tab state update karo
    if (files.length > 0) {
      setProductData((prev) => ({
        // Previous state ko preserve kar rahe hain
        ...prev,

        // Previous images ke saath nayi files add kar rahe hain
        productImg: [...(prev.productImg || []), ...files],
      }));
    }
  };

  const removeImage = (index)=>{
    setProductData((prev)=>{
        const updateImage = prev.productImg.filter((_,i)=> i !== index)
        return {...prev, productImg:updateImage}
    })
  }

  return (
    <div className="grid gap-2">
      <p className="font-bold">Product Image</p>

      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        onChange={imageUpload}
        multiple
      />

      <Button variant="outline">
        <label htmlFor="file-upload" className="cursor-pointer">
          Upload Image
        </label>
      </Button>

      {/* Image preview */}
      {productData.productImg.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3">
          {productData.productImg.map((file, index) => {
            // Check kar rahe hain file local File object hai ya URL/object
            let preview;

            if (file instanceof File) {
              // Local selected file ka preview URL bana rahe hain
              preview = URL.createObjectURL(file);
            } else if (typeof file === "string") {
              // Agar direct string URL hai to use wahi preview
              preview = file;
            } else if (file?.url) {
              // Agar object me url key hai to use kar rahe hain
              preview = file.url;
            } else {
              return null;
            }

            return (
              <Card key={index} className="relative group overflow-hidden">
                <CardContent>
                  <img
                    src={preview}
                    alt=""
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    onClick={()=>removeImage(index)}
                    type="button"
                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-100 transition"
                  >
                    <X size={14} />
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
