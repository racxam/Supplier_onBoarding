
sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(Controller) {
      "use strict";
  
      return Controller.extend("com.sumo.supplieronboarding.controller.SupplierTable2", {
        onInit: function () {
          // Create an OData model instance
          var oModel = this.getOwnerComponent().getModel();
    
          // Set the OData model to the view
          this.getView().setModel(oModel);
        },
    
        onSearch: function (oEvent) {
          // Implement any search logic if necessary
        },
    
        onFilterChange: function (oEvent) {
          // Implement any filter change logic if necessary
        },
    
        onSelectionChange: function (oEvent) {
          // Handle selection change in MultiComboBox
        },
        onCreateRequest: function () {
          // Get the router instance
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          // Navigate to the "Requestcreateform" view (assuming it's defined in your routes)
          oRouter.navTo("RequestForm");
      }
      });
    }
  );
