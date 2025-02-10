import Swal from "sweetalert2";

// ✅ Success Message
export const showSuccess = (message) => {
  Swal.fire({
    icon: "success",
    title: "Success!",
    text: message,
  });
};

// ✅ Error Message
export const showError = (message) => {
  Swal.fire({
    icon: "error",
    title: "Error!",
    text: message,
  });
};

// ✅ Confirmation Dialog
export const showConfirm = (message, callback) => 
  Swal.fire({
    title: "Are you sure?",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
}).then((result) => {
    return result.isConfirmed}); // ✅ Return true if confirmed
