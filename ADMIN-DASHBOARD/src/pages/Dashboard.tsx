import { BsSearch } from "react-icons/bs";
import AdminSidebar from "../components/AdminSidebar";
import { FaRegBell } from "react-icons/fa";
import userImg from "../assets/userpic.png";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import categoryData from "./../assets/data.json";
import { BarCharts, DoughnutChart } from "../components/Charts";
import { BiMaleFemale } from "react-icons/bi";
import Table from "../components/DashboardTable";
import data from "./../assets/data.json";
function Dashboard() {
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        <div className="bar">
          <BsSearch />
          <input type="text" placeholder="Search for data , users, docs" />

          <FaRegBell />
          <img src={userImg} alt="User" />
        </div>
        <section className="widget-container">
          <WidgetItem
            percentage={90}
            amount={true}
            value={34000}
            heading="Revenue"
            color="rgb(0,115,255)"
          />
          <WidgetItem
            percentage={80}
            amount={true}
            value={34000}
            heading="Users"
            color="rgb(0 ,198, 202)"
          />
          <WidgetItem
            percentage={-40}
            amount={false}
            value={34000}
            heading="Transactions"
            color="rgb(255, 196, 0)"
          />
          <WidgetItem
            percentage={30}
            amount={true}
            value={3400087}
            heading="Products"
            color="rgb(76, 0 ,175)"
          />
        </section>
        <section className="graph-container">
          <div className="revenue-chart">
            <h2>Revenue & Transactions</h2>
            <BarCharts
              data_1={[300, 400, 100, 500, 450, 900, 190]}
              data_2={[200, 700, 300, 400, 850, 600, 590]}
              title_1="Revanue"
              title_2="Transaction"
              bgColor_1="rgb(0,115,255)"
              bgColor_2="rgba(53,162,235,0.8)"
              horizantal={false}
            />
          </div>
          <div className="dashboard-categories">
            <h2>Inventory</h2>
            <div>
              {categoryData.categories.map((data, item) => (
                <CategoryItem
                  color={`hsl(${data.value * 4},100%,50%)`}
                  value={data.value}
                  heading={data.heading}
                  key={item}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="transaction-container">
          <div className="gender-chart">
            <h2>Gender Ratio</h2>
            <DoughnutChart
              labels={["Female", "Male"]}
              data={[12, 19]}
              backgroundColor={["hsl(340,82%, 56%)", "rgba(53,162,235,0.8)"]}
              cutout={90}
            />
            <p>
              <BiMaleFemale />
            </p>
          </div>
          <Table data={data.transaction} />
        </section>
      </main>
    </div>
  );
}
interface WidgetItemProps {
  heading: string;
  value: number;
  percentage: number;
  color: string;
  amount?: boolean;
}
const WidgetItem = ({
  heading,
  value,
  percentage,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `$${value}` : value}</h4>
      {percentage > 0 ? (
        <span className="green">
          <HiTrendingUp /> +{percentage}%{" "}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {percentage}%{" "}
        </span>
      )}
    </div>
    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(
        ${color} ${(Math.abs(percentage) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
      }}
    >
      <span style={{ color: `${color}` }}>{percentage}%</span>
    </div>
  </article>
);
interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default Dashboard;

//2:30:19

//10-01-2025 4:28
//11-01-2025 4:55
