let inputField = document.getElementById("inputField");
let outputField = document.getElementById("outputField");

inputField.addEventListener("input", onInput);
inputField.addEventListener("click", onclick);

function onclick(e) {
  let {
    target: { value },
  } = e;
  let selected = e.target.selectionStart;
  if (value[selected] === "(") {                                // we may can also use switch case here.
    let closePosition = getclosingPrenthIndex(value, selected);
    let selection = value.slice(selected, closePosition + 1);
    value = value.replace(
      selection,
      `<span class="highlight">${selection}</span>`
    );
  } else if (value[selected] === ")") {
    let openPosition = getclosingPrenthIndex(value, selected);
    let selection = value.slice(openPosition, selected + 1);
    value = value.replace(
      selection,
      `<span class="highlight">${selection}</span>`
    );
  } else {
    let { closePosition, openPosition } =
      getclosingPrenthIndex(value, selected) || {};
    if ((openPosition, closePosition)) {
      let selection = value.slice(openPosition, closePosition + 1);
      value = value.replace(
        selection,
        `<span class="highlight">${selection}</span>`
      );
    }
  }
  outputField.innerHTML = highLight(value, e.target.selectionStart);
}

function onInput(e) {
  let {
    target: { value },
  } = e;

  outputField.innerHTML = highLight(value, e.target.selectionStart);
}

function highLight(text, clickPosition) {
  let prenthIndexes = [];
  let openPosition = clickPosition;
  let closePosition = getclosingPrenthIndex(text, openPosition);

  text.replace(/[()]/g, function (prenth, idx) {
    prenthIndexes.push(idx);
  });

  prenthIndexes = prenthIndexes.sort((a, b) => b - a);
  prenthIndexes.forEach(function (i) {
    text =
      text.slice(0, i) +
      `<span class="${
        openPosition === i || closePosition === i ? "selected" : "prenthesis"
      }">${text[i]}</span>` +
      text.slice(i + 1);
  });

  text = text.replace(
    /AND NOT/g,
    '<span class="and_not_operator">AND NOT</span>'
  );
  text = text.replace(/[*]/g, '<span class="asterisk">*</span>');
  text = text.replace(/ OR /g, '&nbsp<span class="or_operator">OR</span>&nbsp');
  text = text.replace(
    / AND /g,
    '&nbsp<span class="and_operator">AND</span>&nbsp'
  );
  text = text.replace(/&&/g, '<span class="and_operator">&&</span>');
  text = text.replace(/\|\|/g, '<span class="or_operator">||</span>');

  return text;
}

function getSpecificIndexes(text, value, value_length) {
  let indexes = [];
  let i = -1;
  while ((i = text.indexOf(value, i + 1)) != -1) {
    indexes.push(Array.from({ length: value_length }, (v, x) => i + x));
  }
  return indexes.flat();
}

function getclosingPrenthIndex(text, position) {
  var indexesAndNotList = getSpecificIndexes(text, "AND NOT", "AND NOT".length);
  var indexesCarmaList = getSpecificIndexes(text, "Carma", "Carma".length);

  if (text[position] === "(") {
    let textLength = text.length;
    let closePosition = position;
    let counter = 1;
    while (counter > 0) {
      let c = text[++closePosition];
      if (c == "(") {
        counter++;
      } else if (c == ")") {
        counter--;
      } else if (closePosition > textLength) {
        return false;
      }
    }
    return closePosition;
  } else if (text[position] === ")") {
    let openPosition = position;
    let counter = 1;
    while (counter > 0) {
      let c = text[--openPosition];
      if (c == ")") {
        counter++;
      } else if (c == "(") {
        counter--;
      } else if (openPosition < 0) {
        return false;
      }
    }
    return openPosition;
  } else if (
    !indexesCarmaList.includes(position) &&
    !indexesAndNotList.includes(position)
  ) {
    let textLength = text.length;
    let closePosition = position;
    let counter = 1;
    while (counter > 0) {
      let c = text[++closePosition];
      if (c == "(") {
        counter++;
      } else if (c == ")") {
        counter--;
      } else if (closePosition > textLength) {
        return false;
      }
    }
    let openPosition = closePosition;
    let counter1 = 1;
    while (counter1 > 0) {
      let c = text[--openPosition];
      if (c == ")") {
        counter1++;
      } else if (c == "(") {
        counter1--;
      } else if (openPosition < 0) {
        return false;
      }
    }
    return { openPosition, closePosition };
  }
}

