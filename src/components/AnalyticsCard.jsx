import React from 'react'
import { FaArrowUp } from 'react-icons/fa'
import { IoIosInformationCircleOutline } from 'react-icons/io'

const AnalyticsCard = (props) => {
    return (
        <div className="bg-[#36373B] rounded-xl text-white px-6 py-2">
            <div className="flex gap-4 items-center my-3">
                <p className="text-xl font-bold font-norms">{props?.title}</p><span className="text-xl text-red-500"><IoIosInformationCircleOutline /></span>
            </div>
            <h4 className="font-bold text-3xl">{props?.value}</h4>
            <div className="flex items-center gap-2 my-3">
                <div className="text-green-500 flex gap-2 items-center">  <FaArrowUp /> {props?.percent} </div>
                <p> VIL {props?.date}</p>
            </div>
        </div>
    )
}

export default AnalyticsCard