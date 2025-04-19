import React, { useState, useContext, useEffect  } from "react";
import { useParams,  } from 'react-router-dom';
import { useAuth }  from "../../AuthContext";
import { original} from "../../types/original";
import axios from "axios";

const EditPainting: React.FC = () => {
    const { isAuthenticated} = useAuth();
    let { id } = useParams<{ id: string }>();
    const [original, setOrginal] = React.useState<original>({} as original);

    useEffect(() => {
      axios.get(`${import.meta.env.VITE_API_URL}paintings/${id}`).then((response) => {
        setOrginal(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error(`Error fetching data: ${error}`);
      });
    }, []);
    



    if (!isAuthenticated) {
        return <div>User must login</div>;
      } else {
        return (
        <div>
            <div className="painting-details">
                <p>{original.title}</p>


            </div>

            <div className="painting-image">

            </div>

            <div className="painting-giclee"> 

            </div>

        </div>
        );
      }
};

export default EditPainting;