import React from 'react'
import Layout from '../../components/Layout'
import Helment from '../../components/Helment'
import RedButton, { BlackButton } from '../../utilities/Buttons'
import { useTranslation } from 'react-i18next'
import MyDataTable from '../../components/MyDataTable'
import { LiaFilterSolid } from "react-icons/lia";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";
import Select from "react-select";

const PayoutReports = () => {
    const { t } = useTranslation();
    const { isOpen, onOpen, onClose } = useDisclosure()
    var columns = [
        { field: "userId", header: "User Id" },
        { field: "userName", header: "User Name" },
        { field: "role", header: "Role" },
        {
            field: "reqAmount",
            header: "Request Amount",
        },
        {
            field: "currEarningDue",
            header: "Current Earnings Due",
        },
        {
            field: "requestDate",
            header: "Request Date",
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
        reqAmount: "CHF 500",
        currEarningDue: "68/87/99",
        requestDate: 34343,
        status: <span className='text-orange-500 bg-orange-100 px-4 py-2.5 rounded-sm cursor-pointer' >Adjusted</span>,
        action: <div className='flex gap-x-2 [&>button]:rounded-md font-normal font-norms [&>button]:border-[1px] [&>button]:px-4 [&>button]:py-1.5'>
            <button className='text-green-600 border-green-600'>Adjust</button>
            <button className='text-orange-400 border-orange-400 whitespace-nowrap '>Manually Triggered</button>
        </div>
    }];


    return (
        <Layout content={
            <div className="p-5" >
                <div className="bg-white rounded-lg p-5 min-h-screen">
                    <div className="flex justify-between items-center flex-wrap gap-5">
                        <h2 className="text-themeRed text-lg font-bold font-norms">
                            {t("Payout Reports & Logs")}
                        </h2>
                        <div className="flex gap-2 items-center flex-wrap">
                            <Helment
                                search={true}
                                // searchOnChange={(e) => setSearch(e.target.value)}
                                // searchValue={search}
                                csvdata={[{ a: "s", c: "d" }]}
                            />
                            <div onClick={onOpen} className='flex gap-x-1 items-center justify-center border border-themeBorderGray rounded-md px-2 py-1 h-9 cursor-pointer hover:bg-theme hover:text-white text-sm duration-100'>
                                <LiaFilterSolid size={18} />
                                <p>Filter</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <MyDataTable columns={columns} data={datas} />
                    </div>
                </div>
                <Modal
                    isOpen={isOpen} onClose={onClose}
                    size={"3xl"}
                    isCentered
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader padding={0}>
                            <h4 className="font-normal font-norms pl-4 py-2 border-gray-300 border-b-2">Filter</h4>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody padding={4}>
                            <div className="grid grid-cols-2 gap-x-5 gap-y-8 py-2 px-2 [&>div>h4]:mb-2 [&>div>h4]:text-gray-600 [&>div>h4]:font-norms">
                                <div>
                                    <h4>Date Range</h4>
                                    <Select
                                        // styles={customStyles}
                                        placeholder="Select"
                                        name="distanceUnitId"
                                        options={[{
                                            value: 2,
                                            label: "Current Month",
                                        }]}
                                    // onChange={(e) => {
                                    //   setZoneData({ ...zoneData, zone: zoneOptions.find(el => el.value === e?.value) });
                                    // }
                                    // }
                                    // value={zoneData?.zone}
                                    />
                                </div>
                                <div>
                                    <h4>Role</h4>
                                    <Select
                                        // styles={customStyles}
                                        placeholder="Select"
                                        name="distanceUnitId"
                                        options={[{
                                            value: 2,
                                            label: "Current Month",
                                        }]}
                                    // onChange={(e) => {
                                    //   setZoneData({ ...zoneData, zone: zoneOptions.find(el => el.value === e?.value) });
                                    // }
                                    // }
                                    // value={zoneData?.zone}
                                    />
                                </div>
                                <div>
                                    <h4>Status</h4>
                                    <Select
                                        // styles={customStyles}
                                        placeholder="Select"
                                        name="distanceUnitId"
                                        options={[{
                                            value: 2,
                                            label: "Current Month",
                                        }]}
                                    // onChange={(e) => {
                                    //   setZoneData({ ...zoneData, zone: zoneOptions.find(el => el.value === e?.value) });
                                    // }
                                    // }
                                    // value={zoneData?.zone}
                                    />
                                </div>
                                <div>
                                    <h4>Amount</h4>
                                    <Select
                                        // styles={customStyles}
                                        placeholder="Select"
                                        name="distanceUnitId"
                                        options={[{
                                            value: 2,
                                            label: "Current Month",
                                        }]}
                                    // onChange={(e) => {
                                    //   setZoneData({ ...zoneData, zone: zoneOptions.find(el => el.value === e?.value) });
                                    // }
                                    // }
                                    // value={zoneData?.zone}
                                    />
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <div className="flex">
                                <BlackButton text="Clear filter" onClick={onClose} />
                                <RedButton text="Apply filter" />
                            </div>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        } />
    )
}


export default PayoutReports