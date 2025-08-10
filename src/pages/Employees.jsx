import React, { useState, useMemo } from 'react';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, Search, Page, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';

import { employeesData, employeesGrid } from '../data/dummy';
import { Header, Button } from '../components';

const Employees = () => {
  const toolbarOptions = ['Search'];
  const editing = { allowDeleting: true, allowEditing: true };

  // Filter states
  const [titleFilter, setTitleFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [reportsToFilter, setReportsToFilter] = useState('All');
  const [nameSearch, setNameSearch] = useState('');

  // Get unique values for filters
  const uniqueTitles = useMemo(() => ['All', ...Array.from(new Set(employeesData.map(emp => emp.Title)))], []);
  const uniqueCountries = useMemo(() => ['All', ...Array.from(new Set(employeesData.map(emp => emp.Country)))], []);
  const uniqueReportsTo = useMemo(() => ['All', ...Array.from(new Set(employeesData.map(emp => emp.ReportsTo)))], []);

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return employeesData.filter(employee => {
      // Title filter
      if (titleFilter !== 'All' && employee.Title !== titleFilter) return false;
      
      // Country filter
      if (countryFilter !== 'All' && employee.Country !== countryFilter) return false;
      
      // Reports To filter
      if (reportsToFilter !== 'All' && employee.ReportsTo !== reportsToFilter) return false;
      
      // Name search
      if (nameSearch && !employee.Name.toLowerCase().includes(nameSearch.toLowerCase())) return false;
      
      return true;
    });
  }, [titleFilter, countryFilter, reportsToFilter, nameSearch]);

  // Clear all filters
  const clearFilters = () => {
    setTitleFilter('All');
    setCountryFilter('All');
    setReportsToFilter('All');
    setNameSearch('');
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Employees" />
      
      {/* Filters Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Title Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <DropDownListComponent
              dataSource={uniqueTitles}
              value={titleFilter}
              change={(e) => setTitleFilter(e.value)}
              placeholder="Select Title"
              cssClass="w-full"
            />
          </div>

          {/* Country Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <DropDownListComponent
              dataSource={uniqueCountries}
              value={countryFilter}
              change={(e) => setCountryFilter(e.value)}
              placeholder="Select Country"
              cssClass="w-full"
            />
          </div>

          {/* Reports To Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reports To</label>
            <DropDownListComponent
              dataSource={uniqueReportsTo}
              value={reportsToFilter}
              change={(e) => setReportsToFilter(e.value)}
              placeholder="Select Manager"
              cssClass="w-full"
            />
          </div>

          {/* Name Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name Search</label>
            <TextBoxComponent
              placeholder="Search employee..."
              value={nameSearch}
              change={(e) => setNameSearch(e.value)}
              cssClass="w-full"
            />
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredData.length} of {employeesData.length} employees
          </div>
          <Button
            text="Clear Filters"
            onClick={clearFilters}
            bgColor="#03C9D7"
            color="white"
            borderRadius="10px"
            size="md"
            width="auto"
          />
        </div>
      </div>

      {/* Employees Grid */}
      <GridComponent
        dataSource={filteredData}
        width="auto"
        allowPaging
        allowSorting
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        toolbar={toolbarOptions}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {employeesGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Search, Page, Sort, Filter]} />
      </GridComponent>
    </div>
  );
};

export default Employees;
