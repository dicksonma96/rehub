export const whatsapp_href = (message) => {
  let encodeMsg =
    message ||
    "Hi, I’d like to enquire about your services and available slots.";
  encodeURIComponent(encodeMsg);
  return `whatsapp://send?phone=60176158116&text=${encodeMsg}`;
};
