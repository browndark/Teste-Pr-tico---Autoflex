import { toast } from 'react-toastify';

export const showSuccess = (message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    closeButton: true,
    pauseOnHover: false,
    draggable: true,
  });
};

export const showError = (message) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    closeButton: true,
    pauseOnHover: false,
    draggable: true,
  });
};

export const showWarning = (message) => {
  toast.warning(message, {
    position: 'top-right',
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    closeButton: true,
    pauseOnHover: false,
    draggable: true,
  });
};

export const showInfo = (message) => {
  toast.info(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    closeButton: true,
    pauseOnHover: false,
    draggable: true,
  });
};
