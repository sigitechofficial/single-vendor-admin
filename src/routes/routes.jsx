import { lazy } from "react";

const DisputeOrder = lazy(() => import("../pages/dispute-orders/DisputeOrder"));
const Deposit = lazy(() => import("../pages/deposit/Deposit"));
const VatCategories = lazy(() => import("../pages/vat-categories/VatCategories"));
// Reports
const StoreReport = lazy(() => import("../pages/reports/StoreReport"));
const RestaurantReport = lazy(() =>
  import("../pages/reports/RestaurantReport")
);
const CustomerAnalytics = lazy(() =>
  import("../pages/reports/CustomerAnalytics")
);
const SalesReport = lazy(() => import("../pages/reports/SalesReport"));
const OrderMetrics = lazy(() => import("../pages/reports/OrderMetrics"));

// User Management
const User = lazy(() => import("../pages/user/user-management/UserManagement"));
const UserDetails = lazy(() =>
  import("../pages/user/user-management/UserDetails")
);

// Reports & Analytics
const ReportsByRestaurant = lazy(() =>
  import("../pages/reports-analytics/ReportsByRestaurant")
);
const ReportsByStore = lazy(() =>
  import("../pages/reports-analytics/ReportsByStore")
);
const ProdDetails = lazy(() =>
  import("../pages/reports-analytics/ProdDetails")
);

// Driver Management
const DeliverymanList = lazy(() =>
  import("../pages/driver-management/DeliverymanList")
);
const Newdeliveryman = lazy(() =>
  import("../pages/driver-management/Newdeliverman")
);
const RejectedDriver = lazy(() =>
  import("../pages/driver-management/RejectedDriver")
);

const Customers = lazy(() => import("../pages/user/customer/Customer"));
const RestaurantOwners = lazy(() =>
  import("../pages/user/restaurant-owner/RestaurantOwner")
);
const StoreOwners = lazy(() => import("../pages/user/store-owner/StoreOwner"));
const Drivers = lazy(() => import("../pages/user/drivers/Drivers"));
const Admin = lazy(() => import("../pages/user/admin/Admin"));
const DriverDetails = lazy(() => import("../pages/user/drivers/DriverDetails"));
const Employees = lazy(() => import("../pages/user/staff/Employee"));
const Roles = lazy(() => import("../pages/user/role/Roles"));
const Permissions = lazy(() => import("../pages/user/permissions/Permissions"));
const RolesAndPermissions = lazy(() =>
  import("../pages/user/roles-and-permissions/RolesAndPermissions")
);

// Restaurant/Store Items & Menu removed (consolidated under Food Management)

// Restaurant Orders
const RestaurantOrders = lazy(() =>
  import("../pages/restaurant-orders/RestaurantOrders")
);
const DeliveredOrders = lazy(() =>
  import("../pages/restaurant-orders/DeliveredOrders")
);
const CancelledOrders = lazy(() =>
  import("../pages/restaurant-orders/CancelledOrders")
);
const ScheduleOrders = lazy(() =>
  import("../pages/restaurant-orders/ScheduleOrders")
);
const OrderDetails = lazy(() =>
  import("../pages/restaurant-orders/OrderDetails")
);
const Rejected = lazy(() => import("../pages/restaurant-orders/Rejected"));
//Table Booking
const TableBooking = lazy(() => import("../pages/table-booking/TableBooking"));
const TableBookingDetails = lazy(() =>
  import("../pages/table-booking/TableBookingDetails")
);
//Active Orders
const ActiveOrders = lazy(() => import("../pages/active-orders/ActiveOrders"));
//Stamp card
const AddStampCard = lazy(() => import("../pages/stamp-cards/AddStampCard"));
const CollectCash = lazy(() => import("../pages/collect-cash/CollectCash"));

//item report
const ItemReport = lazy(() => import("../pages/item-report/ItemReport"));
// Store Orders removed

// All Restaurants
const Restaurants = lazy(() => import("../pages/restaurants/Restaurants"));
const AddRestaurants = lazy(() => import("../pages/restaurants/AddRestaurant"));
const EditRestaurants = lazy(() =>
  import("../pages/restaurants/EditRestaurants")
);

// All Stores
const Stores = lazy(() => import("../pages/stores/Stores"));
const EditStore = lazy(() => import("../pages/stores/EditStore"));
const AddStore = lazy(() => import("../pages/stores/AddStore"));

//Live Map
const LiveMap = lazy(() => import("../pages/live-map/LiveMap"));

// All Countries
const Countries = lazy(() => import("../pages/country/Countries"));

// All Cities
const Cities = lazy(() => import("../pages/city/Cities"));

const VehicleManagement = lazy(() =>
  import("../pages/vehicle-management/VehicleManagement")
);

