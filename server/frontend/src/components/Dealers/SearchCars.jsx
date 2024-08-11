import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import { useParams } from "react-router-dom";

const SearchCars = () => {
  const [cars, setCars] = useState([]);
  const [originalCars, setOriginalCars] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [dealer, setDealer] = useState({ full_name: "" });
  const [message, setMessage] = useState("Loading cars...");

  let { id } = useParams();

  let dealer_url = "/djangoapp/dealer/" + String(id);
  let inventory_url = "/djangoapp/get_inventory/" + String(id);

  const fetchDealer = async () => {
    const res = await fetch(dealer_url, {
      method: "GET",
    });
    const retobj = await res.json();
    if (retobj.status == 200) {
      let dealerobj = Array.from(retobj.dealers);
      setDealer({ full_name: dealerobj[0].full_name });
    } else {
      console.log("could not fetch Dealer details");
    }
  };

  const fetchCars = async () => {
    const res = await fetch(inventory_url, {
      method: "GET",
    });
    const retobj = await res.json();
    if (retobj.status == 200) {
      let carobjs = Array.from(retobj.cars);
      setCars(carobjs);
      setOriginalCars(carobjs);

      let makes_set = new Set();
      let models_set = new Set();
      carobjs.forEach((car) => {
        makes_set.add(car.make);
        models_set.add(car.model);
      });
      setMakes(Array.from(makes_set));
      setModels(Array.from(models_set));
    } else {
      console.log("could not fetch inventory");
    }
  };

  const setCarsmatchingCriteria = async () => {
    let makeIdx = document.getElementById("make").selectedIndex;
    let modelIdx = document.getElementById("model").selectedIndex;
    let yearIdx = document.getElementById("year").selectedIndex;
    let mileageIdx = document.getElementById("mileage").selectedIndex;
    let priceIdx = document.getElementById("price").selectedIndex;

    let filteredCars = originalCars;

    if (makeIdx !== 0) {
      let makeName = document.getElementById("make").value;
      filteredCars = filteredCars.filter((car) => car.make === makeName);
    }

    if (modelIdx !== 0) {
      let modelName = document.getElementById("model").value;
      filteredCars = filteredCars.filter((car) => car.model === modelName);
    }

    if (yearIdx !== 0) {
      let year = parseInt(document.getElementById("year").value);
      filteredCars = filteredCars.filter((car) => car.year >= year);
    }

    if (mileageIdx !== 0) {
      let mileage = parseInt(document.getElementById("mileage").value);

      if (mileage === 50000) {
        filteredCars = filteredCars.filter((car) => car.mileage <= mileage);
      } else if (mileage === 100000) {
        filteredCars = filteredCars.filter(
          (car) => car.mileage <= mileage && car.mileage > 50000
        );
      } else if (mileage === 150000) {
        filteredCars = filteredCars.filter(
          (car) => car.mileage <= mileage && car.mileage > 100000
        );
      } else if (mileage === 200000) {
        filteredCars = filteredCars.filter(
          (car) => car.mileage <= mileage && car.mileage > 150000
        );
      } else {
        filteredCars = filteredCars.filter((car) => car.mileage > 200000);
      }
    }

    if (priceIdx !== 0) {
      let price = parseInt(document.getElementById("price").value);
      if (price === 20000) {
        filteredCars = filteredCars.filter((car) => car.price <= price);
      } else if (price === 40000) {
        filteredCars = filteredCars.filter(
          (car) => car.price <= price && car.price > 20000
        );
      } else if (price === 60000) {
        filteredCars = filteredCars.filter(
          (car) => car.price <= price && car.price > 40000
        );
      } else if (price === 80000) {
        filteredCars = filteredCars.filter(
          (car) => car.price <= price && car.price > 60000
        );
      } else {
        filteredCars = filteredCars.filter((car) => car.price > 80000);
      }
    }

    if (filteredCars.length === 0) {
      setMessage("No cars found matching criteria");
    }
    setCars(filteredCars);
  };

  const reset = async () => {
    const selects = document.querySelectorAll("select");
    selects.forEach((select) => {
      select.selectedIndex = 0;
    });
    setCarsmatchingCriteria();
  };

  useEffect(() => {
    fetchCars();
    fetchDealer();
  }, []);

  return (
    <div>
      <Header />

      <h1 style={{ marginBottom: "20px" }}>Cars at {dealer.full_name}</h1>
      <div>
        <span style={{ marginLeft: "10px", paddingLeft: "10px" }}>Make</span>
        <select
          style={{
            marginLeft: "10px",
            marginRight: "10px",
            paddingLeft: "10px",
            borderRadius: "10px",
          }}
          name="make"
          id="make"
          onChange={setCarsmatchingCriteria}
        >
          {makes.length === 0 ? (
            <option value="">No data found</option>
          ) : (
            <>
              <option disabled defaultValue>
                {" "}
                -- All --{" "}
              </option>
              {makes.map((make, index) => (
                <option key={index} value={make}>
                  {make}
                </option>
              ))}
            </>
          )}
        </select>
        <span style={{ marginLeft: "10px", paddingLeft: "10px" }}>Model</span>
        <select
          style={{
            marginLeft: "10px",
            marginRight: "10px",
            paddingLeft: "10px",
            borderRadius: "10px",
          }}
          name="model"
          id="model"
          onChange={setCarsmatchingCriteria}
        >
          {models.length === 0 ? (
            <option value="">No data found</option>
          ) : (
            <>
              <option disabled defaultValue>
                {" "}
                -- All --{" "}
              </option>
              {models.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </>
          )}
        </select>
        <span style={{ marginLeft: "10px", paddingLeft: "10px" }}>Year</span>
        <select
          style={{
            marginLeft: "10px",
            marginRight: "10px",
            paddingLeft: "10px",
            borderRadius: "10px",
          }}
          name="year"
          id="year"
          onChange={setCarsmatchingCriteria}
        >
          <option selected value="all">
            {" "}
            -- All --{" "}
          </option>
          <option value="2024">2024 or newer</option>
          <option value="2023">2023 or newer</option>
          <option value="2022">2022 or newer</option>
          <option value="2021">2021 or newer</option>
          <option value="2020">2020 or newer</option>
        </select>
        <span style={{ marginLeft: "10px", paddingLeft: "10px" }}>Mileage</span>
        <select
          style={{
            marginLeft: "10px",
            marginRight: "10px",
            paddingLeft: "10px",
            borderRadius: "10px",
          }}
          name="mileage"
          id="mileage"
          onChange={setCarsmatchingCriteria}
        >
          <option selected value="all">
            {" "}
            -- All --{" "}
          </option>
          <option value="50000">Under 50000</option>
          <option value="100000">50000 - 100000</option>
          <option value="150000">100000 - 150000</option>
          <option value="200000">150000 - 200000</option>
          <option value="200001">Over 200000</option>
        </select>
        <span style={{ marginLeft: "10px", paddingLeft: "10px" }}>Price</span>
        <select
          style={{
            marginLeft: "10px",
            marginRight: "10px",
            paddingLeft: "10px",
            borderRadius: "10px",
          }}
          name="price"
          id="price"
          onChange={setCarsmatchingCriteria}
        >
          <option selected value="all">
            {" "}
            -- All --{" "}
          </option>
          <option value="20000">Under 20000</option>
          <option value="40000">20000 - 40000</option>
          <option value="60000">40000 - 60000</option>
          <option value="80000">60000 - 80000</option>
          <option value="80001">Over 80000</option>
        </select>
        <button
          style={{ marginLeft: "10px", paddingLeft: "10px" }}
          onClick={reset}
        >
          Reset
        </button>
      </div>
      <div
        style={{ marginLeft: "10px", marginRight: "10px", marginTop: "20px" }}
      >
        {cars.length === 0 ? (
          <p
            style={{
              marginLeft: "10px",
              marginRight: "10px",
              marginTop: "20px",
            }}
          >
            {message}
          </p>
        ) : (
          <div>
            <hr />
            {cars.map((car) => (
              <div>
                <div key={car._id}>
                  <h3>
                    {car.make} {car.model}
                  </h3>
                  <p>Year: {car.year}</p>
                  <p>Mileage: {car.mileage}</p>
                  <p>Price: {car.price}</p>
                </div>
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchCars;
