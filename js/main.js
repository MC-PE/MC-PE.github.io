
   if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);
}
(function() {
  var button = document.getElementsByClassName('menu-btn')[0],
    container = document.getElementsByClassName('pages')[0],
    pages = container.children,
    spacing = 70,
    open = false,
    current = pages.length - 1,
    /* Last page by default, just for demo purposes */
    transition = 0.3,
    delayInterval = 0.05,
    /* Use 3D transforms when available */
    hwaccel = true,
    /* Add bounce effect to transition. 0 for none. */
    bounce = 10;
  if (bounce > 0) {
    var bounceTimeouts = new Array();
  }
  
  setTransition();
  setDelays();
  /* Open / Close menu with button */
  button.onclick = function() {
    toggleMenu();
  }
  function toggleMenu() {
    if (bounce > 0) {
      for (i = 0; i < pages.length; i++) {
        clearTimeout(bounceTimeouts[i]);
      }
    }
    if (!open) {
      for (i = 0; i < pages.length; i++) {
        var transform = spacing * (i + 1);
        if (i > current) {
          transform = transform - ( bounce * (i - current) );
        } else {
          transform = ( bounce * (i + 1) ) + transform;
        }
        transform = transform + 'px';
        transform = hwaccel && has3d() ? 'translate3d(0,' + transform + ',0)' : 'translateY(' + transform + ')';
        setStyle(pages[i], 'transform', transform);
        setStyle(pages[i], 'transitionDelay', pages[i].dataset.openDelay);
        if (bounce > 0) {
          doBounce(i);
        }
      }
      container.classList.add('open');
      open = true;
    } else {
      for (i = 0; i < pages.length; i++) {
        var transform = i > current ? '100%' : '0';
        transform = hwaccel && has3d() ? 'translate3d(0,' + transform + ',0)' : 'translateY(' + transform + ')';
        setStyle(pages[i], 'transform', transform);
        setStyle(pages[i], 'transitionDelay', pages[i].dataset.closeDelay);
      }
      open = false;
      container.classList.remove('open');
    }
  }
  /* Open page */
  for (i = 0; i < pages.length; i++) {
    pages[i].getElementsByTagName('header')[0].onclick = function(i) {
      if (open) {
        current = (Array.prototype.indexOf.call(pages, this.parentNode));
        setDelays();
        toggleMenu();
      }
    }
  }
  /* Do Bounce */
  
  function doBounce(i) {
    bounceTimeouts[i] = setTimeout(function() {
      var transform = spacing * (i + 1) + 'px';
        transform = hwaccel && has3d() ? 'translate3d(0,' + transform + ',0)' : 'translateY(' + transform + ')';
        setStyle(pages[i], 'transform', transform);
        setStyle(pages[i], 'transitionDelay', '0s');
    }, bounceDelay(i));
  }
  
  function bounceDelay(i) {
    return (transition + parseFloat(pages[i].dataset.openDelay.substring(0, pages[i].dataset.openDelay.length - 1))) * 1000;
  }
  
  /* Set transition length for pages */
  function setTransition() {
    for (i = 0; i < pages.length; i++) {
      pages[i].style['transition'] = 'transform ' + transition + 's';
      pages[i].style['webkitTransition'] = '-webkit-transform ' + transition + 's';
      pages[i].style['mozTransition'] = '-moz-transform ' + transition + 's';
      pages[i].style['msTransition'] = '-ms-transform ' + transition + 's';
      pages[i].style['oTransition'] = '-o-transform ' + transition + 's';
    }
  }
  /* Set transition delays for pages */
  function setDelays() {
    for (i = 0; i < pages.length; i++) {
      /* Closing */
      var delay;
      if (i > current) {
        delay = (pages.length - 1 - i) * delayInterval;
      } else {
        delay = i * delayInterval;
      }
      pages[i].dataset.closeDelay = delay + 's';
      /* Opening */
      delay = Math.abs(current - i) * delayInterval;
      pages[i].dataset.openDelay = delay + 's';
    }
  }
  /* Add style to elements */
  function setStyle(elem, property, value) {
    elem.style[property] = value;
    elem.style['webkit' + property.capitalizeFirstLetter()] = value;
    elem.style['moz' + property.capitalizeFirstLetter()] = value;
    elem.style['ms' + property.capitalizeFirstLetter()] = value;
    elem.style['o' + property.capitalizeFirstLetter()] = value;
  }
  /* Capitalise first letter (required for prefixed styling) */
  String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }
  /* Check if browser supports 3D transforms */
  function has3d() {
    if (!window.getComputedStyle) {
      return false;
    }
    var el = document.createElement('p'),
      has3d,
      transforms = {
        'webkitTransform': '-webkit-transform',
        'OTransform': '-o-transform',
        'msTransform': '-ms-transform',
        'MozTransform': '-moz-transform',
        'transform': 'transform'
      };
    document.body.insertBefore(el, null);
    for (var t in transforms) {
      if (el.style[t] !== undefined) {
        el.style[t] = 'translate3d(1px,1px,1px)';
        has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
      }
    }
    document.body.removeChild(el);
    return (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
  }
})();
