export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export const normalizeBrazilianPhone = (phone: string) => {
  const digits = onlyDigits(phone);
  return digits.startsWith("55") && digits.length > 11
    ? digits.slice(2)
    : digits;
};

export const toVerificationCode = (value: string) =>
  onlyDigits(value).slice(0, 6);
