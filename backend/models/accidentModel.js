const session = require('../config/database');

class Accident {
  static async createAccident(id, car_id, location_id, date, description) {
    const result = await session.run(
      `CREATE (a:Accident {id: $id, car_id: $car_id, location-_id_id: $location-_id_id, date: $date, description: $description}) 
      RETURN a`,
      { id, car_id, location_id, date, description }
    );
    return result.records[0].get('a').properties;
  }

  static async getAccidentsByVehicle(car_id) {
    const result = await session.run(
      `MATCH (v:Car {id: $car_id})<-[:INVOLVES]-(a:Accident) RETURN a`,
      { car_id }
    );
    return result.records.map(record => record.get('a').properties);
  }

  static async getAllAccidents() {
    const result = await session.run(`MATCH (a:Accident) RETURN a`);
    return result.records.map(record => record.get('a').properties);
  }
}

module.exports = Accident;
