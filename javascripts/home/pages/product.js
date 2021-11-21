product.prototype = new page();
product.prototype.constructor = product;

function product(html) {
  this.html = html;
  page.prototype.init.call(this);
}

codeine.pages.product = product;