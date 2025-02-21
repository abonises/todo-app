export const loadImage = async (image) => {
  try {
    let imageURL;
    
    const imageObject = new FormData();
    
    imageObject.append('file', image);
    imageObject.append('cloud_name', import.meta.env.VITE_CLOUDINARY_NAME);
    imageObject.append('upload_preset', import.meta.env.VITE_PRESSET_NAME)
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`, {
      method: 'POST',
      body: imageObject
    })
    
    const imgData = await response.json();
    imageURL = imgData.url.toString();
    
    return imageURL
    
  } catch (err) {
    console.log(err.message)
  }
}