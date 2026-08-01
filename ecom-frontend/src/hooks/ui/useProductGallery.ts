import { useEffect, useState } from "react";

export function useProductGallery(images: string[]) {
  const [selectedImage, setSelectedImage] = useState<string>(images[0] || "");

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  const selectImage = (image: string) => {
    setSelectedImage(image);
  };

  return {
    selectedImage,
    selectImage,
  };
}
