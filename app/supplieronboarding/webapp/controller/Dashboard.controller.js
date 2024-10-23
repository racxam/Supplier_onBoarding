sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Icon",
    "sap/m/Link",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    function (Controller, MessageToast, MessageBox, Filter, FilterOperator, Icon, JSONModel, Fragment, Dialog, Button, Text) {
        "use strict";

        return Controller.extend("com.sumo.supplieronboarding.controller.Dashboard", {
            onInit: function () {
            },
            onSearch: function () {
                var oFilterBar = this.getView().byId("filterbar");
                var aFilters = [];
                var aFilterItems = oFilterBar.getFilterGroupItems();
                aFilterItems.forEach(function (oFilterItem) {
                  var sName = oFilterItem.getName(); 
                  var oControl = oFilterItem.getControl(); 
           
                  if (oControl instanceof sap.m.MultiComboBox) {
                    var aSelectedKeys = oControl.getSelectedKeys();
           
                    if (aSelectedKeys.length > 0) {

                      var aFieldFilters = aSelectedKeys.map(function (sKey) {
                        return new Filter(sName, FilterOperator.EQ, sKey); 
                      });
                      aFilters.push(new Filter(aFieldFilters, false)); 
                    }
                  }
                });
           
                var oTable = this.getView().byId("table");
                if (oTable) {
                  var oBinding = oTable.getBinding("items");
                  if (oBinding) {
                    oBinding.filter(aFilters.length > 0 ? aFilters : null); 
                    console.error("Table binding not found.");
                  }
                } else {
                  console.error("Table not found.");
                }
              },
           
              onFilterChange: function (oEvent) {
                this.onSearch();
              },
           
             

            onFilterStatusChange: function (oEvent) {
              var aSelectedStatuses = this.byId("filterstatusid").getSelectedKeys();
              var aSelectedType = this.byId("ComboBoxSpendsTypesID").getSelectedKeys();
              var oTable = this.byId("table"),
                  oBinding = oTable.getBinding("items"),
                  aFilters = [];

              if (aSelectedStatuses && aSelectedStatuses.length > 0) {
                  var aStatusFilters = aSelectedStatuses.map(function (sStatus) {
                      return new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, sStatus);
                  });
        
                  aFilters.push(new sap.ui.model.Filter({
                      filters: aStatusFilters,
                      and: false 
                  }));
              }
              if (aSelectedType && aSelectedType.length > 0) {
                var aStatusType = aSelectedType.map(function (sType) {
                    return new sap.ui.model.Filter("SpendType", sap.ui.model.FilterOperator.EQ, sType);
                });
      
                aFilters.push(new sap.ui.model.Filter({
                    filters: aStatusType,
                    and: false 
                }));
            }

              oBinding.filter(aFilters);
          },
              onCreateRequest: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RequestForm");
              },
           
              onFormsubmit: function () {
              },
           
              oCreateEmp:function()
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