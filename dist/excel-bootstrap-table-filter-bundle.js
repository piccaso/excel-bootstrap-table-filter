(function ($$1) {
'use strict';

$$1 = 'default' in $$1 ? $$1['default'] : $$1;

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var FilterMenu = function () {
    function FilterMenu(target, th, column, index, options) {
        classCallCheck(this, FilterMenu);

        this.options = options;
        this.th = th;
        this.column = column;
        this.index = index;
        this.tds = target.find('tbody tr td:nth-child(' + (this.column + 1) + ')').toArray();
    }

    createClass(FilterMenu, [{
        key: 'initialize',
        value: function initialize() {
            this.menu = this.dropdownFilterDropdown();
            this.th.appendChild(this.menu);
            var $trigger = $(this.menu.children[0]);
            var $content = $(this.menu.children[1]);
            var $menu = $(this.menu);
            $trigger.click(function () {
                return $content.toggle();
            });
            $(document).click(function (el) {
                if (!$menu.is(el.target) && $menu.has(el.target).length === 0) {
                    $content.hide();
                }
            });
        }
    }, {
        key: 'searchToggle',
        value: function searchToggle(value) {
            if (this.selectAllCheckbox instanceof HTMLInputElement) this.selectAllCheckbox.checked = false;
            if (value.length === 0) {
                this.toggleAll(true);
                if (this.selectAllCheckbox instanceof HTMLInputElement) this.selectAllCheckbox.checked = true;
                return;
            }
            this.toggleAll(false);
            this.inputs.filter(function (input) {
                return input.value.toLowerCase().indexOf(value.toLowerCase()) > -1;
            }).forEach(function (input) {
                input.checked = true;
            });
        }
    }, {
        key: 'updateSelectAll',
        value: function updateSelectAll() {
            if (this.selectAllCheckbox instanceof HTMLInputElement) {
                $(this.searchFilter).val('');
                this.selectAllCheckbox.checked = this.inputs.length === this.inputs.filter(function (input) {
                    return input.checked;
                }).length;
            }
        }
    }, {
        key: 'selectAllUpdate',
        value: function selectAllUpdate(checked) {
            $(this.searchFilter).val('');
            this.toggleAll(checked);
        }
    }, {
        key: 'toggleAll',
        value: function toggleAll(checked) {
            for (var i = 0; i < this.inputs.length; i++) {
                var input = this.inputs[i];
                if (input instanceof HTMLInputElement) input.checked = checked;
            }
        }
    }, {
        key: 'dropdownFilterItem',
        value: function dropdownFilterItem(td, self) {
            var value = td.innerText;
            var dropdownFilterItem = document.createElement('div');
            dropdownFilterItem.className = 'dropdown-filter-item';
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.value = value.trim().replace(/ *$/g, '');
            input.setAttribute('checked', 'checked');
            input.className = 'dropdown-filter-menu-item item';
            input.setAttribute('data-column', self.column.toString());
            input.setAttribute('data-index', self.index.toString());
            dropdownFilterItem.appendChild(input);
            dropdownFilterItem.innerHTML = dropdownFilterItem.innerHTML.trim() + ' ' + value;
            return dropdownFilterItem;
        }
    }, {
        key: 'dropdownFilterItemSelectAll',
        value: function dropdownFilterItemSelectAll() {
            var value = this.options.captions.select_all;
            var dropdownFilterItemSelectAll = document.createElement('div');
            dropdownFilterItemSelectAll.className = 'dropdown-filter-item';
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.value = this.options.captions.select_all;
            input.setAttribute('checked', 'checked');
            input.className = 'dropdown-filter-menu-item select-all';
            input.setAttribute('data-column', this.column.toString());
            input.setAttribute('data-index', this.index.toString());
            dropdownFilterItemSelectAll.appendChild(input);
            dropdownFilterItemSelectAll.innerHTML = dropdownFilterItemSelectAll.innerHTML + ' ' + value;
            return dropdownFilterItemSelectAll;
        }
    }, {
        key: 'dropdownFilterSearch',
        value: function dropdownFilterSearch() {
            var dropdownFilterItem = document.createElement('div');
            dropdownFilterItem.className = 'dropdown-filter-search';
            var input = document.createElement('input');
            input.type = 'text';
            input.className = 'dropdown-filter-menu-search form-control';
            input.setAttribute('data-column', this.column.toString());
            input.setAttribute('data-index', this.index.toString());
            input.setAttribute('placeholder', this.options.captions.search);
            dropdownFilterItem.appendChild(input);
            return dropdownFilterItem;
        }
    }, {
        key: 'dropdownFilterSort',
        value: function dropdownFilterSort(direction) {
            var dropdownFilterItem = document.createElement('div');
            dropdownFilterItem.className = 'dropdown-filter-sort';
            var span = document.createElement('span');
            span.className = direction.toLowerCase().split(' ').join('-');
            span.setAttribute('data-column', this.column.toString());
            span.setAttribute('data-index', this.index.toString());
            span.innerText = direction;
            dropdownFilterItem.appendChild(span);
            return dropdownFilterItem;
        }
    }, {
        key: 'dropdownFilterContent',
        value: function dropdownFilterContent() {
            var _this = this;

            var self = this;
            var dropdownFilterContent = document.createElement('div');
            dropdownFilterContent.className = 'dropdown-filter-content';
            var stringFound = false;
            var count = {};
            var innerDivs = this.tds.reduce(function (arr, el) {
                var elt = el.innerText.trim();
                if (count[elt] === undefined) {
                    var elc = el.cloneNode(true);
                    arr.push(elc);
                    count[elt] = 1;
                } else {
                    count[elt] += 1;
                }
                return arr;
            }, []).map(function (v) {
                v.innerText += ' (' + String(count[v.innerText.trim()]) + ')';
                var str = v.innerText.toLowerCase();
                var nr = Number(str);
                if (!stringFound) {
                    if (isNaN(nr)) stringFound = true;
                }
                return { el: v, str: str, nr: nr };
            }).sort(function (a, b) {
                if (stringFound) {
                    if (a.str < b.str) return -1;
                    if (a.str > b.str) return 1;
                } else {
                    if (a.nr < b.nr) return -1;
                    if (a.nr > b.nr) return 1;
                }
                return 0;
            }).map(function (td) {
                return _this.dropdownFilterItem(td.el, self);
            });
            this.inputs = innerDivs.map(function (div) {
                return div.firstElementChild;
            });
            var selectAllCheckboxDiv = this.dropdownFilterItemSelectAll();
            this.selectAllCheckbox = selectAllCheckboxDiv.firstElementChild;
            innerDivs.unshift(selectAllCheckboxDiv);
            var searchFilterDiv = this.dropdownFilterSearch();
            this.searchFilter = searchFilterDiv.firstElementChild;
            var outerDiv = innerDivs.reduce(function (outerDiv, innerDiv) {
                outerDiv.appendChild(innerDiv);
                return outerDiv;
            }, document.createElement('div'));
            outerDiv.className = 'checkbox-container';
            var elements = [];
            if (this.options.sort) elements = elements.concat([this.dropdownFilterSort(this.options.captions.a_to_z), this.dropdownFilterSort(this.options.captions.z_to_a)]);
            if (this.options.search) elements.push(searchFilterDiv);
            return elements.concat(outerDiv).reduce(function (html, el) {
                html.appendChild(el);
                return html;
            }, dropdownFilterContent);
        }
    }, {
        key: 'dropdownFilterDropdown',
        value: function dropdownFilterDropdown() {
            var _this2 = this;

            var dropdownFilterDropdown = document.createElement('div');
            dropdownFilterDropdown.className = 'dropdown-filter-dropdown';
            var arrow = document.createElement('span');
            arrow.className = 'glyphicon glyphicon-arrow-down dropdown-filter-icon';
            var icon = document.createElement('i');
            icon.className = 'arrow-down';
            arrow.appendChild(icon);
            dropdownFilterDropdown.appendChild(arrow);
            var dropdownFilterContent = this.dropdownFilterContent();
            dropdownFilterDropdown.appendChild(dropdownFilterContent);
            var updateFn = function updateFn() {
                dropdownFilterContent.innerHTML = _this2.dropdownFilterContent().innerHTML;
            };
            dropdownFilterContent.setAttribute("hasRefresh", "hasRefresh");
            dropdownFilterContent.refresh = updateFn;
            dropdownFilterContent.addEventListener("refresh", updateFn);
            if ($(this.th).hasClass('no-sort')) {
                $(dropdownFilterDropdown).find('.dropdown-filter-sort').remove();
            }
            if ($(this.th).hasClass('no-filter')) {
                $(dropdownFilterDropdown).find('.checkbox-container').remove();
            }
            if ($(this.th).hasClass('no-search')) {
                $(dropdownFilterDropdown).find('.dropdown-filter-search').remove();
            }
            return dropdownFilterDropdown;
        }
    }]);
    return FilterMenu;
}();

function debounce(fn) {
    var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 600;

    var timeoutId = void 0;
    return function () {
        var _this = this;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
            return fn.apply(_this, args);
        }, ms);
    };
}

