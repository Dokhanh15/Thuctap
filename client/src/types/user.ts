export type Users = {
    _id: string;
    username: string;
    avatar: string;
    email: string;
    password: string;
    isLocked: boolean;
    role: string;
    phone?: string; 
    gender?: 'nam' | 'nữ' | 'khác'; 
  };
  