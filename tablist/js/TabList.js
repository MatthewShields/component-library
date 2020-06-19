const TabList = class {
    constructor(s) {
      // Store passed settings
      this.s = s;
  
      // Find all tabs and panels in this tablist
      this.tabs = Array.prototype.slice.call(this.s.tablist.querySelectorAll(this.s.tab_selector));
      this.panels = Array.prototype.slice.call(this.s.tablist.querySelectorAll(this.s.panel_selector));
  
      // Bind `this` to the functions that need it
      this.deactivate_tabs = this.deactivate_tabs.bind(this);
      this.active_navigation = this.active_navigation.bind(this);
      this.deactivate_navigation = this.deactivate_navigation.bind(this);
      this.navigate_tabs = this.navigate_tabs.bind(this);
      this.activate_tab = this.activate_tab.bind(this);
  
      // Initialise events
      this._init_events()
    }
  
    _init_events() {
      // Attach events
      for (let t = 0; t < this.tabs.length; t++) {
  
        // Click directly to tab
        this.tabs[t].addEventListener('click', this.navigate_tabs);
        // When focussed in tabs group activate keyboard navigation
        this.tabs[t].addEventListener('focus', this.active_navigation);
        // When not focussed in tabs group deactivate keyboard navigation
        this.tabs[t].addEventListener('blur', this.deactivate_navigation);
  
      }
  
      // Check that an active tab exists
      const active_tab = this.find_active_tab(this.tabs);
  
      // If no active tab exists then active the first one but don't focus on it
      if(active_tab === false) {
        this.activate_tab(this.tabs[0], false);
      }
    }
  
    active_navigation() {
      // Attach keyup
      document.addEventListener('keyup', this.navigate_tabs);
    }
  
    deactivate_navigation() {
      // Deactivate keyup
      document.removeEventListener('keyup', this.navigate_tabs);
    }
  
    navigate_tabs(e) {
      // If is a keyboard navigation event
      if(e.type === 'keyup') {
        // Store key value of keypress
        var key = e.which || e.keyCode;
  
        // Find currently active tav
        const active_tab = this.find_active_tab(this.tabs);
  
        // If no active tab found then return false
        if(active_tab === false) {
          return false;
        }
  
        // If home key is pressed go to first tab and focus on it
        if (key === 33) {
          this.activate_tab(this.tabs[0], true);
        }
  
        // If end key is pressed go to last tab and focus on it
        else if (key === 34) {
          this.activate_tab(this.tabs[this.tabs.length - 1], true);
        }
  
        // If left key is pressed
        else if (key === 37) {
          // If currently active tab is first then go to last tab and focus on it
          if(active_tab === 0) {
            this.activate_tab(this.tabs[this.tabs.length - 1], true);
          }
          // If currently active tab is not first then go to previous tab and focus on it
          else {
            this.activate_tab(this.tabs[active_tab - 1], true);
          }
        }
  
        // If right key is pressed
        else if (key === 39) {
          // If currently active tab is last then go to first tab and focus on it
          if(active_tab === this.tabs.length - 1) {
            this.activate_tab(this.tabs[0], true);
          }
          // If currently active tab is not last then go to next tab and focus on it
          else {
            this.activate_tab(this.tabs[active_tab + 1], true);
          }
        }
      }
  
      // If is a mouseclick navigation event
      else if(e.type === 'click') {
  
        // Find index of clicked tab and activate it
        var index = this.tabs.indexOf(e.target);
        this.activate_tab(this.tabs[index]);
  
      }
  
    }
  
    activate_tab(tab, focus) {
  
      // Deactivate all tabs
      this.deactivate_tabs();
  
      // Remove tabindex="-1" attribute from new tab
      tab.removeAttribute('tabindex');
  
      // Set the new tab as selected
      tab.setAttribute('aria-selected', 'true');
  
      // Get the value of aria-controls (which is an ID)
      var controls = tab.getAttribute('aria-controls');
  
      // Add active class to tab panel to make it visible
      document.getElementById(controls).classList.add(this.s.panel_active_class);
  
      // Set focus on new tab
      if(focus) {
        tab.focus();
      }
  
    }
  
    deactivate_tabs () {
  
      // Loop through all tabs
      for (let t = 0; t < this.tabs.length; t++) {
        // Add tabindex="-1" to all tabs to stop from being tabbed to directly
        this.tabs[t].setAttribute('tabindex', '-1');
        // Set all tabs to not being selected
        this.tabs[t].setAttribute('aria-selected', 'false');
      };
  
      // Loop through all panels and remove active class
      for (let p = 0; p < this.panels.length; p++) {
        this.panels[p].classList.remove(this.s.panel_active_class);
      };
    }
  
    find_active_tab(tabs) {
      // Storage variable
      let active_tab = false;
      // Loop through all tabs
      for (let t = 0; t < tabs.length; t++) {
        // If no previous active tab has been found
        if(active_tab === false) {
          // If aria-selected="true" is found then store the index
          active_tab = ((tabs[t].getAttribute('aria-selected') === true || tabs[t].getAttribute('aria-selected') === 'true') ? t : false);
        }
      }
      // Return active tab index or false if not found
      return active_tab;
    }
  }
  
  export default TabList;
  
  // Query all triggers for modals
  const tablists = document.querySelectorAll('.tablist');
  
  // Loop through modal triggers and initialise each
  for (let i = 0; i < tablists.length; i++) {
    new TabList({
      // Pass trigger
      tablist: tablists[i],
      // Selector used to identify tabs
      tab_selector: '.tablist__tab',
      // Selector used to identify panels
      panel_selector: '[role="tabpanel"]',
      // Class to be added to active panels
      panel_active_class: 'tablist__panel--active',
    });
  }