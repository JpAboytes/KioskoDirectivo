import mongoose, { Schema, model, models } from 'mongoose';

export interface IJustificante {
  eventName: string;
  requester: string;
  justifiedDates: string[];
  studentsText: string;
  createdAt: Date;
  status: 'pendiente' | 'aprobado' | 'rechazado';
  userId: string;
  userEmail: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
}

const JustificanteSchema = new Schema<IJustificante>({
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
  },
  requester: {
    type: String,
    required: [true, 'Requester is required'],
    enum: ['Deportes', 'Asuntos Estudiantiles', 'Coordinador', 'Otro'],
  },
  justifiedDates: {
    type: [String],
    required: [true, 'At least one justified date is required'],
  },
  studentsText: {
    type: String,
    required: [true, 'Students list is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado'],
    default: 'pendiente',
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
  },
  userEmail: {
    type: String,
    required: [true, 'User email is required'],
  },
  approvedBy: {
    type: String,
  },
  approvedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Justificante = models.Justificante || model<IJustificante>('Justificante', JustificanteSchema);

export default Justificante;
