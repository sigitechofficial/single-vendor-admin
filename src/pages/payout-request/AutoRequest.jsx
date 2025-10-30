import React from 'react'
import Layout from '../../components/Layout'
import Helment from '../../components/Helment'
import RedButton from '../../utilities/Buttons'
import { useTranslation } from 'react-i18next'
import MyDataTable from '../../components/MyDataTable'
import { useNavigate } from 'react-router-dom'

const AutoRequest = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    var columns = [
        { field: "userId", header: "User Id" },
        { field: "userName", header: "User Name" },
        { field: "role", header: "Role" },
        {
            field: "requestAmount",
            header: "Request Amount",
        },
        {
            field: "scheduleDate",
            header: "Schedule Date",
        },
        {
            field: "lastUpdate",
            header: "Last Update",
        },
        {
            field: "status",
            header: "Status",
        },
        {
            field: "action",
            header: "Action",
        },
    ];
    const datas = [{
        userId: "1",
        userName: "Ahsan",
        role: "Retailer",
        requestAmount: "CHF398",
        scheduleDate: "CHF 500",
        lastUpdate: "68/87/99",
        status: <span className='text-orange-500 bg-orange-100 px-4 py-2.5 rounded-sm cursor-pointer' >In process</span>,
        action: <div >
            <button className='text-gray-600 border-gray-600 border-[1px] rounded-md font-normal font-norms px-2 py-1.5' onClick={() => navigate("/payout-details")}>View Detail</button>
        </div>
    }];


    return (
        <Layout content={
            <div className="p-5" >
                <div className="bg-white rounded-lg p-5 min-h-screen">
                    <div className="flex justify-between items-center flex-wrap gap-5">
                        <h2 className="text-themeRed text-lg font-bold font-norms">
                            {t("Auto Request")}
                        </h2>
                        <div className="flex gap-2 items-center flex-wrap">
                            <Helment
                                search={true}
                                // searchOnChange={(e) => setSearch(e.target.value)}
                                // searchValue={search}
                                csvdata={[{ a: "s", c: "d" }]}
                            />
                        </div>
                    </div>
                    <div>
                        <MyDataTable columns={columns} data={datas} />
                    </div>
                </div>
            </div>
        } />
    )
}

export default AutoRequest