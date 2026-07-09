import React, { useEffect, useState } from "react";
import { handleSwitchValue } from "../../../utils/theme";

const SwitchDark = () => {
  const [isLightTheme, setIsLightTheme] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("theme-color") === "light") {
      // handleSwitchValue(true) = dark, handleSwitchValue(false) = light
      handleSwitchValue(false);
      setIsLightTheme(true);
    }
  }, []);

  const handleToggle = () => {
    const nextIsLight = !isLightTheme;
    // handleSwitchValue expects `isDark`, which is the inverse of the next light state
    handleSwitchValue(!nextIsLight);
    setIsLightTheme(nextIsLight);
  };

  return (
    <label className={`theme-switcher-label d-flex  ${isLightTheme ? "active" : ""}`}>
      <input
        type="checkbox"
        checked={isLightTheme}
        onChange={handleToggle}
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
