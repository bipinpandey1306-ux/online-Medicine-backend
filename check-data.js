import mongoose from "mongoose";

const dbUrl = "mongodb+srv://krishnapharmacykaruana_db_user:p8rw03Gu0AhNMXgx@cluster0.4alcxkq.mongodb.net/krishna_pharmacy?retryWrites=true&w=majority";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(dbUrl);
    console.log("Connected successfully.");
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections in DB:", collections.map(c => c.name));
    
    // Check counts
    const MedicineSchema = new mongoose.Schema({}, { strict: false });
    const MedicineModel = mongoose.models.Medicine || mongoose.model("Medicine", MedicineSchema);
    const medCount = await MedicineModel.countDocuments();
    console.log("Medicine count in DB:", medCount);

    const CategorySchema = new mongoose.Schema({}, { strict: false });
    const CategoryModel = mongoose.models.Category || mongoose.model("Category", CategorySchema);
    const catCount = await CategoryModel.countDocuments();
    console.log("Category count in DB:", catCount);

    const UserSchema = new mongoose.Schema({}, { strict: false });
    const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
    const userCount = await UserModel.countDocuments();
    console.log("User count in DB:", userCount);

    const ids = [9, 13, 21];
    for (const id of ids) {
      const med = await MedicineModel.findOne({ id });
      if (med) {
        console.log(`Medicine ID ${id}:`);
        console.log(`  Name: ${med.get('name')}`);
        console.log(`  ImageUrl: ${med.get('imageUrl') ? med.get('imageUrl').substring(0, 100) + '...' : 'none'}`);
      } else {
        console.log(`Medicine ID ${id} not found.`);
      }
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
