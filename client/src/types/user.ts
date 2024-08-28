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
  
 export interface SidebarProps {
    user: Users | null;
    formData: {
      username: string;
      email: string;
      avatar: string;
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
      phone: string;
      gender: string;
    };
    isEditing: {
      username: boolean;
      email: boolean;
      avatar: boolean;
      password: boolean;
      phone: boolean;
      gender: boolean;
    };
    handleChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => void;
    setIsEditing: React.Dispatch<
      React.SetStateAction<{
        username: boolean;
        email: boolean;
        avatar: boolean;
        password: boolean;
        phone: boolean;
        gender: boolean;
      }>
    >;
  }