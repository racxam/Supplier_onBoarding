/*global QUnit*/

sap.ui.define([
	"comsumo/processtask-ui-module/controller/processtaskui.controller"
], function (Controller) {
	"use strict";

	QUnit.module("processtaskui Controller");

	QUnit.test("I should test the processtaskui controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
