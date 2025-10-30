import React from 'react'
import Layout from '../../components/Layout'
import { useTranslation } from 'react-i18next';
import { IoWalletSharp } from "react-icons/io5";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { IoStorefront } from "react-icons/io5";
import { FaUser } from "react-icons/fa";




const PayoutDetails = () => {
    const { t } = useTranslation();
    return (
        <Layout content={
            <div className="p-5 font-norms" >
                <div className="bg-white rounded-lg p-5 min-h-screen">
                    <h2 className="text-themeRed text-lg font-bold font-norms">
                        {t("Payout Details")}
                    </h2>
                    <div className='border-2 border-gray-200 px-4 py-6 rounded-lg mt-5 [&>div]:flex [&>div]:justify-between [&>div]:items-center'>
                        <div className='border-b-2 border-gray-200 pb-6'>
                            <h4 className='text-2xl font-medium'>Store Withdraw Information</h4>
                            <div className='cursor-pointer text-gray-500' >
                                <IoWalletSharp size={25} />
                            </div>
                        </div>
                        <div className='pt-4 pb-2'>
                            <p className='font-medium' >Amount : 2200</p>
                            <p>Note:</p>
                            <button className='bg-green-500 rounded-md px-3 py-1.5 text-white' >Approved</button>
                        </div>
                        <div>
                            <h4 className='font-medium'>Request Time: 2023-12-2 00:56:19</h4>
                        </div>
                    </div>

                    <div className='flex mt-5 [&>div]:p-4 [&>div]:rounded-lg [&>div]:border-gray-200 [&>div]:border-2 [&>div]:flex-1 gap-x-4 [&>div>div]:flex [&>div>div]:justify-between'>
                        <div className='[&>p]:my-3 [&>p]:font-medium [&>p]:text-gray-600 [&>p]:pl-3'>
                            <div className='flex items-center border-b-2 border-gray-300 pb-3 mb-5' >
                                <h4 className='font-medium'>My Bank Info</h4>
                                <div className='cursor-pointer text-gray-500' >
                                    <AiOutlineDollarCircle size={20} />
                                </div>
                            </div>
                            <p>Bank Name: BNS</p>
                            <p>Branch : FAIRVIEWS</p>
                            <p>Holder Name : 9JAJAM</p>
                            <p>Account no : 675677</p>
                        </div>
                        <div className='[&>p]:my-3 [&>p]:font-medium [&>p]:text-gray-600 [&>p]:pl-3'>
                            <div className='flex items-center border-b-2 border-gray-300 pb-3 mb-5' >
                                <h4 className='font-medium'>Store Info</h4>
                                <div className='cursor-pointer text-gray-500' >
                                    <IoStorefront size={20} />
                                </div>
                            </div>
                            <p>Store Name: BNS</p>
                            <p>Phone : 0308785678</p>
                            <p>Address : 9JAJAM</p>
                            <p style={{ color: "white" }} className='bg-green-500 rounded-md py-2 text-white'>Balance : 675677</p>
                        </div>
                        <div className='[&>p]:my-3 [&>p]:font-medium [&>p]:text-gray-600 [&>p]:pl-3' >
                            <div className='flex items-center border-b-2 border-gray-300 pb-3 mb-5' >
                                <h4 className='font-medium'>Owner Info</h4>
                                <div className='cursor-pointer text-gray-500' >
                                    <FaUser size={20} />
                                </div>
                            </div>
                            <p>Name : BNS</p>
                            <p>Email : FAIRVIEWS</p>
                            <p>Phone : 9JAJAM</p>
                        </div>

                    </div>


                </div>
            </div>
        } />
    )
}

export default PayoutDetails