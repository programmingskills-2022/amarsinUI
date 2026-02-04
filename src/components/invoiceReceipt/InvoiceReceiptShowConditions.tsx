import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SearchItem, TableColumns } from "../../types/general";
import InvoiceReceipShowHeader from "./InvoiceReceipShowHeader";
import Button from "../controls/Button";
import ConfirmCard from "../layout/ConfirmCard";
import { handleExport } from "../../utilities/ExcelExport";
import { convertToFarsiDigits } from "../../utilities/general";
import { useCustomers } from "../../hooks/useCustomers";
import {  IndentDtl } from "../../types/purchaseRequest";
import { Fields } from "./InvoiceReceiptShow1";

type Props = {
    canEditForm: boolean
    fields: Fields
    setFields: Dispatch<SetStateAction<Fields>>
    salesPricesSearchResponse: SearchItem[]
    handleSubmitAndAddToTable: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, productId?: number) => Promise<void>
    indentListDtl: IndentDtl[]

}
const InvoiceReceiptShowConditions = ({ canEditForm, fields, setFields, salesPricesSearchResponse, handleSubmitAndAddToTable, indentListDtl }: Props) => {
    const { customers } = useCustomers();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileName = "data_export.xlsx";
    //for excel data
    const [excelData, setExcelData] = useState<any[]>([]);
    //for excel head cells
    const excelHeadCells: TableColumns = [
        {
            Header: "ردیف",
            accessor: "index",
        },
        {
            Header: "برند",
            accessor: "bName",
        },
        {
            Header: "کد کالا",
            accessor: "productCode",
        },
        {
            Header: "نام کالا",
            accessor: "product",
        },
        {
            Header: "تعداد",
            accessor: "cnt",
        },
        {
            Header: "آفر",
            accessor: "offer",
        },
        {
            Header: "مبلغ",
            accessor: "cost",
        },
        {
            Header: "تخفیف",
            accessor: "dcrmnt",
        },
        {
            Header: "مالیات",
            accessor: "taxValue",
        },
        {
            Header: "جمع",
            accessor: "total",
        },
        {
            Header: "شرح",
            accessor: "dtlDsc",
        },
    ];

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (isModalOpen) {
            timeoutId = setTimeout(() => {
                setIsModalOpen(false);
            }, 3000);
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isModalOpen]);
    useEffect(() => {
        //console.log(indentMrsResponse, "indentMrsResponse")
        const tempData = indentListDtl?.map(
            (dtl, index) => {
                return {
                    index: index + 1,
                    bName: convertToFarsiDigits(dtl.bName),
                    productCode: convertToFarsiDigits(dtl.productCode),
                    product: convertToFarsiDigits(dtl.product),
                    cnt: dtl.cnt,
                    offer: dtl.offer,
                    cost: dtl.cost,
                    dcrmnt: dtl.dcrmnt,
                    taxValue: dtl.taxValue,
                    total: dtl.total,
                    dtlDsc: dtl.dtlDsc,
                };
            }
        );
        setExcelData(tempData);
    }, [indentListDtl]);
    return (
        <>
            <InvoiceReceipShowHeader
                customers={customers}
                canEditForm={canEditForm}
                fields={fields}
                setFields={setFields}
                salesPricesSearchResponse={salesPricesSearchResponse}
            />
            <ConfirmCard variant="flex-row gap-2 rounded-bl-md rounded-br-md justify-end">
                {canEditForm && (
                    <Button
                        text="ایجاد لیست"
                        backgroundColor="bg-white"
                        color="text-blue-500"
                        backgroundColorHover="bg-blue-500"
                        colorHover="text-white"
                        variant="shadow-lg"
                        onClick={handleSubmitAndAddToTable}
                    />
                )}
                <Button
                    text="اکسل"
                    backgroundColor="bg-white"
                    color="text-green-500"
                    backgroundColorHover="bg-green-500"
                    colorHover="text-white"
                    variant="shadow-lg"
                    onClick={() =>
                        handleExport({
                            data: excelData,
                            setIsModalOpen,
                            headCells: excelHeadCells,
                            fileName,
                            hasPersianTitle: true,
                        })
                    }
                />
            </ConfirmCard>
        </>
    )
}
export default InvoiceReceiptShowConditions;