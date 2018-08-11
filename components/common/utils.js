export default {
  getElementStyles(props, baseStyle) {
    const elStyle = {
      ...props,
      style: [baseStyle]
    }
    if (!!props.customStyle) {
      elStyle.style.push([props.customStyle]);
    }
    return elStyle;
  },
  logError(Error) {
    console.log('error', Error);
  },
  diacritics(string, reverse = false) {
    if (!string) return '';
    const start = string.match('&');
    const end = string.match(';');
    const entity = (!start || !end) ? null : string.slice(start.index, end.index+1);
    const entityClean = entity ? '&'+ entity.replace(/[^0-9a-z]/gi, '') +';' : '';
    if (entity) {
      const replacement = this.entities.find(e => e.html === entityClean.trim());
      if (replacement) 
        return string.replace(entity, replacement.diacritic);
    }

    return string;
  },
  validEmail(email) {
    return (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    .test(email);
  },
  formatPhone(s) {
    var s2 = (""+s).replace(/\D/g, '');
    var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
  },  
	upperCaseFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
  sortTerritory(a, b) { 
    return a.number - b.number
  },
  sortAddress(a, b) {
    if (a.streetName == b.streetName) {
      return (parseInt(a.address.replace('APT', '').trim()) - parseInt(b.address.replace('APT', '').trim()))
    } if (a.streetName < b.streetName) {
      return  -1;
    } else {
      return  1;
    }
  },
  sortNotes(a, b)  {
    return new Date(b.date) - new Date(a.date)
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
    if (a.publisher) 
      return 1;
    if (b.publisher) 
      return -1;
    if (a.email < b.email) return -1;
    if (a.email > b.email) return 1;
    return 0;
  },
  getToday() {
    return this.getDateString(new Date());
  },
  getDateString(date) {
		return typeof date === 'string' ? date : (typeof date === 'object' ? this.dateFormat(date, 'YYYY-MM-DD') : '');
  },
  getDateObject(dateStr) {
    if (!dateStr)
      return new Date();

    const parts = dateStr.match(/(\d+)/g);
    // console.log('parts', parts);
    return new Date(parts[0], parts[1]-1, parts[2]);
  },
  dateFormat(date, format) {
    switch(format) {
      case 'YYYY-MM-DD' :
        return date.getFullYear() + '-' + this.getDateSingleDigit(parseInt(date.getMonth()) + 1) + '-' + this.getDateSingleDigit(date.getDate());
        // return date.getUTCFullYear() + '-' + this.getDateSingleDigit(parseInt(date.getUTCMonth()) + 1) + '-' + this.getDateSingleDigit(date.getUTCDate());
      default:
        return date;
    }
  },
  getDateSingleDigit(dateInt) {
    return dateInt < 10 ? "0" + dateInt : dateInt;
  },
  getStreetsList(addresses) {
		const streetsList = [];
		addresses
			.forEach(s => {
				if (!streetsList.find(i => i.id === s.streetId))
					streetsList.push({"id": s.streetId, "name": s.streetName, isApt: s.isApt || false});
			});
		return streetsList;
  },
  mapStreets(data) {
		return {
			value: data.id,
			label: data.name
		}
	},
  getListingAddress(list) {
		if (list.isApt) 
			return (
				list.building + ', ' + list.address
			);
		if (list.apt) 
			return (
				list.address + ' ' + list.streetName + ' ' + list.apt
			);
		return (
			list.address + ' ' + list.streetName
		);
  },
  openFrameUrl(url) {
    /*History.push({
      pathname: '/api-frame/' + url
    });*/
  },
	navigateToUrl(url) {
		window.open(window.location.protocol + '//'+ window.location.host + url, '_blank');
		return false;
  },
  loadExternalScript(url, propName) {
    return new Promise((resolve, reject) => { 
      // Prevent loading multiple
      if (!!propName && !!window[propName]) {
        return resolve(window[propName]);
      }

      var s = document.createElement("script");
      s.type = "text/javascript";
      s.src = url;
      document.body.appendChild(s);

      // Check if object "propName" is loaded
      if (!propName) 
        return resolve(true);

      this.waitForIt(() => !!window[propName], () => {
        resolve(window[propName]);
      });
    })
  },
  waitForIt(conditionIsMet, doAction, time = 100) {
    // console.log('waitForIt', {TIME: (new Date()).getMilliseconds(),conditionIsMet, doAction});
    const waitForInterval = setInterval(() => {
      if (!!conditionIsMet()) {
        clearInterval(waitForInterval);
        doAction()
      }
    }, time)
  },
  headerNavOptionsDefault: {
    headerTitle: null,
    headerTitleStyle: {
      fontSize: 22
    },
    headerTintColor: '#fff',
    headerBackTitle: null
  },
  userTypes: [
    {value: 'Viewer', label: 'Viewer'},
    {value: 'NoteEditor', label: 'NoteEditor'},
    {value: 'Editor', label: 'Editor'},
    {value: 'Manager', label: 'Manager'},
    {value: 'Admin', label: 'Admin'}
  ],
  entities: [
    // acute
    {html: '&aacute;', diacritic: 'á'},
    {html: '&Aacute;', diacritic: 'Á'},
    {html: '&eacute;', diacritic: 'é'},
    {html: '&Eacute;', diacritic: 'É'},
    {html: '&oacute;', diacritic: 'ó'},
    {html: '&Oacute;', diacritic: 'Ó'},
    // grave
    {html: '&agrave;', diacritic: 'à'},
    {html: '&Agrave;', diacritic: 'À'},
    {html: '&egrave;', diacritic: 'è'},
    {html: '&Egrave;', diacritic: 'È'},
    {html: '&ograve;', diacritic: 'ò'},
    {html: '&Ograve;', diacritic: 'Ò'},
    {html: '&ugrave;', diacritic: 'ù'},
    {html: '&Agrave;', diacritic: 'Ù'},
    // ç cedil
    {html: '&ccedil;', diacritic: 'ç'},
    {html: '&Ccedil;', diacritic: 'Ç'},
    // ˆ circ
    {html: '&Acirc;', diacritic: 'Â'},
    {html: '&acirc;', diacritic: 'â'},
    {html: '&Ecirc;', diacritic: 'Ê'},
    {html: '&ecirc;', diacritic: 'ê'},
    {html: '&Ocirc;', diacritic: 'Ô'},
    {html: '&ocirc;', diacritic: 'ô'},
    {html: '&Ucirc;', diacritic: 'Û'},
    {html: '&ucirc;', diacritic: 'û'},
    {html: '&Icirc;', diacritic: 'Î'},
    {html: '&icirc;', diacritic: 'î'},
    // ¨ uml
    {html: '&Auml;', diacritic: 'Ä'},
    {html: '&auml;', diacritic: 'ä'},
    {html: '&Euml;', diacritic: 'Ë'},
    {html: '&euml;', diacritic: 'ë'},
    {html: '&Ouml;', diacritic: 'Ö'},
    {html: '&ouml;', diacritic: 'ö'},
    {html: '&Uuml;', diacritic: 'Ü'},
    {html: '&uuml;', diacritic: 'ü'},
    {html: '&Iuml;', diacritic: 'Ï'},
    {html: '&iuml;', diacritic: 'ï'},
  ]
}
 