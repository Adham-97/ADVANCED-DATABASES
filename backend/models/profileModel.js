const session = require('../config/database');

class Profile {
  static async getUserProfile(customer_id) {
    const result = await session.run(
      `MATCH (u:User {id: $customer_id}) RETURN u`,
      { customer_id }
    );
    return result.records.length > 0 ? result.records[0].get('u').properties : null;
  }

  static async updateUserProfile(customer_id, name, email, phone) {
    const result = await session.run(
      `MATCH (u:User {id: $customer_id}) 
      SET u.name = $name, u.email = $email, u.phone = $phone 
      RETURN u`,
      { customer_id, name, email, phone }
    );
    return result.records.length > 0 ? result.records[0].get('u').properties : null;
  }
}

module.exports = Profile;
