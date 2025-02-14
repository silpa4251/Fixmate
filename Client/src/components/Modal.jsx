/* eslint-disable react/prop-types */


const Modal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black-default bg-opacity-50 z-50">
      <div className="bg-white-default p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold text-center">{title}</h2>
        <p className="text-sm text-gray-600 my-3 text-center">{message}</p>
        <div className="flex justify-center gap-3 mt-4">
          <button 
            onClick={onClose} 
            className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
