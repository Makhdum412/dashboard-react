import React, { useState, useMemo } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';

import { customersData, customersGrid } from '../data/dummy';
import { Header, Button } from '../components';

const Customers = () => {
  const selectionsettings = { persistSelection: true };
  const toolbarOptions = ['Delete'];
  const editing = { allowDeleting: true, allowEditing: true };

  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [budgetRange, setBudgetRange] = useState({ min: '', max: '' });
  const [projectSearch, setProjectSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  // Get unique values for filters
  const uniqueStatuses = useMemo(() => ['All', ...Array.from(new Set(customersData.map(customer => customer.Status)))], []);
  const uniqueLocations = useMemo(() => ['All', ...Array.from(new Set(customersData.map(customer => customer.Location)))], []);

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return customersData.filter(customer => {
      // Status filter
      if (statusFilter !== 'All' && customer.Status !== statusFilter) return false;
      
      // Location filter
      if (locationFilter !== 'All' && customer.Location !== locationFilter) return false;
      
      // Budget range filter (convert budget string to number)
      const budgetValue = parseFloat(customer.Budget.replace(/[^0-9.]/g, ''));
      if (budgetRange.min && budgetValue < parseFloat(budgetRange.min)) return false;
      if (budgetRange.max && budgetValue > parseFloat(budgetRange.max)) return false;
      
      // Project name search
      if (projectSearch && !customer.ProjectName.toLowerCase().includes(projectSearch.toLowerCase())) return false;
      
      // Customer name search
      if (customerSearch && !customer.CustomerName.toLowerCase().includes(customerSearch.toLowerCase())) return false;
      
      return true;
    });
  }, [statusFilter, locationFilter, budgetRange, projectSearch, customerSearch]);

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('All');
    setLocationFilter('All');
    setBudgetRange({ min: '', max: '' });
    setProjectSearch('');
    setCustomerSearch('');
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Customers" />
      
      {/* Filters Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <DropDownListComponent
              dataSource={uniqueStatuses}
              value={statusFilter}
              change={(e) => setStatusFilter(e.value)}
              placeholder="Select Status"
              cssClass="w-full"
            />
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <DropDownListComponent
              dataSource={uniqueLocations}
              value={locationFilter}
              change={(e) => setLocationFilter(e.value)}
              placeholder="Select Location"
              cssClass="w-full"
            />
          </div>

          {/* Budget Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range (k)</label>
            <div className="flex gap-2">
              <TextBoxComponent
                placeholder="Min"
                value={budgetRange.min}
                change={(e) => setBudgetRange(prev => ({ ...prev, min: e.value }))}
                cssClass="w-full"
                type="number"
              />
              <TextBoxComponent
                placeholder="Max"
                value={budgetRange.max}
                change={(e) => setBudgetRange(prev => ({ ...prev, max: e.value }))}
                cssClass="w-full"
                type="number"
              />
            </div>
          </div>

          {/* Project Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Search</label>
            <TextBoxComponent
              placeholder="Search project..."
              value={projectSearch}
              change={(e) => setProjectSearch(e.value)}
              cssClass="w-full"
            />
          </div>

          {/* Customer Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Search</label>
            <TextBoxComponent
              placeholder="Search customer..."
              value={customerSearch}
              change={(e) => setCustomerSearch(e.value)}
              cssClass="w-full"
            />
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredData.length} of {customersData.length} customers
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

      {/* Customers Grid */}
      <GridComponent
        dataSource={filteredData}
        enableHover={false}
        allowPaging
        pageSettings={{ pageCount: 5 }}
        selectionSettings={selectionsettings}
        toolbar={toolbarOptions}
        editSettings={editing}
        allowSorting
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {customersGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter]} />
      </GridComponent>
    </div>
  );
};

export default Customers;
