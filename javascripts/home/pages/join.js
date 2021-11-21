join.prototype = new page();
join.prototype.constructor = join;

join.prototype.destroy = function (callback) {
  this.customSelect.destroy();
  this.destroyFileInputs();
  page.prototype.destroy.call(this, callback);
}

join.prototype.destroyFileInputs = function () {
  Array.prototype.forEach.call(this.inputs, function (input) {
    input.removeEventListener('change', this.handleFileChange);
  }.bind(this));
}

join.prototype.initFileInputs = function () {
  Array.prototype.forEach.call(this.inputs, function(input) {
    var label	 = input.nextElementSibling;

    input.addEventListener('change', this.handleFileChange.bind(this, label));
  }.bind(this));
}

join.prototype.handleFileChange = function (label, e) {
  label.innerHTML = e.target.value.split( '\\' ).pop();
}

function join(html) {
  this.html = html;
  page.prototype.init.call(this);

  this.customSelect = customSelect('select')[0];
  this.inputs = document.querySelectorAll('.form__file-input');

  this.initFileInputs();
}

codeine.pages.join = join;
