import  React  from "react";
// import {  useNavigate  } from 'react-router-dom';


const ClothesCard = ({clothe}) => {
 
    return (


        <div className="text-center mt-5">


            <div className="card  m-2"
                style={{ width: "18rem" }} >
                <img src={clothe.image_url} className="" style={{ height: "18rem", objectFit: "cover", borderRadius: "20px" }} alt="..." />
                <div className="card-body" style={{ height: "16rem", overflow: "scroll" }}>
                    <h5 className="card-title"> {clothe.name}</h5>

                    <div>
                        <p className="card-text"><span>Description</span>{clothe.description} </p>
                        <p className="card-text"><span>Color:</span>{clothe.color} </p>
                        <p className="card-text"><span>Price:</span> {clothe.price}</p>
                    </div>



                    <button  className="btn btn-warning m-3">Details</button>


                    <button href="#" className="btn btn-danger m-3 "   ><strong>♥</strong></button>
                </div>
            </div>





        </div>
    );
};

export default ClothesCard;
