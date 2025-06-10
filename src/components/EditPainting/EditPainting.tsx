import React, { useState , useEffect  } from "react";
import { useParams,  } from 'react-router-dom';
import { useAuth }  from "../../AuthContext";
import { editPainting } from "../../types/editPainting";

import axios from "axios";

const EditPainting: React.FC = () => {
    const { isAuthenticated} = useAuth();
    let { id } = useParams<{ id: string }>();
    const [editPainting, setEditPaitning] = React.useState<editPainting>({} as editPainting);
    const [error, setError] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);


    useEffect(() => {
      axios.get(`${import.meta.env.VITE_API_URL}paintings/${id}`).then((response) => {
        setEditPaitning(response.data);
      })
      .catch((error) => {
        console.error(`Error fetching data: ${error}`);
      });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        const finalValue =
            type === "checkbox" ? checked :
            type === "number" ? Number(value) :
            value;

        setEditPaitning((prev) => ({
            ...prev,
            [name]: finalValue,
        }));
    };

    const handleEditPainting = (e: React.FormEvent) => {
        e.preventDefault();
        axios.put(
            `${import.meta.env.VITE_API_URL}admin/painting/${id}`,
            editPainting   
            ,
            {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
        ).then((response) => {
            setEditPaitning(response.data);
            alert("Painting created edited");
        })
        .catch((error) => {
            console.error(`Error fetching data: ${error}`);
            setError(error)
        });
        }

    //Images
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg")) {
            setImage(file);
            setError("");

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setError("Please upload a valid image file (jpg or png)");
            setPreviewUrl(null);
            setImage(null);
        }
    };

    const handleUploadSubmit = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append("file", image);

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}admin/painting/${editPainting.id}/image`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            alert("Image uploaded successfully");
        } catch (err) {
            console.error("Upload error:", err);
            setError("Upload failed. Please try again.");
        }
    };



    if (!isAuthenticated) {
        return <div>User must login</div>;
      } else {
        return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="painting-details">
                <h2>Edit Painting Details</h2>
                                <h2>Painting Details</h2>    
                <form className="painting-form" onSubmit={handleEditPainting}>

                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={editPainting.title}
                            onChange={handleChange}
                            placeholder= {editPainting.title}
                            
                        />
                    </div>

                    <div>
                        <label>Location:</label>
                        <input
                            type="text"
                            name="location"
                            value={editPainting.location ?? ""}
                            onChange={handleChange}
                            placeholder="Location"
                        />
                    </div>

                    <div>
                        <label>Type:</label>
                        <input
                            type="text"
                            name="type"
                            value={editPainting.type}
                            onChange={handleChange}
                            placeholder="Type"
                        />
                    </div>

                    <div>
                        <label>Width:</label>
                        <input
                            type="number"
                            name="width"
                            value={editPainting.width}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Height:</label>
                        <input
                            type="number"
                            name="height"
                            value={editPainting.height}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Sold:</label>
                        <input
                            type="checkbox"
                            name="sold"
                            checked={!!editPainting.sold}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Framed:</label>
                        <input
                            type="checkbox"
                            name="framed"
                            checked={!!editPainting.framed}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={editPainting.price}
                            onChange={handleChange}
                            step="0.01"
                        />
                    </div>

                    <div>
                        <label>Information:</label>
                        <input
                            type="text"
                            name="info"
                            value={editPainting.info}
                            onChange={handleChange}
                            placeholder="Info"
                        />
                    </div>

                    <div>
                        <label>Gallery Name:</label>
                        <input
                            type="text"
                            name="galleryName"
                            value={editPainting.galleryName ?? ""}
                            onChange={handleChange}
                            placeholder="Gallery Name"
                        />
                    </div>

                    <div>
                        <label>Gallery Link:</label>
                        <input
                            type="text"
                            name="galleryLink"
                            value={editPainting.galleryLink ?? ""}
                            onChange={handleChange}
                            placeholder="Gallery Link"
                        />
                    </div>

                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit">Save Painting Details</button>
                </form>
            </div>


            <div className="painting-image">
                <div className="painting-creation-image-div">
                    <h2>Painting Image</h2>
                    <img
                        src={
                            previewUrl
                                ? previewUrl
                                : editPainting.image_path
                                    ? `${import.meta.env.VITE_IMAGE_BASE_PATH}${editPainting.image_path}`
                                    : "/images/placeholder.jpg"
                        }
                        alt={editPainting.title}
                        style={{
                            width: "100%",
                            height: "300px",
                            objectFit: "contain",
                        }}
                    />
                    <input type="file" accept="image/jpeg, image/png" onChange={handleImageUpload} />
                        {previewUrl && (
                        <button onClick={handleUploadSubmit} style={{ marginTop: "10px" }}>
                            Upload Image
                        </button>
                    )}
                </div>
            </div>

            <div className="painting-giclee"> 

            </div>
        </div>
        );
      }
};

export default EditPainting;