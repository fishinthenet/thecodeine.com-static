development.prototype = new page();
development.prototype.constructor = development;

function development(html) {
  this.html = html;
  page.prototype.init.call(this);
}

codeine.pages.development = development;