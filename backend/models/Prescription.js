import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  medication: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  tilldate: { type: Date, required: true },
}, { timestamps: true });

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
