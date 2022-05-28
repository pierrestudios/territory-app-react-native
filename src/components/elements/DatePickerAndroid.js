import React, { useEffect, useState } from "react";
import DatePicker from "@react-native-community/datetimepicker";

import { ButtonLink } from "./Button";
import UTILS from "../../common/utils";

export default function DatePickerAndroid({ value = new Date(), onChange }) {
  const [showing, setShowing] = useState(false);
  useEffect(() => {});

  return showing ? (
    <DatePicker
      value={value}
      onChange={(e, date) => {
        // Note: Prevent 2nd event with undefined "date"
        if (!!date) {
          onChange({ date });
        }
        setShowing(false);
      }}
    />
  ) : (
    <ButtonLink
      title={UTILS.getDateString(value)}
      onPress={() => setShowing(!showing)}
    />
  );
}
