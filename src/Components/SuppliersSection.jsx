import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import SupplierRegionCard from "./SupplierRegionCard";
import "../styles/suppliersSection.css";

export default function SuppliersSection() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetch("/data/mockdata.json")
      .then((res) => res.json())
      .then((data) => {
        if (data.suppliersData) {
          setSuppliers(data.suppliersData);
        }
      })
      .catch((err) => console.error("Error fetching suppliers:", err));
  }, []);

  if (!suppliers || suppliers.length === 0) return null;

  return (
    <Container className="mt-5 mb-5">
      <h3 className="suppliers-title mb-4">Suppliers by region</h3>
      <Row className="g-3 row-cols-2 row-cols-md-3 row-cols-lg-5">
        {suppliers.map((s) => (
          <Col key={s.id}>
            <SupplierRegionCard
              country={s.country}
              domain={s.domain}
              flag={s.flag}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
