import { Card, Col, Row } from "react-bootstrap";
import {
  FaUsers,
  FaBoxOpen,
  FaDollarSign,
  FaShoppingCart,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 2780 },
  { name: "May", sales: 6890 },
  { name: "Jun", sales: 3490 },
];

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard text-start">
      <div className="d-flex justify-content-between align-items-end mb-4 pb-3 border-bottom border-secondary border-opacity-10">
        <div>
          <h3 className="fw-bold text-main-theme m-0">Dashboard Overview</h3>
          <p className="text-muted small m-0 mt-1">
            Welcome back, here is what's happening today.
          </p>
        </div>
      </div>

      <Row className="g-4 mb-5">
        <Col xl={3} lg={4} sm={6}>
          <Card className="admin-stat-card border-0 h-100 position-relative">
            <div className="stat-card-bg-icon"></div>
            <Card.Body className="p-4 d-flex flex-column justify-content-between position-relative z-1">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="stat-icon-wrapper revenue">
                  <FaDollarSign size={22} />
                </div>
              </div>
              <div>
                <p className="text-muted fw-medium mb-1 small text-uppercase tracking-wider">
                  Total Revenue
                </p>
                <h2 className="fw-bolder text-main-theme m-0">$24,500</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={4} sm={6}>
          <Card className="admin-stat-card border-0 h-100 position-relative">
            <div className="stat-card-bg-icon"></div>
            <Card.Body className="p-4 d-flex flex-column justify-content-between position-relative z-1">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="stat-icon-wrapper orders">
                  <FaShoppingCart size={22} />
                </div>
              </div>
              <div>
                <p className="text-muted fw-medium mb-1 small text-uppercase tracking-wider">
                  Total Orders
                </p>
                <h2 className="fw-bolder text-main-theme m-0">4,320</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={4} sm={6}>
          <Card className="admin-stat-card border-0 h-100 position-relative">
            <div className="stat-card-bg-icon"></div>
            <Card.Body className="p-4 d-flex flex-column justify-content-between position-relative z-1">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="stat-icon-wrapper products">
                  <FaBoxOpen size={22} />
                </div>
              </div>
              <div>
                <p className="text-muted fw-medium mb-1 small text-uppercase tracking-wider">
                  Total Products
                </p>
                <h2 className="fw-bolder text-main-theme m-0">1,240</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={4} sm={6}>
          <Card className="admin-stat-card border-0 h-100 position-relative">
            <div className="stat-card-bg-icon"></div>
            <Card.Body className="p-4 d-flex flex-column justify-content-between position-relative z-1">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="stat-icon-wrapper users">
                  <FaUsers size={22} />
                </div>
              </div>
              <div>
                <p className="text-muted fw-medium mb-1 small text-uppercase tracking-wider">
                  Total Users
                </p>
                <h2 className="fw-bolder text-main-theme m-0">8,930</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="admin-chart-card border-0 p-4">
        <h5 className="fw-bold text-main-theme mb-4">Sales Statistics</h5>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--main-text)"
                strokeOpacity={0.08}
              />
              <XAxis
                dataKey="name"
                stroke="var(--main-text)"
                opacity={0.6}
                tickLine={false}
                axisLine={false}
                tickMargin={12}
              />
              <YAxis
                stroke="var(--main-text)"
                opacity={0.6}
                tickLine={false}
                axisLine={false}
                tickMargin={12}
              />
              <Tooltip
                cursor={{ fill: "var(--main-text)", opacity: 0.05 }}
                contentStyle={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  borderRadius: "12px",
                  color: "var(--main-text)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                }}
                itemStyle={{ color: "var(--accent-color)", fontWeight: "bold" }}
              />
              <Bar
                dataKey="sales"
                fill="var(--accent-color)"
                radius={[6, 6, 0, 0]}
                barSize={35}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
