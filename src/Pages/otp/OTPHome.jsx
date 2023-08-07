import React, { useState, useCallback, useEffect, useRef } from "react";
import configs from "../../configs/config.json";
import endpoint from "../../configs/endpoint.json";
import { useNavigate } from "react-router-dom";
const { SERVER_API } = configs;
const { focus, active } = endpoint;
export default function OTPHome() {
  const navigate = useNavigate();
  const [dataFocus, setDataFocus] = useState({});
  const [dataActive, setDataActive] = useState([]);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const fetchData = useCallback(async () => {
    const [resFocus, resActive] = await Promise.all([
      fetch(`${SERVER_API}${focus}`),
      fetch(`${SERVER_API}${active}`),
    ]);
    const dataFocus = await resFocus.json();
    setDataFocus(dataFocus);
    const dataActive = await resActive.json();
    setDataActive(dataActive);
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    if (dataFocus.phone) {
      navigate(`/otp/account/${dataFocus.phone}`);
    } else {
      inputRef.current.focus();
    }
  }, [dataFocus.phone, navigate]);
  const postFocus = useCallback(async (value) => {
    const response = await fetch(`${SERVER_API}${focus}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: value }),
    });
    const { phone } = await response.json();
    return phone;
  }, []);
  const validateInput = useCallback((inputValue) => {
    let error = "";
    const newValue = inputValue.replace(/[^0-9+]/g, "");
    const hasPlusSign = newValue.includes("+");
    if (!newValue) {
      error = "Phone number is required";
    } else if (hasPlusSign) {
      if (newValue.indexOf("+") !== 0) {
        error = "The + sign must be placed at the beginning";
      } else if (newValue[1] !== "8" && newValue[1] !== "9") {
        error = "After the + sign should be the number 8 or 9";
      } else if (newValue.length !== 12) {
        error = "Phone number must be 12 characters";
      }
    } else {
      if (newValue[0] !== "0") {
        error = "There should be a zero at the beginning";
      } else if (newValue[1] === "0") {
        error = "Can't have zero in 2nd place";
      } else if (newValue.length < 9 || newValue.length > 11) {
        error = "Phone number must be 9-11 characters";
      }
    }
    setError(error);
    setValue(newValue);
  }, []);
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (value && !error) {
        const phone = await postFocus(value);
        navigate(`/otp/account/${phone}`);
        if (dataActive.some((item) => item.phone === value)) {
          navigate(`/otp/success/${phone}`);
        }
      }
    },
    [dataActive, error, navigate, postFocus, value]
  );
  const disabledButton = !value || error;
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          value={value}
          placeholder="Phone number..."
          onChange={(e) => validateInput(e.target.value)}
          ref={inputRef}
        />
        <button className="btn" type="submit" disabled={disabledButton}>
          SUBMIT
        </button>
      </form>
      {error && <span className="error">{error}</span>}
    </>
  );
}
