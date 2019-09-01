/*
 * ES2015 accessible modal tooltip system, using ARIA
 * Website: https://van11y.net/accessible-modal-tooltip/
 * License MIT: https://github.com/nico3333fr/van11y-accessible-modal-tooltip-aria/blob/master/LICENSE
 */
'use strict';

(function (doc) {

    'use strict';

    var MODAL_TOOLTIP_JS_CLASS = 'js-tooltip';
    var MODAL_TOOLTIP_ID_PREFIX = 'label_tooltip';

    var MODAL_TOOLTIP_TAG_WRAPPER = 'span';
    var MODAL_TOOLTIP_WRAPPER_CLASS_SUFFIX = 'container';

    var MODAL_TOOLTIP_IS_ACTIVE_CLASS = 'is-active';

    var MODAL_TOOLTIP_CLASS_SUFFIX = 'tooltip';
    var MODAL_TOOLTIP_PREFIX_CLASS_ATTR = 'data-tooltip-prefix-class';
    var MODAL_TOOLTIP_TEXT_ATTR = 'data-tooltip-text';
    var MODAL_TOOLTIP_CONTENT_ID_ATTR = 'data-tooltip-content-id';
    var MODAL_TOOLTIP_TITLE_ATTR = 'data-tooltip-title';
    var MODAL_TOOLTIP_TO_ATTR = 'data-tooltip-focus-toid';
    var MODAL_TOOLTIP_CLOSE_TEXT_ATTR = 'data-tooltip-close-text';
    var MODAL_TOOLTIP_CLOSE_TITLE_ATTR = 'data-tooltip-close-title';
    var MODAL_TOOLTIP_CLOSE_IMG_ATTR = 'data-tooltip-close-img';
    var MODAL_TOOLTIP_ROLE = 'dialog';

    var MODAL_TOOLTIP_CONTENT_TEXT_ONLY_WRAPPER = 'p';

    var MODAL_TOOLTIP_BUTTON_CLASS_SUFFIX = 'tooltip__close';
    var MODAL_TOOLTIP_BUTTON_JS_ID = 'js-tooltip-close';
    var MODAL_TOOLTIP_BUTTON_JS_CLASS = 'js-tooltip-close';
    var MODAL_TOOLTIP_BUTTON_CONTENT_BACK_ID = 'data-content-back-id';
    var MODAL_TOOLTIP_BUTTON_FOCUS_BACK_ID = 'data-focus-back';

    var MODAL_TOOLTIP_CONTENT_WRAPPER_CLASS_SUFFIX = 'tooltip__wrapper';
    var MODAL_TOOLTIP_CONTENT_CLASS_SUFFIX = 'tooltip__content';
    var MODAL_TOOLTIP_CONTENT_JS_ID = 'js-tooltip-content';

    var MODAL_TOOLTIP_CLOSE_IMG_CLASS_SUFFIX = 'tooltip__closeimg';
    var MODAL_TOOLTIP_CLOSE_TEXT_CLASS_SUFFIX = 'modal-close__text';

    var MODAL_TOOLTIP_TITLE_ID = 'tooltip-title';
    var MODAL_TOOLTIP_TITLE_CLASS_SUFFIX = 'tooltip__title';

    var FOCUSABLE_ELEMENTS_STRING = "a[href], area[href], input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

    var MODAL_TOOLTIP_DIALOG_JS_ID = 'js-dialogtooltip';
    var MODAL_TOOLTIP_DIALOG_JS_CLASS = 'js-dialogtooltip';

    var ATTR_ROLE = 'role';
    var ATTR_OPEN = 'open';
    var ATTR_LABELLEDBY = 'aria-labelledby';
    //const ATTR_MODAL = 'aria-modal="true"';

    var findById = function findById(id) {
        return doc.getElementById(id);
    };

    var addClass = function addClass(el, className) {
        if (el.classList) {
            el.classList.add(className); // IE 10+
        } else {
                el.className += ' ' + className; // IE 8+
            }
    };

    var removeClass = function removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className); // IE 10+
        } else {
                el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); // IE 8+
            }
    };

    var hasClass = function hasClass(el, className) {
        if (el.classList) {
            return el.classList.contains(className); // IE 10+
        } else {
                return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className); // IE 8+ ?
            }
    };

    var wrapOutside = function wrapOutside(el, wrapper) {
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    };

    function remove(el) {
        /* node.remove() is too modern for IE≤11 */
        el.parentNode.removeChild(el);
    }

    /* gets an element el, search if it is child of parent class, returns id of the parent */
    var searchParent = function searchParent(el, parentClass) {
        var found = false;
        var parentElement = el.parentNode;
        while (parentElement && found === false) {
            if (hasClass(parentElement, parentClass) === true) {
                found = true;
            } else {
                parentElement = parentElement.parentNode;
            }
        }
        if (found === true) {
            return parentElement.getAttribute('id');
        } else {
            return '';
        }
    };

    /**
     * Create the template for a modal tooltip
     * @param  {Object} config
     * @return {String}
     */
    var createModalTooltip = function createModalTooltip(config) {

        var id = MODAL_TOOLTIP_DIALOG_JS_ID;
        var modalTooltipClassName = config.modalTooltipPrefixClass + MODAL_TOOLTIP_CLASS_SUFFIX;
        var modalTooltipClassWrapper = config.modalTooltipPrefixClass + MODAL_TOOLTIP_CONTENT_WRAPPER_CLASS_SUFFIX;
        var buttonCloseClassName = config.modalTooltipPrefixClass + MODAL_TOOLTIP_BUTTON_CLASS_SUFFIX;
        var buttonCloseInner = config.modalTooltipCloseImgPath ? '<img src="' + config.modalTooltipCloseImgPath + '" alt="' + config.modalTooltipCloseText + '" class="' + MODAL_TOOLTIP_CLOSE_IMG_CLASS_SUFFIX + '" />' : '<span class="' + MODAL_TOOLTIP_CLOSE_TEXT_CLASS_SUFFIX + '">\n              ' + config.modalTooltipCloseText + '\n             </span>';
        var contentClassName = config.modalTooltipPrefixClass + MODAL_TOOLTIP_CONTENT_CLASS_SUFFIX;
        var titleClassName = config.modalTooltipPrefixClass + MODAL_TOOLTIP_TITLE_CLASS_SUFFIX;
        var title = config.modalTooltipTitle !== '' ? '<h1 id="' + MODAL_TOOLTIP_TITLE_ID + '" class="' + titleClassName + '">\n               ' + config.modalTooltipTitle + '\n             </h1>' : '';
        var button_close = '<button type="button" class="' + MODAL_TOOLTIP_BUTTON_JS_CLASS + ' ' + buttonCloseClassName + '" id="' + MODAL_TOOLTIP_BUTTON_JS_ID + '" title="' + config.modalTooltipCloseTitle + '" ' + MODAL_TOOLTIP_BUTTON_CONTENT_BACK_ID + '="' + config.modalTooltipContentId + '" ' + MODAL_TOOLTIP_BUTTON_FOCUS_BACK_ID + '="' + config.modalTooltipFocusBackId + '">\n                             ' + buttonCloseInner + '\n                            </button>';
        var content = config.modalTooltipText;

        // If there is no content but an id we try to fetch content id
        if (content === '' && config.modalTooltipContentId) {
            var contentFromId = findById(config.modalTooltipContentId);
            if (contentFromId) {
                content = '<div id="' + MODAL_TOOLTIP_CONTENT_JS_ID + '">\n                            ' + contentFromId.innerHTML + '\n                           </div';
                // we remove content from its source to avoid id duplicates, etc.
                contentFromId.innerHTML = '';
            }
        } else {
            // we put it in a p
            content = '<' + MODAL_TOOLTIP_CONTENT_TEXT_ONLY_WRAPPER + '>\n                            ' + content + '\n                       </' + MODAL_TOOLTIP_CONTENT_TEXT_ONLY_WRAPPER + '>';
        }

        return '<dialog id="' + id + '" class="' + modalTooltipClassName + ' ' + MODAL_TOOLTIP_DIALOG_JS_CLASS + '" ' + ATTR_ROLE + '="' + MODAL_TOOLTIP_ROLE + '" ' + ATTR_OPEN + ' ' + ATTR_LABELLEDBY + '="' + MODAL_TOOLTIP_TITLE_ID + '">\n                  <div role="document" class="' + modalTooltipClassWrapper + '">\n                    ' + button_close + '\n                    <div class="' + contentClassName + '">\n                      ' + title + '\n                      ' + content + '\n                    </div>\n                  </div>\n                </dialog>';
    };

    var closeModalTooltip = function closeModalTooltip(config) {

        remove(config.modalTooltip);

        if (config.contentBackId !== '') {
            var contentBack = findById(config.contentBackId);
            if (contentBack) {
                contentBack.innerHTML = config.modalTooltipContent;
            }
        }

        if (config.modalTooltipFocusBackId) {
            var contentFocus = findById(config.modalTooltipFocusBackId);
            if (contentFocus) {
                contentFocus.focus();
            }
        }
    };

    /** Find all modal tooltips inside a container
     * @param  {Node} node Default document
     * @return {Array}
     */
    var $listModalTooltips = function $listModalTooltips() {
        var node = arguments.length <= 0 || arguments[0] === undefined ? doc : arguments[0];
        return [].slice.call(node.querySelectorAll('.' + MODAL_TOOLTIP_JS_CLASS));
    };

    /**
     * Build modal tooltips for a container
     * @param  {Node} node
     * @param  {addListeners} boolean
     */
    var attach = function attach(node) {
        var addListeners = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        $listModalTooltips(node).forEach(function (modal_tooltip_node) {

            var iLisible = Math.random().toString(32).slice(2, 12);
            var modalTooltipPrefixClass = modal_tooltip_node.hasAttribute(MODAL_TOOLTIP_PREFIX_CLASS_ATTR) === true ? modal_tooltip_node.getAttribute(MODAL_TOOLTIP_PREFIX_CLASS_ATTR) + '-' : '';

            modal_tooltip_node.setAttribute('id', MODAL_TOOLTIP_ID_PREFIX + iLisible);

            // wrap element in
            var wrapper = doc.createElement(MODAL_TOOLTIP_TAG_WRAPPER);
            wrapper.setAttribute('class', modalTooltipPrefixClass + MODAL_TOOLTIP_WRAPPER_CLASS_SUFFIX);
            wrapOutside(modal_tooltip_node, wrapper);
        });

        if (addListeners) {
            /* listeners */
            ['click', 'keydown'].forEach(function (eventName) {

                doc.body.addEventListener(eventName, function (e) {

                    // click on link modal tooltip
                    if (hasClass(e.target, MODAL_TOOLTIP_JS_CLASS) === true && eventName === 'click' && hasClass(e.target, MODAL_TOOLTIP_IS_ACTIVE_CLASS) === false) {
                        (function () {

                            var modalTooltipLauncher = e.target;
                            var modalTooltipPrefixClass = modalTooltipLauncher.hasAttribute(MODAL_TOOLTIP_PREFIX_CLASS_ATTR) === true ? modalTooltipLauncher.getAttribute(MODAL_TOOLTIP_PREFIX_CLASS_ATTR) + '-' : '';
                            var modalTooltipText = modalTooltipLauncher.hasAttribute(MODAL_TOOLTIP_TEXT_ATTR) === true ? modalTooltipLauncher.getAttribute(MODAL_TOOLTIP_TEXT_ATTR) : '';
                            var modalTooltipContentId = modalTooltipLauncher.hasAttribute(MODAL_TOOLTIP_CONTENT_ID_ATTR) === true ? modalTooltipLauncher.getAttribute(MODAL_TOOLTIP_CONTENT_ID_ATTR) : '';
                            var modalTooltipTitle = modalTooltipLauncher.hasAttribute(MODAL_TOOLTIP_TITLE_ATTR) === true ? modalTooltipLauncher.getAttribute(MODAL_TOOLTIP_TITLE_ATTR) : '';
                            var modalTooltipCloseText = modalTooltipLauncher.hasAttribute(MODAL_TOOLTIP_CLOSE_TEXT_ATTR) === true ? modalTooltipLauncher.getAttribute(MODAL_TOOLTIP_CLOSE_TEXT_ATTR) : '';
                            var modalTooltipCloseTitle = modalTooltipLauncher.hasAttribute(MODAL_TOOLTIP_CLOSE_TITLE_ATTR) === true ? modalTooltipLauncher.getAttribute(MODAL_TOOLTIP_CLOSE_TITLE_ATTR) : modalTooltipCloseText;
                            var modalTooltipCloseImgPath = modalTooltipLauncher.hasAttribute(MODAL_TOOLTIP_CLOSE_IMG_ATTR) === true ? modalTooltipLauncher.getAttribute(MODAL_TOOLTIP_CLOSE_IMG_ATTR) : '';
                            var modalTooltipGiveFocusToId = modalTooltipLauncher.hasAttribute(MODAL_TOOLTIP_TO_ATTR) === true ? modalTooltipLauncher.getAttribute(MODAL_TOOLTIP_TO_ATTR) : '';

                            var modalTooltip = findById(MODAL_TOOLTIP_DIALOG_JS_ID);
                            // if already a modal tooltip opened, we close it
                            if (modalTooltip) {
                                // get launcher
                                var modalTooltipButtonClose = findById(MODAL_TOOLTIP_BUTTON_JS_ID);
                                var modalTooltipContent = findById(MODAL_TOOLTIP_CONTENT_JS_ID) ? findById(MODAL_TOOLTIP_CONTENT_JS_ID).innerHTML : '';
                                var modalTooltipFocusBackId = modalTooltipButtonClose.getAttribute(MODAL_TOOLTIP_BUTTON_FOCUS_BACK_ID);
                                var _modalTooltipLauncher = findById(modalTooltipFocusBackId);
                                var contentBackId = modalTooltipButtonClose.getAttribute(MODAL_TOOLTIP_BUTTON_CONTENT_BACK_ID);

                                // remove modal tooltip
                                closeModalTooltip({
                                    modalTooltip: modalTooltip,
                                    modalTooltipContent: modalTooltipContent,
                                    modalTooltipFocusBackId: modalTooltipFocusBackId,
                                    contentBackId: contentBackId
                                });

                                // remove active class on launcher
                                removeClass(_modalTooltipLauncher, MODAL_TOOLTIP_IS_ACTIVE_CLASS);
                            }

                            // insert modal
                            // Chrome bug
                            setTimeout(function () {
                                modalTooltipLauncher.insertAdjacentHTML('afterend', createModalTooltip({
                                    modalTooltipText: modalTooltipText,
                                    modalTooltipPrefixClass: modalTooltipPrefixClass,
                                    modalTooltipTitle: modalTooltipTitle,
                                    modalTooltipCloseText: modalTooltipCloseText,
                                    modalTooltipCloseTitle: modalTooltipCloseTitle,
                                    modalTooltipCloseImgPath: modalTooltipCloseImgPath,
                                    modalTooltipContentId: modalTooltipContentId,
                                    modalTooltipFocusBackId: modalTooltipLauncher.getAttribute('id')
                                }));
                            }, 50);
                            // fix for Chrome bug resolution
                            setTimeout(function () {
                                // give focus to close button or specified element
                                var closeButton = findById(MODAL_TOOLTIP_BUTTON_JS_ID);
                                if (modalTooltipGiveFocusToId !== '') {
                                    var focusTo = findById(modalTooltipGiveFocusToId);
                                    if (focusTo) {
                                        focusTo.focus();
                                    } else {
                                        closeButton.focus();
                                    }
                                } else {
                                    closeButton.focus();
                                }
                            }, 51);

                            // add class is-active to launcher
                            addClass(modalTooltipLauncher, MODAL_TOOLTIP_IS_ACTIVE_CLASS);

                            e.preventDefault();
                        })();
                    }

                    // click on close button
                    var parentButton = searchParent(e.target, MODAL_TOOLTIP_BUTTON_JS_CLASS);
                    if ((e.target.getAttribute('id') === MODAL_TOOLTIP_BUTTON_JS_ID || parentButton !== '') && eventName === 'click') {
                        var _modalTooltip = findById(MODAL_TOOLTIP_DIALOG_JS_ID);
                        var modalTooltipContent = findById(MODAL_TOOLTIP_CONTENT_JS_ID) ? findById(MODAL_TOOLTIP_CONTENT_JS_ID).innerHTML : '';
                        var modalTooltipButtonClose = findById(MODAL_TOOLTIP_BUTTON_JS_ID);
                        var modalTooltipFocusBackId = modalTooltipButtonClose.getAttribute(MODAL_TOOLTIP_BUTTON_FOCUS_BACK_ID);
                        var modalTooltipLauncher = findById(modalTooltipFocusBackId);
                        var contentBackId = modalTooltipButtonClose.getAttribute(MODAL_TOOLTIP_BUTTON_CONTENT_BACK_ID);

                        closeModalTooltip({
                            modalTooltip: _modalTooltip,
                            modalTooltipContent: modalTooltipContent,
                            modalTooltipFocusBackId: modalTooltipFocusBackId,
                            contentBackId: contentBackId,
                            fromId: e.target.getAttribute('id')
                        });

                        // remove class is-active on launcher and give focus to it
                        removeClass(modalTooltipLauncher, MODAL_TOOLTIP_IS_ACTIVE_CLASS);
                        modalTooltipLauncher.focus();
                    }

                    var parentModalTooltip = searchParent(e.target, MODAL_TOOLTIP_DIALOG_JS_CLASS);
                    var modalTooltip = findById(MODAL_TOOLTIP_DIALOG_JS_ID);
                    // click anywhere outside modal tooltip when it is opened
                    if (modalTooltip && eventName === 'click' && // click anywhere with a modal tooltip opened
                    e.target.getAttribute('id') !== MODAL_TOOLTIP_DIALOG_JS_ID && parentModalTooltip === '' // not a click in modal tooltip
                    ) {
                            var modalTooltipButtonClose = findById(MODAL_TOOLTIP_BUTTON_JS_ID);

                            modalTooltipButtonClose.click();
                            if (hasClass(e.target, MODAL_TOOLTIP_IS_ACTIVE_CLASS) === true) {
                                e.preventDefault();
                            }
                        }

                    // strike a key when modal tooltip opened
                    if (modalTooltip && eventName === 'keydown') {
                        var modalTooltipContent = findById(MODAL_TOOLTIP_CONTENT_JS_ID) ? findById(MODAL_TOOLTIP_CONTENT_JS_ID).innerHTML : '';
                        var modalTooltipButtonClose = findById(MODAL_TOOLTIP_BUTTON_JS_ID);
                        var modalTooltipFocusBackId = modalTooltipButtonClose.getAttribute(MODAL_TOOLTIP_BUTTON_FOCUS_BACK_ID);
                        var contentBackId = modalTooltipButtonClose.getAttribute(MODAL_TOOLTIP_BUTTON_CONTENT_BACK_ID);
                        var modalTooltipLauncher = findById(modalTooltipFocusBackId);
                        var $listFocusables = [].slice.call(modalTooltip.querySelectorAll(FOCUSABLE_ELEMENTS_STRING));

                        // esc
                        if (e.keyCode === 27) {

                            closeModalTooltip({
                                modalTooltip: modalTooltip,
                                modalTooltipContent: modalTooltipContent,
                                modalTooltipFocusBackId: modalTooltipFocusBackId,
                                contentBackId: contentBackId
                            });

                            // remove class is-active on launcher and give focus to it
                            removeClass(modalTooltipLauncher, MODAL_TOOLTIP_IS_ACTIVE_CLASS);
                            modalTooltipLauncher.focus();
                        }

                        // tab or Maj Tab in modal tooltip => capture focus
                        if (e.keyCode === 9 && $listFocusables.indexOf(e.target) >= 0) {

                            // maj-tab on first element focusable => focus on last
                            if (e.shiftKey) {
                                if (e.target === $listFocusables[0]) {
                                    $listFocusables[$listFocusables.length - 1].focus();
                                    e.preventDefault();
                                }
                            } else {
                                // tab on last element focusable => focus on first
                                if (e.target === $listFocusables[$listFocusables.length - 1]) {
                                    $listFocusables[0].focus();
                                    e.preventDefault();
                                }
                            }
                        }
                    }
                }, true);
            });
        }
    };

    var onLoad = function onLoad() {
        attach();
        document.removeEventListener('DOMContentLoaded', onLoad);
    };

    document.addEventListener('DOMContentLoaded', onLoad);

    window.van11yAccessibleModalTooltipAria = attach;
})(document);
