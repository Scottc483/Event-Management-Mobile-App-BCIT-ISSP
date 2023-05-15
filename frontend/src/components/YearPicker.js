import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from "axios";
import { API_END_POINT } from "@env";

const YearPicker = ({ onSelect }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [open, setOpen] = useState(false);
  const [years, setYears] = useState([]);

  const generateYears = async () => {
    try {
      const response = await axios.get(`${API_END_POINT}event/years`);
      
      // convert the response data into an array of objects for drop down picker
      const years = response.data.map((item) => {
        return {
          label: item.years.toString(),
          value: item.years
        };
      });
      return years;
    } catch (error) {
      console.error('Error getting years:', error);
      return [];
    }
  };

  // get the years from the database
  useEffect(() => {
    (async () => {
      const years = await generateYears();
      setYears(years);
      // setOpen(true);
    })();
  }, []);

  return (
    <>
      {years.length > 0 && (
        <View>
          <Text>Select Year:</Text>
          <DropDownPicker
            open={open}
            value={selectedYear}
            items={years}
            setOpen={setOpen}
            setValue={setSelectedYear}
            onChangeValue={(value) => {
              setSelectedYear(value);
              onSelect(value);
            }}
          />
        </View>
      )}
    </>
  );
};

export default YearPicker;
