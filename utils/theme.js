export function handleSwitchValue(value) {
  const body = document.body;
  if (value) {
    localStorage.setItem("theme-color", "dark");
    body.classList.add("dark");
    body.classList.remove("light");
  } else {
    localStorage.setItem("theme-color", "light");
    body.classList.add("light");
    body.classList.remove("dark");
  }
  // No React context/props thread here - a plain event lets unrelated
  // listeners (e.g. Nyo reacting to the sudden light change) opt in.
  window.dispatchEvent(new Event("theme-change"));
}

