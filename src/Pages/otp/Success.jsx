import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import configs from "../../configs/config.json";
import endpoint from "../../configs/endpoint.json";
const { SERVER_API } = configs;
const { focus, active } = endpoint;
export default function Success() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const btnRef = useRef();
  const [dataActive, setDataActive] = useState([]);
  const [dataFocus, setDataFocus] = useState({});
  const getDataActive = useCallback(async () => {
    setDataActive(await (await fetch(`${SERVER_API}${active}`)).json());
  }, []);
  const getDataFocus = useCallback(async () => {
    setDataFocus(await (await fetch(`${SERVER_API}${focus}`)).json());
  }, []);
  const postFocus = useCallback(async (value) => {
    const response = await fetch(`${SERVER_API}${focus}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: value }),
    });
    const { phone: phoneFocus } = await response.json();
    return phoneFocus;
  }, []);
  const handleKeyDown = useCallback((e, ref) => {
    if (e.keyCode === 13) {
      ref.current.click();
    }
  }, []);
  useEffect(() => {
    Promise.all([getDataActive(), getDataFocus()]);
  }, [getDataActive, getDataFocus]);
  useEffect(() => {
    const phoneExists = dataActive.some((obj) => obj.phone === slug);
    if (
      (dataFocus.phone !== slug && dataFocus.phone !== undefined) ||
      (!phoneExists && dataActive.length > 0)
    ) {
      postFocus(slug);
      navigate(`/otp/account/${slug}`);
    } else {
      btnRef.current.focus();
    }
  }, [dataActive, dataFocus, navigate, postFocus, slug]);
  return (
    <div className="col">
      <h1>
        Your phone:<span className="success">{` ${slug} `}</span>
        <br />
        is active <span className="success">!</span>
      </h1>
      <Link to="/" className="link">
        <br />
        <button
          className="btn"
          ref={btnRef}
          onClick={() => {
            postFocus("");
          }}
          onKeyDown={(e) => handleKeyDown(e, btnRef)}
        >
          Back to Home
        </button>
      </Link>
    </div>
  );
}