// All Zones
const Zones = lazy(() => import("../pages/zones/Zones"));
const AddNewZone = lazy(() => import("../pages/zones/AddNewZone"));
const UpdateZone = lazy(() => import("../pages/zones/UpdateZone"));
const RefundManagement = lazy(() =>
  import("../pages/refund-management/RefundManagement")
);
// Promotions
const Voucher = lazy(() => import("../pages/promotions/Voucher"));
const Notifications = lazy(() => import("../pages/promotions/Notifications"));
const Adyen = lazy(() => import("../pages/Adyen"));
const Charges = lazy(() => import("../pages/promotions/Charges"));

// Earnings
const AdminEarnings = lazy(() => import("../pages/earnings/AdminEarnings"));
const DriverEarnings = lazy(() => import("../pages/earnings/DriverEarnings"));
const RestaurantEarnings = lazy(() =>
  import("../pages/earnings/RestaurantEarnings")
);
const StoreEarnings = lazy(() => import("../pages/earnings/StoreEarnings"));
const OverAllEarning = lazy(() => import("../pages/earnings/OverallEarnings"));

// Front Settings
const FrontSettings = lazy(() =>
  import("../pages/front-settings/FrontSetting")
);
const HeaderDesign = lazy(() =>
  import("../pages/front-settings/HeaderDesign")
);
// Banners
const Banners = lazy(() => import("../pages/banners/Banners"));

// Current Order
const CurrentOrder = lazy(() => import("../pages/current-order/CurrentOrder"));

// Payout Requet
const PayoutRequest = lazy(() =>
  import("../pages/payout-request/Payoutrequest")
);
const PayoutTable = lazy(() => import("../pages/payout-request/PayoutTable"));
const AutoRequest = lazy(() => import("../pages/payout-request/AutoRequest"));
const ManualRequest = lazy(() =>
  import("../pages/payout-request/ManualRequest")
);
const PayoutFailureManagement = lazy(() =>
  import("../pages/payout-request/PayoutFailureManagement")
);
const PayoutReports = lazy(() =>
  import("../pages/payout-request/PayoutReports")
);
const PayoutDetails = lazy(() =>
  import("../pages/payout-request/PayoutDetails")
);
const RestaurantPayouts = lazy(() =>
  import("../pages/payout-request/RestaurantPayouts")
);
const DriverPayouts = lazy(() =>
  import("../pages/payout-request/DriverPayouts")
);

// Profile Settings
const ProfileSettings = lazy(() =>
  import("../pages/profile-settings/ProfileSettings")
);
const DefaultValues = lazy(() =>
  import("../pages/default-values/DefaultValues")
);
//Food Management
const ManageAddOns = lazy(() =>
  import("../pages/food-management/ManageAddOns")
);
const ManageCategories = lazy(() =>
  import("../pages/food-management/ManageCategories")
);
const ManageCollection = lazy(() =>
  import("../pages/food-management/ManageCollection")
);
const ManageProducts = lazy(() =>
  import("../pages/food-management/ManageProducts")
);

