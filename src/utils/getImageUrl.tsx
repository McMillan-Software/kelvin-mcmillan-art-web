
export const getImageUrl = (title : string) => {
  const basePath = import.meta.env.VITE_IMAGE_BASE_PATH;  // Use import.meta.env in Vite
    const encodedTitle = encodeURIComponent(title).replace(/%20/g, "-");
    return `${basePath}${encodedTitle}.jpg`;
  };