import axios from "axios";

interface Data {
  message?: boolean;
  error?: string;
}

export const emailFormatCheck = (email: string) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

//valid is true
export const verifyEmail = async (email: string) => {
  try {
    const {
      data: { message },
    } = await axios.get<Data>(`/api/validation/email/${email}`);
    return message;
  } catch (err) {
    throw 'Can not connect to server.'
  }
};
