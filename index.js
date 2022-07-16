let inputField = document.getElementById("inputField");
let outputField = document.getElementById("outputField");

["click", "select", "input"].forEach(function (e) {
  inputField.addEventListener(e, onInput);
});

function onInput(e) {
  let { target: { value }} = e;
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

function getclosingPrenthIndex(text, openPosition) {
  if (text[openPosition] === "(") {
    let textLength = text.length;
    let closePosition = openPosition;
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
  }
}
