import { message } from "antd";
import BooleanInput from "./BooleanInput";
import QuantitativeInput from "./QuantitativeInput/QuantitativeInput";
import { YesEntry, NoEntry } from "./BooleanEntry";

const componentTypes = {
  boolean: {
    component: BooleanInput,
    renderValue: ({ boolean_value: value }) =>
      value ? <YesEntry /> : <NoEntry />,
  },
  quantitative: {
    component: QuantitativeInput,
    renderValue: ({ quantitative_value: value, unit }) => (
      <span>{`${value} ${unit}`}</span>
    ),
  },
};

export default function Entry({
  trackable,
  date,
  entry,
  onChange,
  setDayEntries,
}) {
  const { component: Component, renderValue } = componentTypes[trackable.type];

  const addEntry = (value) => {
    const newEntry = {
      trackable_id: trackable.id,
      date: date.toISOString().slice(0, 10),
      ...value,
    };
    fetch("/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEntry),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not OK");
        message.success("Entry added");
        onChange(date);
      })
      .catch(() => {
        message.error("An error happened");
      }, []);
  };

  return (
    <div>
      {entry ? (
        renderValue(entry)
      ) : (
        <Component addEntry={addEntry} date={date} unit={trackable.unit} />
      )}
    </div>
  );
}
