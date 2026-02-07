export {};

declare global {
  interface Window {
    phoneEmailListener?: (userObj: {
      user_json_url: string;
      [key: string]: any;
    }) => void;
  }
}
