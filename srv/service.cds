using {dbmedia as db} from '../db/schema';
using {common.db as common} from '../db/master';

service Attachments {


    //transctions
    entity SReqattachmentsSrv        as projection on db.transcation.sreq_attachments;
    entity SOnBoardingattachmentsSrv as projection on db.transcation.sonboard_attachments;

    @cds.redirection.target
    entity supplierReqSrv            as projection on db.transcation.supplier_request;

    entity SavingsupplierReqSrv      as projection on db.transcation.supplier_request;
    entity supplierOnBoardingSrv     as projection on db.transcation.supplier_on_boarding;
    //master
    entity departmentsSrv            as projection on common.master.departments;
    entity SupplierSpendTypeSrv      as projection on common.master.SupplierSpendType;
    entity NatureOfActivitySrv       as projection on common.master.NatureOfActivity;
    entity SectorSrv                 as projection on common.master.Sector;


};