contact.prototype = new page();
contact.prototype.constructor = contact;

function contact(html) {
  this.html = html;
  page.prototype.init.call(this);
}

codeine.pages.contact = contact;