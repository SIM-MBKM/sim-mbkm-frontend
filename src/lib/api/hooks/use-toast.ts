import { toast as reactToastify, ToastOptions, TypeOptions } from 'react-toastify';

// Define our own ToastProps interface
interface CustomToastProps {
  title?: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
}

// Map our variant types to react-toastify's TypeOptions
const variantToType: Record<CustomToastProps['variant'] & string, TypeOptions> = {
  default: 'default',
  destructive: 'error',
  success: 'success',
  warning: 'warning',
  info: 'info',
};

export const useToast = () => {
  const toast = ({ 
    title, 
    description, 
    variant = 'default', 
    duration = 3000 
  }: CustomToastProps) => {
    const type = variantToType[variant] || 'default';
    
    const options: ToastOptions = {
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    // If we have a title, we'll use it as a prefix to the description
    const message = title ? `${title}: ${description}` : description;
    
    return reactToastify(message, {
      ...options,
      type,
    });
  };

  return { toast };
};

export default useToast; 