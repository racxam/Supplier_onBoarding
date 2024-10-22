sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
  "use strict";

  return Controller.extend("com.sumo.supplieronboarding.controller.SupplierTable", {
    onInit: function () {
      // Initialization logic can be placed here
    },

    onSearch: function () {
      var oFilterBar = this.getView().byId("filterbar"); // Get the FilterBar control
      var aFilters = []; // Array to hold the filters

      // Retrieve all filter group items
      var aFilterItems = oFilterBar.getFilterGroupItems();

      // Iterate over the filter items to get the selected values
      aFilterItems.forEach(function (oFilterItem) {
        var sName = oFilterItem.getName(); // Get the name of the filter
        var oControl = oFilterItem.getControl(); // Get the associated control

        // Only process MultiComboBox controls
        if (oControl instanceof sap.m.MultiComboBox) {
          var aSelectedKeys = oControl.getSelectedKeys(); // Get the selected keys

          if (aSelectedKeys.length > 0) {
            // Create filters based on the selected keys
            var aFieldFilters = aSelectedKeys.map(function (sKey) {
              return new Filter(sName, FilterOperator.EQ, sKey); // Use the filter name from the XML
            });
            aFilters.push(new Filter(aFieldFilters, false)); // Combine filters with OR condition
          }
        }
      });

      // Apply the filters to the table binding
      var oTable = this.getView().byId("table"); // Get the table control
      if (oTable) {
        var oBinding = oTable.getBinding("items"); // Get the items binding of the table
        if (oBinding) {
          oBinding.filter(aFilters.length > 0 ? aFilters : null); // Apply filters or null if none
        } else {
          console.error("Table binding not found.");
        }
      } else {
        console.error("Table not found.");
      }
    },

    onFilterChange: function (oEvent) {
      // Optionally, you can refresh the table or handle other logic on filter change
      this.onSearch(); // Call search again to reapply filters on change
    },

    onSelectionChange: function (oEvent) {
      // Check if selectedItem is available
      var oSelectedItem = oEvent.getParameter("selectedItem");
      if (oSelectedItem) {
        var selectedKey = oSelectedItem.getKey();
        var oBinding = this.getView().byId("table").getBinding("items");

        // Update the filter to use the correct property
        var oFilter = new Filter("SupplierId", FilterOperator.EQ, selectedKey);
        oBinding.filter([oFilter]);
      }
    },

    onCreateRequest: function () {
      // Get the router instance
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      // Navigate to the "Requestcreateform" view (assuming it's defined in your routes)
      oRouter.navTo("RequestForm");
    },

    onFormsubmit: function () {
      // Handle form submission logic
    },

    oCreateEmp:function() // FOR CREATING NEW RECORD ************
    {
        var UserName = sap.ui.getCore().byId('_IDGenInput2').getValue()
        var UserSalary = parseInt(sap.ui.getCore().byId('_IDGenInput3').getValue())
        var UserId=parseInt(sap.ui.getCore().byId('_IDGenInput1').getValue())
        var UserAge=parseInt(sap.ui.getCore().byId('_IDGenInput4').getValue())
        var UserCity=sap.ui.getCore().byId('_IDGenInput5').getValue()
          var oAddEmpData={}  
          oAddEmpData.Name=UserName
          oAddEmpData.Salary=UserSalary
          oAddEmpData.Id=UserId
          oAddEmpData.Age=UserAge
          oAddEmpData.City=UserCity
          this.getView().getModel().create("/ZUSERDATASet",oAddEmpData,{
            method:"POST",    
            success:function (data){
                MessageToast.show("Employee Created Successfully");
            },
            error: function (data){
                MessageToast.show(data);
            },
            });
    },
  });
});
