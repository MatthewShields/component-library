const Accordion = class {
  constructor(s) {
    this.s = s;
    this.accordion = s.accordion;
    this.accordion_items = this.accordion.querySelectorAll(s.item_class);
    this.accordion_contents = this.accordion.querySelectorAll(s.content_class);
    this.accordion_triggers = this.accordion.querySelectorAll(s.trigger_class);

    this.accordion_click = this.accordion_click.bind(this);
    this._init_events();
  }

  _init_events() {
    // Loop through all the passed triggers and attach on click function
    for (let i = 0; i < this.accordion_triggers.length; i++) {
      this.accordion_triggers.item(i).onclick = this.accordion_click;
    }

    // If told to open the first accordion item trigger click
    if((this.s.open_first === true || this.s.open_first === 'true') && this.accordion_triggers.length > 0) {
      this.accordion_triggers[0].click();
    }
  }

  accordion_click(e) {

    // Determine if we are opening or closing the accordion item
    let method = (e.currentTarget.getAttribute('aria-expanded') === 'true') ? 'collapse' : 'expand';

    // Variables to store the index of the item being clicked
    let active_index = false;
    let clicked_trigger = e.currentTarget.getAttribute('id');

    // Loop through each of the item triggers
    for (let i = 0; i < this.accordion_triggers.length; i++) {

      // Store the current trigger
      let item = this.accordion_triggers.item(i);

      // If are to collapse other accordions when one opened
      if(this.s.collapse_others) {
        // Set the current trigger to being not expanded
        item.setAttribute('aria-expanded', 'false');
        // Remove the open class from the accordion item
        this.accordion_items.item(i).classList.remove(this.s.open_class);
        // Remove the active class from the accordion content
        this.accordion_contents.item(i).classList.remove(this.s.content_active_class);
      }

      // If the ID of the trigger clicked matches the ID of the current trigger store its index
      if (clicked_trigger === item.getAttribute('id')) {
        active_index = i;
      }
    }

    // If the detected movement is to collapse and set to not collapse other accordion items
    if (method === 'collapse' && this.s.collapse_others === false) {

      // Set the current trigger to being collapsed
      e.currentTarget.setAttribute('aria-expanded', 'false');
      // Remove the open class to the accordion item using corrosponding index
      this.accordion_items.item(active_index).classList.remove(this.s.open_class);
      // Remove the active class to the accordion content using corrosponding index
      this.accordion_contents.item(active_index).classList.remove(this.s.content_active_class);
    }

    // If the detected movement is to expand the accordion item
    if (method === 'expand') {

      // Set the current trigger to being expanded
      e.currentTarget.setAttribute('aria-expanded', 'true');
      // Add the open class to the accordion item using corrosponding index
      this.accordion_items.item(active_index).classList.add(this.s.open_class);
      // Add the active class to the accordion content using corrosponding index
      this.accordion_contents.item(active_index).classList.add(this.s.content_active_class);

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