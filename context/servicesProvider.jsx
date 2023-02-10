import React, { useEffect, useReducer, useRef, useState } from "react";
import { getReviewsData } from "../utils/getReviewsData";
import { getSellersData } from "../utils/getSellersData";
import { getServicesData } from "../utils/getServicesData";
import ServicesContext from "./servicesContext";
import servicesReducer from "./servicesReducer";
import { GET_REVIEWS, GET_SELLERS, GET_SERVICES } from "./servicesTypes";

const ServicesProvider = ({ children }) => {
  const initialState = {
    services: [],
    sellers: [],
    reviews: [],
    loading: true,
  };

  const [state, dispatch] = useReducer(servicesReducer, initialState);
  const [cart, setCart] = useState([]);
  const [serviceId, setServiceId] = useState();

  const initialRender = useRef(true);

  const setServices = (newServices) => {
    dispatch({ type: GET_SERVICES, payload: newServices });
  };

  const setReviews = (newReviews) => {
    dispatch({ type: GET_REVIEWS, payload: newReviews });
  };

  useEffect(() => {
    async function fetchServices() {
      try {
        const serviceData = await getServicesData();
        dispatch({ type: GET_SERVICES, payload: serviceData });
      } catch (error) {
        console.error(error);
      }
    }
    async function fetchSellers() {
      try {
        const sellerData = await getSellersData();
        dispatch({ type: GET_SELLERS, payload: sellerData });
      } catch (error) {
        console.error(error);
      }
    }
    async function fetchReviews() {
      try {
        const reviewsData = await getReviewsData(serviceId);
        dispatch({ type: GET_REVIEWS, payload: reviewsData });
      } catch (error) {
        console.error(error);
      }
    }
    if (JSON.parse(localStorage.getItem("cart"))) {
      const storedCart = JSON.parse(localStorage.getItem("cart"));
      setCart([...cart, ...storedCart]);
    }
    fetchServices();
    fetchSellers();
    fetchReviews();
  }, [serviceId]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <ServicesContext.Provider
      value={{
        services: state.services,
        sellers: state.sellers,
        reviews: state.reviews,
        loading: state.loading,
        dispatch,
        cart,
        setCart,
        setServices,
        setReviews,
        setServiceId,
      }}>
      {children}
    </ServicesContext.Provider>
  );
};

export default ServicesProvider;