var FilterCollection = function () {
    function FilterCollection(target, options) {
        classCallCheck(this, FilterCollection);

        this.target = target;
        this.options = options;
        this.ths = target.find('th' + options.columnSelector).toArray();
        this.filterMenus = this.ths.map(function (th, index) {
            var column = $(th).index();
            return new FilterMenu(target, th, column, index, options);
        });
        this.rows = target.find('tbody').find('tr').toArray();
        this.table = target.get(0);
        this.tbody = target.find('tbody').get(0);
    }

    createClass(FilterCollection, [{
        key: 'initialize',
        value: function initialize() {
            this.filterMenus.forEach(function (filterMenu) {
                filterMenu.initialize();
            });
            this.bindCheckboxes();
            this.bindSelectAllCheckboxes();
            this.bindSort();
            this.bindSearch();
        }
    }, {
        key: 'bindCheckboxes',
        value: function bindCheckboxes() {
            var filterMenus = this.filterMenus;
            var rows = this.rows;
            var tbody = this.tbody;
            var ths = this.ths;
            var updateRowVisibility = this.updateRowVisibility;
            this.target.find('.dropdown-filter-menu-item.item').change(function () {
                var index = $(this).data('index');
                var value = $(this).val();
                filterMenus[index].updateSelectAll();
                updateRowVisibility(filterMenus, rows, ths, tbody);
            });
        }
    }, {
        key: 'bindSelectAllCheckboxes',
        value: function bindSelectAllCheckboxes() {
            var filterMenus = this.filterMenus;
            var rows = this.rows;
            var tbody = this.tbody;
            var ths = this.ths;
            var updateRowVisibility = this.updateRowVisibility;
            this.target.find('.dropdown-filter-menu-item.select-all').change(function () {
                var index = $(this).data('index');
                var value = this.checked;
                filterMenus[index].selectAllUpdate(value);
                updateRowVisibility(filterMenus, rows, ths, tbody);
            });
        }
    }, {
        key: 'bindSort',
        value: function bindSort() {
            var filterMenus = this.filterMenus;
            var rows = this.rows;
            var tbody = this.tbody;
            var ths = this.ths;
            var sort = this.sort;
            var table = this.table;
            var options = this.options;
            var updateRowVisibility = this.updateRowVisibility;
            this.target.find('.dropdown-filter-sort').click(function () {
                var $sortElement = $(this).find('span');
                var column = $sortElement.data('column');
                var order = $sortElement.attr('class');
                sort(column, order, table, options);
                updateRowVisibility(filterMenus, rows, ths, tbody);
            });
        }
    }, {
        key: 'bindSearch',
        value: function bindSearch() {
            var filterMenus = this.filterMenus;
            var rows = this.rows;
            var tbody = this.tbody;
            var ths = this.ths;
            var updateRowVisibility = this.updateRowVisibility;
            var handler = function handler() {
                var $input = $(this).find('input');
                var index = $input.data('index');
                var value = $input.val();
                filterMenus[index].searchToggle(value);
                updateRowVisibility(filterMenus, rows, ths, tbody);
            };
            var debouncedHandler = debounce(handler);
            this.target.find('.dropdown-filter-search').keyup(debouncedHandler);
        }
    }, {
        key: 'updateRowVisibility',
        value: function updateRowVisibility(filterMenus, rows, ths, tbody) {
            var showRows = rows;
            var hideRows = [];
            var selectedLists = filterMenus.map(function (filterMenu) {
                return {
                    column: filterMenu.column,
                    selected: new Set(filterMenu.inputs.filter(function (input) {
                        return input.checked;
                    }).map(function (input) {
                        return input.value.trim().replace(/ *\(\d+\)$/g, '');
                    }))
                };
            });
            if (rows.length > 100) $(tbody).hide();
            for (var i = 0; i < rows.length; i++) {
                var tds = rows[i].children;
                var found = true;
                for (var j = 0; j < selectedLists.length; j++) {
                    var content = tds[selectedLists[j].column].innerText.trim().replace(/ *$/g, '');
                    if (!selectedLists[j].selected.has(content)) {
                        $(rows[i]).hide();
                        found = false;
                        break;
                    }
                }
                if (found) $(rows[i]).show();
            }
            if (rows.length > 100) $(tbody).show();
        }
    }, {
        key: 'sort',
        value: function sort(column, order, table, options) {
            var flip = 1;
            if (order === options.captions.z_to_a.toLowerCase().split(' ').join('-')) flip = -1;
            var tbody = table.querySelector('tbody');
            var stringFound = false;
            var rows = Array.from(tbody.querySelectorAll('tr')).map(function (el) {
                return el;
            }).map(function (el) {
                var str = el.children[column].innerText.toLowerCase();
                var nr = Number(str);
                if (!stringFound) {
                    if (isNaN(nr)) stringFound = true;
                }
                return { el: el, nr: nr, str: str };
            }).sort(function (a, b) {
                if (stringFound) {
                    if (a.str < b.str) return -1 * flip;
                    if (a.str > b.str) return 1 * flip;
                } else {
                    if (a.nr < b.nr) return -1 * flip;
                    if (a.nr > b.nr) return 1 * flip;
                }
                return 0;
            });
            for (var i = 0; i < rows.length; i++) {
                tbody.appendChild(rows[i].el);
            }
        }
    }]);
    return FilterCollection;
}();

$$1.fn.excelTableFilter = function (options) {
    var target = this;
    options = $$1.extend({}, $$1.fn.excelTableFilter.options, options);
    if (typeof options.columnSelector === 'undefined') options.columnSelector = '';
    if (typeof options.sort === 'undefined') options.sort = true;
    if (typeof options.search === 'undefined') options.search = true;
    if (typeof options.captions === 'undefined') options.captions = {
        a_to_z: 'A to Z',
        z_to_a: 'Z to A',
        search: 'Search',
        select_all: 'Select All'
    };
    var filterCollection = new FilterCollection(target, options);
    filterCollection.initialize();
    return target;
};
$$1.fn.excelTableFilter.options = {};

}(jQuery));
//# sourceMappingURL=excel-bootstrap-table-filter-bundle.js.map
