import objectLocations from "../data/location.json";
export const locations = objectLocations.map((location) => location.longitude + "," + location.latitude);

// phone no format and convert to +254

export function formatKenyanPhoneNumber(phoneNumber: string): string {
    const kenyaDialingCode = "+254";
    const kenyanPhoneNumberRegex = /^0(\d{9})$/;
  
    // Remove any spaces, dashes, or other non-numeric characters from the phone number
    const sanitizedPhoneNumber = phoneNumber.replace(/\D/g, "");
  
    // Check if the phone number matches the Kenyan phone number pattern
    if (kenyanPhoneNumberRegex.test(sanitizedPhoneNumber)) {
      // If the phone number is valid, format it with the Kenyan dialing code
      const subscriberNumber = sanitizedPhoneNumber.match(
        kenyanPhoneNumberRegex
      )![1];
      return `${kenyaDialingCode}${subscriberNumber}`;
    } else {
      // If the phone number is invalid, throw an error
      throw new Error("Invalid Kenyan phone number");
    }
  }
  
