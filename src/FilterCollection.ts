import { FilterMenu } from './FilterMenu'
import debounce from './Debounce'

export class FilterCollection {

  filterMenus:  Array<FilterMenu>;
  rows:         Array<Element>;
  ths:          Array<Element>;
  table:        Element;
  tbody:        Element;
  options:      Options;
  target:       JQuery;

  constructor (target: JQuery, options: Options) {
    this.target = target;
    this.options = options;
    this.ths = target.find('th' + options.columnSelector).toArray()
    this.filterMenus = this.ths.map((th: HTMLElement, index: number) => {
      let column = $(th).index();
      return new FilterMenu(target, th, column, index, options, this);
    });
    this.rows = target.find('tbody').find('tr').toArray();
    this.table = target.get(0);
    this.tbody = target.find('tbody').get(0);
  }

  public initialize(): void {
    this.filterMenus.forEach(function(filterMenu) {
      filterMenu.initialize();
    });
    this.bind();
  }

  public bind(): void {
    this.bindCheckboxes();
    this.bindSelectAllCheckboxes();
    this.bindSort();
    this.bindSearch();
    this.target.find('.needs-binding').removeClass('needs-binding');
  }

  private bindCheckboxes(): void {
    let filterMenus = this.filterMenus;
    let rows = this.rows;
    let tbody = this.tbody;
    let ths = this.ths;
    let updateRowVisibility = this.updateRowVisibility;
    this.target.find('.needs-binding .dropdown-filter-menu-item.item').change(function() {
      let index = $(this).data('index');
      let value = $(this).val();
      filterMenus[index].updateSelectAll();
      updateRowVisibility(filterMenus, rows, ths, tbody);
    });
  }

  private bindSelectAllCheckboxes(): void {
    let filterMenus = this.filterMenus;
    let rows = this.rows;
    let tbody = this.tbody;
    let ths = this.ths;
    let updateRowVisibility = this.updateRowVisibility;
    this.target.find('.needs-binding .dropdown-filter-menu-item.select-all').change(function() {
      let index = $(this).data('index');
      let value = this.checked;
      filterMenus[index].selectAllUpdate(value);
      updateRowVisibility(filterMenus, rows, ths, tbody);
    });
  }

  private bindSort(): void {
    let filterMenus = this.filterMenus;
    let rows = this.rows;
    let tbody = this.tbody;
    let ths = this.ths;
    let sort = this.sort;
    let table = this.table;
    let options = this.options;
    let updateRowVisibility = this.updateRowVisibility;
    this.target.find('.needs-binding .dropdown-filter-sort').click(function() {
      let $sortElement = $(this).find('span');
      let column = $sortElement.data('column');
      let order = $sortElement.attr('class');
      sort(column, order, table, options);
      updateRowVisibility(filterMenus, rows, ths, tbody);
    });
  }

  private bindSearch(): void {
    let filterMenus = this.filterMenus;
    let rows = this.rows;
    let tbody = this.tbody;
    let ths = this.ths;
    let updateRowVisibility = this.updateRowVisibility;
    const handler = function() {
      let $input = $(this).find('input');
      let index = $input.data('index');
      let value = $input.val();
      filterMenus[index].searchToggle(value);
      updateRowVisibility(filterMenus, rows, ths, tbody);
    };
    const debouncedHandler = debounce(handler);
    this.target.find('.needs-binding .dropdown-filter-search').keyup(debouncedHandler);
  }

  private updateRowVisibility(filterMenus: Array<FilterMenu>, rows: Array<Element>, ths: Array<Element>, tbody:Element): void {
    let showRows = rows;
    let hideRows: Array<Element> = [];
    let selectedLists = filterMenus.map(function(filterMenu) {
      return {
        column: filterMenu.column,
        selected: new Set(filterMenu.inputs
          .filter(function(input: HTMLInputElement) {
            return input.checked
          }).map(function(input: HTMLInputElement) {
            return input.value.trim().replace(/ *\(\d+\)$/g,'');
          }))
      };
    });
    if (rows.length > 100)
      $(tbody).hide();
    for (let i=0; i < rows.length; i++) {
      let tds = rows[i].children;
      let found : boolean = true
      for (let j=0; j < selectedLists.length; j++) {
        let content = (tds[selectedLists[j].column] as HTMLElement).innerText.trim().replace(/ *$/g,'')
        if (!selectedLists[j].selected.has(content)) {
          $(rows[i]).hide();
          found = false
          break;
        }
      }
      if (found)
        $(rows[i]).show();
    }
    if (rows.length > 100)
      $(tbody).show();
  }

  private sort(column: number, order: string, table: Element, options: Options): void {
    let flip = 1;
    if (order === options.captions.z_to_a.toLowerCase().split(' ').join('-')) flip = -1;
    const tbody = table.querySelector('tbody');
    let stringFound = false;
    const rows = Array.from(tbody.querySelectorAll('tr'))
    .map(el => el as HTMLElement)
    .map(el => {
      let str = (el.children[column] as HTMLElement).innerText.toLowerCase();
      let nr = Number(str);
      if (!stringFound) {
        if (isNaN(nr)) stringFound = true;
      }
      return { el, nr, str };
    }).sort((a, b) => {
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


}
