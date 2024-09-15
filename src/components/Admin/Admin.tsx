import React, { useEffect } from 'react';
import './Admin.css';
import { painting } from "../../types/painting";
import axios from "axios";

const Admin: React.FC = () => {

    const [paintings, setPaintings] = React.useState<painting[]>([]);

    useEffect( () => {
      console.log("Getting paintings")
      axios.get("http://localhost:8000/paintings")
      .then(
        (response) => {
          setPaintings(response.data);
        })
      .catch( (error) => {
        console.error(`Error fetching data: ${error}`);
      });

    }, [] );

    const handleInputChange = (id: number, field: string, value: any ) => {

      setPaintings((prevPaintings) => 
      prevPaintings.map((item) => 
        item.id === id ? { ...item, [field]: value} : item
      )
      );
    };


  const handleSave = (painting: painting) => {

    console.log("Updating painting");

    axios.put(`http://localhost:8000/painting/${painting.id}`, painting)
    .then((response) => {
        console.log('Painting updated successfully:', response.data);
    })
    .catch((error) => {
        console.error('Error updating painting:', error);
    });

  };

  return (
    <div className='admin-div'>
        <h3>Admin</h3>
        <ul className="admin-painting-list">
          {paintings.map((item: painting) => ( // collection.map((name: interface/type) => () )
            <li key={item.id}>
              <div className="admin-painting-list-item">
                <img className="painting-image" src="./src/mocks/images/3.jpg" alt={item.title} />
                <div className='editable-fields'>
                  <div>
                    <label>Title: </label>
                    <input 
                    type = "text"
                    value = {item.title}
                    onChange={(e) => handleInputChange(item.id, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Height: </label>
                    <input 
                    type = "number"
                    value = {item.height}
                    readOnly
                    />
                  </div>
                  <div>
                    <label>Width: </label>
                    <input 
                    type = "number"
                    value = {item.width}
                    readOnly
                    />
                  </div>
                  <div>
                    <label>Aspect Ratio: </label>
                    <input 
                    type = "number"
                    value = {item.aspectRatio}
                    readOnly
                    />
                  </div>
                  <div>
                    <label>Price: </label>
                    <input 
                    type = "number"
                    value = {item.price}
                    readOnly
                    />
                  </div>
                  <div>
                    <label>Sold: </label>
                    <input 
                    type = "checkbox"
                    checked = {item.sold}
                    readOnly
                    />
                  </div>
                  <div>
                    <label>Giclee: </label>
                    <input 
                    type = "checkbox"
                    checked = {item.giclee}
                    readOnly
                    />
                  </div>
                  <button onClick={() => handleSave(item)}>Save</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
    </div>
  );
};

export default Admin;