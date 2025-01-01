import {
  format,
  getDay,
  parse,
  startOfWeek,
  addMonths,
  subMonths,
  addYears,
} from "date-fns";
import { useState } from "react";
import { enUS } from "date-fns/locale";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { TaskEvent, TaskWithProjectAssignee } from "@/lib/types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./data_calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface DataCalendarProps {
  data: TaskWithProjectAssignee[];
}

export const DataCalendar: React.FC<DataCalendarProps> = ({ data }) => {
  const [monthInView, setMonthInView] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date(),
  );

  const events = data.map<TaskEvent>((task) => ({
    id: task.$id,
    title: task.name,
    project: task.project,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    assignee: task.assignee,
    status: task.status,
  }));

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    switch (action) {
      case "PREV":
        setMonthInView(subMonths(monthInView, 1));
        break;
      case "NEXT":
        setMonthInView(addMonths(monthInView, 1));
        break;
      case "TODAY":
        setMonthInView(new Date());
        break;
    }
  };

  return (
    <Calendar
      localizer={localizer}
      date={monthInView}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      max={addYears(new Date(), 1)}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEE", culture) ?? "",
      }}
    />
  );
};
