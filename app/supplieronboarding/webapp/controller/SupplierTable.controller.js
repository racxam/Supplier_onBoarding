
sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("com.sumo.supplieronboarding.controller.SupplierTable", {
        onInit: function() {
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