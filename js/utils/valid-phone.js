function validPhoneNumber(phoneNumber) {
  // TODO: Return whether phoneNumber is in the proper form
  return /^\(\d{3}\) \d{3}-\d{4}$/.test(phoneNumber)
}
