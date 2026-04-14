import React from "react";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { FiMapPin, FiPlus, FiEdit, FiTrash2, FiPhone } from "react-icons/fi";

export default function AddressSection({
  isLoadingAddresses,
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  openAddModal,
  openEditModal,
  handleDeleteAddress,
}) {
  return (
    <div className="checkout-card mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="checkout-section-title m-0 d-flex align-items-center gap-2">
          <FiMapPin className="text-pink" /> Shipping Address
        </h5>
        <Button
          variant="outline-primary"
          size="sm"
          className="btn-outline-pink d-flex align-items-center gap-1 shadow-none"
          onClick={openAddModal}
        >
          <FiPlus /> Add New
        </Button>
      </div>

      {isLoadingAddresses ? (
        <div className="d-flex justify-content-center align-items-center gap-2 py-4">
          <Spinner animation="border" size="sm" className="text-pink" />
          <span className="text-muted-theme">Loading addresses...</span>
        </div>
      ) : addresses.length > 0 ? (
        <Row className="g-3">
          {addresses.map((addr) => (
            <Col md={6} key={addr.id}>
              <div
                className={`rounded p-3 transition-all h-100 address-card d-flex flex-column ${
                  selectedAddressId === addr.id ? "selected-address" : ""
                }`}
                onClick={() => setSelectedAddressId(addr.id)}
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-bold m-0 d-flex align-items-center gap-1 address-card-title">
                    {addr.name}
                  </h6>
                  <div className="d-flex gap-2 flex-shrink-0 address-actions-wrapper">
                    <button
                      className="btn btn-sm p-0 shadow-none border-0 btn-edit-address"
                      title="Edit"
                      onClick={(e) => openEditModal(e, addr)}
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      className="btn btn-sm p-0 shadow-none border-0 text-danger"
                      title="Delete"
                      onClick={(e) => handleDeleteAddress(e, addr.id)}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-1 flex-grow-1">
                  <p className="small text-muted-theme mb-1">
                    {addr.city}, {addr.neighborhood}
                  </p>
                  <p className="small text-muted-theme mb-1">
                    {addr.street}, {addr.building}
                  </p>
                  <div className="small fw-medium m-0 mt-2 d-flex align-items-center gap-2 address-card-phone">
                    <FiPhone size={14} className="text-pink flex-shrink-0" />
                    <span dir="ltr">{addr.phone}</span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-4 border rounded border-dashed empty-address-container">
          <FiMapPin size={30} className="mb-2 empty-address-icon" />
          <p className="text-muted-theme mb-0">
            No saved addresses found. Please add a new address.
          </p>
        </div>
      )}
    </div>
  );
}
