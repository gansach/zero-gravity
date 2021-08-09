import React, { useState } from "react";
import "./App.css";
import logo from "./logo.png";

const apiEndpoints = {
  19: "",
  20: "",
  21: "https://v1.nocodeapi.com/gansach/google_sheets/uRFdKRzZnogjATUe",
};

const monthFormat = {
  jan: { 19: "", 20: "", 21: "Jan" },
  feb: { 19: "", 20: "", 21: "Feb" },
  mar: { 19: "", 20: "", 21: "Mar" },
  apr: { 19: "", 20: "", 21: "APR" },
  may: { 19: "", 20: "", 21: "MAY" },
  jun: { 19: "", 20: "", 21: "JUN" },
  jul: { 19: "", 20: "", 21: "JUL" },
  aug: { 19: "", 20: "", 21: "AUG" },
  sep: { 19: "", 20: "", 21: "SEP" },
  oct: { 19: "", 20: "", 21: "Oct" },
  nov: { 19: "", 20: "", 21: "Nov" },
  dec: { 19: "", 20: "", 21: "Dec" },
};

const labels = [
  "Card Code Number",
  "Bride or Client Name",
  "Groom",
  "Event Type",
  "Event Date",
  "OG Final Status",
  "Frame Final Status",
  "IP Final Status",
  "Client Completion Status",
  "Album Team Final Status",
  "Montage Final Status",
  "TV_Team Final Status",
  "CV Final Status",
  "CC Final Status",
  "CA_Delivery Status",
  "CA Final Status",
  "Magazine Final Status",
];

const buildCards = (objects) => {
  // Resetting previous cards
  if (document.getElementById("results"))
    document.getElementById("results").remove();

  // Building cards
  let container = document
    .getElementById("wrapper")
    .appendChild(document.createElement("div"));
  container.id = "results";

  let cards = container.appendChild(document.createElement("ul"));
  cards.className = "cards";

  for (let object of objects) {
    let cards_item = cards.appendChild(document.createElement("li"));
    cards_item.className = "cards_item";

    let card = cards_item.appendChild(document.createElement("div"));
    card.className = "card";

    let card_content = card.appendChild(document.createElement("div"));
    card_content.className = "card_content";

    for (let label in object) {
      if (object.hasOwnProperty(label)) {
        let card_text = card_content.appendChild(document.createElement("p"));
        card_text.className = "card_text";

        card_text.innerHTML = `<b>${label}:</b> ${object[label] || " "}`;
      }
    }
  }
  document.getElementById("loading").style.display = "none";

  // Validate
  let num_cards = Object.keys(objects).length;
  if (num_cards === 0) {
    cards.innerHTML = "";

    let modal = document.getElementById("modal");
    modal.style.display = "block";

    let span = document.getElementsByClassName("close")[0];

    span.onclick = function () {
      modal.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }
};

const App = () => {
  const [data, setData] = useState({
    year: "",
    month: "",
    cardCode: "",
  });

  const { year, month, cardCode } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById("loading").style.display = "block";

    const apiEndpoint = apiEndpoints[year];
    const tabId = monthFormat[month][year] + year;

    try {
      let response = await fetch(`${apiEndpoint}?tabId=${tabId}`);
      let data = await response.json();
      let cards = [];
      for (let element of data["data"]) {
        if (
          element["Card Code Number"] === cardCode ||
          element["Client Number"] === cardCode
        ) {
          let card = {};
          labels.forEach((label) => {
            card[label] = element[label];
          });
          cards.push(card);
        }
      }
      buildCards(cards);
    } catch (err) {
      window.location.reload();
    }
  };

  return (
    <div id="container">
      <div id="wrapper">
        <nav className="navbar navbar-light my-3">
          <a className="navbar-brand" href="https://zerogravity.photography/">
            <img
              id="my-3"
              src={logo}
              margin="5px"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt=""
            />{" "}
            Zero gravity photography
          </a>
        </nav>

        <form name="search" onSubmit={handleSubmit}>
          <select name="year" value={year} onChange={handleChange}>
            <option hidden>Year</option>
            <option value="19">2019</option>
            <option value="20">2020</option>
            <option value="21">2021</option>
          </select>

          <select name="month" value={month} onChange={handleChange}>
            <option hidden>Month</option>
            <option value="jan">Jan</option>
            <option value="feb">Feb</option>
            <option value="mar">Mar</option>
            <option value="apr">Apr</option>
            <option value="may">May</option>
            <option value="jun">Jun</option>
            <option value="jul">Jul</option>
            <option value="aug">Aug</option>
            <option value="sep">Sep</option>
            <option value="oct">Oct</option>
            <option value="nov">Nov</option>
            <option value="dec">Dec</option>
          </select>

          <input
            type="text"
            name="cardCode"
            placeholder="card code number"
            value={cardCode}
            onChange={handleChange}
          />

          <input
            type="button"
            value="Search"
            id="search-button"
            onClick={handleSubmit}
          />
        </form>
      </div>
      <div id="loading"></div>
      <div id="modal" className="modal">
        <div className="modal-content">
          <p>No results</p>
          <span className="close">&times;</span>
        </div>
      </div>
    </div>
  );
};

export default App;
