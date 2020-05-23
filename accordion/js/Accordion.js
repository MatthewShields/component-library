const Accordion = class {
  constructor(s) {
    this.s = s;
    this.accordion = s.accordion;
    this.accordion_items = Array.prototype.slice.call(this.accordion.querySelectorAll(s.item_class));
    this.accordion_contents = Array.prototype.slice.call(this.accordion.querySelectorAll(s.content_class));
    this.accordion_triggers = Array.prototype.slice.call(this.accordion.querySelectorAll(s.trigger_class));

    this.accordion_click = this.accordion_click.bind(this);
    this.navigate_accordions = this.navigate_accordions.bind(this);
    this._init_events();
  }

  _init_events() {
    // Loop through all the passed triggers and attach on click and navigation functions
    for (let i = 0; i < this.accordion_triggers.length; i++) {
      this.accordion_triggers[i].onclick = this.accordion_click;
      this.accordion_triggers[i].onkeydown = this.navigate_accordions;
    }

    // If told to open the first accordion item trigger click
    if((this.s.open_first === true || this.s.open_first === 'true') && this.accordion_triggers.length > 0) {
      this.accordion_triggers[0].click();
    }
  }

  navigate_accordions(e) {
    // Store key value of keypress
    var key = e.which.toString();

    // 38 = Up, 40 = Down
    // 33 = Page Up, 34 = Page Down
    var ctrlModifier = (event.ctrlKey && key.match(/33|34/));

    // Up/ Down arrow and Control + Page Up/ Page Down keyboard operations
    if (key.match(/38|40/) || ctrlModifier) {
      var index = this.accordion_triggers.indexOf(e.currentTarget);
      var direction = (key.match(/34|40/)) ? 1 : -1;
      var length = this.accordion_triggers.length;
      var newIndex = (index + length + direction) % length;

      this.accordion_triggers[newIndex].focus();

      e.preventDefault();
    }
    else if (key.match(/35|36/)) {
      // 35 = End, 36 = Home keyboard operations
      switch (key) {
        // Go to first accordion
        case '36':
          this.accordion_triggers[0].focus();
          break;
          // Go to last accordion
        case '35':
          this.accordion_triggers[this.accordion_triggers.length - 1].focus();
          break;
      }
      e.preventDefault();
    }
  }

  accordion_click(e) {

    // Determine if we are opening or closing the accordion item
    let method = (e.currentTarget.getAttribute('aria-expanded') === 'true') ? 'collapse' : 'expand';

    // Loop through each of the item triggers
    for (let i = 0; i < this.accordion_triggers.length; i++) {

      // Store the current trigger
      let item = this.accordion_triggers[i];

      // If are to collapse other accordions when one opened
      if(this.s.collapse_others) {
        // Set the current trigger to being not expanded
        item.setAttribute('aria-expanded', 'false');
        // Remove the open class from the accordion item
        this.accordion_items[i].classList.remove(this.s.open_class);
        // Remove the active class from the accordion content
        this.accordion_contents[i].classList.remove(this.s.content_active_class);
      }
    }

    // Variables to store the index of the item being clicked
    let active_index = this.accordion_triggers.indexOf(e.currentTarget);

    // If the detected movement is to collapse and set to not collapse other accordion items
    if (method === 'collapse' && this.s.collapse_others === false) {

      // Set the current trigger to being collapsed
      e.currentTarget.setAttribute('aria-expanded', 'false');
      // Remove the open class to the accordion item using corrosponding index
      this.accordion_items[active_index].classList.remove(this.s.open_class);
      // Remove the active class to the accordion content using corrosponding index
      this.accordion_contents[active_index].classList.remove(this.s.content_active_class);
    }

    // If the detected movement is to expand the accordion item
    if (method === 'expand') {

      // Set the current trigger to being expanded
      e.currentTarget.setAttribute('aria-expanded', 'true');
      // Add the open class to the accordion item using corrosponding index
      this.accordion_items[active_index].classList.add(this.s.open_class);
      // Add the active class to the accordion content using corrosponding index
      this.accordion_contents[active_index].classList.add(this.s.content_active_class);

      // Get the bounding data for the clicked trigger
      var bounding = e.currentTarget.getBoundingClientRect();
      // Check against the current triggers position
      if (bounding.top >= 0 && bounding.left >= 0 && bounding.right <= window.innerWidth && bounding.bottom <= window.innerHeight) {
        // In view so do nothing
      } else {
        // Scroll new active accordion block into view
        e.currentTarget.scrollIntoView();
      }
    }
  }
};

export default Accordion;

const accordions = document.querySelectorAll('.accordion');

for (let i = 0; i < accordions.length; i++) {
  new Accordion({
    // Accordion group node
    accordion: accordions[i],
    // Identifier of the individual accordion item node within the group node
    item_class: '.accordion__item',
    // Class of the content section within the individual accordion item
    content_class: '.accordion__content',
    // Class of the trigger within the individual accordion item
    trigger_class: '.accordion__trigger',
    // Class to be added to the content section when active
    content_active_class: 'accordion__content--active',
    // Class to be added to the individual accordion item when active
    open_class: 'open',
    // Whether to open the first accordion item on page load
    open_first: accordions[i].getAttribute('data-open-first')
  });
}