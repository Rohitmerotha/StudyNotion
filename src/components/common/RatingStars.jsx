const { useEffect } = require("react");
const { useState } = require("react");
const { TiStarFullOutline,TiStarHalfOutline,TiStarOutline } = require("react-icons/ti")

function RatingStars({Review_count,star_size}){
    const [starCount,setStarCount]= useState({
        full:0,
        half:0,
        empty:0,
    })

    useEffect(()=>{
        const wholeStars = Math.floor(Review_count) || 0;
        setStarCount({
            full:wholeStars,
            half:Number.isInteger(Review_count) ? 0 : 1,
            empty:Number.isInteger(Review_count) ? 5-wholeStars :4-wholeStars
        })
    },[Review_count])

    return (
        <div className="flex">
        {
            [...new Array(starCount.full)].map((_,i)=>{
                return <TiStarFullOutline key={i} size={star_size || 20} />
            })
        }
        {
            [...new Array(starCount.half)].map((_,i)=>{
                return <TiStarHalfOutline  key={i} size={star_size || 20} />
            })
        }
        {
            [...new Array(starCount.empty)].map((_,i)=>{
                return <TiStarOutline key={i} size={star_size || 20} />
            })
        }

        </div>
    )

}
export default RatingStars;