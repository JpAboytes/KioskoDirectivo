import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Justificante from '@/models/Justificante';

// GET /api/justificantes - Get all justificantes
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const justificantes = await Justificante.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: justificantes,
    });
  } catch (error) {
    console.error('Error fetching justificantes:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener los justificantes' },
      { status: 500 }
    );
  }
}

// POST /api/justificantes - Create a new justificante
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { requester, eventName, justifiedDates, studentsText, userId, userEmail } = body;

    // Validation
    if (!requester || !eventName || !justifiedDates || !studentsText || !userId || !userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'Todos los campos son requeridos',
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(justifiedDates) || justifiedDates.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Debes proporcionar al menos una fecha justificada',
        },
        { status: 400 }
      );
    }

    // Create new justificante
    const newJustificante = await Justificante.create({
      requester,
      eventName,
      justifiedDates,
      studentsText,
      userId,
      userEmail,
      status: 'pendiente',
    });

    return NextResponse.json(
      {
        success: true,
        data: newJustificante,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating justificante:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear el justificante' },
      { status: 500 }
    );
  }
}

// PATCH /api/justificantes - Update justificante status
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { id, status, approvedBy, rejectionReason } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'ID y estado son requeridos' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status,
      approvedBy,
      approvedAt: new Date(),
    };

    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedJustificante = await Justificante.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedJustificante) {
      return NextResponse.json(
        { success: false, error: 'Justificante no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedJustificante,
    });
  } catch (error) {
    console.error('Error updating justificante:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar el justificante' },
      { status: 500 }
    );
  }
}
