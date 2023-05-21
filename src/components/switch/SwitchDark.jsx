import Image from "next/image";
import React, { useState } from "react";
import handleSwitchValue from "../../../utils/theme";

const SwitchDark = () => {
  const [isDark, setIsDark] = useState(false);

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
        <span className="light-text filter_1" alt="swicher" priority>
          <i class="fa fa-spin fa-sun" aria-hidden="true" alt="swicher" ></i>
        </span>
        <span className="dark-text">
          <i className="fa fa-flip fa-moon" aria-hidden="true"></i>
        </span>
      </div>
    </label>
  );
};

export default SwitchDark;
