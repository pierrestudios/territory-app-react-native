import { colors } from "../styles/main";
import { dependencies as Mods } from "../../package";

export default {
  isExpo() {
    return !!Mods.expo;
  },
  getElementStyles(props, baseStyle) {
    const elStyle = {
      ...props,
      style: [baseStyle]
    };
    if (!!props.customStyle) {
      elStyle.style.push([props.customStyle]);
    }
    return elStyle;
  },
  logError(Error) {
    console.log("error", Error);
  },
  formatDiacritics(string) {
    if (!string) {
      return "";
    }

    const start = string.match("&");
    const end = string.match(";");
    const entity =
      !start || !end ? null : string.slice(start.index, end.index + 1);
    const entityClean = entity
      ? "&" + entity.replace(/[^0-9a-z]/gi, "") + ";"
      : "";

    if (entity) {
      const replacement = this.diacriticEntities.find(
        e => e.html === entityClean.trim()
      );

      if (replacement) {
        return string.replace(entity, replacement.diacritic);
      }
    }

    return string;
  },
  isValidEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );
  },
  formatPhone(s) {
    var s2 = ("" + s).replace(/\D/g, "");
    var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return !m ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
  },
  upperCaseFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  sortTerritory(a, b) {
    return a.number - b.number;
  },
  sortAddress(a, b) {
    if (a.streetName == b.streetName) {
      return (
        parseInt(a.address.replace("APT", "").trim()) -
        parseInt(b.address.replace("APT", "").trim())
      );
    }
    if (a.streetName < b.streetName) {
      return -1;
    } else {
      return 1;
    }
  },
  sortNotes(a, b) {
    return new Date(b.date) - new Date(a.date);
  },
  sortPublisher(a, b) {
    if (a.firstName < b.firstName) return -1;
    if (a.firstName > b.firstName) return 1;
    return 0;
  },
  sortUser(a, b) {
    if (a.publisher && b.publisher) {
      if (a.publisher.firstName < b.publisher.firstName) return -1;
      if (a.publisher.firstName > b.publisher.firstName) return 1;
    }
    if (a.publisher) return 1;
    if (b.publisher) return -1;
    if (a.email < b.email) return -1;
    if (a.email > b.email) return 1;
    return 0;
  },
  getToday() {
    return this.getDateString(new Date());
  },
  getDateString(date) {
    return typeof date === "string"
      ? date
      : typeof date === "object"
      ? this.formatDate(date, "YYYY-MM-DD")
      : "";
  },
  getDateObject(dateStr) {
    if (!dateStr) return new Date();

    const parts = dateStr.match(/(\d+)/g);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  },
  formatDate(date, format) {
    switch (format) {
      case "YYYY-MM-DD":
        return (
          date.getFullYear() +
          "-" +
          this.getDateSingleDigit(parseInt(date.getMonth()) + 1) +
          "-" +
          this.getDateSingleDigit(date.getDate())
        );
      default:
        return date;
    }
  },
  getDateSingleDigit(dateInt) {
    return dateInt < 10 ? "0" + dateInt : dateInt;
  },
  getDateStatusColor(date) {
    return this.isPassedDueDate(date) ? { color: colors.red } : null;
  },
  isPassedDueDate(date) {
    var d = new Date();
    d.setMonth(d.getMonth() - 3);
    const passDueDate = d.toDateString();
    if (!/Invalid|NaN/.test(new Date(date))) {
      return new Date(date) < new Date(passDueDate);
    }

    return false;
  },
  getStreetsList(addresses) {
    const streetsList = [];
    addresses.forEach(s => {
      if (!streetsList.find(i => i.id === s.streetId))
        streetsList.push({
          id: s.streetId,
          name: s.streetName,
          isApt: s.isApt || false
        });
    });
    return streetsList;
  },
  mapStreetsToLabelAndValue(data) {
    return {
      value: data.id,
      label: data.name
    };
  },
  getListingAddress(list) {
    if (list.isApt) return list.building + ", " + list.address;
    if (list.apt) return list.address + " " + list.streetName + " " + list.apt;
    return list.address + " " + list.streetName;
  },
  getLastNote(list) {
    return list.notes && list.notes.length
      ? " - " + list.notes.sort(this.sortNotes)[0].note
      : "";
  },
  getListingAddressWithLastNote(list) {
    return `${this.getListingAddress(list)} ${this.getLastNote(list)}`;
  },
  navigateToUrl(url) {
    window.open(
      window.location.protocol + "//" + window.location.host + url,
      "_blank"
    );
    return false;
  },
  addSlashToUrl(url) {
    return url + (url.slice(-1) === "/" ? "" : "/");
  },
  removeLastSlashFromUrl(url) {
    return url.slice(-1) === "/" ? url.substring(0, url.length - 1) : url;
  },
  urlHasHTTPSProtocol(url) {
    return url && (url.split(":") || [])[0].toLowerCase() === "https";
  },
  loadExternalScript(url, propName) {
    return new Promise((resolve, reject) => {
      if (!!propName && !!window[propName]) {
        return resolve(window[propName]);
      }

      var s = document.createElement("script");
      s.type = "text/javascript";
      s.src = url;
      document.body.appendChild(s);

      if (!propName) return resolve(true);

      this.waitForIt(
        () => !!window[propName],
        () => {
          resolve(window[propName]);
        }
      );
    });
  },
  waitForIt(conditionIsMet, doAction, time = 100) {
    const waitForInterval = setInterval(() => {
      if (!!conditionIsMet()) {
        clearInterval(waitForInterval);
        doAction();
      }
    }, time);
  },
  headerNavOptionsDefault: {
    headerTitle: null,
    headerTitleStyle: {
      fontSize: 18,
      textAlign: "center",
      width: "90%"
    },
    headerStyle: {
      alignSelf: "center",
      width: "100%",
      backgroundColor: colors["territory-blue"]
    },
    headerTintColor: "#fff",
    headerBackTitle: null
  },
  brToLineBreaks(strData) {
    return strData.replace(/<br>/g, "\n");
  },
  userTypeLabel(userType) {
    return (this.userTypes.find(t => t.value === userType) || {}).label;
  },
  userTypes: [
    { value: "Viewer", label: "Viewer" },
    { value: "NoteEditor", label: "Note Editor" },
    { value: "Editor", label: "Editor" },
    { value: "Manager", label: "Manager" },
    { value: "Admin", label: "Admin" }
  ],
  diacriticEntities: [
    // acute
    { html: "&aacute;", diacritic: "á" },
    { html: "&Aacute;", diacritic: "Á" },
    { html: "&eacute;", diacritic: "é" },
    { html: "&Eacute;", diacritic: "É" },
    { html: "&oacute;", diacritic: "ó" },
    { html: "&Oacute;", diacritic: "Ó" },
    // grave
    { html: "&agrave;", diacritic: "à" },
    { html: "&Agrave;", diacritic: "À" },
    { html: "&egrave;", diacritic: "è" },
    { html: "&Egrave;", diacritic: "È" },
    { html: "&ograve;", diacritic: "ò" },
    { html: "&Ograve;", diacritic: "Ò" },
    { html: "&ugrave;", diacritic: "ù" },
    { html: "&Agrave;", diacritic: "Ù" },
    // ç cedil
    { html: "&ccedil;", diacritic: "ç" },
    { html: "&Ccedil;", diacritic: "Ç" },
    // ˆ circ
    { html: "&Acirc;", diacritic: "Â" },
    { html: "&acirc;", diacritic: "â" },
    { html: "&Ecirc;", diacritic: "Ê" },
    { html: "&ecirc;", diacritic: "ê" },
    { html: "&Ocirc;", diacritic: "Ô" },
    { html: "&ocirc;", diacritic: "ô" },
    { html: "&Ucirc;", diacritic: "Û" },
    { html: "&ucirc;", diacritic: "û" },
    { html: "&Icirc;", diacritic: "Î" },
    { html: "&icirc;", diacritic: "î" },
    // ¨ uml
    { html: "&Auml;", diacritic: "Ä" },
    { html: "&auml;", diacritic: "ä" },
    { html: "&Euml;", diacritic: "Ë" },
    { html: "&euml;", diacritic: "ë" },
    { html: "&Ouml;", diacritic: "Ö" },
    { html: "&ouml;", diacritic: "ö" },
    { html: "&Uuml;", diacritic: "Ü" },
    { html: "&uuml;", diacritic: "ü" },
    { html: "&Iuml;", diacritic: "Ï" },
    { html: "&iuml;", diacritic: "ï" }
  ]
};
