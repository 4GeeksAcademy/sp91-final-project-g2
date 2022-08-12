import React from "react";
import dogpic from "../../img/dog1.jpg";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const CardOwner = () => {
  const [flip, setFlip] = useState(true);

  let style1 = {
    width: "20rem",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    border: "none",
  };

  let imageStyle = {
    backgroundSize: "contain",
    backgroundPosition: "50%",
    objectFit: "cover",
    display: "block",
    width: "400px",
    height: "auto",
    overflow: "hidden",
    aspectRatio: "1",
  };

  return (
    <div className="col">
      <div className="image-flip">
        <div className="mainflip">
          {flip ? (
            <div className="frontside ">
              <div
                className="card"
                style={{ width: "18rem" }}
                onClick={() => setFlip(false)}
              >
                <img
                  className="card-img-top img-fluid"
                  src={dogpic}
                  alt="card image"
                  style={imageStyle}
                />
              </div>
              <div className="row mt-2 m-auto align-center">
                <div className="col-2"></div>
              </div>
            </div>
          ) : (
            <div className="backside">
              <div
                className="card"
                style={{ width: "18rem" }}
                onClick={() => setFlip(true)}
              >
                <div className="card-header"></div>
                <div className="card-body">
                  <h4 className="card-title">Mocho</h4>
                  <h5 className="card-text">Border-Collie</h5>
                  <a href="#" className="btn btn-info btn-md">
                    Editar informacion.
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CardOwner;
