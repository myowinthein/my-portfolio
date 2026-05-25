import React, { useEffect, useState } from "react";
import handleSwitchValue from "../../../utils/theme";

const SwitchDark = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("theme-color") === "light") {
      handleSwitchValue(false);
      setIsDark(true);
    }
  }, []);

  const handleLabelClick = () => {
    if (isDark) {
      handleSwitchValue(true)
      setIsDark(false);
    } else {
      handleSwitchValue(false)
      setIsDark(true);
    }
  };

  return (
    <label className={`theme-switcher-label d-flex  ${isDark ? "active" : ""}`}>
      <input
        type="checkbox"
        onClick={handleLabelClick}
        className="theme-switcher"
      />
      <div className="switch-handle">
        <span className="light-text filter_1">
          <i className="fa-solid fa-sun"></i>
        </span>
        <span className="dark-text">
          <i className="fa fa-moon" aria-hidden="true"></i>
        </span>
      </div>
    </label>
  );
};

export default SwitchDark;
