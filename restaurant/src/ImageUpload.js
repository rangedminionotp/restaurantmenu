import React, { useState } from 'react';

function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleUpload = () => {
    // Implement the image upload logic here
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload Image</button>
    </div>
  );
}

export default ImageUpload;