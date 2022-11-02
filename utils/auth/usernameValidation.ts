import axios from "axios";

interface Data {
  message?: boolean;
  error?: string;
}

export const usernameFormatCheck = (username: string) => {
  return username.trim() !== "";
};

//valid is true
export const verifyUsername = async (username: string) => {
  try {
    const {
      data: { message },
    } = await axios.get<Data>(
      `http://localhost:3000/api/validation/username/${username}`
    );
    return message;
  } catch (err) {
    throw 'Can not connect to server.'
  }
};
