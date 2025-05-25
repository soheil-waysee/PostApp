import { API_BASE_URL } from '@/config/env';

const shipmentId = `SHIP-${Math.floor(Math.random() * 100000)}`;

describe('E2E: /post Lambda API', () => {
  it('should return ok from GET /health', async () => {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toEqual({ status: 'ok' });
  });

  it('should create a new event for a shipment', async () => {
    const payload = {
      timestamp: new Date().toISOString(),
      status: 'in_transit',
      location: 'Stockholm',
      details: 'Shipment received at sorting facility',
    };

    const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data.shipmentId).toBe(shipmentId);
    expect(data.status).toBe(payload.status);
  });

  it('should return the latest event for a shipment', async () => {
    const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}/events/latest`, {
      method: 'GET',
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.shipmentId).toBe(shipmentId);
    expect(data.status).toBe('in_transit');
  });

  it('should return full event history for a shipment', async () => {
    const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}/events`, {
      method: 'GET',
    });

    expect(response.status).toBe(200);
    const { events } = await response.json();
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].shipmentId).toBe(shipmentId);
  });
});
