import React, { useState, useContext, useEffect } from "react";
import "../Search/style.css";
import Button from "@mui/material/Button";
import { BsSearchHeart } from "react-icons/bs";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length <= 2) {
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetchDataFromApi(
          `/restaurants/search?query=${searchQuery}&city=${context.formFields.city}&page=1&limit=5`
        );
        context.setSearchData(res || []);
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, context.formFields.city]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    if (searchQuery.length > 2) {
      const res = await fetchDataFromApi(
        `/restaurants/search?query=${searchQuery}&city=${context.formFields.city}&page=1&limit=10`
      );
      console.log(res);
      context.setSearchData(res || []);
      context.setOpenSearchPanel(false);
      setIsLoading(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const onChangeInput = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <section>
      <div className="searchbox w-full h-10 sm:h-12 bg-[#e5e5e5] rounded-md sm:rounded-lg relative p-1 sm:p-2">

        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={onChangeInput}
          placeholder="Search for Restaurants and Food"
          className="w-full h-full bg-inherit p-2 text-sm sm:text-base focus:outline-none"
        />

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="absolute! top-1 sm:top-2 right-1 sm:right-2 w-8! sm:w-9! min-w-8! sm:min-w-9! h-8 sm:h-9 rounded-full! text-black!"
        >
          <BsSearchHeart className="text-[#545050] text-lg sm:text-xl" />
        </Button>

      </div>
    </section>

  );
};

export default Search;