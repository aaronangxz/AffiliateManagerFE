import {useState} from "react";

export const getToken = () => {
  const token = localStorage.getItem('auth') === null ? null : JSON.parse(localStorage.getItem('auth'));
  return token;
};
export default getToken;
