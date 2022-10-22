"use strict";

const linkData = [
  {
    title: "Set×Set",
    description: "An online version of the card game Set.",
    href: "https://set-server.fly.dev/",
  },
  {
    title: "Nona",
    description: "A 3D nonogram puzzle generator.",
    href: "/nona/",
  },
  {
    title: "Babble",
    description: "A familiar word game.",
    href: "/babble/",
  },
  {
    title: "Struc",
    description: "A simple 2D structural analysis tool.",
    href: "/struc/",
  },
  {
    title: "SmoothLife",
    description: "A WebGL shader for SmoothLife.",
    href: "/smoothlife-shader/",
  },
  {
    title: "GitHub",
    description: "",
    href: "https://github.com/tmngo",
  },
];

const main = document.getElementById("main");

const linkTemplate = document.createElement("a");
linkTemplate.className = "entry";
linkTemplate.innerHTML = `<h2></h2><p></p>`;

for (let i = 0; i < linkData.length; i++) {
  const { title, description, href, isSmall } = linkData[i];
  const link = linkTemplate.cloneNode(true);
  link.href = href;
  link.firstChild.textContent = title;
  link.lastChild.textContent = description;
  main.appendChild(link);
}
