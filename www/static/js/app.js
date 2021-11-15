(() => {
  // src/ts/elements.ts
  var createNewTab = (number) => {
    const label = document.createElement("label");
    label.classList.add("w-32", "flex");
    label.htmlFor = `tab-${number}`;
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "tabs";
    input.id = `tab-${number}`;
    input.classList.add("peer", "hidden");
    input.checked = true;
    const span = document.createElement("span");
    span.tabIndex = 0;
    span.classList.add("w-full", "p-2", "text-center", "border-gray-700", "border-r", "border-l", "cursor-pointer", "peer-checked:bg-gray-700", "peer-checked:cursor-default", "hover:bg-gray-600");
    span.innerHTML = `Tab ${number}`;
    label.appendChild(input);
    label.appendChild(span);
    return label;
  };

  // src/ts/listeners.ts
  var setAddTabListener = () => {
    const addTabElement = document.getElementById("add-tab");
    const tabs = document.getElementById("tabs");
    addTabElement.addEventListener("click", () => {
      const tabNumber = document.querySelectorAll("[id^=tab-]").length + 1;
      const newTab = createNewTab(tabNumber);
      tabs.insertBefore(newTab, addTabElement);
    });
  };
  var setClickTabListeners = () => {
    const tabs = document.getElementById("tabs");
    tabs.addEventListener("click", (event) => {
      const target = event.target;
      const { id } = target;
      if (id.match("^tab-[0-9]+")) {
        target.setAttribute("checked", "checked");
      }
    });
  };
  var setListeners = () => {
    setAddTabListener();
    setClickTabListeners();
  };

  // src/ts/app.ts
  if (document.readyState !== "loading") {
    setListeners();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      setListeners();
    });
  }
})();
//# sourceMappingURL=app.js.map
