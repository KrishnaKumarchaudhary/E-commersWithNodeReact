import { ReactElement, useState } from "react";
import TableHOC from "../components/admin/TableHOC";
import { Column } from "react-table";
import { Link } from "react-router-dom";
type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};
const column: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];
const Order = () => {
  const [rows, setRows] = useState<DataType[]>([
    {
      _id: "Krishna1",
      amount: 5000,
      quantity: 5,
      discount: 400,
      status: <span className="red">Processing</span>,
      action: <Link to={`/order/Krishna1`}>View</Link>,
    },
    {
      _id: "Krishna1",
      amount: 5000,
      quantity: 5,
      discount: 400,
      status: <span className="red">Processing</span>,
      action: <Link to={`/order/Krishna1`}>View</Link>,
    },
    {
      _id: "Krishna1",
      amount: 5000,
      quantity: 5,
      discount: 400,
      status: <span className="red">Processing</span>,
      action: <Link to={`/order/Krishna1`}>View</Link>,
    },
    {
      _id: "Krishna1",
      amount: 5000,
      quantity: 5,
      discount: 400,
      status: <span className="red">Processing</span>,
      action: <Link to={`/order/Krishna1`}>View</Link>,
    },
    {
      _id: "Krishna1",
      amount: 5000,
      quantity: 5,
      discount: 400,
      status: <span className="red">Processing</span>,
      action: <Link to={`/order/Krishna1`}>View</Link>,
    },
    {
      _id: "Krishna1",
      amount: 5000,
      quantity: 5,
      discount: 400,
      status: <span className="red">Processing</span>,
      action: <Link to={`/order/Krishna1`}>View</Link>,
    },
    {
      _id: "Krishna1",
      amount: 5000,
      quantity: 5,
      discount: 400,
      status: <span className="red">Processing</span>,
      action: <Link to={`/order/Krishna1`}>View</Link>,
    },
    {
      _id: "Krishna1",
      amount: 5000,
      quantity: 5,
      discount: 400,
      status: <span className="red">Processing</span>,
      action: <Link to={`/order/Krishna1`}>View</Link>,
    },
  ]);
  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-product-box",
    "Orders",
    rows.length > 6 ? true : false
  )();
  return (
    <div className="container">
      <h1>My Order</h1>
      {Table}
    </div>
  );
};

export default Order;
