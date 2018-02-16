/*
 * ES2015 accessible modal tooltip system, using ARIA
 * Website: https://van11y.net/accessible-modal-tooltip/
 * License MIT: https://github.com/nico3333fr/van11y-accessible-modal-tooltip-aria/blob/master/LICENSE
 */
(doc => {

    'use strict';

    const MODAL_TOOLTIP_JS_CLASS = 'js-tooltip';
    const MODAL_TOOLTIP_ID_PREFIX = 'label_tooltip';

    const MODAL_TOOLTIP_TAG_WRAPPER = 'span';
    const MODAL_TOOLTIP_WRAPPER_CLASS_SUFFIX = 'container';

    const MODAL_TOOLTIP_IS_ACTIVE_CLASS = 'is-active';

    const MODAL_TOOLTIP_CLASS_SUFFIX = 'tooltip';
    const MODAL_TOOLTIP_PREFIX_CLASS_ATTR = 'data-tooltip-prefix-class';
    const MODAL_TOOLTIP_TEXT_ATTR = 'data-tooltip-text';
    const MODAL_TOOLTIP_CONTENT_ID_ATTR = 'data-tooltip-content-id';
    const MODAL_TOOLTIP_TITLE_ATTR = 'data-tooltip-title';
    const MODAL_TOOLTIP_CLOSE_TEXT_ATTR = 'data-tooltip-close-text';
    const MODAL_TOOLTIP_CLOSE_TITLE_ATTR = 'data-tooltip-close-title';
    const MODAL_TOOLTIP_CLOSE_IMG_ATTR = 'data-tooltip-close-img';
    const MODAL_TOOLTIP_ROLE = 'dialog';

    const MODAL_TOOLTIP_CONTENT_TEXT_ONLY_WRAPPER = 'p';

    const MODAL_TOOLTIP_BUTTON_CLASS_SUFFIX = 'tooltip__close';
    const MODAL_TOOLTIP_BUTTON_JS_ID = 'js-tooltip-close';
    const MODAL_TOOLTIP_BUTTON_JS_CLASS = 'js-tooltip-close';
    const MODAL_TOOLTIP_BUTTON_CONTENT_BACK_ID = 'data-content-back-id';
    const MODAL_TOOLTIP_BUTTON_FOCUS_BACK_ID = 'data-focus-back';

    const MODAL_TOOLTIP_CONTENT_CLASS_SUFFIX = 'tooltip__content';
    const MODAL_TOOLTIP_CONTENT_JS_ID = 'js-tooltip-content';

    const MODAL_TOOLTIP_CLOSE_IMG_CLASS_SUFFIX = 'tooltip__closeimg';
    const MODAL_TOOLTIP_CLOSE_TEXT_CLASS_SUFFIX = 'modal-close__text';

    const MODAL_TOOLTIP_TITLE_ID = 'tooltip-title';
    const MODAL_TOOLTIP_TITLE_CLASS_SUFFIX = 'tooltip__title';

    const FOCUSABLE_ELEMENTS_STRING = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

    const MODAL_TOOLTIP_DIALOG_JS_ID = 'js-dialogtooltip';
    const MODAL_TOOLTIP_DIALOG_JS_CLASS = 'js-dialogtooltip';

    const ATTR_ROLE = 'role';
    const ATTR_OPEN = 'open';
    const ATTR_LABELLEDBY = 'aria-labelledby';
    //const ATTR_MODAL = 'aria-modal="true"';



    const findById = id => doc.getElementById(id);

    const addClass = (el, className) => {
        if (el.classList) {
            el.classList.add(className); // IE 10+
        } else {
            el.className += ' ' + className; // IE 8+
        }
    }

    const removeClass = (el, className) => {
        if (el.classList) {
            el.classList.remove(className); // IE 10+
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); // IE 8+
        }
    }

    const hasClass = (el, className) => {
        if (el.classList) {
            return el.classList.contains(className); // IE 10+
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className); // IE 8+ ?
        }
    }

    const wrapOutside = (el, wrapper) => {
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    }

    function remove(el) { /* node.remove() is too modern for IE≤11 */
        el.parentNode.removeChild(el);
    }

    /* gets an element el, search if it is child of parent class, returns id of the parent */
    let searchParent = (el, parentClass) => {
        let found = false;
        let parentElement = el.parentNode;
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
    }

    /**
     * Create the template for a modal tooltip
     * @param  {Object} config
     * @return {String}
     */
    const createModalTooltip = config => {

        let id = MODAL_TOOLTIP_DIALOG_JS_ID;
        let modalTooltipClassName = config.modalTooltipPrefixClass + MODAL_TOOLTIP_CLASS_SUFFIX;
        let buttonCloseClassName = config.modalTooltipPrefixClass + MODAL_TOOLTIP_BUTTON_CLASS_SUFFIX;
        let buttonCloseInner = config.modalTooltipCloseImgPath ?
            `<img src="${config.modalTooltipCloseImgPath}" alt="${config.modalTooltipCloseText}" class="${MODAL_TOOLTIP_CLOSE_IMG_CLASS_SUFFIX}" />` :
            `<span class="${MODAL_TOOLTIP_CLOSE_TEXT_CLASS_SUFFIX}">
              ${config.modalTooltipCloseText}
             </span>`;
        let contentClassName = config.modalTooltipPrefixClass + MODAL_TOOLTIP_CONTENT_CLASS_SUFFIX;
        let titleClassName = config.modalTooltipPrefixClass + MODAL_TOOLTIP_TITLE_CLASS_SUFFIX;
        let title = config.modalTooltipTitle !== '' ?
            `<h1 id="${MODAL_TOOLTIP_TITLE_ID}" class="${titleClassName}">
               ${config.modalTooltipTitle}
             </h1>` : '';
        let button_close = `<button type="button" class="${MODAL_TOOLTIP_BUTTON_JS_CLASS} ${buttonCloseClassName}" id="${MODAL_TOOLTIP_BUTTON_JS_ID}" title="${config.modalTooltipCloseTitle}" ${MODAL_TOOLTIP_BUTTON_CONTENT_BACK_ID}="${config.modalTooltipContentId}" ${MODAL_TOOLTIP_BUTTON_FOCUS_BACK_ID}="${config.modalTooltipFocusBackId}">
                             ${buttonCloseInner}
                            </button>`;
        let content = config.modalTooltipText;

        // If there is no content but an id we try to fetch content id
        if (content === '' && config.modalTooltipContentId) {
            let contentFromId = findById(config.modalTooltipContentId);
            if (contentFromId) {
                content = `<div id="${MODAL_TOOLTIP_CONTENT_JS_ID}">
                            ${contentFromId.innerHTML}
                           </div`;
                // we remove content from its source to avoid id duplicates, etc.
                contentFromId.innerHTML = '';
            }

        } else {
            // we put it in a p
            content = `<${MODAL_TOOLTIP_CONTENT_TEXT_ONLY_WRAPPER}>
                            ${content}
                       </${MODAL_TOOLTIP_CONTENT_TEXT_ONLY_WRAPPER}>`;
        }


        return `<dialog id="${id}" class="${modalTooltipClassName} ${MODAL_TOOLTIP_DIALOG_JS_CLASS}" ${ATTR_ROLE}="${MODAL_TOOLTIP_ROLE}" ${ATTR_OPEN}  ${ATTR_LABELLEDBY}="${MODAL_TOOLTIP_TITLE_ID}">
                  <div role="document">
                    ${button_close}
                    <div class="${contentClassName}">
                      ${title}
                      ${content}
                    </div>
                  </div>
                </dialog>`;

    };

    const closeModalTooltip = config => {

        remove(config.modalTooltip);

        if (config.contentBackId !== '') {
            let contentBack = findById(config.contentBackId);
            if (contentBack) {
                contentBack.innerHTML = config.modalTooltipContent;
            }
        }

        if (config.modalTooltipFocusBackId) {
            let contentFocus = findById(config.modalTooltipFocusBackId);
            if (contentFocus) {
                contentFocus.focus();
            }
        }


    }

    /** Find all modal tooltips inside a container
     * @param  {Node} node Default document
     * @return {Array}      
     */
    const $listModalTooltips = (node = doc) => [].slice.call(node.querySelectorAll('.' + MODAL_TOOLTIP_JS_CLASS));


    /**
     * Build modal tooltips for a container
     * @param  {Node} node 
     */
    const attach = (node) => {

        $listModalTooltips(node)
            .forEach((modal_tooltip_node) => {

                let iLisible = Math.random().toString(32).slice(2, 12);
                let modalTooltipPrefixClass = modal_tooltip_node.hasAttribute(MODAL_TOOLTIP_PREFIX_CLASS_ATTR) === true ? modal_tooltip_node.getAttribute(MODAL_TOOLTIP_PREFIX_CLASS_ATTR) + '-' : '';

                modal_tooltip_node.setAttribute('id', MODAL_TOOLTIP_ID_PREFIX + iLisible);

                // wrap element in 
                let wrapper = doc.createElement(MODAL_TOOLTIP_TAG_WRAPPER);
                wrapper.setAttribute('class', modalTooltipPrefixClass + MODAL_TOOLTIP_WRAPPER_CLASS_SUFFIX);
                wrapOutside(modal_tooltip_node, wrapper);

            });
    };


    /* listeners */
    ['click', 'keydown']
    .forEach(eventName => {

        doc.body
            .addEventListener(eventName, e => {

                // click on link modal tooltip
                if (
                    (hasClass(e.target, MODAL_TOOLTIP_JS_CLASS) === true) &&
                    eventName === 'click' &&
                    (hasClass(e.target, MODAL_TOOLTIP_IS_ACTIVE_CLASS) === false)
                ) {

                    let modalTooltipLauncher = e.target;
                    let modalTooltipPrefixClass = modalTooltipLauncher.hasAttribute(MODAL_TOOLTIP_PREFIX_CLASS_ATTR) === true ? modalTooltipLauncher.getAttribute(MODAL_TOOLTIP_PREFIX_CLASS_ATTR) + '-' : '';
                    let modalTooltipText = modalTooltipLauncher.hasAttribute(MODAL_TOOLTIP_TEXT_ATTR) === true ? modalTooltipLauncher.getAttribute(MODAL_TOOLTIP_TEXT_ATTR) : '';
                    let modalTooltipContentId = modalTooltipLauncher.hasAttribute(MODAL_TOOLTIP_CONTENT_ID_ATTR) === true ? modalTooltipLauncher.getAttribute(MODAL_TOOLTIP_CONTENT_ID_ATTR) : '';
                    let modalTooltipTitle = modalTooltipLauncher.hasAttribute(MODAL_TOOLTIP_TITLE_ATTR) === true ? modalTooltipLauncher.getAttribute(MODAL_TOOLTIP_TITLE_ATTR) : '';
                    let modalTooltipCloseText = modalTooltipLauncher.hasAttribute(MODAL_TOOLTIP_CLOSE_TEXT_ATTR) === true ? modalTooltipLauncher.getAttribute(MODAL_TOOLTIP_CLOSE_TEXT_ATTR) : '';
                    let modalTooltipCloseTitle = modalTooltipLauncher.hasAttribute(MODAL_TOOLTIP_CLOSE_TITLE_ATTR) === true ? modalTooltipLauncher.getAttribute(MODAL_TOOLTIP_CLOSE_TITLE_ATTR) : modalTooltipCloseText;
                    let modalTooltipCloseImgPath = modalTooltipLauncher.hasAttribute(MODAL_TOOLTIP_CLOSE_IMG_ATTR) === true ? modalTooltipLauncher.getAttribute(MODAL_TOOLTIP_CLOSE_IMG_ATTR) : '';

                    let modalTooltip = findById(MODAL_TOOLTIP_DIALOG_JS_ID);
                    // if already a modal tooltip opened, we close it
                    if (modalTooltip) {
                        // get launcher
                        let modalTooltipButtonClose = findById(MODAL_TOOLTIP_BUTTON_JS_ID);
                        let modalTooltipContent = findById(MODAL_TOOLTIP_CONTENT_JS_ID) ? findById(MODAL_TOOLTIP_CONTENT_JS_ID).innerHTML : '';
                        let modalTooltipFocusBackId = modalTooltipButtonClose.getAttribute(MODAL_TOOLTIP_BUTTON_FOCUS_BACK_ID);
                        let modalTooltipLauncher = findById(modalTooltipFocusBackId);
                        let contentBackId = modalTooltipButtonClose.getAttribute(MODAL_TOOLTIP_BUTTON_CONTENT_BACK_ID);

                        // remove modal tooltip
                        closeModalTooltip({
                            modalTooltip: modalTooltip,
                            modalTooltipContent: modalTooltipContent,
                            modalTooltipFocusBackId: modalTooltipFocusBackId,
                            contentBackId: contentBackId
                        });

                        // remove active class on launcher
                        removeClass(modalTooltipLauncher, MODAL_TOOLTIP_IS_ACTIVE_CLASS);

                    }

                    // insert modal
                    // Chrome bug
                    setTimeout(function() {
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
                    setTimeout(function() {
                        // give focus to close button
                        let closeButton = findById(MODAL_TOOLTIP_BUTTON_JS_ID)
                        closeButton.focus();
                    }, 51);

                    // add class is-active to launcher
                    addClass(modalTooltipLauncher, MODAL_TOOLTIP_IS_ACTIVE_CLASS);

                    e.preventDefault();

                }


                // click on close button
                let parentButton = searchParent(e.target, MODAL_TOOLTIP_BUTTON_JS_CLASS);
                if (
                    (
                        e.target.getAttribute('id') === MODAL_TOOLTIP_BUTTON_JS_ID || parentButton !== ''
                    ) &&
                    eventName === 'click'
                ) {
                    let modalTooltip = findById(MODAL_TOOLTIP_DIALOG_JS_ID);
                    let modalTooltipContent = findById(MODAL_TOOLTIP_CONTENT_JS_ID) ? findById(MODAL_TOOLTIP_CONTENT_JS_ID).innerHTML : '';
                    let modalTooltipButtonClose = findById(MODAL_TOOLTIP_BUTTON_JS_ID);
                    let modalTooltipFocusBackId = modalTooltipButtonClose.getAttribute(MODAL_TOOLTIP_BUTTON_FOCUS_BACK_ID);
                    let modalTooltipLauncher = findById(modalTooltipFocusBackId);
                    let contentBackId = modalTooltipButtonClose.getAttribute(MODAL_TOOLTIP_BUTTON_CONTENT_BACK_ID);

                    closeModalTooltip({
                        modalTooltip: modalTooltip,
                        modalTooltipContent: modalTooltipContent,
                        modalTooltipFocusBackId: modalTooltipFocusBackId,
                        contentBackId: contentBackId,
                        fromId: e.target.getAttribute('id')
                    });

                    // remove class is-active on launcher and give focus to it
                    removeClass(modalTooltipLauncher, MODAL_TOOLTIP_IS_ACTIVE_CLASS);
                    modalTooltipLauncher.focus();
                }

                let parentModalTooltip = searchParent(e.target, MODAL_TOOLTIP_DIALOG_JS_CLASS);
                let modalTooltip = findById(MODAL_TOOLTIP_DIALOG_JS_ID);
                // click anywhere outside modal tooltip when it is opened
                if (
                    modalTooltip && eventName === 'click' && // click anywhere with a modal tooltip opened
                    (e.target.getAttribute('id') !== MODAL_TOOLTIP_DIALOG_JS_ID && parentModalTooltip === '') // not a click in modal tooltip
                ) {
                    let modalTooltipButtonClose = findById(MODAL_TOOLTIP_BUTTON_JS_ID);

                    modalTooltipButtonClose.click();
                    if (hasClass(e.target, MODAL_TOOLTIP_IS_ACTIVE_CLASS) === true) {
                        e.preventDefault();
                    }

                }

                // strike a key when modal tooltip opened
                if (modalTooltip && eventName === 'keydown') {
                    let modalTooltipContent = findById(MODAL_TOOLTIP_CONTENT_JS_ID) ? findById(MODAL_TOOLTIP_CONTENT_JS_ID).innerHTML : '';
                    let modalTooltipButtonClose = findById(MODAL_TOOLTIP_BUTTON_JS_ID);
                    let modalTooltipFocusBackId = modalTooltipButtonClose.getAttribute(MODAL_TOOLTIP_BUTTON_FOCUS_BACK_ID);
                    let contentBackId = modalTooltipButtonClose.getAttribute(MODAL_TOOLTIP_BUTTON_CONTENT_BACK_ID);
                    let modalTooltipLauncher = findById(modalTooltipFocusBackId);
                    let $listFocusables = [].slice.call(modalTooltip.querySelectorAll(FOCUSABLE_ELEMENTS_STRING));

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

    const onLoad = () => {
        attach();
        document.removeEventListener('DOMContentLoaded', onLoad);
    }

    document.addEventListener('DOMContentLoaded', onLoad);

    window.van11yAccessibleModalTooltipAria = attach;


})(document);