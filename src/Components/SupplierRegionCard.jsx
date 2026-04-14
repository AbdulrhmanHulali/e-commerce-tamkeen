import React from "react";

export default function SupplierRegionCard({ country, domain, flag }) {
  return (
    <div className="supplier-card d-flex align-items-center">
      <div className="flag-wrapper">
        <img src={flag} alt={country} className="country-flag" />
      </div>
      <div className="supplier-info">
        <div className="country-name">{country}</div>
        <div className="supplier-domain">{domain}</div>
      </div>
    </div>
  );
}