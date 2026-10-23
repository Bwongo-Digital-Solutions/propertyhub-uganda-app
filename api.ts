import * as SecureStore from 'expo-secure-store';

const API_BASE = (process.env.EXPO_PUBLIC_API_URL || '').trim().replace(/\/$/, '');
const API_KEY = process.env.EXPO_PUBLIC_API_KEY || '';
const TOKEN_KEY = 'propertyhub.accessToken';
let accessToken = '';
let tokenLoaded = false;
export const hasLocalApiKey = Boolean(API_KEY);
export async function restoreAccessToken(){ if(!tokenLoaded){accessToken = await SecureStore.getItemAsync(TOKEN_KEY) || ''; tokenLoaded = true;} return accessToken; }
export async function clearAccessToken(){ accessToken=''; tokenLoaded=true; await SecureStore.deleteItemAsync(TOKEN_KEY); }
export async function signIn(email:string,password:string,organisationId?:string){ const result=await apiRequest<{token:string;user:{id:string;organisationId:string;name:string;email:string;role:string}}>('/auth/login',{method:'POST',body:JSON.stringify({email,password,...(organisationId?{organisationId}:{})})}); accessToken=result.token;tokenLoaded=true;await SecureStore.setItemAsync(TOKEN_KEY,result.token);return result; }

export class ApiError extends Error {
  constructor(message: string, public status = 0) { super(message); this.name = 'ApiError'; }
}
export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_BASE) throw new ApiError('EXPO_PUBLIC_API_URL is not configured. Copy .env.example to .env and set your Ubuntu LAN IP or emulator API address.');
  await restoreAccessToken();
  let response: Response;
  try {
    response = await fetch(API_BASE + (path.startsWith('/') ? path : '/' + path), {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: 'Bearer ' + accessToken } : API_KEY ? { 'X-API-Key': API_KEY } : {}), ...init.headers },
    });
  } catch {
    throw new ApiError('Cannot reach PropertyHub API. Check EXPO_PUBLIC_API_URL and ensure the API is reachable on your LAN.');
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(payload.error || 'API request failed (' + response.status + ')', response.status);
  return payload as T;
}
export type ApiProperty = { id:string; name:string; location:string; type:string; units:number; occupied:number; rent:number; monthlyRent:number; status:string };
export type ApiTenant = { id:string; name:string; email?:string|null; phone?:string|null; unit:string; property:string; propertyId:string; monthlyRent:number; rent:number; paymentStatus:string; status:string; leaseId?:string|null };
export type ApiIssue = { id:string; title:string; description?:string|null; propertyId:string; property:string; priority:string; status:string; createdAt:string; resolvedAt?:string|null };
export type ApiDashboard = { currency:string; properties:number; units:number; occupiedUnits:number; rentBilled:number; rentCollected:number; outstandingRent:number; openMaintenance:number; demoData:false; source:'postgresql' };

export type ApiUnit = { id:string; code:string; propertyId:string; property:string; monthlyRent:number; status:'VACANT'|'OCCUPIED'|'RESERVED'|'UNAVAILABLE' };

export type ApiInvoice = { id:string; reference:string; description:string; amount:number; dueDate:string; createdAt:string; leaseId:string; tenantId:string; tenant:string; propertyId:string; property:string; unitId:string; unit:string; allocated:number; confirmed:number; balance:number; status:'OPEN'|'OVERDUE'|'PARTIAL'|'PAID' };
export type ApiPayment = { id:string; provider:string; reference?:string|null; amount:number; currency:string; status:string; receivedAt?:string|null; createdAt:string; tenant:string; property:string; unit:string };
