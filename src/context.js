import React, { useState, useContext, useEffect } from 'react'
import { useCallback } from 'react'

const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='
const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('a');
  const [cocktails, setCocktails] = useState([]);


  //Gets the drinks from the API
  const fetchDrinks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${url}${searchTerm}`);
      const data = await response.json();
      const {drinks} = data;
      if(drinks) { //gets the drinks
        const newCocktails = drinks.map((item) => {
          const {
            idDrink, 
            strDrink, 
            strDrinkThumb, 
            strAlcoholic, 
            strGlass
          } = item;

          return {
            id: idDrink, 
            name:strDrink, 
            image:strDrinkThumb, 
            info: strAlcoholic, 
            glass: strGlass
          };
        });  
        setCocktails(newCocktails);
        
      } else {  //if no cocktails are found with search term
        setCocktails([]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  },[searchTerm]);


  //Invokes fetchDrinks everytime searchTerm changes
  useEffect(() => {
    fetchDrinks();
  },[searchTerm,fetchDrinks]);


  return (
    <AppContext.Provider 
      value={{
        loading,
        cocktails,
        setSearchTerm,
      }}      
      >
        {children}</AppContext.Provider>);
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
