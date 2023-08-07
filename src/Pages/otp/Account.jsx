/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import configs from "../../configs/config.json";
import endpoint from "../../configs/endpoint.json";
const { SERVER_API } = configs;
const { focus, active, otp } = endpoint;
export default function Account() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [canSubmit, setCanSubmit] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const [dataOtp, setDataOtp] = useState([]);
  const [dataFocus, setDataFocus] = useState({});
  const [dataActive, setDataActive] = useState([]);
  const useRefs = [useRef(), useRef(), useRef(), useRef()];
  const otpRefs = useMemo(() => useRefs, [useRefs]);
  const getOtp = useCallback(async () => {
    setDataOtp(await (await fetch(`${SERVER_API}${otp}`)).json());
  }, []);
  const getDataFocus = useCallback(async () => {
    setDataFocus(await (await fetch(`${SERVER_API}${focus}`)).json());
  }, []);
  const getDataActive = useCallback(async () => {
    setDataActive(await (await fetch(`${SERVER_API}${active}`)).json());
  }, []);
  useEffect(() => {
    Promise.all([getDataActive(), getDataFocus(), getOtp()]);
  }, [getDataActive, getDataFocus, getOtp]);
  const postFocus = useCallback(async (value) => {
    const response = await fetch(`${SERVER_API}${focus}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: value }),
    });
    const { phone: phoneFocus } = await response.json();
    return phoneFocus;
  }, []);
  const postDataActive = useCallback(async (data) => {
    const response = await fetch(`${SERVER_API}${active}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data }),
    });
    return await response.json();
  }, []);
  useEffect(() => {
    if (!dataFocus || !dataActive) return otpRefs[0].current.focus();
    if (dataActive.findIndex((item) => item.phone === slug) !== -1) {
      postFocus(slug);
      navigate(`/otp/success/${slug}`);
    } else if (dataFocus.phone !== slug && dataFocus.phone !== undefined) {
      postFocus(slug);
      navigate(`/otp/account/${slug}`);
    } else {
      otpRefs[0].current.focus();
    }
  }, [dataFocus, dataActive, otpRefs, slug]);
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const value = otpRefs.reduce((acc, curr) => acc + curr.current.value, "");
      if (!dataOtp.includes(value)) {
        setIsSuccess(false);
        otpRefs.forEach((ref) => (ref.current.value = ""));
        return otpRefs[0].current.focus();
      }
      const phoneActive = await postDataActive({ phone: slug, otp: value });
      if (phoneActive) {
        setIsSuccess(true);
        postFocus(phoneActive.phone);
        navigate(`/otp/success/${phoneActive.phone}`);
      }
    },
    [otpRefs, dataOtp, slug, postDataActive, postFocus, navigate]
  );
  const handleKeyDown = useCallback(
    (e, ref) => {
      const keyMap = {
        8: "backspace",
        37: "left",
        39: "right",
      };
      const refIndex = otpRefs.indexOf(ref);
      if (keyMap[e.keyCode] === "backspace" && ref.current.value === "") {
        const prevInput = otpRefs[refIndex - 1];
        if (prevInput) {
          prevInput.current.focus();
        }
      } else if (keyMap[e.keyCode] === "right") {
        const nextInput = otpRefs[refIndex + 1];
        if (nextInput) {
          nextInput.current.focus();
        }
      } else if (keyMap[e.keyCode] === "left") {
        const prevInput = otpRefs[refIndex - 1];
        if (prevInput) {
          prevInput.current.focus();
        }
      }
    },
    [otpRefs]
  );
  const handleChangeOTP = useCallback(
    (e, ref) => {
      let currentValue = e.target.value;
      if (!/^[0-9]*$/.test(currentValue)) {
        const newValue = e.target.value.replace(/[^0-9]/g, "");
        currentValue = newValue;
        e.target.value = newValue;
      }
      if (currentValue.length > 1) {
        e.target.value = currentValue[0];
        return;
      }
      const refIndex = otpRefs.indexOf(ref);
      const nextInput = otpRefs[refIndex + 1];
      if (currentValue.length === 1 && nextInput) {
        nextInput.current.focus();
      }
      const value = otpRefs.reduce((acc, curr) => acc + curr.current.value, "");
      if (value.length === 4) {
        setCanSubmit(true);
      }
    },
    [otpRefs]
  );
  return (
    <>
      {isSuccess === true ? (
        <h1 className="success">SUCCESS OTP</h1>
      ) : isSuccess === false ? (
        <h1 className="error">ERROR : WRONG OTP</h1>
      ) : (
        <h1>Account : {slug}</h1>
      )}
      <form className="col" onSubmit={handleSubmit}>
        <div className="row">
          {otpRefs.map((ref) => (
            <input
              key={otpRefs.indexOf(ref)}
              className="input"
              type="text"
              ref={ref}
              id={otpRefs.indexOf(ref)}
              onKeyDown={(e) => handleKeyDown(e, ref)}
              onChange={(e) => handleChangeOTP(e, ref)}
              placeholder="0"
            />
          ))}
        </div>
        <div className="row">
          <button
            className="btn"
            type="submit"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            SUBMIT
          </button>
          <Link to={"/"} className="link">
            <button
              type="button"
              className="btn error"
              onClick={() => {
                postFocus("");
              }}
            >
              Back to Home
            </button>
          </Link>
        </div>
      </form>
    </>
  );
}
