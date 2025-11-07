"use client";
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const MainDataContext = createContext();

export const MainDataProvider = ({ children }) => {
  const [home, setHome] = useState(null);
  const [skills, setSkills] = useState(null);
  const [projects, setProjects] = useState(null);
  const [load, setLoad] = useState(false);

  const getData = async () => {
    try {
      // Fetch everything in parallel instead of one by one
      const [resH, resS, resP] = await Promise.all([
        axios.get("/api/data/Home/get-data"),
        axios.get("/api/data/Skills/get-data"),
        axios.get("/api/data/Projects/get-data"),
      ]);

      setHome(resH.data);
      setSkills(resS.data);
      setProjects(resP.data);

      if (resH.data && resS.data && resP.data) {
        setTimeout(() => setLoad(true), 1000);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setHome(null);
      setSkills(null);
      setProjects(null);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <MainDataContext.Provider value={{ home, skills, projects, getData, load }}>
      {children}
    </MainDataContext.Provider>
  );
};

export const useMainData = () => useContext(MainDataContext);
