export interface Address {
  id: number;
  user_id: number;
  recipient_full_name: string; 
  phone: string;
  address_line: string;
  city: string;
  department: string;          
  neighborhood: string;        
  complement: string | null;   
  is_default: boolean;
}

export type AddressPayload = Omit<Address, "id" | "user_id">;