import React from "react";
import { Modal, Form, Row, Col, Button, Spinner } from "react-bootstrap";

export default function AddressModals({
  showAddModal,
  setShowAddModal,
  newAddress,
  handleAddChange,
  handleAddAddress,
  isAddingAddress,
  showEditModal,
  setShowEditModal,
  editingAddress,
  handleEditChange,
  handleUpdateAddress,
  isSavingAddress,
}) {
  return (
    <>
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        dialogClassName="custom-address-modal"
      >
        <Modal.Header
          closeButton
          className="border-secondary border-opacity-25"
        >
          <Modal.Title className="fs-5">Add New Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddAddress}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small mb-1">Address Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    className="address-modal-input shadow-none"
                    value={newAddress.name}
                    onChange={handleAddChange}
                    placeholder="e.g. Home, Office"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small mb-1">Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    className="address-modal-input shadow-none"
                    value={newAddress.phone}
                    onChange={handleAddChange}
                    placeholder="09..."
                    required
                    dir="ltr"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small mb-1">City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    className="address-modal-input shadow-none"
                    value={newAddress.city}
                    onChange={handleAddChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small mb-1">Neighborhood</Form.Label>
                  <Form.Control
                    type="text"
                    name="neighborhood"
                    className="address-modal-input shadow-none"
                    value={newAddress.neighborhood}
                    onChange={handleAddChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small mb-1">Street</Form.Label>
                  <Form.Control
                    type="text"
                    name="street"
                    className="address-modal-input shadow-none"
                    value={newAddress.street}
                    onChange={handleAddChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small mb-1">Building</Form.Label>
                  <Form.Control
                    type="text"
                    name="building"
                    className="address-modal-input shadow-none"
                    value={newAddress.building}
                    onChange={handleAddChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small mb-1">Zip Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="zip_code"
                    className="address-modal-input shadow-none"
                    value={newAddress.zip_code}
                    onChange={handleAddChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="custom-checkbox-pink mt-2">
                  <Form.Check
                    type="checkbox"
                    id="is_default_add_checkbox"
                    name="is_default"
                    label="Set as default address"
                    checked={newAddress.is_default}
                    onChange={handleAddChange}
                    className="shadow-none"
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="outline-secondary"
                onClick={() => setShowAddModal(false)}
                className="shadow-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn-accent-solid shadow-none"
                disabled={isAddingAddress}
              >
                {isAddingAddress ? <Spinner size="sm" /> : "Add Address"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        dialogClassName="custom-address-modal"
      >
        <Modal.Header
          closeButton
          className="border-secondary border-opacity-25"
        >
          <Modal.Title className="fs-5">Edit Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingAddress && (
            <Form onSubmit={handleUpdateAddress}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small mb-1">Address Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      className="address-modal-input shadow-none"
                      value={editingAddress.name}
                      onChange={handleEditChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small mb-1">Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      className="address-modal-input shadow-none"
                      value={editingAddress.phone}
                      onChange={handleEditChange}
                      required
                      dir="ltr"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small mb-1">City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      className="address-modal-input shadow-none"
                      value={editingAddress.city}
                      onChange={handleEditChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small mb-1">Neighborhood</Form.Label>
                    <Form.Control
                      type="text"
                      name="neighborhood"
                      className="address-modal-input shadow-none"
                      value={editingAddress.neighborhood}
                      onChange={handleEditChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small mb-1">Street</Form.Label>
                    <Form.Control
                      type="text"
                      name="street"
                      className="address-modal-input shadow-none"
                      value={editingAddress.street}
                      onChange={handleEditChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small mb-1">Building</Form.Label>
                    <Form.Control
                      type="text"
                      name="building"
                      className="address-modal-input shadow-none"
                      value={editingAddress.building}
                      onChange={handleEditChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="small mb-1">Zip Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="zip_code"
                      className="address-modal-input shadow-none"
                      value={editingAddress.zip_code}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="custom-checkbox-pink mt-2">
                    <Form.Check
                      type="checkbox"
                      id="is_default_edit_checkbox"
                      name="is_default"
                      label="Set as default address"
                      checked={editingAddress.is_default}
                      onChange={handleEditChange}
                      className="shadow-none"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowEditModal(false)}
                  className="shadow-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="btn-accent-solid shadow-none"
                  disabled={isSavingAddress}
                >
                  {isSavingAddress ? <Spinner size="sm" /> : "Save Changes"}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
