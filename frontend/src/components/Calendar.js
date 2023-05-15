import React, { useState, useEffect } from "react";
import { CalendarList } from "react-native-calendars";

// receive markedDates array, currunt date, and onDateSelect function as props
export default function Calendar({ markedDates, current, onDateSelect }) {
	const [selected, setSelected] = useState("");

	// when the user selects a date, set the selected date and call the onDateSelect function
	function handleDayPress(day) {
		const selectedDate = day.dateString;
		setSelected(selectedDate);
		onDateSelect(selectedDate);
	}
	return (
		<CalendarList
			key={current}
			current={current}
			pastScrollRange={0}
			futureScrollRange={12}
			scrollEnabled={true}
			showScrollIndicator={true}
			markedDates={markedDates}
			disabledByDefault={true}
			disableAllTouchEventsForDisabledDays={true}
			disabledOpacity={0.4}
			calendarHeight={350}
			markingType={"multi-dot"}
			onDayPress={handleDayPress}
			theme={{
				textDayFontSize: 18,
				textMonthFontSize: 16,
				textDayHeaderFontSize: 16,
				monthTextColor: "black",
				arrowColor: "black",
				textMonthFontWeight: "bold",
				todayTextColor: "lightblue",
				dotColor: "#7EC8E3",
				textDayStyle: { fontWeight: "bold" },
				// Add the following style to increase row height
				calendar: { height: "auto" },
			}}
		/>
	);
}
