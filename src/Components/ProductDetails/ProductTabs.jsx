import { useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";

export default function ProductTabs({ tabsData }) {
  const [activeTab, setActiveTab] = useState("description");

 const data = tabsData;
 if (!data) return null;

  return (
    <div className="product-tabs-container shadow-sm mb-4">
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="pills" className="custom-product-tabs flex-nowrap overflow-auto">
          <Nav.Item><Nav.Link eventKey="description">Description</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="reviews">Reviews</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="shipping">Shipping</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="about">About seller</Nav.Link></Nav.Item>
        </Nav>

        <Tab.Content className="product-tab-content p-4 text-start">
          <Tab.Pane eventKey="description">
            <p className="text-muted-theme mb-4" style={{ whiteSpace: "pre-line" }}>{data.description}</p>
            
           <table className="details-table mb-4">
              <tbody>
                {data.table.map((row, index) => (
                  <tr key={index}>
                    <td>{row.label}</td>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="feature-list text-muted-theme">
              {data.features.map((feature, index) => (
                <li key={index}>
                  <FaCheck className="text-success-theme icon-margin" /> {feature}
                </li>
              ))}
            </ul>
          </Tab.Pane>
          <Tab.Pane eventKey="reviews">
            <p className="text-muted-theme">No reviews yet.</p>
          </Tab.Pane>
          <Tab.Pane eventKey="shipping">
            <p className="text-muted-theme">Fast and reliable shipping worldwide.</p>
          </Tab.Pane>
          <Tab.Pane eventKey="about">
            <p className="text-muted-theme">We are a trusted supplier of high quality goods.</p>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}