const coreRoutes = [
  // Reports
  {
    path: "/adyen",
    component: Adyen,
  },
  {
    path: "/store-reports",
    component: StoreReport,
  },
  {
    path: "/restaurant-reports",
    component: RestaurantReport,
  },
  {
    path: "/customer-analytics",
    component: CustomerAnalytics,
  },
  {
    path: "/sale-reports",
    component: SalesReport,
  },
  {
    path: "/order-metrics",
    component: OrderMetrics,
  },
  // Reports & Analytics
  {
    path: "/reports-restaurant",
    component: ReportsByRestaurant,
  },
  {
    path: "/reports-store",
    component: ReportsByStore,
  },
  {
    path: "/product-detail",
    component: ProdDetails,
  },
  // User Management
  {
    path: "/user-management",
    component: User,
  },
  {
    path: "/user-details/:id",
    component: UserDetails,
  },
  {
    path: "/customers",
    component: Customers,
  },
  {
    path: "/branch-owners",
    component: RestaurantOwners,
  },
  {
    path: "/store-owners",
    component: StoreOwners,
  },
  {
    path: "/drivers",
    component: Drivers,
  },
  {
    path: "/admin",
    component: Admin,
  },
  {
    path: "/driver-details/:id",
    component: DriverDetails,
  },
  {
    path: "/employees",
    component: Employees,
  },
  {
    path: "/roles",
    component: Roles,
  },
  {
    path: "/permissions",
    component: Permissions,
  },
  {
    path: "/roles-and-permissions",
    component: RolesAndPermissions,
  },
  // Driver Management
  {
    path: "/deliveryman-list",
    component: DeliverymanList,
  },
  {
    path: "/new-deliveryman",
    component: Newdeliveryman,
  },
  {
    path: "/rejected-deliveryman",
    component: RejectedDriver,
  },
  // Restaurant/Store Items & Menu — removed

  // Restaurant Orders
  {
    path: "/restaurant/all-orders",
    component: RestaurantOrders,
  },
  {
    path: "restaurant/delivered-orders",
    component: DeliveredOrders,
  },
  {
    path: "restaurant/cancelled-orders",
    component: CancelledOrders,
  },
  {
    path: "restaurant/schedule-orders",
    component: ScheduleOrders,
  },
  {
    path: "restaurant/order-details/:orderId",
    component: OrderDetails,
  },
  {
    path: "/order-details",
    component: OrderDetails,
  },

  {
    path: "restaurant/rejected",
    component: Rejected,
  },
  //Table Booking
  {
    path: "/booking-details/:id",
    component: TableBookingDetails,
  },
  {
    path: "/table-booking",
    component: TableBooking,
  },

  //Stamp Card
  {
    path: "/stamp-cards",
    component: AddStampCard,
  },
  //collect-cash
  {
    path: "/collect-cash",
    component: CollectCash,
  },
  //item report
  {
    path: "/item-report",
    component: ItemReport,
  },
  //Active Orders
  {
    path: "/active-orders",
    component: ActiveOrders,
  },
  {
    path: "/vehicle-management",
    component: VehicleManagement,
  },
  // Store Orders removed

  // All Zones
  {
    path: "/all-zones",
    component: Zones,
  },
  {
    path: "/add-new-zone",
    component: AddNewZone,
  },
  {
    path: "/update-zone",
    component: UpdateZone,
  },
  // All Restaurants
  {
    path: "/all-restaurants",
    component: Restaurants,
  },
  {
    path: "/add-restaurant",
    component: AddRestaurants,
  },
  {
    path: "/edit-restaurant/:resId",
    component: EditRestaurants,
  },

  // All Stores
  {
    path: "/all-stores",
    component: Stores,
  },
  {
    path: "/edit-store/:resId",
    component: EditStore,
  },
  {
    path: "/add-store",
    component: AddStore,
  },
  // Live Map
  {
    path: "/live-map",
    component: LiveMap,
  },

  // All Countries
  {
    path: "/all-countries",
    component: Countries,
  },

  // All Countries
  {
    path: "/all-cities",
    component: Cities,
  },

  // Promotions
  {
    path: "/vouchers",
    component: Voucher,
  },
  {
    path: "/notifications",
    component: Notifications,
  },
  {
    path: "/charges",
    component: Charges,
  },

  // Earnings
  {
    path: "/overall-earnings",
    component: OverAllEarning,
  },
  {
    path: "/admin-earnings",
    component: AdminEarnings,
  },
  {
    path: "/driver-earnings",
    component: DriverEarnings,
  },
  {
    path: "/restaurant-earnings",
    component: RestaurantEarnings,
  },
  {
    path: "/store-earnings",
    component: StoreEarnings,
  },

  // Front Settings
  {
    path: "/front-settings",
    component: FrontSettings,
  },
  {
    path: "/header-design",
    component: HeaderDesign,
  },
  // Current Orders
  {
    path: "/current-orders",
    component: CurrentOrder,
  },
  //Banners
  {
    path: "/banners",
    component: Banners,
  },
  // Payout Request
  {
    path: "/payout-request",
    component: PayoutRequest,
  },
  {
    path: "/payout-table",
    component: PayoutTable,
  },
  {
    path: "/auto-request",
    component: AutoRequest,
  },
  {
    path: "/manual-request",
    component: ManualRequest,
  },
  {
    path: "/payout-failure-manage",
    component: PayoutFailureManagement,
  },
  {
    path: "/payout-reports",
    component: PayoutReports,
  },
  {
    path: "/payout-details",
    component: PayoutDetails,
  },
  {
    path: "/restaurant-payouts",
    component: RestaurantPayouts,
  },
  {
    path: "/driver-payouts",
    component: DriverPayouts,
  },
  // Profile Settings
  {
    path: "/profile-settings",
    component: ProfileSettings,
  },

  {
    path: "/default-values",
    component: DefaultValues,
  },
  //Food Management
  {
    path: "/manage-addOn",
    component: ManageAddOns,
  },
  {
    path: "/manage-collection",
    component: ManageCollection,
  },
  {
    path: "/manage-categories",
    component: ManageCategories,
  },
  {
    path: "/manage-products",
    component: ManageProducts,
  },
  {
    path: "/refund-management",
    component: RefundManagement,
  },
  {
    path: "/dispute-orders",
    component: DisputeOrder,
  },
  {
    path: "/deposit",
    component: Deposit,
  },
  {
    path: "/vat-categories",
    component: VatCategories,
  },
];

const routes = [...coreRoutes];
export default routes;
