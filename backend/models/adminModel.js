const session = require('../config/database');

// Admin - Get all bookings
class Admin {
  static async getAllBookings() {
    const result = await session.run('MATCH (b:Booking) RETURN b');
    return result.records.map(record => record.get('b').properties);
  }

  // Admin - Get all accident logs
  static async getAllAccidents() {
    const result = await session.run('MATCH (a:Accident) RETURN a');
    return result.records.map(record => record.get('a').properties);
  }

  // Admin - Update a booking (e.g., change status)
  static async updateBooking(booking_id, status) {
    const result = await session.run(
      `MATCH (b:Booking {id: $booking_id})
      SET b.status = $status
      RETURN b`,
      { booking_id, status }
    );
    return result.records.length > 0 ? result.records[0].get('b').properties : null;
  }

  // Admin - Delete a booking
  static async deleteBooking(booking_id) {
    const result = await session.run(
      `MATCH (b:Booking {id: $booking_id})
      DELETE b`,
      { booking_id }
    );
    return result.summary.counters.updates().nodesDeleted > 0;
  }

  // Admin - Delete an accident log
  static async deleteAccident(accidentId) {
    const result = await session.run(
      `MATCH (a:Accident {id: $accidentId})
      DELETE a`,
      { accidentId }
    );
    return result.summary.counters.updates().nodesDeleted > 0;
  }
  // Admin - Add a car
static async addCar(carData) {
  const result = await session.run(
      `CREATE (c:Car {car_id: $car_id, brand: $brand, model: $model, year: $year, rental_rate_per_day: $rental_rate_per_day, availability: $availability, category: $category, color: $color, location-_id_id: $location-_id_id})
      RETURN c`,
      carData
  );
  return result.records[0].get('c').properties;
}

// Admin - Delete a car
static async deleteCar(car_id) {
  const result = await session.run(
      `MATCH (c:Car {car_id: $car_id}) DELETE c`,
      { car_id }
  );
  return result.summary.counters.updates().nodesDeleted > 0;
}

// Admin - View all cars
static async getAllCars() {
  const result = await session.run(`MATCH (c:Car) RETURN c`);
  return result.records.map(record => record.get('c').properties);
}

}


module.exports = Admin;
