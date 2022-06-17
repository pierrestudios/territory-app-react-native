import styles from "../../styles/main";

export default function SelectPickerWeb({
  name,
  options,
  onInput,
  value: { value: selectedValue },
  ...props
}) {
  return (
    <select
      name={name}
      value={selectedValue}
      onChange={({ target }) => {
        onInput({
          name,
          "data-name": props["data-name"],
          option: options.find((o) => o.value == target.value),
        });
      }}
      style={{
        backgroundColor: "rgb(255, 255, 255)",
        borderColor: "rgb(204, 204, 204)",
        borderRadius: 3,
        height: 50,
        padding: 10,
      }}
    >
      {options.map(({ label, value }) => (
        <option key={`${value}-key`} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
