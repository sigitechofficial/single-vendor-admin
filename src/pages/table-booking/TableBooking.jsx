import React, { useState } from 'react';
import Layout from "../../components/Layout";
import MyDataTable from '../../components/MyDataTable';
import GetAPI from '../../utilities/GetAPI';
import Helment from '../../components/Helment';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const TableBooking = () => {
  const { t } = useTranslation(); // Add this line
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data } = GetAPI("admin/getTableBooking");
  console.log(data, "table booking");

  const orderData = () => {
    const filteredData = data?.data?.data?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search.toLowerCase())) ||
        (dat?.orderStatusId &&
          dat?.orderStatusId.toString().includes(search.toLowerCase())) ||
        (dat?.restaurant?.businessName &&
          dat?.restaurant?.businessName
            .toLowerCase()
            .includes(search.toLowerCase())) ||
        (dat?.user?.userName &&
          dat?.user?.userName.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const columns = [
    { field: "sn", header: t('serialNo') },
    { field: "id", header: t('bookingId') },
    {
      field: "restaurantName",
      header: t('restaurantName'),
    },
    {
      field: "customerInfo",
      header: t('customerInfo'),
    },
    {
      field: "contact",
      header: t('contact'),
    },
    {
      field: "date",
      header: t('date'),
    },
    {
      field: "time",
      header: t('time'),
    },
    {
      field: "guests",
      header: t('guests'),
    },
    {
      field: "sRequest",
      header: t('specialRequest'),
    },
    {
      field: "orderStatus",
      header: t('orderStatus'),
    },
    {
      field: "action",
      header: t('action'),
    },
  ];

  let csv = [];
  let datas = orderData()?.map((item, index) => {
    csv.push({
      sn: index + 1,
      id: item?.id,
      restaurantName: item?.restaurant?.businessName,
      customerInfo: item?.user?.userName,
      contact: ` ${item?.restaurant?.countryCode} ${item?.restaurant?.phoneNum}`,
      date: item?.date,
      time: item?.time,
      guests: item?.noOfMembers,
      orderStatus: item?.orderStatus?.displayText,
    });
    return {
      sn: index + 1,
      id: item?.id,
      restaurantName: item?.restaurant?.businessName,
      customerInfo: item?.user?.userName,
      contact: ` ${item?.restaurant?.countryCode} ${item?.restaurant?.phoneNum}`,
      date: item?.date,
      time: item?.time,
      guests: item?.noOfMembers,
      sRequest: <p>{t('windowView')}</p>,
      orderStatus: item?.orderStatus?.displayText === "Delivered" ? (
        <div
          className="bg-[#21965314] text-themeGreen font-semibold p-2 rounded-md flex 
    justify-center"
        >
          {t('delivered')}
        </div>
      ) : item?.orderStatus?.displayText === "Cancelled" ? (
        <div
          className="bg-[#EE4A4A14] text-themeRed font-semibold p-2 rounded-md flex 
          justify-center"
        >
          {t('cancelled')}
        </div>
      ) : item?.orderStatus?.displayText === "Reject" ? (
        <div
          className="bg-[#1860CC33] text-[#1860CC] font-semibold p-2 rounded-md flex 
          justify-center"
        >
          {t('rejected')}
        </div>
      ) : item?.orderStatus?.displayText === "Placed" ? (
        <div
          className="bg-[#EE4A4A14] text-themeRed font-semibold p-2 rounded-md flex 
          justify-center"
        >
          {t('placed')}
        </div>
      ) : item?.orderStatus?.displayText === "Accepted" ? (
        <div
          className="bg-[#EE4A4A14] text-themeRed font-semibold p-2 rounded-md flex 
          justify-center"
        >
          {t('accepted')}
        </div>
      ) : (
        <div
          className="bg-[#EC6C3033] text-[#EC6C30] font-semibold p-2 rounded-md flex 
          justify-center"
        >
          {t('scheduled')}
        </div>
      ),
        action: <div data-testid={`tablebooking-row-${item?.id}-view-btn`} className='border-gray-300 border-[1px] px-4 py-1 font-semibold rounded-md inline-block cursor-pointer' onClick={() => navigate(`/booking-details/${item?.id}`, { state: { id: item?.id } })} >{t('viewDetails')}</div>
    };
  });

  return data?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      content={
        <div className="bg-themeGray p-5">
          <div className="bg-white rounded-lg p-5">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <h2 className="text-themeRed text-lg font-bold font-norms">
                {t('All Table Bookings')}
              </h2>
              <div>
                <Helment
                  search={true}
                  searchOnChange={(e) => setSearch(e.target.value)}
                  searchValue={search}
                  csvdata={csv}
                />
              </div>
            </div>

            <div>
              <MyDataTable columns={columns} data={datas} />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default TableBooking;
