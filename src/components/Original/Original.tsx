import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Original as OriginalType } from "../../types/original";
import { GicleeDetail } from "../../types/gicleeCollection";
import "./Original.css";
import axios from "axios";

const Original: React.FC = () => {

  let { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [original, setOriginal] = React.useState<OriginalType>({} as OriginalType);
  const [gicleeDetail, setGicleeDetail] = React.useState<GicleeDetail | null>(null);

  useEffect(() => {
    setGicleeDetail(null);
    axios.get(`${import.meta.env.VITE_API_URL}paintings/originals/${id}`).then((response) => {
      setOriginal(response.data);
      console.log(response.data.galleryLink)
      if (response.data.giclee) {
        // 404 just means no giclee prints are available, so it's ignored
        axios.get(`${import.meta.env.VITE_API_URL}giclees/${id}`)
          .then((gicleeResponse) => setGicleeDetail(gicleeResponse.data))
          .catch(() => setGicleeDetail(null));
      }
    })
      .catch((error) => {
        console.error(`Error fetching data: ${error}`);
      });
  }, [id]);

  // Only offer the gallery link while the original can still be bought
  const galleryHref = original.galleryLink && !original.sold && !original.artistCollection
    ? (original.galleryLink.startsWith('http') ? original.galleryLink : `https://${original.galleryLink}`)
    : null;
  const year = original.creationDate ? new Date(original.creationDate).getFullYear() : null;

  return (
    <div className="orignal-content">
      <div className="original-container">

        <div className="back-button_div">
          <button className="back-button" onClick={() => navigate(-1)}>
            &#8592; Back
          </button>
        </div>

        <div className="original-image-container">
          <img className="orginal-image" src={`${import.meta.env.VITE_IMAGE_BASE_PATH}${original.imagePath}`} alt={original.title} />
        </div>

        {original.id && (
          <section className="original-details">
            <header className="original-heading">
              <p className="eyebrow">{original.type}</p>
              <h1 className="original-title">{original.title}</h1>
              {(original.location || year) && (
                <p className="original-subtitle">
                  {[original.location, year].filter(Boolean).join(', ')}
                </p>
              )}
            </header>

            <dl className="original-specs">
              <div>
                <dt>Dimensions</dt>
                <dd>{original.width} × {original.height}mm</dd>
              </div>
              {original.framed && (
                <div>
                  <dt>Presentation</dt>
                  <dd>Framed</dd>
                </div>
              )}
              <div>
                <dt>Availability</dt>
                <dd>
                  {original.artistCollection
                    ? "Artist's personal collection"
                    : original.sold
                      ? 'Sold'
                      : original.price
                        ? `$${original.price}`
                        : 'Available'}
                </dd>
              </div>
            </dl>

            {galleryHref && (
              <div className="original-gallery">
                <span>Available at {original.galleryName || 'gallery'}</span>
                <a className="btn" href={galleryHref} target="_blank" rel="noopener noreferrer">
                  View in gallery <span aria-hidden="true">&#8599;</span>
                </a>
              </div>
            )}

            {original.info && <p className="original-info lead">{original.info}</p>}

            {gicleeDetail && gicleeDetail.giclee.options.length > 0 && (
              <div className="original-giclee">
                <p className="eyebrow">Giclee prints</p>
                <ul className="giclee-size-list">
                  {gicleeDetail.giclee.options.map((option) => (
                    <li key={option.id} className="giclee-size-row">
                      <span>{option.optionAttributes.width} × {option.optionAttributes.height}mm</span>
                      <span className="giclee-size-leader" aria-hidden="true" />
                      <span>${option.optionAttributes.price}</span>
                    </li>
                  ))}
                </ul>
                {gicleeDetail.collections.length > 0 && (
                  <p className="giclee-collection-links">
                    Part of the{' '}
                    {gicleeDetail.collections.map((collection, index) => (
                      <React.Fragment key={collection.id}>
                        {index > 0 && (index === gicleeDetail.collections.length - 1 ? ' and ' : ', ')}
                        <Link to={`/Prints#collection-${collection.id}`}><strong>{collection.title}</strong></Link>
                      </React.Fragment>
                    ))}
                    {gicleeDetail.collections.length > 1 ? ' collections' : ' collection'}
                  </p>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default Original;
