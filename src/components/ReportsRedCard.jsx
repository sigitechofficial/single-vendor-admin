import React from 'react'

function ReportsRedCard(props) {
    return (
        <div className="bg-red-200 px-2.5 py-14 rounded-md h-full">
            <div className="flex justify-center items-center w-full h-full">
                <div className='flex-1 flex justify-center'>
                    <img
                        src={`/images/${props.image}.webp`}
                        alt={`card-${props.image}`}
                        className="w-20 h-20 object-contain"
                    />
                </div>
                <div className='flex-1 flex flex-col gap-y-4'>
                    <div className="text-3xl font-medium text-center font-norms">
                        {props?.total ? props?.total : "0"}
                    </div>
                    <div className="text-lg font-medium text-center font-norms">
                        {props.title}
                    </div>
                    <div className="text-xs text-center font-norms text-slate-500">
                        {props.subtitle}
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ReportsRedCard