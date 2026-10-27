import { getRoles } from './contractService.js';

export async function detectRole(address) {
  if (!address) return 'patient';
  const roles = await getRoles(address);
  if (roles.isInsurer) return 'insurer';
  if (roles.isHospital) return 'hospital';
  return 'patient';
}
