import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_TABULAIRE;
    
    const response = await axios.get(
      `${baseUrl}/resources/2a13e12b-b3aa-4fa5-ae2d-1ab329da6e71/profile/`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des données:', error.message);
    return NextResponse.json(
      { 
        message: 'Erreur lors de la récupération des données',
        error: error.response?.data || error.message 
      },
      { status: error.response?.status || 500 }
    );
  }
}
