// middleware/rateLimit.js
import { NextResponse } from 'next/server';

// Almacén simple en memoria para contabilizar intentos
// En producción debería usar Redis u otra solución distribuida 
const ipRequestCounts = new Map();
const windowMs = 15 * 60 * 1000; // 15 minutos
const maxRequestsPerWindow = 100; // Máximo de 100 solicitudes por ventana

export function rateLimitMiddleware(req) {
  const ip = req.ip || '0.0.0.0';
  
  // Obtener y limpiar registros antiguos
  const now = Date.now();
  let requestLog = ipRequestCounts.get(ip) || [];
  requestLog = requestLog.filter(timestamp => now - timestamp < windowMs);
  
  // Verificar si excede el límite
  if (requestLog.length >= maxRequestsPerWindow) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later' },
      { status: 429 }
    );
  }
  
  // Actualizar el contador
  requestLog.push(now);
  ipRequestCounts.set(ip, requestLog);
  
  return NextResponse.next();
}