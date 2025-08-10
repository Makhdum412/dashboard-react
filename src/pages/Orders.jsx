import React, { useState, useMemo } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';

import { ordersData, contextMenuItems, ordersGrid } from '../data/dummy';
import { Header, Button } from '../components';

const Orders = () => {
  const editing = { allowDeleting: true, allowEditing: true };
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [customerSearch, setCustomerSearch] = useState('');

  // Get unique values for filters
  const uniqueStatuses = useMemo(() => ['All', ...Array.from(new Set(ordersData.map(order => order.Status)))], []);
  const uniqueLocations = useMemo(() => ['All', ...Array.from(new Set(ordersData.map(order => order.Location)))], []);

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return ordersData.filter(order => {
      // Status filter
      if (statusFilter !== 'All' && order.Status !== statusFilter) return false;
      
      // Location filter
      if (locationFilter !== 'All' && order.Location !== locationFilter) return false;
      
      // Amount range filter
      if (amountRange.min && order.TotalAmount < parseFloat(amountRange.min)) return false;
      if (amountRange.max && order.TotalAmount > parseFloat(amountRange.max)) return false;
      
      // Customer name search
      if (customerSearch && !order.CustomerName.toLowerCase().includes(customerSearch.toLowerCase())) return false;
      
      return true;
    });
  }, [statusFilter, locationFilter, amountRange, customerSearch]);

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('All');
    setLocationFilter('All');
    setAmountRange({ min: '', max: '' });
    setCustomerSearch('');
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Orders" />
      
      {/* Filters Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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

          {/* Amount Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
            <div className="flex gap-2">
              <TextBoxComponent
                placeholder="Min"
                value={amountRange.min}
                change={(e) => setAmountRange(prev => ({ ...prev, min: e.value }))}
                cssClass="w-full"
                type="number"
              />
              <TextBoxComponent
                placeholder="Max"
                value={amountRange.max}
                change={(e) => setAmountRange(prev => ({ ...prev, max: e.value }))}
                cssClass="w-full"
                type="number"
              />
            </div>
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
            Showing {filteredData.length} of {ordersData.length} orders
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

      {/* Orders Grid */}
      <GridComponent
        id="gridcomp"
        dataSource={filteredData}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        contextMenuItems={contextMenuItems}
        editSettings={editing}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {ordersGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport]} />
      </GridComponent>
    </div>
  );
};

export default Orders;
